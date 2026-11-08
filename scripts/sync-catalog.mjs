// Grows the Discover catalog with collected editions from Metron.
//
//   METRON_TOKEN=... npm run sync:catalog -- --dry-run     (look, don't write)
//   METRON_TOKEN=... npm run sync:catalog                   (write the catalog)
//
// What it does
//   1. Finds Metron's "collected edition" series types (trade paperbacks, hardcovers, ...).
//   2. For each character or team in SOURCES below, lists the series of those types
//      that feature them. Listing is cheap: 100 series per request.
//   3. Looks up one cover per series (one request each). Covers already saved in
//      src/data/catalog/synced.json are reused, so after the first run only new
//      series cost anything.
//   4. Writes src/data/catalog/synced.json, which the site bundles. This file is
//      committed to the repo.
//
// What it does NOT know: descriptions, creators and genres. The list endpoints don't
// include them and fetching them for every series would burn the rate limit. Those
// fields are simply left out, and the site copes with that.
//
// Metron data is licensed CC BY-SA 4.0 (https://metron.cloud), and the site credits it.

import { readFile, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { API, getAllPages, getJson, getRequestCount, requireToken } from './lib/metron.mjs'

const OUTPUT = fileURLToPath(new URL('../src/data/catalog/synced.json', import.meta.url))

// Characters and teams to pull in. `label` is how the site names them, and it should match
// the names used in src/data/catalog/comics.js so filters line up. `slug` is how Metron
// names them in its URLs: check https://metron.cloud/character/<slug>/ if one isn't found.
// `kind` is 'character' or 'team'.
const SOURCES = [
  { label: 'Batman', kind: 'character', slug: 'batman' },
  { label: 'Spider-Man', kind: 'character', slug: 'spider-man' },
  { label: 'Superman', kind: 'character', slug: 'superman' },
  { label: 'Wonder Woman', kind: 'character', slug: 'wonder-woman' },
  { label: 'Daredevil', kind: 'character', slug: 'daredevil' },
  { label: 'X-Men', kind: 'team', slug: 'x-men' },
  { label: 'Avengers', kind: 'team', slug: 'avengers' },
  { label: 'Justice League', kind: 'team', slug: 'justice-league' },
  { label: 'Captain America', kind: 'character', slug: 'captain-america' },
  { label: 'Iron Man', kind: 'character', slug: 'iron-man' },
  { label: 'Thor', kind: 'character', slug: 'thor' },
  { label: 'Hulk', kind: 'character', slug: 'hulk' },
  { label: 'Wolverine', kind: 'character', slug: 'wolverine' },
  { label: 'Deadpool', kind: 'character', slug: 'deadpool' },
  { label: 'Black Widow', kind: 'character', slug: 'black-widow' },
  { label: 'Flash', kind: 'character', slug: 'flash' },
  { label: 'Green Lantern', kind: 'character', slug: 'green-lantern' },
  { label: 'Aquaman', kind: 'character', slug: 'aquaman' },
  { label: 'Harley Quinn', kind: 'character', slug: 'harley-quinn' },
  { label: 'Joker', kind: 'character', slug: 'joker' },
  { label: 'Catwoman', kind: 'character', slug: 'catwoman' },
  { label: 'Fantastic Four', kind: 'team', slug: 'fantastic-four' },
  { label: 'Guardians of the Galaxy', kind: 'team', slug: 'guardians-of-the-galaxy' },
  { label: 'Teen Titans', kind: 'team', slug: 'teen-titans' },
]

// Series types that count as collected editions, matched against Metron's type names.
const COLLECTED_TYPES = /trade|hardcover|graphic novel|omnibus|digest|collect/i

// Metron's publisher names -> the names the site uses.
const PUBLISHER_NAMES = {
  DC: 'DC Comics',
  Marvel: 'Marvel Comics',
  Image: 'Image Comics',
  'Dark Horse': 'Dark Horse Comics',
  IDW: 'IDW Publishing',
  BOOM: 'BOOM! Studios',
  'BOOM!': 'BOOM! Studios',
  'Boom! Studios': 'BOOM! Studios',
}

const MAX_PAGES_PER_LIST = 4 // 400 series per source and type
const DEFAULT_MAX_COVER_REQUESTS = 1500

const args = process.argv.slice(2)
const dryRun = args.includes('--dry-run')
const maxCoversArg = args.find((arg) => arg.startsWith('--max-covers='))
const maxCovers = maxCoversArg ? Number(maxCoversArg.split('=')[1]) : DEFAULT_MAX_COVER_REQUESTS

requireToken()

// ---------------------------------------------------------------- helpers

const titleOf = (series) => {
  const raw = typeof series.series === 'string' ? series.series : (series.series?.name ?? series.name)
  return (
    raw
      // Metron's list shows "Name (1988)"; the year is stored separately.
      ?.replace(/\s*\(\d{4}\)\s*$/, '')
      // Metron adds the format to the name ("Batman: Hush HC"). Readers don't need it.
      .replace(/\s+(GN|OGN|HC|OHC|SC|TPB)$/i, '')
      .trim()
  )
}

const titleKey = (title) => title.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

const publisherOf = (series) => {
  const name = series.publisher?.name
  return name ? (PUBLISHER_NAMES[name] ?? name) : undefined
}

async function readExisting() {
  try {
    return JSON.parse(await readFile(OUTPUT, 'utf8'))
  } catch {
    return { entries: [], noCover: [] }
  }
}

// Looks up a character or team by slug (falling back to an exact name match).
async function resolveSource(source) {
  // The name search is a partial match, so "Batman" also returns many related characters.
  const { items } = await getAllPages(source.kind, { name: source.label }, { maxPages: 3 })
  const lower = source.label.toLowerCase()
  return (
    items.find((item) => item.slug === source.slug) ?? items.find((item) => item.name?.toLowerCase() === lower)
  )
}

// ------------------------------------------------------------------- main

async function main() {
  const existing = await readExisting()
  const cachedImages = new Map(existing.entries.map((entry) => [entry.id, entry.image]))
  const noCover = new Set(existing.noCover ?? [])

  // 1. Which series types are collected editions?
  const { items: types } = await getAllPages('series_type', {}, { maxPages: 2 })
  const collectedTypes = types.filter((type) => COLLECTED_TYPES.test(type.name))
  console.log(`Series types in Metron: ${types.map((type) => type.name).join(', ')}`)
  console.log(`Using: ${collectedTypes.map((type) => type.name).join(', ') || '(none matched!)'}`)
  if (collectedTypes.length === 0) throw new Error('No collected-edition series types found, so nothing was written.')

  // 2. List the series for each source.
  const found = new Map() // metron series id -> { id, title, year, publisher, characters }
  for (const source of SOURCES) {
    const match = await resolveSource(source)
    if (!match) {
      console.warn(`  ${source.label}: not found in Metron as a ${source.kind} (slug "${source.slug}"). Skipping.`)
      continue
    }

    let total = 0
    let added = 0
    const samples = []
    for (const type of collectedTypes) {
      const { items, count, truncated } = await getAllPages(
        'series',
        { [`${source.kind}_id`]: match.id, series_type_id: type.id },
        { maxPages: MAX_PAGES_PER_LIST },
      )
      total += count
      if (truncated) console.warn(`  ${source.label} / ${type.name}: stopped at ${items.length} of ${count}.`)

      for (const series of items) {
        const title = titleOf(series)
        if (!series.id || !title) continue
        const entry = found.get(series.id) ?? {
          id: series.id,
          title,
          year: series.year_began || undefined,
          publisher: publisherOf(series),
          characters: new Set(),
        }
        if (!found.has(series.id)) {
          found.set(series.id, entry)
          added++
          if (samples.length < 4) samples.push(`${title}${entry.year ? ` (${entry.year})` : ''}`)
        }
        entry.characters.add(source.label)
      }
    }
    console.log(
      `  ${source.label}: ${total} series in Metron, ${added} added (not already listed under another source). ` +
        `e.g. ${samples.join('; ')}`,
    )
  }

  if (found.size === 0) throw new Error('No series came back from Metron, so nothing was written.')

  // The same book often exists as both a hardcover and a paperback series. Show it once:
  // keep the earliest edition and combine the characters it was found under.
  const earliestByTitle = new Map()
  for (const entry of found.values()) {
    const key = titleKey(entry.title)
    const kept = earliestByTitle.get(key)
    if (!kept) {
      earliestByTitle.set(key, entry)
      continue
    }
    const winner = (entry.year ?? 9999) < (kept.year ?? 9999) ? entry : kept
    for (const character of entry === winner ? kept.characters : entry.characters) winner.characters.add(character)
    earliestByTitle.set(key, winner)
  }
  found.clear()
  for (const entry of earliestByTitle.values()) found.set(entry.id, entry)
  console.log(`${found.size} unique titles after merging hardcover and paperback editions of the same book.`)

  const publishers = new Map()
  for (const entry of found.values()) {
    const name = entry.publisher ?? '(none)'
    publishers.set(name, (publishers.get(name) ?? 0) + 1)
  }
  console.log(
    `Publishers: ${[...publishers].sort((a, b) => b[1] - a[1]).map(([name, n]) => `${name} ${n}`).join(', ')}`,
  )

  // 3. Covers: reuse saved ones, look up the rest.
  const needCovers = [...found.values()].filter((entry) => !cachedImages.has(`metron-${entry.id}`) && !noCover.has(entry.id))
  console.log(
    `${found.size} series found. ${found.size - needCovers.length} already have covers or were checked; ` +
      `${needCovers.length} need a cover lookup (limit this run: ${maxCovers}).`,
  )

  if (dryRun) {
    console.log('Dry run: nothing fetched or written.')
    return
  }

  let looked = 0
  let failures = 0
  const images = new Map()
  for (const entry of needCovers) {
    if (looked >= maxCovers) {
      console.log(`Reached the cover lookup limit. The rest will be picked up on the next run.`)
      break
    }
    looked++
    try {
      const body = await getJson(`${API}/issue/?${new URLSearchParams({ series_id: entry.id })}`)
      const image = body.results?.find((issue) => issue.image)?.image
      if (image) images.set(entry.id, image)
      else noCover.add(entry.id)
      failures = 0
    } catch (error) {
      console.warn(`  Cover lookup failed for series ${entry.id}: ${error.message}`)
      if (++failures >= 5) throw new Error('Five cover lookups failed in a row. Stopping so nothing half-written is saved.')
    }
    if (looked % 50 === 0) console.log(`  ...${looked} of ${needCovers.length} covers looked up`)
  }

  // 4. Write the catalog.
  const entries = []
  for (const entry of found.values()) {
    const id = `metron-${entry.id}`
    const image = images.get(entry.id) ?? cachedImages.get(id)
    if (!image) continue // no cover yet: leave it out rather than show a gap
    entries.push({
      id,
      title: entry.title,
      ...(entry.year ? { year: entry.year } : {}),
      ...(entry.publisher ? { publisher: entry.publisher } : {}),
      characters: [...entry.characters].sort(),
      image,
    })
  }
  entries.sort((a, b) => a.title.localeCompare(b.title) || a.id.localeCompare(b.id))

  const header = {
    source: {
      name: 'Metron',
      url: 'https://metron.cloud',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    syncedAt: new Date().toISOString(),
    noCover: [...noCover].sort((a, b) => a - b),
  }
  // One entry per line keeps the file readable and its diffs small.
  const text =
    `{\n  "source": ${JSON.stringify(header.source)},\n  "syncedAt": "${header.syncedAt}",\n` +
    `  "noCover": ${JSON.stringify(header.noCover)},\n  "entries": [\n` +
    entries.map((entry) => `    ${JSON.stringify(entry)}`).join(',\n') +
    `\n  ]\n}\n`

  await writeFile(OUTPUT, text)
  console.log(`Wrote ${entries.length} entries (${images.size} new covers, ${getRequestCount()} requests this run).`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
