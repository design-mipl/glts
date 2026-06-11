import type { BadgeColor } from '@/pages/admin/finance/invoices/config/invoiceStatusConfig'
import type {
  ApplicationRollupStatus,
  PassengerOperationalStatus,
} from '@/shared/types/operationalPassengerAssignment'

export const passengerStatusLabel: Record<PassengerOperationalStatus, string> = {
  'Pending Assignment': 'Pending Assignment',
  Assigned: 'Assigned',
  'In Progress': 'In Progress',
  'Carry Forward': 'Carry Forward',
  Completed: 'Completed',
}

export function passengerStatusBadgeColor(status: PassengerOperationalStatus): BadgeColor {
  switch (status) {
    case 'Completed':
      return 'success'
    case 'In Progress':
      return 'info'
    case 'Assigned':
      return 'neutral'
    case 'Carry Forward':
      return 'warning'
    case 'Pending Assignment':
    default:
      return 'neutral'
  }
}

export const rollupStatusLabel: Record<ApplicationRollupStatus, string> = {
  Pending: 'Pending',
  'In Progress': 'In Progress',
  'Partially Completed': 'Partially Completed',
  Completed: 'Completed',
  Escalated: 'Escalated',
}

export function rollupStatusBadgeColor(status: ApplicationRollupStatus): BadgeColor {
  switch (status) {
    case 'Completed':
      return 'success'
    case 'Partially Completed':
      return 'info'
    case 'Escalated':
      return 'error'
    case 'In Progress':
      return 'warning'
    case 'Pending':
    default:
      return 'neutral'
  }
}

export const PASSENGER_STATUS_OPTIONS = Object.entries(passengerStatusLabel).map(([value, label]) => ({
  value,
  label,
}))
