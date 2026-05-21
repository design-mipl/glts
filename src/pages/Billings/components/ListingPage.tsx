import { useCallback, useMemo, useState } from 'react'
import { Box, Typography, Card } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { Button, useToast } from '@/design-system/components'
import type { TableState } from '@/design-system/components'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import {
  BillingKPICards,
  BillingStatusTabs,
  BillingTable,
  BillingGridView,
  BillingPagination,
  BillingModal,
  BillingToolbar,
  BILLING_TABLE_COLUMNS,
  EMPTY_FILTERS,
} from '@/design-system/UIComponents/Templates/BillingTemplate'
import type { BillingFilterState } from '@/design-system/UIComponents/Templates/BillingTemplate'
import type { Invoice } from '@/design-system/UIComponents/Templates/BillingTemplate/types'
import { useBillingData } from '../hooks/useBillingData'

const initialTableState: TableState = {
  page: 0,
  pageSize: 10,
  sortKey: null,
  sortDirection: null,
  filters: [],
  searchQuery: '',
  columnSearch: {},
  selectedRows: [],
  expandedRows: [],
  hiddenColumnKeys: [],
}

function getColumnDisplayValue(
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

function applyColumnFilters(
  invoices: Invoice[],
  columnFilters: Record<string, string[]>,
  formatAmount: (amount: number) => string,
): Invoice[] {
  return invoices.filter((inv) =>
    Object.entries(columnFilters).every(([key, values]) => {
      if (!values.length) return true
      return values.includes(getColumnDisplayValue(inv, key, formatAmount))
    }),
  )
}

export default function ListingPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const {
    invoices,
    kpiData,
    formatINR,
    filterByStatus: filterStatus,
    searchInvoices: search,
    applyFilterOptions: applyFilters,
  } = useBillingData()

  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [statusTab, setStatusTab] = useState('all')
  const [tableState, setTableState] = useState<TableState>(initialTableState)
  const [modalOpen, setModalOpen] = useState(false)
  const [advancedFilters] = useState<BillingFilterState>(EMPTY_FILTERS)
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const beforeColumnFilters = useMemo(() => {
    let result = invoices
    result = filterStatus(result, statusTab)
    result = search(result, tableState.searchQuery)
    result = applyFilters(result, {
      status: advancedFilters.status,
      client: advancedFilters.client,
      amountMin: advancedFilters.amountMin,
      amountMax: advancedFilters.amountMax,
    })
    return result
  }, [
    invoices,
    statusTab,
    tableState.searchQuery,
    advancedFilters,
    filterStatus,
    search,
    applyFilters,
  ])

  const filteredInvoices = useMemo(
    () => applyColumnFilters(beforeColumnFilters, columnFilters, formatINR),
    [beforeColumnFilters, columnFilters, formatINR],
  )

  const paginatedInvoices = useMemo(() => {
    const start = tableState.page * tableState.pageSize
    return filteredInvoices.slice(start, start + tableState.pageSize)
  }, [filteredInvoices, tableState.page, tableState.pageSize])

  const handleView = useCallback(
    (invoice: Invoice) => {
      navigate(`/billings/${invoice.id}`)
    },
    [navigate],
  )

  const handleEdit = useCallback(
    (invoice: Invoice) => {
      navigate(`/billings/${invoice.id}/edit`)
    },
    [navigate],
  )

  const handleDelete = useCallback(() => {
    showToast({
      title: 'Deleted',
      description: 'Invoice removed from list (demo).',
      variant: 'info',
    })
  }, [showToast])

  const handleExport = useCallback(() => {
    showToast({
      title: 'Export started',
      description: 'Your invoice export will download shortly.',
      variant: 'success',
    })
  }, [showToast])

  const handleSearch = useCallback((q: string) => {
    setTableState((s) => ({ ...s, searchQuery: q, page: 0 }))
  }, [])

  const handleStatusTabChange = useCallback((tab: string) => {
    setStatusTab(tab)
    setTableState((s) => ({ ...s, page: 0 }))
  }, [])

  const handleHiddenColumnsChange = useCallback((keys: string[]) => {
    setTableState((s) => ({ ...s, hiddenColumnKeys: keys }))
  }, [])

  return (
    <Box>
      <BillingKPICards kpis={kpiData} formatAmount={formatINR} />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2,
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h1">Invoices</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Cross-project client invoices and payments
          </Typography>
        </Box>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Plus size={16} strokeWidth={1.75} />}
          onClick={() => setModalOpen(true)}
          sx={{ flexShrink: 0 }}
        >
          Create invoice
        </Button>
      </Box>

      <Card
        elevation={0}
        sx={{
          border: `${BORDER_WIDTH.thin} solid`,
          borderColor: 'divider',
          borderRadius: BORDER_RADIUS.lg,
          boxShadow: SHADOWS.sm,
          overflow: 'hidden',
          bgcolor: 'background.paper',
        }}
      >
        <Box
          sx={{
            borderBottom: `${BORDER_WIDTH.thin} solid`,
            borderColor: 'divider',
          }}
        >
          <BillingStatusTabs
            value={statusTab}
            onChange={handleStatusTabChange}
            embedded
          />
        </Box>

        <Box
          sx={{
            p: 2,
            borderBottom: `${BORDER_WIDTH.thin} solid`,
            borderColor: 'divider',
          }}
        >
          <BillingToolbar
            searchValue={tableState.searchQuery}
            onSearch={handleSearch}
            onExport={handleExport}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={BILLING_TABLE_COLUMNS}
            hiddenColumnKeys={tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={handleHiddenColumnsChange}
          />
        </Box>

        {viewMode === 'table' ? (
          <>
            <BillingTable
              invoices={paginatedInvoices}
              filterSourceInvoices={beforeColumnFilters}
              state={tableState}
              onStateChange={setTableState}
              formatAmount={formatINR}
              onView={handleView}
              onEdit={handleEdit}
              onDelete={handleDelete}
              columnFilters={columnFilters}
              onColumnFiltersChange={setColumnFilters}
            />
            <BillingPagination
              page={tableState.page}
              pageSize={tableState.pageSize}
              total={filteredInvoices.length}
              onPage={(page) => setTableState((s) => ({ ...s, page }))}
              onPageSize={(pageSize) => setTableState((s) => ({ ...s, pageSize, page: 0 }))}
              embedded
            />
          </>
        ) : (
          <>
            <Box sx={{ p: 2 }}>
              <BillingGridView
                invoices={paginatedInvoices}
                formatAmount={formatINR}
                onSelect={handleView}
              />
            </Box>
            <BillingPagination
              page={tableState.page}
              pageSize={tableState.pageSize}
              total={filteredInvoices.length}
              onPage={(page) => setTableState((s) => ({ ...s, page }))}
              onPageSize={(pageSize) => setTableState((s) => ({ ...s, pageSize, page: 0 }))}
              embedded
            />
          </>
        )}
      </Card>

      <BillingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={() =>
          showToast({
            title: 'Invoice saved',
            description: 'New invoice created successfully.',
            variant: 'success',
          })
        }
      />
    </Box>
  )
}
