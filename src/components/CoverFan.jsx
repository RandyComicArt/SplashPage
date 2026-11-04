import CoverImage from './CoverImage.jsx'
import './CoverFan.css'

/**
 * A fanned stack of covers, used as banner artwork for guides and the hero.
 * Purely decorative: the surrounding text carries the meaning, so alt is empty.
 */
export default function CoverFan({ comics, className = '', priority = false }) {
  const items = comics.filter(Boolean).slice(0, 4)

  return (
    <div className={`cover-fan ${className}`} style={{ '--count': items.length }} aria-hidden="true">
      {items.map((comic, index) => (
        <div className="cover-fan__item" key={comic.id} style={{ '--index': index }}>
          <CoverImage
            src={comic.coverThumbUrl}
            title={comic.title}
            publisher={comic.publisher}
            alt=""
            priority={priority}
          />
        </div>
      ))}
    </div>
  )
}
