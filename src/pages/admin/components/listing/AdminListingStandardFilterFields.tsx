import { Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import type { AdminListingFilterState } from './AdminListingAdvancedFilters'

export interface AdminListingStandardFilterFieldsProps {
  draft: AdminListingFilterState
  patch: (partial: Partial<AdminListingFilterState>) => void
  countries: string[]
  statuses: string[]
  priorities: string[]
}

export function AdminListingStandardFilterFields({
  draft,
  patch,
  countries,
  statuses,
  priorities,
}: AdminListingStandardFilterFieldsProps) {
  return (
    <>
      <ListingFilterField label="Country">
        <Select
          value={draft.country}
          onChange={(value) => patch({ country: String(value) })}
          options={countries.map((country) => ({ value: country, label: country }))}
          placeholder="All countries"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Status">
        <Select
          value={draft.status}
          onChange={(value) => patch({ status: String(value) })}
          options={statuses.map((status) => ({ value: status, label: status }))}
          placeholder="All statuses"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Priority">
        <Select
          value={draft.priority}
          onChange={(value) => patch({ priority: String(value) })}
          options={priorities.map((priority) => ({ value: priority, label: priority }))}
          placeholder="All priorities"
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
    </>
  )
}

export function hasAdminListingStandardFiltersActive(value: AdminListingFilterState): boolean {
  return Boolean(value.country || value.status || value.priority)
}
