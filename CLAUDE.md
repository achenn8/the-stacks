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
- localStorage key is `"the-stacks-v2"` (localStorage = a small storage area in the browser
  where the app keeps your data on your own device). The old `"the-stacks-v1"` key is kept
  untouched on disk as a fallback. Don't change the key silently; if the schema version
  changes again, bump it deliberately and migrate old data (v2 was the first such bump).
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
- **P1 (re-rank an existing book) — DONE.** Inline "Re-rank" on the detail view: pick a
  tier (keep or move), re-run comparisons excluding the book itself, note/metadata kept,
  nothing written until finished (cancel-safe).
- **Polish (off-backlog, DONE):**
  - Remove control de-emphasized to a quiet "Remove from catalog" link, separated from
    Close/Save; keeps the two-step "Really remove?" confirm.
  - **"Too close to call" button removed** — a deliberate deviation from PRD §4.1/§4.5.
    Rationale: it claimed indecision but silently placed the book below the rival, and
    with small tiers the "near-equal" scores were a full point apart. Every placement now
    resolves via the comparisons. (Scoring formula/data model unchanged.)
- **P2a (findability — search, sort, filter) — DONE.** Toolbar under the header: search
  (title/author, live) + a Sort dropdown (By score default / Newest / Oldest / Title A–Z /
  Author A–Z) + a row of tappable tier chips (All / Loved it / It was fine / Didn't like it,
  each with a tier-color dot doubling as a legend; selected chip lights up manila). Chip +
  search + sort stack (AND); author filtering is via the search box (no separate author
  control). "By score" shows the grouped ranked drawers; every other sort flattens into one
  cross-catalog list where cards keep their tier color + true score. View-only by
  construction: each card derives rank/score from the store BY ID, never from display order
  — nothing writes to store. Date sort is month-precision (stored date is "Mon YYYY");
  exact-day sorting deferred to P2b. Filing a NEW book auto-resets filters so it's visible
  (re-ranks keep the current view). View state is transient (not persisted).
  (Internal note: the "By score" sort value is `"score"`; the tier FILTER is `view.tier`.)
- **P2b (optional genre/tags) — DONE.** First SCHEMA change. Key bumped `the-stacks-v1`
  → `the-stacks-v2`; `load()` migrates a COPY of v1 into v2 and leaves v1 untouched as a
  fallback (import runs the same `migrate()`). Two fields added to each book:
  `genres: string[]` and `finishedOn: "YYYY-MM-DD"` (migrated books get `[]` and a
  best-effort first-of-month date; new books capture today's exact day). `migrate()` is
  additive + idempotent. Genre picker (shared by add-flow Step 1 + detail view): chips =
  starter set ∪ the reader's own used/selected genres (deduped case-insensitively), tap to
  toggle, plus an "add your own" box whose entries flow back into the suggestions (custom
  genre drops off only when no book uses it — Option A). **Max 3 genres/book** (`MAX_GENRES`);
  at the cap, unselected chips + the add box disable and a hint shows. Chip list is a
  capped (150px) scrollable box so the modal stays short. Tags show as pills on the card.
  Chip matching is case/space/punctuation-insensitive (`gkey()` strips non-alphanumerics),
  so "sci fi"/"Sci-Fi" collapse to one genre. Chips are ordered MOST-USED first (ties
  alphabetical). Typing a custom genre close to an existing one shows a "Did you mean …?"
  nudge (Levenshtein-based) that suggests rather than silently merges — accept it, or keep
  your own spelling. Date sort now prefers `finishedOn` (day-precise) and falls back to
  month for old books.
  Online genre auto-suggest was considered and DEFERRED (needs external API; breaks
  offline/privacy) — see the memory note `roadmap-online-genre-autosuggest`.
- **Next up: P3 (personal insights) — PLANNED, waiting on data.** User is logging books
  toward ~15 before we build (insights are noise on a small catalog). **Decided:** button
  label is **"Insights"**; the data threshold is **10 books** (below it, show a friendly
  "log a few more" state, not numbers). Agreed design (matches a mockup shown 2026-07-24):
  a quiet "Insights" button in the FOOTER (left side; Export/Import stay right) opens the
  existing modal showing —
  1. **Tier split** — how many Loved/Fine/Disliked, as gold/sage/brick bars sized by share.
  2. **Genres you read most** — top genres by count, as neutral bars.
  3. **Genres you rate highest** — average score (`scoreOf`) per genre, shown ONLY for
     genres with **≥3 books** (noise guard); reuse the "call number" stamp for the number.
  4. **One gentle observation** line (e.g. "Most of your reading sits in two genres — X and
     Y. You rate Z highest."), phrased as observation, never judgment.
  If books exist but none are genre-tagged, show the tier split + a nudge to tag some.
  READ-ONLY: computes from the store on open; no writes, no schema change, no effect on
  scoring/ranking/search/genres. Keep the threshold + per-genre gate as tunable constants.
  See PRD Section 7.
- Reminder: user still to run the real-browser QA pass (export a backup first).
