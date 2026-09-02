import type { OrganizationType } from '@/shared/types/organizationLocationMaster'

export const organizationTypeLabel: Record<OrganizationType, string> = {
  glts_branch: 'GLTS Branch',
  partner: 'Partner',
}

export const organizationTypeColor: Record<OrganizationType, 'info' | 'secondary'> = {
  glts_branch: 'info',
  partner: 'secondary',
}

export const ORGANIZATION_TYPE_OPTIONS = (Object.keys(organizationTypeLabel) as OrganizationType[]).map(
  (value) => ({
    value,
    label: organizationTypeLabel[value],
  }),
)
