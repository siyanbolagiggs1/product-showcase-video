# Product Showcase Video

An [Agent Skill](https://agentskills.io/) that turns any product's
screenshots and a short pitch into a real MP4 showcase video. Not tied to
any one product — works the same way whether you hand it screenshots, ask
it to grab them from your live app itself, point it at existing marketing
assets, or have no visuals yet.

## Get started

```bash
git clone https://github.com/siyanbolagiggs1/product-showcase-video.git
cd product-showcase-video
npm install
npx playwright install chromium
```

Make sure `ffmpeg` is installed (`ffmpeg -version` to check — if missing,
see [install commands](skills/product-showcase-video/references/capture-and-assemble.md#ffmpeg-not-found)).

Install the skill into your agent:

```bash
gh skill install siyanbolagiggs1/product-showcase-video --agent claude --scope user
```

Using a different agent, or no GitHub CLI? See
[Installing the skill](#installing-the-skill) below for alternatives.

Start a **new** agent session (one already running won't see a skill
installed after it started), then just ask:

```text
Use $product-showcase-video to build a 20-second demo video for my app.
I'll give you screenshots.
```

The agent takes it from there — asks anything else it needs, authors a
storyboard, previews it with you, renders it, and sanity-checks the
result before handing you the finished MP4.

## What you get to choose

| Option | When to use it |
|---|---|
| **Submit your own screenshots** | You already have the images. |
| **Let the agent capture them** | You have a live app/site and want the agent to drive a browser and grab the screens itself. |
| **Point it at existing marketing assets** | App/Play Store listing images, an existing marketing site, or Figma exports. |
| **No visuals yet** | The agent builds a clearly-labeled illustrative mockup UI as a stand-in, swappable later. |

Plus a choice of audio: your own music/voiceover track, a track you point
it to, or no audio at all (silent, with burned-in captions).

## Installing the skill

The `gh skill install` command above (GitHub CLI 2.96+) works for Claude
Code, Cursor, and Codex, and is the recommended path. If you'd rather not
depend on GitHub CLI, or you're working from a local clone that isn't
pushed anywhere, symlink/junction the skill folder into your agent's local
skills directory instead — for Claude Code:

```bash
# macOS / Linux — global (every project)
mkdir -p ~/.claude/skills
ln -s "$(pwd)/skills/product-showcase-video" ~/.claude/skills/product-showcase-video
```

```powershell
# Windows PowerShell — global (every project)
New-Item -ItemType Directory -Force -Path "$HOME\.claude\skills" | Out-Null
New-Item -ItemType Junction -Path "$HOME\.claude\skills\product-showcase-video" -Target "$PWD\skills\product-showcase-video"
```

Use `.claude/skills/` inside one specific project instead of
`~/.claude/skills/` to install it there only. Other agents have their own
equivalent local-skills directory.

No install mechanism at all? Point the agent at
[skills/product-showcase-video/SKILL.md](skills/product-showcase-video/SKILL.md)
directly ("read this file and follow it") — same result, no shorthand.

## Using it without an agent

Everything above is an agent following these docs — you can follow them
yourself instead, in order: pick a screenshot-sourcing option in
[gathering-visuals.md](skills/product-showcase-video/references/gathering-visuals.md),
build the storyboard per
[storyboard-authoring.md](skills/product-showcase-video/references/storyboard-authoring.md)
(starting from
[assets/templates/storyboard.template.html](skills/product-showcase-video/assets/templates/storyboard.template.html)),
then capture and assemble per
[capture-and-assemble.md](skills/product-showcase-video/references/capture-and-assemble.md).

## How it works

The storyboard is a self-contained animated HTML/CSS file, captured to a
PNG sequence frame-by-frame with Playwright rather than screen-recorded
live (live recording drops/duplicates frames under CSS-heavy animation on
a headless browser — per-frame capture gives every frame unlimited time to
render fully instead). The frames are then assembled into an MP4 with
`ffmpeg`, and a few frames get pulled back out of the finished file to
sanity-check before calling it done.

## Repository structure

```text
skills/product-showcase-video/
  SKILL.md                 What any agent reads first
  references/               Gathering visuals, storyboard authoring,
                             capture & assemble, troubleshooting
  scripts/capture-frames.js Frame-by-frame Playwright capture tool
  assets/templates/         Starter storyboard HTML + an inject-css example
  agents/openai.yaml        Cross-agent display metadata
evals/                      Trigger-routing evaluation cases
scripts/validate_catalog.py Structure/link validation for this repo
.github/workflows/          CI: validation
```

## Validate

```bash
python3 scripts/validate_catalog.py
```

## Contributing

Read [CONTRIBUTING.md](CONTRIBUTING.md) and the
[Code of Conduct](CODE_OF_CONDUCT.md).

## License

[MIT](LICENSE)
