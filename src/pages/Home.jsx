import { Link, useNavigate } from 'react-router-dom'
import SearchBar from '../components/SearchBar.jsx'
import CoverFan from '../components/CoverFan.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import ComicCarousel from '../components/ComicCarousel.jsx'
import GuideCard from '../components/GuideCard.jsx'
import CharacterCard from '../components/CharacterCard.jsx'
import DataSourceNote from '../components/DataSourceNote.jsx'
import ReleaseCard from '../components/ReleaseCard.jsx'
import ReleaseSourceNote from '../components/ReleaseSourceNote.jsx'
import { ErrorState, LoadingState } from '../components/StateViews.jsx'
import { ArrowRightIcon } from '../components/Icons.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import {
  getBeginnerFriendlyComics,
  getFacets,
  getFeaturedComics,
  getLatestComics,
} from '../services'
import { getReleases, weekOffset } from '../services/releases.js'
import { guides } from '../data/guides/index.js'
import { featuredCharacters } from '../data/characters.js'
import './Home.css'

function loadHomeData() {
  return Promise.all([
    getFeaturedComics(12),
    getBeginnerFriendlyComics(12),
    getLatestComics(12),
    getFacets(),
  ]).then(([featured, beginner, latest, facets]) => ({ featured, beginner, latest, facets }))
}

export default function Home() {
  usePageTitle()
  const navigate = useNavigate()
  const { data, isLoading, isError, reload } = useAsync(loadHomeData, [])

  // Synced weekly release data. When it isn't available (or has nothing on sale
  // this week) the page falls back to the catalog's "Recently Published" row.
  const releaseState = useAsync(getReleases, [])
  const releases = releaseState.data
  const thisWeek = releases ? releases.items.filter((item) => weekOffset(item.storeDate) === 0) : []
  const newReleases = [...thisWeek.filter((item) => item.image), ...thisWeek.filter((item) => !item.image)].slice(0, 20)
  const showReleases = newReleases.length > 0

  const handleSearch = (query) => navigate(query ? `/discover?q=${encodeURIComponent(query)}` : '/discover')

  return (
    <>
      <section className="hero on-dark halftone halftone--light" aria-labelledby="hero-title">
        <div className="container hero__inner">
          <div className="hero__text">
            <p className="eyebrow">Your starting point for comics</p>
            <h1 id="hero-title" className="hero__title">
              Find your next <span className="hero__highlight">story.</span>
            </h1>
            <p className="lead">
              A modern comic discovery hub built to make finding, exploring, and getting into comics easier.
            </p>
            <div className="hero__search">
              <SearchBar size="large" onSearch={handleSearch} />
            </div>
            <ul className="hero__shortcuts">
              <li>
                <Link to="/guides" className="button">
                  Where do I start?
                  <ArrowRightIcon size={18} />
                </Link>
              </li>
              <li>
                <Link to="/discover" className="button button--ghost">
                  Browse all comics
                </Link>
              </li>
            </ul>
          </div>

          <div className="hero__art">
            {data && <CoverFan comics={data.featured.slice(0, 4)} className="hero__fan" priority />}
            <Link to="/guides/where-to-start-with-batman" className="bubble bubble--tail-left hero__bubble">
              Where do I start with Batman?
            </Link>
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="guides-heading">
        <div className="container">
          <SectionHeader
            id="guides-heading"
            eyebrow="Not sure where to start?"
            title="Beginner Guides"
            description="Hand-curated reading paths that explain why each book is worth your time, not just what order to read it in."
            linkTo="/guides"
            linkLabel="All guides"
          />
          <div className="guide-grid">
            {guides.map((guide, index) => (
              <GuideCard key={guide.slug} guide={guide} featured={index === 0} />
            ))}
          </div>
        </div>
      </section>

      {isLoading && (
        <div className="container section">
          <LoadingState label="Loading comics" cards={6} />
        </div>
      )}

      {isError && (
        <div className="container section">
          <ErrorState onRetry={reload} />
        </div>
      )}

      {data && (
        <>
          <section className="section section--paper-2" aria-labelledby="beginner-heading">
            <div className="container">
              <SectionHeader
                id="beginner-heading"
                eyebrow="Easy to jump into"
                title="Beginner-Friendly Picks"
                description="Self-contained stories you can read without knowing decades of history."
                linkTo="/discover?beginner=1"
                linkLabel="See all"
              />
              <ComicCarousel comics={data.beginner} label="Beginner-friendly comics" showBadges={false} />
            </div>
          </section>

          <section className="section" aria-labelledby="character-heading">
            <div className="container">
              <SectionHeader
                id="character-heading"
                eyebrow="Pick a hero"
                title="Explore by Character"
                description="Start with someone you already know."
              />
              <div className="character-grid">
                {featuredCharacters.map((character) => (
                  <CharacterCard key={character.name} character={character} />
                ))}
              </div>
            </div>
          </section>

          <section className="section section--dark on-dark" aria-labelledby="featured-heading">
            <div className="container">
              <SectionHeader
                id="featured-heading"
                eyebrow="Editor's picks"
                title="Featured Comics"
                description="A hand-picked starting shelf of modern and classic stories."
                linkTo="/discover"
                linkLabel="Browse everything"
              />
              <ComicCarousel comics={data.featured} label="Featured comics" showBadges={false} />
            </div>
          </section>

          {!releaseState.isLoading && showReleases && (
            <section className="section" aria-labelledby="latest-heading">
              <div className="container">
                <SectionHeader
                  id="latest-heading"
                  eyebrow="On sale this week"
                  title="New Releases"
                  linkTo="/releases"
                  linkLabel="All releases"
                />
                <ReleaseSourceNote releases={releases} className="latest-note" />
                <ComicCarousel
                  comics={newReleases}
                  label="New releases this week"
                  renderCard={(release) => <ReleaseCard release={release} />}
                />
              </div>
            </section>
          )}

          {!releaseState.isLoading && !showReleases && (
            <section className="section" aria-labelledby="latest-heading">
              <div className="container">
                <SectionHeader
                  id="latest-heading"
                  eyebrow="Newest in the catalog"
                  title="Recently Published"
                  linkTo="/discover?sort=newest"
                  linkLabel="Sort by newest"
                />
                <DataSourceNote className="latest-note" />
                <ComicCarousel comics={data.latest} label="Recently published comics" />
              </div>
            </section>
          )}

          <section className="section section--paper-2" aria-labelledby="browse-heading">
            <div className="container">
              <SectionHeader id="browse-heading" eyebrow="Browse" title="Publishers and Genres" />
              <div className="browse">
                <ul className="browse__publishers">
                  {data.facets.publishers.map((publisher) => (
                    <li key={publisher.name}>
                      <Link
                        to={`/discover?publisher=${encodeURIComponent(publisher.name)}`}
                        className="publisher-tile panel"
                      >
                        <span className="publisher-tile__name">{publisher.name}</span>
                        <span className="publisher-tile__count">
                          {publisher.count} {publisher.count === 1 ? 'comic' : 'comics'}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                <div className="browse__genres">
                  <h3 className="browse__genres-title">Genres</h3>
                  <ul className="chip-list">
                    {data.facets.genres.map((genre) => (
                      <li key={genre.name}>
                        <Link to={`/discover?genre=${encodeURIComponent(genre.name)}`} className="chip">
                          {genre.name} <span className="browse__count">{genre.count}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </>
      )}

      <section className="cta on-dark halftone halftone--light" aria-labelledby="cta-heading">
        <div className="container cta__inner">
          <h2 id="cta-heading" className="cta__title">
            Comics shouldn&rsquo;t be complicated.
          </h2>
          <div className="cta__actions">
            <Link to="/guides" className="button">
              Read a beginner guide
            </Link>
            <Link to="/discover" className="button button--ghost">
              Start exploring
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
