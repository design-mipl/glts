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
        label="Branch"
        size="sm"
        value={filters.branch}
        onChange={(branch) => onChange({ ...filters, branch: String(branch) })}
        options={ACCOUNTS_BRANCH_OPTIONS}
        sx={{ flex: { md: '1 1 120px' }, minWidth: { sm: 120 } }}
      />
      <Select
        label="Customer type"
        size="sm"
        value={filters.customerType}
        onChange={(customerType) =>
          onChange({ ...filters, customerType: String(customerType) })
        }
        options={ACCOUNTS_CUSTOMER_TYPE_OPTIONS}
        sx={{ flex: { md: '1 1 130px' }, minWidth: { sm: 130 } }}
      />
      <Select
        label="Company"
        size="sm"
        value={filters.company}
        onChange={(company) => onChange({ ...filters, company: String(company) })}
        options={ACCOUNTS_COMPANY_OPTIONS}
        sx={{ flex: { md: '1 1 160px' }, minWidth: { sm: 150 } }}
      />
      <Select
        label="Invoice status"
        size="sm"
        value={filters.invoiceStatus}
        onChange={(invoiceStatus) =>
          onChange({ ...filters, invoiceStatus: String(invoiceStatus) })
        }
        options={ACCOUNTS_INVOICE_STATUS_OPTIONS}
        sx={{ flex: { md: '1 1 140px' }, minWidth: { sm: 140 } }}
      />
    </Stack>
  )
}
