import { Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import { BOOKER_LOCATIONS } from '@/shared/data/mockBookerUsers'
import { bookerManagementService } from '@/shared/services/bookerManagementService'

export interface BookerListFilters {
  status: string
  location: string
  createdBy: string
}

export const EMPTY_BOOKER_LIST_FILTERS: BookerListFilters = {
  status: 'all',
  location: 'all',
  createdBy: 'all',
}

export interface BookerAdvancedFilterFieldsProps {
  draft: BookerListFilters
  patch: (partial: Partial<BookerListFilters>) => void
}

export function BookerAdvancedFilterFields({ draft, patch }: BookerAdvancedFilterFieldsProps) {
  const createdByOptions = bookerManagementService.getCreatedByOptions()

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
            ...BOOKER_LOCATIONS.map((loc) => ({ value: loc, label: loc })),
          ]}
          size="sm"
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Created by">
        <Select
          value={draft.createdBy}
          onChange={(v) => patch({ createdBy: String(v) })}
          options={[
            { value: 'all', label: 'All creators' },
            ...createdByOptions.map((name) => ({ value: name, label: name })),
          ]}
          size="sm"
          fullWidth
        />
      </ListingFilterField>
    </>
  )
}

export function hasBookerFiltersActive(filters: BookerListFilters): boolean {
  return filters.status !== 'all' || filters.location !== 'all' || filters.createdBy !== 'all'
}
