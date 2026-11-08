// Shared helpers for the scripts that talk to the Metron API (https://metron.cloud).
//
// The token is read from the METRON_TOKEN environment variable only. It is never
// written to a file and never reaches the browser.
//
// Metron's limits are 20 requests per minute and 5,000 per day. Every request
// goes through `getJson`, which spaces requests out and honors Retry-After.

const MIN_MS_BETWEEN_REQUESTS = 3200 // stays under 20 requests a minute
const MAX_RETRIES = 3

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
    const wait = lastRequestAt + MIN_MS_BETWEEN_REQUESTS - Date.now()
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
