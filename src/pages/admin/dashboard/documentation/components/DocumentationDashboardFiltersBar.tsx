import { DateRangePicker, Select } from '@/design-system/UIComponents'
import { DashboardFilterField, DashboardFiltersGrid } from '@/pages/admin/dashboard/components'
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
          options={DOC_COUNTRY_FILTER_OPTIONS}
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
          options={DOC_APPLICATION_TYPE_OPTIONS}
        />
      </DashboardFilterField>
    </DashboardFiltersGrid>
  )
}
