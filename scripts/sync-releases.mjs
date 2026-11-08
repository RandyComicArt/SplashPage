// Fetches upcoming and recent comic releases from Metron and writes
// public/data/releases.json, which the site loads at runtime.
//
//   METRON_TOKEN=... npm run sync:releases
//
// The token is read from the environment only. It is never written to a file
// and never reaches the browser: the site only ever sees the JSON output.
//
// Metron data is licensed CC BY-SA 4.0 (https://metron.cloud). The site credits
// it wherever the data is shown. Metron's API allows 20 requests per minute and
// 5,000 per day, so this script spaces its requests out and honors Retry-After.

import { mkdir, writeFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const API = 'https://metron.cloud/api/issue/'
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
const MIN_MS_BETWEEN_REQUESTS = 3200 // stays under 20 requests a minute
const MAX_RETRIES = 3

const token = process.env.METRON_TOKEN
if (!token) {
  console.error('METRON_TOKEN is not set. Create a token on your Metron account page and export it first.')
  process.exit(1)
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let lastRequestAt = 0

async function getJson(url) {
  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const wait = lastRequestAt + MIN_MS_BETWEEN_REQUESTS - Date.now()
    if (wait > 0) await sleep(wait)
    lastRequestAt = Date.now()

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'User-Agent': 'SplashPage release sync (https://github.com/RandyComicArt/SplashPage)',
      },
    })

    if (response.status === 429) {
      const seconds = Number(response.headers.get('Retry-After')) || 60
      console.warn(`Rate limited by Metron. Waiting ${seconds}s (attempt ${attempt}/${MAX_RETRIES}).`)
      await sleep(seconds * 1000)
      continue
    }

    if (!response.ok) {
      // Report the status only. The response body is not needed and could echo request details.
      throw new Error(`Metron answered ${response.status} ${response.statusText} for ${new URL(url).pathname}`)
    }

    return response.json()
  }
  throw new Error('Metron kept rate limiting this request. Try again later.')
}

const isoDay = (date) => date.toISOString().slice(0, 10)

function addDays(date, days) {
  const copy = new Date(date)
  copy.setUTCDate(copy.getUTCDate() + days)
  return copy
}

async function fetchPublisher(publisher, from, to) {
  const params = new URLSearchParams({
    store_date_range_after: from,
    store_date_range_before: to,
    publisher_name: publisher.query,
  })

  const issues = []
  let url = `${API}?${params}`
  for (let page = 1; url && page <= MAX_PAGES_PER_PUBLISHER; page++) {
    const body = await getJson(url)
    if (!Array.isArray(body.results)) {
      throw new Error('Unexpected response from Metron: no "results" list.')
    }
    issues.push(...body.results)
    url = body.next
  }
  if (url) console.warn(`${publisher.label}: stopped after ${MAX_PAGES_PER_PUBLISHER} pages; more results exist.`)
  return issues
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
    const issues = await fetchPublisher(publisher, from, to)
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
