import { VisaAnalyticsTab } from '../analytics/VisaAnalyticsTab'
import type { AdminDashboardTabProps } from '../types'

/** Analytics tab — executive Visa Analytics BI workspace. */
export function AnalyticsTab({ loading }: AdminDashboardTabProps) {
  return <VisaAnalyticsTab loading={loading} />
}
