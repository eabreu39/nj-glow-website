import { siteConfig, serviceOptions } from "./site-config.js";

/**
 * DOM contract: #quote-form with name/email/address fields and optional phone/message,
 * name="services" checkboxes, and a hidden name="botcheck" checkbox.
 * #form-status, #quote-confirmation, and #request-summary are optional targets.
 * Import this module once; it initializes itself after the DOM is ready.
 * Pure exports below support checks without an external service.
 */
export function serializeQuoteEntries(entries) {
  const quote = { name: "", email: "", phone: "", address: "", services: [], message: "", botcheck: false };
  for (const [key, value] of entries) {
    const text = typeof value === "string" ? value.trim() : "";
    if ((key === "services" || key === "services[]") && serviceOptions.includes(text)) {
      if (!quote.services.includes(text)) quote.services.push(text);
    } else if (["name", "email", "phone", "address", "message"].includes(key)) {
      quote[key] = text;
    } else if (key === "botcheck") {
      quote.botcheck = Boolean(text) && text !== "false";
    }
  }
  return quote;
}

export function validateQuote(quote) {
  const errors = {};
  if (!quote.name) errors.name = "Please enter your name.";
  else if (quote.name.length > 150) errors.name = "Please use 150 characters or fewer for your name.";
  if (!quote.email) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quote.email) || quote.email.length > 254) {
    errors.email = "Please enter a valid email address.";
  }
  if (quote.phone) {
    const digits = quote.phone.replace(/\D/g, "");
    if (digits.length < 10 || digits.length > 15 || !/^[\d\s()+.\-]+$/.test(quote.phone)) {
      errors.phone = "Please enter a phone number with 10 to 15 digits.";
    }
  }
  if (!quote.address) errors.address = "Please enter the property address.";
  else if (quote.address.length > 400) errors.address = "Please use 400 characters or fewer for the address.";
  if (!quote.services.length) errors.services = "Please select at least one service.";
  if (quote.message.length > 5000) errors.message = "Please keep your project details under 5,000 characters.";
  return errors;
}

export function hasConfiguredAccessKey(config = siteConfig) {
  return /^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/i.test(config.web3formsAccessKey.trim());
}

export function createWeb3FormsPayload(quote, config = siteConfig) {
  return {
    access_key: config.web3formsAccessKey.trim(),
    subject: config.quoteSubject,
    from_name: `${config.businessName} website`,
    name: quote.name,
    email: quote.email,
    replyto: quote.email,
    phone: quote.phone,
    property_address: quote.address,
    services: quote.services.join(", "),
    message: quote.message || "No additional project details provided.",
    botcheck: quote.botcheck,
  };
}

export async function submitQuote(quote, config = siteConfig, fetchImpl = globalThis.fetch) {
  const errors = validateQuote(quote);
  if (Object.keys(errors).length) return { ok: false, type: "validation", errors };
  if (quote.botcheck) return { ok: false, type: "blocked" };
  if (!config.web3formsAccessKey.trim()) return { ok: true, type: "demo" };
  if (!hasConfiguredAccessKey(config)) return { ok: false, type: "configuration" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 15000);
  try {
    const response = await fetchImpl("https://api.web3forms.com/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(createWeb3FormsPayload(quote, config)),
      signal: controller.signal,
    });
    let result;
    try { result = await response.json(); } catch { return { ok: false, type: "service" }; }
    if (response.ok && result.success === true) return { ok: true, type: "accepted" };
    return { ok: false, type: response.status === 429 ? "limit" : "service" };
  } catch (error) {
    return { ok: false, type: error.name === "AbortError" ? "timeout" : "network" };
  } finally {
    clearTimeout(timer);
  }
}

export function initQuoteForm(root = document) {
  const form = root.getElementById("quote-form");
  if (!form || form.dataset.quoteInitialized === "true") return;
  form.dataset.quoteInitialized = "true";
  form.noValidate = true;
  const status = root.getElementById("form-status");
  const confirmation = root.getElementById("quote-confirmation");
  const summary = root.getElementById("request-summary");
  const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
  const originalButtonText = submitButton?.tagName === "INPUT" ? submitButton.value : submitButton?.textContent;
  let pending = false;
  let completedFingerprint = "";
  let attempted = false;

  const formNote = root.querySelector('.form-note');
  if (formNote && hasConfiguredAccessKey()) {
    formNote.textContent = 'NJ Glow will use these details to follow up about your request.';
  }

  if (status) {
    status.setAttribute("role", "status");
    status.setAttribute("aria-live", "polite");
    status.setAttribute("aria-atomic", "true");
  }
  if (confirmation) {
    confirmation.hidden = true;
    confirmation.setAttribute("tabindex", "-1");
    confirmation.setAttribute("role", "status");
  }

  function setStatus(message, type = "") {
    if (!status) return;
    status.textContent = message;
    status.dataset.state = type;
  }

  function controlsFor(name) {
    return Array.from(form.querySelectorAll(`[name="${name}"], [name="${name}[]"]`));
  }

  function renderErrors(errors, focusFirst = false) {
    for (const name of ["name", "email", "phone", "address", "services", "message"]) {
      const controls = controlsFor(name);
      if (!controls.length) continue;
      const id = `quote-${name}-error`;
      let error = root.getElementById(id);
      if (!error && errors[name]) {
        error = root.createElement("p");
        error.id = id;
        error.className = "field-error";
        const anchor = name === "services" ? controls[0].closest("fieldset") : null;
        if (anchor) anchor.append(error);
        else (controls[0].closest(".field") || controls[0].parentElement).append(error);
      }
      if (error) {
        error.textContent = errors[name] || "";
        error.hidden = !errors[name];
      }
      for (const control of controls) {
        const descriptions = new Set((control.getAttribute("aria-describedby") || "").split(/\s+/).filter(Boolean));
        if (errors[name]) {
          control.setAttribute("aria-invalid", "true");
          descriptions.add(id);
        } else {
          control.removeAttribute("aria-invalid");
          descriptions.delete(id);
        }
        if (descriptions.size) control.setAttribute("aria-describedby", [...descriptions].join(" "));
        else control.removeAttribute("aria-describedby");
      }
    }
    if (focusFirst) {
      const first = Object.keys(errors)[0];
      controlsFor(first)[0]?.focus();
    }
  }

  function setPending(value) {
    pending = value;
    form.setAttribute("aria-busy", String(value));
    if (!submitButton) return;
    submitButton.disabled = value;
    const text = value ? "Preparing your request…" : originalButtonText;
    if (submitButton.tagName === "INPUT") submitButton.value = text;
    else submitButton.textContent = text;
  }

  function showConfirmation(quote, demo) {
    if (summary) {
      const list = root.createElement("dl");
      list.className = "request-details";
      for (const [label, value] of [
        ["Name", quote.name], ["Email", quote.email], ["Phone", quote.phone || "Not provided"],
        ["Property", quote.address], ["Services", quote.services.join(" · ")],
        ["Project details", quote.message || "No additional details"],
      ]) {
        const term = root.createElement("dt");
        term.textContent = label;
        const detail = root.createElement("dd");
        detail.textContent = value;
        list.append(term, detail);
      }
      summary.replaceChildren(list);
    }
    const title = demo ? "Demo request prepared" : "Request submitted";
    const detail = demo
      ? "This preview has not sent an email. Your selections are shown below so you can review the quote form."
      : "Your request was accepted by our form service. Eric will follow up using the contact information you provided.";
    if (confirmation) {
      let heading = confirmation.querySelector("h2, h3, [data-confirmation-title]");
      if (!heading) {
        heading = root.createElement("h3");
        confirmation.prepend(heading);
      }
      heading.textContent = title;
      let note = confirmation.querySelector("[data-confirmation-note]");
      if (!note) {
        note = root.createElement("p");
        note.dataset.confirmationNote = "";
        heading.after(note);
      }
      note.textContent = detail;
      confirmation.hidden = false;
      confirmation.focus({ preventScroll: true });
      const reduceMotion = typeof window !== "undefined"
        && typeof window.matchMedia === "function"
        && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      confirmation.scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth", block: "nearest" });
    }
    setStatus(`${title}. ${demo ? "This preview has not sent an email." : "The form service accepted your request."}`, "success");
  }

  function onEdit() {
    completedFingerprint = "";
    if (confirmation) confirmation.hidden = true;
    setStatus("");
    if (attempted) renderErrors(validateQuote(serializeQuoteEntries(new FormData(form))));
  }
  form.addEventListener("input", onEdit);
  form.addEventListener("change", onEdit);
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (pending) return;
    attempted = true;
    const quote = serializeQuoteEntries(new FormData(form));
    const errors = validateQuote(quote);
    renderErrors(errors, true);
    const errorCount = Object.keys(errors).length;
    if (errorCount) {
      setStatus(`Please check ${errorCount === 1 ? "the highlighted field" : `the ${errorCount} highlighted fields`} and try again.`, "error");
      return;
    }
    const fingerprint = JSON.stringify(quote);
    if (fingerprint === completedFingerprint) {
      confirmation?.focus();
      return;
    }
    setPending(true);
    setStatus(siteConfig.web3formsAccessKey.trim() ? "Submitting your request…" : "Preparing your demo request…", "pending");
    try {
      const result = await submitQuote(quote);
      if (result.ok) {
        completedFingerprint = fingerprint;
        showConfirmation(quote, result.type === "demo");
      } else {
        const messages = {
          blocked: "We couldn't prepare this request. Please refresh the page and try again.",
          configuration: "The quote form is not connected yet. Please contact Eric by email for now.",
          limit: "The quote form is temporarily unavailable. Your details are still here; please try later or email Eric.",
          timeout: "We couldn't confirm whether the request was accepted. Please email Eric before retrying; your details are still here.",
          network: "We couldn't confirm whether the request was accepted. Check your connection or email Eric; your details are still here.",
          service: "The quote form couldn't confirm your request. Your details are still here; please try again or email Eric.",
        };
        setStatus(messages[result.type] || "Please check your details and try again.", "error");
        if (status) { status.setAttribute("tabindex", "-1"); status.focus(); }
      }
    } finally {
      setPending(false);
    }
  });
}

if (typeof document !== "undefined") {
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => initQuoteForm(), { once: true });
  else initQuoteForm();
}
