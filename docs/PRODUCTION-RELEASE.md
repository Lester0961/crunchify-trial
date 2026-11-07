# Live release

The trial at [crunchify.vercel.app](https://crunchify.vercel.app/) serves application commit [65e4662](https://github.com/Lester0961/crunchify-trial/commit/65e4662081b367e2a27b82a6fe18a8175b836324). The 7 November 2026 release added formatted confirmations and team notifications for wholesale and brand and media inquiries.

| Item | Value |
| --- | --- |
| Vercel project | `lesters-projects-17d9e437/crunchify-trial` |
| Build directory | `web/` |
| Live deployment | `dpl_FyvcnPoTBGPysZV6q7NFjiTrKajC` |
| Previous deployment for rollback | `dpl_GeqmtcH9F6QJpDWaQU3mLHYkU4m3` |

## Verification for the email release

- Lint, build, and all 18 integration checks passed.
- Both live forms saved their test inquiries. All four messages arrived in the test inbox with formatted HTML and plain text parts.
- The two test inquiries were removed after verification.

## Release procedure

The repository uses `main` for review and `Frontend` for the working branch. Vercel skips automatic production builds from Git. For a site release, stage the reviewed source with the Production environment and keep the live domain on the current version during checks. Verify the staged build, promote it in Vercel, and check the public domain and inquiry flow. Keep the previous deployment ID for rollback.

Repository documentation and readability work can be reviewed independently of the live deployment. [Earlier releases](archive/RELEASES-2026-11-06.md)
