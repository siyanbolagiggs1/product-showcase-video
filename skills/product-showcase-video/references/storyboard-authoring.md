# Storyboard authoring

The storyboard is a single self-contained HTML file: inline `<style>`,
images embedded as `data:image/...;base64,...` (no external requests — a
strict CSP blocks them anyway if you preview it as an Artifact, and it
means `scripts/capture-frames.js` never depends on network state). Build it
around CSS `@keyframes` animations with a fixed total loop duration, so "one
loop" is exactly one video.

A minimal starting skeleton is at
[assets/templates/storyboard.template.html](../assets/templates/storyboard.template.html).

## Aspect ratio presets

Pick based on where the video will run — ask the user if it isn't obvious:

| Preset | Size | Use for |
|---|---|---|
| Vertical | 1080x1920 | Reels, TikTok, Shorts, Stories |
| Square | 1080x1080 | Instagram feed, LinkedIn |
| Landscape | 1920x1080 | YouTube, a landing-page hero video |

The starter template drives `.stage`'s size off two CSS custom properties,
`--stage-w`/`--stage-h`, and includes a preview-only toolbar with a button
per preset so you can flip between them live in a browser tab while
iterating with the user — see
[Preview before rendering](#preview-before-rendering) below for the caveat
that comes with it. Pass the matching `--width`/`--height` to
`capture-frames.js` for whichever preset you land on (see
[capture-and-assemble.md](capture-and-assemble.md)).

## Scene structure

A typical showcase runs 15-30 seconds. A reasonable default beat structure:

1. **Hook (0-3s)** — product name/logo and the one-line value proposition.
   No screenshot yet; this is about the promise, not the product.
2. **Feature beats (one per key feature, ~3-6s each)** — one screenshot per
   beat with a short caption naming the feature and its benefit, not just
   labeling the screenshot. Cross-fade or slide between beats; keep the
   transition style consistent across all of them.
3. **CTA / end card (last 2-4s)** — product name again, the call to action
   (download, sign up, visit the URL), matching the hook's visual style so
   the loop feels bookended.

Don't cram more than ~4-5 feature beats into a short video — cut to the
features the user said mattered most rather than trying to cover
everything.

## Timing discipline

- The CSS animation's total duration (e.g. `animation: 30s linear infinite`)
  must exactly equal the `--duration` (in ms) passed to
  `capture-frames.js`. A mismatch either cuts the last beat short or
  freezes on a loop restart.
- Give every transition a fixed, deliberate duration rather than leaving
  anything to "however long it takes" — per-frame capture has no real-time
  pressure, but the animation's own authored timing is what determines the
  final pacing, so pacing has to be designed, not discovered.

## Legibility and safe margins

- Keep all text and CTA copy inside a safe margin (~8% of width/height in
  from every edge) — some platforms crop or overlay UI near the edges.
- Use a font size that's legible at the target resolution when played back
  at typical viewing size (a vertical video is often watched small, on a
  phone) — err larger rather than smaller.
- Keep contrast high between text and whatever's behind it; add a subtle
  scrim/gradient behind text over a busy screenshot rather than hoping the
  screenshot is dark enough on its own.
- If the source HTML has extra preview chrome around the animated content
  (e.g. a side-by-side scene-breakdown panel used for authoring), don't
  crop or hide it inside the storyboard itself — author it full-bleed at
  the target size, or use `--inject-css` at capture time (see
  [capture-and-assemble.md](capture-and-assemble.md) and
  [assets/templates/hide-chrome.template.css](../assets/templates/hide-chrome.template.css)).

## Brand colors and fonts

- If the user gave you brand colors/fonts, use them.
- Otherwise, keep the palette neutral (white/black plus one accent pulled
  from the screenshots themselves) so the screenshots stay the visual
  focus rather than competing with an invented brand identity.

## Preview before rendering

Publish the storyboard as an Artifact (fast iteration — the user can watch
it loop in-browser and ask for timing/color/copy changes) or open the HTML
file directly in a browser if Artifacts aren't available in your current
context. Get sign-off on the loop before spending the 15-40 minutes it
takes to capture frames.

If you're using the starter template's preview toolbar to compare aspect
ratios: whichever preset is selected in a browser tab has **no effect** on
the exported video — that comes only from `--width`/`--height` on the
`capture-frames.js` command line, and the toolbar itself must be stripped
out at capture time (it's not part of the final video). See the
`--inject-css` note in [capture-and-assemble.md](capture-and-assemble.md).
