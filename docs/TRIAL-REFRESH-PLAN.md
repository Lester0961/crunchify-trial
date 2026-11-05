# Crunchify trial refresh

The trial uses the supplied logo, product imagery and usable Poppins fonts. Talina and Antipasto are demo/trial files with incomplete or marked glyphs, so Poppins remains the reliable supplied font. Product claims remain grounded in Mathew's materials. VPS migration is excluded at the user's request.

## Visual direction

- Palette: cocoa `#573a2b`, leaf `#365b3b`, pistachio `#e7efda`, oat `#f8f7f0`, white `#ffffff`, ink `#202b21`.
- Keep product photography as the visual focus; add quiet color, generous whitespace, soft corners and a restrained image interaction. Avoid busy animation and respect reduced-motion preferences.
- Mobile is a distinct single-column experience with ample tap targets and spacing. Admin forms and lists remain clear and practical.

## Delivery and validation

1. Refresh shared tokens and interactive states; review home, products, inquiry and admin on mobile and desktop.
2. Run build, lint and focused browser tests, then deploy a preview and inspect the actual rendered UI.
3. Exercise real visitor journeys: browse products, preselect a product, submit wholesale and partner forms using the authorized test inbox, confirm saved data and email results, and check validation.
4. Sign in as admin and check search, detail, status, notes and sign-out with identifiable test records; remove only those records afterward.
5. Deploy and repeat representative checks on the live domain; record results and any genuine limitations. Preserve existing baseline security and avoid inventing business facts.

## Results, 5 November 2026

- Deployed commit `0e4d502` to the preview and https://crunchify.vercel.app/. Build, lint, 16 integration tests and responsive smoke checks passed.
- At 390 px, a browser followed Banana Crunch to a preselected wholesale form, submitted it and updated its admin record. At 1440 px, a browser submitted the brand/media form and updated its admin record. Both journeys passed against preview and production, including attribution and admin search.
- Both emails for each inquiry were accepted and arrived in the temporary test inbox for both environments. The exact synthetic records were removed. Inbox placement may vary in future.
- The supplied Talina and Antipasto files remain demo/trial versions; the supplied Poppins is used. The two browser widths do not replace testing on physical devices or a screen reader.
- VPS work is excluded from the current trial scope at the user's request. Existing checklist entries that depend on further company input are not prerequisites for this trial refresh, but remain relevant if the site is later used as a permanent business service.
