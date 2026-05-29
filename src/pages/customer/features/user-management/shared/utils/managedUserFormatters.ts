import type { ManagedUserStatus } from '@/shared/types/managedUser'

export const managedUserStatusLabel: Record<ManagedUserStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

export const managedUserStatusTone: Record<ManagedUserStatus, 'success' | 'neutral'> = {
  active: 'success',
  inactive: 'neutral',
}

export function formatManagedUserDate(iso?: string): string {
  if (!iso) return '--'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
}
