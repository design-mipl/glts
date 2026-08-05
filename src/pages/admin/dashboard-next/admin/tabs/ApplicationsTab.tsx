import { AdminPendingVerificationSection } from '../components/AdminPendingVerificationSection'
import type { AdminDashboardTabProps } from '../types'

/** Applications story — pending verification listing (activity lives on Overview). */
export function ApplicationsTab({
  loading,
  onViewVerificationQueue,
}: AdminDashboardTabProps) {
  return (
    <AdminPendingVerificationSection
      loading={loading}
      onViewQueue={onViewVerificationQueue}
    />
  )
}
