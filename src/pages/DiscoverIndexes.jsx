import { Link } from 'react-router-dom'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { getCharacters, getCreators, getSeriesList } from '../services'
import './DiscoverIndexes.css'

const seriesTypeLabels = {
  ongoing: 'Ongoing series',
  limited: 'Limited series',
  'one-shot': 'One-shot',
  'graphic-novel': 'Graphic novel',
}

function IndexGrid({ state, emptyTitle, emptyMessage, children }) {
  if (state.isLoading && !state.data) return <LoadingState label="Loading" />
  if (state.isError) return <ErrorState onRetry={state.reload} />
  if (!state.data?.length) return <EmptyState title={emptyTitle} message={emptyMessage} />
  return <ul className="index-grid">{children}</ul>
}

function IndexTile({ to, name, meta, count, countLabel }) {
  return (
    <li>
      <Link to={to} className="index-tile">
        <span className="index-tile__name">{name}</span>
        {meta && <span className="index-tile__meta">{meta}</span>}
        <span className="index-tile__count">
          {count} {count === 1 ? countLabel : `${countLabel}s`}
        </span>
      </Link>
    </li>
  )
}

export function SeriesIndex({ query }) {
  const state = useAsync(() => getSeriesList({ query }), [query])
  return (
    <IndexGrid state={state} emptyTitle="No series found" emptyMessage="Try a different search.">
      {state.data?.map((series) => (
        <IndexTile
          key={series.id}
          to={`/series/${series.id}`}
          name={series.title}
          meta={[series.publisher, seriesTypeLabels[series.type], series.startYear].filter(Boolean).join(' · ')}
          count={series.comicCount}
          countLabel="comic"
        />
      ))}
    </IndexGrid>
  )
}

export function CreatorsIndex({ query }) {
  const state = useAsync(() => getCreators({ query }), [query])
  return (
    <IndexGrid state={state} emptyTitle="No creators found" emptyMessage="Try a different search.">
      {state.data?.map((creator) => (
        <IndexTile
          key={creator.name}
          to={`/discover?creator=${encodeURIComponent(creator.name)}`}
          name={creator.name}
          meta={creator.roles.join(' · ')}
          count={creator.count}
          countLabel="comic"
        />
      ))}
    </IndexGrid>
  )
}

export function CharactersIndex({ query }) {
  const state = useAsync(() => getCharacters({ query }), [query])
  return (
    <IndexGrid state={state} emptyTitle="No characters found" emptyMessage="Try a different search.">
      {state.data?.map((character) => (
        <IndexTile
          key={character.name}
          to={`/discover?character=${encodeURIComponent(character.name)}`}
          name={character.name}
          count={character.count}
          countLabel="comic"
        />
      ))}
    </IndexGrid>
  )
}
