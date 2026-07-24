import { DateRangePicker, Select } from '@/design-system/UIComponents'
import { DashboardFilterField, DashboardFiltersGrid } from '@/pages/admin/dashboard/components'
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
    <DashboardFiltersGrid fieldCount={3}>
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
          options={OPS_COUNTRY_FILTER_OPTIONS}
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
          options={OPS_APPLICATION_TYPE_OPTIONS}
        />
      </DashboardFilterField>
    </DashboardFiltersGrid>
  )
}
