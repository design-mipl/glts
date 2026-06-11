import type { BadgeColor } from '@/pages/admin/finance/invoices/config/invoiceStatusConfig'
import type { AssignmentPriority } from '@/shared/types/operationalPassengerAssignment'

export const assignmentPriorityLabel: Record<AssignmentPriority, string> = {
  Urgent: 'Urgent',
  High: 'High',
  Medium: 'Medium',
  Low: 'Low',
}

export function assignmentPriorityBadgeColor(priority: AssignmentPriority): BadgeColor {
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

export const ASSIGNMENT_PRIORITY_OPTIONS = Object.entries(assignmentPriorityLabel).map(([value, label]) => ({
  value,
  label,
}))
