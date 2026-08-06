import { TeamProductivityAnalyticsTab } from '../../admin/productivity/TeamProductivityAnalyticsTab'
import type { SuperAdminDashboardTabProps } from '../types'

/** Teams & Productivity — exact Admin workforce analytics layout. */
export function ProductivityTab({ loading }: SuperAdminDashboardTabProps) {
  return <TeamProductivityAnalyticsTab loading={loading} />
}
