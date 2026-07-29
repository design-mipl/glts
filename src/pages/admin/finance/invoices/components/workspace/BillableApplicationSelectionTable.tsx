import { useMemo } from 'react'
import { Box, Stack } from '@mui/material'
import type { TableState } from '@/design-system/UIComponents'
import { DateRangePicker, FormField, Select } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import {
  getBillableApplicationRows,
  getBillableCompanyFilterOptions,
} from '@/shared/utils/invoiceBillingEngine'
import {
  formatBillableFilterDate,
  getBillableApplicationCellValue,
  parseBillableFilterDate,
} from '../../utils/billableApplicationSelectionUtils'
import { billableApplicationColumns } from './BillableApplicationTableColumns'

export interface BillableApplicationSelectionFilters {
  companyId: string
  dateFrom: string
  dateTo: string
}

interface BillableApplicationSelectionTableProps {
  filters: BillableApplicationSelectionFilters
  onFiltersChange: (next: BillableApplicationSelectionFilters) => void
  tableState: TableState
  onTableStateChange: (state: TableState) => void
}

const BULK_ACTIONS = [{ label: 'Selected for billing', onClick: () => {} }]

export function BillableApplicationSelectionTable({
  filters,
  onFiltersChange,
  tableState,
  onTableStateChange,
}: BillableApplicationSelectionTableProps) {
  const companyOptions = useMemo(() => getBillableCompanyFilterOptions(), [])
  const columns = billableApplicationColumns
  const rows = useMemo(
    () => getBillableApplicationRows(filters.companyId || undefined, filters.dateFrom, filters.dateTo),
    [filters.companyId, filters.dateFrom, filters.dateTo],
  )

  const clearSelection = () => onTableStateChange({ ...tableState, selectedRows: [], page: 0 })

  const handleCompanyChange = (companyId: string) => {
    onFiltersChange({ ...filters, companyId })
    clearSelection()
  }

  const handleDateChange = (partial: Partial<BillableApplicationSelectionFilters>) => {
    onFiltersChange({ ...filters, ...partial })
    clearSelection()
  }

  return (
    <Stack spacing={2}>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1.4fr' },
          gap: 1.5,
          alignItems: 'start',
        }}
      >
        <FormField label="Company">
          <Select
            value={filters.companyId}
            onChange={v => handleCompanyChange(String(v))}
            options={companyOptions}
            placeholder="All companies"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Online submission date range">
          <DateRangePicker
            value={[parseBillableFilterDate(filters.dateFrom), parseBillableFilterDate(filters.dateTo)]}
            onChange={([from, to]) =>
              handleDateChange({
                dateFrom: formatBillableFilterDate(from),
                dateTo: formatBillableFilterDate(to),
              })
            }
            size="sm"
            fullWidth
          />
        </FormField>
      </Box>

      <AdminListingTable
        columns={columns}
        data={rows}
        filterSourceData={rows}
        rowKey="id"
        state={tableState}
        onStateChange={onTableStateChange}
        columnFilters={{}}
        onColumnFiltersChange={() => {}}
        getCellValue={getBillableApplicationCellValue}
        bulkActions={BULK_ACTIONS}
        enableColumnFilters={false}
        stickyHeader
        emptyTitle="No billable applications"
        emptyDescription="Only Appointment Booked applications for B2B, corporate, and marine customers appear here."
      />
    </Stack>
  )
}
