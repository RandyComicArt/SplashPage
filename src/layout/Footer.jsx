import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import { providerInfo } from '../services'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="site-footer on-dark">
      <div className="container site-footer__inner">
        <div className="site-footer__brand">
          <Logo />
          <p>A modern comic discovery hub built to make finding, exploring, and getting into comics easier.</p>
        </div>

        <nav aria-label="Footer">
          <ul className="site-footer__links">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/discover">Discover</Link>
            </li>
            <li>
              <Link to="/guides">Beginner Guides</Link>
            </li>
            <li>
              <Link to="/saved">Saved</Link>
            </li>
          </ul>
        </nav>

        <div className="site-footer__notes">
          <p>
            {providerInfo.isLive ? 'Comic data from a live source.' : `${providerInfo.name}: not live data.`}{' '}
            {providerInfo.coverAttribution}
          </p>
          <p>
            Saved comics and guides stay in this browser only. Comic titles, characters and artwork are
            trademarks and copyrights of their respective owners.
          </p>
        </div>
      </div>
    </footer>
  )
}
