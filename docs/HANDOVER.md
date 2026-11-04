# Crunchify trial handover

## Current access

- Public site: https://crunchify.vercel.app/
- Private repository: https://github.com/Lester0961/crunchify-trial
- Vercel project: `lesters-projects-17d9e437/crunchify-trial`; application root `web/`.
- PostgreSQL: dedicated Supabase project `crunchify-trial` in the School organization. Production and new previews share one database but use separate schemas and credentials: production uses the restricted `crunchify_production_app` role and `crunchify_private`, while new previews use the restricted `crunchify_preview_app` role and `crunchify_preview`. The preview role lacks production schema usage and table access. Earlier preview deployments may retain the former production credential; retire their access by rotating production credentials after a verified cutover.
- Staff sign-in: `/admin/login`. The locally generated credentials are in the ignored `web/.env.admin-credentials` file on the development machine. Transfer credentials securely to the authorized owner and rotate them for handover. Do not email or commit the file.

The default Git branch is `codex/crunchify-trial`. A Vercel ignored-build command currently prevents Git pushes to the production target from publishing automatically; production releases have been made explicitly after checks. Review branch and release policy with the company before handover. The public site currently returns `noindex` until content and launch approval.

## Inquiry handling

The wholesale form validates the nine agreed fields, stores the inquiry and attribution in PostgreSQL, and attempts the confirmation and company notification. Staff can search and filter the inquiry list, open a record, update its status and note, inspect email status, and retry a failed notification. A provider status of `accepted` means the provider accepted the request; it is not a delivery receipt. If delivery is uncertain, inspect Brevo's transactional logs before retrying to avoid duplicates.

The inquiry list shows 50 matching records per page. Previous and Next preserve the search, status and type filters; the summary counts above the filters describe all inquiries. Ordering is newest first, with a stable ID tie-breaker.

The inquiry detail page shows the latest 100 recorded status or note changes, including prior and new values. Changes are labeled with the shared admin account, not an individual person. History begins when the database migration was applied; it cannot reconstruct earlier changes and is not tamper-proof against a compromised application account. Notes and their history contain private information and must be covered by the company's retention and backup policies.

Admin sessions are signed, expire after eight hours, and are checked against a server-side session record. Sign-out revokes that session and clears the browser cookie. A copied cookie was tested against preview and production and was denied after sign-out. The database stores a hash of the cookie rather than the cookie itself. If a session is suspected to be exposed, rotate `ADMIN_SESSION_SECRET` and redeploy to invalidate all sessions. Older protected deployments can still run the former stateless code and retain their earlier secrets; retire those deployments and rotate credentials during handover.

The user authorized a temporary Brevo sender and notification recipient at `johnlesterdmtr.dev@gmail.com`. On 4 November 2026, both messages arrived in a production test; the company notification went to Spam. Brevo rewrote the Gmail sender to a Brevo sending address. Staff should monitor the admin list and their spam folder. Replace the temporary sender with the company's authenticated domain and the temporary recipient with the company's approved address before final handover.

## Configuration and operations

Server-only Vercel environment names include `PRODUCTION_DATABASE_URL` (production), `PREVIEW_DATABASE_URL` (preview only), `DATABASE_URL` (legacy production rollback credential, not used by current application code), `BREVO_API_KEY`, `MAIL_FROM`, `INQUIRY_NOTIFICATION_TO`, `ADMIN_USER`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET`. Never expose these through `NEXT_PUBLIC_` variables, Git, logs, screenshots or public documents. Sensitive Vercel values may not be retrievable after saving. Redeploy after changing environment values.

The schema and safe product seed are in `web/database/`; do not run setup scripts until the target database is positively identified. Back up and test restoration before schema or infrastructure changes. Use separate projects for a stronger infrastructure boundary before sensitive client data is handled at scale. New previews have a schema-restricted credential, but historical preview builds can retain the previous production credential until it is rotated. Keep temporary test inquiries unmistakable and delete only exact test records.

## Verification already performed

- Local production build, lint, production dependency audit, browser smoke tests and Brevo request/failure integration tests passed. A clean checkout also passed npm ci, lint and build. The live mobile sign-out issue was fixed and authenticated sign-in/sign-out smoke tests passed at 390 px and 1440 px.
- A live Chrome mobile Lighthouse run measured performance 92, accessibility 100, best practices 100, SEO 63; noindex caused the indexing finding. These are lab scores, not a guarantee or accessibility certification.
- Mobile automated axe checks found no violations on eight checked live routes. Keyboard navigation was exercised for the mobile menu; real-device and screen-reader tests remain open.
- A production synthetic inquiry was saved, and both Brevo messages arrived at the temporary address; the notification was classified as Spam. Preview testing also checked email retry, admin login/status updates, search, product selection, source/UTM storage and duplicate handling. Synthetic database records were removed.
- A separate production brand/media test stored its collaboration type and UTM source and delivered both messages to the temporary address. The notification was classified as Spam; the synthetic database record was removed.

## Open items before company acceptance

1. Company-approved authenticated email domain, sender and notification recipient; confirm receipt and spam placement after switching.
2. Complete Talina and Antipasto web fonts, confirmed Apple size, public business contact details, and approved privacy copy. The user confirmed the supplied assets are approved; the supplied banana package image says 200 g while the dossier lists 100 g and 250 g. Poppins from the kit is a temporary SIL-OFL fallback because the supplied brand-font demos have missing glyphs or trial markings.
3. The written post-kickoff acceptance summary, company review, and consolidated feedback.
4. Real-device and screen-reader checks; test the real VPS deployment and restore a production backup. The Docker image passed a disposable Linux runner test with email disabled. A synthetic local backup and restore succeeded; see `BACKUP-RESTORE.md`. VPS migration is not complete; see `VPS-MIGRATION.md`.
5. Decide ownership and access for Vercel, Brevo, Supabase, GitHub, DNS and backups; separate preview and production projects before handover and rotate the former shared production credential; newer preview builds use restricted credentials, while older previews may retain the former credential.

The original agreement supplies the formal ten-working-day conditions and makes bonus acceptance company-dependent. The internal five-day target does not alter those terms.

The current production code connects with the restricted production role using certificate-verified TLS. The older broad `DATABASE_URL` remains in the Production environment as a rollback safeguard and can still be read by production runtime code; older deployments can also retain it. This is not complete credential isolation. Once the owner is ready, plan a verified removal and rotation of the former database credential and assess rollback implications. Supabase Free does not provide automatic backups; see `BACKUP-RESTORE.md`.

A manual encrypted live backup was created on 5 November Manila time and its listing verified. It is bound to the current Windows user and is not an off-device or scheduled backup. A synthetic encrypted archive restored successfully; a production-data restoration rehearsal and company-controlled recovery arrangements are still needed.
