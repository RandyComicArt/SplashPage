import { Link } from 'react-router-dom'
import CoverImage from './CoverImage.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { searchComics } from '../services'
import './CharacterCard.css'

/**
 * Featured character tile. The main link opens Discover filtered to that
 * character; if a Beginner Guide exists, a second link goes straight to it.
 */
export default function CharacterCard({ character }) {
  const { data } = useAsync(
    () => searchComics({ character: character.name, pageSize: 3 }),
    [character.name],
  )
  const covers = data?.items ?? []
  const total = data?.total

  return (
    <article className="character-card" style={{ '--accent': character.accent }}>
      <div className="character-card__covers" aria-hidden="true">
        {covers.map((comic) => (
          <div className="character-card__cover" key={comic.id}>
            <CoverImage src={comic.coverThumbUrl} title={comic.title} publisher={comic.publisher} alt="" />
          </div>
        ))}
      </div>
      <div className="character-card__body">
        <p className="character-card__publisher">{character.publisher}</p>
        <h3 className="character-card__name">
          <Link
            to={`/discover?character=${encodeURIComponent(character.name)}`}
            className="character-card__main-link"
          >
            {character.name}
          </Link>
        </h3>
        <p className="character-card__blurb">{character.blurb}</p>
        <p className="character-card__count">
          {total === undefined ? '\u00a0' : `${total} ${total === 1 ? 'comic' : 'comics'} in the catalog`}
        </p>
        {character.guideSlug && (
          <Link to={`/guides/${character.guideSlug}`} className="character-card__guide-link text-link">
            Beginner guide
          </Link>
        )}
      </div>
    </article>
  )
}
