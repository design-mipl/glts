import type { CorporatePortalStatus } from '@/shared/types/corporateAccount'

export const corporatePortalStatusLabel: Record<CorporatePortalStatus, string> = {
  draft: 'Draft',
  active: 'Active',
  inactive: 'Inactive',
}

export const corporatePortalStatusColor: Record<
  CorporatePortalStatus,
  'neutral' | 'info' | 'warning' | 'success' | 'error'
> = {
  draft: 'neutral',
  active: 'success',
  inactive: 'warning',
}
