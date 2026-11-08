import { useSearchParams } from 'react-router-dom'
import ReleaseCard from '../components/ReleaseCard.jsx'
import ReleaseSourceNote from '../components/ReleaseSourceNote.jsx'
import { EmptyState, LoadingState } from '../components/StateViews.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { getPublishers, getReleases, groupByWeek } from '../services/releases.js'
import './Releases.css'

export default function Releases() {
  usePageTitle('New Releases')
  const [params, setParams] = useSearchParams()
  const { data: releases, isLoading } = useAsync(getReleases, [])

  const publisher = params.get('publisher') ?? ''

  function choosePublisher(name) {
    const next = new URLSearchParams(params)
    if (name && name !== publisher) next.set('publisher', name)
    else next.delete('publisher')
    setParams(next, { replace: true })
  }

  const publishers = releases ? getPublishers(releases.items) : []
  const visibleItems = releases ? releases.items.filter((item) => !publisher || item.publisher === publisher) : []
  const weeks = groupByWeek(visibleItems)

  return (
    <>
      <header className="releases-hero on-dark halftone halftone--light">
        <div className="container">
          <p className="eyebrow">What&rsquo;s on sale</p>
          <h1>New Releases</h1>
          <p className="lead">
            Comics arriving in shops this week and in the weeks around it. New comics go on sale on Wednesdays.
          </p>
        </div>
      </header>

      <div className="container section releases">
        {isLoading && <LoadingState label="Loading releases" cards={12} />}

        {!isLoading && !releases && (
          <EmptyState
            title="Release data isn't available right now"
            message="The weekly release list could not be loaded. Try again later, or browse the catalog in the meantime."
            actionLabel="Discover comics"
            actionTo="/discover"
          />
        )}

        {releases && (
          <>
            <ReleaseSourceNote releases={releases} />

            <div className="releases__filters" role="group" aria-label="Filter by publisher">
              <button
                type="button"
                className="chip"
                aria-pressed={publisher === ''}
                onClick={() => choosePublisher('')}
              >
                All publishers
              </button>
              {publishers.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className="chip"
                  aria-pressed={publisher === item.name}
                  onClick={() => choosePublisher(item.name)}
                >
                  {item.name} <span className="releases__count">{item.count}</span>
                </button>
              ))}
            </div>

            {weeks.length === 0 && (
              <EmptyState
                title="No releases for that publisher"
                message="Try another publisher or show all of them."
                actionLabel="Show all publishers"
                onAction={() => choosePublisher('')}
              />
            )}

            {weeks.map((week) => (
              <section key={week.offset} className="releases__week" aria-labelledby={`week-${week.offset}`}>
                <h2 id={`week-${week.offset}`} className="releases__week-title">
                  {week.label} <span className="releases__count">{week.items.length}</span>
                </h2>
                <ul className="comic-grid">
                  {week.items.map((release) => (
                    <li key={release.id}>
                      <ReleaseCard release={release} />
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </>
        )}
      </div>
    </>
  )
}
