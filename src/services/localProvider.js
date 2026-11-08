// Local comic data provider.
//
// This is the ONLY module the UI talks to for comic data (via ./index.js).
// It reads the small starter catalog in src/data/catalog and exposes it through
// async functions, exactly as a network-backed provider would. To use a live
// API later, write another module with the same exports and change one line in
// ./index.js. No component needs to change.
//
// Normalized comic shape returned by every function:
//   {
//     id, title, series: { id, title } | null, collects?, publisher?,
//     year?, releaseDate?, description?,
//     writers: string[], artists: string[], characters: string[], genres: string[],
//     coverUrl?, coverThumbUrl?, mature?, beginnerFriendly?, featured?
//   }
// Optional fields are simply absent when unknown. Components must handle that.

import { comics as rawComics } from '../data/catalog/comics.js'
import { series as rawSeries } from '../data/catalog/series.js'
// Collected editions synced weekly from Metron by `npm run sync:catalog`.
// Empty until the first sync has run.
import synced from '../data/catalog/synced.json'

const hasSynced = synced.entries.length > 0

export const providerInfo = {
  id: 'local-catalog',
  name: hasSynced ? 'Starter catalog plus Metron' : 'Local starter catalog',
  isLive: false,
  summary: hasSynced
    ? 'A hand-checked starter set of well-known collected editions, plus more collected editions synced weekly from Metron. It is not a live feed, and the synced entries have fewer details (no descriptions, creators or genres).'
    : 'A small hand-checked catalog of well-known collected editions. It is not a live feed and does not track new releases.',
  coverAttribution: hasSynced
    ? 'Cover images courtesy of Open Library and Metron.'
    : 'Cover images courtesy of Open Library.',
}

// ---------------------------------------------------------------- building

const seriesById = new Map(rawSeries.map((s) => [s.id, s]))

function coverUrl(openLibraryId, size) {
  return `https://covers.openlibrary.org/b/id/${openLibraryId}-${size}.jpg`
}

function toComic(raw) {
  const rawSeriesEntry = seriesById.get(raw.seriesId)
  return {
    id: raw.id,
    title: raw.title,
    series: rawSeriesEntry ? { id: rawSeriesEntry.id, title: rawSeriesEntry.title } : null,
    collects: raw.collects,
    publisher: raw.publisher,
    year: raw.year,
    description: raw.description,
    writers: raw.writers ?? [],
    artists: raw.artists ?? [],
    characters: raw.characters ?? [],
    genres: raw.genres ?? [],
    coverUrl: raw.openLibraryCoverId ? coverUrl(raw.openLibraryCoverId, 'L') : undefined,
    coverThumbUrl: raw.openLibraryCoverId ? coverUrl(raw.openLibraryCoverId, 'M') : undefined,
    mature: raw.mature,
    beginnerFriendly: raw.beginnerFriendly,
    featured: raw.featured,
  }
}

// A synced entry knows far less than a hand-written one: a title, year, publisher,
// the character it was found under, and a cover. Everything else is left empty.
function toSyncedComic(entry) {
  return {
    id: entry.id,
    title: entry.title,
    series: null,
    publisher: entry.publisher,
    year: entry.year,
    writers: [],
    artists: [],
    characters: entry.characters ?? [],
    genres: [],
    coverUrl: entry.image,
    coverThumbUrl: entry.image,
  }
}

const curatedComics = rawComics.map(toComic)

// Hand-written entries win. A synced entry with the same title is skipped so
// the same book doesn't appear twice in Discover.
const curatedTitles = new Set(curatedComics.map((comic) => normalize(comic.title)))
const syncedComics = synced.entries
  .filter((entry) => !curatedTitles.has(normalize(entry.title)))
  .map(toSyncedComic)

const allComics = [...curatedComics, ...syncedComics]
const comicsById = new Map(allComics.map((c) => [c.id, c]))

const decadeOf = (year) => (year ? `${Math.floor(year / 10) * 10}s` : null)
const creatorsOf = (comic) => [...comic.writers, ...comic.artists]

// Lowercase, strip accents and punctuation so "Martín" matches "martin".
function normalize(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const searchIndex = new Map(
  allComics.map((comic) => [
    comic.id,
    {
      title: normalize(comic.title),
      other: normalize(
        [
          comic.series?.title,
          comic.publisher,
          comic.collects,
          ...creatorsOf(comic),
          ...comic.characters,
          ...comic.genres,
        ]
          .filter(Boolean)
          .join(' '),
      ),
    },
  ]),
)

// Score a comic against a query: every word must match somewhere.
function scoreMatch(comic, queryWords) {
  const { title, other } = searchIndex.get(comic.id)
  let score = 0
  for (const word of queryWords) {
    if (title.includes(word)) score += 10
    else if (other.includes(word)) score += 3
    else return 0
  }
  return score
}

function countBy(values) {
  const counts = new Map()
  for (const value of values) counts.set(value, (counts.get(value) ?? 0) + 1)
  return counts
}

const byCountThenName = (a, b) => b.count - a.count || a.name.localeCompare(b.name)

// ------------------------------------------------------------------ queries

const sorters = {
  newest: (a, b) => (b.year ?? 0) - (a.year ?? 0) || a.title.localeCompare(b.title),
  oldest: (a, b) => (a.year ?? 9999) - (b.year ?? 9999) || a.title.localeCompare(b.title),
  az: (a, b) => a.title.localeCompare(b.title),
}

/**
 * Search and filter comics.
 * Filters are all optional: query, character, creator, publisher, genre, decade, beginnerOnly.
 * sort: 'relevance' (default) | 'newest' | 'oldest' | 'az'
 * Returns { items, total } for the requested page.
 */
export async function searchComics({
  query = '',
  character,
  creator,
  publisher,
  genre,
  decade,
  beginnerOnly = false,
  sort = 'relevance',
  page = 1,
  pageSize = 24,
} = {}) {
  const queryWords = normalize(query).split(' ').filter(Boolean)

  let matches = allComics
    .filter((comic) => !character || comic.characters.includes(character))
    .filter((comic) => !creator || creatorsOf(comic).includes(creator))
    .filter((comic) => !publisher || comic.publisher === publisher)
    .filter((comic) => !genre || comic.genres.includes(genre))
    .filter((comic) => !decade || decadeOf(comic.year) === decade)
    .filter((comic) => !beginnerOnly || comic.beginnerFriendly)
    .map((comic) => ({ comic, score: queryWords.length ? scoreMatch(comic, queryWords) : 1 }))
    .filter(({ score }) => score > 0)

  if (sorters[sort]) {
    matches.sort((a, b) => sorters[sort](a.comic, b.comic))
  } else {
    // Relevance: best query match first; with no query, featured then beginner-friendly.
    const weight = (c) => (c.featured ? 2 : 0) + (c.beginnerFriendly ? 1 : 0)
    matches.sort(
      (a, b) =>
        b.score - a.score ||
        weight(b.comic) - weight(a.comic) ||
        a.comic.title.localeCompare(b.comic.title),
    )
  }

  const items = matches.map(({ comic }) => comic)
  return { items: items.slice(0, page * pageSize), total: items.length }
}

export async function getComic(id) {
  return comicsById.get(id) ?? null
}

export async function getComicsByIds(ids) {
  return ids.map((id) => comicsById.get(id)).filter(Boolean)
}

/** Comics that share a series, character or creator with the given comic. */
export async function getRelatedComics(comic, limit = 8) {
  const related = allComics
    .filter((other) => other.id !== comic.id)
    .map((other) => {
      let score = 0
      if (comic.series && other.series?.id === comic.series.id) score += 5
      score += other.characters.filter((c) => comic.characters.includes(c)).length
      score += creatorsOf(other).filter((c) => creatorsOf(comic).includes(c)).length * 2
      return { other, score }
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.other.title.localeCompare(b.other.title))
  return related.slice(0, limit).map(({ other }) => other)
}

/**
 * Newest comics available from this provider.
 * A live provider would return this week's releases. The local catalog has no
 * release calendar, so it returns the most recently published stories instead,
 * which is why the UI checks `providerInfo.isLive` before calling them "new".
 */
export async function getLatestComics(limit = 12) {
  return [...allComics].sort(sorters.newest).slice(0, limit)
}

export async function getFeaturedComics(limit = 12) {
  return allComics.filter((comic) => comic.featured).slice(0, limit)
}

export async function getBeginnerFriendlyComics(limit = 12) {
  return allComics.filter((comic) => comic.beginnerFriendly).slice(0, limit)
}

// ------------------------------------------------------------------- series

export async function getSeriesList({ query = '' } = {}) {
  const words = normalize(query).split(' ').filter(Boolean)
  return rawSeries
    .map((entry) => ({
      ...entry,
      comicCount: allComics.filter((c) => c.series?.id === entry.id).length,
    }))
    .filter((entry) => entry.comicCount > 0)
    .filter((entry) => words.every((w) => normalize(`${entry.title} ${entry.publisher}`).includes(w)))
    .sort((a, b) => a.title.localeCompare(b.title))
}

export async function getSeries(id) {
  const entry = seriesById.get(id)
  if (!entry) return null
  return { ...entry, comics: allComics.filter((c) => c.series?.id === id) }
}

// ------------------------------------------------------------------- facets

/** Creators (writers and artists) with how many comics they worked on. */
export async function getCreators({ query = '' } = {}) {
  const { creators } = await getFacets()
  const words = normalize(query).split(' ').filter(Boolean)
  return creators.filter((creator) => words.every((word) => normalize(creator.name).includes(word)))
}

export async function getCharacters({ query = '' } = {}) {
  const { characters } = await getFacets()
  const words = normalize(query).split(' ').filter(Boolean)
  return characters.filter((character) => words.every((word) => normalize(character.name).includes(word)))
}

/** Everything Discover needs to build its filters, with counts. */
export async function getFacets() {
  const toList = (counts) =>
    [...counts].map(([name, count]) => ({ name, count })).sort(byCountThenName)

  const creatorRoles = new Map()
  for (const comic of allComics) {
    for (const name of comic.writers) creatorRoles.set(name, new Set([...(creatorRoles.get(name) ?? []), 'Writer']))
    for (const name of comic.artists) creatorRoles.set(name, new Set([...(creatorRoles.get(name) ?? []), 'Artist']))
  }
  const creatorCounts = countBy(allComics.flatMap((c) => [...new Set(creatorsOf(c))]))

  return {
    characters: toList(countBy(allComics.flatMap((c) => c.characters))),
    publishers: toList(countBy(allComics.map((c) => c.publisher).filter(Boolean))),
    genres: toList(countBy(allComics.flatMap((c) => c.genres))),
    decades: [...countBy(allComics.map((c) => decadeOf(c.year)).filter(Boolean))]
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => a.name.localeCompare(b.name)),
    creators: [...creatorCounts]
      .map(([name, count]) => ({ name, count, roles: [...creatorRoles.get(name)].sort() }))
      .sort(byCountThenName),
  }
}
