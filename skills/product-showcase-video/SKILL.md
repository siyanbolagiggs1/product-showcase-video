---
name: product-showcase-video
description: Generate a polished product showcase / demo video (MP4) for any product, from screenshots, copy, and optional music — an animated HTML/CSS storyboard rendered frame-by-frame with Playwright and assembled with ffmpeg. Use when someone wants a promo, demo, App Store, social (Reels/TikTok/Shorts), or landing-page video for their product, regardless of whether they'll supply screenshots themselves, want the agent to capture screenshots by driving a browser, or have no visuals yet.
---

# Product Showcase Video

Turns a product's screenshots and a short pitch into a real MP4: a
self-contained animated HTML/CSS storyboard, captured frame-by-frame (never
screen-recorded live, so it's never laggy regardless of machine speed), then
assembled with an optional audio track via ffmpeg.

This skill is product-agnostic. It was built out of a single one-off (an
advert for a product called "Pulse") but nothing here is specific to that
product — every step below works for any product, any screenshots, any
brand.

## Read the relevant references

- Read [references/gathering-visuals.md](references/gathering-visuals.md)
  before touching any images — it covers the four ways to source screenshots
  and how to normalize/embed them.
- Read [references/storyboard-authoring.md](references/storyboard-authoring.md)
  when building the HTML/CSS storyboard — scene structure, timing, aspect
  ratios, legibility.
- Read [references/capture-and-assemble.md](references/capture-and-assemble.md)
  when running `scripts/capture-frames.js` and assembling the final MP4 with
  ffmpeg, including audio options.
- Read [references/troubleshooting.md](references/troubleshooting.md) if a
  capture looks janky, ffmpeg isn't found, or the final video doesn't match
  the storyboard.

## Workflow

1. **Gather the brief.** Ask for (or infer from context already given):
   product name, one-line value proposition, 3-5 key features/messages to
   highlight, target platform/aspect ratio, target duration, and whether
   they have brand colors/fonts. Don't invent product claims, pricing, or
   testimonials that weren't given to you.
2. **Choose how screenshots will be sourced.** Present this as an explicit
   choice unless the user already told you which one they want:
   - **They submit screenshots/images** — they hand you existing files.
   - **You capture screenshots yourself** by driving a browser to the live
     product (a URL, or a local dev server) and screenshotting the states
     that matter.
   - **Existing marketing assets** — App/Play Store listing images, an
     existing marketing site, or Figma frame exports they point you to.
   - **No visuals yet** — build an illustrative HTML/CSS mockup UI as a
     stand-in, clearly labeled to the user as illustrative rather than the
     real product.
   Full detail on all four, including how to run the capture and how to
   normalize whatever you end up with, is in
   [references/gathering-visuals.md](references/gathering-visuals.md).
3. **Author the storyboard** as one self-contained HTML file per
   [references/storyboard-authoring.md](references/storyboard-authoring.md).
   Pick an aspect ratio matching the target platform and a total loop
   duration matching the target duration.
4. **Preview it live before rendering anything.** Publish it as an Artifact
   if you're working in a context that supports that, or open the HTML file
   directly in a browser otherwise. Iterate on timing, copy, and color with
   the user here — it's nearly free compared to iterating after a render.
5. **Capture frames** with `scripts/capture-frames.js` (background it; a
   30s/30fps video takes roughly 15-40 minutes). See
   [references/capture-and-assemble.md](references/capture-and-assemble.md).
6. **Assemble frames + audio into the final MP4** with ffmpeg. Audio is
   optional — see the audio options in
   [references/capture-and-assemble.md](references/capture-and-assemble.md)
   (user-supplied track, explicitly no audio/silent, or a track the user
   points you to).
7. **Sanity-check before calling it done.** Pull several frames back out of
   the *final* MP4 with `ffmpeg -ss <t> -frames:v 1` at timestamps spanning
   the whole video and actually look at them. Don't assume a pipeline this
   fiddly worked just because every command exited 0 — see
   [references/troubleshooting.md](references/troubleshooting.md) for what
   this has caught before.

## Guardrails

- Don't fabricate product features, pricing, metrics, or testimonials that
  weren't given to you. If the brief is thin, ask rather than invent.
- If capturing screenshots by driving a browser to a live product, stay
  within pages/states the user asked for. Don't attempt to bypass a login,
  paywall, or auth wall that isn't already open in the session the user
  gave you access to.
- If the user supplies a music/voiceover track, don't assume they hold the
  rights to it for the intended use (e.g. paid ads vs. personal use) —
  ask if it isn't obvious. Never source copyrighted music on their behalf.
- If visuals come from "no visuals yet" mockup mode, say so explicitly in
  your result — never present a stylized mockup as if it were the real
  product UI.
- Don't skip the final sanity-check step even when everything appears to
  have run cleanly.

## Result format

Report: which screenshot-sourcing option was used, where the storyboard
HTML lives, the output video's path/resolution/duration/whether it has
audio, what the sanity-check frames showed, and any remaining follow-ups
(e.g. alternate aspect ratios for other platforms, captions, a shorter cut).
