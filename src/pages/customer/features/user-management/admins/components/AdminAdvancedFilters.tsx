import { Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import { ADMIN_LOCATIONS } from '@/shared/data/mockAdminUsers'

export interface AdminListFilters {
  status: string
  location: string
}

export const EMPTY_ADMIN_LIST_FILTERS: AdminListFilters = {
  status: 'all',
  location: 'all',
}

export interface AdminAdvancedFilterFieldsProps {
  draft: AdminListFilters
  patch: (partial: Partial<AdminListFilters>) => void
}

export function AdminAdvancedFilterFields({ draft, patch }: AdminAdvancedFilterFieldsProps) {
  return (
    <>
      <ListingFilterField label="Status">
        <Select
          value={draft.status}
          onChange={(v) => patch({ status: String(v) })}
          options={[
            { value: 'all', label: 'All statuses' },
            { value: 'active', label: 'Active' },
            { value: 'inactive', label: 'Inactive' },
          ]}
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Location">
        <Select
          value={draft.location}
          onChange={(v) => patch({ location: String(v) })}
          options={[
            { value: 'all', label: 'All locations' },
            ...ADMIN_LOCATIONS.map((loc) => ({ value: loc, label: loc })),
          ]}
          size="sm"
          fullWidth
        />
      </ListingFilterField>
    </>
  )
}

export function hasAdminListFiltersActive(filters: AdminListFilters): boolean {
  return filters.status !== 'all' || filters.location !== 'all'
}
