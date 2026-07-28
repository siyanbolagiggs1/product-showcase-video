# Contributing

`product-showcase-video` is a single Agent Skill plus its supporting
scripts, templates, and validation tooling.

## Change the skill

1. Keep `skills/product-showcase-video/SKILL.md` focused on triggers and
   workflow, and below 500 lines.
2. Put detailed domain material one level deep in
   `skills/product-showcase-video/references/`.
3. Put deterministic operations in
   `skills/product-showcase-video/scripts/`.
4. Put reusable starter files in
   `skills/product-showcase-video/assets/templates/`.
5. Keep `skills/product-showcase-video/agents/openai.yaml` consistent with
   the skill's name and purpose.
6. Add or update at least five evaluation cases in
   `evals/trigger-cases.json` covering trigger, do-not-trigger, and
   ambiguous requests.
7. Keep the skill product-agnostic — nothing in it should assume a
   specific product, brand, or prior use case.

## Change `capture-frames.js`

It's dependency-free beyond Playwright and has no test suite of its own —
changes should be exercised by actually running a capture end to end
(`references/capture-and-assemble.md` has the command) rather than assumed
correct from a read-through.

## Validate

```bash
node --check skills/product-showcase-video/scripts/capture-frames.js
python3 scripts/validate_catalog.py
```

## Commit style

Use Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`).

Participation is governed by our [Code of Conduct](CODE_OF_CONDUCT.md).
