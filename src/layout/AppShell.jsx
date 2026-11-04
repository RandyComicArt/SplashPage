import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header.jsx'
import Footer from './Footer.jsx'

/** Page chrome shared by every route: skip link, header, content, footer. */
export default function AppShell() {
  const { pathname } = useLocation()

  // Start each page at the top, like a normal multi-page site.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Header />
      <main id="main" className="page" tabIndex={-1}>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}
