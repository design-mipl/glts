import { Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import type { OrganizationLocationMasterListFilters } from '@/shared/types/organizationLocationMaster'
import { ORGANIZATION_TYPE_OPTIONS } from '../config/organizationTypeConfig'

export const EMPTY_ORGANIZATION_LOCATION_FILTERS: OrganizationLocationMasterListFilters = {
  organizationType: 'all',
}

export interface OrganizationLocationAdvancedFilterFieldsProps {
  draft: OrganizationLocationMasterListFilters
  patch: (partial: Partial<OrganizationLocationMasterListFilters>) => void
}

export function OrganizationLocationAdvancedFilterFields({
  draft,
  patch,
}: OrganizationLocationAdvancedFilterFieldsProps) {
  return (
    <ListingFilterField label="Organization type">
      <Select
        placeholder="Select type"
        value={draft.organizationType ?? 'all'}
        onChange={(value) =>
          patch({
            organizationType: value as OrganizationLocationMasterListFilters['organizationType'],
          })
        }
        options={[{ value: 'all', label: 'All types' }, ...ORGANIZATION_TYPE_OPTIONS]}
        size="sm"
        fullWidth
      />
    </ListingFilterField>
  )
}

export function hasOrganizationLocationFiltersActive(
  filters: OrganizationLocationMasterListFilters,
): boolean {
  return (filters.organizationType ?? 'all') !== 'all'
}
