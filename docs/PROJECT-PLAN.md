# Crunchify B2B trial: five-day delivery plan

**Superseded planning summary:** the complete, current re-plan is in [CRUNCHIFY-MASTER-PLAN.md](CRUNCHIFY-MASTER-PLAN.md), with a requirement-by-requirement tracker in [REQUIREMENTS-TRACEABILITY.md](REQUIREMENTS-TRACEABILITY.md). The notes below are retained as the earlier planning baseline and may omit later findings.

Status: planning and local setup. Wireframes are concepts, not a functioning site. The agreement's 10-working-day period is unchanged; five days is Lester's desired internal target, subject to access and feedback. The latest written acceptance criteria, exact start date and bonus allocation should be confirmed with Mathew. No claim of bonus entitlement is implied.

## Source of truth and decisions

1. Mathew's post-call agreement defines the core and optional bonus. His Nov 2 email adds the references, the original broader brief, and a Lighthouse target above 90. Where the early brief and agreement differ, the agreement separates core from bonus; the company's later written acceptance summary remains to be received/confirmed.
2. Core: homepage and a working wholesale inquiry system. Bonus candidates: product detail and wholesale pages; brand/media partner form; admin CRM; VPS migration. The first email mentions category filters and 5–8 sample products, but the dossier supplies four real products; do not invent the remainder.
3. The requested pages below are a proposed implementation of those deliverables, not a representation that Mathew approved every detail. The CRM's precise feature set and the bonus acceptance standard need confirmation. The VPS option requires actual infrastructure and access, not merely a Dockerfile.
4. Brand materials and dossier are non-public. Keep the repository private, keep reference assets outside Git, do not publish credentials, customer leads or client files, and obtain written portfolio permission as stipulated in the agreement.
5. The agreement explicitly calls for Next.js App Router with TypeScript and Tailwind, PostgreSQL with migrations and seed data (Supabase used as plain Postgres), Vercel deployment with a preview, Docker readiness, environment-based configuration and a Git repository. Mathew's earlier email also specifies Vercel with Supabase. Use Supabase as the planned PostgreSQL service rather than treating the provider as an interchangeable, unspecified choice; its project and access have not been configured. The specific email service, authentication implementation and route names remain implementation decisions.

## Brand and visual direction

- Brand book primary: brown `#8F5035` and cream `#FFF0C7`; secondary green `#1C925D` and white `#FFFFFF`. Neutrals: off-white `#F8F6F1`, warm gray `#6E6E6E`.
- Flavor palettes: banana `#FECE07`, `#FFE36E`, `#FEDA3B`; broccoli `#658439`, `#D4E29D`, `#566C30`; apple `#9CD94E`, `#C6F28A`, `#6AA635`; jackfruit `#F78F28`, `#FED092`, `#F47C20`.
- The brand book specifies Talina Regular primary and Antipasto Pro secondary. Kit files are named `TalinademoRegular` and `AntipastoPro_trial`; confirm production and web-embedding licenses and obtain complete font files before deployment. The current concepts use these two typefaces only. The demos cannot render some characters; the concepts omit those characters. The logo is the supplied, unmodified artwork; keep it upright and proportionate, in approved colors, with adequate clear space, without extra effects.
- Use the supplied pack images and photos. Big confident headlines, short benefit copy, clear contrast, generous spacing and flavor-color blocks. Do not import the reference brands' code, assets, copy or brand identity.
- The kit includes white-pouch product mockups as well as a different yellow Banana Crunch packaging design; the current store also shows the yellow banana pack. Confirm the current approved packaging before final production. An Apple label appears to specify a weight, while the dossier says its size is to be confirmed; resolve that discrepancy with the company rather than guessing.
- The user's latest direction limits visual identity and imagery to the Website Trial Drive. Reference-site styling and AI-generated illustrations are not used in the current visual concepts. Page layouts and ordinary interaction labels are proposed designs; the form fields and trial functions originate from the separately emailed agreement, not from the brand book. Never imply Crunchify has a retailer, certification, specification or contact detail that has not been provided.

## Proposed page inventory and interaction contract

| Route / view | Scope | Main sections and functions |
| --- | --- | --- |
| `/` | Core | Brand header; B2B hero and wholesale CTA; four real products; why stock us; partnership CTA; footer and confirmed contacts. The footer and mobile menu include an Admin login link. Responsive nav and keyboard access. |
| `/products` | Bonus | Four cards with images, concise facts, category controls and links to detail/quote. Filter: all, fruit, vegetable; preserve accessible URL/state if implemented. |
| `/products/[slug]` | Bonus | One reusable template for banana, jackfruit, apple and broccoli; ingredients and confirmed sizes, related items, request quote preselecting the product. Unknown specs labeled pending or hidden. |
| `/wholesale` | Bonus | B2B value proposition, product lineup, process, approved FAQ, inquiry CTA. MOQ, lead times, territories and stocked-at logos only when confirmed. |
| `/inquire` | Core | Wholesale form with all agreed fields, validation, spam protection, source/UTM capture, submission, loading, success and error/retry states. Product selections work from product links. |
| `/partners` | Bonus | Brand/media partner form: proposed name, organization, email, collaboration type and message. Actual fields and routing require company confirmation. |
| `/privacy` and not-found | Supporting | Privacy content approved by company, contact path and a clear recovery link on 404. Do not publish invented policies. |
| `/admin/login` | Bonus | Separate staff sign-in reached from the footer, mobile menu, or a direct link. Secure server-side authentication and clear error states; no public registration or sample passwords. |
| `/admin` | Bonus | Authorized lead list, search/filter by type/status and open a lead; empty/loading/error states. Use test data only until the company authorizes real usage. |
| `/admin/inquiries/[id]` | Bonus | Show inquiry and source data; proposed status and internal note; save and error states. Role/retention/export requirements need confirmation. |

The current Drive-based wireframes are in `wireframes-v3/`: separate boards cover the home, catalog, reusable product detail, wholesale, wholesale form, form states, media form, admin login, lead list, lead detail, privacy/not-found and the system flow. Board `11` and boards `16`–`22` develop the mobile-first experience, including navigation, footer, separate staff access, product and form journeys, inquiry management, validation and supporting screens. Product-variant and CSS-friendly visual-treatment boards are also included. Product details use the same template with four variants rather than four unrelated page designs. Earlier concepts remain in `wireframes/` and `wireframes-v2/` locally as superseded drafts.

### Mobile-first design contract

- Start with the smallest supported screen, then expand the same content for tablets and desktops. Use a readable single-column flow, adaptable gutters and purposeful spacing; do not scale down a desktop layout. Breakpoints should respond to content, then be verified at representative widths including 320, 375/390, 768, 1024 and 1440 CSS pixels.
- The mobile home uses an arched crop of the supplied product photography; the menu presents large, spaced links and a clear close control. The photo treatment is achievable with CSS, and the logo remains unchanged. Do not hide required content in a carousel.
- Use legible body and input text (normally at least 16 CSS pixels), accessible contrast, clear focus states and touch targets at least 44 by 44 CSS pixels. Ensure text can wrap and scale without overlapping or causing horizontal scrolling; respect reduced-motion settings.
- Forms stay single-column with visible labels and errors. The longer wholesale form scrolls naturally; the two form boards show different scroll positions, not separate or optional fields. Preserve input on error and display success only after the intended save succeeds.
- Staff can choose Admin login in the footer or mobile menu, or open the separate `/admin/login` URL. A visible link does not provide protection: authenticate staff and enforce authorization on every admin page and API. The inquiry list becomes readable stacked cards on mobile, not a squeezed desktop table.
- The boards are static design proposals; the responsive layout, touch targets, menu, form states and authentication must be implemented and tested in a real browser before they can be described as working.

## Modules and implementation design

1. **Design system:** brand tokens, layout primitives, accessible buttons, links, field labels, errors, navigation, footer, product cards and image treatment.
2. **Product content:** typed four-product dataset, truthful attributes and image mapping. No wholesale prices, certifications, apple size or unsupported benefit claims without confirmation.
3. **Inquiry ingestion:** server-side schema validation, bounded input, honeypot plus rate limiting on the server, a durable database record, source path and recognized UTM fields. Define required versus optional fields with Mathew. Do not trust browser-only validation.
4. **Email delivery:** persistent delivery state and retryable server-side notification/confirmation with a verified sender and agreed recipient/provider. The form succeeds when storage succeeds, with separate tracking if email fails; do not pretend email delivered. No email credentials in browser or Git.
5. **Database:** PostgreSQL on Supabase, used as plain Postgres, with migrations and a seed script containing safe synthetic samples only. Proposed entities: products, inquiries (type, fields, status, created time, source/UTM), products of interest, delivery attempts, authorized admin users and audit history. Limit logged personal data; backups and retention require agreement.
6. **Admin:** authenticated, server-authorized CRM; session security, protected endpoints, server-side authorization on every read/update, CSRF protection as appropriate, validation, least privilege, and audit of status/note changes. No anonymous access to lead data.
7. **SEO and quality:** metadata, semantic headings, alt text, sitemap/robots as appropriate, responsive images, keyboard/focus and contrast checks, responsive testing, no layout shift. Aim for Lighthouse >90 as in the original email, measured per category on agreed representative pages and environment; it is a target, not a guaranteed result.
8. **Deployment:** Next.js App Router, TypeScript, Tailwind, PostgreSQL with migrations/seeds; deploy on Vercel with a shareable preview and environment variables; prepare a Docker standalone build and a separate local Postgres option. Vercel deployment and Docker readiness are core requirements; the actual VPS migration is a separate bonus. For that migration, obtain approved host, domain/TLS, DB/network, backup, mail, secrets, monitoring, ownership and acceptance checks; document cutover and rollback. Never expose the DB/admin publicly without controls.

## Five-day compressed execution

| Day | Deliverable and gate |
| --- | --- |
| 1 | Confirm written acceptance criteria, start and bonus scope; verify brand/font licenses and access; finalize information architecture; configure private repository, database and preview environments; build responsive shell and core homepage. Gate: branded homepage in preview. |
| 2 | Build and test core inquiry end-to-end: validation, anti-spam, PostgreSQL migration, source/UTM, notification and confirmation, errors. Gate: test message stored and both messages verified; no real personal data in public previews. |
| 3 | Product catalog/detail template, four confirmed products, wholesale page, FAQ and brand/media form. Gate: every CTA and product preselection works; unconfirmed business facts are omitted. |
| 4 | Secure admin CRM and VPS migration if access is available; verify authentication/authorization and least privilege, backup and rollback. Share preview and collect the single consolidated feedback round. Gate: unauthorized access denied; migration demonstrated, or VPS item explicitly blocked. |
| 5 | Address consolidated feedback, functional/accessibility/mobile/SEO/performance checks, repair issues, rehearse migrations, prepare README, environment and handover instructions. Deliver private repository and preview to the company through agreed channels. |

This schedule assumes timely decisions, feedback, email service, database, Vercel and a ready VPS. If any dependency is late, protect the core delivery first; optional scope may move past day five. Five days does not amend the agreement's ten-working-day term.

## Acceptance checklist

- Homepage matches kit, includes all required sections and behaves on mobile and desktop.
- Form accepts valid inputs, explains invalid ones, stores correct fields and attribution, handles abuse and repeats, shows honest outcomes, and sends both required messages under test. Test mail outage and database failure.
- Optional product/wholesale/partner views show only supplied data, link correctly, and preserve product preselection. Client confirms the optional acceptance criteria.
- Admin routes and APIs reject unauthorized requests; test login, empty data, filters, detail, update and failure states. No hard-coded secrets or production lead data in seeds.
- Lighthouse, keyboard navigation, contrast, responsiveness, image loading, error states, metadata and link checks are recorded. Check each supported browser and representative screen widths.
- Run lint, typecheck, build and meaningful end-to-end tests; exercise the deployed preview and, if applicable, the real VPS from browser through API, database and email. Document limitations and handover.

## Open inputs and blockers

- Mathew's written final acceptance summary; exact calculation and acceptance for the ₱2,000 maximum; whether five-day feedback is feasible.
- Signed agreement, initial payment and official start confirmation have not been independently verified. Five days is an internal target only.
- Confirm contact address/phone, company recipient and sending provider/domain; approved consent/privacy wording and data retention; mandatory form fields and CRM role/status definitions.
- Confirm MOQ, lead times, serviceable territories, stockists/logos, Apple pack size, production font licenses, and any product claims before displaying them.
- Confirm private Git/Vercel/Supabase ownership and access, and VPS provider, credentials, cost and migration acceptance. No paid resources or public deployment have been created as part of planning.

## Sources

- `reference/email/[Dematera] Freelance Trial Agreement.pdf`, scope, bonus and payment terms.
- `reference/email/B2B Website Dossier.pdf`, product and partner information.
- `reference/drive/Crunchify Brand Book Design.pdf`, visual identity, palette, type and logo rules (the supplied PDF is a single long illustrated page).
- For the current visual direction, only the Website Trial Drive brand book and supplied brand assets are used. The email documents listed above remain sources for the requested functional scope, not visual identity.
