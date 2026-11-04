import GuideCard from '../components/GuideCard.jsx'
import { usePageTitle } from '../hooks/usePageTitle.js'
import { guides } from '../data/guides/index.js'
import './GuidesIndex.css'

const howItWorks = [
  {
    title: 'Pick a character',
    text: 'Each guide focuses on one character or team, so you start with someone you already care about.',
  },
  {
    title: 'Choose a path',
    text: 'Short on time? Take the essentials. Prefer modern or classic stories? There is a path for that too.',
  },
  {
    title: 'Know why',
    text: 'Every book explains why it is on the list and what reading it is like, not just where it falls in the order.',
  },
]

export default function GuidesIndex() {
  usePageTitle('Beginner Guides')

  return (
    <>
      <header className="guides-hero on-dark halftone halftone--light">
        <div className="container">
          <p className="eyebrow">Where to start</p>
          <h1>Beginner Guides</h1>
          <p className="lead">
            Decades of history, restarted series and crossovers can make comics feel impossible to enter.
            These hand-written guides cut through it: a small number of books, in a sensible order, with
            plain-language reasons.
          </p>
        </div>
      </header>

      <section className="section" aria-label="All guides">
        <div className="container">
          <ul className="guides-list">
            {guides.map((guide, index) => (
              <li key={guide.slug}>
                <GuideCard guide={guide} featured={index === 0} />
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--paper-2" aria-labelledby="how-heading">
        <div className="container">
          <h2 id="how-heading" className="guides-how__title">
            How the guides work
          </h2>
          <ol className="guides-how">
            {howItWorks.map((item, index) => (
              <li key={item.title} className="guides-how__item">
                <span className="guides-how__number" aria-hidden="true">
                  {index + 1}
                </span>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
