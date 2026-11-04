import { Link, useParams } from 'react-router-dom'
import ComicCard from '../components/ComicCard.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { getSeries } from '../services'
import './SeriesPage.css'

const typeLabels = {
  ongoing: 'Ongoing series',
  limited: 'Limited series',
  'one-shot': 'One-shot',
  'graphic-novel': 'Graphic novel',
}

export default function SeriesPage() {
  const { seriesId } = useParams()
  const { data: series, isLoading, isError, reload } = useAsync(() => getSeries(seriesId), [seriesId])

  usePageTitle(series?.title ?? 'Series')

  if (isLoading && !series) {
    return (
      <div className="container section">
        <LoadingState label="Loading series" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="container section">
        <ErrorState onRetry={reload} />
      </div>
    )
  }

  if (!series) {
    return (
      <div className="container section">
        <EmptyState
          title="Series not found"
          message="We couldn't find that series in the catalog."
          actionLabel="Browse series"
          actionTo="/discover?view=series"
        />
      </div>
    )
  }

  const facts = [
    series.publisher,
    typeLabels[series.type],
    series.startYear && `Began ${series.startYear}`,
    series.issueCount && `${series.issueCount} issues`,
  ].filter(Boolean)

  // Characters that appear in this series' comics.
  const characters = [...new Set(series.comics.flatMap((comic) => comic.characters))]

  return (
    <article>
      <header className="series-hero on-dark halftone halftone--light">
        <div className="container">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/discover?view=series">Series</Link>
              </li>
              <li aria-current="page">{series.title}</li>
            </ol>
          </nav>
          <p className="eyebrow">Series</p>
          <h1 className="series-hero__title">{series.title}</h1>
          <ul className="series-hero__facts">
            {facts.map((fact) => (
              <li key={fact}>{fact}</li>
            ))}
          </ul>
          {series.description && <p className="lead series-hero__description">{series.description}</p>}
        </div>
      </header>

      <div className="container section">
        <h2 className="series-body__heading">
          In the catalog <span>{series.comics.length}</span>
        </h2>
        <div className="comic-grid">
          {series.comics.map((comic) => (
            <ComicCard key={comic.id} comic={comic} />
          ))}
        </div>

        {characters.length > 0 && (
          <section className="series-characters" aria-labelledby="series-characters-heading">
            <h2 id="series-characters-heading" className="series-body__heading">
              Characters
            </h2>
            <ul className="chip-list">
              {characters.map((name) => (
                <li key={name}>
                  <Link to={`/discover?character=${encodeURIComponent(name)}`} className="chip">
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </article>
  )
}
