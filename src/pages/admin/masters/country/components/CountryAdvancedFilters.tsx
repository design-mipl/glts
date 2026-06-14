import { Select } from '@/design-system/UIComponents'
import { ListingFilterField } from '@/design-system/listingFilterPopoverShell'
import type { CountryMasterListFilters } from '@/shared/types/countryMaster'
import { COUNTRY_STATUS_OPTIONS, PROCESSING_TYPE_OPTIONS } from '../config/countryProcessingConfig'
import { COUNTRY_LISTING_TABS } from '../config/countrySegmentConfig'

export const EMPTY_COUNTRY_MASTER_LIST_FILTERS: CountryMasterListFilters = {
  status: 'all',
  segment: 'all',
  processingType: 'all',
  region: 'all',
}

export interface CountryAdvancedFilterFieldsProps {
  draft: CountryMasterListFilters
  patch: (partial: Partial<CountryMasterListFilters>) => void
  regionOptions: { value: string; label: string }[]
  showSegmentFilter?: boolean
}

export function CountryAdvancedFilterFields({
  draft,
  patch,
  regionOptions,
  showSegmentFilter = true,
}: CountryAdvancedFilterFieldsProps) {
  return (
    <>
      <ListingFilterField label="Status">
        <Select
          placeholder="All statuses"
          value={draft.status === 'all' ? '' : (draft.status ?? '')}
          onChange={(value) =>
            patch({
              status: (value ? value : 'all') as CountryMasterListFilters['status'],
            })
          }
          options={COUNTRY_STATUS_OPTIONS}
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Region">
        <Select
          placeholder="All regions"
          value={draft.region === 'all' ? '' : (draft.region ?? '')}
          onChange={(value) =>
            patch({
              region: value ? String(value) : 'all',
            })
          }
          options={regionOptions}
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      <ListingFilterField label="Processing type">
        <Select
          placeholder="All types"
          value={draft.processingType === 'all' ? '' : (draft.processingType ?? '')}
          onChange={(value) =>
            patch({
              processingType: (value ? value : 'all') as CountryMasterListFilters['processingType'],
            })
          }
          options={PROCESSING_TYPE_OPTIONS}
          size="sm"
          clearable
          fullWidth
        />
      </ListingFilterField>
      {showSegmentFilter ? (
        <ListingFilterField label="Segment">
          <Select
            placeholder="All segments"
            value={draft.segment === 'all' ? '' : (draft.segment ?? '')}
            onChange={(value) =>
              patch({
                segment: (value ? value : 'all') as CountryMasterListFilters['segment'],
              })
            }
            options={COUNTRY_LISTING_TABS.filter((t) => t.value !== 'all').map((t) => ({
              value: t.value,
              label: t.label,
            }))}
            size="sm"
            clearable
            fullWidth
          />
        </ListingFilterField>
      ) : null}
    </>
  )
}

export function hasCountryFiltersActive(filters: CountryMasterListFilters): boolean {
  return (
    (filters.status ?? 'all') !== 'all' ||
    (filters.segment ?? 'all') !== 'all' ||
    (filters.processingType ?? 'all') !== 'all' ||
    (filters.region ?? 'all') !== 'all'
  )
}
