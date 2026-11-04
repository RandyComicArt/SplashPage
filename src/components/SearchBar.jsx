import { useEffect, useId, useRef, useState } from 'react'
import { CloseIcon, SearchIcon } from './Icons.jsx'
import './SearchBar.css'

/**
 * Search field. `onSearch(query)` runs when the form is submitted.
 * With `live`, it also runs shortly after the user stops typing.
 * `value` lets the parent (for example the URL) drive the field.
 */
export default function SearchBar({
  value = '',
  onSearch,
  live = false,
  size = 'medium',
  label = 'Search comics',
  placeholder = 'Search by title, character, or creator',
  autoFocus = false,
}) {
  const inputId = useId()
  const inputRef = useRef(null)
  const [text, setText] = useState(value)
  const [lastValue, setLastValue] = useState(value)

  // If the parent changes the value (e.g. "Clear all"), follow it.
  if (value !== lastValue) {
    setLastValue(value)
    setText(value)
  }

  useEffect(() => {
    if (!live || text === value) return undefined
    const timer = setTimeout(() => onSearch(text.trim()), 250)
    return () => clearTimeout(timer)
  }, [text, live, value, onSearch])

  function handleSubmit(event) {
    event.preventDefault()
    onSearch(text.trim())
  }

  function handleClear() {
    setText('')
    onSearch('')
    inputRef.current?.focus()
  }

  return (
    <form className={`search-bar search-bar--${size}`} role="search" onSubmit={handleSubmit}>
      <label className="visually-hidden" htmlFor={inputId}>
        {label}
      </label>
      <SearchIcon className="search-bar__icon" size={size === 'large' ? 24 : 20} />
      <input
        ref={inputRef}
        id={inputId}
        className="search-bar__input"
        type="search"
        value={text}
        onChange={(event) => setText(event.target.value)}
        placeholder={placeholder}
        autoComplete="off"
        autoFocus={autoFocus}
        enterKeyHint="search"
      />
      {text && (
        <button type="button" className="search-bar__clear" onClick={handleClear} aria-label="Clear search">
          <CloseIcon size={16} />
        </button>
      )}
      <button type="submit" className="search-bar__submit">
        Search
      </button>
    </form>
  )
}
