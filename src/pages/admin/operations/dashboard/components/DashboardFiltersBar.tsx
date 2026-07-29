import { DateRangePicker, Select } from '@/design-system/UIComponents'
import { DashboardFilterField, DashboardFiltersGrid } from '@/pages/admin/dashboard/components'
import {
  APPLICATION_TYPE_OPTIONS,
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
    <DashboardFiltersGrid fieldCount={4}>
      <DashboardFilterField label="Date range">
        <DateRangePicker
          size="sm"
          fullWidth
          value={filters.dateRange}
          onChange={(dateRange) => onChange({ ...filters, dateRange })}
        />
      </DashboardFilterField>
      <DashboardFilterField label="Country">
        <Select
          size="sm"
          fullWidth
          value={filters.country}
          onChange={(country) => onChange({ ...filters, country: String(country) })}
          options={COUNTRY_FILTER_OPTIONS}
        />
      </DashboardFilterField>
      <DashboardFilterField label="Application type">
        <Select
          size="sm"
          fullWidth
          value={filters.applicationType}
          onChange={(applicationType) =>
            onChange({ ...filters, applicationType: String(applicationType) })
          }
          options={APPLICATION_TYPE_OPTIONS}
        />
      </DashboardFilterField>
      <DashboardFilterField label="Team">
        <Select
          size="sm"
          fullWidth
          value={filters.team}
          onChange={(team) => onChange({ ...filters, team: String(team) })}
          options={TEAM_FILTER_OPTIONS}
        />
      </DashboardFilterField>
    </DashboardFiltersGrid>
  )
}
