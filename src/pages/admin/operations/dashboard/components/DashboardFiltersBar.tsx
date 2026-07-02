import { Stack } from '@mui/material'
import { DateRangePicker, Select } from '@/design-system/UIComponents'
import {
  APPLICATION_TYPE_OPTIONS,
  BRANCH_FILTER_OPTIONS,
  COUNTRY_FILTER_OPTIONS,
  TEAM_FILTER_OPTIONS,
  type DashboardFilters,
} from '../data/operationsDashboardMock'

export interface DashboardFiltersBarProps {
  filters: DashboardFilters
  onChange: (filters: DashboardFilters) => void
}

export function DashboardFiltersBar({ filters, onChange }: DashboardFiltersBarProps) {
  return (
    <Stack
      direction={{ xs: 'column', lg: 'row' }}
      spacing={1.25}
      alignItems={{ xs: 'stretch', lg: 'flex-end' }}
      flexWrap="wrap"
      useFlexGap
      sx={{ width: '100%' }}
    >
      <DateRangePicker
        label="Date range"
        size="sm"
        value={filters.dateRange}
        onChange={(dateRange) => onChange({ ...filters, dateRange })}
        sx={{ flex: { lg: '1 1 180px' }, minWidth: { sm: 180 } }}
      />
      <Select
        label="Country"
        size="sm"
        value={filters.country}
        onChange={(country) => onChange({ ...filters, country: String(country) })}
        options={COUNTRY_FILTER_OPTIONS}
        sx={{ flex: { lg: '1 1 130px' }, minWidth: { sm: 130 } }}
      />
      <Select
        label="Branch"
        size="sm"
        value={filters.branch}
        onChange={(branch) => onChange({ ...filters, branch: String(branch) })}
        options={BRANCH_FILTER_OPTIONS}
        sx={{ flex: { lg: '1 1 120px' }, minWidth: { sm: 120 } }}
      />
      <Select
        label="Application type"
        size="sm"
        value={filters.applicationType}
        onChange={(applicationType) =>
          onChange({ ...filters, applicationType: String(applicationType) })
        }
        options={APPLICATION_TYPE_OPTIONS}
        sx={{ flex: { lg: '1 1 140px' }, minWidth: { sm: 140 } }}
      />
      <Select
        label="Team"
        size="sm"
        value={filters.team}
        onChange={(team) => onChange({ ...filters, team: String(team) })}
        options={TEAM_FILTER_OPTIONS}
        sx={{ flex: { lg: '1 1 140px' }, minWidth: { sm: 140 } }}
      />
    </Stack>
  )
}
