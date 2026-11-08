// Fetches upcoming and recent comic releases from Metron and writes
// public/data/releases.json, which the site loads at runtime.
//
//   METRON_TOKEN=... npm run sync:releases
//
// Metron data is licensed CC BY-SA 4.0 (https://metron.cloud). The site credits
// it wherever the data is shown. Request pacing and the token live in lib/metron.mjs.

import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { getAllPages, requireToken } from './lib/metron.mjs'

const OUTPUT = fileURLToPath(new URL('../public/data/releases.json', import.meta.url))

// How far back and forward to look, in days.
const DAYS_BACK = 14
const DAYS_AHEAD = 21

// Metron's issue list does not say which publisher an issue belongs to, so we
// ask for one publisher at a time and label the results ourselves.
// `query` is a partial match on Metron's publisher name.
const PUBLISHERS = [
  { label: 'DC Comics', query: 'DC Comics' },
  { label: 'Marvel Comics', query: 'Marvel' },
  { label: 'Image Comics', query: 'Image' },
  { label: 'Dark Horse Comics', query: 'Dark Horse' },
  { label: 'BOOM! Studios', query: 'BOOM' },
  { label: 'IDW Publishing', query: 'IDW' },
]

const MAX_PAGES_PER_PUBLISHER = 10

requireToken()

const isoDay = (date) => date.toISOString().slice(0, 10)

function addDays(date, days) {
  const copy = new Date(date)
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

// Keep only the fields the site uses, and drop anything Metron left empty.
function toRelease(issue, publisher) {
  const seriesName = issue.series?.name
  if (!issue.id || !seriesName || !issue.store_date) return null

  return {
    id: issue.id,
    title: issue.issue || `${seriesName} #${issue.number}`,
    series: seriesName,
    ...(issue.number ? { number: String(issue.number) } : {}),
    publisher: publisher.label,
    storeDate: issue.store_date,
    ...(issue.cover_date ? { coverDate: issue.cover_date } : {}),
    ...(issue.image ? { image: issue.image } : {}),
  }
}

async function main() {
  const today = new Date()
  const from = isoDay(addDays(today, -DAYS_BACK))
  const to = isoDay(addDays(today, DAYS_AHEAD))
  console.log(`Fetching releases with store dates ${from} to ${to}`)

  const byId = new Map()
  for (const publisher of PUBLISHERS) {
    const { items: issues, truncated } = await getAllPages(
      'issue',
      {
        store_date_range_after: from,
        store_date_range_before: to,
        publisher_name: publisher.query,
      },
      { maxPages: MAX_PAGES_PER_PUBLISHER },
    )
    if (truncated) console.warn(`${publisher.label}: stopped after ${MAX_PAGES_PER_PUBLISHER} pages; more results exist.`)

    let added = 0
    for (const issue of issues) {
      const release = toRelease(issue, publisher)
      if (release && !byId.has(release.id)) {
        byId.set(release.id, release)
        added++
      }
    }
    console.log(`  ${publisher.label}: ${added} releases`)
    if (added === 0) console.warn(`  (nothing found for "${publisher.query}". Is the name right?)`)
  }

  const items = [...byId.values()].sort(
    (a, b) => a.storeDate.localeCompare(b.storeDate) || a.series.localeCompare(b.series),
  )

  // Never publish an empty feed. Failing here keeps the last good site online.
  if (items.length === 0) {
    throw new Error('No releases came back from Metron, so nothing was written.')
  }

  const output = {
    source: {
      name: 'Metron',
      url: 'https://metron.cloud',
      license: 'CC BY-SA 4.0',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    },
    updatedAt: today.toISOString(),
    range: { from, to },
    items,
  }

  await mkdir(new URL('../public/data/', import.meta.url), { recursive: true })
  await writeFile(OUTPUT, `${JSON.stringify(output, null, 2)}\n`)
  console.log(`Wrote ${items.length} releases to public/data/releases.json`)
}

main().catch((error) => {
  console.error(error.message)
  process.exit(1)
})
