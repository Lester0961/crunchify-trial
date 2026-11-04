# Crunchify trial execution goal

Deliver the core and pursue the bonus against Mathew's signed-trial-agreement attachment, the B2B dossier, the supplied brand kit, and the approved v3 interface boards. The five-day work target does not alter the agreement's ten-working-day terms or guarantee the bonus.

## Acceptance checkpoints

1. **Brand and content:** match the supplied kit and mobile-first boards, use the four real products and confirmed dossier facts, exact wholesale CTA and why-stock-us content, and approved contact details. Complete Talina and Antipasto web fonts remain outstanding; the user confirmed that the supplied assets are approved.
2. **Wholesale inquiry:** validate all nine fields on the server; protect against spam; preserve entries on errors; save the inquiry, source and UTM data to PostgreSQL; send and verify both confirmation and company notification; make delivery failure visible and recoverable.
3. **Additional pages:** complete product listing and details, wholesale page, and a separately handled brand/media partner inquiry without invented commercial terms.
4. **Admin CRM:** protect all staff endpoints; provide a mobile-friendly inquiry list, search, status and type filters, accurate totals, complete details, notes, status changes and email retry. Test authorization and the actual database.
5. **Deployment and portability:** maintain a private Git repository, Vercel preview, secure environment configuration, Supabase PostgreSQL migrations and seeds, and a tested Docker image. Actual VPS migration requires the company's approved host and access and must not be claimed on the strength of a Dockerfile.
6. **Verification and handover:** test real browser flows and responsive layouts, accessibility, SEO, performance against the stated target, security, delivery failure and recovery, and document the results and exact unresolved inputs. Deliver the repository and preview for the company's review and consolidated feedback.

## Confirmed dependencies

- Mathew has not supplied public business email or telephone, an approved company notification recipient, an approved verified sender/domain, or licensed complete brand web fonts. Do not invent them or claim email delivery.
- The user confirmed the supplied product imagery is approved. Apple pack size is unspecified, and the pictured banana package says 200 g while the dossier lists 100 g and 250 g; do not infer a resolution.
- Company-approved VPS infrastructure and access are not available.
- The missing written post-kickoff acceptance summary and the client's consolidated feedback remain unconfirmed.

## Current audit, 4 November 2026

- Vercel, the private repository, and the dedicated Supabase database are connected. Public site and admin are implemented; a prior synthetic test verified a database save and admin status update.
- The user selected Brevo and authorized their verified Gmail sender and address for temporary public email. Protected preview and public production tests saved synthetic inquiries and both confirmation and notification messages were delivered on 4 November 2026; the synthetic records were removed. The confirmation reached Inbox but the public company-notification test landed in Spam. Brevo rewrote the Gmail sender to a Brevo sending address; the company's final authenticated sender/domain and recipient remain unconfirmed.
- Product descriptions, ingredients and confirmed pack sizes from the dossier, plus admin summary, search and filters from board 09, were implemented and verified in the protected staging deployment. A synthetic inquiry reported pending notification, appeared under the admin filters, and a conflicting duplicate was rejected; the test record was removed.
- Production and new preview deployments use separate schemas in one database with shared credentials. Older previews can still use production tables; this is not a security boundary. Never modify or remove real lead records during testing. Synthetic test records must be unmistakable and removed by exact ID after verification.
- Local Chrome mobile Lighthouse 13.6.0 on the production build, 4 November 2026: performance 98, accessibility 100, best practices 100, SEO 63. The SEO audit flags the deliberate noindex setting; the site is not ready for search indexing until company content and launch approval. These are lab results on one local run, not field metrics or a conformance certification.
- Mobile axe-core checks on home, products, wholesale inquiry and brand/media pages reported no violations after the product-heading fix. Manual screen-reader and real-device checks remain outstanding.
- The admin inquiry list highlights failed or pending email statuses. Its warning was checked in staging using a synthetic record that was removed after verification.
- A synthetic attribution test verified the saved landing source, UTM source and campaign, and selected product; the test record was removed. The user requested VPS preparation for later; see `VPS-MIGRATION.md`.
