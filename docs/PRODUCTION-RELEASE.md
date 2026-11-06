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
