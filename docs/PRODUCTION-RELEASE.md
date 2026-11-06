# Frontend production release

Release source: `Frontend`. GitHub's default branch remains `main`.

Public address: https://crunchify.vercel.app/

The current release is V5, documented in `INTERACTION-DESIGN-V5.md`. It preserves the supplied logo, photographs, Poppins and the liked landing-page direction, and adds the working galleries, smoother motion, grouped forms and staff feedback. V4 evidence is retained below as history.

## Release procedure

1. Commit and push the reviewed UI on `Frontend`.
2. Build a new deployment using Production environment values, with automatic domain assignment temporarily disabled.
3. Check the candidate, restore the original project settings, and manually promote that exact production deployment.
4. Check the public domain, mobile and desktop layouts, navigation, product selection, forms and staff access.

The production ignored-build rule stays `if [ "$VERCEL_ENV" = "production" ]; then exit 0; else exit 1; fi`. The explicit release build uses a one-off build override; ordinary pushes do not automatically publish a production build.

## Rollback reference

Before V5, `crunchify.vercel.app` pointed to V4 deployment `dpl_HJCKpPvArAdRPw5fbLkUgDBSKxJa` (`crunchify-trial-rbkh2z6l8-lesters-projects-17d9e437.vercel.app`). Preserve this deployment. If V5 has a blocking problem, roll production traffic back to that deployment through Vercel and verify the public domain again.

No database migration is required. Staff changes and real form/email checks were isolated to Preview. Production verification used simulated public-form responses and real staff sign-in/sign-out without changing customer records.

## V4 release result — 6 November 2026

- Released UI commit `8f4f02bb404a4e7bf1f8bcb29388ac739946320d` from `Frontend`.
- Built with Production environment values as `dpl_HJCKpPvArAdRPw5fbLkUgDBSKxJa`. The immutable deployment is `crunchify-trial-rbkh2z6l8-lesters-projects-17d9e437.vercel.app`.
- Seven candidate routes returned HTTP 200 with the expected new page content before promotion. The public domain continued to serve the prior deployment during these checks.
- Promoted that exact production build. Vercel confirmed completed mappings for `crunchify.vercel.app` and `crunchify-trial.vercel.app`.
- Restored automatic domain assignment and the original production ignored-build rule before promotion. Production Git branch tracking remains `main`; this was an explicit release from `Frontend`.
- Lint, production build and all 16 integration checks passed. The application source matches the previously reviewed nine-width redesign.
- Live browser checks passed for eight routes at 390 and 1440 pixels, six selected WCAG A/AA axe audits, four scroll chapters, reduced-motion fallback, menu Escape focus and desktop resizing, and simulated form failure/retry/pending states. There were no uncaught browser exceptions.
- The critical-route smoke check passed at 320, 390, 768 and 1440 pixels. It also checked category filtering, quote preselection, attribution, simulated submission, no-JavaScript messaging, and real staff sign-in/sign-out at mobile and desktop widths.
- These V4 release checks created no inquiries or emails and did not edit any existing inquiries. Its earlier rollback point was `dpl_F8ozE42Zq9KLzEi9JygBzbph1Swm`.

## V5 release result — 6 November 2026

- Released application commit `39b2c4fb8e44f27c7a98f0f7f41c7a265fa199ea` from `Frontend`. The two implementation commits use the requested casual messages: “Make the pages feel smoother” and “Polish the last few details.”
- Built with Production environment values as `dpl_62ERt6gZj9FrenvicjxiS1qfhvrT`, immutable address `crunchify-trial-n5zjz9fac-lesters-projects-17d9e437.vercel.app`. Build duration was about 20 seconds; state `READY`.
- Eight candidate routes returned HTTP 200 with the expected new page content before promotion. Protected candidate checks used the existing authenticated Vercel CLI. The public domain continued to serve V4 during staging.
- Restored automatic domain assignment before promoting the exact candidate. The original ignored-build rule, `web` root directory and Production Git tracking of `main` remain in place. Verified that the project's production target now points to the V5 deployment and that the public domain serves the new gallery, form and staff login.
- Lint, production build and all 16 integration checks passed. Local/Preview UI review covered 154 public layouts, 18 staff layouts, eight public interaction groups, three motion groups, eight staff interaction groups and 13 axe A/AA states with no reported violations. Widths ranged from 320 to 1440 pixels and included short landscape screens.
- Real Preview staff tests verified status/note saves, change history, retained drafts/errors, search, combined filters, pagination, filtered Back links, native form fallback and sign-out. Both public forms were submitted through actual buttons; the database recorded them and Brevo accepted all four email requests. Provider acceptance is not proof of inbox arrival.
- Removed all 54 owned Preview test inquiries after readback, including their related history. Verified that Preview inquiry count returned to zero. Production customer records were not changed.
- After promotion, all eight public interaction groups, three motion groups and nine public axe states passed again on the live domain. The critical-route smoke test passed at 320, 390, 768 and 1440 pixels, including real staff sign-in/sign-out at phone and desktop widths. The visible in-app browser also confirmed photo switching and product-specific quote selection, with separate desktop/phone screenshots.
- Product-page Lighthouse 13.6.0 mobile lab runs against the local production build scored 89, 92 and 93 for performance (median 92), with accessibility and best practices at 100. LCP ranged from 3.1 to 3.3 seconds, total blocking time from 80 to 210 ms and CLS was 0.002. The trial's existing `noindex` remains intentional. These are lab measurements; physical-phone and field results are unavailable.
- The post-release production error/fatal log scan returned no entries in the 15-minute window. The Drains listing endpoint returned 404, so drain configuration was not verified; no new monitoring service was configured. GitHub reported no workflow runs for `Frontend`; the reported test results are the completed local and browser checks.
- Forty-one actual application screenshots were uploaded into the existing user Drive folder and individually verified by metadata readback. The earlier concepts remain available separately. The updated plan and release package accompany these screenshots.
- V4 deployment `dpl_HJCKpPvArAdRPw5fbLkUgDBSKxJa` remains the rollback point. The VPS remains excluded as requested.
