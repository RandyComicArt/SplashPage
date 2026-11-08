import { Link } from 'react-router-dom'
import './Logo.css'

/** SplashPage wordmark. */
export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="SplashPage home">
      <span className="logo__text">
        Splash<span>Page</span>
      </span>
    </Link>
  )
}
