import { Navigate } from 'react-router-dom'
import { businessAppBase, businessSignInPath } from '@/shared/auth/customerSegment'
import { loadSession, type CustomerType } from '@/shared/auth/session'
import { CustomerPortalRoutes } from './CustomerPortalRoutes'
import type { CustomerSegmentPortalConfig } from './segmentTypes'

/** Ensures the signed-in business session matches this segment portal. */
export function SegmentPortalApp({ config }: { config: CustomerSegmentPortalConfig }) {
  const session = loadSession()
  const expected: CustomerType = config.customerType

  if (!session || session.portal !== 'business') {
    return <Navigate to={businessSignInPath(expected)} replace />
  }

  if (session.customerType && session.customerType !== expected) {
    return <Navigate to={`${businessAppBase(session.customerType)}/dashboard`} replace />
  }

  return <CustomerPortalRoutes config={config} />
}
