# Gathering visuals

Every option below ends at the same place: a set of image files (or, in
mockup mode, hand-authored HTML/CSS) ready to embed into the storyboard as
`data:image/...;base64,...` URIs. Embed as base64, not as external file
references or network URLs — the storyboard must stay self-contained (see
[storyboard-authoring.md](storyboard-authoring.md) for why), and
`capture-frames.js` never needs network access this way.

Ask the user which option applies, or infer it from context (e.g. they
already attached screenshots, or told you their app only exists as a design
file so far). Don't guess silently if it isn't clear.

## Option A — User-submitted screenshots

The most common case. The user hands you existing image files (paths, or
pasted/attached images).

- Confirm resolution and aspect ratio are consistent enough to use side by
  side. If they're wildly inconsistent (different device chrome, different
  DPI), ask whether to crop/pad them to a common frame or use them as-is.
- Watch for screenshots that include OS chrome (status bars, browser
  chrome) inconsistently — either strip it from all of them or keep it on
  all of them, don't mix.
- If a screenshot contains anything obviously not meant for the public cut
  (test data, another user's real name/email, a stray dev banner), flag it
  before using it rather than silently including it.

## Option B — Capture the screenshots yourself

Use this when the user has a live product (a public URL or a local dev
server) and wants you to grab the screens rather than hand you files.

1. Ask for the URL(s) and which screens/flows matter (e.g. "onboarding,
   dashboard, the pricing page" — don't try to guess a whole app's sitemap).
2. If a browser-automation tool is available in your current environment
   (e.g. a Chrome-driving tool, or Playwright), navigate to each screen and
   take a screenshot at the target output resolution (see the aspect-ratio
   presets in [storyboard-authoring.md](storyboard-authoring.md)) or a
   larger size you'll crop down later.
3. If nothing is on screen yet because state depends on interaction
   (opening a modal, scrolling to a section, an empty vs. populated state),
   drive that interaction first, wait for it to settle, then screenshot —
   the same "let it settle before you capture" principle
   `capture-frames.js` uses for animations applies here too.
4. Save each capture as its own file (e.g. `raw/01-onboarding.png`,
   `raw/02-dashboard.png`) so they're easy to review and swap before they go
   into the storyboard.
5. Stay inside what the user asked for. Don't navigate into a login,
   billing, or admin surface that isn't already open in the session you
   were given, even if it's technically reachable — ask first.

This is the same technique `capture-frames.js` itself uses (drive a
headless browser, wait for things to settle, screenshot) just aimed at the
live product instead of the finished storyboard.

## Option C — Existing marketing assets

Use this when the user already has presentable images they'd rather reuse
than have you regenerate:

- App Store / Play Store listing screenshots.
- Screenshots or hero images from an existing marketing site.
- Exported frames from a design file (ask the user to export PNGs at 2x
  from their design tool if they only have a link you can't open directly).

Treat these as pre-approved for public use — they're already public or
already reviewed — but still check they're current (matches the product's
actual UI today) before building a storyboard around them.

## Option D — No visuals yet (mockup mode)

Use this only when none of the above is available — the product is too
early-stage to have real screens, or the user explicitly wants a
conceptual/illustrative video rather than a real product demo.

- Build a simplified, stylized UI mockup directly in HTML/CSS (cards,
  placeholder charts, generic nav — nothing that claims to be a real
  screen).
- Say so explicitly wherever this gets reported back to the user, and in
  the storyboard's own working notes — never let a mockup pass as if it
  were real product UI, either to the end viewer or to the user reviewing
  the draft.
- Offer to swap in real screenshots later via Option A/B/C once they exist;
  design the storyboard's scene structure so that swap is a small, isolated
  change (see [storyboard-authoring.md](storyboard-authoring.md)).

## Normalizing and embedding

Once you have image files, embed each as a base64 data URI in the
storyboard HTML. A dependency-free way to do that from this repo (Node is
already required for `capture-frames.js`):

```bash
node -e "console.log(require('fs').readFileSync('raw/01-onboarding.png').toString('base64'))"
```

Wrap the output as `data:image/png;base64,<output>` in a CSS
`background-image` or an `<img src="...">`. If a screenshot needs a device
frame (a phone bezel, a browser window chrome) to look intentional at the
target aspect ratio, add that in CSS around the image rather than baking it
into the image itself — it stays editable that way.
