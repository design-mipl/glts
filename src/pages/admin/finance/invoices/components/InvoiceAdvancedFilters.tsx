import { Box } from '@mui/material'
import { Button, Input, Select } from '@/design-system/UIComponents'
import {
  INVOICE_STATUS_OPTIONS,
  INVOICE_TYPE_OPTIONS,
  PAYMENT_STATUS_OPTIONS,
} from '../config/invoiceStatusConfig'
import type { InvoiceAdvancedFilterState } from '../utils/invoiceListingUtils'

interface InvoiceAdvancedFiltersProps {
  filters: InvoiceAdvancedFilterState
  onFiltersChange: (filters: InvoiceAdvancedFilterState) => void
  onClearFilters: () => void
  companies: string[]
  billingEntities: string[]
  vessels: string[]
  countries: string[]
  visaTypes: string[]
  hasActiveFilters: boolean
}

export function InvoiceAdvancedFilters({
  filters,
  onFiltersChange,
  onClearFilters,
  companies,
  billingEntities,
  vessels,
  countries,
  visaTypes,
  hasActiveFilters,
}: InvoiceAdvancedFiltersProps) {
  const patch = (partial: Partial<InvoiceAdvancedFilterState>) =>
    onFiltersChange({ ...filters, ...partial })

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
          },
          gap: 1.5,
        }}
      >
        <Select
          value={filters.company}
          onChange={v => patch({ company: String(v) })}
          options={companies.map(c => ({ value: c, label: c }))}
          placeholder="All companies"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.billingEntity}
          onChange={v => patch({ billingEntity: String(v) })}
          options={billingEntities.map(c => ({ value: c, label: c }))}
          placeholder="All billing entities"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.vessel}
          onChange={v => patch({ vessel: String(v) })}
          options={vessels.map(v => ({ value: v, label: v }))}
          placeholder="All vessels"
          size="sm"
          clearable
          fullWidth
        />
        <Input
          value={filters.applicationId}
          onChange={v => patch({ applicationId: v })}
          placeholder="Application ID"
          size="sm"
          fullWidth
        />
        <Input
          value={filters.batchId}
          onChange={v => patch({ batchId: v })}
          placeholder="Batch ID"
          size="sm"
          fullWidth
        />
        <Select
          value={filters.invoiceType}
          onChange={v => patch({ invoiceType: String(v) })}
          options={INVOICE_TYPE_OPTIONS}
          placeholder="All invoice types"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.invoiceStatus}
          onChange={v => patch({ invoiceStatus: String(v) })}
          options={INVOICE_STATUS_OPTIONS}
          placeholder="All invoice statuses"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.paymentStatus}
          onChange={v => patch({ paymentStatus: String(v) })}
          options={PAYMENT_STATUS_OPTIONS}
          placeholder="All payment statuses"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.country}
          onChange={v => patch({ country: String(v) })}
          options={countries.map(c => ({ value: c, label: c }))}
          placeholder="All countries"
          size="sm"
          clearable
          fullWidth
        />
        <Select
          value={filters.visaType}
          onChange={v => patch({ visaType: String(v) })}
          options={visaTypes.map(v => ({ value: v, label: v }))}
          placeholder="All visa types"
          size="sm"
          clearable
          fullWidth
        />
        <Input
          value={filters.dateFrom}
          onChange={v => patch({ dateFrom: v })}
          placeholder="Date from (YYYY-MM-DD)"
          size="sm"
          fullWidth
        />
        <Input
          value={filters.dateTo}
          onChange={v => patch({ dateTo: v })}
          placeholder="Date to (YYYY-MM-DD)"
          size="sm"
          fullWidth
        />
      </Box>
      {hasActiveFilters ? (
        <Box>
          <Button label="Clear filters" variant="text" size="sm" onClick={onClearFilters} />
        </Box>
      ) : null}
    </Box>
  )
}
