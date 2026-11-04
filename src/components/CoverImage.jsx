import { useState } from 'react'
import './CoverImage.css'

/**
 * A comic cover at a fixed 2:3 ratio, so the page never jumps while images load.
 * If the image is missing or fails to load, a designed placeholder with the
 * title is shown instead.
 *
 * `alt` should describe the cover. Pass alt="" when the title is already
 * announced next to the image (for example inside a card link).
 */
export default function CoverImage({ src, title, publisher, alt, priority = false, className = '' }) {
  const [failedSrc, setFailedSrc] = useState(null)
  const showFallback = !src || failedSrc === src

  return (
    <div className={`cover ${className}`}>
      {showFallback ? (
        <div
          className="cover__fallback"
          role={alt === '' ? undefined : 'img'}
          aria-label={alt === '' ? undefined : `Cover unavailable for ${title}`}
        >
          <span className="cover__fallback-title">{title}</span>
          {publisher && <span className="cover__fallback-publisher">{publisher}</span>}
          <span className="cover__fallback-note">Cover unavailable</span>
        </div>
      ) : (
        <img
          className="cover__image"
          src={src}
          alt={alt ?? `Cover of ${title}`}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src)}
        />
      )}
    </div>
  )
}
