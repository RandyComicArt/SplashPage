import { Link, useParams, useSearchParams } from 'react-router-dom'
import CoverFan from '../components/CoverFan.jsx'
import GuideStep from '../components/GuideStep.jsx'
import SaveButton from '../components/SaveButton.jsx'
import SectionHeader from '../components/SectionHeader.jsx'
import { EmptyState } from '../components/StateViews.jsx'
import { ArrowRightIcon } from '../components/Icons.jsx'
import { useAsync } from '../hooks/useAsync.js'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { useSavedGuides } from '../hooks/useLocalLists.js'
import { getComicsByIds } from '../services'
import { getGuideBySlug, guideLevels, guides } from '../data/guides/index.js'
import './GuidePage.css'

export default function GuidePage() {
  const { slug } = useParams()
  const guide = getGuideBySlug(slug)
  usePageTitle(guide?.title ?? 'Guide not found')

  if (!guide) {
    return (
      <div className="container section">
        <EmptyState
          title="Guide not found"
          message="We couldn't find that guide. It may have moved, or the link may be wrong."
          actionLabel="See all guides"
          actionTo="/guides"
        />
      </div>
    )
  }

  // Keyed by slug so switching guides resets any local state inside.
  return <GuideContent key={guide.slug} guide={guide} />
}

function GuideContent({ guide }) {
  const [params, setParams] = useSearchParams()
  const { isSaved, toggle } = useSavedGuides()

  const comicIds = guide.steps.map((step) => step.comicId).filter(Boolean)
  const { data: comicList } = useAsync(
    () => getComicsByIds([...new Set([...comicIds, ...guide.heroComicIds])]),
    [guide.slug],
  )
  const comicsById = new Map((comicList ?? []).map((comic) => [comic.id, comic]))

  // The selected path lives in the URL so a path can be shared or bookmarked.
  const pathId = guide.paths.some((p) => p.id === params.get('path')) ? params.get('path') : guide.defaultPathId
  const path = guide.paths.find((p) => p.id === pathId)
  const stepsById = new Map(guide.steps.map((step) => [step.id, step]))
  const pathSteps = path.stepIds.map((id) => stepsById.get(id)).filter(Boolean)

  const level = guideLevels[guide.level]
  const otherGuides = guides.filter((other) => other.slug !== guide.slug)

  return (
    <article style={{ '--accent': guide.accent }}>
      <header className="guide-hero on-dark halftone halftone--light">
        <div className="container guide-hero__inner">
          <div className="guide-hero__text">
            <nav className="breadcrumb" aria-label="Breadcrumb">
              <ol>
                <li>
                  <Link to="/guides">Beginner Guides</Link>
                </li>
                <li aria-current="page">{guide.character}</li>
              </ol>
            </nav>
            <p className="eyebrow">
              {guide.character} · {guide.publisher}
            </p>
            <h1 className="guide-hero__title">{guide.title}</h1>
            <p className="lead">{guide.tagline}</p>
            <ul className="guide-hero__facts">
              <li>{level.label}</li>
              <li>{guide.steps.length} books</li>
              <li>{guide.paths.length} reading paths</li>
            </ul>
            <div className="guide-hero__actions">
              <a href="#paths" className="button">
                Start reading <ArrowRightIcon size={18} />
              </a>
              <SaveButton
                variant="button"
                isSaved={isSaved(guide.slug)}
                onToggle={() => toggle(guide.slug)}
                label={guide.title}
              />
            </div>
          </div>
          <div className="guide-hero__art">
            <CoverFan comics={guide.heroComicIds.map((id) => comicsById.get(id)).filter(Boolean)} priority />
          </div>
        </div>
      </header>

      <section className="section" aria-labelledby="overview-heading">
        <div className="container guide-overview">
          <div className="guide-overview__intro">
            <h2 id="overview-heading">The short version</h2>
            {guide.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <aside className="guide-overview__aside panel" aria-label="About this guide">
            <dl>
              <div>
                <dt>Who it&rsquo;s for</dt>
                <dd>{guide.audience}</dd>
              </div>
              <div>
                <dt>Familiarity</dt>
                <dd>
                  <strong>{level.label}.</strong> {level.description}
                </dd>
              </div>
              <div>
                <dt>How it works</dt>
                <dd>
                  Pick a path below. Every book explains why it is here, so you can skip ahead with
                  confidence.
                </dd>
              </div>
            </dl>
          </aside>
        </div>
      </section>

      {guide.beforeYouStart?.length > 0 && (
        <section className="section section--paper-2" aria-labelledby="glossary-heading">
          <div className="container">
            <SectionHeader
              id="glossary-heading"
              eyebrow="No homework required"
              title="Before You Start"
              description="A few terms you'll see in this guide, explained in plain language."
            />
            <dl className="glossary">
              {guide.beforeYouStart.map((entry) => (
                <div key={entry.term} className="glossary__entry panel">
                  <dt>{entry.term}</dt>
                  <dd>{entry.definition}</dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      <section className="section" id="paths" aria-labelledby="paths-heading">
        <div className="container">
          <SectionHeader
            id="paths-heading"
            eyebrow="Choose how to start"
            title="Your Reading Path"
            description="Every path uses the same recommendations, just in a different selection and order."
          />

          <div className="path-picker" role="group" aria-label="Reading path">
            {guide.paths.map((option) => (
              <button
                key={option.id}
                type="button"
                className="path-picker__option"
                aria-pressed={option.id === pathId}
                onClick={() => {
                  const next = new URLSearchParams(params)
                  next.set('path', option.id)
                  setParams(next, { replace: true, preventScrollReset: true })
                }}
              >
                <span className="path-picker__label">{option.label}</span>
                <span className="path-picker__count">{option.stepIds.length} books</span>
              </button>
            ))}
          </div>

          <div className="path-summary" aria-live="polite">
            <h3 className="path-summary__title">{path.label}</h3>
            <p>{path.description}</p>
          </div>

          <ol className="guide-steps">
            {pathSteps.map((step, index) => (
              <GuideStep
                key={`${path.id}-${step.id}`}
                step={step}
                number={index + 1}
                comic={comicsById.get(step.comicId)}
              />
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--dark on-dark guide-next" aria-labelledby="next-heading">
        <div className="container guide-next__inner">
          <div>
            <h2 id="next-heading">What&rsquo;s next?</h2>
            {guide.whatsNext && <p className="lead">{guide.whatsNext}</p>}
            <div className="guide-next__actions">
              <Link to={`/discover?character=${encodeURIComponent(guide.character)}`} className="button">
                More {guide.character} comics
              </Link>
              <Link to="/guides" className="button button--ghost">
                All guides
              </Link>
            </div>
          </div>
          {otherGuides.length > 0 && (
            <nav aria-label="Other guides">
              <p className="eyebrow">Other guides</p>
              <ul className="guide-next__list">
                {otherGuides.map((other) => (
                  <li key={other.slug}>
                    <Link to={`/guides/${other.slug}`}>{other.title}</Link>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </section>
    </article>
  )
}
