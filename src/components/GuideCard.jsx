import { Link } from 'react-router-dom'
import CoverFan from './CoverFan.jsx'
import { ArrowRightIcon } from './Icons.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { getComicsByIds } from '../services'
import { guideLevels } from '../data/guides/index.js'
import './GuideCard.css'

/** Card linking to a Beginner Guide. `featured` gives it a wider, horizontal layout. */
export default function GuideCard({ guide, featured = false }) {
  const { data: covers } = useAsync(() => getComicsByIds(guide.heroComicIds), [guide.slug])

  return (
    <article
      className={`guide-card${featured ? ' guide-card--featured' : ''}`}
      style={{ '--accent': guide.accent }}
    >
      <Link to={`/guides/${guide.slug}`} className="guide-card__link">
        <div className="guide-card__art halftone halftone--light">
          {/* Reserve the space while covers load so the card doesn't resize. */}
          {covers && <CoverFan comics={covers} />}
        </div>
        <div className="guide-card__body">
          <p className="eyebrow">{guide.character} guide</p>
          <h3 className="guide-card__title">{guide.title}</h3>
          <p className="guide-card__tagline">{guide.tagline}</p>
          <ul className="guide-card__meta">
            <li>{guideLevels[guide.level]?.label}</li>
            <li>{guide.steps.length} books</li>
            <li>{guide.paths.length} paths</li>
          </ul>
          <span className="guide-card__cta">
            Read the guide <ArrowRightIcon size={16} />
          </span>
        </div>
      </Link>
    </article>
  )
}
