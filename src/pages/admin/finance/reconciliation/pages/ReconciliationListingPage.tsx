import { useCallback, useEffect, useMemo, useState } from 'react'

import { useSearchParams } from 'react-router-dom'

import { Box, Stack, alpha, useTheme } from '@mui/material'

import { BulkActions, Pagination, Tabs, type BulkAction, useToast } from '@/design-system/UIComponents'

import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'

import {

  AdminListingGrid,

  AdminListingStickyHeader,

  AdminListingTable,

  AdminListingToolbar,

} from '@/pages/admin/components/listing'

import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'

import { reconciliationService } from '@/shared/services/reconciliationService'

import type {
  ReconciliationClaimSheetRow,
  ReconciliationFilters,
  ReconciliationItem,
  ReconciliationPaymentEntryRow,
  ReconciliationTab,
} from '@/shared/types/reconciliation'

import { ReconciliationAdvancedFilterFields } from '../components/ReconciliationAdvancedFilters'

import { ReconciliationBulkModal } from '../components/ReconciliationBulkModal'

import { ReconciliationClaimSheetDetailDrawer } from '../components/ReconciliationClaimSheetDetailDrawer'

import {

  buildReconciliationClaimSheetTableColumns,

  type ReconciliationClaimSheetAction,

} from '../components/ReconciliationClaimSheetTableColumns'

import { ReconciliationPaymentEntryDetailDrawer } from '../components/ReconciliationPaymentEntryDetailDrawer'
import {
  buildReconciliationPaymentEntryTableColumns,
  type ReconciliationPaymentEntryAction,
} from '../components/ReconciliationPaymentEntryTableColumns'
import { ReconciliationDetailDrawer } from '../components/ReconciliationDetailDrawer'

import { ReconciliationKpiRow } from '../components/ReconciliationKpiRow'

import {

  buildReconciliationColumns,

  mapReconciliationRowsToGridItems,

} from '../components/ReconciliationTableColumns'

import {

  RECONCILIATION_LISTING_TABS,

  RECONCILIATION_STATUS_TABS,

  type ReconciliationStatusTab,

} from '../config/reconciliationListingConfig'

import {

  computeClaimSheetReconciliationKpis,

  downloadClaimSheetReconciliationCsv,

  getClaimSheetReconciliationEmptyState,

  getReconciliationClaimSheetCellValue,

  mapClaimSheetRowsToGridItems,

  matchesReconciliationClaimSheetSearch,

} from '../utils/reconciliationClaimSheetListingUtils'

import {
  computePaymentEntryReconciliationKpis,
  downloadPaymentEntryReconciliationCsv,
  getPaymentEntryReconciliationEmptyState,
  getReconciliationPaymentEntryCellValue,
  mapPaymentEntryRowsToGridItems,
  matchesReconciliationPaymentEntrySearch,
} from '../utils/reconciliationPaymentEntryListingUtils'

import {
  EMPTY_RECONCILIATION_FILTERS,

  computeReconciliationKpis,

  downloadReconciliationCsv,

  getReconciliationCellValue,

  getReconciliationEmptyState,

  getReconciliationPeriodLabel,

  hasReconciliationFiltersActive,

  matchesReconciliationSearch,

} from '../utils/reconciliationListingUtils'



const TAB_VALUES = RECONCILIATION_LISTING_TABS.map(tab => tab.value) as readonly ReconciliationTab[]

const STATUS_TAB_VALUES = RECONCILIATION_STATUS_TABS.map(

  tab => tab.value,

) as readonly ReconciliationStatusTab[]



const DEFAULT_CATEGORY_TAB: ReconciliationTab = 'insurance'

const DEFAULT_STATUS_TAB: ReconciliationStatusTab = 'pending'



function readCategoryTab(searchParams: URLSearchParams): ReconciliationTab {

  const raw = searchParams.get('tab')

  return raw != null && (TAB_VALUES as readonly string[]).includes(raw)

    ? (raw as ReconciliationTab)

    : DEFAULT_CATEGORY_TAB

}



function readStatusTab(searchParams: URLSearchParams): ReconciliationStatusTab {

  const raw = searchParams.get('status')

  return raw != null && (STATUS_TAB_VALUES as readonly string[]).includes(raw)

    ? (raw as ReconciliationStatusTab)

    : DEFAULT_STATUS_TAB

}



function applyReconciliationSearchParams(

  prev: URLSearchParams,

  categoryTab: ReconciliationTab,

  statusTabValue: ReconciliationStatusTab,

): URLSearchParams {

  const next = new URLSearchParams(prev)

  if (categoryTab === DEFAULT_CATEGORY_TAB) {

    next.delete('tab')

  } else {

    next.set('tab', categoryTab)

  }

  if (statusTabValue === DEFAULT_STATUS_TAB) {

    next.delete('status')

  } else {

    next.set('status', statusTabValue)

  }

  return next

}



function claimSheetRowsToBulkItems(rows: ReconciliationClaimSheetRow[]): ReconciliationItem[] {

  return rows.map(row => ({

    id: row.id,

    sourceKind: 'claim_sheet',

    sourceId: row.sheetId,

    tab: 'approved_claim_sheet',

    status: row.status,

    refNo: row.sheet.claimNumber,

    claimNumber: row.sheet.claimNumber,

  })) as ReconciliationItem[]

}



function paymentEntryRowsToBulkItems(rows: ReconciliationPaymentEntryRow[]): ReconciliationItem[] {
  return rows.map(row => ({
    id: row.id,
    sourceKind: 'payment_entry',
    sourceId: row.paymentEntryId,
    tab: 'mode_of_payment',
    status: row.status,
    refNo: row.refNo,
    passengerName: row.passengerName,
  })) as ReconciliationItem[]
}

export function ReconciliationListingPage() {

  const theme = useTheme()

  const { showToast } = useToast()

  const [searchParams, setSearchParams] = useSearchParams()

  const [activeTab, setActiveTab] = useState<ReconciliationTab>(() => readCategoryTab(searchParams))

  const [statusTab, setStatusTab] = useState<ReconciliationStatusTab>(() =>

    readStatusTab(searchParams),

  )



  useEffect(() => {

    setActiveTab(readCategoryTab(searchParams))

    setStatusTab(readStatusTab(searchParams))

  }, [searchParams])



  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const [filters, setFilters] = useState<ReconciliationFilters>(EMPTY_RECONCILIATION_FILTERS)

  const [selectedItem, setSelectedItem] = useState<ReconciliationItem | null>(null)

  const [selectedClaimSheetRow, setSelectedClaimSheetRow] =
    useState<ReconciliationClaimSheetRow | null>(null)
  const [selectedPaymentEntryRow, setSelectedPaymentEntryRow] =
    useState<ReconciliationPaymentEntryRow | null>(null)

  const [bulkItems, setBulkItems] = useState<ReconciliationItem[] | null>(null)

  const [refreshKey, setRefreshKey] = useState(0)



  const isClaimSheetsTab = activeTab === 'approved_claim_sheet'
  const isPaymentTab = activeTab === 'mode_of_payment'
  const isDedicatedTab = isClaimSheetsTab || isPaymentTab



  const categoryFilters = useMemo(

    (): ReconciliationFilters => ({ ...filters, status: '' }),

    [filters],

  )



  const allClaimSheetRows = useMemo(() => {

    if (!isClaimSheetsTab) return [] as ReconciliationClaimSheetRow[]

    void refreshKey

    return reconciliationService.listClaimSheets(categoryFilters)

  }, [isClaimSheetsTab, categoryFilters, refreshKey])



  const claimSheetTabRows = useMemo(
    () => allClaimSheetRows.filter(row => row.status === statusTab),
    [allClaimSheetRows, statusTab],
  )

  const allPaymentEntryRows = useMemo(() => {
    if (!isPaymentTab) return [] as ReconciliationPaymentEntryRow[]
    void refreshKey
    return reconciliationService.listPaymentEntries(categoryFilters)
  }, [isPaymentTab, categoryFilters, refreshKey])

  const paymentEntryTabRows = useMemo(
    () => allPaymentEntryRows.filter(row => row.status === statusTab),
    [allPaymentEntryRows, statusTab],
  )

  const allCategoryRows = useMemo(() => {
    if (isDedicatedTab) return [] as ReconciliationItem[]

    return reconciliationService.list(activeTab, categoryFilters)

  }, [activeTab, categoryFilters, isDedicatedTab, refreshKey])



  const tabRows = useMemo(

    () => allCategoryRows.filter(row => row.status === statusTab),

    [allCategoryRows, statusTab],

  )



  const expenseListing = useCustomerListing({

    rows: tabRows,

    getCellValue: getReconciliationCellValue,

    searchMatch: matchesReconciliationSearch,

    initialPageSize: 10,

  })



  const claimSheetListing = useCustomerListing({
    rows: claimSheetTabRows,
    getCellValue: getReconciliationClaimSheetCellValue,
    searchMatch: matchesReconciliationClaimSheetSearch,
    initialPageSize: 10,
  })

  const paymentEntryListing = useCustomerListing({
    rows: paymentEntryTabRows,
    getCellValue: getReconciliationPaymentEntryCellValue,
    searchMatch: matchesReconciliationPaymentEntrySearch,
    initialPageSize: 10,
  })

  const listing = isClaimSheetsTab
    ? claimSheetListing
    : isPaymentTab
      ? paymentEntryListing
      : expenseListing



  const kpis = useMemo(
    () =>
      isClaimSheetsTab
        ? computeClaimSheetReconciliationKpis(allClaimSheetRows)
        : isPaymentTab
          ? computePaymentEntryReconciliationKpis(allPaymentEntryRows)
          : computeReconciliationKpis(allCategoryRows),
    [allClaimSheetRows, allCategoryRows, allPaymentEntryRows, isClaimSheetsTab, isPaymentTab],
  )



  const handleClaimSheetAction = useCallback(
    (_action: ReconciliationClaimSheetAction, row: ReconciliationClaimSheetRow) => {
      setSelectedClaimSheetRow(row)
    },
    [],
  )



  const handlePaymentEntryAction = useCallback(
    (_action: ReconciliationPaymentEntryAction, row: ReconciliationPaymentEntryRow) => {
      setSelectedPaymentEntryRow(row)
    },
    [],
  )

  const claimSheetColumns = useMemo(
    () => buildReconciliationClaimSheetTableColumns({ onAction: handleClaimSheetAction }),
    [handleClaimSheetAction],
  )
  const paymentEntryColumns = useMemo(
    () => buildReconciliationPaymentEntryTableColumns({ onAction: handlePaymentEntryAction }),
    [handlePaymentEntryAction],
  )
  const expenseColumns = useMemo(
    () => buildReconciliationColumns(activeTab, { onOpen: setSelectedItem }),
    [activeTab],
  )

  const columns = isClaimSheetsTab
    ? claimSheetColumns
    : isPaymentTab
      ? paymentEntryColumns
      : expenseColumns



  const toolbarColumns = useMemo(

    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),

    [columns],

  )



  const emptyState = useMemo(
    () =>
      isClaimSheetsTab
        ? getClaimSheetReconciliationEmptyState(
            Boolean(listing.tableState.searchQuery.trim()),
            statusTab,
          )
        : isPaymentTab
          ? getPaymentEntryReconciliationEmptyState(
              Boolean(listing.tableState.searchQuery.trim()),
              statusTab,
            )
          : getReconciliationEmptyState(
              activeTab,
              Boolean(listing.tableState.searchQuery.trim()),
              statusTab,
            ),
    [activeTab, isClaimSheetsTab, isPaymentTab, listing.tableState.searchQuery, statusTab],
  )



  const gridItems = useMemo(
    () =>
      isClaimSheetsTab
        ? mapClaimSheetRowsToGridItems(claimSheetListing.paginatedRows)
        : isPaymentTab
          ? mapPaymentEntryRowsToGridItems(paymentEntryListing.paginatedRows)
          : mapReconciliationRowsToGridItems(expenseListing.paginatedRows),
    [
      claimSheetListing.paginatedRows,
      expenseListing.paginatedRows,
      isClaimSheetsTab,
      isPaymentTab,
      paymentEntryListing.paginatedRows,
    ],
  )



  const selectedRows = useMemo(

    () => listing.filterSourceRows.filter(row => listing.tableState.selectedRows.includes(row.id)),

    [listing.filterSourceRows, listing.tableState.selectedRows],

  )



  const isPendingStatus = statusTab === 'pending'



  const bulkActions = useMemo<BulkAction[]>(

    () =>

      isPendingStatus

        ? [

            {

              label: 'Reconcile',

              onClick: rows => {
                if (isClaimSheetsTab) {
                  const pending = (rows as ReconciliationClaimSheetRow[]).filter(
                    row => row.status === 'pending',
                  )
                  if (pending.length === 0) {
                    showToast({
                      title: 'Nothing to reconcile',
                      description: 'Selected claim sheets are already submitted.',
                      variant: 'warning',
                    })
                    return
                  }
                  setBulkItems(claimSheetRowsToBulkItems(pending))
                  return
                }

                if (isPaymentTab) {
                  const pending = (rows as ReconciliationPaymentEntryRow[]).filter(
                    row => row.status === 'pending',
                  )
                  if (pending.length === 0) {
                    showToast({
                      title: 'Nothing to reconcile',
                      description: 'Selected payment entries are already submitted.',
                      variant: 'warning',
                    })
                    return
                  }
                  setBulkItems(paymentEntryRowsToBulkItems(pending))
                  return
                }



                const pending = (rows as ReconciliationItem[]).filter(row => row.status === 'pending')

                if (pending.length === 0) {

                  showToast({

                    title: 'Nothing to reconcile',

                    description: 'Selected rows are already submitted. Choose pending records.',

                    variant: 'warning',

                  })

                  return

                }

                setBulkItems(pending)

              },

            },

          ]

        : [],

    [isClaimSheetsTab, isPaymentTab, isPendingStatus, showToast],

  )



  const handleExport = useCallback(() => {
    if (isClaimSheetsTab) {
      downloadClaimSheetReconciliationCsv(claimSheetListing.filterSourceRows)
      showToast({
        title: 'Export started',
        description: 'Your claim sheet export will download shortly.',
        variant: 'success',
      })
      return
    }

    if (isPaymentTab) {
      downloadPaymentEntryReconciliationCsv(paymentEntryListing.filterSourceRows)
      showToast({
        title: 'Export started',
        description: 'Your payment entry export will download shortly.',
        variant: 'success',
      })
      return
    }

    downloadReconciliationCsv(expenseListing.filterSourceRows, activeTab)

    showToast({

      title: 'Export started',

      description: 'Your reconciliation export will download shortly.',

      variant: 'success',

    })

  }, [
    activeTab,
    claimSheetListing.filterSourceRows,
    expenseListing.filterSourceRows,
    isClaimSheetsTab,
    isPaymentTab,
    paymentEntryListing.filterSourceRows,
    showToast,
  ])



  const handleStatusTabChange = useCallback(

    (next: ReconciliationStatusTab) => {

      setStatusTab(next)

      setSearchParams(prev => applyReconciliationSearchParams(prev, activeTab, next), {

        replace: true,

      })

      setSelectedItem(null)
      setSelectedClaimSheetRow(null)
      setSelectedPaymentEntryRow(null)

      setBulkItems(null)

      listing.setTableState(state => ({ ...state, page: 0, selectedRows: [] }))

    },

    [activeTab, listing, setSearchParams],

  )



  const handleTabChange = useCallback(

    (tab: ReconciliationTab) => {

      setActiveTab(tab)

      setStatusTab(DEFAULT_STATUS_TAB)

      setSearchParams(

        prev => applyReconciliationSearchParams(prev, tab, DEFAULT_STATUS_TAB),

        { replace: true },

      )

      setViewMode('table')

      setSelectedItem(null)
      setSelectedClaimSheetRow(null)
      setSelectedPaymentEntryRow(null)

      setBulkItems(null)

      listing.setTableState(state => ({ ...state, page: 0, selectedRows: [] }))

      if (tab !== 'mode_of_payment' && filters.paymentMode) {

        setFilters(current => ({ ...current, paymentMode: '' }))

      }

    },

    [filters.paymentMode, listing, setSearchParams],

  )



  const refreshAfterAction = useCallback(

    (nextStatus: ReconciliationStatusTab) => {

      listing.setTableState(state => ({ ...state, selectedRows: [] }))

      setRefreshKey(key => key + 1)

      setStatusTab(nextStatus)

      setSearchParams(prev => applyReconciliationSearchParams(prev, activeTab, nextStatus), {

        replace: true,

      })

    },

    [activeTab, listing, setSearchParams],

  )



  const handleBulkConfirm = useCallback(
    (bookEntryNumber: string) => {
      if (!bulkItems?.length) return
      const result = reconciliationService.submitMany(
        bulkItems.map(item => item.id),
        bookEntryNumber,
      )

      if (!result.ok) {

        showToast({

          title: 'Could not reconcile',

          description: result.error,

          variant: 'error',

        })

        return

      }

      showToast({

        title: 'Bulk reconciliation submitted',

        description: `${result.submitted} record${result.submitted === 1 ? '' : 's'} updated.`,

        variant: 'success',

      })

      setBulkItems(null)

      refreshAfterAction('submitted')

    },

    [bulkItems, refreshAfterAction, showToast],

  )



  const footerBg =

    theme.palette.mode === 'dark'

      ? alpha(theme.palette.common.white, 0.04)

      : alpha(theme.palette.common.black, 0.02)



  return (

    <>

      <AdminListingShell

        stickyPageHeader={

          <AdminListingStickyHeader

            title="Reconciliation"

            description={`Daily finance reconciliation from expenses and approved claim sheets · Period: ${getReconciliationPeriodLabel(filters)}`}

          />

        }

        kpis={

          <ReconciliationKpiRow

            total={kpis.total}

            pending={kpis.pending}

            submitted={kpis.submitted}

            rejected={kpis.rejected}

            totalAmount={kpis.totalAmount}

          />

        }

        tabs={RECONCILIATION_LISTING_TABS}

        tabValue={activeTab}

        onTabChange={value => handleTabChange(value as ReconciliationTab)}

        toolbar={

          <Stack spacing={1.25}>

            <Box

              sx={{

                mx: -2,

                px: 2,

                borderBottom: 1,

                borderColor: 'divider',

              }}

            >

              <Tabs

                value={statusTab}

                onChange={value => handleStatusTabChange(value as ReconciliationStatusTab)}

                variant="underline"

                size="sm"

                scrollable

                items={RECONCILIATION_STATUS_TABS.map(tab => ({

                  value: tab.value,

                  label: `${tab.label} (${

                    tab.value === 'pending'

                      ? kpis.pending

                      : tab.value === 'submitted'

                        ? kpis.submitted

                        : kpis.rejected

                  })`,

                }))}

                sx={{ mb: 0, minHeight: 40 }}

              />

            </Box>

            <AdminListingToolbar

              searchValue={listing.tableState.searchQuery}

              onSearch={listing.handleSearch}

              searchPlaceholder={
                isClaimSheetsTab
                  ? 'Search claim number, team, passenger, or book entry…'
                  : isPaymentTab
                    ? 'Search ref, passenger, client, services, or payment reference…'
                    : 'Search ref, passenger, client, vendor, or book entry…'
              }

              onExport={handleExport}

              viewMode={viewMode}

              onViewModeChange={setViewMode}

              columns={toolbarColumns}

              hiddenColumnKeys={listing.tableState.hiddenColumnKeys}

              onHiddenColumnKeysChange={keys =>

                listing.setTableState(state => ({ ...state, hiddenColumnKeys: keys }))

              }

              filterPopover={{

                active: hasReconciliationFiltersActive(filters, activeTab),

                value: filters,

                onApply: next => {

                  setFilters({ ...next, status: '' })

                  listing.setTableState(state => ({ ...state, page: 0, selectedRows: [] }))

                },

                onClear: () => {

                  setFilters(EMPTY_RECONCILIATION_FILTERS)

                  listing.setTableState(state => ({ ...state, page: 0, selectedRows: [] }))

                },

                hasActive: value => hasReconciliationFiltersActive(value, activeTab),

                width: 'wide',

                children: (draft, patch) => (

                  <ReconciliationAdvancedFilterFields draft={draft} patch={patch} tab={activeTab} />

                ),

              }}

            />

          </Stack>

        }

        listingContent={

          viewMode === 'table' ? (

            <Stack spacing={0}>

              {isPendingStatus && listing.tableState.selectedRows.length > 0 ? (

                <BulkActions

                  selectedRows={selectedRows}

                  actions={bulkActions}

                  onAction={(action, rows) => action.onClick(rows)}

                  onDeselectAll={() =>

                    listing.setTableState(state => ({ ...state, selectedRows: [] }))

                  }

                />

              ) : null}

              {isClaimSheetsTab ? (
                <AdminListingTable
                  columns={claimSheetColumns}
                  data={claimSheetListing.paginatedRows}
                  filterSourceData={claimSheetListing.filterSourceRows}
                  rowKey="id"
                  state={claimSheetListing.tableState}
                  onStateChange={claimSheetListing.setTableState}
                  columnFilters={claimSheetListing.columnFilters}
                  onColumnFiltersChange={claimSheetListing.setColumnFilters}
                  getCellValue={getReconciliationClaimSheetCellValue}
                  onRowClick={row => setSelectedClaimSheetRow(row)}
                  bulkActions={isPendingStatus ? bulkActions : undefined}
                  stickyHeader
                  emptyTitle={emptyState.title}
                  emptyDescription={emptyState.description}
                />
              ) : isPaymentTab ? (
                <AdminListingTable
                  columns={paymentEntryColumns}
                  data={paymentEntryListing.paginatedRows}
                  filterSourceData={paymentEntryListing.filterSourceRows}
                  rowKey="id"
                  state={paymentEntryListing.tableState}
                  onStateChange={paymentEntryListing.setTableState}
                  columnFilters={paymentEntryListing.columnFilters}
                  onColumnFiltersChange={paymentEntryListing.setColumnFilters}
                  getCellValue={getReconciliationPaymentEntryCellValue}
                  onRowClick={row => setSelectedPaymentEntryRow(row)}
                  bulkActions={isPendingStatus ? bulkActions : undefined}
                  stickyHeader
                  emptyTitle={emptyState.title}
                  emptyDescription={emptyState.description}
                />
              ) : (
                <AdminListingTable
                  columns={expenseColumns}
                  data={expenseListing.paginatedRows}
                  filterSourceData={expenseListing.filterSourceRows}
                  rowKey="id"
                  state={expenseListing.tableState}
                  onStateChange={expenseListing.setTableState}
                  columnFilters={expenseListing.columnFilters}
                  onColumnFiltersChange={expenseListing.setColumnFilters}
                  getCellValue={getReconciliationCellValue}
                  onRowClick={row => setSelectedItem(row)}
                  bulkActions={isPendingStatus ? bulkActions : undefined}
                  stickyHeader
                  emptyTitle={emptyState.title}
                  emptyDescription={emptyState.description}
                />
              )}

            </Stack>

          ) : (

            <AdminListingGrid

              items={gridItems}

              onItemClick={id => {
                if (isClaimSheetsTab) {
                  const row = claimSheetListing.paginatedRows.find(item => item.id === id)
                  if (row) setSelectedClaimSheetRow(row)
                  return
                }

                if (isPaymentTab) {
                  const row = paymentEntryListing.paginatedRows.find(item => item.id === id)
                  if (row) setSelectedPaymentEntryRow(row)
                  return
                }

                const row = expenseListing.paginatedRows.find(item => item.id === id)
                if (row) setSelectedItem(row)
              }}

            />

          )

        }

        footer={

          <Box sx={{ bgcolor: footerBg }}>

            <Pagination

              page={listing.tableState.page}

              pageSize={listing.tableState.pageSize}

              total={listing.total}

              onPage={page => listing.setTableState(state => ({ ...state, page }))}

              onPageSize={pageSize =>

                listing.setTableState(state => ({ ...state, pageSize, page: 0 }))

              }

            />

          </Box>

        }

      />



      <ReconciliationClaimSheetDetailDrawer

        open={Boolean(selectedClaimSheetRow)}

        row={selectedClaimSheetRow}

        onClose={() => setSelectedClaimSheetRow(null)}

        onSubmitted={() => refreshAfterAction('submitted')}

        onRejected={() => refreshAfterAction('rejected')}

      />



      <ReconciliationPaymentEntryDetailDrawer
        open={Boolean(selectedPaymentEntryRow)}
        row={selectedPaymentEntryRow}
        onClose={() => setSelectedPaymentEntryRow(null)}
        onSubmitted={() => refreshAfterAction('submitted')}
        onRejected={() => refreshAfterAction('rejected')}
      />

      <ReconciliationDetailDrawer
        open={Boolean(selectedItem) && !isDedicatedTab}

        item={selectedItem}

        onClose={() => setSelectedItem(null)}

        onSubmitted={() => refreshAfterAction('submitted')}

        onRejected={() => refreshAfterAction('rejected')}

      />



      <ReconciliationBulkModal
        open={Boolean(bulkItems?.length)}
        items={bulkItems ?? []}
        onClose={() => setBulkItems(null)}
        onConfirm={handleBulkConfirm}
      />

    </>

  )

}


