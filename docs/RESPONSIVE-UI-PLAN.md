# Crunchify UI alignment plan

## Visual direction

Retain the supplied logo, product photography and Poppins font files. Use the supplied cocoa, leaf green and warm snack palette as the base: cocoa `#573a2b`, leaf `#365b3b`, oat `#f8f7f0`, pistachio `#e7efda`, warm yellow `#fff0c7`, ink `#202b21`. Keep product photography prominent and surfaces calm. Use motion only to confirm interaction: gentle button color change and a small product-image hover on devices that support hover. No popups, carousels, auto-playing motion or floating prompts; disable decorative motion when reduced motion is requested.

## Page and board review

| Board(s) | Page / state | Review and planned work |
| --- | --- | --- |
| 01, 11, 23 | Home, mobile menu and full mobile scroll | Keep the arched mobile hero, product range, why-stock section, partnership callout and footer. Verify every CTA and menu destination. |
| 02, 17 | Product collection, filters and mobile product path | Keep four supplied products, category filters and clear detail links. Verify filter counts, current state, tap target and image behavior. |
| 03, 14 | Product detail and variants | Match image/spec/quote hierarchy. Add the missing return breadcrumb and related-range callout; preserve selected-product prefill. Hide unconfirmed specifications. |
| 04, 18 | Wholesale page and form entry | Expand the sparse wholesale page to the board's product-led introduction, accurate benefits and inquiry CTA. Keep all claims sourced. |
| 05, 06, 20 | Wholesale form and ready, validation, success, failure states | Preserve all agreement fields and attribution, make field errors and retry obvious, retain entered values, and give every control a comfortable touch target. |
| 07, 20 | Brand/media inquiry | Match the partnership introduction and form. Keep proposed fields simple and verify validation, save and email states. |
| 08, 16 | Admin sign-in and mobile access | Use the separate staff shell and centered sign-in panel. No public header or footer inside admin. |
| 09, 19, 21 | Admin inquiry list, filters, empty state | Keep sidebar on desktop and compact staff navigation on mobile. Make columns/actions explicit on desktop and readable stacked cards on mobile. Match user-facing status labels to the board. |
| 10, 19, 22 | Admin detail and follow-up | Keep contact/business/message readable; place follow-up beside details on desktop and below on mobile. Keep back, sign-out, save and email retry reachable. |
| 12, 21 | Privacy and not-found | Keep quiet support layouts, legible text, and a clear return route at all widths. |
| 13, 15 | System flow and brand elements | These are reference/system boards, not separate routes. Preserve their source, attribution and visual-identity intent in the real flows. |

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
- Visual review found and corrected narrow-screen overflow on product details, the stretched admin-shell logo, an oversized partnership heading and a clipped form example. Admin sign-in could not be verified in the local checkout: its local environment has no database connection and does not contain the live admin credentials.

## Remaining release checks

1. Deploy the branch to a protected Vercel Preview and review the authenticated admin list/detail at phone and desktop widths, including navigation, search/filter and sign-out. Avoid saving test notes or retrying actual email during a layout review.
2. Verify the preview build and all public routes/images at desktop and mobile. Promote the reviewed deployment only after these checks pass.
3. Only if a real trial transaction is needed, use a clearly identified submission to the owner's test inbox, verify its record and messages, then delete that exact test record. No trial transaction is required for this visual pass.

VPS migration remains excluded at the user's direction.
