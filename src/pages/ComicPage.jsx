import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import CoverImage from '../components/CoverImage.jsx'
import SaveButton from '../components/SaveButton.jsx'
import ComicCarousel from '../components/ComicCarousel.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { recordRecentlyViewed, useSavedComics } from '../hooks/useLocalLists.js'
import { getComic, getRelatedComics, providerInfo } from '../services'
import { getGuidesForComic } from '../data/guides/index.js'
import './ComicPage.css'

const discoverLink = (key, value) => `/discover?${key}=${encodeURIComponent(value)}`

// A list of creator names where each name opens Discover filtered to that creator.
function CreatorLinks({ names }) {
  return names.map((name, index) => (
    <span key={name}>
      {index > 0 && ', '}
      <Link to={discoverLink('creator', name)}>{name}</Link>
    </span>
  ))
}

async function loadComicPage(comicId) {
  const comic = await getComic(comicId)
  if (!comic) return { comic: null, related: [] }
  return { comic, related: await getRelatedComics(comic) }
}

export default function ComicPage() {
  const { comicId } = useParams()
  const { data, isLoading, isError, reload } = useAsync(() => loadComicPage(comicId), [comicId])
  const { isSaved, toggle } = useSavedComics()
  const comic = data?.comic

  usePageTitle(comic?.title ?? 'Comic')

  useEffect(() => {
    if (comic) recordRecentlyViewed(comic.id)
  }, [comic])

  if (isLoading && !data) {
    return (
      <div className="container section">
        <LoadingState label="Loading comic" />
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

  if (!comic) {
    return (
      <div className="container section">
        <EmptyState
          title="Comic not found"
          message="We couldn't find that comic in the catalog. It may have been removed or the link may be wrong."
          actionLabel="Browse all comics"
          actionTo="/discover"
        />
      </div>
    )
  }

  const guideMentions = getGuidesForComic(comic.id).map((guide) => ({
    guide,
    step: guide.steps.find((step) => step.comicId === comic.id),
  }))

  const details = [
    { label: 'Publisher', value: comic.publisher },
    { label: 'First published', value: comic.year },
    { label: 'Series', value: comic.series && <Link to={`/series/${comic.series.id}`}>{comic.series.title}</Link> },
    { label: 'Collects', value: comic.collects },
  ].filter((row) => row.value)

  return (
    <article>
      <header className="comic-hero on-dark halftone halftone--light">
        {comic.coverUrl && (
          <div
            className="comic-hero__backdrop"
            style={{ backgroundImage: `url(${comic.coverUrl})` }}
            aria-hidden="true"
          />
        )}
        <div className="container comic-hero__inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <ol>
              <li>
                <Link to="/discover">Discover</Link>
              </li>
              {comic.series && (
                <li>
                  <Link to={`/series/${comic.series.id}`}>{comic.series.title}</Link>
                </li>
              )}
              <li aria-current="page">{comic.title}</li>
            </ol>
          </nav>

          <div className="comic-hero__cover">
            <CoverImage
              src={comic.coverUrl}
              title={comic.title}
              publisher={comic.publisher}
              priority
            />
          </div>

          <div className="comic-hero__info">
            <p className="eyebrow">{[comic.publisher, comic.year].filter(Boolean).join(' · ')}</p>
            <h1 className="comic-hero__title">{comic.title}</h1>

            {(comic.beginnerFriendly || comic.mature) && (
              <p className="comic-hero__tags">
                {comic.beginnerFriendly && <span className="tag tag--yellow">Beginner-friendly</span>}
                {comic.mature && <span className="tag tag--red">Mature readers</span>}
              </p>
            )}

            {(comic.writers.length > 0 || comic.artists.length > 0) && (
              <dl className="credits">
                {comic.writers.length > 0 && (
                  <div>
                    <dt>Written by</dt>
                    <dd>
                      <CreatorLinks names={comic.writers} />
                    </dd>
                  </div>
                )}
                {comic.artists.length > 0 && (
                  <div>
                    <dt>Art by</dt>
                    <dd>
                      <CreatorLinks names={comic.artists} />
                    </dd>
                  </div>
                )}
              </dl>
            )}

            <div className="comic-hero__actions">
              <SaveButton
                variant="button"
                isSaved={isSaved(comic.id)}
                onToggle={() => toggle(comic.id)}
                label={comic.title}
              />
            </div>
          </div>
        </div>
      </header>

      <div className="container comic-body">
        <div className="comic-body__main">
          <section aria-labelledby="about-heading">
            <h2 id="about-heading" className="comic-body__heading">
              About
            </h2>
            {comic.description ? (
              <p className="comic-body__description">{comic.description}</p>
            ) : (
              <p className="comic-body__description comic-body__description--missing">
                No description is available for this comic yet.
              </p>
            )}
          </section>

          {guideMentions.length > 0 && (
            <section aria-labelledby="guides-heading">
              <h2 id="guides-heading" className="comic-body__heading">
                In a beginner guide
              </h2>
              <ul className="guide-mentions">
                {guideMentions.map(({ guide, step }) => (
                  <li key={guide.slug} className="guide-mention panel">
                    <Link to={`/guides/${guide.slug}`} className="guide-mention__title">
                      {guide.title}
                    </Link>
                    <p>{step.why}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="comic-body__aside" aria-label="Details">
          {details.length > 0 && (
            <section aria-labelledby="details-heading">
              <h2 id="details-heading" className="comic-body__heading">
                Details
              </h2>
              <dl className="detail-list">
                {details.map((row) => (
                  <div key={row.label}>
                    <dt>{row.label}</dt>
                    <dd>{row.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          {comic.characters.length > 0 && (
            <section aria-labelledby="characters-heading">
              <h2 id="characters-heading" className="comic-body__heading">
                Characters
              </h2>
              <ul className="chip-list">
                {comic.characters.map((name) => (
                  <li key={name}>
                    <Link to={discoverLink('character', name)} className="chip">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}

          {comic.genres.length > 0 && (
            <section aria-labelledby="genres-heading">
              <h2 id="genres-heading" className="comic-body__heading">
                Genres
              </h2>
              <ul className="chip-list">
                {comic.genres.map((name) => (
                  <li key={name}>
                    <Link to={discoverLink('genre', name)} className="chip chip--static">
                      {name}
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </aside>
      </div>

      {data.related.length > 0 && (
        <section className="section section--paper-2" aria-labelledby="related-heading">
          <div className="container">
            <SectionHeader
              id="related-heading"
              eyebrow="Keep reading"
              title="More like this"
              description="Shares a series, character or creator with this comic."
            />
            <ComicCarousel comics={data.related} label="Related comics" />
          </div>
        </section>
      )}

      <p className="container comic-credit">{providerInfo.coverAttribution}</p>
    </article>
  )
}
