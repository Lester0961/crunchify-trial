# Crunchify — secondary pages and motion plan

Prepared 6 November 2026. Status: implemented and tested in the actual application and isolated Preview. Production release evidence is recorded in `PRODUCTION-RELEASE.md`. This document describes the V5 secondary-page layouts and interaction behavior; the landing-page identity and source-backed content remain the baseline. The research and concept review below are retained as design history.

## Decision

Keep the landing page that Lester likes. Extend its original photography, Poppins, warm surfaces and clear wholesale focus across the other pages. Make the site feel more responsive through continuity: an image changes gently in the same frame, a selected filter moves visibly, a form explains its progress, and an admin save confirms the actual result without losing context.

Use two visual motifs: generously framed product photography and quiet, rounded controls. Depth belongs to the product media, with small rotations and soft changes of scale. Information, navigation and forms remain stable. There is no new shop, cart, customer account, subscription, invented specification or additional product.

The nine wholesale fields, four products, original logo, original photographs, database, email delivery and separate staff area remain the functional contract. Desktop, tablet, portrait phones and short landscape screens each get a considered composition.

## What the inspection found

| Area | Current evidence | Design consequence |
| --- | --- | --- |
| Landing page | The user likes the released direction. `product-story.tsx` enables depth only at 960 px and above without reduced motion. Scroll position drives transforms directly; the nearest chapter switches opacity. | Preserve the hero and content. If touched, smooth the existing chapter handoff and add light, optional mobile media interaction. This is polish, not another home redesign. |
| Collection | Four real products, URL category links and counts, two-column photography, hover scale. No continuous selected-filter indicator or animated rearrangement. Live collection and product navigation inspected. | Keep the small catalogue easy to scan. Animate the filter marker and retained cards; keep URL navigation and counts authoritative. |
| Product details | One pack photograph, verified ingredients/sizes, quote preselection and related products. | Add a second supplied image and a deliberate pack/crunch gallery. Keep the facts and quote action adjacent to the media on desktop and in reading order on phones. |
| Forms | Required labels, server errors, input retention, 25-second request timeout, submission ID, sending, success and pending-email handling already exist. | Keep the working lifecycle. Improve grouping, focus/error recovery, selection feedback and honest confirmation. Do not introduce a wizard just to create animation. |
| Admin | Separate staff shell; desktop table and mobile cards; real filters, pagination, detail, status, notes, history and retry. Native POST/save/retry redirects provide feedback. | Improve waiting, saving, error and unsaved feedback. Keep the staff interface quiet and distinct from public pages. Do not put food effects behind lead records. |
| Motion footprint | There is no animation dependency in the current app. | Start with shared CSS timings and browser-native animation. Add one small Motion React client island only if measured scroll/layout results justify it. Do not install several overlapping engines. |

Inspected source areas: global CSS; public header/shell/footer; product story and collection; product dataset and detail template; wholesale, inquiry and partner pages; inquiry form/schema; staff list/detail/status components; privacy and not-found. Earlier V4 checks remain historical evidence, not proof that V5 has been implemented or tested in production.

## Reference research and what fits Crunchify

The observations below distinguish rendered behavior from a creator's description. References supply ideas for layout and interaction only. Crunchify materials remain the source for products, identity, copy and claims.

| Primary reference | Observation and review limit | Adaptation |
| --- | --- | --- |
| [Graza](https://www.graza.co/) and [Drizzle product](https://www.graza.co/products/drizzle) | Reviewed the home and mobile product gallery; changed a gallery image using a thumbnail. Large product imagery, grouped gallery controls and an explicit pause-animation control are present. A promotional modal was dismissed for the review. | Put image controls directly under the image. Keep pack and crunch views in one frame. Use visible controls on touch. Give motion an off state. |
| [Fishwife](https://eatfishwife.com/) | Reviewed desktop home and expanded mobile menu. Packaging leads the page; mobile navigation reorganizes categories and product imagery rather than shrinking the desktop bar. Carousels expose navigation/pause controls. | Keep the supplied pack prominent. Give mobile navigation its own spacing and hierarchy. Use self-paced image exploration. |
| [OLIPOP](https://drinkolipop.com/) | Reviewed desktop layout and changed the collection category to Variety Packs; the selected category and displayed products changed. Some images were still loading during capture, so their animation smoothness is not rated. | A clear selected category and consistent image stage. Use a calmer palette and only three catalogue filters appropriate to Crunchify. |
| [David](https://davidprotein.com/) | Reviewed desktop and mobile home compositions. Large editorial media, spare controls and restrained hierarchy provide a useful contrast to more decorative food sites. This review does not establish all product-page motion behavior. | Use breathing room, a small number of actions and clear product facts. Keep Crunchify's warm identity. |
| [Hilo Studio's Tabasco case study](https://hilostudiolab.com/en/projects/tabasco) and [studio demo](https://tabasco.hilostudiolab.com/) | The creator describes a 3D scroll story using Three.js, React Three Fiber, GSAP and Lenis. This is a studio demo, not a verified official Tabasco commission. The live demo stayed on its loader during this review; its full flow and mobile performance were not verified. | Borrow the idea of one continuous product story. Use the supplied raster photos and restrained CSS depth. A loading-gated WebGL experience is unsuitable as the baseline for this small B2B trial. |

External-store pricing, discounts, testimonials, nutrition claims and commercial promises are not transferred into Crunchify. No reference code, visual asset or brand typography is copied.

## Visual system

Keep the liked V4 colors as the common identity. Use white for image/form surfaces, milk for public pages, sage for quiet context and forest for principal actions. The product photographs provide most of the flavor color; large competing gradients would make the original packaging less prominent.

| Token | Value | Use |
| --- | --- | --- |
| Sun | `#f4cf62` | Retained home hero; occasional restrained brand emphasis |
| Forest | `#234b3b` | Primary actions, active control, staff navigation |
| Cocoa | `#573a2b` | Public display headings and logo companion |
| Milk | `#fffdf5` | Public background |
| Sage | `#e9eee1` | Selected product context, quiet panels and secondary areas |
| Ink | `#25362d` | Body and staff content |
| Muted / line | `#626758` / `#dedfd3` | Supporting copy and dividers; verify contrast in context |

- Use the supplied Poppins Regular 400 and Medium 500, with `font-synthesis: none`. Preserve the original logo upright, proportionate and unmodified. The incomplete Talina/Antipasto trial files are not a reason to substitute an unrelated display font.
- Public headings are confident but shorter on mobile. Body and editable fields are at least 16 CSS pixels in the production design; small metadata is secondary, never the only source of a fact or action.
- Image frames use approximately 22–28 px radii. Form controls use 10–12 px radii; actions may be rounded pills. Staff records use dividers and restrained panels rather than a public marketing card treatment.
- Use one principal action per section. Keep full product names and important labels visible. Do not rely on tiny arrows alone.
- Keep original pack and studio pixels. All depth comes from composition and transforms of the image element. No generated back-of-pack, false 360-degree rotation or relabeled packaging.

## Page-by-page structure and behavior

### 1. Home `/` — retain the direction

Keep the hero, message, photograph, wholesale CTA, four-product story, benefits and footer. On wide screens, smooth the existing product chapter handoff with a damped progress value and a short crossfade. Clamp rotations and movement to preserve label legibility. The page must keep native scrolling and a clear end.

On portrait phones, keep normal stacked content. A photo can settle by a few pixels when entering view, and image controls can offer a self-paced pack/crunch change. Do not pin four desktop chapters into a narrow viewport. In short landscape, use normal content flow and compact top spacing. Reduced motion shows the full story statically.

The concept's home screen is an abbreviated retained-direction reference with a self-paced product selector. It is not a replacement for the deployed full scroll story.

### 2. Collection `/products`

Structure: public header → concise heading/introduction → All/Fruit/Vegetable controls with counts 4/3/1 → four photography-led cards → wholesale callout → footer.

Desktop/tablet use two columns; portrait phones use a single generous column. Cards show the original photograph, category, full name and visible product link. Image scale/lift is mild and limited to fine pointers. Touch press feedback is brief; the first tap opens the product, with no hover state requiring a second tap.

Move the selected filter's background/underline over about 240–280 ms. Preserve card identity while filtered results rearrange over about 280–320 ms. Keep actual category state in the URL, normal links, refresh and Back behavior. Pending navigation keeps the active control and content understandable; never show an unrelated optimistic category as if the server result has arrived. Announce result counts once per selection.

Do not add catalogue search, sort, ratings or quick-add controls for four products.

### 3. Four detail routes

- `/products/banana-crunch`
- `/products/jackfruit-crunch`
- `/products/apple-crunch`
- `/products/broccoli-crunch`

Structure: breadcrumb → two-image gallery + product facts → product-specific inquiry action → related range → footer.

Desktop: approximately 55/45 media and facts, aligned at the top. A sticky facts column is allowed only when the whole actionable block fits the viewport; it must release at the section end. Mobile portrait: media, image controls, product name, description, ingredients/confirmed sizes, inquiry action, related products. Landscape: a compact image column beside facts when width permits, with no pinned image or fixed bottom action covering the reading area.

Gallery: “The pack” and “The crunch” controls with a clear selected state. A 280–340 ms crossfade and very small scale change preserve continuity. Native touch swipe may change the image after clear horizontal intent, while vertical scrolling remains free. Buttons remain available as the accessible alternative. Arrow keys work when a gallery control has focus, with normal focus order; do not capture global arrow keys. Fine-pointer tilt is limited to roughly 1–3 degrees and returns to rest. The logo itself never tilts.

Requesting a quote carries the exact slug to `/inquire?product=...`; the correct checkbox is selected and visible. Back returns to the previous category/scroll position where the router supports restoration. Related products remain real detail links.

Facts remain authoritative: Banana has bananas/coconut oil and dossier sizes 100 g / 250 g; Jackfruit 100 g; Broccoli 100 g; Apple has green apples/coconut oil and no confirmed size. Do not turn image-label discrepancies into new specifications. All four studio texture assets already exist for implementation. The lightweight interactive concept demonstrates the two-image transition with Banana's supplied crumb photograph; the other three concepts show their original pack and facts.

### 4. Wholesale `/wholesale`

Structure: clear B2B introduction + original product image → three supplied benefits → inquiry preparation → wholesale CTA → footer.

Use restrained editorial composition rather than another long product-showcase animation. The image can move less than the surrounding copy during a short entrance. Below it, inquiry-preparation disclosures explain business/territory, product selection and estimated volume, using only the current form requirements. Disclosures use measured height if animated, keep their expanded state and expose the content with reduced motion.

Desktop uses paired columns. Mobile places the introduction and first CTA before the image so the purpose is immediately clear. All preparation topics remain reachable; this is not an FAQ with invented MOQ, delivery, stockist or payment promises.

### 5. Wholesale inquiry `/inquire`

Keep a single page. All nine agreed fields remain required:

| Group | Fields |
| --- | --- |
| Your business | Company name, business type, territory/location, estimated monthly volume |
| Your contact | Contact person, email, phone/WhatsApp |
| Your products and message | Products of interest (at least one), message |

Desktop uses a compact introduction/selected-product context alongside the form; pair fields only when labels and values remain comfortable. Phone portrait uses one column and removes the large decorative introduction photo. Landscape keeps field groups in normal flow and avoids sticky elements while the keyboard is open.

Use a quiet completion cue based on actual completed required fields, not invented time estimates. Completion count does not mean validation has passed. Keep validation on submit/blur, not hostile red feedback before someone has finished typing. Show group and individual errors, connect them with `aria-describedby`, focus the first invalid field after rejection, and preserve values.

Selection rows have a full-size clickable label and a gentle surface change. Sending disables repeated submission and announces progress. Success appears only after durable save; the existing submission ID, timeout and duplicate handling remain intact. Email failure does not erase a saved inquiry. Keep the current pending-notification copy and supplied contact fallback. Connection/server errors retain the entries and offer retry. Never play confetti or bounce a long form into a new position.

### 6. Brand and media `/partners`

Keep organization, contact person, email, optional collaboration type and required message. Desktop pairs editorial introduction/crumb photography with the compact form. Phones show a short introduction followed immediately by fields. Use the same field, button and outcome language as wholesale, without the wholesale completion counter or extra business questions.

### 7. Staff login `/admin/login`

Keep separate staff identity, logo, username/password and return-to-website link. Desktop may use a quiet text/form split; phones get one column with the form near the top. Add an accessible Show/Hide password control, immediate button feedback, real signing-in state and clear retained-username error. Do not add an extra verification step, decorative food animation, signup or social login.

### 8. Staff inbox `/admin`

Structure: staff navigation → title and real counts → email-attention notice when needed → search/status/type filters → table or stacked cards → real result count/pagination.

Desktop uses the dedicated forest sidebar and semantic table. Phone portrait uses a compact staff header, stacked filters and readable inquiry cards. Short landscape can use compact cards in two columns if their contents fit; no public marketing navigation appears on staff pages. Keep an explicit Apply filters action in production so the current server-backed form and keyboard flow remain reliable; auto-search is not necessary for this trial.

Use restrained pending feedback on filter/pagination requests. Keep list geometry stable instead of staggering every row. Show company/contact, type, status, received date, email attention and an explicit Open link. Preserve query/status/type/page in the URL and when returning from detail. Show real empty, no-match and load-error states. Clear filters must actually restore the unfiltered view. Totals must describe their scope and never animate through invented values.

### 9. Staff inquiry `/admin/inquiries/[id]`

Desktop: details/message/attribution and email status on the left; status, internal note and history on the right. Phones: inquiry details → email state/actions → status and notes → history, matching the concept's document order. Put the save action with its fields and keep it reachable without a fixed bar over the keyboard. A long note must grow/scroll naturally without pushing the page sideways.

Add “Unsaved changes,” “Saving…” and acknowledgement only after the actual save response. On failure retain the draft and provide retry. Preserve the old saved value until the server confirms. Refresh history and status from the actual response, not a fabricated client event. Retain a working native form/server action path. Decide how to retain a draft on accidental navigation during implementation; prefer an in-page cancel/continue choice and draft preservation over repeated browser popups.

Retry email only when a real status needs attention. Disable repeated retry during processing, explain uncertainty, and show provider status accurately. “Accepted by provider” is not “delivered to inbox.” Contact links remain ordinary `mailto:`/`tel:` actions. Sign-out remains explicit and returns to staff login. No decorative parallax, tilt, auto-advancing detail drawer or row swipe actions.

### 10. Privacy `/privacy`

Readable document with section navigation on desktop and wrapping topic links on phones. Keep actual data collection, attribution and Brevo processing accurate. Do not animate paragraphs or gate legal text behind reveals. Anchor navigation honors reduced motion and accounts for header clearance. A reading-progress decoration is unnecessary for this short document.

### 11. Not-found and recoverable route errors

One small supplied product/crumb image, concise explanation and clear Home/Products destinations. Keep recovery available immediately. No looping falling food or time-delayed button. Where Next route errors occur, preserve the shared shell, show Retry/Back appropriately and avoid exposing implementation details in the visitor copy.

## Orientation contract

Use content-driven breakpoints and browser-test their edges; the values below are implementation starting points.

| Orientation | Layout and spacing | Motion / input rules |
| --- | --- | --- |
| Phone portrait, 320–599 px | One product per row; approximately 20–24 px gutters when width allows; one-column fields; compact staff header and lead cards. | Explicit image buttons plus optional swipe. No hover dependency, pinned story or fixed quote/save bar. |
| Large phone / small tablet, 600–959 px | Two collection columns only when each card has enough room; detail stays stacked until facts fit beside the image. Public menu switches before links crowd. | Controls wrap; text stays readable. A width alone never enables desktop pointer tilt. |
| Short landscape, e.g. 844 × 390 / 932 × 430 | Compact header/top margins; media and facts may share a row; shorter media stage; no tall sticky block. Form and staff layouts scroll naturally. | Disable decorative scroll depth when height is too short. Keep browser scrolling/zoom intact. Keyboard must not cover a fixed action. |
| Tablet / narrow desktop, 960–1099 px | Two product columns, roomy split detail when it fits; staff table only if columns remain readable. | Mixed mouse/touch capability supported. Do not assume hover from width. |
| Desktop, 1100 px and above | Capped reading width, paired image/facts, staff sidebar/table, compact paired form fields. | Optional fine-pointer tilt, smooth bounded story progress; normal keyboard navigation. |

Use safe-area padding if any element approaches a device edge. Preserve 44 px effective touch targets, visible focus and 200% zoom behavior. When height, font size or content makes a split unsuitable, stack it. Do not enforce a viewport-height page or create an inner scroll trap.

## Motion specification

| Interaction | Starting specification | Reduced-motion behavior |
| --- | --- | --- |
| Button / field focus / selected checkbox | 140–180 ms color/border; pressed scale no smaller than .985; no button movement on hover. | State/color change without movement. |
| Menu | 200–240 ms opacity + at most 8 px translation; correct focus, Escape and route-close behavior. | Immediate open/close; identical navigation. |
| Filter indicator | 240–280 ms horizontal position/width; active label never disappears. | Immediate selection. |
| Collection rearrangement | 280–320 ms transform-based layout, stable keys; at most a short 6–8 px entry on newly visible items. | Immediate results. |
| Pack / crunch image | 280–340 ms crossfade + scale .985 to 1; aspect ratio reserved. | Immediate image change, optional very short fade. |
| Fine-pointer product depth | Maximum roughly 1–3 degrees; spring/damped return, no text tilt. | Off. Also off on coarse pointers. |
| Section entrance | Optional once, 320–420 ms; 8–12 px travel; at most 40–60 ms sibling offset. | Content immediately visible. |
| Existing home story | One bounded scroll progress with damped interpolation; short crossfade near chapter boundary. No spring that trails far behind the user's position. | Static complete chapter content. |
| Form outcome / admin save notice | 160–220 ms opacity/small local transition. Pending state begins immediately; animation never delays a request or blocks retry. | Immediate state change. |
| Page navigation | Small local entrance only after real content is ready. Preserve router loading, scroll and focus. Cross-route shared-image movement is optional, not a dependency. | Normal route navigation. |

Common easing: `cubic-bezier(.2,.8,.2,1)`. Prefer transform and opacity for moving surfaces. Height animation is allowed only for measured disclosures, not the whole page. Never apply `transition: all`, permanent `will-change`, animated blur/backdrop-filter, a custom cursor, magnetic buttons, autoplay gallery rotation or endless loops. Offscreen media motion stops; ordinary text remains selectable.

## Implementation map

1. **Shared foundation:** add motion tokens and reusable reduced-motion/capability helpers; keep global style ownership clear. Preserve the current public/staff boundary and existing header behavior. Add only scoped animation classes/client islands.
2. **Collection:** add a small filter-state presentation component around the existing server data/URL links; stable product keys, measured layout animation and deterministic fallback. Use the existing four-product dataset.
3. **Detail media:** add `ProductGallery` using the existing pack/texture mapping. Reserve dimensions with Next Image, label both views, handle pointer intent and cleanup, and leave content/facts server-rendered.
4. **Inquiry:** refactor the existing form presentation into named semantic groups, retaining schema, attribution, submission ID, timeout and server contract. Centralize field/outcome styles; do not duplicate wholesale and partner logic.
5. **Staff interactions:** keep the list/details routes. Add pending/save/error presentation to existing forms and integrate with the existing server acknowledgement. Preserve filters/pagination and draft state on errors. Do not add a new CRM data model for a UI polish pass.
6. **Supporting pages:** apply consistent reading widths, disclosure behavior, recovery UI and footer spacing.
7. **Optional motion dependency:** if native CSS/WAAPI cannot produce a maintainable damped scroll/layout result, use one reviewed version of open-source Motion React, lazy-loaded only in enhanced client islands. [Motion scroll documentation](https://motion.dev/docs/react-scroll-animations) documents smoothing scroll values with springs; [layout documentation](https://motion.dev/docs/react-layout-animations) covers transform-based layout continuity; [reduced-motion documentation](https://motion.dev/docs/react-use-reduced-motion) covers adapting behavior. Do not require paid Motion+ components. No dependency was installed for this proposal.

Before production code changes, read the repository's `web/AGENTS.md` and relevant installed Next documentation. Do not rely on experimental view-transition APIs as a required navigation path.

## Performance and accessibility gates

- Target the existing trial's Lighthouse performance goal above 90, measured on the deployed Preview after the changes. Treat the historical V4 score as a baseline, not a guarantee. Record LCP/CLS/interaction evidence and compare the same device/network settings.
- Target CLS at or below 0.1 and good interaction responsiveness; reserve image/form-state space. The intention is smooth useful feedback, not a claim that every low-end device renders every effect at 60 fps.
- Measure incremental JavaScript. Aim for no new motion runtime for CSS-only micro-interactions; if a library is adopted, record the actual client bundle increase and justify it. Do not invent a bundle number before building.
- Use one scheduled frame/update path for continuous motion. Avoid setting React state each scroll frame, layout read/write thrashing, heavy image decode during transition and idle animation loops. Stop on unmount/hidden tab/offscreen as applicable.
- Load only the initially visible product photo eagerly. Lazy-load below-fold images; warm the second gallery image after idle/intent without delaying controls. All facts remain visible if a gallery image fails.
- Keyboard, touch, reduced motion and no-hover interactions have equivalent outcomes. Product changes/results/save notices are announced once, not on every frame. Maintain sufficient contrast and persistent visible labels.
- Keep native links, form validation, server authorization and ordinary browser navigation. UI polish does not weaken or add authentication steps.

## Five-day execution order

This is a new five-day UI-polish sequence starting when implementation begins, not a claim that the old trial clock has restarted. The VPS is excluded by the user's instruction.

| Day | Work | Evidence to finish the day |
| --- | --- | --- |
| 1 | Freeze retained home direction and tokens; motion/capability foundation; responsive collection and gallery. | Desktop, portrait and landscape Preview; all four products/filter states and gallery controls usable. |
| 2 | Finish all detail variants and wholesale; image decode/failure handling; quote preselection and Back behavior. | Each exact slug routes correctly; sourced facts unchanged; no unsupported product data. |
| 3 | Wholesale/partner form grouping, validation focus, completion cue and outcome transitions. | All nine wholesale fields; optional partner field; retained errors/retry/pending-email states; real save/email path still passes. |
| 4 | Staff login, inbox, detail feedback, draft/error retention, email retry and supporting pages. | Actual staff buttons pressed on both layouts; filters/pagination/back context; save only acknowledges real response. |
| 5 | Orientation, accessibility, browser and performance regression; fix issues; review screenshots and release evidence. | Lint/build/relevant tests; Preview walkthrough; measured performance; verified rollback point before authorized release. |

## Required verification matrix after implementation

Widths: 320, 390, 600, 699/700/701, 760/768, 959/960, 1024 and 1440. Landscape: 844 × 390 and 932 × 430. Include 200% zoom, keyboard open where real hardware is available, coarse pointer, fine pointer and reduced motion. Browser viewport checks do not substitute for physical-phone and screen-reader evidence.

| Flow | Actions and outcomes to verify |
| --- | --- |
| Public navigation | Menu open/close, Escape/focus return, menu-to-route, orientation change, active route, footer Admin login, Back/Forward. |
| Collection | All → Fruit → Vegetable → All; correct counts/slugs, no orphan card targets, no blank/blocked animation state; refresh/share/filter restoration. |
| Gallery/details | All four routes, each real image, tap/swipe/buttons/keyboard, vertical scroll preserved, decode/failure fallback, correct facts, related items and selected-product inquiry. |
| Wholesale | First CTA, all preparation disclosures, explore range and final CTA; no obstruction in short landscape. |
| Wholesale inquiry | Missing fields, invalid email, no product, multiple selections, exact preselection, in-flight disabled state, duplicate click, server validation, non-JSON/timeout failure, retained retry, saved success and email pending. |
| Partner form | Four required fields, optional collaboration type, the same failure/success lifecycle without wholesale-only validation. |
| Login | Show/hide, keyboard submission, real rejected credentials, signing-in state, success, sign-out; no additional authentication flow. |
| Staff inbox | Real empty list, no matches, search/status/type Apply/Clear, pagination, email attention, detail open, return to same filter/page; semantic desktop table and readable phone cards. |
| Staff detail | Exact selected record, long values, contact links, changed status/note, unsaved and saving states, real acknowledgement, failed save retaining draft, accurate history, retry pending/accepted/error, duplicate action handling. |
| Supporting/error | Privacy anchors at text zoom, unknown route recovery, route error retry, image failure, loading/slow connection and offline message. |
| Motion | Normal and reduced settings, rapid repeated toggles, interrupt/reverse animation, orientation mid-transition, no lingering listeners/idle loops, no essential content hidden. |

Use isolated/sample Preview records and the already authorized temporary test email when a real delivery check is needed. Record test messages accurately. Production browsing can be read-only; a concept's simulated success is not an end-to-end test.

## Concept deliverables and limits

- A clickable concept covers home reference, collection, reusable four-product detail, wholesale, both inquiry types, staff login/inbox/detail, privacy and not-found, with desktop/portrait/landscape presentation controls.
- The concept uses the actual logo, four original pack photographs, Banana crumb photograph and supplied Poppins font files. Gallery motion is demonstrated with Banana. Forms and staff records are local simulations and explicitly sample data; no emails, credentials or live customer records are included.
- Screenshots are orientation-specific concept references, not screenshots of V5 deployed production. New files use the `V5` prefix in the existing Crunchify Drive folder, preserving earlier versions.
- The verification results for these concepts are recorded in `concepts/v5/review-results.json` and the concept review index. These results describe the earlier concept pass; application implementation and release evidence follow below.

## Concept review results — 6 November 2026

- Saved 45 reviewed concept images: 11 page families in desktop, portrait and landscape; the three additional product variants in desktop/portrait; and six gallery/form/staff feedback states.
- Exercised the actual concept controls in Chrome: category selection, pack/crunch image change, product-specific inquiry preselection, menu open/Escape/focus recovery, motion off, form sending/disabled fields, retained connection error, retry, saved confirmation, email pending, staff filtering/clearing, exact record opening, status/note save, sample email retry, and sample staff sign-in/show-password.
- All captured page layouts reported no horizontal overflow at their reviewed container width. Additional checks covered very narrow containers and an actual 844 × 390 browser viewport. This is browser evidence, not a physical-device claim.
- Corrected three concept issues during review: local form-button handling in the preview frame, menu focus after rerender, and the staff logo's available space. The original logo artwork was preserved.
- No console errors were reported in the checked concept session. This was concept evidence only; application checks and their limits are recorded below.
- The production site, database, email settings, repository history and deployment were not changed by this planning pass. Only the new plan and ignored local concept/review artifacts were created.

## Application implementation and review — 6 November 2026

V5 is now working application code. It includes the moving collection indicator and card continuity, all four pack/crunch galleries, keyboard and touch controls, image recovery, grouped forms, a nine-detail completion cue, validation focus, retained retries, a persistent reduced-motion control, preparation disclosures, privacy anchors, recovery pages, and the restrained staff workspace. The liked home composition remains; its existing product story now uses bounded, damped motion and stops updating when idle or offscreen.

Staff login, filtering and saves now show actual waiting and error states. Follow-up drafts survive reload in the same tab. A save confirms the returned record before acknowledging success, refreshes the header/history, and retains the filtered inbox link. Native staff forms remain usable. No animation dependency, product claim, commercial promise, customer account or shop was added.

Verified against the application, rather than the concept:

- 154 public layout checks across all 12 route families, the 12 specified widths, and two short landscape sizes; 18 additional staff inbox/detail layouts. No horizontal overflow in these checks.
- Eight public interaction groups and three motion groups, including all four galleries and scroll chapters, emulated touch swipe, exact quote selection, navigation, form validation/error/retry/success, optional partner collaboration type and reduced motion.
- Eight staff interaction groups against 52 disposable Preview records: real login, pagination/search/combined filters, draft reload, retained failed save, real save/history refresh, filtered Back, email retry states, native save and sign-out.
- Thirteen WCAG A/AA axe states with no reported violations. These are automated checks, not a screen-reader certification.
- Both public forms submitted through actual buttons against Preview. The database saved the records, and Brevo accepted both confirmation and team-notification requests for each. Inbox delivery was not independently rechecked in this pass. Failure/uncertainty UI tests used controlled responses so they did not send additional messages.
- All 16 existing integration checks, lint and the production build passed. Application screenshots and review JSON are in the ignored `concepts/v5-live` directory; the original concepts remain separate.
- Lighthouse 13.6.0, production build on localhost, default simulated mobile: product performance 89/92/93 (median 92), LCP 3.1–3.3 seconds, total blocking time 80–210 ms, CLS 0.002; accessibility and best practices 100. The trial intentionally retains `noindex`, which lowers the SEO score. These are lab results; field and physical-device results are unavailable.

Physical phone keyboards, hardware-specific performance, a complete manual screen-reader pass and real-user field metrics remain outside the available browser evidence. The VPS remains excluded as requested.

V5 is released at https://crunchify.vercel.app/ from application commit `39b2c4f`. The live public interaction and motion checks, public accessibility checks, and real staff sign-in/sign-out passed after promotion. All 54 owned Preview test inquiries were removed after verification. The 41 application screenshots are saved in the existing user Drive folder; deployment and rollback details are in `PRODUCTION-RELEASE.md`.
