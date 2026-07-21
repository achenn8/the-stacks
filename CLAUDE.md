# The Stacks — project notes for Claude Code

## What this is
A single-file, single-user, offline book-ranking web app. Comparison-based ranking
(not star ratings — you rank books by comparing them head-to-head, not by giving stars).
One file: `the-stacks.html`. No server, no accounts, no build step.
Full requirements are in `PRD-the-stacks.md` — read it before any non-trivial work.

## Who I am / how to talk to me
- I work in investment banking and am pivoting into product management. I'm building this
  to learn how products get made and to have concrete stories for APM interviews.
- Assume I know nothing about code. Explain like I'm smart but non-technical.
- When you use a technical term, define it in one sentence the first time you use it.

## How I want to work (follow these every time)
1. Define each technical term in one sentence the first time it appears.
2. After a change, tell me in plain English what you did and why you chose that approach.
3. If there were two reasonable ways to do something, tell me the other option and why you
   picked this one.
4. If my request is ambiguous, ask me — don't guess.
5. For anything non-trivial, propose a plan and wait for my approval before editing files.
6. Never make a change I didn't ask for. If you think something else needs fixing, say so
   and wait.
7. Make one increment at a time. Show diffs. Explain changes in plain English if I ask.
8. After changes, remind me to run the manual QA checklist (PRD Section 8) and commit.

## Hard constraints (do not violate without being asked)
- Keep everything in `the-stacks.html`. No frameworks, bundlers, or new runtime deps
  (the two linked Google Fonts are the only exception). Must run by opening the file.
- Preserve the data model, scoring formula, and placement algorithm documented in the
  PRD (Sections 4.3–4.5). If a change adds fields, migrate existing data; never wipe it.
- localStorage key is `"the-stacks-v1"` (localStorage = a small storage area in the browser
  where the app keeps your data on your own device). Don't change it silently; if the schema
  version changes, bump the key deliberately and migrate old data.
- Maintain the accessibility/quality floor: mobile responsive, visible keyboard focus,
  reduced-motion respected, user input escaped (Section 4.6).
- Match the existing card-catalog visual system and CSS variables. New UI should look like
  it was always there.
- Vanilla HTML/CSS/JS only. The point is a file I fully understand.

## Backlog (build in this order — one increment per session)
- **P0** Backup & restore (export/import to a `.json` file) — do this first.
- **P1** Re-rank an existing book (re-run comparisons or move tier, keep the note).
- **P2a** Findability: search, sort, filter (view-only, never changes stored order).
- **P2b** Optional genre/tags (schema change — needs a migration).
- **P3** Personal insights (only meaningful once ~15+ books logged).

## Current status
v1 is built and matches the PRD Section 4 spec (core loop, data model, `the-stacks-v1`
key, scoring formula, quality floor all present).
- **P0 (backup & restore) — DONE.** Footer Export/Import buttons; export downloads a
  dated `.json`; import validates shape + deep integrity (every ranked id exists in
  `books`) and confirms before overwriting. Purely additive; data model unchanged.
  Committed. (User still to run the real-browser QA of download/upload round-trip.)
- **Next up: P1 (re-ranking an existing book)** — see PRD Section 7.
