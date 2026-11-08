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
- The generated file is git-ignored. It is built fresh on every deploy.
- Metron's limits are 20 requests per minute and 5,000 per day. The script spaces out requests and honors `Retry-After`.
- Metron's data is licensed [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/), so the site credits it wherever release data appears.
- If no synced data exists (for example local development before a sync), Home falls back to the catalog's "Recently Published" row and `/releases` shows an "isn't available" message. Nothing is invented to fill the gap.
- Release cards are not links, because release data has no detail page on SplashPage.

To try it locally, create a token on your Metron account page, then:

```bash
METRON_TOKEN=your-token npm run sync:releases
npm run dev
```

### Comics catalog: local starter dataset, not a live feed

The app says so wherever it matters (for example a note on Discover).

- `src/data/catalog/`: 39 well-known collected editions and 37 series, written by hand. Optional fields (creators, "collects" ranges) are included only when known.
- Cover images are loaded from [Open Library](https://openlibrary.org/dev/docs/api/covers) (`covers.openlibrary.org`). They are hotlinked, not stored in this repo. Open Library is a public service, so covers may occasionally be slow or missing. The UI falls back to a placeholder.

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
```

## Adding a Beginner Guide

Guides are plain JavaScript objects, so no code changes are needed.

1. Copy `src/data/guides/batman.js`. It is fully commented and describes every field.
2. Edit the content. Each step needs a `why`. Use a `comicId` from the catalog to show a cover and link to its page. You can leave `comicId` out for a book that isn't in the catalog yet.
3. Import it and add it to the list in `src/data/guides/index.js`.
4. Run `npm run check:data`. It reports broken comic references, duplicate ids, unknown paths and similar mistakes.

## Deploying to GitHub Pages

The site is published by `.github/workflows/deploy.yml`, which lints, validates the data, syncs releases, builds, and deploys `dist/`. It runs:

- on every push to `main`
- every **Wednesday at 15:00 UTC** (8am Pacific), which refreshes the release data with no action from you
- on demand from the Actions tab

In the repository settings, **Pages → Source** must be set to **GitHub Actions**, and a **`METRON_TOKEN`** secret must exist (Settings → Secrets and variables → Actions). The live site is at https://randycomicart.github.io/SplashPage/.

If the Wednesday sync fails, the deploy stops and the previous site stays up. On a normal push, a failed sync doesn't block the deploy; the site just goes out without fresh release data.

GitHub pauses scheduled workflows in public repositories after 60 days without activity. To prevent that, each weekly run also re-enables the workflow through GitHub's API (the `keepalive` job), which resets the timer. If the schedule ever does stop, open the Actions tab and re-enable the workflow.

How the project is set up for Pages:

- `vite.config.js` sets `base` to `/SplashPage/` for production builds (and `/` for `npm run dev`). If the repository is renamed, update that value.
- The app uses **hash routing** (URLs look like `/SplashPage/#/guides/...`) because GitHub Pages can't redirect unknown paths back to a single-page app, and a normal route would 404 on refresh.

To check a production build locally before pushing, run `npm run build` and then `npm run preview`.

## Status

Working and usable, with a deliberately small catalog. Five Beginner Guides are included (Batman, Spider-Man, X-Men, Superman, Daredevil); Batman is the polished reference. Layouts were checked by hand at phone, tablet and desktop widths. There is no automated test suite yet.

## Future ideas

Not built yet. These are ideas, not promises.

- A larger catalog synced from Metron (series and collected editions, fetched incrementally to respect rate limits)
- Release detail pages
- More guides
- Guides for creators and genres, not only characters
- Reading-order timelines for long-running series
- "Where to read" links to libraries and publishers' own storefronts (informational only)
- Automated tests for the data layer and key flows

## Credits and notices

Comic titles, characters and artwork are trademarks and copyrights of their respective owners. SplashPage is an independent, non-commercial project and is not affiliated with any publisher. Catalog cover images are provided by Open Library. New release data and covers come from [Metron](https://metron.cloud) (data licensed CC BY-SA 4.0).
