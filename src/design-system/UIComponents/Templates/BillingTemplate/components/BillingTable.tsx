import { useMemo, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { Download, Eye, Pencil, Trash2 } from 'lucide-react'
import {
  DataTable,
  RowActions,
  Tag,
} from '@/design-system/components'
import type { Column, TableState, BulkAction } from '@/design-system/components'
import type { RowAction } from '@/design-system/components'
import type { Invoice, InvoiceStatus } from '../types'
import { INVOICE_STATUS_VARIANT } from '../types'
import BillingColumnFilter from './BillingColumnFilter'

const COLUMN_LABELS: Record<string, string> = {
  invoiceNo: 'Invoice no.',
  client: 'Client',
  project: 'Project',
  invoiceDate: 'Invoice date',
  dueDate: 'Due date',
  amount: 'Amount',
  tds: 'TDS',
  netReceivable: 'Net receivable',
  status: 'Status',
}

export const BILLING_TABLE_COLUMNS = Object.entries(COLUMN_LABELS).map(([key, label]) => ({
  key,
  label,
  hideable: true,
}))

function getCellDisplayValue(
  invoice: Invoice,
  key: string,
  formatAmount: (amount: number) => string,
): string {
  if (key === 'amount') return formatAmount(invoice.amount)
  if (key === 'tds') return formatAmount(invoice.tds)
  if (key === 'netReceivable') return formatAmount(invoice.netReceivable)
  if (key === 'status') return invoice.status
  return String(invoice[key as keyof Invoice] ?? '')
}

export interface BillingTableProps {
  invoices: Invoice[]
  filterSourceInvoices: Invoice[]
  state: TableState
  onStateChange: (state: TableState) => void
  formatAmount: (amount: number) => string
  onView: (invoice: Invoice) => void
  onEdit: (invoice: Invoice) => void
  onDelete?: (invoice: Invoice) => void
  columnFilters: Record<string, string[]>
  onColumnFiltersChange: (filters: Record<string, string[]>) => void
  loading?: boolean
}

export default function BillingTable({
  invoices,
  filterSourceInvoices,
  state,
  onStateChange,
  formatAmount,
  onView,
  onEdit,
  onDelete,
  columnFilters,
  onColumnFiltersChange,
  loading = false,
}: BillingTableProps) {
  const [filterAnchor, setFilterAnchor] = useState<HTMLElement | null>(null)
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null)

  const rowActions = (row: Invoice): RowAction[] => [
    {
      label: 'View',
      icon: <Eye size={16} />,
      onClick: () => onView(row),
    },
    {
      label: 'Edit',
      icon: <Pencil size={16} />,
      onClick: () => onEdit(row),
    },
    {
      label: 'Download',
      icon: <Download size={16} />,
      onClick: () => onView(row),
    },
    {
      label: 'Delete',
      icon: <Trash2 size={16} />,
      variant: 'destructive',
      divider: true,
      onClick: () => onDelete?.(row),
    },
  ]

  const columns: Column<Invoice>[] = [
    {
      key: 'invoiceNo',
      label: 'Invoice no.',
      sortable: true,
      searchable: false,
      width: 140,
      render: (value: string, row: Invoice) => (
        <Typography
          component="span"
          variant="body2"
          sx={{
            color: 'primary.main',
            fontWeight: 500,
            cursor: 'pointer',
            '&:hover': { textDecoration: 'underline' },
          }}
          onClick={(e) => {
            e.stopPropagation()
            onView(row)
          }}
        >
          {value}
        </Typography>
      ),
    },
    { key: 'client', label: 'Client', sortable: true, searchable: false, width: 160 },
    { key: 'project', label: 'Project', sortable: true, searchable: false, width: 160 },
    { key: 'invoiceDate', label: 'Invoice date', sortable: true, searchable: false, width: 110 },
    { key: 'dueDate', label: 'Due date', sortable: true, searchable: false, width: 110 },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      align: 'right',
      searchable: false,
      width: 110,
      render: (value: number) => formatAmount(value),
    },
    {
      key: 'tds',
      label: 'TDS',
      sortable: true,
      align: 'right',
      searchable: false,
      width: 90,
      render: (value: number) => formatAmount(value),
    },
    {
      key: 'netReceivable',
      label: 'Net receivable',
      sortable: true,
      align: 'right',
      searchable: false,
      width: 120,
      render: (value: number) => formatAmount(value),
    },
    {
      key: 'status',
      label: 'Status',
      searchable: false,
      width: 120,
      render: (value: InvoiceStatus) => (
        <Tag label={value} variant={INVOICE_STATUS_VARIANT[value]} />
      ),
    },
    {
      key: 'actions',
      label: '',
      width: 48,
      hideable: false,
      sortable: false,
      render: (_: unknown, row: Invoice) => <RowActions actions={rowActions(row)} row={row} />,
    },
  ]

  const bulkActions: BulkAction[] = [
    { label: 'Export selected', onClick: () => {} },
    { label: 'Delete selected', onClick: () => {}, variant: 'destructive' },
  ]

  const uniqueValues = useMemo(() => {
    if (!activeFilterColumn) return []
    const values = new Set<string>()
    for (const inv of filterSourceInvoices) {
      values.add(getCellDisplayValue(inv, activeFilterColumn, formatAmount))
    }
    return Array.from(values).sort((a, b) => a.localeCompare(b))
  }, [activeFilterColumn, filterSourceInvoices, formatAmount])

  const handleColumnFilterClick = (
    event: React.MouseEvent<HTMLElement>,
    columnKey: string,
  ) => {
    setFilterAnchor(event.currentTarget)
    setActiveFilterColumn(columnKey)
  }

  const handleFilterApply = (columnKey: string, values: string[]) => {
    onColumnFiltersChange({ ...columnFilters, [columnKey]: values })
    onStateChange({ ...state, page: 0 })
  }

  return (
    <Box>
      <DataTable
        columns={columns}
        data={invoices}
        rowKey="id"
        total={invoices.length}
        state={state}
        onStateChange={onStateChange}
        onRowClick={onView}
        loading={loading}
        bulkActions={bulkActions}
        showColumnPicker={false}
        hideToolbar
        hidePagination
        embedded
        showColumnSearch={false}
        onColumnFilterClick={handleColumnFilterClick}
        emptyState={{
          title: 'No invoices found',
          description: 'Try adjusting your search or filters.',
        }}
      />

      <BillingColumnFilter
        open={Boolean(activeFilterColumn)}
        anchorEl={filterAnchor}
        columnKey={activeFilterColumn}
        columnLabel={activeFilterColumn ? COLUMN_LABELS[activeFilterColumn] ?? activeFilterColumn : ''}
        uniqueValues={uniqueValues}
        selectedValues={activeFilterColumn ? columnFilters[activeFilterColumn] ?? [] : []}
        onClose={() => {
          setFilterAnchor(null)
          setActiveFilterColumn(null)
        }}
        onApply={handleFilterApply}
      />
    </Box>
  )
}
