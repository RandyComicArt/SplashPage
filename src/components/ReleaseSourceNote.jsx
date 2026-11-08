import { InfoIcon } from './Icons.jsx'
import { formatDay } from '../services/releases.js'
import './DataSourceNote.css'

/**
 * Credits Metron (CC BY-SA 4.0 requires attribution) and says when the data was last synced.
 */
export default function ReleaseSourceNote({ releases, className = '' }) {
  const { source, updatedAt } = releases
  const updated = formatDay(updatedAt.slice(0, 10), { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <p className={`data-note ${className}`}>
      <InfoIcon size={16} />
      <span>
        Release data from{' '}
        <a href={source.url} target="_blank" rel="noreferrer">
          {source.name}
        </a>
        , licensed{' '}
        <a href={source.licenseUrl} target="_blank" rel="noreferrer">
          {source.license}
        </a>
        . Updated weekly, last on {updated}.
      </span>
    </p>
  )
}
