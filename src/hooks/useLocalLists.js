// Lightweight, browser-only lists: saved comics, saved guides, recently viewed.
//
// Everything is stored in this browser's localStorage. There are no accounts and
// nothing is sent anywhere. If storage is unavailable (private mode, blocked),
// the lists simply work for the current page session.

import { useCallback, useSyncExternalStore } from 'react'

function createListStore(key, { max = Infinity } = {}) {
  const listeners = new Set()

  function read() {
    try {
      const parsed = JSON.parse(localStorage.getItem(key) ?? '[]')
      return Array.isArray(parsed) ? parsed.filter((value) => typeof value === 'string') : []
    } catch {
      return []
    }
  }

  let snapshot = read()

  function emit() {
    listeners.forEach((listener) => listener())
  }

  function write(next) {
    snapshot = next.slice(0, max)
    try {
      localStorage.setItem(key, JSON.stringify(snapshot))
    } catch {
      // Storage unavailable: keep the in-memory copy.
    }
    emit()
  }

  // Keep multiple tabs in sync.
  window.addEventListener('storage', (event) => {
    if (event.key === key) {
      snapshot = read()
      emit()
    }
  })

  return {
    getSnapshot: () => snapshot,
    subscribe(listener) {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    write,
  }
}

const savedComicsStore = createListStore('splashpage.savedComics')
const savedGuidesStore = createListStore('splashpage.savedGuides')
const recentComicsStore = createListStore('splashpage.recentComics', { max: 12 })

function useSavedList(store) {
  const ids = useSyncExternalStore(store.subscribe, store.getSnapshot)

  const isSaved = useCallback((id) => ids.includes(id), [ids])
  const toggle = useCallback(
    (id) => store.write(ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids]),
    [ids, store],
  )

  return { ids, isSaved, toggle }
}

export const useSavedComics = () => useSavedList(savedComicsStore)
export const useSavedGuides = () => useSavedList(savedGuidesStore)

export function useRecentlyViewed() {
  const ids = useSyncExternalStore(recentComicsStore.subscribe, recentComicsStore.getSnapshot)
  const clear = useCallback(() => recentComicsStore.write([]), [])
  return { ids, clear }
}

// Not a hook: call from an effect when a comic page is opened.
export function recordRecentlyViewed(id) {
  const current = recentComicsStore.getSnapshot()
  if (current[0] === id) return
  recentComicsStore.write([id, ...current.filter((x) => x !== id)])
}
