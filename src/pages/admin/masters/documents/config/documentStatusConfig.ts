import type { DocumentMasterStatus } from '@/shared/types/documentMaster'

export const documentStatusLabel: Record<DocumentMasterStatus, string> = {
  active: 'Active',
  inactive: 'Inactive',
}

export const documentStatusColor: Record<
  DocumentMasterStatus,
  'success' | 'neutral'
> = {
  active: 'success',
  inactive: 'neutral',
}
