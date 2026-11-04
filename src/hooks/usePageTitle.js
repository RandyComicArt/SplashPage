import { useEffect } from 'react'

const SITE_NAME = 'SplashPage'

// Keeps the browser tab title in step with the current page.
export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · ${SITE_NAME}` : `${SITE_NAME} — Your starting point for comics`
  }, [title])
}
