// Renders a self-contained animated HTML/CSS page to a sequence of PNG frames
// by freezing every CSS animation's clock and stepping it forward one exact
// timestamp at a time -- instead of recording the browser live in real time.
//
// Why: capturing a live browser (Playwright's context.recordVideo, or any
// screen recorder) makes every frame race the real clock. Anything CSS-expensive
// on the page (backdrop-filter blur, filter blur, many simultaneous animated
// elements) can make the browser too slow to paint in real time, even though it
// renders perfectly smoothly with no time pressure. That shows up as dropped /
// duplicated frames -- a laggy, stuttery export, even when the same page feels
// buttery-smooth just looking at it in a normal browser tab.
//
// This script sidesteps that entirely: it pauses the page's animations, then for
// each output frame sets every animation's `currentTime` to the exact timestamp
// that frame represents, waits a paint, and screenshots. Each frame gets as long
// as it needs to render fully, so the final sequence is exactly as smooth as the
// animation's own timing says it should be, regardless of machine speed.
//
// Usage (run from the repository root, where node_modules/playwright lives):
//   node skills/product-showcase-video/scripts/capture-frames.js \
//     --html <path-or-file-url> --duration 30000 [--fps 30] \
//     [--width 1080] [--height 1920] [--out ./frames-out] [--settle-ms 1000] \
//     [--inject-css <path-to-css-file>]
//
// --html         Path to the HTML file (or a file:// / http(s):// URL) to capture.
//                Author it so the animated content already fills the viewport --
//                this script does not crop/hide anything on the page for you.
// --duration     Total capture length in ms (should match the animation's own
//                loop length, e.g. if your CSS animations are `30s infinite`,
//                use --duration 30000 to capture exactly one clean pass).
// --fps          Output frame rate (default 30).
// --width/height Viewport size in px (default 1080x1920, a 9:16 vertical video).
// --out          Directory to write frame_00000.png, frame_00001.png, ... into
//                (cleared and recreated each run).
// --settle-ms    Fixed delay after page load before freezing animations, to let
//                any layout/reflow triggered by --inject-css finish first
//                (default 1000).
// --inject-css   Optional path to a CSS file to inject after page load, e.g. to
//                hide other page chrome and blow up a smaller preview element to
//                fill the full viewport. Skip this if the HTML is already
//                authored full-bleed at the target size.
//
// After this, assemble the frames + your audio track with ffmpeg, e.g.:
//   ffmpeg -y -framerate 30 -i frames-out/frame_%05d.png -i audio.mp3 \
//     -map 0:v -map 1:a -c:v libx264 -pix_fmt yuv420p -crf 18 -preset medium \
//     -c:a aac -b:a 192k -shortest -movflags +faststart out.mp4

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : true;
      args[key] = value;
    }
  }
  return args;
}

(async () => {
  const args = parseArgs(process.argv.slice(2));

  if (!args.html || !args.duration) {
    console.error('Required: --html <path> --duration <ms>');
    console.error('See references/capture-and-assemble.md and the comment header in this file for all options.');
    process.exit(1);
  }

  const htmlArg = String(args.html);
  const url = /^(file|https?):\/\//.test(htmlArg)
    ? htmlArg
    : 'file:///' + path.resolve(htmlArg).replace(/\\/g, '/');

  const W = Number(args.width || 1080);
  const H = Number(args.height || 1920);
  const FPS = Number(args.fps || 30);
  const DURATION_MS = Number(args.duration);
  const SETTLE_MS = Number(args['settle-ms'] || 1000);
  const framesDir = path.resolve(String(args.out || './frames-out'));
  const totalFrames = Math.round((DURATION_MS / 1000) * FPS);

  fs.rmSync(framesDir, { recursive: true, force: true });
  fs.mkdirSync(framesDir, { recursive: true });

  console.log(`capturing ${totalFrames} frames @ ${FPS}fps, ${W}x${H}, from ${url}`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: W, height: H } });
  const page = await context.newPage();

  await page.goto(url);

  if (args['inject-css']) {
    const css = fs.readFileSync(String(args['inject-css']), 'utf8');
    await page.addStyleTag({ content: css });
  }

  // let any reflow from --inject-css (or just the page's own load) fully settle
  // BEFORE we touch the animation clock -- this is the step that actually fixes
  // the "laggy in the browser, smooth"-vs-"laggy exported" mismatch.
  await page.waitForTimeout(SETTLE_MS);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));

  await page.evaluate(() => {
    document.getAnimations().forEach((a) => a.pause());
  });

  for (let i = 0; i < totalFrames; i++) {
    const t = Math.round((i / FPS) * 1000);
    await page.evaluate((t) => {
      document.getAnimations().forEach((a) => { a.currentTime = t; });
    }, t);
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(r)));
    const frameName = `frame_${String(i).padStart(5, '0')}.png`;
    await page.screenshot({ path: path.join(framesDir, frameName) });
    if (i % 100 === 0) console.log(`frame ${i} / ${totalFrames}`);
  }

  await browser.close();
  console.log(`FRAMES_DONE totalFrames=${totalFrames} fps=${FPS} dir=${framesDir}`);
})();
