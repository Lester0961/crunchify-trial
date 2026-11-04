# Crunchify trial: remaining work checklist

**Snapshot:** 4 November 2026. The site is live at https://crunchify.vercel.app/ and the repository is private. This checklist separates work already demonstrated from work still needed for company acceptance. The five-day plan is an internal target; the agreement's ten-working-day start conditions and company acceptance still apply.

## Highest priority: company inputs and email

- [ ] Obtain the company's approved business email, phone/WhatsApp, and recipient for wholesale and brand/media notifications. Add the confirmed contact details to the footer.
- [ ] Obtain access to an approved company-controlled sending domain. Configure and authenticate it in Brevo, then replace the temporary Gmail sender and personal notification recipient in Vercel.
- [ ] Send controlled test inquiries after the change and verify that the sender confirmation and company notification both arrive at their intended addresses, including Inbox/Spam placement.
- [ ] Agree who monitors the admin CRM and email failures, and document a handoff and retry procedure. Brevo accepting a message does not itself prove inbox delivery.
- [ ] Until the company address is ready, monitor the temporary notification address and its Spam folder. A production test notification landed in Spam.

## Brand, content, and legal copy

- [ ] Obtain complete Talina Regular and Antipasto Pro web fonts and implement them. The supplied demo/trial files have missing glyphs or trial markings; the site uses the supplied Poppins fonts under the SIL Open Font License as a temporary fallback.
- [x] Use the supplied studio product and packaging compositions: the user confirmed that Mathew’s supplied materials are approved by Crunchify. The pictured banana package says 200 g while the dossier specifies 100 g and 250 g; resolve that discrepancy before treating the depicted label as factual.
- [ ] Confirm Apple Crunch pack size. Do not invent it in the meantime.
- [x] Use the website/social channels and product information supplied in the dossier, without inventing missing details.
- [ ] Obtain and implement company-approved privacy wording, including how inquiries and attribution are handled.
- [ ] Obtain the written post-kickoff requirements/acceptance summary referenced by the agreement, or confirm that the company has supplied no additional criteria.

## Complete functional and security verification

- [ ] Test the full wholesale flow in an actual browser after the final mail configuration: all nine fields, product selection, source/UTM values, saved record, both email receipts, success and failure behavior, and duplicate/retry handling.
- [ ] Test the separate brand/media flow with the final company-approved fields and routing.
- [ ] Review and test server-side validation, spam/rate limiting, unauthorized admin access, session expiry/sign-out, and write-action authorization. Verify no credentials or customer data are exposed.
- [ ] Recheck admin search, type/status filters, counts, inquiry details, notes, status updates and email-retry warning on mobile and desktop. Test recovery after a provider failure using the final provider settings.
- [ ] Separate preview and production databases, or otherwise agree an isolation and data-protection strategy with the company. They currently share one database.
- [ ] Establish and test a database backup and restore process. Set appropriate account permissions, retention and operational ownership.
- [ ] Rotate and securely hand over staff credentials, API keys and session secret. Remove old temporary admin-test files from the Windows Temp folder; prior protected deployments can retain earlier configuration.

## Responsive, accessibility, SEO, and performance

- [x] Check 11 public and admin-entry routes at 320, 390, 768, 1024 and 1440 px for successful responses and horizontal overflow; inspect the refreshed homepage at mobile and desktop sizes. Continue real-device and full-state review below.
- [ ] Complete keyboard-only testing across forms, navigation and admin; perform a real screen-reader check and test on real mobile devices.
- [x] Re-run accessibility and performance audits on the public deployment: mobile Lighthouse measured performance 92, accessibility 100, best practices 100 and SEO 63; mobile axe found zero violations across eight representative live routes. These lab checks do not replace screen-reader testing.
- [ ] Resolve SEO readiness with the company. The site intentionally uses noindex pending content/launch approval; one local Lighthouse run scored SEO 63. Only enable indexing after approval, then remeasure.
- [x] Review dependency audit: 16 moderate findings remain in development tooling (minimatch), with zero production findings. The compatible audit fix dry run changed nothing; npm suggests a breaking ESLint downgrade, so that was not forced.

## Deployment and delivery

- [x] Build and run the Docker image on a private GitHub Actions Linux runner with a disposable PostgreSQL container. The test verified non-root execution, homepage and image loading, synthetic inquiry persistence and UTM, admin sign-in, cross-origin rejection, update, retry and logout. Email was disabled; actual VPS, company mail and HTTPS-proxy testing remain open.
- [ ] Confirm Vercel, GitHub, Supabase, Brevo, domain, DNS, backup and billing ownership with the company. Keep the repository private and provide access through an agreed handover.
- [ ] Decide the production branch and release process. Automatic production Git builds are currently guarded; production deployments have been promoted explicitly after checks.
- [ ] Review [HANDOVER.md](HANDOVER.md), verify setup instructions from a clean checkout, and deliver the repository and review link to the company when ready.
- [ ] Receive Mathew's consolidated feedback, apply the agreed corrections, and obtain written acceptance of core deliverables and any bonus work.

## Optional VPS bonus: deferred at your request

- [ ] Obtain a company-approved VPS, access, DNS/TLS arrangements and a migration window.
- [ ] Follow [VPS-MIGRATION.md](VPS-MIGRATION.md): test the image, environment, database and email on staging; verify backup and restore; plan write freeze/data synchronization and rollback.
- [ ] Perform the actual migration, verify the live application and both emails, and retain evidence of company acceptance. A runbook or Dockerfile alone does not complete this bonus.

## Already implemented and demonstrated

- [x] Mobile-first homepage, four-product listing and details, wholesale page, separate brand/media form, privacy placeholder, and admin sign-in/CRM. The refreshed site uses supplied package photography and Poppins fallback fonts.
- [x] Required wholesale fields, validation and spam checks; PostgreSQL save; source/UTM and product attribution; handling for a conflicting duplicate.
- [x] Admin login, inquiry search/filter, status and notes, email-status warning, and a retry path tested with synthetic data.
- [x] Both wholesale and brand/media synthetic inquiries saved in the live database and sent both messages to the temporary Brevo address; synthetic records were removed. Inbox versus Spam placement is noted above.
- [x] Vercel deployment, connected private GitHub repository, Supabase project, schema migration and safe product seed.
- [x] Local build, lint, production dependency audit, integration and browser smoke checks; mobile axe checks on examined pages. One local Lighthouse run measured performance 98, accessibility 100 and best practices 100; these are lab results, not a conformance certificate.

## Refresh deployment, 4 November 2026

- [x] Deployed the supplied imagery and Poppins fallback to https://crunchify.vercel.app/. The protected preview and production deployments built successfully; production browser smoke checks passed, and the homepage image loaded at mobile width.
- [x] The Next.js standalone server served the homepage and supplied image locally. A Docker build and isolated container smoke test subsequently passed; the complete VPS bonus remains unverified.
- [x] A clean checkout passed npm ci, lint and build. A synthetic PostgreSQL backup restored four products and one test inquiry; see [BACKUP-RESTORE.md](BACKUP-RESTORE.md). Production backup and restoration remain open.
- [ ] A separate free preview project was attempted, but Supabase reported the account has reached its active free-project limit. No other project was paused or changed.

## Admin verification, 4 November 2026

- [x] Fixed a mobile-only issue that hid the admin sign-out button. Live authenticated browser smoke checks passed at 390 px and 1440 px, including sign-in, visible sign-out and redirection after logout.
- [x] Live unauthenticated admin writes and retries returned 403, cross-origin login returned 403, malformed inquiry input returned 400, and oversized input returned 413. Mobile keyboard tab checks reached public forms and admin filters; real screen-reader and physical-device checks remain open.

- [x] On isolated local PostgreSQL with email disabled, a real browser submitted a wholesale inquiry, retained UTM attribution and product selection, displayed the email-failure warning, rejected a conflicting duplicate, and allowed an administrator to retry and update the synthetic inquiry. The exact synthetic record was removed afterward. The final company sender and routing still require their own test.

- [x] Extended the isolated browser/database test to verify the separate brand/media submission, honeypot rejection, a ten-request rate limit, and denial of admin access and writes with an expired signed session. This does not replace testing with the final company email configuration.

- [x] Limited inquiry request bodies while streaming, including when Content-Length is missing or misleading. Integration checks cover chunked and multibyte input; a local chunked HTTP request returned 413, and isolated wholesale/partner flows still passed.

- [x] Applied streamed size limits to staff sign-in and inquiry-update forms. An isolated test verified ordinary sign-in, admin updates, a 5,000-character Unicode note, oversized requests and unsupported content types. The protected preview rejected an oversized login, and live mobile/desktop sign-in and sign-out smoke checks passed after deployment.

- [x] The isolated Docker run exposed and verified a fix for standalone admin origin validation. Staff POST routes now use the public Host and trusted proxy scheme; [VPS-MIGRATION.md](VPS-MIGRATION.md) records the required proxy configuration. CI evidence: https://github.com/Lester0961/crunchify-trial/actions/runs/41759444171.
