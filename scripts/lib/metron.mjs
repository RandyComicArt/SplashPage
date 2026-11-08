// Shared helpers for the scripts that talk to the Metron API (https://metron.cloud).
//
// The token is read from the METRON_TOKEN environment variable only. It is never
// written to a file and never reaches the browser.
//
// Metron's limits are 20 requests per minute and 5,000 per day. Every request
// goes through `getJson`, which spaces requests out and honors Retry-After.

const STARTING_GAP_MS = 3200 // stays under 20 requests a minute
const MAX_GAP_MS = 20000
const MAX_RETRIES = 6

// Spacing between requests. It doubles every time Metron says "slow down",
// so a run that gets rate limited calms itself down instead of hammering the API.
let gapMs = STARTING_GAP_MS

export const API = 'https://metron.cloud/api'

export function requireToken() {
  const token = process.env.METRON_TOKEN
  if (!token) {
    console.error('METRON_TOKEN is not set. Create a token on your Metron account page and export it first.')
    process.exit(1)
  }
  return token
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let lastRequestAt = 0
let requestCount = 0

export const getRequestCount = () => requestCount

export async function getJson(url) {
  const token = requireToken()

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    const wait = lastRequestAt + gapMs - Date.now()
    if (wait > 0) await sleep(wait)
    lastRequestAt = Date.now()
    requestCount++

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
        'User-Agent': 'SplashPage sync (https://github.com/RandyComicArt/SplashPage)',
      },
    })

    if (response.status === 429) {
      // Metron's own Retry-After can be very short, so also back off a little more each attempt.
      const asked = Number(response.headers.get('Retry-After')) || 0
      const seconds = Math.max(asked, 15 * attempt)
      gapMs = Math.min(gapMs * 2, MAX_GAP_MS)

      // Say why, so a failed run is easy to diagnose. Rate limit headers and the short
      // throttle message are safe to print; the request's Authorization header is not included.
      const limits = [...response.headers]
        .filter(([name]) => name.toLowerCase().startsWith('x-ratelimit') || name.toLowerCase() === 'retry-after')
        .map(([name, value]) => `${name}=${value}`)
        .join(' ')
      const detail = (await response.text().catch(() => '')).slice(0, 200).replace(/\s+/g, ' ')
      console.warn(
        `Rate limited by Metron (attempt ${attempt}/${MAX_RETRIES}). ${limits} ${detail}\n` +
          `  Waiting ${seconds}s, then spacing requests ${(gapMs / 1000).toFixed(1)}s apart.`,
      )
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

/**
 * Fetches every page of a list endpoint (up to `maxPages`) and returns
 * `{ items, count, truncated }`. `count` is Metron's total number of matches.
 */
export async function getAllPages(path, params = {}, { maxPages = 10 } = {}) {
  let url = `${API}/${path}/?${new URLSearchParams(params)}`
  const items = []
  let count = 0

  for (let page = 1; url && page <= maxPages; page++) {
    const body = await getJson(url)
    if (!Array.isArray(body.results)) {
      throw new Error(`Unexpected response from Metron for ${path}: no "results" list.`)
    }
    items.push(...body.results)
    count = body.count ?? items.length
    url = body.next
  }

  return { items, count, truncated: Boolean(url) }
}
