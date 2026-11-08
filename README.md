# SplashPage

> A modern comic discovery hub built to make finding, exploring, and getting into comics easier.

**Find your next story.** SplashPage is a static, responsive web app for people who want to read comics but don't know where to begin.

## The problem

Comics are hard to enter from the outside. Characters have decades of history, series restart at issue #1 without being new, and "just start at the beginning" is rarely good advice. Most comic sites are built for people who already collect.

SplashPage focuses on the first step: *which book should I read, and why that one?*

## What's implemented

| Area | What it does |
| --- | --- |
| **Beginner Guides** | Hand-written reading guides. Each recommends a starting point, explains **why** every book is on the list, and offers alternate paths (for example *Just the Essentials*, *Classic*, *Modern*). The chosen path is stored in the URL (`?path=modern`), so it can be linked. |
| **New Releases** | Real weekly releases from [Metron](https://metron.cloud): this week, upcoming weeks and last week, with a publisher filter. Refreshed every Wednesday by the deploy workflow. Metron data is credited on the page and in the footer. |
| **Home** | Hero and search, featured guides, beginner-friendly picks, explore by character, featured comics, publishers and genres. The "New Releases" row uses the synced release data. |
| **Discover** | Search plus filters for character, creator, publisher, genre and decade. Browse comics, series, creators or characters. Filters live in the URL, so any search can be shared or bookmarked. |
| **Comic and series pages** | Cover, credits, description, characters and related guides. Any field that isn't known is simply left out. Nothing is made up to fill a gap. |
| **Saved** (local only) | Save comics and guides, and see recently viewed. Stored in your browser's `localStorage`. There are **no accounts**. |

Also: keyboard navigation with a visible focus ring, a skip link, alt text, loading/empty/error states, graceful fallbacks for missing covers, and `prefers-reduced-motion` support.

### Deliberately not included

No accounts or login, profiles, comments or forums, social feeds, subscriptions, payments, marketplace, collection value tracking or backend. SplashPage is for discovery and information only.

## Where the comic data comes from

There are two sources, and the app labels each honestly.

### New releases: synced weekly from Metron

`scripts/sync-releases.mjs` calls the [Metron](https://metron.cloud) API for recent and upcoming issues by store date (DC, Marvel, Image, Dark Horse, BOOM! and IDW), and writes `public/data/releases.json`. The site loads that file at runtime.

- **The API token never reaches the site.** It lives in the `METRON_TOKEN` repository secret and is read by the sync script in GitHub Actions. Only the resulting JSON is published.
- The generated file is committed to the repo. The weekly workflow refreshes and commits it; ordinary pushes build with the committed copy, so a push never wipes the site's data.
- Metron's limits are 20 requests per minute and 5,000 per day. The script spaces out requests and honors `Retry-After`.
- Metron's data is licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), so the site credits it wherever release data appears.
- If no synced data exists (for example local development before a sync), Home falls back to the catalog's "Recently Published" row and `/releases` shows an "isn't available" message. Nothing is invented to fill the gap.
- Release cards are not links, because release data has no detail page on SplashPage.

To try it locally, create a token on your Metron account page, then:

```bash
METRON_TOKEN=your-token npm run sync:releases
npm run dev
```

### Comics catalog: hand-written starter set plus collected editions from Metron

Discover searches two things together:

1. **The starter catalog** (`src/data/catalog/comics.js`): hand-checked collected editions with descriptions, creators, genres and beginner-friendly flags. The Beginner Guides link to these.
2. **Synced collected editions** (`src/data/catalog/synced.json`): trade paperbacks, hardcovers and graphic novels from Metron for the characters and teams listed in `scripts/sync-catalog.mjs`. This file is generated and committed to the repo.

Synced entries only have what Metron's list endpoints give cheaply: title, year, publisher, the character or team they were found under, and a cover. They have **no descriptions, creators or genres**, so those filters only match starter-catalog entries. The comic page says "No description is available" rather than making anything up. If a synced entry has the same title as a starter entry, the starter entry wins and the synced one is skipped.

`npm run sync:catalog`:

- lists the series for each character or team (about 100 per request) and then looks up one cover per series. Covers already in `synced.json` are reused, so after the first run only new series cost requests.
- needs `METRON_TOKEN`, spaces out requests, and caps cover lookups per run (1,500 by default; change with `--max-covers=N`). If it hits the cap, the rest are picked up next run.
- has a `--dry-run` mode that prints what it found (series types, counts per source, sample titles, publishers) without fetching covers or writing anything. Run that first after changing the sources.
- skips a character or team it can't find by its slug, and tells you.

To add more characters or teams, add a line to `SOURCES` at the top of `scripts/sync-catalog.mjs`. Use the name the site uses (so filters match) and Metron's slug (the last part of `https://metron.cloud/character/<slug>/`).

The weekly workflow runs this sync and commits the updated `synced.json` back to `main`, so the catalog stays current without anyone touching the repo. Ordinary pushes just use the file that's already committed.

The app says wherever it matters that the catalog is not a live feed (for example a note on Discover).

The starter set is 39 well-known collected editions and 37 series, written by hand. Optional fields (creators, "collects" ranges) are included only when known.

Covers are hotlinked, not stored in this repo: starter entries use [Open Library](https://openlibrary.org/dev/docs/api/covers) (`covers.openlibrary.org`), synced entries and releases use Metron's image host. Both are public services, so covers may occasionally be slow or missing, and the UI falls back to a placeholder. Metron's cover images are full size, so Discover loads larger images than it strictly needs.

### Why a sync script instead of calling an API from the browser?

Comic APIs need an API key or authentication. A static site on GitHub Pages has no server, so any key placed in the code would be public to every visitor. Fetching at build time in CI keeps the key private while the site stays static. The trade-off is freshness: data is as new as the last weekly sync, and the page says when that was.

### Swapping in a real provider for the catalog later

All comic data flows through `src/services/index.js`, which re-exports `localProvider.js`. Pages never read the data files directly. A live provider only needs to export the same functions (`searchComics`, `getComic`, `getSeries`, `getFacets`, …) and `providerInfo` with `isLive: true`. Then change one line in `services/index.js`. The UI labels adapt automatically.

## Tech

- [React](https://react.dev/) 19 and [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/) (hash routing, see *Deploying*)
- Plain CSS: design tokens in `src/styles/tokens.css`, one CSS file next to each component
- Self-hosted fonts through [Fontsource](https://fontsource.org/): Bebas Neue, Inter, Patrick Hand
- [oxlint](https://oxc.rs/docs/guide/usage/linter) for linting

No UI framework and no state library. That is on purpose, to keep the code easy to read.

## Run it locally

You need a current Node.js (20.19 or newer, or 22.12+, as required by Vite).

```bash
npm install
npm run dev        # http://localhost:5173
```

Other scripts:

```bash
npm run build        # production build into dist/
npm run preview      # serve the production build locally
npm run lint         # oxlint
npm run check:data   # validate catalog and guide data (see below)
npm run sync:releases  # fetch new releases from Metron (needs METRON_TOKEN)
npm run sync:catalog   # grow the Discover catalog from Metron (needs METRON_TOKEN; try --dry-run first)
```

## Project structure

```
src/
  data/
    catalog/      local comics and series (the starter dataset)
    guides/       one file per Beginner Guide, plus index.js (the registry)
    characters.js featured characters on the home page
  services/       data access: the only place pages get comic data from
  hooks/          useAsync, localStorage lists, page titles
  components/     reusable pieces: ComicCard, CoverImage, GuideCard, ...
  layout/         header, footer, app shell
  pages/          one component per route
  styles/         tokens and global CSS
scripts/
  validate-data.mjs     checks catalog and guide data
  sync-releases.mjs     fetches new releases from Metron
  sync-catalog.mjs      fetches collected editions from Metron
  lib/metron.mjs        shared, rate-limited Metron client
```

## Adding a Beginner Guide

Guides are plain JavaScript objects, so no code changes are needed.

1. Copy `src/data/guides/batman.js`. It is fully commented and describes every field.
2. Edit the content. Each step needs a `why`. Use a `comicId` from the catalog to show a cover and link to its page. You can leave `comicId` out for a book that isn't in the catalog yet.
3. Import it and add it to the list in `src/data/guides/index.js`.
4. Run `npm run check:data`. It reports broken comic references, duplicate ids, unknown paths and similar mistakes.

## Deploying to GitHub Pages

The site is published by `.github/workflows/deploy.yml`, which lints, refreshes the catalog and releases from Metron (weekly and manual runs only), validates the data, builds, and deploys `dist/`. Refreshed data is committed back to `main` as "Weekly data sync". It runs:

- on every push to `main`
- every **Wednesday at 15:00 UTC** (8am Pacific), which refreshes the release data and the catalog with no action from you (the catalog update is committed back to `main` as "Weekly catalog sync")
- on demand from the Actions tab

In the repository settings, **Pages → Source** must be set to **GitHub Actions**, and a **`METRON_TOKEN`** secret must exist (Settings → Secrets and variables → Actions). The live site is at https://randycomicart.github.io/SplashPage/.

If the Wednesday sync fails, the deploy stops and the previous site stays up. A manual run that fails to sync still deploys, using the data already committed. Ordinary pushes don't call Metron at all.

GitHub pauses scheduled workflows in public repositories after 60 days without activity. To prevent that, each weekly run also re-enables the workflow through GitHub's API (the `keepalive` job), which resets the timer. If the schedule ever does stop, open the Actions tab and re-enable the workflow.

How the project is set up for Pages:

- `vite.config.js` sets `base` to `/SplashPage/` for production builds (and `/` for `npm run dev`). If the repository is renamed, update that value.
- The app uses **hash routing** (URLs look like `/SplashPage/#/guides/...`) because GitHub Pages can't redirect unknown paths back to a single-page app, and a normal route would 404 on refresh.

To check a production build locally before pushing, run `npm run build` and then `npm run preview`.

## Status

Working and usable, with a deliberately small catalog. Five Beginner Guides are included (Batman, Spider-Man, X-Men, Superman, Daredevil); Batman is the polished reference. Layouts were checked by hand at phone, tablet and desktop widths. There is no automated test suite yet.

## Future ideas

Not built yet. These are ideas, not promises.

- Descriptions, creators and genres for synced catalog entries (needs more API requests per series)
- Release detail pages
- More guides
- Guides for creators and genres, not only characters
- Reading-order timelines for long-running series
- "Where to read" links to libraries and publishers' own storefronts (informational only)
- Automated tests for the data layer and key flows

## Credits and notices

Comic titles, characters and artwork are trademarks and copyrights of their respective owners. SplashPage is an independent, non-commercial project and is not affiliated with any publisher. Catalog cover images are provided by Open Library. New release data and covers come from [Metron](https://metron.cloud) (data licensed CC BY-SA 4.0).
