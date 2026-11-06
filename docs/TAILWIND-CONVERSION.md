# Tailwind implementation

The interface now uses Tailwind CSS 4 directly and through reusable component styles. The existing approved visual direction, supplied assets and interaction behavior are retained.

## Styling structure

- `web/src/app/globals.css` imports Tailwind's theme and utility layers and defines the site's palette and Poppins family as Tailwind theme tokens.
- Body typography/colors and shared layout wrappers use utility classes in the React markup, covering public pages, form groups, navigation, footer, staff shell and staff views.
- Shared buttons, fields, cards, typography, spacing and responsive rules use Tailwind utilities through `@apply`. This follows Tailwind's documented component-styling mechanism: https://tailwindcss.com/docs/functions-and-directives#apply-directive.
- Custom CSS remains for supplied-image framing, the logo crop, complex media queries, animation transforms and accessibility behavior. Tailwind does not require removing useful custom CSS.
- Tailwind's optional Preflight reset is omitted because the application already has an explicit base reset. Selective theme/utility imports are documented at https://tailwindcss.com/docs/preflight#disabling-preflight. This avoids changing native form and typography defaults during the conversion.
- The existing four-pixel spacing scale is represented by `--spacing: 4px`. Existing nonstandard dimensions use explicit values so the conversion preserves the reviewed layout.

The initial conversion moved 1,296 declarations across 505 component/media rules into Tailwind utility composition, and added direct utility styling to 13 TSX files. The remaining handwritten CSS supports the same design system rather than substituting for Tailwind's implementation.

## Verification

The ignored `concepts/tailwind-review/` directory holds before/after evidence. `web/tests/e2e/tailwind-parity.mjs` captures or compares visible element geometry and computed visual properties. Reduced-motion mode makes the comparison repeatable; normal motion is checked separately.

- Before/after comparison passed on 60 public page/viewport combinations: 12 routes at 320, 390, 768 and 1440 pixels, plus 844 × 390 landscape. Another 25 comparisons covered the hosted staff inbox, pagination, empty results and both inquiry types at the same five viewports.
- All 85 comparisons matched, with no geometry or computed visual-property differences. Each comparison checks visible elements and 33 computed visual properties.
- Four before/after screenshots were compared as raw pixels: desktop product, mobile inquiry and staff inbox at 390 and 1440 pixels. Every image had zero changed color channels.
- Production build, lint and all 16 integration checks passed.
- Public browser checks passed on 154 layouts, eight interaction groups, three motion groups and nine selected axe WCAG A/AA states. Hosted staff checks passed on 18 layouts, eight interaction groups and four selected axe states. These used browser emulation, not physical phones or a screen reader.
- Staff checks used 52 isolated synthetic Preview inquiries. All 52 were removed after verification, including their related history; a fresh read confirmed zero Preview inquiries remained.
- After release, all eight public interaction groups, three motion groups and nine public axe states passed again on the live domain. The critical-route smoke check covered 320, 390, 768 and 1440 pixels and real staff sign-in/sign-out at phone and desktop widths. Public submission results were simulated, so these release checks sent no emails or inquiries.
- The in-app browser visibly confirmed product-photo switching and the product-specific quote handoff. A screenshot is included with the review evidence.

## Release result — 6 November 2026

Application commit `9b16a62ccee8ec848e5f345dc87dd5806cce9e64` ("Put Tailwind to work") was pushed to `Frontend` and built as Production deployment `dpl_GeqmtcH9F6QJpDWaQU3mLHYkU4m3`. Its immutable hostname is `crunchify-trial-5s3b0bq83-lesters-projects-17d9e437.vercel.app`.

The tested deployment was promoted to https://crunchify.vercel.app/. Project readback confirmed that exact production target, automatic domain assignment restored, the original ignored-build rule preserved and the `web` root unchanged. Public response/CSS readback confirmed actual compiled Tailwind typography, color utilities and the four-pixel spacing token. The production error/fatal log scan returned no entries in the 15-minute review window.

The previous V5 Production deployment `dpl_62ERt6gZj9FrenvicjxiS1qfhvrT` remains available as the rollback point. No database migration was needed. The approved V5 appearance and interactions remain unchanged by the styling conversion.

Run comparisons with `PARITY_MODE=capture` or `PARITY_MODE=compare`. Staff comparisons require `ADMIN_PARITY=1`, the isolated Preview deployment and the existing ignored test credential/token files. Use disposable Preview fixtures only. Public, motion and staff regression scripts accept `TEST_ARTIFACT_DIR` so new evidence does not overwrite earlier release screenshots.

This conversion addresses Tailwind usage. Font-file limitations, temporary trial email routing and the excluded VPS remain separate from this styling change.
