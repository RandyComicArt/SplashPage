import CoverImage from './CoverImage.jsx'
import { formatDay } from '../services/releases.js'
import './ReleaseCard.css'

/**
 * A single new release: cover, series, issue number and on-sale date.
 *
 * It is not a link on purpose. Release data has no detail page on SplashPage,
 * and a card that goes nowhere would be a dead end.
 */
export default function ReleaseCard({ release }) {
  const meta = [release.number ? `#${release.number}` : null, release.publisher].filter(Boolean).join(' · ')

  return (
    <article className="release-card">
      <div className="release-card__cover">
        {/* alt="" because the series and issue are written out as text below */}
        <CoverImage src={release.image} title={release.title} publisher={release.publisher} alt="" />
      </div>
      <h3 className="release-card__title">{release.series}</h3>
      <p className="release-card__meta">{meta}</p>
      <p className="release-card__date">
        <time dateTime={release.storeDate}>{formatDay(release.storeDate)}</time>
      </p>
    </article>
  )
}
