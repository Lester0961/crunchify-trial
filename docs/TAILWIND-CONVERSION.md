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

- Before/after comparison passed on 60 public page/viewport combinations: 12 routes at 320, 390, 768 and 1440 pixels, plus 844 × 390 landscape.
- No geometry or computed visual-property differences were found in those comparisons.
- Desktop product and mobile inquiry screenshots were also compared as raw pixels: zero changed color channels in either image.
- Production build and lint passed. Public interactions, motion and hosted staff checks are recorded in the release result once completed.

Run comparisons with `PARITY_MODE=capture` or `PARITY_MODE=compare`. Staff comparisons require `ADMIN_PARITY=1`, the isolated Preview deployment and the existing ignored test credential/token files. Use disposable Preview fixtures only. Public, motion and staff regression scripts accept `TEST_ARTIFACT_DIR` so new evidence does not overwrite earlier release screenshots.

This conversion addresses Tailwind usage. Font-file limitations, temporary trial email routing and the excluded VPS remain separate from this styling change.
