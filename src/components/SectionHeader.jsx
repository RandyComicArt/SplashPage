import { Link } from 'react-router-dom'
import { ArrowRightIcon } from './Icons.jsx'
import './SectionHeader.css'

/** Heading block for a homepage/section row, with an optional "see all" link. */
export default function SectionHeader({ eyebrow, title, description, linkTo, linkLabel, as: Heading = 'h2', id }) {
  return (
    <header className="section-header">
      <div className="section-header__text">
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <Heading className="section-header__title" id={id}>
          {title}
        </Heading>
        {description && <p className="section-header__description">{description}</p>}
      </div>
      {linkTo && (
        <Link to={linkTo} className="text-link section-header__link">
          {linkLabel}
          <ArrowRightIcon size={16} />
        </Link>
      )}
    </header>
  )
}
