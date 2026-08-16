# The Stacks — v2 (Online) PRD Addendum

**Extends:** `PRD-the-stacks.md` (v1). This addendum only covers what v2 changes; everything
in the v1 PRD still holds unless contradicted here.
**Status:** exploration, on the `v2-online` git branch (main stays the pure offline v1).
**Owner:** You
**One-line purpose:** Let the app *optionally* look up a book online so logging is faster and
authors auto-fill — without giving up the offline, private core that defines v1.

---

## 1. Why (the pain)

Logging a book means typing the title and author by hand. Two frictions:
- **Effort:** typing full titles/authors is slow; it taxes the "logging must stay effortless"
  goal from v1.
- **Gaps and errors:** people misremember or skip the author (the real "Glass Castle" moment —
  logged with a blank author). Typos also fragment later features (search, genres).

An online lookup removes typing and fills the author automatically.

## 2. The constraint change (the heart of v2)

v1's identity is: **offline, single-file, no server, no external dependencies, private.** v2
**deliberately relaxes two of those** and is explicit about what it keeps.

**Relaxes:**
- "Works fully offline" → v2 adds an *optional* online feature (a network request to a third
  party). The **core still works offline** (see §4).
- "No external runtime dependencies" → v2 depends on the Open Library API when online.

**Keeps (non-negotiable):**
- No accounts, no login, no backend of our own.
- Single file, vanilla HTML/CSS/JS.
- **Privacy-conscious:** the only data that leaves the device is the *title text the user is
  typing*, sent to look it up. No reading list, scores, notes, or identity is ever sent.
- The v1 data model, scoring, and quality floor are unchanged.

> Terms: **Progressive enhancement** = the app works without the feature; the feature is a bonus
> layer on top. **Graceful degradation** = when the feature can't run (offline, API down), it
> disappears cleanly and the app keeps working.

## 3. The feature (v2 MVP)

**Title autocomplete that fills title + author.** As the user types a title in the "Log a
finished book" screen, the app queries Open Library and shows a short dropdown of matches
(**Title — Author — Year**). Selecting one fills the title and the author fields. That's it —
the MVP is one feature.

**Data source:** Open Library search API (free, no API key, allows browser requests).
Endpoint: `https://openlibrary.org/search.json?title={q}&fields=title,author_name,first_publish_year&limit=6`

## 4. How it behaves (progressive enhancement + degradation)

- The title/author inputs stay **plain text** and work exactly as in v1. The dropdown is an
  overlay; ignoring it and typing manually always works.
- **Debounced** (~300ms) with a **minimum query length** (~3 chars) so it doesn't fire on every
  keystroke or flash results mid-word.
- **Stale responses are discarded** (if the user types fast, answers to old queries are ignored).
- **Recent queries are cached** in memory to avoid re-asking.

## 5. Key product decisions

- **Result ranking (messy data).** Open Library returns many editions/near-matches. Prefer
  results that (a) have an author, (b) match the typed title closely, (c) use `first_publish_year`
  to favor the original edition. Show ~5, most-relevant first.
- **"No match" handling (see §7 acceptance).** Never block the user; treat "not found" as normal.
- **Failure ≠ empty.** A network/API error must say "couldn't check," never "no book found."
- **Privacy disclosure.** An info icon (ⓘ) by the Title field reveals a one-line note: only the
  title text is sent to Open Library for lookup; nothing else leaves the device.

## 6. Non-goals for v2 MVP (resist these)

- No recommendations engine, no "books you might like," no cross-user data.
- No covers, blurbs, ratings, page counts, or ISBN capture (possible v2.1).
- No genre auto-detection (still deferred; see the roadmap memory note).
- No backend, accounts, or telemetry. (Note: you *can't* measure usage without telemetry, which
  fights the privacy stance — an intentional trade-off.)

## 7. Acceptance criteria

- Typing a known title shows a dropdown of matches within ~1s on a normal connection; selecting
  one fills title + author.
- **Truly no results:** a gentle in-dropdown empty state (e.g. "No match — keep typing" or an
  explicit "use what I typed" row); the typed title is preserved; the user can finish manually.
- **Network/API failure or offline:** the dropdown does not appear (or shows a "couldn't reach
  lookup" note); the user types normally; nothing is blocked and no error is thrown.
- The feature never overwrites text the user has already typed without an explicit selection.
- Removing the network at any point leaves the add-a-book flow fully usable.
- Quality floor preserved: keyboard-operable dropdown (arrow keys + Enter + Escape), visible
  focus, mobile-friendly, user input escaped.

## 8. Decisions & open questions

**Decided (2026):** minimum query length is **3 characters**; the privacy note lives behind an
**info icon** by the Title field; an empty title search **falls back to manual entry only** for
the MVP.

**Deferred to v2.1:** loosening the query or adding a second source (Google Books) when title
search is empty.

**Still open:** could auto-fill ever pick the "wrong" author (a translator/contributor)? Interim
guard: take the first/primary `author_name` and always show it in the suggestion so the user can
catch a bad pick before selecting.

## 9. Why this is worth doing (learning + interview value)

Each decision above maps to a PM competency to narrate: **bending a core constraint deliberately**
(offline → optional online), **build vs. buy** (consume Open Library vs. build a book database),
**designing for latency and failure** (loading/empty/error as first-class states), **data quality
and trust** (ranking noisy results; the privacy cost of going online), and **knowing when you'd
need a backend** (headers, caching, hidden keys — the line v1 refused to cross).
