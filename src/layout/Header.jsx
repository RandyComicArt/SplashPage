import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import SearchBar from '../components/SearchBar.jsx'
import { CloseIcon, HeartIcon, MenuIcon } from '../components/Icons.jsx'
import { useSavedComics, useSavedGuides } from '../hooks/useLocalLists.js'
import './Header.css'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/discover', label: 'Discover' },
  { to: '/guides', label: 'Beginner Guides' },
]

export default function Header() {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const savedComics = useSavedComics()
  const savedGuides = useSavedGuides()
  const savedCount = savedComics.ids.length + savedGuides.ids.length

  // The menu is "open" only for the page it was opened on, so it closes by
  // itself after navigating (no effect needed).
  const [openOnPath, setOpenOnPath] = useState(null)
  const menuOpen = openOnPath === pathname
  const setMenuOpen = (open) => setOpenOnPath(open ? pathname : null)

  useEffect(() => {
    if (!menuOpen) return undefined
    const onKeyDown = (event) => event.key === 'Escape' && setOpenOnPath(null)
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  function handleSearch(query) {
    navigate(query ? `/discover?q=${encodeURIComponent(query)}` : '/discover')
  }

  return (
    <header className="site-header on-dark">
      <div className="container site-header__inner">
        <Logo />

        <nav className="site-header__nav" aria-label="Main">
          <ul>
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className="site-header__link">
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="site-header__search">
          <SearchBar size="small" onSearch={handleSearch} placeholder="Search comics" label="Search comics" />
        </div>

        <NavLink to="/saved" className="site-header__saved" aria-label={`Saved items (${savedCount})`}>
          <HeartIcon size={20} filled={savedCount > 0} />
          {savedCount > 0 && <span className="site-header__badge">{savedCount}</span>}
        </NavLink>

        <button
          type="button"
          className="site-header__menu-button"
          aria-expanded={menuOpen}
          aria-controls="mobile-menu"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
          <span className="visually-hidden">{menuOpen ? 'Close menu' : 'Open menu'}</span>
        </button>
      </div>

      <div id="mobile-menu" className="site-header__mobile" hidden={!menuOpen}>
        <div className="container">
          <SearchBar size="medium" onSearch={handleSearch} placeholder="Search comics" label="Search comics" />
          <ul className="site-header__mobile-links">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.end} className="site-header__mobile-link">
                  {item.label}
                </NavLink>
              </li>
            ))}
            <li>
              <NavLink to="/saved" className="site-header__mobile-link">
                Saved{savedCount > 0 ? ` (${savedCount})` : ''}
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </header>
  )
}
