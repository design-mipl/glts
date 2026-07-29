import { TeamProductivityAnalyticsTab } from '../productivity/TeamProductivityAnalyticsTab'
import type { AdminDashboardTabProps } from '../types'

/** Teams & Productivity — executive workforce intelligence workspace. */
export function ProductivityTab({ loading }: AdminDashboardTabProps) {
  return <TeamProductivityAnalyticsTab loading={loading} />
}
