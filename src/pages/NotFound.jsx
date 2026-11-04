import { Link } from 'react-router-dom'
import { usePageTitle } from '../hooks/usePageTitle.js'

export default function NotFound() {
  usePageTitle('Page not found')

  return (
    <div className="container section" style={{ textAlign: 'center' }}>
      <p className="eyebrow">Error 404</p>
      <h1>Page not found</h1>
      <p className="lead" style={{ margin: '1rem auto 2rem' }}>
        That page doesn&rsquo;t exist. Let&rsquo;s get you back to the comics.
      </p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <Link to="/" className="button">
          Go home
        </Link>
        <Link to="/discover" className="button button--ghost">
          Discover comics
        </Link>
      </div>
    </div>
  )
}
