# Crunchify wholesale website

Next.js App Router, TypeScript and Tailwind application. The implementation is a protected trial build; it is not ready for public release until the service connections, content approvals and end-to-end checks below are complete. The authoritative scope is in `../docs/CRUNCHIFY-MASTER-PLAN.md`.

## Local development

1. Use Node.js 24 and run `npm ci` in this folder.
2. Copy `.env.example` to `.env.local` and configure the services. Never commit credentials. Run `npm run dev` and open `http://localhost:3000`.
3. To set up a **new, dedicated** database, load the environment and run `npm run db:setup` (for example `node --env-file=.env.local scripts/db-setup.mjs`). Review the target first; the command creates a private schema and seeds only the four product names. Do not point it at an unrelated database.
4. Run `npm run lint` and `npm run build` before deployment.

`DATABASE_URL` must be a server-only PostgreSQL connection string with TLS and access to the `crunchify_private` schema. `BREVO_API_KEY`, `MAIL_FROM` (a Brevo-verified sender email), and `INQUIRY_NOTIFICATION_TO` enable transactional mail. `ADMIN_USER`, an scrypt `ADMIN_PASSWORD_HASH` (`salt:hex-digest`), and a long random `ADMIN_SESSION_SECRET` enable staff sign-in. The locally generated Vercel admin credentials are in the ignored `.env.admin-credentials` file; protect that file and rotate the password and session secret before handover. The local file does not configure the application by itself.

Inquiries save before email is attempted. An email marked `accepted` was accepted by the provider, not necessarily delivered. Staff can inspect the status and manually retry pending messages; check provider history before retrying because a timeout may have an uncertain outcome and provider idempotency is time-limited. End-to-end mail delivery must be verified once the sender and recipient are supplied.

The supplied font files are trial versions, so the site uses a temporary system font. Product photographs are from the supplied Drive kit; final product assets, contact details, claims and privacy wording need company approval. Source assets are excluded from Git and must be transferred through an approved private handover. The supplied Dockerfile and local-only PostgreSQL compose service have not been tested because Docker is unavailable on this machine. An actual VPS migration requires an approved host and verification.

## Project directories

- `src/app/`: pages and route handlers.
- `src/components/`: shared presentation components.
- `src/features/`: product and inquiry code.
- `src/server/`: server-only database, email and authentication code.
- `database/`: schema and product seed.
- `public/brand/`: prepared company assets for the private repository and deployment.
- `tests/`: reserved for integration and end-to-end tests.
