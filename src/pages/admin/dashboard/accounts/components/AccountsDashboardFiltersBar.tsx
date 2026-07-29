import { DateRangePicker, Select } from '@/design-system/UIComponents'
import { DashboardFilterField, DashboardFiltersGrid } from '@/pages/admin/dashboard/components'
import {
  ACCOUNTS_BRANCH_OPTIONS,
  ACCOUNTS_COMPANY_OPTIONS,
  ACCOUNTS_CUSTOMER_TYPE_OPTIONS,
  ACCOUNTS_INVOICE_STATUS_OPTIONS,
  type AccountsDashboardFilters,
} from '../data/accountsDashboardMock'

export interface AccountsDashboardFiltersBarProps {
  filters: AccountsDashboardFilters
  onChange: (filters: AccountsDashboardFilters) => void
}

export function AccountsDashboardFiltersBar({
  filters,
  onChange,
}: AccountsDashboardFiltersBarProps) {
  return (
    <DashboardFiltersGrid fieldCount={5}>
      <DashboardFilterField label="Date range">
        <DateRangePicker
          size="sm"
          fullWidth
          value={filters.dateRange}
          onChange={(dateRange) => onChange({ ...filters, dateRange })}
        />
      </DashboardFilterField>
      <DashboardFilterField label="Branch">
        <Select
          size="sm"
          fullWidth
          value={filters.branch}
          onChange={(branch) => onChange({ ...filters, branch: String(branch) })}
          options={ACCOUNTS_BRANCH_OPTIONS}
        />
      </DashboardFilterField>
      <DashboardFilterField label="Customer type">
        <Select
          size="sm"
          fullWidth
          value={filters.customerType}
          onChange={(customerType) =>
            onChange({ ...filters, customerType: String(customerType) })
          }
          options={ACCOUNTS_CUSTOMER_TYPE_OPTIONS}
        />
      </DashboardFilterField>
      <DashboardFilterField label="Company">
        <Select
          size="sm"
          fullWidth
          value={filters.company}
          onChange={(company) => onChange({ ...filters, company: String(company) })}
          options={ACCOUNTS_COMPANY_OPTIONS}
        />
      </DashboardFilterField>
      <DashboardFilterField label="Invoice status">
        <Select
          size="sm"
          fullWidth
          value={filters.invoiceStatus}
          onChange={(invoiceStatus) =>
            onChange({ ...filters, invoiceStatus: String(invoiceStatus) })
          }
          options={ACCOUNTS_INVOICE_STATUS_OPTIONS}
        />
      </DashboardFilterField>
    </DashboardFiltersGrid>
  )
}
