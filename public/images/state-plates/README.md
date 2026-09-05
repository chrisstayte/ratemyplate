# State plate artwork

The 50 postal-code SVGs are the supplied `ratemyplate-50-states.zip` artwork, copied without modification. These are stylized illustrations of selected plate variants. Design references are in [SOURCES.md](./SOURCES.md).

Each image has a `600 × 300` view box (2:1). Static lettering is outlined; the plate number is rendered separately with the application's local `LICENSE-PLATE-USA.ttf` font.

The original manifest is stored at `src/lib/state-plates.json`. `src/lib/plate-artwork.ts` uses its per-state serial regions and colors, and adjusts the font size and baseline to fit this app's font metrics. The shared `PlateArtwork` SVG scales the background and serial together. SVG `textLength` keeps complete values within the available width, including legacy values with spaces. Very long values remain visible but become condensed.

Full-size plates, linked thumbnails, loading placeholders, and social preview images preserve the 2:1 ratio. DC, Puerto Rico, the Virgin Islands, and unknown state codes use a neutral labeled fallback because they are not included in this collection.

## Media library

The public `/media` page, linked from the footer, showcases all 50 designs in state-name order. Visitors can filter by state and use one optional text field to update every preview. Clearing the field restores blank plates. Custom text supports up to 12 letters, numbers, spaces, or hyphens.

Each plate can be downloaded as SVG, PNG, or JPG. Blank SVG downloads preserve the original artwork. Custom SVGs inline the serial as vector paths using `opentype.js` and the local plate font, so the files have no external image or font dependencies. The parser and font load only when a custom download needs them. PNG and JPG downloads render at 2400 × 1200 pixels in the browser; SVG and PNG preserve transparent edges, and JPG uses white behind the artwork. Downloads do not require an account or send custom text to a server.

`src/lib/plate-export.test.ts` verifies all original blank SVGs, standalone custom exports, the actual glyph bounds across all 50 serial regions, supported characters, filenames, and unavailable-artwork errors.

## Integration verification

- Parsed all 50 SVGs: complete state coverage, `600 × 300` dimensions, 2:1 view boxes, and serial bounds inside each image.
- Measured browser text bounds against each state's serial region for nine values: `R8MYPL8`, `WWWWWWW`, `IIIIIII`, `1234567`, `1`, `A`, `ABC 1234`, `ABCDEFG 1234567`, and `WWWWWWW WWWWWWW WWWWWWW`. All 450 checks passed with the loaded local plate font.
- Checked full-size plates, thumbnails, and skeletons at viewport widths of 320, 375, 768, and 1440 pixels: no horizontal overflow or aspect-ratio distortion.
- Visually reviewed a rendered contact sheet of all 50 states, mobile thumbnails, and full-size examples, including the narrower South Dakota and Wyoming text regions.
- Checked the Ohio state and plate-detail pages, plus generated social previews for Ohio, South Dakota, Wyoming, California, and DC.

Share metadata uses the current deployment's origin, so dev links load dev images. General pages default to an Ohio `R8MYPL8` image; state pages use that state's artwork, and plate pages preserve their state and serial. Open Graph and Twitter use the same versioned image URL. `public/og.png` also contains the Ohio default for clients that retain the old image path.
