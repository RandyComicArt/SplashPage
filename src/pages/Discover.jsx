import { useCallback, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ComicCard from '../components/ComicCard.jsx'
import SearchBar from '../components/SearchBar.jsx'
import DataSourceNote from '../components/DataSourceNote.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews.jsx'
import { CloseIcon, FilterIcon } from '../components/Icons.jsx'
import FilterPanel from './FilterPanel.jsx'
import { CharactersIndex, CreatorsIndex, SeriesIndex } from './DiscoverIndexes.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { getFacets, searchComics } from '../services'
import './Discover.css'

const PAGE_SIZE = 24

const views = [
  { id: 'comics', label: 'Comics' },
  { id: 'series', label: 'Series' },
  { id: 'creators', label: 'Creators' },
  { id: 'characters', label: 'Characters' },
]

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'az', label: 'Title A–Z' },
]

const filterKeys = ['character', 'creator', 'publisher', 'genre', 'decade']

export default function Discover() {
  usePageTitle('Discover')
  const [params, setParams] = useSearchParams()

  const view = views.some((v) => v.id === params.get('view')) ? params.get('view') : 'comics'
  const query = params.get('q') ?? ''
  const sort = sortOptions.some((o) => o.value === params.get('sort')) ? params.get('sort') : 'relevance'
  const filters = {
    character: params.get('character') ?? '',
    creator: params.get('creator') ?? '',
    publisher: params.get('publisher') ?? '',
    genre: params.get('genre') ?? '',
    decade: params.get('decade') ?? '',
    beginner: params.get('beginner') === '1',
  }

  // "Show more" count that resets whenever the URL (search/filters) changes.
  const paramsKey = params.toString()
  const [pageState, setPageState] = useState({ key: paramsKey, page: 1 })
  const page = pageState.key === paramsKey ? pageState.page : 1

  const [filtersOpen, setFiltersOpen] = useState(false)

  // Change one or more URL params. Empty values remove the param.
  const updateParams = useCallback(
    (changes, { replace = false } = {}) => {
      const next = new URLSearchParams(params)
      for (const [key, value] of Object.entries(changes)) {
        if (value) next.set(key, value)
        else next.delete(key)
      }
      setParams(next, { replace })
    },
    [params, setParams],
  )

  const handleSearch = useCallback((value) => updateParams({ q: value }, { replace: true }), [updateParams])

  const facetsState = useAsync(getFacets, [])
  const comicsState = useAsync(
    () =>
      view === 'comics'
        ? searchComics({
            query,
            ...filters,
            beginnerOnly: filters.beginner,
            sort,
            page,
            pageSize: PAGE_SIZE,
          })
        : Promise.resolve(null),
    [view, query, sort, page, filters.character, filters.creator, filters.publisher, filters.genre, filters.decade, filters.beginner],
  )

  const activeFilters = [
    ...filterKeys.filter((key) => filters[key]).map((key) => ({ key, label: filters[key] })),
    ...(filters.beginner ? [{ key: 'beginner', label: 'Beginner-friendly' }] : []),
  ]
  const hasFilters = activeFilters.length > 0

  const clearAll = () => setParams(view === 'comics' ? {} : { view })

  const results = comicsState.data
  const showingAll = results && results.items.length >= results.total

  return (
    <div className="discover">
      <header className="discover__header on-dark halftone halftone--light">
        <div className="container">
          <p className="eyebrow">Find your next story</p>
          <h1>Discover</h1>
          <div className="discover__search">
            <SearchBar
              size="large"
              live
              value={query}
              onSearch={handleSearch}
              placeholder={
                view === 'comics' ? 'Search by title, character, or creator' : `Search ${view}`
              }
              label={`Search ${view}`}
            />
          </div>
          <nav className="discover__tabs" aria-label="Browse by">
            <ul>
              {views.map((v) => (
                <li key={v.id}>
                  <Link
                    to={`/discover?view=${v.id}${query ? `&q=${encodeURIComponent(query)}` : ''}`}
                    className="discover__tab"
                    aria-current={view === v.id ? 'page' : undefined}
                  >
                    {v.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <div className="container discover__body">
        <DataSourceNote className="discover__note" />

        {view === 'series' && <SeriesIndex query={query} />}
        {view === 'creators' && <CreatorsIndex query={query} />}
        {view === 'characters' && <CharactersIndex query={query} />}

        {view === 'comics' && (
          <div className="discover__layout">
            <aside className="discover__sidebar">
              <button
                type="button"
                className="button button--ghost discover__filter-toggle"
                aria-expanded={filtersOpen}
                aria-controls="filter-panel"
                onClick={() => setFiltersOpen((open) => !open)}
              >
                <FilterIcon size={18} />
                Filters{activeFilters.length > 0 ? ` (${activeFilters.length})` : ''}
              </button>
              {facetsState.data && (
                <FilterPanel
                  id="filter-panel"
                  isOpen={filtersOpen}
                  facets={facetsState.data}
                  values={filters}
                  hasFilters={hasFilters}
                  onChange={(key, value) => updateParams({ [key]: value })}
                  onClear={clearAll}
                />
              )}
            </aside>

            <section className="discover__results" aria-label="Results">
              <div className="discover__toolbar">
                <p className="discover__count" role="status" aria-live="polite">
                  {results
                    ? `${results.total} ${results.total === 1 ? 'comic' : 'comics'}${query ? ` for “${query}”` : ''}`
                    : 'Loading comics…'}
                </p>
                <div className="discover__sort">
                  <label htmlFor="sort">Sort by</label>
                  <select id="sort" value={sort} onChange={(event) => updateParams({ sort: event.target.value === 'relevance' ? '' : event.target.value })}>
                    {sortOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {hasFilters && (
                <ul className="chip-list discover__active" aria-label="Active filters">
                  {activeFilters.map((filter) => (
                    <li key={filter.key}>
                      <button
                        type="button"
                        className="chip"
                        onClick={() => updateParams({ [filter.key]: '' })}
                        aria-label={`Remove filter: ${filter.label}`}
                      >
                        {filter.label}
                        <CloseIcon size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}

              {comicsState.isError && <ErrorState onRetry={comicsState.reload} />}
              {comicsState.isLoading && !results && <LoadingState label="Loading comics" cards={8} />}

              {results && results.total === 0 && (
                <EmptyState
                  title="No comics found"
                  message="Nothing in the catalog matches that search. Try fewer words or remove a filter."
                  actionLabel="Clear search and filters"
                  onAction={clearAll}
                />
              )}

              {results && results.total > 0 && (
                <>
                  <div className="comic-grid">
                    {results.items.map((comic) => (
                      <ComicCard key={comic.id} comic={comic} />
                    ))}
                  </div>
                  <div className="discover__more">
                    <p>
                      Showing {results.items.length} of {results.total}
                    </p>
                    {!showingAll && (
                      <button
                        type="button"
                        className="button"
                        onClick={() => setPageState({ key: paramsKey, page: page + 1 })}
                      >
                        Show more
                      </button>
                    )}
                  </div>
                </>
              )}
            </section>
          </div>
        )}
      </div>
    </div>
  )
}
