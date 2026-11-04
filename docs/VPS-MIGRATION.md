# VPS migration preparation

This is a runbook for the optional bonus, not evidence of a completed migration. The user requested preparation for later; no company-approved VPS or cutover authorization has been provided.

## Prerequisites

- Company-approved VPS, operating-system access, domain and DNS control, TLS termination and an owner for maintenance.
- Approved production database destination, backup and restore procedure, and a separate staging database. Vercel preview and production share one Supabase database. New previews use a separate schema and restricted credential; historical previews can retain the former production credential until rotation. Do not use production leads for destructive tests.
- Company-approved Brevo account, authenticated sender domain and notification recipient. The present Gmail sender and personal recipient are temporary; messages may be rewritten and filtered as spam.
- Complete production brand fonts, confirmed contact details, privacy wording and final acceptance criteria. The user confirmed supplied assets are approved; the banana package image and dossier show different sizes.
- A maintenance window, rollback owner, tested database backup and a record of the current Vercel deployment and DNS values.

## Prepare and test

1. On a disposable test host with Docker, check out the private repository at a reviewed commit. From `web/`, build the image with `docker build -t crunchify-web:test .`. The image uses the Next.js standalone output and a non-root runtime user. It has been built and smoke-tested on a disposable GitHub Actions Linux runner; this workstation has no container engine.
2. Create a server-only environment file outside the repository with restrictive filesystem permissions. Provide the names in `web/.env.example`: the PostgreSQL connection, Brevo key and approved sender/recipient, admin username, password hash and session secret. Do not put secrets in the image, Git, shell history, or public issue tracker. Vercel sensitive variables cannot necessarily be pulled back; obtain them securely from their owners.
3. Run the container against a separate staging database and bind it only to the local interface, for example `docker run --env-file /secure/path/crunchify.env -p 127.0.0.1:3000:3000 crunchify-web:test`. Put a maintained HTTPS reverse proxy in front of it. The proxy must overwrite incoming `X-Forwarded-Proto` with the actual client-facing scheme, overwrite both `X-Real-IP` and `X-Forwarded-For` with the verified client address, and forward the public `Host` header; do not expose the container port directly to untrusted clients. The rate limiter reads `X-Real-IP` first and then `X-Forwarded-For`; forwarding client-supplied values allows a visitor to evade per-address limits. If another trusted proxy precedes this one, configure and verify its trusted-address handling before using its forwarded address. Staff write actions validate the browser `Origin` against the public host and scheme. Verify same-origin requests succeed, cross-origin requests fail, and forged IP headers cannot change the rate-limit identity through the actual proxy. Restrict administrative access at the network layer as agreed with the company.
4. Apply the versioned database migration and safe product seed to the **staging** database after checking its identity and permissions. Verify TLS connectivity and least-privilege access. Exercise the public pages, all inquiry fields and attribution, both email receipts, login/logout, authorization, search, status changes and retry. Use synthetic records and remove only those records after the test.
5. Confirm monitoring, rate limits, log retention without private lead data or secrets, OS/container updates, resource limits, backup schedules and a successful restore. Record exact tested image digest, configuration names, host and results.

## Cutover and rollback

Only after company approval and successful staging, back up and verify restore for the production database. Decide whether the VPS retains Supabase or migrates PostgreSQL; if moving data, plan a write freeze or tested synchronization so inquiries cannot be lost or duplicated. Rehearse the production deployment and email verification before changing DNS.

Record existing DNS and Vercel settings. During the agreed window, perform the planned cutover, verify HTTPS, pages, inquiry persistence, both email receipts, staff access and monitoring. If a check fails, stop writes where needed, restore the previous DNS/application route and reconcile any inquiries made during the window; do not overwrite a newer database with an older backup. Keep the previous Vercel deployment available until the company accepts the migration.
