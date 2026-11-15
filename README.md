# Ultimate Learn

A short, accurate revision guide for Bangladesh university admission tests (HSC science): **Physics and Chemistry, 1st and 2nd paper**. Each chapter is one lightweight web page with three parts:

- **শেখো (Learn):** rules, definitions, one-line answers, short "why" answers, units and dimensions, and formula cards with a shortcut and a worked example.
- **টেস্ট দাও (Test):** a new test on every attempt. Numerical questions get fresh numbers each time, the answer is computed in code, and every wrong option comes from a real student mistake with feedback on it. It has practice and exam modes (timer, −0.25 per wrong answer), a score per topic, and the next test focuses on weak topics.
- **বিগত প্রশ্ন (Past questions):** real admission questions by university and year, each with a practice question of the same type.

> **© Ultimate Learn. All rights reserved.** This repository is public so partners can view it. It is not open source: do not copy, reuse or redistribute the content or code.

## Chapters

| Chapter | Status | Page |
| --- | --- | --- |
| Physics 1st paper, Ch. 2: Vectors (ভেক্টর) | **Locked v1.0** (2026-11-14). Needs a teacher's review. | [`dist/physics-1/vectors.html`](dist/physics-1/vectors.html) |

## How the repository is organised

```
content/                     ← what teachers review and edit
  physics-1/vectors/
    chapter.json             title, topics, topic weights in a test
    learn.json               rules, definitions, one-liners, short answers, units, formula cards
    bank.json                fixed questions: question, 4 options, answer (0–3), explanation, mistakes
    past.json                past admission questions → which practice item matches each
    templates.js             numerical templates (code): new numbers each time
engine/
  chapter-template.html      the page layout and logic shared by every chapter
scripts/build.js             puts engine + content together into one page per chapter
tests/check.js               checks every generated question has exactly one correct answer
dist/                        built pages (generated: do not edit by hand)
```

## Editing content (for teachers and reviewers)

Every fixed question in `bank.json` looks like this:

```json
{
 "topic": "DOT",
 "question": "দুটি অশূন্য ভেক্টরের {A}·{B} = 0 হলে তারা—",
 "options": ["পরস্পর সমান্তরাল", "পরস্পর লম্ব", "বিপরীতমুখী", "সমান"],
 "answer": 1,
 "explanation": "{A}·{B} = AB cosθ = 0 ⇒ cosθ = 0 ⇒ θ = 90°।",
 "mistakes": { "0": "সমান্তরাল হলে ক্রস গুণন শূন্য হয়, ডট গুণন নয়।" }
}
```

- `answer` counts from 0: 0 = ক, 1 = খ, 2 = গ, 3 = ঘ.
- `mistakes` is optional. It holds the feedback shown when a student picks that wrong option.
- How to write maths: `{A}` shows a vector arrow over A, `[i]` `[j]` `[k]` show unit vectors with a hat, and `<sub>x</sub>` makes a subscript.
- Topic codes (`DOT`, `CR`, `RV`, …) are listed in `chapter.json`.

To report or fix an error, open an issue or edit the file on GitHub and propose the change.

## Building and checking

Requires Node.js 18 or later. Nothing to install.

```bash
node scripts/build.js            # builds every chapter into dist/
node tests/check.js              # checks every built chapter (2,000 samples per template)
node tests/check.js physics-1/vectors 5000
```

Always run both after any change, and commit the rebuilt `dist/` file with the content change.

## Adding a chapter

1. Copy `content/physics-1/vectors/` to `content/<subject>/<chapter>/`.
2. Replace the content files: `templates.js` can start with an empty `TPL=[]` and `NEWT={}`.
3. Run the build and the check.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the rules every change must follow.
