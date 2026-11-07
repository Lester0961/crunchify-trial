# Run Crunchify locally

Use Node.js 24 and npm. The app uses Next.js App Router, TypeScript, Tailwind, PostgreSQL, and Brevo. Docker can run the local PostgreSQL service. The browser checks use Google Chrome.

## Start the app

1. From the repository root, run `cd web` and `npm ci`.
2. Copy `.env.example` to `.env.local`. Start PostgreSQL with `docker compose up -d postgres`, or use an existing dedicated local database.
3. For the bundled Docker service, use this development-only connection in `.env.local`.

   ```dotenv
   DATABASE_URL=postgresql://crunchify_dev:local-development-only@127.0.0.1:54329/crunchify_dev
   ```

4. Run `node --env-file=.env.local scripts/db-setup.mjs`. This applies `database/migrations/` and seeds the four products from `database/seed/`.
5. Run `npm run dev` and open [localhost:3000](http://localhost:3000/).

The local setup creates the `crunchify_private` schema. The versioned files in `supabase/migrations/` record the hosted schema and role setup for Supabase.

## Environment variables

| Variable | Where it is used |
| --- | --- |
| `DATABASE_URL` | Local database connection |
| `PREVIEW_DATABASE_URL` | Vercel Preview connection to `crunchify_preview` |
| `PRODUCTION_DATABASE_URL` | Vercel Production connection to `crunchify_private` |
| `DATABASE_SCHEMA` | Optional schema selection outside Vercel |
| `BREVO_API_KEY`, `MAIL_FROM`, `INQUIRY_NOTIFICATION_TO` | Transactional email credentials, verified sender, and team address |
| `ADMIN_USER`, `ADMIN_PASSWORD_HASH`, `ADMIN_SESSION_SECRET` | Staff sign-in and sessions |

Use separate restricted database credentials for hosted Preview and Production. Both hosted Supabase connections require `sslmode=verify-full`. Keep real environment values in the local ignored file or in Vercel.

For local staff access, run `npm run admin:generate`. It prints the path to a generated credentials file. Copy the username, hash, and session secret into `.env.local` and keep the generated password for sign-in at `/admin/login`.

## Check the build

```sh
npm run lint
npm run test:integration
npm run build
```

With the app running on port 3000, run `npm run test:smoke`. Set `TEST_BASE_URL` to check a different address. Set `CHROME_PATH` when Chrome is installed outside its standard location. The smoke test checks the public flow with a simulated submission. Set both `ADMIN_TEST_USER` and `ADMIN_TEST_PASSWORD` to include staff sign-in and sign-out.

For the database and recovery check, start a disposable local app and database with the Brevo variables empty. Set `TEST_BASE_URL`, `TEST_DATABASE_URL`, `ADMIN_TEST_USER`, `ADMIN_TEST_PASSWORD`, and the same test-only `ADMIN_SESSION_SECRET` used by that app. Run `npm run test:recovery`. It submits both forms, checks saved details and validation, and exercises staff retry, updates, and sign-out. The dated visual comparison scripts in `tests/e2e/` use local review fixtures and are described in the [archive](../docs/archive/README.md).

## Find the code

| Folder | Contents |
| --- | --- |
| `src/app/` | Pages and API routes |
| `src/components/` | Shared page components |
| `src/features/` | Product, inquiry, and staff UI logic |
| `src/server/` | Database, email, and staff authentication |
| `database/` | Local schema migrations and product seed |
| `supabase/migrations/` | Hosted migration history |
| `public/brand/` | Logo and product assets used by the site |
| `tests/` | Integration and browser checks |
