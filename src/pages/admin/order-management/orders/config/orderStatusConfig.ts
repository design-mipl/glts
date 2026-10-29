import type { OrderStatus } from '@/shared/types/order'

export const orderStatusLabel: Record<OrderStatus, string> = {
  draft: 'Draft',
  confirmed: 'Confirmed',
  'in-progress': 'In Progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
}

export const orderStatusColor: Record<OrderStatus, 'neutral' | 'info' | 'warning' | 'success' | 'error'> = {
  draft: 'neutral',
  confirmed: 'info',
  'in-progress': 'warning',
  completed: 'success',
  cancelled: 'error',
}

export const orderStatusOptions = (Object.keys(orderStatusLabel) as OrderStatus[]).map((value) => ({
  value,
  label: orderStatusLabel[value],
}))
