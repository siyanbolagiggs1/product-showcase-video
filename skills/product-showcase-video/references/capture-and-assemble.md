# Capture and assemble

## Capture frames

Run from the repository root, where `node_modules/playwright` lives:

```bash
node skills/product-showcase-video/scripts/capture-frames.js \
  --html "path/to/storyboard.html" --duration 15000 --fps 30 \
  --width 1080 --height 1920 --out ./frames-out \
  --inject-css skills/product-showcase-video/assets/templates/hide-chrome.template.css
```

- `--duration` must match the storyboard's own CSS animation loop length in
  ms — see the timing discipline note in
  [storyboard-authoring.md](storyboard-authoring.md).
- `--width`/`--height` should match one of the aspect-ratio presets in
  [storyboard-authoring.md](storyboard-authoring.md) — and, if you built on
  the starter template, whichever preset you actually want, **not**
  whatever the preview toolbar happened to be showing last (the toolbar is
  browser-preview-only and has no effect on capture).
- If the storyboard HTML has extra chrome around the animated stage — the
  starter template's aspect-ratio preview toolbar is exactly this case —
  write a small CSS file that hides everything except the stage and blows
  it up to fill the viewport, and pass it as `--inject-css that-file.css`.
  [assets/templates/hide-chrome.template.css](../assets/templates/hide-chrome.template.css)
  already does this (its `body > *:not(.stage)` rule hides the toolbar and
  any other sibling of `.stage`) — reuse it as shown above, or adapt it if
  your storyboard's chrome doesn't live directly under `<body>`. Skip this
  flag only if the HTML is authored full-bleed with no extra chrome at all.
- This is slow by design — roughly 1-2.5s per frame, so ~15-40 minutes for
  a 900-frame/30fps/30s video. Run it in the background and check back
  rather than blocking on it. See
  [troubleshooting.md](troubleshooting.md) for *why* it's built this way.

## Assemble frames + audio into the final MP4

With an audio track:

```bash
ffmpeg -y -framerate 30 -i frames-out/frame_%05d.png -i audio.mp3 \
  -map 0:v -map 1:a -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -c:a aac -b:a 192k -shortest -movflags +faststart out.mp4
```

Without audio (silent export — a reasonable default for feeds that
autoplay muted; pair it with burned-in captions in the storyboard itself if
the message needs to land without sound):

```bash
ffmpeg -y -framerate 30 -i frames-out/frame_%05d.png \
  -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -movflags +faststart out.mp4
```

If the audio track is shorter than the video, loop it; if longer, trim it
to match — `-shortest` above trims audio *or* video to whichever is
shorter, which is usually right when the storyboard's duration was chosen
deliberately. To loop a shorter track instead of trimming the video:

```bash
ffmpeg -y -framerate 30 -i frames-out/frame_%05d.png -stream_loop -1 -i audio.mp3 \
  -map 0:v -map 1:a -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
  -c:a aac -b:a 192k -shortest -movflags +faststart out.mp4
```

## Audio options

Ask the user which applies rather than assuming:

- **They supply a track** (music or voiceover). Confirm they hold the
  rights for the intended use (a personal post vs. a paid ad can have
  different licensing requirements) if it isn't obvious — don't assume a
  file they hand you is cleared for every use.
- **No audio.** A legitimate, common choice — many social placements
  autoplay muted anyway. Lean on burned-in captions/copy in the storyboard
  instead of relying on narration to carry the message.
- **A track they point you to** (e.g. a royalty-free library they name).
  Use exactly what they point you to; don't source or download music on
  their behalf.

## Sanity-check the final file

Pull frames back out of the *final* MP4 (not the intermediate PNGs) at a
few timestamps spanning the whole video and look at them:

```bash
ffmpeg -y -ss 00:00:05 -i out.mp4 -frames:v 1 check_05s.png
ffmpeg -y -ss 00:00:15 -i out.mp4 -frames:v 1 check_15s.png
ffmpeg -y -ss 00:00:25 -i out.mp4 -frames:v 1 check_25s.png
```

Check for: audio landing where it should relative to the visuals, text
staying centered/legible, and captions arriving independently rather than
looking "attached" to a screenshot. Don't call the pipeline done just
because every command exited 0 — see
[troubleshooting.md](troubleshooting.md) for real issues this step has
caught.

## ffmpeg not found

If `ffmpeg` isn't on `PATH` in your current shell:

- **Windows**: `winget install --id Gyan.FFmpeg -e`. If it's still not
  found in the current shell session, use the full path printed by the
  installer (typically under
  `...\WinGet\Packages\Gyan.FFmpeg_Microsoft.Winget.Source_...\ffmpeg-*\bin\ffmpeg.exe`)
  or add it to `PATH` and open a new shell.
- **macOS**: `brew install ffmpeg`.
- **Linux**: `apt install ffmpeg` (or the equivalent for your distro's
  package manager).
