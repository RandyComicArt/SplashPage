import { Link } from 'react-router-dom'
import CoverImage from './CoverImage.jsx'
import SaveButton from './SaveButton.jsx'
import { useSavedComics } from '../hooks/useLocalLists.js'
import './ComicCard.css'

/**
 * Reusable comic tile: cover, title and a line of metadata.
 * Only fields that exist are shown. The whole tile is one link; the save button
 * sits beside it (a button can't live inside a link).
 */
export default function ComicCard({ comic, showBadges = true }) {
  const { isSaved, toggle } = useSavedComics()
  const meta = [comic.year, comic.publisher].filter(Boolean).join(' · ')

  return (
    <article className="comic-card">
      <Link to={`/comics/${comic.id}`} className="comic-card__link">
        <div className="comic-card__cover">
          {/* alt="" because the title is announced by the link text below */}
          <CoverImage src={comic.coverThumbUrl} title={comic.title} publisher={comic.publisher} alt="" />
          {showBadges && (comic.beginnerFriendly || comic.mature) && (
            <div className="comic-card__badges">
              {comic.beginnerFriendly && <span className="tag tag--yellow">Beginner-friendly</span>}
              {comic.mature && <span className="tag tag--red">Mature</span>}
            </div>
          )}
        </div>
        <h3 className="comic-card__title">{comic.title}</h3>
        {meta && <p className="comic-card__meta">{meta}</p>}
      </Link>
      <div className="comic-card__save">
        <SaveButton isSaved={isSaved(comic.id)} onToggle={() => toggle(comic.id)} label={comic.title} />
      </div>
    </article>
  )
}
