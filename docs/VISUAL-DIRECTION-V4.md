# Crunchify — product story redesign

## Design intent

Build a premium, approachable snack site around the supplied photography. The memorable element is a four-product scroll story: original product photographs sit on layered cards that gently turn as their matching information enters view. The sequence has a clear end at the wholesale inquiry path. Mobile and reduced-motion views show the same content as normal, spacious product panels.

Keep the original logo upright, proportionate and unmodified. Keep every product image as supplied; depth comes from the surrounding layout and CSS transforms, not generated packaging or retouched labels. Keep the installed Poppins Regular and Medium files, using only their actual 400 and 500 weights. The previously documented limitations of the supplied Talina/Antipasto demo fonts still apply.

## Tokens and composition

| Role | Color |
| --- | --- |
| Sun / primary brand surface | `#f4cf62` |
| Forest / primary actions | `#234b3b` |
| Cocoa / warm text and logo companion | `#573a2b` |
| Milk / page surface | `#fffdf5` |
| Sage / quiet staff and secondary surfaces | `#e9eee1` |
| Ink / body copy | `#25362d` |

Use left-aligned Poppins, generous line spacing, short reading widths and a deliberate scale. Product photography gets large rounded frames; forms use smaller radii; staff data is organized with dividers and semantic tables. Avoid an identical card treatment for every section.

The first idea used multiple floating food accents. The reviewed direction removes the repeated accents and spends the visual emphasis on the product story. Staff screens use the same identity with functional spacing and no decorative scroll effects.

## Full page plan

| Page | Desktop | Mobile | Main interactions |
| --- | --- | --- | --- |
| Home | Sun-colored hero, original Banana photo, four-part sticky product story, ingredient benefits, wholesale callout | Photo-led hero, four normal product panels, stacked benefits and CTA | Product chapter links, scroll-driven depth, product details, wholesale inquiry |
| Products | Two-column photography-led collection, category links and real counts | Single-column cards with roomy labels/actions | All/Fruit/Vegetable filtering, product links |
| Four product detail pages | Large original photo, description and supplied facts, quote action, related range | Photo then information then full-width actions | Product preselection in wholesale form, related products |
| Wholesale | Product-led introduction, three sourced benefits, inquiry preparation and CTA | Stacked imagery, benefits and full-width inquiry link | Wholesale inquiry |
| Wholesale inquiry | Introduction and selected-product context alongside a grouped form | Short introduction then one-column fields and product choices | Required validation, loading, retry, success and pending-notification feedback |
| Brand/media | Quiet editorial introduction and collaboration form | Intro and one-column fields | Same accessible form lifecycle; optional collaboration field labeled |
| Privacy | Readable document with actual fields, attribution and email processing explained | One reading column | Inquiry and supplied social contact links |
| Not found | Sparse brand surface and clear destinations | Same content stacked | Home and products links |
| Staff login | Separate branded login composition | Logo and centered single-column form | Sign-in and clear error |
| Staff inbox | Sidebar, real totals, filters, semantic table, empty and pagination states | Staff header, stacked controls and inquiry cards | Search, status/type filters, clear filters, open, pagination, sign-out |
| Staff detail | Inquiry and follow-up columns, email status, history | Details, follow-up and history in reading order | Contact links, save status/note with feedback, conditional email retry, back, sign-out |

## Layout sketches

```text
Home desktop                       Home mobile
logo / navigation / inquiry        logo / menu
copy + CTA | original pack         original pack
           | texture accent        copy + CTA
range heading                      range heading
sticky pack | Banana story         pack / Banana story
            | Jackfruit story      pack / Jackfruit story
            | Apple story          pack / Apple story
            | Broccoli story       pack / Broccoli story
benefits / wholesale CTA           benefits / wholesale CTA
footer                             footer

Staff desktop                      Staff mobile
sidebar | title + real totals      logo / staff navigation
        | search / filters         title / totals
        | table / pagination       search / filters
        | detail | follow-up       inquiry cards / pagination
        | history                  details / follow-up / history
```

## Motion and interaction contract

- Scroll-linked product-card depth runs only on sufficiently wide screens when reduced motion is not requested. Use one requestAnimationFrame update per scroll frame, passive listeners and transform/opacity changes. Clean up listeners on unmount and viewport changes.
- No scroll hijacking, endless content duplication, automatic carousels, hidden facts or delayed calls to action. Normal scrolling always reaches the rest of the page.
- Each product chapter is a real anchor destination. All information and links remain in normal document order. Keyboard users can reach every action.
- Mobile and reduced-motion views use static photo panels. Hover feedback belongs to actionable elements; staff data stays still.
- Navigation changes close the mobile menu. Public navigation switches before its desktop content becomes crowded. Tablet collections use two columns; phones use one.
- Use visible focus and comfortable controls, announce submission progress and outcomes, retain recoverable form entries, and use controlled error copy.

## Audit items addressed in this pass

Consolidate palette tokens, use actual font weights, correct the header breakpoint and mobile menu lifecycle, improve form progress/error copy, give each product its own metadata, explain actual form attribution in Privacy, and keep the staff section visually separate. Sitewide noindex remains intentional for the trial deployment; this visual revision does not change that launch decision.

## Review deliverables

Create actual responsive pages in the existing Next.js project, a separate hosted Preview, and desktop/mobile screenshots for every route family including populated staff list/detail examples and form states. Original source materials remain authoritative for specifications and claims. Do not create invented sales metrics, testimonials, shipping promises, product weights or contact details.

## Verification plan

Review widths 320, 390, 700, 701, 760, 768, 960, 1024 and 1440 pixels. Check the scroll story, reduced-motion fallback, menu transitions, filters, quote preselection, form outcomes, staff navigation and save/retry feedback. Run lint/build/integration checks and focused accessibility checks after implementation. Use simulated form responses or clearly marked Preview records, with no unsolicited messages.

## Review results — 6 November 2026

- Implemented all page families above in the application, including the four individual product pages and the separate staff shell.
- Seventeen public/staff layout variants passed all nine widths without horizontal overflow. The exact breakpoint edges at 700/701 and 760/768 were included.
- All four desktop product chapters activate as expected. Reduced-motion and mobile views retain the complete static product information. The menu closes after navigation; Escape returns focus to its toggle; desktop CSS hides the mobile dropdown after a viewport change.
- Category filtering and quote product preselection passed. Simulated form checks covered sending/disabled fields, a non-JSON connection failure, retained inputs, retry, success and pending email notifications. No inquiry or email was created by this visual review.
- Axe reported no selected WCAG 2.0/2.1/2.2 A/AA violations in 18 audited desktop/mobile screens and states. This does not replace physical-device or real screen-reader testing.
- Lint, production build and all 16 existing integration checks passed. The browser review reported no uncaught page exceptions.
- Saved 40 desktop/mobile screenshots, including four scroll-story moments, every page family, staff inbox/empty/detail samples, form success/retry and pending-notification states. Staff samples use clearly labeled fictional data rendered from the actual presentation components.
- Gallery and screen images are generated under the ignored local `concepts/v4/` directory. `web/scripts/render-design-gallery.cjs` renders staff layout samples without database access; `web/tests/e2e/redesign-review.mjs` checks behavior and creates the complete screen gallery.
