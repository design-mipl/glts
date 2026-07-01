import { Stack } from '@mui/material'
import { DateRangePicker, Select } from '@/design-system/UIComponents'
import {
  OPS_APPLICATION_TYPE_OPTIONS,
  OPS_COUNTRY_FILTER_OPTIONS,
  type OperationsDashboardFilters,
} from '../data/operationsConsultantDashboardMock'

export interface OperationsDashboardFiltersBarProps {
  filters: OperationsDashboardFilters
  onChange: (filters: OperationsDashboardFilters) => void
}

export function OperationsDashboardFiltersBar({
  filters,
  onChange,
}: OperationsDashboardFiltersBarProps) {
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
        options={OPS_COUNTRY_FILTER_OPTIONS}
        sx={{ minWidth: { sm: 140 } }}
      />
      <Select
        label="Application type"
        size="sm"
        value={filters.applicationType}
        onChange={(applicationType) =>
          onChange({ ...filters, applicationType: String(applicationType) })
        }
        options={OPS_APPLICATION_TYPE_OPTIONS}
        sx={{ minWidth: { sm: 140 } }}
      />
    </Stack>
  )
}
