import { Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'

export interface EntityListFilters {
  country: string
  status: string
}

export const EMPTY_ENTITY_LIST_FILTERS: EntityListFilters = {
  country: 'all',
  status: 'all',
}

export interface EntityAdvancedFilterFieldsProps {
  draft: EntityListFilters
  patch: (partial: Partial<EntityListFilters>) => void
  countryOptions: string[]
}

export function EntityAdvancedFilterFields({
  draft,
  patch,
  countryOptions,
}: EntityAdvancedFilterFieldsProps) {
  return (
    <>
      <ListingFilterField label="Country">
        <Select
          value={draft.country}
          onChange={(v) => patch({ country: String(v) })}
          options={[
            { value: 'all', label: 'All countries' },
            ...countryOptions.map((c) => ({ value: c, label: c })),
          ]}
          size="sm"
          fullWidth
        />
      </ListingFilterField>
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
    </>
  )
}

export function hasEntityFiltersActive(filters: EntityListFilters): boolean {
  return filters.country !== 'all' || filters.status !== 'all'
}
