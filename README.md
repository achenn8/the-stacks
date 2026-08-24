# The Stacks

A single-file, offline-first web app for ranking the books you've read by **head-to-head
comparison** instead of star ratings — because a shelf full of 4- and 5-stars stops meaning
anything.

**Live demo:** _add your Vercel URL here_ · **Runs offline:** just open `index.html`

## The idea

Stars let you rate everything a 4 or 5, so the top of the scale piles up and stops being
useful. The Stacks makes you *commit to an order*: each finished book is placed by a few
"which did you enjoy more?" comparisons within a tier, and its 0–10 "call number" is just a
readable projection of where it sits in **your own** ranked list. A 9.0 means "near the top of
what *I've* read" — not an objective quality claim.

## Features

- **Comparison-based ranking** into three tiers (Loved it / It was fine / Didn't like it),
  placed by binary-search comparisons.
- **Re-rank or move** any book later, and **edit** its title, author, note, and genres.
- **Findability** — live search, sort (by score / date / title / author), and multi-select
  tier + genre filters.
- **Personal insights** — your tier split, most-read genres, and highest-rated genres, shown
  only once you've logged enough for the numbers to mean something.
- **Backup & restore** — export/import your whole catalog as a JSON file.
- **Online title lookup** — start typing a title and it auto-fills the author via the
  [Open Library](https://openlibrary.org/) API.

## Product decisions worth noting

- **Tiers are binding; scores are relative to your own library** — an honest alternative to a
  shared 5-star average.
- **Local-first and private** — your catalog lives in your browser (`localStorage`); nothing is
  uploaded. The one network call (the title lookup) sends only the title you're typing, and the
  app works fully offline without it.
- **Progressive enhancement** — the lookup is a bonus layer; typing by hand always works, and it
  degrades gracefully when offline.
- **A deliberate constraint break** — v1 was strictly offline with no dependencies; v2 relaxes
  that *on purpose* for the lookup, contained so the core never depends on the network.

## Tech

Vanilla HTML, CSS, and JavaScript in one file — no framework, no build step. Data persists in
`localStorage`; the title lookup uses the free Open Library API.

## Repo

- `index.html` — the whole app.
- `PRD-the-stacks.md` — the v1 product requirements.
- `PRD-v2-online.md` — the online (v2) addendum.

## Run locally

Open `index.html` in any modern browser. No install, no server, no accounts.
