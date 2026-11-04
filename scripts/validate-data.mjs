// Sanity-checks the local catalog and the guides.
// Run with: npm run check:data
//
// It catches the mistakes that are easy to make when editing data by hand:
// a guide pointing at a comic id that doesn't exist, a typo in a path, and so on.

import { comics } from '../src/data/catalog/comics.js'
import { series } from '../src/data/catalog/series.js'
import { guides, guideLevels, entryLabels } from '../src/data/guides/index.js'
import { featuredCharacters } from '../src/data/characters.js'

const problems = []
const problem = (message) => problems.push(message)

function checkUnique(items, label, getKey) {
  const seen = new Set()
  for (const item of items) {
    const key = getKey(item)
    if (seen.has(key)) problem(`${label}: duplicate "${key}"`)
    seen.add(key)
  }
  return seen
}

// ---- Catalog
const seriesIds = checkUnique(series, 'series', (s) => s.id)
const comicIds = checkUnique(comics, 'comics', (c) => c.id)

for (const comic of comics) {
  const where = `comic "${comic.id}"`
  if (!comic.title) problem(`${where}: missing title`)
  if (!comic.publisher) problem(`${where}: missing publisher`)
  if (comic.seriesId && !seriesIds.has(comic.seriesId)) problem(`${where}: unknown seriesId "${comic.seriesId}"`)
  if (!comic.openLibraryCoverId) problem(`${where}: no cover (the UI will show a placeholder)`)
  if (comic.year && (comic.year < 1930 || comic.year > new Date().getFullYear() + 1)) {
    problem(`${where}: suspicious year ${comic.year}`)
  }
}

for (const entry of series) {
  if (!comics.some((comic) => comic.seriesId === entry.id)) {
    problem(`series "${entry.id}": has no comics (it will be hidden in Discover)`)
  }
}

// ---- Guides
const guideSlugs = checkUnique(guides, 'guides', (g) => g.slug)
const characterNames = new Set(comics.flatMap((comic) => comic.characters))

for (const guide of guides) {
  const where = `guide "${guide.slug}"`
  if (!guideLevels[guide.level]) problem(`${where}: unknown level "${guide.level}"`)
  if (!characterNames.has(guide.character)) problem(`${where}: character "${guide.character}" has no comics in the catalog`)
  if (!/^#[0-9a-f]{6}$/i.test(guide.accent ?? '')) problem(`${where}: accent must be a #rrggbb color`)

  for (const id of guide.heroComicIds) {
    if (!comicIds.has(id)) problem(`${where}: heroComicIds has unknown comic "${id}"`)
  }

  const stepIds = checkUnique(guide.steps, `${where} steps`, (step) => step.id)
  for (const step of guide.steps) {
    if (step.comicId && !comicIds.has(step.comicId)) problem(`${where}: step "${step.id}" has unknown comicId "${step.comicId}"`)
    if (!entryLabels[step.entry]) problem(`${where}: step "${step.id}" has unknown entry "${step.entry}"`)
    if (!step.why) problem(`${where}: step "${step.id}" needs a "why"`)
  }

  const pathIds = checkUnique(guide.paths, `${where} paths`, (path) => path.id)
  if (!pathIds.has(guide.defaultPathId)) problem(`${where}: defaultPathId "${guide.defaultPathId}" is not a path`)
  for (const path of guide.paths) {
    for (const id of path.stepIds) {
      if (!stepIds.has(id)) problem(`${where}: path "${path.id}" references unknown step "${id}"`)
    }
  }
}

// ---- Homepage character cards
for (const character of featuredCharacters) {
  if (!characterNames.has(character.name)) problem(`featured character "${character.name}" has no comics in the catalog`)
  if (character.guideSlug && !guideSlugs.has(character.guideSlug)) {
    problem(`featured character "${character.name}": unknown guideSlug "${character.guideSlug}"`)
  }
}

// The homepage hero links to this guide directly.
if (!guideSlugs.has('where-to-start-with-batman')) problem('the homepage hero links to guide "where-to-start-with-batman", which is missing')

if (problems.length) {
  console.error(`\nFound ${problems.length} data problem${problems.length === 1 ? '' : 's'}:\n`)
  for (const message of problems) console.error(`  - ${message}`)
  console.error('')
  process.exit(1)
}

console.log(`Data OK: ${comics.length} comics, ${series.length} series, ${guides.length} guides.`)
