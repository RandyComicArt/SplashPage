import { useId } from 'react'
import './FilterPanel.css'

function FilterSelect({ label, value, options, onChange, anyLabel }) {
  const id = useId()
  return (
    <div className="filter-field">
      <label htmlFor={id}>{label}</label>
      <select id={id} value={value} onChange={(event) => onChange(event.target.value)}>
        <option value="">{anyLabel}</option>
        {options.map((option) => (
          <option key={option.name} value={option.name}>
            {option.name} ({option.count})
          </option>
        ))}
      </select>
    </div>
  )
}

/** Filters for the Discover comics view. Presentational: the page owns the state. */
export default function FilterPanel({ id, facets, values, onChange, onClear, hasFilters, isOpen }) {
  const beginnerId = useId()

  return (
    <form
      id={id}
      className={`filter-panel panel${isOpen ? ' is-open' : ''}`}
      aria-label="Filter comics"
      onSubmit={(event) => event.preventDefault()}
    >
      <div className="filter-panel__header">
        <h2 className="filter-panel__title">Filters</h2>
        {hasFilters && (
          <button type="button" className="filter-panel__clear" onClick={onClear}>
            Clear all
          </button>
        )}
      </div>

      <div className="filter-field filter-field--check">
        <input
          id={beginnerId}
          type="checkbox"
          checked={values.beginner}
          onChange={(event) => onChange('beginner', event.target.checked ? '1' : '')}
        />
        <label htmlFor={beginnerId}>Beginner-friendly only</label>
      </div>

      <FilterSelect
        label="Character"
        anyLabel="Any character"
        value={values.character}
        options={facets.characters}
        onChange={(value) => onChange('character', value)}
      />
      <FilterSelect
        label="Creator"
        anyLabel="Any creator"
        value={values.creator}
        options={facets.creators}
        onChange={(value) => onChange('creator', value)}
      />
      <FilterSelect
        label="Publisher"
        anyLabel="Any publisher"
        value={values.publisher}
        options={facets.publishers}
        onChange={(value) => onChange('publisher', value)}
      />
      <FilterSelect
        label="Genre"
        anyLabel="Any genre"
        value={values.genre}
        options={facets.genres}
        onChange={(value) => onChange('genre', value)}
      />
      <FilterSelect
        label="Published"
        anyLabel="Any decade"
        value={values.decade}
        options={facets.decades}
        onChange={(value) => onChange('decade', value)}
      />
    </form>
  )
}
