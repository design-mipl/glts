import { Stack } from '@mui/material'
import { DateRangePicker, Select } from '@/design-system/UIComponents'
import {
  DOC_APPLICATION_TYPE_OPTIONS,
  DOC_COUNTRY_FILTER_OPTIONS,
  type DocumentationDashboardFilters,
} from '../data/documentationDashboardMock'

export interface DocumentationDashboardFiltersBarProps {
  filters: DocumentationDashboardFilters
  onChange: (filters: DocumentationDashboardFilters) => void
}

export function DocumentationDashboardFiltersBar({
  filters,
  onChange,
}: DocumentationDashboardFiltersBarProps) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      spacing={1.25}
      alignItems={{ xs: 'stretch', md: 'flex-end' }}
      flexWrap={{ xs: 'wrap', md: 'nowrap' }}
      useFlexGap
      sx={{ width: '100%' }}
    >
      <DateRangePicker
        label="Date range"
        size="sm"
        layout="inline"
        value={filters.dateRange}
        onChange={(dateRange) => onChange({ ...filters, dateRange })}
        sx={{ flex: { md: '0 1 auto' }, minWidth: { sm: 280 } }}
      />
      <Select
        label="Country"
        size="sm"
        value={filters.country}
        onChange={(country) => onChange({ ...filters, country: String(country) })}
        options={DOC_COUNTRY_FILTER_OPTIONS}
        sx={{ flex: { md: '1 1 140px' }, minWidth: { sm: 140 } }}
      />
      <Select
        label="Application type"
        size="sm"
        value={filters.applicationType}
        onChange={(applicationType) =>
          onChange({ ...filters, applicationType: String(applicationType) })
        }
        options={DOC_APPLICATION_TYPE_OPTIONS}
        sx={{ flex: { md: '1 1 140px' }, minWidth: { sm: 140 } }}
      />
    </Stack>
  )
}
