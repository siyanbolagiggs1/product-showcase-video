# Troubleshooting

## Why per-frame capture, not screen recording

The obvious first approach is Playwright's built-in `context.recordVideo`
(or any screen recorder) — record the browser live, in real time. That
produces a video that's laggy and stuttery, even when the exact same page
feels perfectly smooth just looking at it in a real browser tab.

The cause: live recording captures whatever the browser actually manages
to paint in real time. Anything CSS-expensive on the page —
`backdrop-filter: blur()`, `filter: blur()` on images, several elements
animating at once — can be too slow for a (often software-rendered,
GPU-less) headless browser to paint on schedule. When it falls behind,
frames get dropped or duplicated, and that shows up as jank in the
exported file, even though a real browser with full GPU acceleration
renders the identical CSS smoothly.

`scripts/capture-frames.js` sidesteps this entirely: it pauses every CSS
animation's internal clock
(`document.getAnimations().forEach(a => a.pause())`), then for each output
frame sets every animation's `currentTime` to the exact millisecond that
frame represents, waits one `requestAnimationFrame` tick so the browser
actually paints that state, then screenshots — with no deadline. A frame
is allowed to take 50ms or 3 seconds to render; either way, by the time
it's screenshotted, it's rendered *completely*. The resulting sequence is
exactly as smooth as the CSS animation's own timing says it should be,
regardless of how fast or slow the rendering machine is.

An earlier, in-between attempt tried to fix laggy live recording by
finding the right offset to trim a live-recorded video at. That chased a
symptom — the real problem was frames being silently skipped during a
heavy layout reflow right after the page loaded, not a trimming/offset
math error. If a live-recording approach is ever revisited, that
reflow-during-recording trap is the thing to watch for first.

## Capture looks janky or frozen

- Check `--duration` actually matches the storyboard's CSS animation loop
  length. A mismatch shows up as the animation freezing mid-loop or
  restarting early.
- Check `--settle-ms` (default 1000ms) is long enough for any layout
  triggered by `--inject-css`, or by the page's own load, to fully finish
  *before* animations get paused. If content is still reflowing when the
  clock freezes, every subsequent frame inherits that half-settled layout.

## ffmpeg says "No such file or directory" or isn't found

See the ffmpeg-not-found section in
[capture-and-assemble.md](capture-and-assemble.md) for install commands
per OS. On Windows in particular, a fresh terminal session (e.g. Git Bash)
may not have picked up a `PATH` change from a GUI installer — use the full
binary path, or open a new shell.

## The final video doesn't match what you expected

This is why the sanity-check step in
[capture-and-assemble.md](capture-and-assemble.md) exists — issues caught
this way on past runs include: a mistimed audio drop relative to the
visuals, an off-center CTA line, and captions arriving "attached" to a
screenshot's transition instead of independently. All three passed every
command with exit code 0; only actually looking at extracted frames caught
them. Always do that step, even under time pressure.

## Frame count / render time seems too long

Expected throughput is roughly 1-2.5s per frame on typical hardware (no
GPU acceleration in headless mode), so a 900-frame/30fps/30s video takes
roughly 15-40 minutes. This is inherent to the "unlimited time per frame"
approach that makes the output smooth — run it in the background rather
than trying to speed it up by lowering fps/resolution as a first move
(only trade those off if the target platform's spec actually allows it).
