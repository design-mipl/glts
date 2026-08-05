import { SegmentPortalApp } from '../shared/SegmentPortalApp'
import { corporateSegmentConfig } from './config/segmentConfig'

/** Corporate customer portal — policy travel & enterprise applications. */
export function CorporatePortalApp() {
  return <SegmentPortalApp config={corporateSegmentConfig} />
}
