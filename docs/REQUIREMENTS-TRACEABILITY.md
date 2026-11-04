# Crunchify trial: requirement and evidence tracker

Updated 4 November 2026. Sources: A = trial agreement; D = B2B dossier; B = Drive brand book; U = user's instructions; P = proposed design.

## Core

- [x] A: Homepage has the wholesale CTA, four products, why-stock-us section, and inquiry links. Footer uses dossier-supplied website and social channels. Business email and phone were not supplied.
- [ ] B/U: Supplied palette, logo, product imagery and mobile-first layouts are in use; complete Talina and Antipasto web fonts remain outstanding; the user confirmed supplied imagery is approved.
- [x] A/D: Wholesale form includes all nine agreed fields; server validation and spam checks are implemented.
- [x] A: Synthetic inquiries were saved to PostgreSQL with source, UTM source/campaign and selected products. A conflicting duplicate submission ID was rejected; test records were removed. Further abuse testing remains.
- [ ] A: Both confirmation and notification were delivered to the user's own temporary address through the public deployment on 4 November 2026. The notification landed in Spam. The company-approved authenticated sender/domain and notification recipient remain missing.
- [x] A: Next.js App Router, TypeScript, Tailwind, Supabase PostgreSQL, migrations, seed data, Vercel and private Git repository are in place. Public address: https://crunchify.vercel.app/.
- [x] A: Docker image built and ran on a GitHub Actions Linux host with disposable PostgreSQL; synthetic inquiry, admin, and origin checks passed. Real VPS deployment, HTTPS proxy and company email remain unverified.
- [x] E: On 4 November, a live mobile Lighthouse run measured performance 92, accessibility 100 and best practices 100; SEO was 63 because production indexing remains disabled.

## Bonus and supporting

- [x] A: Four product detail pages and wholesale page implemented; dossier-backed ingredients and confirmed sizes displayed, Apple size omitted.
- [x] A: A production brand/media test stored the proposed collaboration field and UTM source, and both emails reached the temporary address. The notification was classified as Spam; the company's final routing and sender require confirmation.
- [ ] A: Admin sign-in, list, filters, details, status, notes and email retry are implemented; deployed sign-in, saving a test status and filtered search were verified. Security and recovery review remains.
- [ ] A: The user requested VPS migration preparation for later. The runbook is `VPS-MIGRATION.md`; an actual migration requires an approved host, access and a verified cutover and rollback.
- [ ] P: Privacy page uses provisional text and requires company approval.

## Remaining acceptance

- [ ] Verify both actual email receipts, failure handling and safe recovery using approved sender and recipients.
- [ ] Complete outstanding physical-device and screen-reader testing, SEO launch decision, and final security and company-email checks. Automated mobile/desktop, Lighthouse, security, and isolated Docker checks are recorded in the checklist.
- [ ] Resolve full brand fonts, business contact details, the pictured banana size discrepancy, Apple size, written post-kickoff summary and final acceptance criteria with the company.
- [ ] Provide handover and address the company's consolidated feedback. The bonus remains subject to company acceptance.

Detailed work plan: `EXECUTION-GOAL.md`. Source PDFs remain in the ignored local `reference/` directory.
