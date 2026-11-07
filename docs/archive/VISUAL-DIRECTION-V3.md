# Crunchify visual direction: Website Trial Drive only

These are static visual concepts, not a functioning website. This revision supersedes the earlier concepts.

## Source and creative treatment

- Visual identity comes from `reference/drive/Crunchify Brand Book Design.pdf`, `Logos-Branding`, `Studio Shots`, and `Packaging Mock Up` in the shared Website Trial folder.
- Use the original, upright and proportionate supplied logo and product photographs. Do not recolor, stretch, rotate, add effects to, or rearrange the logo.
- The proposed layout uses responsive grids, generous spacing, thin dividers, and circular crops of the supplied product photography.
- Primary brand colors: brown `#8F5035` and cream `#FFF0C7`; secondary green `#1C925D` and white `#FFFFFF`. Neutral off-white `#F8F6F1` and warm gray `#6E6E6E` are from the kit. The deeper broccoli-palette green `#566C30` is used for white text on small buttons because it has approximately 5.86:1 contrast; white on `#1C925D` is about 3.95:1. Thin borders can use the approved warm gray at reduced opacity.
- The branded headline font is Talina Regular and the supporting font is Antipasto Pro, as specified by the book. Only the supplied demo/trial files are available: the Talina demo lacks some punctuation/numerals, and the Antipasto trial renders digits and `@` as a personal-use watermark. The concepts avoid those characters; punctuation missing in Talina uses the supplied Antipasto. Full licensed, web-embeddable files with complete character coverage are needed before a production implementation can strictly use both fonts for real form data.
- The photos use the supplied white-pouch mockups; the kit also contains a different yellow Banana packaging design. Some mockup labels show printed weights and certification-style marks that have not been confirmed by the dossier. Confirm the current packaging, weight and claims before production.

## Scope boundary

The Drive brand book provides visual identity, logos, fonts and images. It does not define the trial's inquiry fields, CRM, delivery integrations or VPS work. Those functions remain in the concepts because they were separately requested in Mathew's emailed agreement; their layouts and ordinary UI labels are proposed implementation decisions. This document does not claim those functional requirements came from the Drive brand book.

The current images in `wireframes-v3/` replace the previous images in the user-specified Drive folder. The earlier AI illustration's Drive file was replaced with a new visual-details board made from supplied product photographs. Earlier local drafts are retained separately as superseded work.

## Mobile-first and staff access

Board `11` shows three scroll positions of the corrected mobile homepage, and board `23` shows its complete mobile layout. Boards `16`–`22` show the open menu and footer, a separate staff sign-in, product and wholesale journeys, stacked CRM inquiry cards, complete inquiry details, form feedback and supporting views. The form continuation boards represent scroll positions within one form. The footer and mobile menu both present Admin login; the separate `/admin/login` route is a proposed way to reach the protected CRM. Showing the link is not a security measure: authentication and server-side authorization must be implemented for the actual site.

Board `01` includes the wholesale CTA, four products, the why-stock-us section, supplied website and social links, and the admin link. Public business email and phone were unavailable at this stage. See the [trial status](../REQUIREMENTS-TRACEABILITY.md) for the delivered features.

The mobile layout uses a single column, generously spaced controls, simple typography, and a top-arched crop of a supplied product photograph. The crop can be built using CSS `border-radius` and `object-fit`; the same source materials and brand colors remain in use. The implementation should use readable type and touch targets, support keyboard and screen-reader navigation, and be verified from 320 CSS pixels upward. These PNGs are concepts, not a responsive or functional site. The supplied demonstration font limitations described above still apply.
