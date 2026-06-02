import type { MasterRecordStatus } from '@/shared/types/masterCommon'

export const masterStatusLabel: Record<MasterRecordStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

export const masterStatusColor: Record<MasterRecordStatus, 'success' | 'neutral'> = {
  active: 'success',
  inactive: 'neutral',
}

export const MASTER_STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All statuses' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
] as const
