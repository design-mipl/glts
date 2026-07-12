import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { Button, ConfirmDialog, Pagination, useToast } from '@/design-system/UIComponents'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { useListingTabParam } from '@/shared/hooks/useListingTabParam'
import { getCurrentListingHref, navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { invoiceService } from '@/shared/services/invoiceService'
import type { Invoice } from '@/shared/types/invoice'
import { InvoiceKpiRow } from '../components/InvoiceKpiRow'
import { buildInvoiceColumns } from '../components/InvoiceTableColumns'
import {
  filterInvoicesByTab,
  getInvoiceTabCounts,
  INVOICE_LISTING_TABS,
  type InvoiceListingTab,
} from '../config/invoiceListingTabs'
import {
  downloadInvoiceCsv,
  getInvoiceCellValue,
  getInvoiceEmptyState,
  mapInvoiceRowsToGridItems,
  matchesInvoiceSearch,
} from '../utils/invoiceListingUtils'
import type { RecordPaymentModalValue } from '../components/workspace/RecordPaymentModal'
import { RecordPaymentModal } from '../components/workspace/RecordPaymentModal'
import type { ShareInvoiceModalValue } from '../components/workspace/ShareInvoiceModal'
import { ShareInvoiceModal } from '../components/workspace/ShareInvoiceModal'

const LISTING_PATH = '/admin/finance/invoices'
const GENERATE_DRAFT_PATH = `${LISTING_PATH}/generate`
const INVOICE_TAB_VALUES = INVOICE_LISTING_TABS.map(tab => tab.id) as readonly InvoiceListingTab[]

function parsePaymentField(raw: string): number {
  const n = Number.parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(n) ? n : 0
}

export function InvoiceListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [rows, setRows] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useListingTabParam(INVOICE_TAB_VALUES, 'all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const listingReturnHref = getCurrentListingHref(location)

  const goFromListing = useCallback(
    (to: string, options?: Parameters<typeof navigateFromListing>[3]) => {
      navigateFromListing(navigate, to, listingReturnHref, options)
    },
    [listingReturnHref, navigate],
  )
  const [shareTarget, setShareTarget] = useState<Invoice>()
  const [shareOpen, setShareOpen] = useState(false)
  const [shareValue, setShareValue] = useState<ShareInvoiceModalValue>({
    email: '',
    paymentTerms: 'Net 30',
    dueDate: '',
    message: '',
  })
  const [submitTarget, setSubmitTarget] = useState<Invoice>()
  const [submitOpen, setSubmitOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Invoice>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [reminderTarget, setReminderTarget] = useState<Invoice>()
  const [reminderOpen, setReminderOpen] = useState(false)
  const [paymentTarget, setPaymentTarget] = useState<Invoice>()
  const [paymentOpen, setPaymentOpen] = useState(false)
  const [paymentValue, setPaymentValue] = useState<RecordPaymentModalValue>({
    amount: '',
    date: new Date().toISOString().slice(0, 10),
    method: 'NEFT',
    reference: '',
    tdsAmount: '',
    netAmount: '',
  })

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(invoiceService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const tabFilteredRows = useMemo(() => filterInvoicesByTab(rows, activeTab), [rows, activeTab])

  const listing = useCustomerListing({
    rows: tabFilteredRows,
    getCellValue: getInvoiceCellValue,
    searchMatch: matchesInvoiceSearch,
    initialPageSize: 10,
  })

  const tabCounts = useMemo(() => getInvoiceTabCounts(rows), [rows])

  const columns = useMemo(
    () =>
      buildInvoiceColumns({
        onOpenDetail: row => goFromListing(`${LISTING_PATH}/${row.id}`),
        onEditDraft: row =>
          goFromListing(`${GENERATE_DRAFT_PATH}?draftId=${row.id}&step=1`),
        onSubmitDraft: row => {
          setSubmitTarget(row)
          setSubmitOpen(true)
        },
        onDeleteDraft: row => {
          setDeleteTarget(row)
          setDeleteOpen(true)
        },
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
        onDownloadReceipt: row => {
          showToast({ title: 'Receipt download started', description: row.invoiceId, variant: 'success' })
        },
        onRecordPayment: row => {
          const collected = row.payments.reduce((sum, p) => sum + p.amount, 0)
          const balance = Math.max(0, row.totals.finalAmount - collected)
          const invoiceAmount = balance > 0 ? balance : 0
          const tdsPct =
            row.taxConfig.tdsApplicable && row.taxConfig.tdsPercentage > 0
              ? row.taxConfig.tdsPercentage
              : 0
          const tdsAmount =
            tdsPct > 0 && invoiceAmount > 0
              ? Math.round(((invoiceAmount * tdsPct) / 100) * 100) / 100
              : 0
          const netAmount = Math.max(0, Math.round((invoiceAmount - tdsAmount) * 100) / 100)
          setPaymentTarget(row)
          setPaymentValue({
            amount: invoiceAmount > 0 ? String(invoiceAmount) : '',
            date: new Date().toISOString().slice(0, 10),
            method: 'NEFT',
            reference: '',
            tdsAmount: tdsAmount > 0 ? String(tdsAmount) : '',
            netAmount: netAmount > 0 ? String(netAmount) : '',
          })
          setPaymentOpen(true)
        },
        onSecondaryInvoice: row => {
          const secondary = invoiceService.createSecondaryInvoice(row.id)
          if (!secondary) {
            showToast({ title: 'Unable to create secondary invoice', variant: 'error' })
            return
          }
          showToast({
            title: 'Secondary invoice created',
            description: `${secondary.invoiceId} linked to ${row.invoiceId}`,
            variant: 'success',
          })
          loadRows()
          goFromListing(`${GENERATE_DRAFT_PATH}?draftId=${secondary.id}&step=1`)
        },
        onCreditNote: row => goFromListing(`${LISTING_PATH}/${row.id}/credit-note`),
        onDebitNote: row => {
          const debit = invoiceService.createDebitNote(row.id)
          if (!debit) {
            showToast({ title: 'Unable to create debit note', variant: 'error' })
            return
          }
          showToast({ title: 'Debit note created', description: debit.invoiceId, variant: 'success' })
          loadRows()
          goFromListing(`${LISTING_PATH}/${debit.id}`)
        },
        onSendReminder: row => {
          setReminderTarget(row)
          setReminderOpen(true)
        },
      }),
    [goFromListing, showToast, loadRows],
  )

  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleGenerate = useCallback(() => goFromListing(`${LISTING_PATH}/generate`), [goFromListing])

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
    [listing, setActiveTab],
  )

  const handleShareConfirm = () => {
    if (!shareTarget) return
    invoiceService.share(shareTarget.id, shareValue)
    showToast({ title: 'Invoice shared', description: `Sent to ${shareValue.email}`, variant: 'success' })
    setShareOpen(false)
    setShareTarget(undefined)
    loadRows()
  }

  const handleSubmitConfirm = () => {
    if (!submitTarget) return
    const updated = invoiceService.submitDraft(submitTarget.id)
    if (!updated) {
      showToast({ title: 'Unable to submit invoice', variant: 'error' })
      return
    }
    showToast({ title: 'Invoice submitted', description: updated.invoiceId, variant: 'success' })
    setSubmitOpen(false)
    setSubmitTarget(undefined)
    loadRows()
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    invoiceService.deleteDraft(deleteTarget.id)
    showToast({ title: 'Draft deleted', variant: 'info' })
    setDeleteOpen(false)
    setDeleteTarget(undefined)
    loadRows()
  }

  const handleReminderConfirm = () => {
    if (!reminderTarget) return
    const updated = invoiceService.sendReminder(reminderTarget.id)
    if (!updated) {
      showToast({ title: 'Unable to send reminder', variant: 'error' })
      return
    }
    showToast({ title: 'Reminder sent', description: reminderTarget.invoiceId, variant: 'success' })
    setReminderOpen(false)
    setReminderTarget(undefined)
    loadRows()
  }

  const handleRecordPaymentConfirm = () => {
    if (!paymentTarget) return
    const invoiceAmount = Number.parseFloat(paymentValue.amount.replace(/,/g, ''))
    const tdsAmount = parsePaymentField(paymentValue.tdsAmount)
    const netAmount = parsePaymentField(paymentValue.netAmount)

    if (!Number.isFinite(invoiceAmount) || invoiceAmount <= 0) {
      showToast({ title: 'Enter a valid invoice amount', variant: 'error' })
      return
    }
    if (netAmount <= 0) {
      showToast({ title: 'Net amount received must be greater than zero', variant: 'error' })
      return
    }
    if (!paymentValue.reference.trim()) {
      showToast({ title: 'Payment reference is required', variant: 'error' })
      return
    }
    const tdsPercentage =
      invoiceAmount > 0 && tdsAmount > 0
        ? Math.round((tdsAmount / invoiceAmount) * 10000) / 100
        : undefined

    const updated = invoiceService.recordPayment(paymentTarget.id, {
      amount: invoiceAmount,
      date: paymentValue.date,
      method: paymentValue.method,
      reference: paymentValue.reference.trim(),
      tdsPercentage,
      tdsAmount: tdsAmount > 0 ? tdsAmount : undefined,
    })
    if (!updated) {
      showToast({ title: 'Unable to record payment', variant: 'error' })
      return
    }
    showToast({
      title: 'Payment recorded',
      description: updated.invoiceId,
      variant: 'success',
    })
    setPaymentOpen(false)
    setPaymentTarget(undefined)
    loadRows()
  }

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Billing & invoice"
            description="Operational invoice generation and finance tracking."
            actions={
              <Button
                label="Generate Invoice"
                startIcon={<Plus size={14} />}
                href={`${LISTING_PATH}/generate`}
              />
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
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search invoice ID, GLTS ref, batch, company, billing entity, vessel, PO ref…"
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
          />
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
              onRowClick={row => goFromListing(`${LISTING_PATH}/${row.id}`)}
              loading={loading}
              stickyHeader
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
            />
          ) : (
            <AdminListingGrid items={gridItems} onItemClick={id => goFromListing(`${LISTING_PATH}/${id}`)} />
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
        open={submitOpen}
        onClose={() => setSubmitOpen(false)}
        title="Submit invoice"
        description={`Submit invoice ${submitTarget?.invoiceId}? This will lock billing items and make the invoice visible to the customer.`}
        confirmLabel="Submit invoice"
        onConfirm={handleSubmitConfirm}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete draft"
        description={`Delete draft ${deleteTarget?.invoiceId}? This cannot be undone.`}
        confirmLabel="Delete draft"
        variant="destructive"
        onConfirm={handleDeleteConfirm}
      />

      <ConfirmDialog
        open={reminderOpen}
        onClose={() => setReminderOpen(false)}
        title="Send payment reminder"
        description={`Send a payment reminder for overdue invoice ${reminderTarget?.invoiceId}?`}
        confirmLabel="Send reminder"
        onConfirm={handleReminderConfirm}
      />

      <RecordPaymentModal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        value={paymentValue}
        onChange={setPaymentValue}
        onSubmit={handleRecordPaymentConfirm}
        invoiceId={paymentTarget?.invoiceId}
      />
    </>
  )
}
