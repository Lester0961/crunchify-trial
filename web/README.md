# Crunchify wholesale website

Next.js App Router, TypeScript and Tailwind application. The trial is publicly available at https://crunchify.vercel.app/ with staff sign-in at `/admin/login`. Current verification and outstanding company inputs are recorded in `../docs/REMAINING-WORK-CHECKLIST.md`; the historical plan is in `../docs/CRUNCHIFY-MASTER-PLAN.md`.

## Local development

1. Use Node.js 24 and run `npm ci` in this folder.
2. Copy `.env.example` to `.env.local` and configure the services. Never commit credentials. Run `npm run dev` and open `http://localhost:3000`.
3. To set up a **new, dedicated** database, load the environment and run `npm run db:setup` (for example `node --env-file=.env.local scripts/db-setup.mjs`). Review the target first; the command creates a private schema and seeds only the four product names. Do not point it at an unrelated database.
4. Run `npm run lint` and `npm run build` before deployment.

`DATABASE_URL` must be a server-only PostgreSQL connection string with TLS and access to the `crunchify_private` schema. `BREVO_API_KEY`, `MAIL_FROM` (a Brevo-verified sender email), and `INQUIRY_NOTIFICATION_TO` enable transactional mail. `ADMIN_USER`, an scrypt `ADMIN_PASSWORD_HASH` (`salt:hex-digest`), and a long random `ADMIN_SESSION_SECRET` enable staff sign-in. The locally generated Vercel admin credentials are in the ignored `.env.admin-credentials` file; protect that file and rotate the password and session secret before handover. The local file does not configure the application by itself.

Inquiries save before email is attempted. An email marked `accepted` was accepted by the provider, not necessarily delivered. Staff can inspect the status and manually retry pending messages; check provider history before retrying because a timeout may have an uncertain outcome and provider idempotency is time-limited. End-to-end mail delivery must be verified once the sender and recipient are supplied.

The supplied Talina and Antipasto files are demo/trial versions with missing glyphs or trial markings, so the site temporarily uses the supplied SIL-OFL Poppins font. The user confirmed that Mathew’s supplied product photography is approved; the banana package image says 200 g while the dossier lists 100 g and 250 g. Business contact details and privacy wording remain outstanding. Source assets are excluded from Git and must be transferred through an approved private handover. The Next.js standalone server has been verified locally; the supplied Dockerfile and PostgreSQL compose service have not been built or run because a container engine is unavailable on this machine. An actual VPS migration requires an approved host and verification.

## Project directories

- `src/app/`: pages and route handlers.
- `src/components/`: shared presentation components.
- `src/features/`: product and inquiry code.
- `src/server/`: server-only database, email and authentication code.
- `database/`: schema and product seed.
- `public/brand/`: prepared company assets for the private repository and deployment.
- `tests/`: reserved for integration and end-to-end tests.
