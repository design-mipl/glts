import { Stack } from '@mui/material'
import { Select } from '@/design-system/UIComponents'
import type { CountryMasterListFilters } from '@/shared/types/countryMaster'
import { COUNTRY_STATUS_OPTIONS, PROCESSING_TYPE_OPTIONS } from '../config/countryProcessingConfig'
import { COUNTRY_LISTING_TABS } from '../config/countrySegmentConfig'

export interface CountryAdvancedFiltersProps {
  filters: CountryMasterListFilters
  onChange: (next: CountryMasterListFilters) => void
  showSegmentFilter: boolean
  regionOptions: { value: string; label: string }[]
  onClear: () => void
}

export function CountryAdvancedFilters({
  filters,
  onChange,
  showSegmentFilter,
  regionOptions,
}: CountryAdvancedFiltersProps) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
      <Select
        placeholder="All statuses"
        value={filters.status === 'all' ? '' : (filters.status ?? '')}
        onChange={(value) =>
          onChange({
            ...filters,
            status: (value ? value : 'all') as CountryMasterListFilters['status'],
          })
        }
        options={COUNTRY_STATUS_OPTIONS}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 160 } }}
      />
      <Select
        placeholder="All regions"
        value={filters.region === 'all' ? '' : (filters.region ?? '')}
        onChange={(value) =>
          onChange({
            ...filters,
            region: value ? String(value) : 'all',
          })
        }
        options={regionOptions}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 160 } }}
      />
      <Select
        placeholder="All types"
        value={filters.processingType === 'all' ? '' : (filters.processingType ?? '')}
        onChange={(value) =>
          onChange({
            ...filters,
            processingType: (value ? value : 'all') as CountryMasterListFilters['processingType'],
          })
        }
        options={PROCESSING_TYPE_OPTIONS}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 180 } }}
      />
      {showSegmentFilter ? (
        <Select
          placeholder="All segments"
          value={filters.segment === 'all' ? '' : (filters.segment ?? '')}
          onChange={(value) =>
            onChange({
              ...filters,
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
          sx={{ minWidth: { xs: '100%', sm: 200 } }}
        />
      ) : null}
    </Stack>
  )
}
