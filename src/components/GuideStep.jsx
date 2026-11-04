import { Link } from 'react-router-dom'
import CoverImage from './CoverImage.jsx'
import { ArrowRightIcon } from './Icons.jsx'
import { entryLabels } from '../data/guides/index.js'
import './GuideStep.css'

/**
 * One recommendation inside a guide: the cover, where it sits in the order,
 * and, most importantly, WHY it is on the list.
 * `comic` may be missing (not in the catalog); the step still reads fine.
 */
export default function GuideStep({ step, number, comic }) {
  const cover = (
    <CoverImage
      src={comic?.coverThumbUrl}
      title={step.title}
      publisher={comic?.publisher}
      alt={`Cover of ${step.title}`}
    />
  )

  return (
    <li className="guide-step panel">
      <span className="guide-step__number" aria-hidden="true">
        {number}
      </span>

      <div className="guide-step__cover">
        {comic ? (
          <Link to={`/comics/${comic.id}`} aria-label={`View details for ${step.title}`}>
            {cover}
          </Link>
        ) : (
          cover
        )}
      </div>

      <div className="guide-step__head">
        <span className={`guide-step__entry guide-step__entry--${step.entry}`}>{entryLabels[step.entry]}</span>
        <h3 className="guide-step__title">
          <span className="visually-hidden">Step {number}: </span>
          {step.title}
        </h3>
        {step.issues && <p className="guide-step__issues">{step.issues}</p>}
      </div>

      <div className="guide-step__body">
        <section>
          <h4>Why it&rsquo;s here</h4>
          <p>{step.why}</p>
        </section>
        {step.expect && (
          <section>
            <h4>What to expect</h4>
            <p>{step.expect}</p>
          </section>
        )}
        {step.note && <p className="guide-step__note">{step.note}</p>}
        {comic && (
          <Link to={`/comics/${comic.id}`} className="text-link guide-step__link">
            Comic details <ArrowRightIcon size={16} />
          </Link>
        )}
      </div>
    </li>
  )
}
