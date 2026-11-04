# Crunchify trial: requirement and evidence tracker

Updated 3 November 2026. The boxes below describe work to do, not completed features. Source abbreviations: **A** = trial agreement, **E** = Mathew's initial project email, **D** = B2B dossier, **B** = Drive brand book, **U** = user's instruction, **P** = our proposed implementation. Concept boards are static PNGs in `wireframes-v3/` and the user's Drive folder.

## Core homepage

- [ ] **A:** B2B hero with **Become a Wholesale Partner** linked to the form. The exact label is shown in corrected boards `01`, `11` and `23`; the actual form link still needs implementation.
- [ ] **A/D:** Show Banana, Jackfruit, Apple and Broccoli Crunch with correct supplied product images. Boards `01`, `11`, `14`.
- [ ] **A:** Show why stock us on the homepage: simple ingredients, no artificial sweeteners and range of flavors. Corrected boards `01`, `11` and `23` show the section; it still needs to be implemented.
- [ ] **A:** Provide links to the inquiry form and a footer with confirmed contact details. Corrected boards show the dossier's website and social channels. The user confirms no business email or phone has been provided; add them once confirmed.
- [ ] **B/U:** Follow the supplied brand identity and use Drive assets. Board `15`; full licensed Talina and Antipasto fonts remain outstanding.
- [ ] **E/A:** Mobile-first, responsive and polished on mobile and desktop. Boards `11`, `16`; real-browser testing required.

## Core inquiry and email

- [ ] **A/D:** Form includes company, contact, email, phone/WhatsApp, business type, territory, estimated monthly volume, products of interest and message. Boards `05`, `18`.
- [ ] **A:** Server-side validation and spam protection; useful validation and error states without losing input. Boards `06`, `20`.
- [ ] **A:** Store each valid submission in PostgreSQL with source page and UTM data. Verify actual test records and safe handling of duplicate attempts.
- [ ] **A:** Deliver sender confirmation **and** company notification. Record test receipts and test recovery when email fails; sender and recipient are pending.
- [ ] **A:** Show honest loading, success and error/retry states. Database save and email delivery are separate outcomes.

## Core stack and handover

- [ ] **A/E:** Next.js App Router, TypeScript, Tailwind and PostgreSQL on Supabase as plain Postgres; versioned migrations and safe seed data. Only the frontend scaffold currently exists.
- [ ] **A:** Deploy on Vercel and provide a shareable preview. No deployment is configured yet.
- [ ] **A:** Docker-ready and environment-based configuration. Dockerfile and local compose exist; no container build has been verified.
- [ ] **A:** Deliver a Git repository and instructions. A local repository exists with no commits or remote; no handover is complete.
- [ ] **E:** Basic SEO and Lighthouse above 90 target; record measured results and conditions rather than promising a score.

## Bonus and supporting paths

- [ ] **A:** Product detail and wholesale pages; early brief proposes listing/filter. Boards `02`–`04`, `14`, `17`, `18`. The dossier supplies four products; the early 5–8 sample count is unresolved, not a reason to invent products.
- [ ] **A:** Brand/media partner form. Boards `07`, `20`; exact fields and recipients are proposed until confirmed.
- [ ] **A:** Admin CRM. Boards `08`–`10`, `16`, `19`, `21`, `22`. Staff login, filtering, statuses and notes are proposed; authenticate and authorize every sensitive operation.
- [ ] **A:** Actual VPS migration with company-approved host/access and verified application, data, email and rollback. Board `13` is only a concept.
- [ ] **P:** Privacy and not-found screens. Boards `12`, `21`; approved privacy wording still needed.

## Final evidence

- [ ] Functional test of core flow from actual browser to stored database record and both email receipts, including negative cases.
- [ ] Tests for each completed bonus; staff-only access denied for unauthenticated users.
- [ ] Recorded viewport, keyboard, accessibility and performance checks; verify mobile-first layout is not crowded or clipped.
- [ ] Vercel preview, tested Docker build, private Git repository and setup/handover documentation; only claim VPS migration when verified.
- [ ] One consolidated feedback round addressed and any missing acceptance criteria or blocked items disclosed. The performance bonus remains subject to company acceptance.
