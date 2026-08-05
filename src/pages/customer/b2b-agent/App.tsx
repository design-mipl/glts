import { SegmentPortalApp } from '../shared/SegmentPortalApp'
import { b2bAgentSegmentConfig } from './config/segmentConfig'

/** B2B agent customer portal — multi-client applications & bookers. */
export function B2bAgentPortalApp() {
  return <SegmentPortalApp config={b2bAgentSegmentConfig} />
}
