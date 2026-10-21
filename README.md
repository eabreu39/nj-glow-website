# NJ Glow website draft

A complete, portable static website draft for Anthony and Eric. No package installation, framework, build pipeline, hosted image links, or paid service is needed to run this preview. All assets and the font are included locally.

## Preview locally

With Node.js installed, open a terminal in this folder and run:

```sh
node server.mjs
```

Open http://127.0.0.1:4187. Stop the preview with Ctrl+C. The server listens only on the local computer. To use a different port, set the `NJGLOW_PREVIEW_PORT` environment variable.

Opening index.html directly with file:// will display the page but may block the JavaScript modules. Use the local server to test the menu, gallery, and quote form.

## Current draft content

- Exact gold/navy lowercase-g PNG approved on October 8, 2026, copied unchanged. The header, footer and favicon all use this version.
- Christmas and seasonal lighting is the primary offering.
- Selected headline: “Curb appeal that glows.” Supporting copy covers seasonal and permanent lighting plus exterior care for New Jersey homes.
- Permanent outdoor lighting and LED strips are the other lighting offering.
- Power washing, window cleaning, gutter cleaning, and paver re-sanding and sealing are secondary offerings.
- Email: eric@getnjglow.com, confirmed October 8, 2026.
- Phone: +1 (973) 405-1252, confirmed October 8, 2026. The visible contact details include email and telephone links.
- Social links appear beside email and phone in the contact section and with platform icons in the footer: Facebook page NJGlow and Instagram @getnjglow, provided October 8, 2026. Each opens in a new tab. Facebook uses the verified page URL https://www.facebook.com/people/NJGlow/61557525730602/; Instagram uses https://www.instagram.com/getnjglow/.
- All six project photographs were provided by Eric on October 8, 2026. They replace the generated placeholders throughout the hero, service sections and gallery. The red/white/blue roofline photo is confirmed as permanent lighting.
- The project JPG files are unchanged copies of the originals. Browser display crops focus on the lighting and hide black screenshot margins and phone navigation; the three portrait photos retain their original EXIF orientation. All six photos can be enlarged from the gallery.
- No invented reviews, certifications, statistics, guarantees, prices, or discounts.

## Quote form

The quote form supports multiple selected services, required-field validation, and a review summary. Name, email, property address, and at least one service are required. Phone and project details are optional; a supplied phone number is still validated. The Web3Forms access key provided on October 8, 2026 is configured in `js/site-config.js`, so the form now submits real requests. Clearing `web3formsAccessKey` restores demo mode with no external submission or email.

Web3Forms uses the verified account/form key to choose the recipient: changing `receivingEmail` alone does not reroute notifications. The intended receiving inbox is eric@getnjglow.com. No email password belongs in this project. Eric keeps control of the Web3Forms account and receiving inbox.

One clearly labeled connection test was submitted through the local website on October 8, 2026 with all six service choices and no phone number. Web3Forms accepted it, and the page displayed “Request submitted.” Anthony confirmed Eric received the test email. The form automatically shows customer-facing follow-up text when a valid key is configured. Mocked checks passed for multiple services, customer reply-to, failed submissions, and duplicate-click prevention. The recipient's actual Reply action has not been observed.

Before public launch, review the privacy text and add CAPTCHA protection. The current form includes a hidden honeypot; Web3Forms now recommends CAPTCHA instead of relying on the honeypot alone. If hCaptcha is enabled in the account, the website must include its widget and forward its response token before requiring it. See the [official hCaptcha integration guide](https://docs.web3forms.com/getting-started/customizations/spam-protection/hcaptcha). Test actual inbox delivery again from the final HTTPS domain and check account limits. Service acceptance is not proof of inbox delivery.

## Design refinement, October 6

Applied the useful guidance from [Give Me 7 Minutes & Your Web Design Skills Will Take Off](https://www.youtube.com/watch?v=1NTKwpAVcHg), after reviewing its full transcript:

- Visual hierarchy: the hero uses the selected “Curb appeal that glows.” headline, with supporting text for seasonal lighting, permanent lighting and exterior care. Seasonal lighting remains the primary offering in the service section.
- Calls to action: consistent “Get a free quote” links lead to the same form. The submit button says “Send quote request,” and the form explains Eric's email follow-up.
- Color and contrast: the approved navy/gold palette is retained, with gold concentrated on the main actions. Keyboard focus uses navy on white and gold on navy; form borders have stronger contrast.
- Readability: larger navigation, process text, form labels and service choices; larger checkbox hit areas; a tablet menu and narrow-phone headline adjustments.
- Lower friction: an optional phone number, clear required-field labels, multiple services, and confirmation scrolling that respects reduced-motion preferences.
- Honest imagery: the initial draft called the illustrative gallery “Lighting ideas.” With Eric's actual photos added on October 8, the top navigation now says “Gallery” and the placeholder-photo notice has been removed.

The video's color ratios and scanning patterns were treated as design guidance, rather than rigid rules. The existing layout, logo, local assets and open white sections are preserved. Checked in the Codex in-app browser at widths from 320 to 1505 pixels, including menu behavior, keyboard focus, the image viewer, form errors, all six service choices and demo confirmation. No browser console warnings or errors were observed. The later Web3Forms connection test and reported inbox receipt are described above; conversion results remain unverified.

## Transfer to Eric

Copy this whole folder to the drive. On Eric's computer, create a GitHub repository in his account and upload the contents of this folder. Eric should own the domain registration, GitHub repository, hosting account, Web3Forms form, and receiving email.

For a static Vercel import, select the appropriate commercial-use plan, choose Framework Preset Other, leave the build command empty, and serve the repository root as the output directory. If the GitHub repository contains an enclosing folder, set that folder as the project root. `server.mjs` is a local preview helper, not a production backend. Confirm current Vercel settings and plan eligibility before deploying.

Connect the domain in Eric's hosting account, then follow the DNS records the host provides. Test HTTPS, mobile layout, all links, and actual quote email delivery afterward. No GitHub push, account creation, deployment, or DNS change has been performed here. One real Web3Forms test submission was accepted as described above.

## Before launch

Confirm exact service areas, public/legal business details, inbox delivery to eric@getnjglow.com, and the scope of installation/removal/maintenance/storage before writing claims about them. Add an appropriate privacy notice and CAPTCHA protection for the public quote form.

The draft deliberately blocks indexing. Remove the robots meta tag in index.html and update robots.txt when the real site is ready to be indexed. Replace `Draft preview` with approved live content. The quote form itself is already configured for real submissions. Add the final domain metadata and social preview then.

## Editing map

- `index.html`: copy, contact details, page structure, quote fields.
- `styles.css`: colors, type, layout, desktop/mobile behavior.
- `js/site.js`: mobile menu, image viewer, service selection links.
- `js/quote-form.js`: validation, serialization, demo state, Web3Forms integration.
- `js/site-config.js`: receiving-email reference, access key, subject and allowed services.
- `assets/`: approved logo, local font/license, and Eric's six project photos (`project-*.jpg`).

The Manrope font is included under the SIL Open Font License; preserve assets/manrope-license.txt.
