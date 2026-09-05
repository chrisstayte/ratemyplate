# Selected typography: Instrument — September 5, 2026

The user selected option 1 from the in-conversation typography comparison:
Instrument Serif headings with Instrument Sans body text and controls.

- Applied through root font variables and the shared sans, serif, and display
  tokens, covering public pages, administrative pages, dialogs, and the globe.
- Included real regular and italic faces, with Sans weights 400–700. Four local
  WOFF2 assets total 92,416 bytes; font licenses are bundled alongside them.
- Display tracking is now -0.02em, matching the chosen specimen. Removed the
  atlas and globe's tighter heading overrides. License plate artwork keeps its
  specialized typeface.
- `pnpm build`: passed, including TypeScript and all routes.
- Focused ESLint check of the changed TypeScript components: passed.
- Production HTTP checks: `/`, `/OH`, `/OH/RAPTER`, `/media`, `/privacy`, and
  `/globe` return 200 with both root font variables and all four font preload
  headers. Every font asset returns 200 with a valid WOFF2 signature.
- Local production preview refreshed at `http://127.0.0.1:3001/`.
- Visual verification for this font change remains pending: the computer-use
  tool reported that the Mac was locked. The screenshots and visual findings
  below document the previous Georgia/Arial typography, not the new fonts.

---

# Previous site-wide editorial reskin — September 5, 2026

final result: passed

## Target and evidence

- Source visual truth: `/Users/chris/.codex/attachments/8e839de2-04c5-41fb-b185-83a7b34a7d73/codex-clipboard-235a2354-94b6-4566-8fc7-ef685d54f713.png` (2638 × 2956 pixels).
- Brief: extend the existing atlas section's editorial design language across the entire site, with very subtle green. This is a palette and typography adaptation, not a pixel-identical recreation of the old surrounding interface.
- Final production preview: `http://127.0.0.1:3001/`.
- Full-page evidence: `images/reskin/home-light.png` and `images/reskin/home-dark.png` (1280 × 2873 pixels).
- Focused comparison: `images/reskin/atlas-comparison.png` (2248 × 546 pixels), reference left and final implementation right.
- Comparison normalization: cropped the source atlas at x=207, y=881, width=2225, height=1091 and resized it to 1112 × 546; cropped the final browser capture at x=84, y=100, width=1112, height=546. Browser chrome was excluded. The source is approximately twice the implementation's image density. The browser reports DPR 2, while its screenshot API returns CSS-sized captures.
- Desktop viewport: 1280 × 720 CSS px. Tablet: 768 × 1024. Mobile: 390 × 844.
- Additional evidence: `images/reskin/atlas-light.png`, `atlas-dark.png`, `home-mobile.png`, `plate-mobile.png`, `sign-in-mobile.png`, `state-mobile.png`, `media-tablet.png`, `terms-desktop.png`, `globe-desktop.png`, and `globe-mobile.png`.
- States: signed out; light and dark themes; search validation and successful navigation; selected Ohio on the globe; filtered and customized Ohio media preview; sign-in dialog open.

## Visual comparison

The normalized source and implementation were opened together in one comparison image. The split atlas composition, serif headline, italic emphasis, geographic shapes, plate illustration, spacing, and CTA placement remain recognizable. The new surface is more neutral, the heading is charcoal, and the green CTA is less saturated, as requested. The same treatment now extends to the homepage, state and plate pages, account and favorites headings, legal content, media gallery, shared dialogs and menus, dashboard headings and chart tokens, and the immersive globe.

- Fonts and typography: Georgia matches the reference's editorial heading family; Arial provides quiet, readable body and control text. Plate artwork retains its specialized font. Eyebrows use consistent small uppercase lettering. Legal text has a wider readable measure and 28 px line height.
- Spacing and layout rhythm: page grids and the atlas split are preserved. Shared cards use 12 px corners, actions use 6 px corners, and overlays use restrained borders. Mobile controls stack without horizontal overflow. The final mobile plate input is measured at 44 px high; document width equals viewport width at 390 px.
- Colors and tokens: warm paper surfaces and nearly neutral charcoal dominate. Muted forest green identifies actions; sage is limited to the atlas and small details. Gold rating stars and terracotta featured-state emphasis retain semantic distinction. Calculated text contrast is 11.43:1 for light body text, 4.58:1 for light muted text, 8.08:1 for light buttons, 14.06:1 for dark body text, 7.23:1 for dark muted text, and 7.82:1 for dark buttons.
- Image quality: existing state plate SVGs, the atlas geometry, and the globe basemap are reused. No artwork was replaced with a placeholder. The final comparison shows preserved proportions and sharp plate imagery. Globe stars and lighting are subdued while state markers remain visible.
- Copy and content: the homepage's editorial headline and section labels fit the product; existing search, reviews, legal copy, and data remain intact. The animated plate display remains as a secondary detail.

## Findings and comparison history

1. Desktop source comparison: the quieter palette and typography match the requested direction. The absent State map link belongs to concurrent workspace removal of the standalone map route; this work preserved that removal.
2. P2 found during mobile review: the plate input compressed to approximately 28 px when its flex direction changed. Fixed with an explicit 44 px minimum height and desktop-only flex growth. Recaptured the final production homepage in `home-mobile.png` and verified 44 px height and no overflow. Resolved.
3. Globe polish: removed violet gradients, softened map and marker colors, restored the transparent vignette after palette conversion, and corrected sentence spacing when the mobile line break is hidden. Desktop and mobile screenshots confirm readable controls and state details.
4. Final comparison: no actionable P0/P1/P2 visual findings remain. The target and final atlas were compared again in `atlas-comparison.png` after the refinements.

## Interaction and build checks

- Empty search shows an accessible error; plate entry, state selection, and search navigated to `/OH/RAPTER`.
- Plate reviews and tabs render within mobile width. The sign-in dialog opens and closes with provider buttons and visible focus styling. OAuth login was not submitted.
- Globe loads, pauses rotation, selects Ohio, displays its details, and navigates to `/OH`. Mobile controls remain reachable.
- Media text customization and native state filtering display one customized Ohio plate.
- Light/dark switching works. Desktop, tablet, and mobile routes were visually inspected.
- Production browser console: no warnings or errors on the final fresh homepage session. Development-only hydration messages were seen while editing/streaming, and an offscreen automated Radix selection produced a focus error; visible menu selection and the final production session were successful.
- `pnpm build`: passed, including TypeScript and all route compilation. The initial sandboxed build could not bind its CSS worker port; the authorized build completed successfully.
- `pnpm test`: 24 tests passed across 3 files.
- `pnpm lint`: no errors; 2 existing React Compiler compatibility warnings in the table and review form.
- `git diff --check`: passed.

## Test limits and follow-up

Authenticated account, favorites, and administrative data screens were not browser-tested because no authenticated session was available; their shared tokens and heading changes were included in the successful production build. Posting reviews, OAuth sign-in, and downloads were not submitted as part of this visual reskin. No P3 visual polish is required for handoff.

---

## Previous design QA history

# Globe Light-Mode Space Design QA

- Source visual truth: `/Users/chris/.codex/visualizations/2026/07/22/019f8a1e-11c2-7dc3-8e89-3a0a774764fd/globe-qa/globe-dark-stars.png`
- Implementation screenshot: `/Users/chris/.codex/visualizations/2026/07/22/019f8a1e-11c2-7dc3-8e89-3a0a774764fd/globe-qa/globe-light-stars.png`
- Combined comparison: `/Users/chris/.codex/visualizations/2026/07/22/019f8a1e-11c2-7dc3-8e89-3a0a774764fd/globe-qa/globe-dark-light-comparison.png`
- Source and implementation pixels: 1365 × 880 each
- CSS viewport: 1365 × 880
- Device density: 1
- State: `/globe` at the same viewport and globe position, comparing dark and light themes

## Full-view comparison evidence

The dark and light captures were placed side by side in a single comparison image. Both themes now preserve a dark space context. The light variant shifts the star field toward cooler navy, reduces the stars' visual competition, and keeps the white globe as the clear focal point. The globe size, position, markers, controls, and activity summary remain aligned across themes.

## Focused region comparison evidence

A separate crop was not needed. The full-view comparison renders the atmosphere rim, star density, globe labels, activity markers, and controls at readable scale.

## Required fidelity surfaces

- Fonts and typography: unchanged; labels and controls retain the existing hierarchy and optical weight.
- Spacing and layout rhythm: unchanged; globe scale, map padding, controls, and activity summary remain in their existing positions.
- Colors and visual tokens: light space uses `rgb(8, 26, 44)` as its fallback and the dedicated cool-blue star asset; the lighter globe and control surfaces retain their theme contrast.
- Image quality and asset fidelity: the generated 1672 × 941 JPEG is sharp at the tested viewport, has no visible seams or compression artifacts, and uses a restrained astrophotography treatment.
- Copy and content: unchanged.

## Interaction and runtime checks

- Theme switching was exercised through the visible Light and Dark menu items.
- Light mode loaded `/images/globe/night-sky-light.jpg`.
- Dark mode continued loading `/images/globe/night-sky.jpg`.
- Globe rotation, map controls, markers, and theme controls remained visible.
- Browser console checked: no new errors from this change. A pre-existing Radix dropdown hydration-ID mismatch remains in local development and is outside this visual change.

## Findings

- No actionable P0, P1, or P2 visual differences.
- P3 follow-up: star brightness can be tuned further after real-user preference testing, but the current balance already keeps the light globe dominant.

## Comparison history

- Initial comparison: passed. No P0/P1/P2 fixes were required after the browser capture.

final result: passed

---

# Nationwide Map Section Redesign QA

- Source visual truth: `/Users/chris/.codex/visualizations/2026/07/23/019f8ebb-4cb5-78a1-b45d-181e22bfb41c/map-section-implementation.png`
- Implementation screenshot: `/Users/chris/.codex/visualizations/2026/07/23/019f8ebb-4cb5-78a1-b45d-181e22bfb41c/map-section-nationwide-desktop.png`
- Mobile screenshots: `/Users/chris/.codex/visualizations/2026/07/23/019f8ebb-4cb5-78a1-b45d-181e22bfb41c/map-section-nationwide-mobile.png` and `/Users/chris/.codex/visualizations/2026/07/23/019f8ebb-4cb5-78a1-b45d-181e22bfb41c/map-section-nationwide-mobile-lower.png`
- Combined comparison: `/Users/chris/.codex/visualizations/2026/07/23/019f8ebb-4cb5-78a1-b45d-181e22bfb41c/map-section-nationwide-comparison.png`
- Desktop browser viewport: 1280 × 720 CSS px at device pixel ratio 1
- Responsive check: 390 × 844 CSS px
- State: homepage map call-to-action in light theme, with the section in viewport

## Full-view comparison evidence

The side-by-side comparison shows the requested change from a light split-panel card with a state-specific Ohio animation to a single, dark nationwide experience. The generated U.S. road-activity artwork now acts as an atmospheric backdrop rather than an isolated illustration. Copy, supporting proof points, and the primary action stay grouped on the left, while the nationwide visual creates a clear destination cue on the right.

## Focused region comparison evidence

The full desktop captures keep the complete feature card legible at 1:1 density, so no additional detail crop was needed. The separate mobile captures cover both the copy/CTA area and the full U.S. artwork with its lower rounded edge.

## Findings

- No actionable P0, P1, or P2 visual issues remain.
- Fonts and typography: the existing Inconsolata family is preserved; the shorter headline creates a stronger scan path and stays balanced at desktop and mobile sizes.
- Spacing and layout rhythm: the section is one unified surface on desktop and mobile, with no detached sub-card or empty panel. Mobile spacing remains consistent with the 20 px page gutter and has no horizontal overflow.
- Colors and visual tokens: the midnight navy base and restrained violet/magenta activity lights connect with the existing Live Globe accent while giving this section its own clear hierarchy.
- Image quality and asset fidelity: the generated nationwide artwork remains sharp at both tested sizes. The desktop-specific wide variant adds blended negative space behind the copy without a visible seam.
- Copy and content: the section now leads with an inviting, compact message, makes the nationwide scope explicit, and keeps the interactive-map action unambiguous.
- Interaction: the whole feature card successfully navigated to `/map`; the navbar contains zero `/map` links; the map page remains available.
- Browser console: no errors were recorded during the final homepage and click-through checks.

## Comparison history

- Source finding: the state-specific Ohio animation made the feature feel narrow and visually disconnected from its nationwide purpose.
- Fixes made: removed the state cycler, replaced the split layout, generated nationwide U.S. activity artwork, created a responsive wide asset, tightened the copy, and rebuilt the feature as a single clickable destination.
- Post-fix evidence: desktop and mobile views rendered without overflow, the entire card reached `/map`, the navbar stayed map-link-free, and no P0/P1/P2 issues remained.

final result: passed

---

# Homepage Map Section Redesign QA

- Source visual truth: `/var/folders/rl/hs4j_pfj6n5ct93hnlm1cbwh0000gn/T/codex-clipboard-05870daa-b154-40d0-9a2d-b1eed044ea63.png`
- Source section crop: `/Users/chris/.codex/visualizations/2026/07/23/019f8ebb-4cb5-78a1-b45d-181e22bfb41c/map-section-source.png`
- Implementation screenshot: `/Users/chris/.codex/visualizations/2026/07/23/019f8ebb-4cb5-78a1-b45d-181e22bfb41c/map-section-implementation.png`
- Combined comparison: `/Users/chris/.codex/visualizations/2026/07/23/019f8ebb-4cb5-78a1-b45d-181e22bfb41c/map-section-comparison.png`
- Browser viewport: 1361 × 1241 CSS px at device pixel ratio 1
- Responsive checks: 390 × 844 CSS px; light and dark themes
- State: homepage map call-to-action, light theme, card in viewport
- Source pixels: 2546 × 1596; section crop 1150 × 420
- Implementation pixels: 1112 × 406; section CSS size 1112 × 406
- Density normalization: source crop was resized with contain-fit to 1112 × 406 for the combined comparison; implementation was captured at 1:1 CSS-to-pixel density

## Full-view comparison evidence

The combined comparison shows the requested intentional redesign: the detached heading and quiet utility card were replaced by one unified destination card with a benefit-led headline, larger CTA, activity label, supporting feature chips, and a larger state animation. The section remains aligned to the existing 1112 px content grid and keeps the surrounding homepage rhythm intact.

## Focused region comparison evidence

The source and implementation section crops are readable at full resolution, so a smaller detail crop was not needed. Typography, CTA contrast, state artwork quality, borders, and supporting labels are all visible in the combined comparison.

## Findings

- No actionable P0, P1, or P2 issues remain.
- Fonts and typography: the existing Inconsolata family is preserved; the new 36 px desktop headline and 30 px mobile headline establish a clearer hierarchy without clipping or truncation.
- Spacing and layout rhythm: desktop uses a balanced two-column split; mobile stacks the message and preview with consistent 20 px outer margins and no horizontal overflow.
- Colors and visual tokens: the new purple accents match the existing Live Globe and homepage badge language; light and dark variants maintain readable contrast.
- Image quality and asset fidelity: the existing animated state artwork is reused at a larger, sharp size through `next/image`; no placeholder or code-drawn replacement was introduced.
- Copy and content: the new copy leads with the user benefit and names the destination clearly; the CTA is explicit and the entire card remains clickable.
- Interaction: the card successfully navigated to `/map`, the navbar no longer exposes a Map link, and `/map` remains available.
- Browser console: no errors were recorded during the final homepage check.

## Comparison history

- Initial source finding: the map section had weak hierarchy, a low-emphasis text link, and substantial unused visual space.
- Fixes made: unified the section into a feature card, enlarged and clarified the CTA, strengthened benefit-led copy, expanded the animated preview, added state/review cues, added hover and focus treatment, and removed only the navbar Map link.
- Post-fix evidence: desktop, mobile, light, and dark views rendered without overflow; the card click-through reached `/map`; no P0/P1/P2 issues remained.

## Follow-up polish

- P3: as more state animation assets are added, the existing cycler will rotate them automatically and make the nationwide preview feel even more varied.

final result: passed
