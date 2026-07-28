# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased]

## [1.0.0] - 2026-07-28

### Added

- `product-showcase-video` Agent Skill: turn a product's screenshots and a
  short pitch into an MP4 showcase video via an animated HTML/CSS
  storyboard, frame-by-frame Playwright capture, and ffmpeg assembly.
- Four screenshot-sourcing paths documented in
  `references/gathering-visuals.md`: user-submitted images, agent-driven
  browser capture of a live product, existing marketing/App Store/Figma
  assets, and an illustrative mockup-mode fallback when no visuals exist
  yet.
- `references/storyboard-authoring.md`, `references/capture-and-assemble.md`,
  and `references/troubleshooting.md`, plus starter templates under
  `assets/templates/`.
- Catalog validation (`scripts/validate_catalog.py`), trigger evaluation
  cases (`evals/trigger-cases.json`), and CI (`.github/workflows/validate.yml`).
- Generalized from a single one-off (the "Pulse" advert video) into a
  reusable, product-agnostic skill any AI agent can be pointed at.
