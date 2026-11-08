import { useCallback, useEffect, useRef, useState } from 'react'
import ComicCard from './ComicCard.jsx'
import { ChevronLeftIcon, ChevronRightIcon } from './Icons.jsx'
import './ComicCarousel.css'

/**
 * A horizontally scrolling row of comic cards.
 * Native scrolling (touch, trackpad, keyboard) works everywhere; the arrow
 * buttons are a convenience for mouse users and are disabled at either end.
 *
 * Shows ComicCards by default. Pass `renderCard` to show another kind of card
 * (for example release cards); items only need an `id`.
 */
export default function ComicCarousel({ comics, label, showBadges = true, renderCard }) {
  const trackRef = useRef(null)
  const [edges, setEdges] = useState({ atStart: true, atEnd: false })

  const updateEdges = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    setEdges({
      atStart: track.scrollLeft <= 4,
      atEnd: track.scrollLeft + track.clientWidth >= track.scrollWidth - 4,
    })
  }, [])

  useEffect(() => {
    updateEdges()
    window.addEventListener('resize', updateEdges)
    return () => window.removeEventListener('resize', updateEdges)
  }, [comics, updateEdges])

  function scrollByPage(direction) {
    const track = trackRef.current
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    track.scrollBy({
      left: direction * track.clientWidth * 0.85,
      behavior: reduceMotion ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="carousel" role="region" aria-label={label}>
      <button
        type="button"
        className="carousel__button carousel__button--prev"
        onClick={() => scrollByPage(-1)}
        disabled={edges.atStart}
        aria-label={`Scroll ${label} back`}
      >
        <ChevronLeftIcon />
      </button>
      <ul className="carousel__track" ref={trackRef} onScroll={updateEdges}>
        {comics.map((comic) => (
          <li className="carousel__item" key={comic.id}>
            {renderCard ? renderCard(comic) : <ComicCard comic={comic} showBadges={showBadges} />}
          </li>
        ))}
      </ul>
      <button
        type="button"
        className="carousel__button carousel__button--next"
        onClick={() => scrollByPage(1)}
        disabled={edges.atEnd}
        aria-label={`Scroll ${label} forward`}
      >
        <ChevronRightIcon />
      </button>
    </div>
  )
}
