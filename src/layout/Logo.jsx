import { Link } from 'react-router-dom'
import './Logo.css'

/** SplashPage wordmark with a small "splash panel" mark. */
export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="SplashPage home">
      <svg className="logo__mark" viewBox="0 0 64 64" aria-hidden="true" focusable="false">
        <path
          d="M32 3l6 14.4L52 9l-5.6 15.2 16.6 1.8-13.4 9.4L61 46.4 45 46.2l1.8 16L32 52 17.2 62.2l1.8-16L3 46.4l11.4-10L1 26l16.6-1.8L12 9l14 8.4z"
          fill="#d2432f"
        />
        <rect x="20" y="20" width="24" height="24" rx="2" fill="#fbf7ef" stroke="#0e0e12" strokeWidth="3.5" />
        <path d="M25 39l5-10 3.5 6.5 2.5-3.5 4 7z" fill="#3d4cf2" />
      </svg>
      <span className="logo__text">
        Splash<span>Page</span>
      </span>
    </Link>
  )
}
