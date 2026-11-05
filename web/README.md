# Crunchify wholesale website

Next.js App Router, TypeScript and Tailwind application. The trial is publicly available at https://crunchify.vercel.app/ with staff sign-in at `/admin/login`. Current verification and outstanding company inputs are recorded in `../docs/REMAINING-WORK-CHECKLIST.md`; the historical plan is in `../docs/CRUNCHIFY-MASTER-PLAN.md`.

## Local development

1. Use Node.js 24 and run `npm ci` in this folder.
2. Copy `.env.example` to `.env.local` and configure the services. Never commit credentials. Run `npm run dev` and open `http://localhost:3000`.
3. To set up a **new, dedicated** database, load the environment and run `npm run db:setup` (for example `node --env-file=.env.local scripts/db-setup.mjs`). Review the target first; the command creates `crunchify_private`, the application tables and only the four product names. It does not initialize the preview schema or configure restricted hosted roles. Do not point it at an unrelated database.
4. Run `npm run lint` and `npm run build` before deployment.

`DATABASE_URL` must be a server-only PostgreSQL connection string with TLS and access to the chosen schema. Production defaults to `crunchify_private`; new Vercel preview deployments use `crunchify_preview` automatically. Vercel previews use `PREVIEW_DATABASE_URL` and Vercel production uses `PRODUCTION_DATABASE_URL`; both roles are restricted to their own schemas. `DATABASE_URL` remains the local/VPS setting and an unused legacy production rollback variable. They still share a database, and historical preview deployments can retain old credentials. `DATABASE_SCHEMA` can select either schema outside Vercel; Vercel preview and production reject conflicting overrides. Older preview builds may still use production tables until the former production credential is rotated. `BREVO_API_KEY`, `MAIL_FROM` (a Brevo-verified sender email), and `INQUIRY_NOTIFICATION_TO` enable transactional mail. `ADMIN_USER`, an scrypt `ADMIN_PASSWORD_HASH` (`salt:hex-digest`), and a long random `ADMIN_SESSION_SECRET` enable staff sign-in. The locally generated Vercel admin credentials are in the ignored `.env.admin-credentials` file; protect that file and rotate the password and session secret before handover. The local file does not configure the application by itself.

To prepare a new admin credential, run `npm run admin:generate`. It creates a new `admin-generated.env` under `%LOCALAPPDATA%\Crunchify\Credentials` on Windows, or `~/.local/share/Crunchify/Credentials` on other systems. It refuses to overwrite that file and prints only its path. Protect the directory with OS access controls; Windows permissions depend on the inherited ACL. Store the generated `ADMIN_PASSWORD` securely for staff, and configure only `ADMIN_USER`, `ADMIN_PASSWORD_HASH` and `ADMIN_SESSION_SECRET` as server-side environment variables. Never set `ADMIN_PASSWORD` as a Vercel environment variable or commit the generated file. Generating a file does not change any deployment; a coordinated variable update and redeployment is required. Changing the session secret invalidates current sessions.

Inquiries save before email is attempted. An email marked `accepted` was accepted by the provider, not necessarily delivered. Staff can inspect the status and manually retry pending messages; check provider history before retrying because a timeout may have an uncertain outcome and provider idempotency is time-limited. End-to-end mail delivery must be verified once the sender and recipient are supplied.

`tests/e2e/local-recovery.mjs` exercises the real browser form, both inquiry types, database save, honeypot and rate limiting, expired-session authorization, duplicate conflict, failed-email warning and administrator retry/update against a disposable local database. It refuses non-local targets. Start an isolated local application with a separately initialized test database, disable all Brevo configuration, set its test admin credentials to `localtest` / `localtestpassword`, and set `TEST_BASE_URL` and `TEST_DATABASE_URL` to those local services before running the script. Never use these test credentials or this test against production. The test deletes only its own synthetic inquiry. The separate `tests/e2e/smoke.mjs` can check sign-in and sign-out when `ADMIN_TEST_USER` and `ADMIN_TEST_PASSWORD` are supplied securely in the process environment.

The supplied Talina and Antipasto files are demo/trial versions with missing glyphs or trial markings, so the site temporarily uses the supplied SIL-OFL Poppins font. The user confirmed that Mathew’s supplied product photography is approved; the banana package image says 200 g while the dossier lists 100 g and 250 g. Business contact details and privacy wording remain outstanding. Source assets are excluded from Git and must be transferred through an approved private handover. The Dockerfile was built and run on a GitHub Actions Linux runner with disposable PostgreSQL; the isolated smoke test covered synthetic inquiries and staff operations with email disabled. The local-only PostgreSQL compose service and an actual VPS deployment have not been verified. An actual VPS migration requires an approved host and verification.

## Project directories

- `src/app/`: pages and route handlers.
- `src/components/`: shared presentation components.
- `src/features/`: product and inquiry code.
- `src/server/`: server-only database, email and authentication code.
- `database/`: schema and product seed.
- `public/brand/`: prepared company assets for the private repository and deployment.
- `tests/`: integration tests and isolated browser, accessibility, container and security-rehearsal checks.

For remote Vercel preview and production, the restricted pooler connection requires `sslmode=verify-full`; the app verifies Supabase’s published CA and hostname. Review the CA before its 2031 expiry and update it on provider rotation. The role migrations describe grants and policy, but a restored project needs a new password provisioned securely in Vercel; never commit one.
