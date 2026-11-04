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
| **Home** | Hero and search, featured guides, beginner-friendly picks, explore by character, featured comics, publishers and genres. |
| **Discover** | Search plus filters for character, creator, publisher, genre and decade. Browse comics, series, creators or characters. Filters live in the URL, so any search can be shared or bookmarked. |
| **Comic and series pages** | Cover, credits, description, characters and related guides. Any field that isn't known is simply left out. Nothing is made up to fill a gap. |
| **Saved** (local only) | Save comics and guides, and see recently viewed. Stored in your browser's `localStorage`. There are **no accounts**. |

Also: keyboard navigation with a visible focus ring, a skip link, alt text, loading/empty/error states, graceful fallbacks for missing covers, and `prefers-reduced-motion` support.

### Deliberately not included

No accounts or login, profiles, comments or forums, social feeds, subscriptions, payments, marketplace, collection value tracking or backend. SplashPage is for discovery and information only.

## Where the comic data comes from

**The catalog is a small local dataset, not a live feed.** The app says so wherever it matters (for example "Recently Published" instead of "New Releases", plus a note on Discover).

- `src/data/catalog/`: 39 well-known collected editions and 37 series, written by hand. Optional fields (creators, "collects" ranges) are included only when known.
- Cover images are loaded from [Open Library](https://openlibrary.org/dev/docs/api/covers) (`covers.openlibrary.org`). They are hotlinked, not stored in this repo. Open Library is a public service, so covers may occasionally be slow or missing. The UI falls back to a placeholder.

### Why not a live comics API?

The usual comic APIs need an API key or authentication. A static site on GitHub Pages has no server, so any key placed in the code would be public to every visitor. Rather than ship an insecure or invented integration, SplashPage uses the local dataset. A live source would need a small server-side proxy to hold the key, which is out of scope for a static app.

### Swapping in a real provider later

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
```

## Project structure

```
src/
  data/
    catalog/      local comics and series (the dev dataset)
    guides/       one file per Beginner Guide, plus index.js (the registry)
    characters.js featured characters on the home page
  services/       data access: the only place pages get comic data from
  hooks/          useAsync, localStorage lists, page titles
  components/     reusable pieces: ComicCard, CoverImage, GuideCard, ...
  layout/         header, footer, app shell
  pages/          one component per route
  styles/         tokens and global CSS
scripts/
  validate-data.mjs
```

## Adding a Beginner Guide

Guides are plain JavaScript objects, so no code changes are needed.

1. Copy `src/data/guides/batman.js`. It is fully commented and describes every field.
2. Edit the content. Each step needs a `why`. Use a `comicId` from the catalog to show a cover and link to its page. You can leave `comicId` out for a book that isn't in the catalog yet.
3. Import it and add it to the list in `src/data/guides/index.js`.
4. Run `npm run check:data`. It reports broken comic references, duplicate ids, unknown paths and similar mistakes.

## Deploying to GitHub Pages

The site is published by `.github/workflows/deploy.yml`, which lints, validates the data, builds, and deploys `dist/` on every push to `main`. In the repository settings, **Pages → Source** must be set to **GitHub Actions**. The live site is at https://randycomicart.github.io/SplashPage/.

How the project is set up for Pages:

- `vite.config.js` sets `base` to `/SplashPage/` for production builds (and `/` for `npm run dev`). If the repository is renamed, update that value.
- The app uses **hash routing** (URLs look like `/SplashPage/#/guides/...`) because GitHub Pages can't redirect unknown paths back to a single-page app, and a normal route would 404 on refresh.

To check a production build locally before pushing, run `npm run build` and then `npm run preview`.

## Status

Working and usable, with a deliberately small catalog. Five Beginner Guides are included (Batman, Spider-Man, X-Men, Superman, Daredevil); Batman is the polished reference. Layouts were checked by hand at phone, tablet and desktop widths. There is no automated test suite yet.

## Future ideas

Not built yet. These are ideas, not promises.

- A live data provider behind a small server-side proxy (so no key ever ships to the browser)
- More guides and a larger catalog
- Guides for creators and genres, not only characters
- Reading-order timelines for long-running series
- "Where to read" links to libraries and publishers' own storefronts (informational only)
- Automated tests for the data layer and key flows

## Credits and notices

Comic titles, characters and artwork are trademarks and copyrights of their respective owners. SplashPage is an independent, non-commercial project and is not affiliated with any publisher. Cover images are provided by Open Library.
