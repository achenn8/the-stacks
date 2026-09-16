# The Stacks — project notes for Claude Code

## What this is
A single-file, single-user, offline book-ranking web app. Comparison-based ranking
(not star ratings — you rank books by comparing them head-to-head, not by giving stars).
One file: `index.html` (renamed from `the-stacks.html` when deployed to Vercel; the pure
offline pre-API version is preserved as `the-stacks-v1.html`). No accounts, no build step;
one online exception (the title lookup — see Hard constraints).
Full requirements are in `PRD-the-stacks.md`; the online addendum is in `PRD-v2-online.md`.

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
- Keep everything in `index.html` (the deployed app; formerly `the-stacks.html`). No
  frameworks, bundlers, or build step (the two linked Google Fonts are the only exception).
  Must run by opening the file.
- **Online exception (added when v2 merged into main):** the title field now calls the
  Open Library API to auto-fill title/author. This is a **progressive enhancement** — the
  app still works fully offline (typing by hand), and only the typed title is ever sent
  out (never the reading list, scores, or notes). No OTHER network calls or external deps
  may be added without being asked. A pure-offline snapshot lives in `the-stacks-v1.html`.
- Preserve the data model, scoring formula, and placement algorithm documented in the
  PRD (Sections 4.3–4.5). If a change adds fields, migrate existing data; never wipe it.
- localStorage key is `"the-stacks-v3"` (localStorage = a small storage area in the browser
  where the app keeps your data on your own device). The older `"the-stacks-v2"` and
  `"the-stacks-v1"` keys are kept untouched on disk as fallbacks. `load()` walks that chain
  newest-first and migrates a COPY forward. Don't change the key silently; if the schema
  version changes again, bump it deliberately and migrate old data (v2 added genres, v3
  added `addedOn`).
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
  - **Edit title/author from the detail view** (PRD nice-to-have): both are inline-editable
    inputs in the detail header (dashed underline = editable; blank author shows an "Add
    author" placeholder). Save persists them with the note/genres; title stays required.
    No schema change (fields already existed).
  - Remove control de-emphasized to a quiet "Remove from catalog" link, separated from
    Close/Save; keeps the two-step "Really remove?" confirm.
  - **"Too close to call" button removed** — a deliberate deviation from PRD §4.1/§4.5.
    Rationale: it claimed indecision but silently placed the book below the rival, and
    with small tiers the "near-equal" scores were a full point apart. Every placement now
    resolves via the comparisons. (Scoring formula/data model unchanged.)
- **P2a (findability — search, sort, filter) — DONE.** Toolbar under the header: search
  (title/author, live) + a Sort dropdown (By score default / Newest / Oldest / Title A–Z /
  Author A–Z) + tappable tier chips (Loved it / It was fine / Didn't like it, each with a
  tier-color dot doubling as a legend; selected chip lights up manila). Tier chips **toggle**
  — clicking the active one clears it back to all (there is no "All" chip; nothing selected =
  all). A **Genre filter** chip ("Genre ▾") sits after the tier chips: opens a multi-select
  popover of "genre (count)" rows ordered most-used first, with **Untagged (n)** at the
  bottom, an OR across the selected genres, a Clear link, and a chip badge ("Genre" →
  "Genre · Poetry" → "Genre · 2"); it hides entirely when no book has a genre. Search + tier
  + genre stack (AND; genres OR among themselves); author filtering is via the search box (no
  separate author control). "By score" shows the grouped ranked drawers; every other sort flattens into one
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
- **P3 (personal insights) — DONE.** An **"Insights"** button in the HEADER (secondary
  outlined button, to the RIGHT of "＋ Log a finished book"; hidden on an empty catalog)
  opens the modal "Your reading in numbers" showing —
  1. **How they landed** — tier split (Loved/Fine/Didn't like it) as gold/sage/brick bars
     sized by share of the catalog.
  2. **Genres you read most** — top genres by count, neutral bars.
  3. **Genres you rate highest** — average `scoreOf` per genre, shown ONLY for genres with
     **≥3 books** (`GENRE_MIN`, noise guard); average shown in the "call number" stamp.
  4. **One gentle observation** — a "two genres" concentration line (fires when the top 2
     genres cover ≥50% of tag instances) and/or "you rate X highest on average".
  Below **10 books** (`INSIGHTS_MIN`) it shows a friendly "log a few more" state, not
  numbers. If books exist but none are genre-tagged, shows the tier split + a nudge to tag.
  The 3 analysis headers are serif subheadings with dividers between them. READ-ONLY:
  computes from the store on open; no writes, no schema change. Both thresholds are tunable
  constants. See PRD Section 7.
- **Backlog complete (P0–P3 + polish).** Real-browser QA pass DONE by the user (backup
  exported first); a functional smoke test also passed on `index.html`.
- **v2 (online) STARTED — merged into main.** The Open Library title autocomplete (PRD in
  `PRD-v2-online.md`) now ships on main as a progressive enhancement: typing a title fetches
  matches (debounced, AbortController-cancelled, deduped) and fills title + author; works in
  both the add flow and the detail-view title edit; degrades gracefully offline. main is
  therefore no longer offline-only (see the Hard-constraints online exception). The pure
  offline v1 is preserved as `the-stacks-v1.html` and at git commit `ae21410`. Also merged:
  overall-rank confirmation, and the Insights button fills cream at ≥10 books.
- **DEPLOYED — DONE (2026-08-24).** Live at **https://the-stacks-one.vercel.app** via Vercel,
  git-connected to `github.com/achenn8/the-stacks` (push to `main` → auto-redeploy). Verified
  live: HTTPS, app renders, localStorage persists on the real origin. README "Live demo" line
  carries the URL. `the-stacks-v1.html` is now **gitignored** (offline snapshot stays local,
  never deployed).

- **Notes keep their line breaks; cards split into two click zones — DONE (commit `244724b`,
  not yet pushed).** The note field was always a `<textarea>` with no length limit, but HTML
  collapsed the line breaks on display. Cards are now two sibling controls: a `.card-main`
  wrapper (holds the grid, opens the detail view, carries the card's full `aria-label`) and
  the note below the dashed rule. Collapsed, a note clamps to 3 lines with breaks falling
  back to spaces so a paragraph break can't spend the preview on blank space; expanded, real
  paragraphs are preserved. The more/less cue sits OUTSIDE the clamped text (or the clamp
  would hide it) and is a real `<button>` for keyboard/screen readers, while the note band is
  a convenience click area for mouse/touch — deliberately avoiding a control inside a control.
  A note is only promoted to a control when the clamp actually hides something. Expanded
  state is transient like `view`.
- **Date finished vs date added — DONE (schema v3, not yet committed).** Before this, both
  `dateFinished` and `finishedOn` were set silently to *today*, so the app called it a finish
  date when it was really the logging date. Now: `finishedOn` is user-chosen (native
  `<input type="date">`, capped at today, clearable) in both the add flow and the detail view;
  `dateFinished` is always derived from it via `displayFromIso()`; and a new **`addedOn`**
  records when the entry was created. `addedOn` is a full ISO **timestamp**, not a date —
  day-precision would collapse "Recently added" into A–Z order for a bulk import. Migration
  sets `addedOn` from the old `finishedOn`, which is accurate since that value *was* the
  logging date. Sort gained **"Recently added"**; undated books still sort last in both
  directions. No finish date means no date on the card — never an invented one.

- **Goodreads import — DONE (not yet committed).** Footer gains "Import from Goodreads"
  (`.csv`). Runs ENTIRELY in the browser; the file is never uploaded. Goodreads retired its
  public API (no new keys since Dec 2020), so the CSV a reader exports themselves is the only
  sanctioned route — **do not add an API integration, it does not exist.**
  - **Hand-written quote-aware CSV reader** (`parseCsvRows`): quoted fields, commas AND
    newlines inside quotes, `""` escapes, BOM strip. Splitting on commas corrupts reviews.
  - **Mapping.** Only `Exclusive Shelf == "read"` is eligible. `My Rating` parses as a NUMBER
    (Goodreads writes `"5.0"`, not `"5"`): ≥4 → loved · 3 → fine · 1–2 → disliked · 0 →
    skipped and NAMED in the summary (an unrated book carries no signal; better the reader
    logs it and gives a real gut-check). `Date Read` → `finishedOn`, `Date Added` → `addedOn`
    (both truthful; blank stays blank, never invented). `My Review` → `takeaway` KEPT WHOLE —
    no truncation, since notes have no length limit and render paragraphs.
  - **Shelves → genres was CUT.** 0 of the user's 107 read books carry a shelf (all 47 shelved
    rows are on to-read), so it would have been dead code. Genres stay manual.
  - **Placement.** Provisional order within a tier: rating desc → finishedOn desc → title A–Z,
    appended BELOW everything already hand-ranked. Binary-search placement would have meant
    ~1,500 forced comparisons for a 200-book import.
  - **`provisional: true`** marks imported books ("not yet ranked by you" on the card) and is
    deleted on re-rank. Deliberately NO key bump: an optional field whose absence is the
    correct default needs no migration (PRD §9 — bump only for significant changes).
  - **Dedupe** on normalised `title|author` (via `gkey()`), both within the file and against
    the catalog — catches the same book in two Goodreads editions, which a Book Id match misses.
  - **Preview before any write**, and the import ADDS rather than replaces (unlike the JSON
    restore). Wrong file → header check with a message saying where to get the real export.

## Deferred (not yet built)
Two ideas parked with agreed designs (the v2 title autocomplete has shipped; these haven't) —
details in the auto-memory roadmap notes:
- **Reorder the whole catalog by dragging.** Keep the 3 tiers; drag to reorder within a
  tier and drag across a divider to re-tier; scores recompute on Done via `scoreFor`.
  Build must add touch dragging + a keyboard fallback (quality floor). See memory
  `roadmap-reorder-whole-catalog`.
- **Online genre auto-suggest** (e.g. detect that "Crush" is Poetry). Needs an external
  book-metadata API and messy-data handling; still deferred. See memory
  `roadmap-online-genre-autosuggest`.

## Resume here (next session) — as of 2026-08-24
**Shipped and deployed.** Everything is committed and pushed on `main` (local ↔
`origin/main` in sync); nothing pending in code. Live at **https://the-stacks-one.vercel.app**;
GitHub remote is `github.com/achenn8/the-stacks` (push to `main` → Vercel auto-redeploys).
Repo tracks: `index.html`, `README.md`, `PRD-the-stacks.md`, `PRD-v2-online.md`, `CLAUDE.md`,
`.gitignore`. `the-stacks-v1.html` (pure offline snapshot) is **gitignored** and stays local.
The `v2-online` branch is already merged into main.

**Pending (user-owned, no code):** the user plans to **manually reword `README.md`** in a few
days. If they edit it on GitHub's web UI, `git pull` before the next local push (web commit will
be ahead of local).

**Next feature — agreed roadmap** (see memory `roadmap-v2-future`): (a) privacy-first analytics
(events only, never book content — treat the analytics script as a documented online exception
like the Open Library call), then (b) PWA to make it installable. An interview-stories artifact
was also published (find/update it via the Artifact tool's list). No rush; start when the user
flags it.
