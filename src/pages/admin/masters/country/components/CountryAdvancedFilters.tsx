import { Stack } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import type { CountryMasterListFilters } from '@/shared/types/countryMaster'
import { PROCESSING_TYPE_OPTIONS } from '../config/countryProcessingConfig'
import { COUNTRY_LISTING_TABS } from '../config/countrySegmentConfig'

export interface CountryAdvancedFiltersProps {
  filters: CountryMasterListFilters
  onChange: (next: CountryMasterListFilters) => void
  showSegmentFilter: boolean
  onClear: () => void
}

export function CountryAdvancedFilters({
  filters,
  onChange,
  showSegmentFilter,
}: CountryAdvancedFiltersProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
      <Select
        label="Processing type"
        value={filters.processingType ?? 'all'}
        onChange={(value) =>
          onChange({
            ...filters,
            processingType: value as CountryMasterListFilters['processingType'],
          })
        }
        options={[{ value: 'all', label: 'All types' }, ...PROCESSING_TYPE_OPTIONS]}
        size="sm"
        sx={{ minWidth: 160 }}
      />
      {showSegmentFilter ? (
        <Select
          label="Segment"
          value={filters.segment ?? 'all'}
          onChange={(value) =>
            onChange({
              ...filters,
              segment: value as CountryMasterListFilters['segment'],
            })
          }
          options={[
            { value: 'all', label: 'All segments' },
            ...COUNTRY_LISTING_TABS.filter((t) => t.value !== 'all').map((t) => ({
              value: t.value,
              label: t.label,
            })),
          ]}
          size="sm"
          sx={{ minWidth: 180 }}
        />
      ) : null}
    </Stack>
  )
}
