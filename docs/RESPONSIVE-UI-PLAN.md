# Crunchify UI alignment plan

## Visual direction

Retain the supplied logo, product photography and Poppins font files. Use the supplied cocoa, leaf green and warm snack palette as the base: cocoa `#573a2b`, leaf `#365b3b`, oat `#f8f7f0`, pistachio `#e7efda`, warm yellow `#fff0c7`, ink `#202b21`. Keep product photography prominent and surfaces calm. Use motion only to confirm interaction: gentle button color change and a small product-image hover on devices that support hover. No popups, carousels, auto-playing motion or floating prompts; disable decorative motion when reduced motion is requested.

## Page and board fixes

| Board(s) | Page / state | Implemented alignment |
| --- | --- | --- |
| 01, 11, 23 | Home, mobile menu and full mobile scroll | Retained the arched product hero, range, why-stock section, partnership callout and footer; checked each CTA and mobile menu destination. |
| 02, 17 | Product collection, filters and mobile product path | Kept all four supplied products; checked category counts, selected state, detail links and tap behavior. |
| 03, 14 | Product detail and variants | Added the return breadcrumb and related-range callout; kept supplied facts only and confirmed the quote link preselects its product. |
| 04, 18 | Wholesale page and form entry | Rebuilt the page around the supplied product photo, verified benefits and inquiry path; avoided unsupported claims. |
| 05, 06, 20 | Wholesale form and ready, validation, success, failure states | Kept form fields and attribution; verified native required-field validation, loading, success, pending-notification, failure and retry feedback. |
| 07, 20 | Brand/media inquiry | Added a small supplied-crumb accent, matched the form heading to the layout and verified validation and response states. |
| 08, 16 | Admin sign-in and mobile access | Added a centered sign-in panel and separate staff shell; removed the public header/footer from staff pages. |
| 09, 19, 21 | Admin inquiry list, filters, empty state | Added clear company/type/status/date/open columns, readable mobile cards, search and filters; aligned “In progress” wording with the boards. |
| 10, 19, 22 | Admin detail and follow-up | Split inquiry details and follow-up into responsive cards; kept history, save, email retry, back navigation and sign-out reachable. |
| 12, 21 | Privacy and not-found | Retained quiet support pages, readable copy and clear routes back into the site. |
| 13, 15 | System flow and brand elements | Kept these as reference boards; applied their attribution, packaging and brand-element intent to the real flows. |

## Route and module inventory

| Route | Modules and behavior | Source boards |
| --- | --- | --- |
| `/` | Brand header; mobile menu; hero and wholesale CTA; featured product cards; why-stock section; partnership callout; footer | 01, 11, 23 |
| `/products` and category query | Product collection; Fruit/Vegetable filters; active filter state and counts; product cards | 02, 17 |
| `/products/[slug]` | Four supplied product detail pages; breadcrumb; image and product facts; quote CTA with product selected in the inquiry form; related-range callout | 03, 14 |
| `/wholesale` | Product-led introduction; verified reasons to stock; inquiry CTA | 04, 18 |
| `/inquire` | Wholesale inquiry fields; consent and attribution; required-field validation; submitting, success and recoverable failure states | 05, 06, 18, 20 |
| `/partners` | Brand/media introduction and inquiry form; matching validation and error/success behavior | 07, 20 |
| `/privacy`, not found | Quiet support page and clear return path; branded 404 | 12, 21 |
| `/admin/login` | Staff sign-in, separate staff shell, no public header/footer | 08, 16 |
| `/admin` | Staff navigation; inquiry totals; search; status/type filters; empty state; readable desktop columns and mobile cards; paging; sign-out | 09, 19, 21 |
| `/admin/inquiries/[id]` | Inquiry details; sender/company email status and conditional retry; follow-up status/internal note; change history; back navigation and sign-out | 10, 19, 22 |
| Cross-page system | Brand assets and color, form lifecycle, attribution, responsive type and spacing, keyboard focus, states and motion rules | 13, 15, 20 |

## Interaction and layout rules

- Keep the supplied Crunchify logo and Poppins font. Use the calm cocoa/leaf/oat palette above, with pistachio and warm yellow reserved for light accents. Preserve the product-packaging colors in photography rather than adding competing surfaces.
- Public navigation remains visible on public pages only. The admin area uses its own staff navigation with Inquiries, View website and Sign out; mobile staff links wrap cleanly below the logo.
- Keep every route and its main actions usable at 320, 390, 768, 1024 and 1440 CSS pixels. Cards must wrap without horizontal scrolling; fields and controls span the available mobile width; inquiry details and follow-up stack on narrow screens and sit side-by-side on desktop.
- Use clear hover and pressed feedback on actual controls, visible keyboard focus, and touch-sized links and buttons. Product imagery may zoom slightly on hover-capable devices; the small supplied crumb accent may tilt. Honor reduced-motion preferences. Do not add popups, auto-playing motion, carousels or floating prompts.
- Keep content and controls truthful to the supplied brief. No invented product specifications, logistics, delivery promises, testimonials or company claims. A visual flourish must not look like a disabled or clickable feature when it is not interactive.

## Verification completed

- Reviewed the 23 supplied local boards against the matching public and staff routes above; retained the Drive-supplied identity and Poppins font.
- Exercised 14 public/product/system routes at 320, 390, 768, 1024 and 1440 CSS pixels. All returned below 500 and had no horizontal overflow. Exercised the mobile menu, category filters and counts, product-to-quote preselection, and failed form submission with retained values and a clear retry label.
- Ran axe-core on 8 routes at 390 and 1440 pixels against WCAG 2.0/2.1/2.2 A and AA. No violations were reported. Verified the keyboard skip link, visible focus, reduced-motion behavior and the subtle normal desktop hover.
- `npm run lint`, `npm run build` and all 16 integration checks pass.
- Visual review found and corrected narrow-screen overflow on product details, the stretched admin-shell logo, an oversized partnership heading and a clipped form example. The local checkout has no database connection or live admin settings; hosted Preview and Production sign-in were verified instead.

## Release results — 6 November 2026

- Deployed the reviewed UI commit `61c7557` to [crunchify.vercel.app](https://crunchify.vercel.app). All 14 routes passed at 320, 390, 768, 1024 and 1440 pixels without horizontal overflow. Poppins and page images loaded in representative mobile and desktop views.
- Production staff sign-in, no-public-header/footer layout, search/empty state, staff links and sign-out were checked without editing inquiries or retrying email. Preview inquiry-list and detail cards were checked with a marked temporary row at all five widths; filters and unsaved status/note controls worked, and the conditional retry control appeared. No email retry was sent. The row was deleted and the database confirmed no matching test record remained.
- Form success and pending-notification states were tested with browser-intercepted responses, so no database rows or emails were created. Required-field validation, loading/disabled state, error retention and retry feedback were also checked.
- Temporary Vercel preview access links were revoked after review. The project's prior ignored-build rule was restored after the explicit production build.
- `npm run lint`, `npm run build`, all 16 integration checks, keyboard focus and reduced-motion checks passed. Axe reported no WCAG 2.0/2.1/2.2 A/AA violations on the eight audited pages at 390 and 1440 pixels.

VPS migration remains excluded at the user's direction.
