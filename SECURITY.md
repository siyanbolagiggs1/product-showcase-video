# Security Policy

## Supported Versions

Security fixes are applied to the `main` branch.

## Reporting a Vulnerability

**Do not open a public issue for security vulnerabilities.**

Report privately using GitHub's
[private vulnerability reporting](https://docs.github.com/en/code-security/security-advisories/guidance-on-reporting-and-writing-information-about-vulnerabilities/privately-reporting-a-security-vulnerability)
through the repository's **Security → Report a vulnerability** tab.

Please include a description and impact, steps to reproduce, and the
affected component. We aim to acknowledge within 3 business days.

## Handling of secrets and captured content

- Never commit credentials, `.env` files, or captured product screenshots
  that include real user data — these are covered by `.gitignore`, but
  review before committing regardless.
- This skill can drive a browser against a live product when using the
  "capture screenshots yourself" option. It must stay within pages/states
  the user explicitly asked for, and must not attempt to bypass
  authentication, paywalls, or other access controls.
- Rendered frames (`frames-out/`) and output videos (`*.mp4`) are
  gitignored by default since they're large binary build output, not
  source — re-add specific outputs deliberately if you want to version one.
