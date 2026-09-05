# Homepage atlas geometry

`us-atlas.json` is projected from the existing `public/data/us-states.geojson` using D3 Geo's Albers USA projection. It contains all 50 states, including Alaska and Hawaii insets, in a `0 0 740 440` view box.

The source polygon winding was normalized to D3's clockwise exterior rings before projecting. The projection fits within `[16, 18]` to `[724, 422]`; coordinates use one decimal place. The `center` values are projected area centroids and position the Ohio label.

This is geography, not activity data. Ohio is a featured navigation entry; the other states' fill does not indicate a review count. Paths are computed ahead of time so the homepage requires no extra mapping library, remote tiles, or image generation at runtime.
