import { Link } from 'react-router-dom'
import './StateViews.css'

/**
 * Loading, error and empty states share this file because they share a look.
 * Loading uses skeleton tiles shaped like comic cards, so layout doesn't jump.
 */

export function LoadingState({ label = 'Loading', cards = 0 }) {
  return (
    <div className="state-view" role="status" aria-live="polite">
      <span className="visually-hidden">{label}…</span>
      {cards > 0 ? (
        <div className="comic-grid" aria-hidden="true">
          {Array.from({ length: cards }, (_, index) => (
            <div className="skeleton-card" key={index}>
              <div className="skeleton skeleton-card__cover" />
              <div className="skeleton skeleton-card__line" />
              <div className="skeleton skeleton-card__line skeleton-card__line--short" />
            </div>
          ))}
        </div>
      ) : (
        <div className="state-view__spinner" aria-hidden="true" />
      )}
    </div>
  )
}

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div className="state-view state-view--message" role="alert">
      <p className="state-view__title">{title}</p>
      <p className="state-view__text">
        {message ?? 'The comics could not be loaded. Check your connection and try again.'}
      </p>
      {onRetry && (
        <button type="button" className="button button--small" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export function EmptyState({ title, message, actionLabel, onAction, actionTo }) {
  return (
    <div className="state-view state-view--message">
      <p className="state-view__title">{title}</p>
      {message && <p className="state-view__text">{message}</p>}
      {onAction && (
        <button type="button" className="button button--small" onClick={onAction}>
          {actionLabel}
        </button>
      )}
      {actionTo && (
        <Link to={actionTo} className="button button--small">
          {actionLabel}
        </Link>
      )}
    </div>
  )
}
