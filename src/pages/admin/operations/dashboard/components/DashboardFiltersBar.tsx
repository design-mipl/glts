import { Stack } from '@mui/material'
import { DateRangePicker, Select } from '@/design-system/UIComponents'
import {
  APPLICATION_TYPE_OPTIONS,
  COUNTRY_FILTER_OPTIONS,
  type DashboardFilters,
} from '../data/operationsDashboardMock'

export interface DashboardFiltersBarProps {
  filters: DashboardFilters
  onChange: (filters: DashboardFilters) => void
}

export function DashboardFiltersBar({ filters, onChange }: DashboardFiltersBarProps) {
  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', sm: 'flex-end' }}
      sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 520 } }}
    >
      <DateRangePicker
        label="Date range"
        size="sm"
        value={filters.dateRange}
        onChange={(dateRange) => onChange({ ...filters, dateRange })}
        sx={{ minWidth: { sm: 220 } }}
      />
      <Select
        label="Country"
        size="sm"
        value={filters.country}
        onChange={(country) => onChange({ ...filters, country: String(country) })}
        options={COUNTRY_FILTER_OPTIONS}
        sx={{ minWidth: { sm: 160 } }}
      />
      <Select
        label="Application type"
        size="sm"
        value={filters.applicationType}
        onChange={(applicationType) =>
          onChange({ ...filters, applicationType: String(applicationType) })
        }
        options={APPLICATION_TYPE_OPTIONS}
        sx={{ minWidth: { sm: 150 } }}
      />
    </Stack>
  )
}
