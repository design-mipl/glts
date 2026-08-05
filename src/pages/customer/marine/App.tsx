import { SegmentPortalApp } from '../shared/SegmentPortalApp'
import { marineSegmentConfig } from './config/segmentConfig'

/** Marine customer portal — crew visas, vessels, crew upload. */
export function MarinePortalApp() {
  return <SegmentPortalApp config={marineSegmentConfig} />
}
