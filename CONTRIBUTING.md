# Contributing

- `content/` holds the content and `engine/chapter-template.html` holds the shared page. `dist/` is generated: never edit it by hand. Rebuild it with `node scripts/build.js`.
- After any change, run `node scripts/build.js` and `node tests/check.js`. Both must pass before committing.
- **Physics 1st paper, Vectors is locked at v1.0** (tag `vectors-v1.0`, 2026-11-14). Change its content or engine behaviour only when Monem asks.
- All content must be original: no text copied from guidebooks. Past questions keep only exam, session and question type unless the original exam question is added.
- The repo is public. Never commit keys, tokens or passwords.
