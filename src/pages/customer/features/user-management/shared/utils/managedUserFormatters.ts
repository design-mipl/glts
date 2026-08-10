import type { ManagedUserStatus } from '@/shared/types/managedUser'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'

export const managedUserStatusLabel: Record<ManagedUserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

export const managedUserStatusTone: Record<ManagedUserStatus, 'success' | 'neutral'> = {
  active: 'success',
  inactive: 'neutral',
}

export function formatManagedUserDate(iso?: string): string {
  return formatDisplayDate(iso)
}
