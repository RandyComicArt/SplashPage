import { HeartIcon } from './Icons.jsx'
import './SaveButton.css'

/**
 * Toggle for the local "saved" lists. Stored only in this browser.
 *   variant="icon"   compact heart for cards
 *   variant="button" full labeled button for detail pages
 */
export default function SaveButton({ isSaved, onToggle, label, variant = 'icon' }) {
  if (variant === 'button') {
    return (
      <button
        type="button"
        className={`button button--ghost save-button-labeled${isSaved ? ' is-saved' : ''}`}
        aria-pressed={isSaved}
        onClick={onToggle}
      >
        <HeartIcon filled={isSaved} size={18} />
        {isSaved ? 'Saved' : 'Save'}
        <span className="visually-hidden"> {label}</span>
      </button>
    )
  }

  return (
    <button
      type="button"
      className={`save-button${isSaved ? ' is-saved' : ''}`}
      aria-pressed={isSaved}
      aria-label={`${isSaved ? 'Remove from saved' : 'Save'}: ${label}`}
      onClick={onToggle}
    >
      <HeartIcon filled={isSaved} size={18} />
    </button>
  )
}
