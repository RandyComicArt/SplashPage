import GuideCard from '../components/GuideCard.jsx'
import ComicCard from '../components/ComicCard.jsx'
import ComicCarousel from '../components/ComicCarousel.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { EmptyState, ErrorState, LoadingState } from '../components/StateViews.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useRecentlyViewed, useSavedComics, useSavedGuides } from '../hooks/useLocalLists.js'
import { getComicsByIds } from '../services'
import { guides } from '../data/guides/index.js'
import './Saved.css'

export default function Saved() {
  usePageTitle('Saved')
  const savedComics = useSavedComics()
  const savedGuides = useSavedGuides()
  const recent = useRecentlyViewed()

  const comicKey = savedComics.ids.join(',')
  const recentKey = recent.ids.join(',')
  const saved = useAsync(() => getComicsByIds(savedComics.ids), [comicKey])
  const viewed = useAsync(() => getComicsByIds(recent.ids), [recentKey])

  const guidesSaved = savedGuides.ids.map((slug) => guides.find((g) => g.slug === slug)).filter(Boolean)
  const nothingSaved = savedComics.ids.length === 0 && guidesSaved.length === 0

  return (
    <div className="container section saved">
      <header className="saved__header">
        <p className="eyebrow">Just for you, on this device</p>
        <h1>Saved</h1>
        <p className="lead">
          Comics and guides you save are kept in this browser only. There are no accounts, and nothing is
          sent anywhere.
        </p>
      </header>

      {nothingSaved && (
        <EmptyState
          title="Nothing saved yet"
          message="Tap the heart on any comic or guide to keep it here."
          actionLabel="Discover comics"
          actionTo="/discover"
        />
      )}

      {savedComics.ids.length > 0 && (
        <section className="saved__section" aria-labelledby="saved-comics-heading">
          <SectionHeader id="saved-comics-heading" title="Saved Comics" />
          {saved.isLoading && !saved.data && <LoadingState label="Loading saved comics" />}
          {saved.isError && <ErrorState onRetry={saved.reload} />}
          {saved.data && (
            <div className="comic-grid">
              {saved.data.map((comic) => (
                <ComicCard key={comic.id} comic={comic} />
              ))}
            </div>
          )}
        </section>
      )}

      {guidesSaved.length > 0 && (
        <section className="saved__section" aria-labelledby="saved-guides-heading">
          <SectionHeader id="saved-guides-heading" title="Saved Guides" />
          <ul className="saved__guides">
            {guidesSaved.map((guide) => (
              <li key={guide.slug}>
                <GuideCard guide={guide} />
              </li>
            ))}
          </ul>
        </section>
      )}

      {recent.ids.length > 0 && viewed.data && (
        <section className="saved__section" aria-labelledby="recent-heading">
          <SectionHeader id="recent-heading" title="Recently Viewed" />
          <ComicCarousel comics={viewed.data} label="Recently viewed comics" />
          <button type="button" className="button button--small button--ghost" onClick={recent.clear}>
            Clear recently viewed
          </button>
        </section>
      )}
    </div>
  )
}
