# The Stacks

A single-file, offline-first web app for ranking the books you've read by **head-to-head
comparison** instead of star ratings — because a shelf full of 4- and 5-stars stops meaning
anything.

**Live demo:** [the-stacks-one.vercel.app](https://the-stacks-one.vercel.app) · **Runs offline:** just open `index.html` · **Optional account** to keep your stacks across devices

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
- **Import from Goodreads** — bring your reading history across from the CSV Goodreads lets you
  export. Rated books are placed by their stars and marked *not yet ranked by you* until you
  rank them properly; unrated ones wait in a **Read, not yet filed** shelf, with no score and no
  rank, because no judgement has been given. Runs entirely in your browser.
- **Real dates** — a finish date you choose (or leave blank), separate from when the entry was
  added; never an invented one.
- **Online title lookup** — start typing a title and it auto-fills the author via the
  [Open Library](https://openlibrary.org/) API.
- **Optional account** — sign in with a magic link (no password) to keep your catalog across
  devices. If two devices disagree, the app shows you both and asks; it never silently picks a
  winner.

## Product decisions worth noting

- **Tiers are binding; scores are relative to your own library** — an honest alternative to a
  shared 5-star average.
- **Local-first** — your catalog lives in your browser (`localStorage`) and the app works fully
  offline. The device is always the source of truth; an account is a copy of it, not the other
  way round.
- **Progressive enhancement** — the title lookup and the account are bonus layers. Typing by
  hand always works, and opened as a plain local file the app has no sign-in at all and behaves
  exactly as v1 did.
- **Deliberate, contained constraint breaks** — v1 was strictly offline with no dependencies.
  Each later exception (the lookup, then accounts) was added on purpose and fenced off so the
  core never depends on the network.

## Your data

- **Signed out:** nothing is uploaded, ever. The one network call (the title lookup) sends only
  the title you're typing.
- **Signed in:** your email, your username, and a copy of your catalog are stored in a
  [Supabase](https://supabase.com) database so they can follow you to other devices. Database
  rules (Row Level Security) mean each person can only ever read or change their own row; the
  key that appears in `index.html` is a *publishable* key that grants nothing on its own, by
  design.
- **Leaving:** *Your account → Delete my account* removes your login, username and saved
  catalog from the server. The books on your device stay exactly as they are.

## Tech

Vanilla HTML, CSS, and JavaScript in one file — no framework, no build step. Data persists in
`localStorage`; the title lookup uses the free Open Library API; optional accounts use Supabase
(magic-link sign-in, a Postgres database with Row Level Security, and one small Edge Function
for account deletion).

## Repo

- `index.html` — the whole app.
- `supabase/functions/delete-account/` — the server-side function behind *Delete my account*.
- `PRD-the-stacks.md` — the v1 product requirements.
- `PRD-v2-online.md` — the online (v2) addendum.

## Run locally

Open `index.html` in any modern browser. No install, no server. Sign-in only appears on the
hosted site — a magic link has nowhere to send you back to from a local file.
