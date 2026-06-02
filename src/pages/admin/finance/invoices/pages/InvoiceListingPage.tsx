import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { Layers, Plus, Receipt } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { Button, ConfirmDialog, Pagination, useToast } from '@/design-system/UIComponents'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { invoiceService } from '@/shared/services/invoiceService'
import type { Invoice } from '@/shared/types/invoice'
import { InvoiceAdvancedFilters } from '../components/InvoiceAdvancedFilters'
import { InvoiceKpiRow } from '../components/InvoiceKpiRow'
import { buildInvoiceColumns } from '../components/InvoiceTableColumns'
import {
  filterInvoicesByTab,
  getInvoiceTabCounts,
  INVOICE_LISTING_TABS,
  type InvoiceListingTab,
} from '../config/invoiceListingTabs'
import {
  applyInvoiceAdvancedFilters,
  downloadInvoiceCsv,
  EMPTY_INVOICE_ADVANCED_FILTERS,
  getInvoiceCellValue,
  getInvoiceEmptyState,
  getInvoiceFilterOptions,
  mapInvoiceRowsToGridItems,
  matchesInvoiceSearch,
  type InvoiceAdvancedFilterState,
} from '../utils/invoiceListingUtils'
import type { ShareInvoiceModalValue } from '../components/workspace/ShareInvoiceModal'
import { ShareInvoiceModal } from '../components/workspace/ShareInvoiceModal'

const LISTING_PATH = '/admin/finance/invoices'

export function InvoiceListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<InvoiceListingTab>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [advancedFilters, setAdvancedFilters] = useState<InvoiceAdvancedFilterState>(EMPTY_INVOICE_ADVANCED_FILTERS)
  const [shareTarget, setShareTarget] = useState<Invoice>()
  const [shareOpen, setShareOpen] = useState(false)
  const [shareValue, setShareValue] = useState<ShareInvoiceModalValue>({
    email: '',
    paymentTerms: 'Net 30',
    dueDate: '',
    message: '',
  })
  const [cancelTarget, setCancelTarget] = useState<Invoice>()
  const [cancelOpen, setCancelOpen] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(invoiceService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const tabFilteredRows = useMemo(() => filterInvoicesByTab(rows, activeTab), [rows, activeTab])
  const advancedFilteredRows = useMemo(
    () => applyInvoiceAdvancedFilters(tabFilteredRows, advancedFilters),
    [tabFilteredRows, advancedFilters],
  )

  const listing = useCustomerListing({
    rows: advancedFilteredRows,
    getCellValue: getInvoiceCellValue,
    searchMatch: matchesInvoiceSearch,
    initialPageSize: 10,
  })

  const filterOptions = useMemo(() => getInvoiceFilterOptions(rows), [rows])
  const tabCounts = useMemo(() => getInvoiceTabCounts(rows), [rows])

  const hasActiveFilters = Object.values(advancedFilters).some(Boolean)

  const columns = useMemo(
    () =>
      buildInvoiceColumns({
        onOpenDetail: row => navigate(`${LISTING_PATH}/${row.id}`),
        onEditDraft: row => navigate(`${LISTING_PATH}/generate?draftId=${row.id}`),
        onShare: row => {
          setShareTarget(row)
          setShareValue({
            email: row.sharedToEmail ?? '',
            paymentTerms: row.paymentTerms ?? 'Net 30',
            dueDate: row.dueDate,
            message: '',
          })
          setShareOpen(true)
        },
        onDownload: row => {
          showToast({ title: 'Download started', description: `${row.invoiceId}.pdf`, variant: 'success' })
        },
        onCreditNote: row => navigate(`${LISTING_PATH}/${row.id}/credit-note`),
        onCancel: row => {
          setCancelTarget(row)
          setCancelOpen(true)
        },
      }),
    [navigate, showToast],
  )

  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleGenerate = useCallback(() => navigate(`${LISTING_PATH}/generate`), [navigate])

  const emptyState = useMemo(() => {
    const base = getInvoiceEmptyState(activeTab, Boolean(listing.tableState.searchQuery))
    return {
      ...base,
      emptyAction: base.emptyAction ? { ...base.emptyAction, onClick: handleGenerate } : undefined,
    }
  }, [activeTab, listing.tableState.searchQuery, handleGenerate])

  const gridItems = useMemo(() => mapInvoiceRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  const handleTabChange = useCallback(
    (tab: InvoiceListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState(state => ({ ...state, page: 0 }))
    },
    [listing],
  )

  const handleClearFilters = useCallback(() => {
    setAdvancedFilters(EMPTY_INVOICE_ADVANCED_FILTERS)
    listing.handleSearch('')
    listing.setColumnFilters({})
  }, [listing])

  const handleShareConfirm = () => {
    if (!shareTarget) return
    invoiceService.share(shareTarget.id, shareValue)
    showToast({ title: 'Invoice shared', description: `Sent to ${shareValue.email}`, variant: 'success' })
    setShareOpen(false)
    setShareTarget(undefined)
    loadRows()
  }

  const handleCancelConfirm = () => {
    if (!cancelTarget) return
    invoiceService.cancel(cancelTarget.id)
    showToast({ title: 'Invoice cancelled', variant: 'info' })
    setCancelOpen(false)
    setCancelTarget(undefined)
    loadRows()
  }

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Billing & invoice management"
            description="Operational billing, invoice generation and customer finance tracking"
            actions={
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  label="Batch billing"
                  variant="outlined"
                  startIcon={<Layers size={14} />}
                  onClick={() => navigate(`${LISTING_PATH}/generate?mode=batch`)}
                />
                <Button
                  label="Additional charges"
                  variant="outlined"
                  startIcon={<Receipt size={14} />}
                  onClick={() => navigate(`${LISTING_PATH}/generate?type=additional_expense`)}
                />
                <Button label="Generate invoice" startIcon={<Plus size={14} />} onClick={handleGenerate} />
              </Stack>
            }
          />
        }
        kpis={<InvoiceKpiRow invoices={rows} />}
        tabs={INVOICE_LISTING_TABS.map(tab => ({
          value: tab.id,
          label: tab.label,
          count: tabCounts[tab.id],
        }))}
        tabValue={activeTab}
        onTabChange={value => handleTabChange(value as InvoiceListingTab)}
        toolbar={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <AdminListingToolbar
              searchValue={listing.tableState.searchQuery}
              onSearch={listing.handleSearch}
              searchPlaceholder="Search invoice ID, GLTS ref, batch, company, billing entity, vessel…"
              onExport={() => {
                downloadInvoiceCsv(listing.filterSourceRows)
                showToast({ title: 'Export started', variant: 'success' })
              }}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              columns={toolbarColumns}
              hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
              onHiddenColumnKeysChange={keys =>
                listing.setTableState(state => ({ ...state, hiddenColumnKeys: keys }))
              }
              moreMenuItems={[
                { label: 'Download report', onClick: () => navigate(`${LISTING_PATH}/reports`) },
                { label: 'Refresh list', onClick: loadRows },
                { label: 'Clear all filters', onClick: handleClearFilters },
              ]}
            />
            <InvoiceAdvancedFilters
              filters={advancedFilters}
              onFiltersChange={next => {
                setAdvancedFilters(next)
                listing.setTableState(state => ({ ...state, page: 0 }))
              }}
              onClearFilters={handleClearFilters}
              companies={filterOptions.companies}
              billingEntities={filterOptions.billingEntities}
              vessels={filterOptions.vessels}
              countries={filterOptions.countries}
              visaTypes={filterOptions.visaTypes}
              hasActiveFilters={hasActiveFilters}
            />
          </Box>
        }
        listingContent={
          viewMode === 'table' ? (
            <AdminListingTable
              columns={columns}
              data={listing.paginatedRows}
              filterSourceData={listing.filterSourceRows}
              rowKey="id"
              state={listing.tableState}
              onStateChange={listing.setTableState}
              columnFilters={listing.columnFilters}
              onColumnFiltersChange={listing.setColumnFilters}
              getCellValue={getInvoiceCellValue}
              onRowClick={row => navigate(`${LISTING_PATH}/${row.id}`)}
              loading={loading}
              stickyHeader
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
            />
          ) : (
            <AdminListingGrid items={gridItems} onItemClick={id => navigate(`${LISTING_PATH}/${id}`)} />
          )
        }
        footer={
          <Box sx={{ bgcolor: footerBg }}>
            <Pagination
              page={listing.tableState.page}
              pageSize={listing.tableState.pageSize}
              total={listing.total}
              onPage={page => listing.setTableState(state => ({ ...state, page }))}
              onPageSize={pageSize => listing.setTableState(state => ({ ...state, pageSize, page: 0 }))}
            />
          </Box>
        }
      />

      <ShareInvoiceModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        value={shareValue}
        onChange={setShareValue}
        onSubmit={handleShareConfirm}
        invoiceId={shareTarget?.invoiceId}
      />

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => setCancelOpen(false)}
        title="Cancel invoice"
        description={`Cancel invoice ${cancelTarget?.invoiceId}? This cannot be undone.`}
        confirmLabel="Cancel invoice"
        variant="destructive"
        onConfirm={handleCancelConfirm}
      />
    </>
  )
}
