# The Stacks — Product Requirements Document

**Product:** The Stacks — a personal, comparison-based book ranking app
**Version of this doc:** 1.0 (covers shipped v1 and the next build increments)
**Owner:** You
**Status of the product:** v1 shipped as a single working HTML file
**Purpose of this document:** Give you (and Claude Code) a single source of truth for what exists, what to build next, and how to build it without breaking the constraints that make this project defensible.

---

## 0. How to use this document

This file is written to do double duty:

1. **For you** — a roadmap you can work through one piece at a time.
2. **For Claude Code** — context it reads before making changes. Keep this file in the project folder. When you start a work session, point Claude Code at it (see Section 3).

If you're new to AI coding agents, **read Section 2 first and set up your environment before anything else.** Then skim Sections 4–6 so you understand what already exists, then work through the backlog in Section 7 one increment at a time.

A short glossary of unfamiliar terms is at the end (Appendix C).

---

## 1. Product context (the "why")

**The pain, as originally framed:** book ratings on Goodreads aren't very helpful at a glance — a 4-star average flattens very different books into the same number.

**What user interviews actually revealed** (this reframe is the backbone of the product):

- The strict 5-star complaint was *weak* — it had to be prompted, and people shrugged when pressed.
- What people volunteered, unprompted, was different and stronger: a wish for a **Beli-style comparison ranking** for books, better **findability/sorting** (one reader explicitly compared Goodreads unfavorably to Letterboxd), and a place for a **thoughtful personal takeaway** rather than a full review.

**The resulting product thesis:** stars let you rate everything a 4 or 5, so the top of the scale piles up and stops meaning anything. Forcing a **direct comparison** between two books you've actually read makes you commit to an order. The core object of the product is therefore *your own ranked list*, and any displayed "score" is just a readable projection of a book's position in that list.

**Who it's for:** you, first — a reader who wants a tool worth using weekly. Secondarily, it's a portfolio/skill-development project to generate concrete product-thinking stories for APM interviews.

**Dual goal, stated plainly so it can guide trade-offs:**
- (a) a tool you actually keep using, which means the logging habit must stay effortless, and
- (b) a body of defensible product decisions you can narrate in interviews.

When a trade-off arises, favor whichever of (a) or (b) is more at stake for that specific decision, and write down the reasoning.

---

## 2. Environment setup — first time with an AI coding agent

This section assumes you have never used a terminal or a coding agent before. Follow it top to bottom. It should take about 15–20 minutes.

### 2.1 What Claude Code is (one line)

Claude Code is a coding assistant that runs in your terminal (or as a desktop app). You describe what you want in plain English; it reads and edits the files in your project folder and shows you every change before it's saved.

### 2.2 Prerequisites — check these first

- **A paid Claude plan (Pro or Max) or an Anthropic Console account with billing.** The free Claude.ai plan does **not** include the Claude Code CLI. If you're unsure which you have, check your plan at claude.ai before installing.
- **A computer running** macOS 10.15+, Windows 10+, or Linux (Ubuntu 18.04+ or equivalent).
- **An internet connection.** Claude Code talks to Anthropic's servers; it does not run a model on your machine.
- **Good news:** the recommended installer bundles everything it needs. You do **not** need to install Node.js, and this project has no build step or dependencies of its own — it's a single HTML file.

### 2.3 Open a terminal

The terminal (also called the command line) is a text window where you type commands.

- **macOS:** press `Cmd + Space`, type "Terminal", press Enter.
- **Windows:** press the Start key, type "PowerShell", open "Windows PowerShell".
- **Linux:** open your "Terminal" application from the app menu.

You'll see a blinking cursor. That's where commands go. After typing a command, press Enter to run it.

### 2.4 Install Claude Code (native installer — recommended)

Copy the one line for your system, paste it into the terminal, and press Enter.

- **macOS / Linux:**
  ```
  curl -fsSL https://claude.ai/install.sh | bash
  ```
- **Windows (PowerShell):**
  ```
  irm https://claude.ai/install.ps1 | iex
  ```
- **macOS/Linux via Homebrew, if you already use it:**
  ```
  brew install --cask claude-code
  ```

*(There is also an npm-based install, but it requires you to install Node.js 22+ separately. Skip it — the native installer above is simpler and is the method Anthropic tests against. If you'd rather avoid the terminal entirely, there's a Claude Code desktop app with a graphical interface; see docs.claude.com/en/docs/claude-code.)*

**After it finishes, fully close the terminal window and open a new one.** This refreshes your system so it recognizes the new `claude` command.

### 2.5 Verify and sign in

In the new terminal window:

1. Confirm it installed:
   ```
   claude --version
   ```
   If you see a version number, you're good. If you see "command not found," close and reopen the terminal once more, then retry.

2. Start it:
   ```
   claude
   ```
   The first time, it will walk you through signing in via your browser. Choose the **"Claude account with subscription"** option (not the Console API-key option) unless you specifically set up Console billing.

3. Once inside Claude Code, run a built-in health check:
   ```
   /doctor
   ```
   This confirms everything is wired up. Type `/exit` to leave Claude Code for now.

### 2.6 Set up the project folder

Pick a home for the project. In the terminal:

```
mkdir the-stacks
cd the-stacks
```

`mkdir` makes a folder; `cd` moves into it. Now put two files inside this folder:

- `the-stacks.html` — the app you already have.
- `PRD-the-stacks.md` — this document.

Move both into the `the-stacks` folder using your normal file manager (Finder/Explorer), or ask Claude Code to help once it's running.

### 2.7 Turn on version control (git) — strongly recommended

Version control saves snapshots of your work so you can always undo. This is your safety net while learning. Still in the `the-stacks` folder:

```
git init
git add .
git commit -m "Starting point: v1 app and PRD"
```

If git isn't installed, macOS/Linux will prompt you to install it, or you can let Claude Code set it up. From now on, after any change you're happy with, take a new snapshot:

```
git add .
git commit -m "short description of what changed"
```

If a change ever breaks something and you want to undo everything since your last commit:

```
git restore .
```

### 2.8 Create a CLAUDE.md (project memory)

Claude Code automatically reads a file named `CLAUDE.md` in your project folder every session. It's where you record durable facts about the project so you don't have to re-explain them each time. Create it now — copy the contents from **Appendix A** of this document into a new file called `CLAUDE.md` in the project folder. (You can ask Claude Code to do this: "Create a CLAUDE.md file with the contents from Appendix A of PRD-the-stacks.md.")

### 2.9 How to actually work with Claude Code (the loop)

This is the core habit. Do it in small cycles:

1. **Start** Claude Code in the project folder: `claude`
2. **Ask for a plan first, not code.** For anything non-trivial, say: *"Before writing code, read PRD-the-stacks.md and outline your plan for increment P0 (export/import). Don't edit files yet."* Reading the plan is how you catch misunderstandings cheaply.
3. **Approve, then let it edit.** It will show proposed changes (a "diff" — red for removed lines, green for added). Read them. Approve or ask for adjustments.
4. **Test it yourself** using the manual checklist in Section 8. Open `the-stacks.html` in your browser and click through.
5. **Commit** when it works (Section 2.7). If it doesn't, either ask Claude Code to fix it or `git restore .` and try a smaller step.

**Guardrails for your first few sessions:**
- One increment per session. Don't ask for three features at once.
- Always read the diff before approving. You're the reviewer; the agent is the author.
- Commit after every increment that works. Small commits make undo painless.
- If you don't understand a change, ask Claude Code to explain it in plain English. That's a legitimate and useful prompt.

---

## 3. Working through this PRD with Claude Code

When you open a session to build a feature, a good opening prompt looks like:

> Read PRD-the-stacks.md and CLAUDE.md. We're building increment **P1 (re-ranking)**. Summarize the acceptance criteria back to me, note anything ambiguous, and propose a plan. Do not edit files until I say go.

After you approve the plan:

> Go ahead. Keep everything in the single `the-stacks.html` file, preserve the existing data model and scoring formula, and don't break the localStorage key. Show me the changes when done.

After it's done, run the Section 8 checklist, then commit.

---

## 4. What already exists (v1) — current-state spec

The shipped app is a **single self-contained `the-stacks.html` file**. No server, no accounts, no build step. Data persists in the browser via `localStorage`. Design is a "library card-catalog" theme: each book is a manila index card, tiers are catalog drawers, and the score is stamped like a call number in the card's corner.

### 4.1 The core loop (already built)

1. **Add a finished book** — title, author, and one optional "line to remember it by."
2. **Gut-check into a tier** — *Loved it / It was fine / Didn't like it.* This is captured **before** any comparison.
3. **Comparison placement** — the new book is compared against books already in that tier via binary search ("Which did you enjoy more?"), with a **"Too close to call"** escape that stops early.
4. **Filed with a score** — the book lands in its tier's ranked list and shows a 0–10 "call number" plus its rank within the drawer.

Books can be tapped to edit the takeaway or be removed.

### 4.2 Key design decisions already made (do not silently reverse)

- **Tiers are binding.** Comparisons only order books *within* the tier the user chose; a book cannot drift across tier boundaries through comparisons. Rationale: bounds the comparison space and preserves the gut reaction as real signal.
- **Three tiers, not five.** More buckets would recreate the granularity problem the product exists to solve.
- **Scores are relative to the user's own library, not absolute.** A 9.0 means "near the top of what I've read," not an objective quality claim. This is the honest version of a rating and a core differentiator from Goodreads' shared average.
- **Scores recalibrate** as the surrounding list changes; a book's number can shift without it being re-rated. This is intended behavior, not a bug.

### 4.3 Data model (authoritative — preserve this shape)

Stored in `localStorage` under the key **`the-stacks-v1`** as JSON:

```
{
  books: {
    [id]: {
      id: string,            // e.g. "b" + timestamp + random
      title: string,
      author: string,        // may be empty
      takeaway: string,      // optional one-liner
      tier: "loved" | "fine" | "disliked",
      dateFinished: string   // display string like "Jul 2026"
    }
  },
  rankings: {
    loved:    [id, id, ...], // ordered BEST-FIRST within the tier
    fine:     [id, ...],
    disliked: [id, ...]
  }
}
```

The `rankings` arrays are the **source of truth for order**. Scores are derived on render, never stored.

### 4.4 Scoring formula (authoritative)

Each tier owns a band on the 0–10 scale:

| Tier | Band (low–high) |
|---|---|
| Loved it | 7.0 – 10.0 |
| It was fine | 4.0 – 6.9 |
| Didn't like it | 1.0 – 3.9 |

For a book at position `index` (0 = best) in a tier of `n` books with band `[lo, hi]`:

```
score = round( hi - (index / n) * (hi - lo),  1 decimal place )
```

- A lone book in a tier currently sits at the **top of its band** (your first "loved" is a 10.0 until dethroned). The conservative alternative — band midpoint — is present as a commented line in the `scoreFor` function.
- This formula guarantees the worst "loved" book never dips to or below the top of the "fine" band, so bands never overlap. (Verified across list sizes.)

### 4.5 Placement algorithm (authoritative)

Binary-search insertion within the chosen tier's array:

```
lo = 0; hi = arr.length
while (lo < hi):
    mid = floor((lo + hi) / 2)
    if new book preferred over arr[mid]:  hi = mid       // upper (better) half
    else:                                 lo = mid + 1    // lower half
insert new id at index lo
```

"Too close to call" short-circuits the loop and inserts the new book at `mid + 1` (just below the compared book), giving them near-equal scores. Comparisons per book stay at roughly log₂(n).

### 4.6 Quality floor already in place (keep it)

- Responsive down to mobile.
- Visible keyboard focus; cards are keyboard-activatable (Enter/Space).
- `prefers-reduced-motion` respected (animations disabled when the user asks for it).
- User input is HTML-escaped before rendering.
- `localStorage` writes are wrapped so a blocked-storage sandbox doesn't crash the app.

---

## 5. Goals and non-goals for the next phase

**Goals**
- Make the data durable and portable (it currently lives only in one browser's storage).
- Add the two capabilities most likely to be missed as the library grows: re-ranking and findability.
- Lay groundwork for lightweight personal insights once there's enough data to be meaningful.
- Keep every addition small, reviewable, and shippable on its own.

**Non-goals (out of scope — resist these)**
- No backend, no accounts, no login.
- No recommendations engine, no cross-user data, no "people who read X also…" — these require other users' data and a server, and belong to a different product.
- No social feed, virality, sharing, or public ratings.
- No full review editor — the "line to remember it by" stays a single optional field.
- No "Want to Read" / to-read queue. Interviews showed people don't actually use it; adding it is undifferentiated scope.

---

## 6. Constraints and technical guardrails (tell Claude Code to honor these)

1. **Single self-contained file.** Keep everything in `the-stacks.html` unless a specific increment explicitly says otherwise. It must run by double-clicking the file — no server, no build step.
2. **No external runtime dependencies** beyond the two Google Fonts already linked. The app must work offline once loaded (fonts degrade gracefully).
3. **Preserve the data model and scoring formula** in Sections 4.3–4.5 unless an increment explicitly changes them. If a change adds fields, **migrate existing data** rather than wiping it (see Section 9 on migrations).
4. **Never break the `localStorage` key silently.** If the schema version changes, bump the key deliberately and migrate.
5. **Maintain the quality floor** in Section 4.6 for every new UI element.
6. **Match the existing visual system** — card-catalog theme, the defined CSS variables, existing type and color tokens. New UI should look like it was always there.
7. **Vanilla HTML/CSS/JS only.** No frameworks, no bundlers. The point is a file you fully understand.

---

## 7. Backlog — prioritized build increments

Each increment is sized to be one Claude Code session. Priorities: **P0** before **P1** before **P2**. Each lists a user story, acceptance criteria, and the PM competency it demonstrates (useful for interview stories).

### P0 — Backup & restore (export / import) 🟥 do this first

**Why first:** all data currently lives in one browser's `localStorage`. Clearing browser data, switching machines, or a bad edit wipes everything. Before you accumulate months of real data, make it portable. It's also the ideal first Claude Code task — small, self-contained, and easy to verify.

**User story:** As a reader, I can export my whole catalog to a file and re-import it later, so I never lose my rankings and can move between devices.

**Acceptance criteria:**
- An "Export" control downloads the full state as a `.json` file with a dated filename (e.g. `the-stacks-2026-07-19.json`).
- An "Import" control lets the user pick a previously exported `.json` file and replaces the current catalog after a confirmation step (since import overwrites).
- Import validates the file shape (has `books` and `rankings`); on a malformed file it shows a clear, non-apologetic error explaining what was expected, and changes nothing.
- Export/import controls live unobtrusively (e.g. a small footer or a "⋯" menu), consistent with the card-catalog aesthetic.
- No data model change required.

**PM competency:** recognizing data durability as a real user risk and sequencing it ahead of shinier features.

---

### P1 — Re-ranking an existing book 🟧

**Why:** the most likely thing to be missed once there are ~20 books. Right now a mis-filed book can only be removed and re-added.

**User story:** As a reader, I can re-rank a book I already filed — either re-run its comparisons within its tier, or move it to a different tier — without losing its note.

**Acceptance criteria:**
- From a book's detail view, a "Re-rank" action re-runs the comparison flow for that book within its current tier and re-inserts it at the resulting position.
- A separate "Move to another tier" action lets the user pick a different tier; the book is then placed in that tier via the normal comparison flow.
- The book's `takeaway`, `title`, `author`, and `dateFinished` are preserved through either operation.
- During a re-rank, the book being re-ranked is excluded from its own comparison set (it can't be compared against itself).
- Scores recompute correctly afterward for any affected tier.

**PM competency:** handling the full lifecycle of an object, not just its creation; thinking through edge cases (self-comparison, note preservation).

---

### P2a — Findability: search, sort, filter 🟨

**Why:** directly addresses the strongest volunteered pain (Goodreads is hard to navigate vs. Letterboxd). Valuable even at small library sizes and a clean, self-contained add.

**User story:** As a reader, I can quickly find a book and view my shelf in different orders, so my catalog stays usable as it grows.

**Acceptance criteria:**
- A search field filters visible cards by title or author as the user types (case-insensitive, live).
- A sort control offers at least: by rank/score (default, current behavior), by date finished (newest/oldest), and alphabetical by title.
- A filter lets the user show only a chosen tier, or all tiers.
- Search/sort/filter are view-only — they never change stored order or scores.
- Empty results show an inviting empty state ("No books match 'xyz'"), not a blank screen.
- Controls match the existing visual system and collapse gracefully on mobile.

**PM competency:** translating a comparative user complaint ("it's not like Letterboxd") into concrete, scoped interface requirements.

---

### P2b — Optional genre/tags on a book 🟨 (prerequisite for P3)

**Why:** personal insights (P3) need a dimension to slice by. Genre is the most natural. This is a small **schema change**, so it must include a migration.

**User story:** As a reader, I can optionally tag a book with one or more genres, so I can later see patterns in what I read and rate highly.

**Acceptance criteria:**
- The add flow and the detail view allow adding zero or more genre tags (free text with light suggestions, or a small fixed list — your call; document the choice).
- New field added to the book object, e.g. `genres: string[]`. Existing books without the field are treated as `[]`.
- **Migration:** on load, any book missing `genres` is given `[]` and the store is re-saved. Do not wipe existing data. Consider bumping the storage key to `the-stacks-v2` with a one-time migration from `v1`.
- Tags display on the card and/or detail view in a way that fits the aesthetic.

**PM competency:** evolving a schema safely; sequencing an enabling change (tags) before the feature that needs it (insights).

---

### P3 — Your reading, in numbers (personal insights) 🟩

**Why:** the "personalized insight" idea from early brainstorming — but scoped to only *your own* behavior, which is the only version possible in a single-user app. Only meaningful once there are ~15+ books, so it's intentionally later.

**User story:** As a reader with a real catalog, I can see simple patterns in my own reading and rating, so I get a light payoff for logging and a nudge toward variety.

**Acceptance criteria:**
- A modest "insights" view (behind a button, not cluttering the main shelf) showing, using only local data:
  - distribution across the three tiers (how many loved / fine / disliked),
  - if genres exist (P2b): which genres you read most, and which you rate highest on average,
  - a gentle "comfort zone" observation (e.g. "You've rated sci-fi highest — most of your reading is in 2 genres"), phrased as an observation, never a judgment.
- The view states clearly when there's too little data to say anything useful (e.g. under ~10 books) instead of showing noisy numbers.
- No precise, prescriptive targets — this is reflection, not a scoreboard.

**PM competency:** knowing when a feature is premature (data thresholds), and scoping an idea down to what's actually possible under the constraints.

---

### Nice-to-haves (only if you want them; not scheduled)

- Edit title/author from the detail view (currently only the takeaway is editable).
- Keyboard shortcut to open the "add book" flow.
- A subtle count of comparisons made when filing a book ("filed in 3 comparisons") — reinforces the mechanic.

---

## 8. Manual QA checklist (run after every increment)

There's no automated test framework — it's a static file — so verify by hand. Open `the-stacks.html` in your browser and check:

- [ ] App loads with existing data intact (nothing wiped).
- [ ] Adding a book: title required; author and takeaway optional; tier selection works.
- [ ] Comparison flow appears when the chosen tier already has books; "Too close to call" ends it early.
- [ ] New book lands in the right tier with a sensible score and rank.
- [ ] Scores across a tier are ordered and within the tier's band (Section 4.4).
- [ ] Editing a takeaway saves and persists after refresh.
- [ ] Removing a book updates ranks/scores and persists after refresh.
- [ ] Refreshing the page keeps all data (localStorage working).
- [ ] The new feature's own acceptance criteria (Section 7) all pass.
- [ ] Works at a narrow (mobile) window width.
- [ ] Keyboard: you can tab to controls, see focus outlines, and activate cards with Enter.

**Optional, higher-rigor step:** ask Claude Code to extract the pure logic (`scoreFor` and the insertion function) into a tiny standalone test script and run a few assertions, so you catch scoring regressions automatically. This mirrors how the v1 logic was verified.

---

## 9. Notes on schema migrations (read before P2b)

When an increment adds or changes a field:

1. Prefer **additive** changes (new optional field with a sensible default).
2. On load, detect old-shaped data and upgrade it in place, then re-save — never discard it.
3. If the change is significant, bump the storage key (`the-stacks-v1` → `the-stacks-v2`) and write a one-time migration that reads the old key, transforms it, writes the new key, and leaves the old key untouched as a fallback.
4. The export/import feature (P0) is your insurance here — export before testing a migration.

---

## Appendix A — Suggested `CLAUDE.md` contents

Create a file named `CLAUDE.md` in the project folder with this content. Claude Code reads it automatically each session.

```
# The Stacks — project notes for Claude Code

## What this is
A single-file, single-user, offline book-ranking web app. Comparison-based ranking
(not star ratings). One file: the-stacks.html. No server, no accounts, no build step.
Full requirements are in PRD-the-stacks.md — read it before non-trivial work.

## Hard constraints (do not violate without being asked)
- Keep everything in the-stacks.html. No frameworks, bundlers, or new runtime deps
  (the two linked Google Fonts are the only exception). Must run by opening the file.
- Preserve the data model, scoring formula, and placement algorithm documented in the
  PRD (Sections 4.3–4.5). If a change adds fields, migrate existing data; never wipe it.
- localStorage key is "the-stacks-v1". Don't change it silently.
- Maintain the accessibility/quality floor: mobile responsive, visible keyboard focus,
  reduced-motion respected, user input escaped.
- Match the existing card-catalog visual system and CSS variables.

## How I want to work
- For anything non-trivial, propose a plan and wait for approval before editing files.
- Make one increment at a time. Show diffs. Explain changes in plain English if I ask.
- After changes, remind me to run the manual QA checklist and commit.

## Current status
v1 shipped. Next up: P0 export/import (see PRD Section 7).
```

---

## Appendix B — Quick command reference

| Goal | Command |
|---|---|
| Start Claude Code (inside project folder) | `claude` |
| Check it's installed | `claude --version` |
| Health check (inside Claude Code) | `/doctor` |
| Leave Claude Code | `/exit` |
| Make a folder / enter it | `mkdir the-stacks` / `cd the-stacks` |
| Start version control | `git init` |
| Save a snapshot | `git add .` then `git commit -m "message"` |
| Undo all changes since last snapshot | `git restore .` |

---

## Appendix C — Glossary (plain English)

- **Terminal / command line / CLI:** the text window where you type commands.
- **Claude Code:** the AI coding agent that edits your project files on your instruction.
- **Repo (repository):** your project folder once it's under version control (git).
- **Commit:** a saved snapshot of your project you can return to.
- **Diff:** the highlighted view of what changed — removed lines in red, added in green.
- **localStorage:** a small storage area inside your browser where the app keeps your data on your own device.
- **Schema / data model:** the agreed shape of the stored data (which fields exist).
- **Migration:** upgrading old stored data to a new shape without losing it.
- **Native installer:** the recommended way to install Claude Code; bundles what it needs, so no Node.js required.
```
