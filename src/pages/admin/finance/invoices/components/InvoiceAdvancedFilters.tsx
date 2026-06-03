import { Stack } from '@mui/material'
import { Input, Select } from '@/design-system/UIComponents'
import {
  BILLING_MODE_OPTIONS,
  INVOICE_STATUS_OPTIONS,
  INVOICE_TYPE_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from '../config/invoiceStatusConfig'
import type { InvoiceAdvancedFilterState } from '../utils/invoiceListingUtils'

export interface InvoiceAdvancedFiltersProps {
  filters: InvoiceAdvancedFilterState
  onChange: (next: InvoiceAdvancedFilterState) => void
  companyOptions: string[]
  billingEntityOptions: string[]
  vesselOptions: string[]
  countryOptions: string[]
  visaTypeOptions: string[]
}

export function InvoiceAdvancedFilters({
  filters,
  onChange,
  companyOptions,
  billingEntityOptions,
  vesselOptions,
  countryOptions,
  visaTypeOptions,
}: InvoiceAdvancedFiltersProps) {
  const patch = (partial: Partial<InvoiceAdvancedFilterState>) => onChange({ ...filters, ...partial })

  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} useFlexGap flexWrap="wrap">
      <Select
        placeholder="Company"
        value={filters.company}
        onChange={v => patch({ company: String(v ?? '') })}
        options={companyOptions.map(c => ({ value: c, label: c }))}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 160 } }}
      />
      <Select
        placeholder="Billing entity"
        value={filters.billingEntity}
        onChange={v => patch({ billingEntity: String(v ?? '') })}
        options={billingEntityOptions.map(c => ({ value: c, label: c }))}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 160 } }}
      />
      <Select
        placeholder="Vessel"
        value={filters.vessel}
        onChange={v => patch({ vessel: String(v ?? '') })}
        options={vesselOptions.map(c => ({ value: c, label: c }))}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 140 } }}
      />
      <Select
        placeholder="Billing mode"
        value={filters.billingMode}
        onChange={v => patch({ billingMode: String(v ?? '') })}
        options={BILLING_MODE_OPTIONS}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 150 } }}
      />
      <Select
        placeholder="Invoice type"
        value={filters.invoiceType}
        onChange={v => patch({ invoiceType: String(v ?? '') })}
        options={INVOICE_TYPE_OPTIONS}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 150 } }}
      />
      <Select
        placeholder="Invoice status"
        value={filters.invoiceStatus}
        onChange={v => patch({ invoiceStatus: String(v ?? '') })}
        options={INVOICE_STATUS_OPTIONS}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 140 } }}
      />
      <Select
        placeholder="Payment status"
        value={filters.paymentStatus}
        onChange={v => patch({ paymentStatus: String(v ?? '') })}
        options={PAYMENT_STATUS_OPTIONS}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 140 } }}
      />
      <Select
        placeholder="Country"
        value={filters.country}
        onChange={v => patch({ country: String(v ?? '') })}
        options={countryOptions.map(c => ({ value: c, label: c }))}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 120 } }}
      />
      <Select
        placeholder="Visa type"
        value={filters.visaType}
        onChange={v => patch({ visaType: String(v ?? '') })}
        options={visaTypeOptions.map(c => ({ value: c, label: c }))}
        size="sm"
        clearable
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 140 } }}
      />
      <Input
        value={filters.dateFrom}
        onChange={v => patch({ dateFrom: v })}
        placeholder="From date"
        size="sm"
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 130 } }}
      />
      <Input
        value={filters.dateTo}
        onChange={v => patch({ dateTo: v })}
        placeholder="To date"
        size="sm"
        fullWidth
        sx={{ minWidth: { xs: '100%', sm: 130 } }}
      />
    </Stack>
  )
}
