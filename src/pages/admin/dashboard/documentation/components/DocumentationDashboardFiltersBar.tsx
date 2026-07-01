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
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', sm: 'flex-end' }}
      flexWrap="wrap"
      useFlexGap
      sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 420 } }}
    >
      <DateRangePicker
        label="Date range"
        size="sm"
        value={filters.dateRange}
        onChange={(dateRange) => onChange({ ...filters, dateRange })}
        sx={{ minWidth: { sm: 200 } }}
      />
      <Select
        label="Country"
        size="sm"
        value={filters.country}
        onChange={(country) => onChange({ ...filters, country: String(country) })}
        options={DOC_COUNTRY_FILTER_OPTIONS}
        sx={{ minWidth: { sm: 140 } }}
      />
      <Select
        label="Application type"
        size="sm"
        value={filters.applicationType}
        onChange={(applicationType) =>
          onChange({ ...filters, applicationType: String(applicationType) })
        }
        options={DOC_APPLICATION_TYPE_OPTIONS}
        sx={{ minWidth: { sm: 140 } }}
      />
    </Stack>
  )
}
