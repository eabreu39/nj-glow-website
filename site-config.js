/**
 * NJ Glow draft configuration.
 * Blank access key deliberately keeps the quote form in DEMO mode: no network
 * request is made, and no email is sent. A Web3Forms key routes notifications
 * to the inbox verified in Eric's Web3Forms account; the address below does
 * not override that routing. Do not put an email password in this file.
 */
export const siteConfig = Object.freeze({
  businessName: "NJ Glow",
  receivingEmail: "eric@getnjglow.com",
  web3formsAccessKey: "7f85bad6-65ad-4b4e-a0c2-43b13997eb7a",
  quoteSubject: "New NJ Glow quote request",
});

export const serviceOptions = Object.freeze([
  "Christmas / Seasonal Lighting",
  "Permanent Lighting / LED Strips",
  "Power Washing",
  "Window Cleaning",
  "Gutter Cleaning",
  "Paver Re-sanding & Sealing",
]);
