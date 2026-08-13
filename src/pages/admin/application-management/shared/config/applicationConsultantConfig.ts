import type { ApplicationPriority } from '@/pages/customer/features/applications/data/applicationFlowData'

export const applicationPriorityLabel: Record<ApplicationPriority, string> = {
  Urgent: 'Urgent',
  High: 'High',
  Medium: 'Medium',
  Low: 'Low',
}

export function applicationPriorityBadgeColor(
  priority: ApplicationPriority,
): 'error' | 'warning' | 'info' | 'neutral' {
  switch (priority) {
    case 'Urgent':
      return 'error'
    case 'High':
      return 'warning'
    case 'Medium':
      return 'info'
    case 'Low':
    default:
      return 'neutral'
  }
}

export const APPLICATION_PRIORITY_OPTIONS = Object.entries(applicationPriorityLabel).map(
  ([value, label]) => ({ value, label }),
)
