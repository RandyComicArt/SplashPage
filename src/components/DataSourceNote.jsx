import { InfoIcon } from './Icons.jsx'
import { providerInfo } from '../services'
import './DataSourceNote.css'

/**
 * Honest label for where the data comes from. Shown wherever the local
 * catalog could be mistaken for a live feed.
 */
export default function DataSourceNote({ className = '' }) {
  if (providerInfo.isLive) return null

  return (
    <p className={`data-note ${className}`}>
      <InfoIcon size={16} />
      <span>
        <strong>{providerInfo.name}.</strong> {providerInfo.summary}
      </span>
    </p>
  )
}
