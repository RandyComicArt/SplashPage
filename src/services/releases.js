// New-release data.
//
// Unlike the starter catalog, this comes from a synced file:
// `npm run sync:releases` (run by the deploy workflow) writes
// public/data/releases.json from Metron, and the site loads it at runtime.
//
// If the file isn't there (for example during local development before a sync),
// getReleases() resolves to null and pages show an honest "not available" state
// instead of made-up data.

const DATA_URL = `${import.meta.env.BASE_URL}data/releases.json`

let cached = null

async function load() {
  try {
    const response = await fetch(DATA_URL)
    if (!response.ok) return null
    // The dev server answers unknown files with index.html, which fails to parse here.
    const data = await response.json()
    if (!data || !Array.isArray(data.items) || !data.updatedAt) return null
    return data
  } catch {
    return null
  }
}

/** Resolves to `{ source, updatedAt, range, items }`, or null when there is no synced data. */
export function getReleases() {
  cached ??= load()
  return cached
}

// ---------- Date helpers ----------

// Store dates are plain "YYYY-MM-DD" days. Parse them as local dates so they
// don't shift by a day in some time zones.
export function parseDay(day) {
  const [year, month, date] = day.split('-').map(Number)
  return new Date(year, month - 1, date)
}

export function formatDay(day, options = { weekday: 'short', month: 'short', day: 'numeric' }) {
  return new Intl.DateTimeFormat(undefined, options).format(parseDay(day))
}

function mondayOf(date) {
  const monday = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const sinceMonday = (monday.getDay() + 6) % 7
  monday.setDate(monday.getDate() - sinceMonday)
  return monday
}

/** How many weeks a store date is from the current week: 0 = this week, 1 = next week, -1 = last week. */
export function weekOffset(storeDay, today = new Date()) {
  const msPerWeek = 7 * 24 * 60 * 60 * 1000
  return Math.round((mondayOf(parseDay(storeDay)) - mondayOf(today)) / msPerWeek)
}

function weekLabel(offset, firstItem) {
  if (offset === 0) return 'This week'
  if (offset === 1) return 'Next week'
  if (offset === -1) return 'Last week'
  const monday = mondayOf(parseDay(firstItem.storeDate))
  const text = new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric' }).format(monday)
  return `Week of ${text}`
}

/**
 * Groups releases by week, in reading order: this week, upcoming weeks, then past weeks.
 * Returns [{ offset, label, items }].
 */
export function groupByWeek(items, today = new Date()) {
  const groups = new Map()
  for (const item of items) {
    const offset = weekOffset(item.storeDate, today)
    if (!groups.has(offset)) groups.set(offset, [])
    groups.get(offset).push(item)
  }

  const upcoming = [...groups.keys()].filter((offset) => offset >= 0).sort((a, b) => a - b)
  const past = [...groups.keys()].filter((offset) => offset < 0).sort((a, b) => b - a)

  return [...upcoming, ...past].map((offset) => {
    const weekItems = groups.get(offset)
    return { offset, label: weekLabel(offset, weekItems[0]), items: weekItems }
  })
}

export function getPublishers(items) {
  const counts = new Map()
  for (const item of items) counts.set(item.publisher, (counts.get(item.publisher) ?? 0) + 1)
  return [...counts.entries()]
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
}
