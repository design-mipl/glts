import { Stack } from '@mui/material'
import { DateRangePicker, Select } from '@/design-system/UIComponents'
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
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      alignItems={{ xs: 'stretch', sm: 'flex-end' }}
      flexWrap="wrap"
      useFlexGap
      sx={{ width: { xs: '100%', md: 'auto' }, minWidth: { md: 520 } }}
    >
      <DateRangePicker
        label="Date range"
        size="sm"
        value={filters.dateRange}
        onChange={(dateRange) => onChange({ ...filters, dateRange })}
        sx={{ minWidth: { sm: 200 } }}
      />
      <Select
        label="Branch"
        size="sm"
        value={filters.branch}
        onChange={(branch) => onChange({ ...filters, branch: String(branch) })}
        options={ACCOUNTS_BRANCH_OPTIONS}
        sx={{ minWidth: { sm: 130 } }}
      />
      <Select
        label="Customer type"
        size="sm"
        value={filters.customerType}
        onChange={(customerType) =>
          onChange({ ...filters, customerType: String(customerType) })
        }
        options={ACCOUNTS_CUSTOMER_TYPE_OPTIONS}
        sx={{ minWidth: { sm: 130 } }}
      />
      <Select
        label="Company"
        size="sm"
        value={filters.company}
        onChange={(company) => onChange({ ...filters, company: String(company) })}
        options={ACCOUNTS_COMPANY_OPTIONS}
        sx={{ minWidth: { sm: 160 } }}
      />
      <Select
        label="Invoice status"
        size="sm"
        value={filters.invoiceStatus}
        onChange={(invoiceStatus) =>
          onChange({ ...filters, invoiceStatus: String(invoiceStatus) })
        }
        options={ACCOUNTS_INVOICE_STATUS_OPTIONS}
        sx={{ minWidth: { sm: 140 } }}
      />
    </Stack>
  )
}
