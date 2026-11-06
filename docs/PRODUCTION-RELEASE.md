# Frontend production release

Release source: `Frontend`. GitHub's default branch remains `main`.

Public address: https://crunchify.vercel.app/

The release contains the product-story redesign documented in `VISUAL-DIRECTION-V4.md`: supplied logo and photographs, Poppins, updated public pages and forms, and the separate staff workspace. The application source matches the version already reviewed at nine viewport widths.

## Release procedure

1. Commit and push the reviewed UI on `Frontend`.
2. Build a new deployment using Production environment values, with automatic domain assignment temporarily disabled.
3. Check the candidate, restore the original project settings, and manually promote that exact production deployment.
4. Check the public domain, mobile and desktop layouts, navigation, product selection, forms and staff access.

The production ignored-build rule stays `if [ "$VERCEL_ENV" = "production" ]; then exit 0; else exit 1; fi`. The explicit release build uses a one-off build override; ordinary pushes do not automatically publish a production build.

## Rollback reference

Before this release, `crunchify.vercel.app` points to `dpl_F8ozE42Zq9KLzEi9JygBzbph1Swm` (`crunchify-trial-fik4mrhxj-lesters-projects-17d9e437.vercel.app`). Preserve this deployment. If the release has a blocking problem, roll production traffic back to that deployment through Vercel and verify the public domain again.

No database migration or real inquiry/email transaction is required for this UI release. Use simulated form responses and existing read-only staff views for release checks.

## Release result — 6 November 2026

- Released UI commit `8f4f02bb404a4e7bf1f8bcb29388ac739946320d` from `Frontend`.
- Built with Production environment values as `dpl_HJCKpPvArAdRPw5fbLkUgDBSKxJa`. The immutable deployment is `crunchify-trial-rbkh2z6l8-lesters-projects-17d9e437.vercel.app`.
- Seven candidate routes returned HTTP 200 with the expected new page content before promotion. The public domain continued to serve the prior deployment during these checks.
- Promoted that exact production build. Vercel confirmed completed mappings for `crunchify.vercel.app` and `crunchify-trial.vercel.app`.
- Restored automatic domain assignment and the original production ignored-build rule before promotion. Production Git branch tracking remains `main`; this was an explicit release from `Frontend`.
- Lint, production build and all 16 integration checks passed. The application source matches the previously reviewed nine-width redesign.
- Live browser checks passed for eight routes at 390 and 1440 pixels, six selected WCAG A/AA axe audits, four scroll chapters, reduced-motion fallback, menu Escape focus and desktop resizing, and simulated form failure/retry/pending states. There were no uncaught browser exceptions.
- The critical-route smoke check passed at 320, 390, 768 and 1440 pixels. It also checked category filtering, quote preselection, attribution, simulated submission, no-JavaScript messaging, and real staff sign-in/sign-out at mobile and desktop widths.
- These release checks created no inquiries or emails and did not edit any existing inquiries. The prior production deployment listed above is retained for rollback.
