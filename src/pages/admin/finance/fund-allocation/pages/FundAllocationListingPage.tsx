import { useCallback, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { Wallet } from 'lucide-react'
import { BulkActions, ConfirmDialog, Pagination, type TableState, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import { groundOpsClaimSheetService } from '@/shared/services/groundOpsClaimSheetService'
import type { FundAllocationListingTab } from '@/shared/types/fundAllocation'
import type { FundAllocationPassengerRow } from '@/shared/types/fundAllocation'
import type { GroundOpsClaimSheet } from '@/shared/types/groundOpsClaimSheet'
import {
  FundAllocationActionModal,
  type FundAllocationActionPayload,
} from '../components/FundAllocationActionModal'
import {
  FundAllocationBulkActionModal,
  type FundAllocationBulkConfirmPayload,
} from '../components/FundAllocationBulkActionModal'
import {
  FundAllocationAdvancedFilterFields,
  hasFundAllocationFiltersActive,
} from '../components/FundAllocationAdvancedFilters'
import { FundAllocationDetailDrawer } from '../components/FundAllocationDetailDrawer'
import { FundAllocationBatchDetailDrawer } from '../components/FundAllocationBatchDetailDrawer'
import { FundAllocationClaimSheetDetailDrawer } from '../components/FundAllocationClaimSheetDetailDrawer'
import { FundAllocationKpiRow } from '../components/FundAllocationKpiRow'
import {
  buildFundAllocationTableColumns,
  type FundAllocationAdminAction,
} from '../components/FundAllocationTableColumns'
import {
  buildFundAllocationBatchTableColumns,
  type FundAllocationBatchAction,
} from '../components/FundAllocationBatchTableColumns'
import {
  buildFundAllocationClaimSheetTableColumns,
  type FundAllocationClaimSheetAction,
} from '../components/FundAllocationClaimSheetTableColumns'
import { FUND_ALLOCATION_LISTING_TABS } from '../config/fundAllocationListingTabs'
import { useFundAllocationListing } from '../hooks/useFundAllocationListing'
import {
  computeFundAllocationKpis,
  downloadFundAllocationClaimSheetsCsv,
  downloadFundAllocationCsv,
  getFundAllocationCellValue,
  getFundAllocationClaimSheetCellValue,
  getFundAllocationCountryKey,
  getFundAllocationAssigneeKey,
  getFundAllocationFilterOptions,
  getFundAllocationTabEmptyState,
  sanitizeFundAllocationSelection,
} from '../utils/fundAllocationListingUtils'
import { computePassengerRequestedBulkAllocationInput, computeRequestedBulkSummary } from '../utils/fundAllocationBulkUtils'
import { customerSegmentDisplayLabel } from '../config/fundAllocationStatusConfig'
import { getFundAllocationBatchCellValue } from '@/shared/utils/fundAllocationBatchUtils'
import type { FundAllocationBatchRow } from '@/shared/types/fundAllocation'

export function FundAllocationListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [actionModalRecord, setActionModalRecord] = useState<FundAllocationPassengerRow | null>(null)
  const [bulkModalRecords, setBulkModalRecords] = useState<FundAllocationPassengerRow[]>([])
  const [claimReviewConfirm, setClaimReviewConfirm] = useState<{
    action: 'approve' | 'reject'
    sheet: GroundOpsClaimSheet
  } | null>(null)

  const {
    listingTab,
    queueFilters,
    setQueueFilters,
    tableState,
    setTableState,
    columnFilters,
    setColumnFilters,
    allRows,
    filterSourceRows,
    paginatedRows,
    total,
    selectedPassenger,
    filterSourceBatches,
    paginatedBatches,
    totalBatches,
    selectedBatch,
    filterSourceClaimSheets,
    paginatedClaimSheets,
    totalClaimSheets,
    selectedClaimSheet,
    searchValue,
    handleListingTabChange,
    handleSearch,
    clearFilters,
    selectPassenger,
    selectBatch,
    selectClaimSheet,
    closeDetail,
    refresh,
    mutateAndRefresh,
  } = useFundAllocationListing()

  const filterOptions = useMemo(() => getFundAllocationFilterOptions(allRows), [allRows])
  const emptyState = useMemo(() => getFundAllocationTabEmptyState(listingTab), [listingTab])
  const kpis = useMemo(() => computeFundAllocationKpis(allRows), [allRows])

  const selectedRows = useMemo(
    () => filterSourceRows.filter(row => tableState.selectedRows.includes(row.id)),
    [filterSourceRows, tableState.selectedRows],
  )

  const isAllocatedTab = listingTab === 'allocated'
  const isClaimSheetsTab = listingTab === 'claim_sheets'

  const hasActiveFilters = Boolean(
    queueFilters.customerSegment ||
      queueFilters.country ||
      queueFilters.visaType ||
      queueFilters.jurisdiction ||
      queueFilters.assignedTeam ||
      queueFilters.assignedUser ||
      queueFilters.dateFrom ||
      queueFilters.dateTo ||
      searchValue ||
      Object.values(columnFilters).some(values => values.length > 0) ||
      tableState.sortKey,
  )

  const handleTableStateChange = useCallback(
    (next: TableState) => {
      if (isClaimSheetsTab || isAllocatedTab) {
        setTableState({ ...next, selectedRows: [] })
        return
      }
      const { ids, rejected, reason } = sanitizeFundAllocationSelection(
        filterSourceRows,
        next.selectedRows,
        tableState.selectedRows,
      )
      if (rejected) {
        if (reason === 'assignee') {
          showToast({
            title: 'Different user',
            description: 'Bulk allocation is only allowed for passengers assigned to the same user.',
            variant: 'warning',
          })
        } else {
          showToast({
            title: 'Different country',
            description: 'Bulk allocation is only allowed for passengers in the same country.',
            variant: 'warning',
          })
        }
      }
      setTableState({ ...next, selectedRows: ids })
    },
    [
      filterSourceRows,
      isAllocatedTab,
      isClaimSheetsTab,
      setTableState,
      showToast,
      tableState.selectedRows,
    ],
  )

  const openBulkAllocate = useCallback(
    (rows: FundAllocationPassengerRow[]) => {
      if (rows.length === 0) {
        showToast({
          title: 'Select passengers',
          description: 'Select at least one passenger to allocate funds.',
          variant: 'warning',
        })
        return
      }
      const eligible = rows.filter(row => row.fundRequested && row.totalAmount > 0)
      if (eligible.length === 0) {
        showToast({
          title: 'No fund requests',
          description: 'Selected passengers do not have fund requests from Assignment & Priority.',
          variant: 'warning',
        })
        return
      }
      if (eligible.length !== rows.length) {
        showToast({
          title: 'Some passengers skipped',
          description: 'Only passengers with fund requests will be included in bulk allocation.',
          variant: 'warning',
        })
      }
      const countries = new Set(eligible.map(getFundAllocationCountryKey))
      if (countries.size > 1) {
        showToast({
          title: 'Different country',
          description: 'Bulk allocation is only allowed for passengers in the same country.',
          variant: 'warning',
        })
        return
      }
      const assignees = new Set(eligible.map(getFundAllocationAssigneeKey))
      if (assignees.size > 1) {
        showToast({
          title: 'Different user',
          description: 'Bulk allocation is only allowed for passengers assigned to the same user. Filter by team/user first.',
          variant: 'warning',
        })
        return
      }
      setBulkModalRecords(eligible)
    },
    [showToast],
  )

  const handleAction = useCallback(
    (action: FundAllocationAdminAction, row: FundAllocationPassengerRow) => {
      if (action === 'view_details') {
        selectPassenger(row)
        return
      }
      if (!row.fundRequested || row.totalAmount <= 0) {
        showToast({
          title: 'No fund request',
          description: 'Request funds from Assignment & Priority before allocating.',
          variant: 'warning',
        })
        return
      }
      setActionModalRecord(row)
    },
    [selectPassenger, showToast],
  )

  const handleBatchAction = useCallback(
    (action: FundAllocationBatchAction, row: FundAllocationBatchRow) => {
      if (action === 'view_details') {
        selectBatch(row)
      }
    },
    [selectBatch],
  )

  const handleClaimSheetAction = useCallback(
    (action: FundAllocationClaimSheetAction, row: GroundOpsClaimSheet) => {
      if (action === 'view_details') {
        selectClaimSheet(row)
        return
      }
      setClaimReviewConfirm({ action, sheet: row })
    },
    [selectClaimSheet],
  )

  const handleConfirmClaimReview = useCallback(() => {
    if (!claimReviewConfirm) return

    const { action, sheet } = claimReviewConfirm
    const result =
      action === 'approve'
        ? groundOpsClaimSheetService.approve(sheet.id)
        : groundOpsClaimSheetService.reject(sheet.id)

    if (!result.ok || !result.sheet) {
      showToast({
        title: action === 'approve' ? 'Could not approve' : 'Could not reject',
        description: result.error,
        variant: 'error',
      })
      setClaimReviewConfirm(null)
      return
    }

    showToast({
      title: action === 'approve' ? 'Claim sheet approved' : 'Claim sheet rejected',
      description:
        action === 'approve'
          ? `${result.sheet.claimNumber} is approved for settlement.`
          : `${result.sheet.claimNumber} was rejected.`,
      variant: action === 'approve' ? 'success' : 'warning',
    })
    setClaimReviewConfirm(null)
    closeDetail()
    refresh()
  }, [claimReviewConfirm, closeDetail, refresh, showToast])

  const passengerColumns = useMemo(
    () =>
      buildFundAllocationTableColumns({
        listingTab: listingTab === 'allocated' ? 'allocated' : 'pending_allocation',
        onAction: handleAction,
      }),
    [handleAction, listingTab],
  )

  const batchColumns = useMemo(
    () => buildFundAllocationBatchTableColumns({ onAction: handleBatchAction }),
    [handleBatchAction],
  )

  const claimSheetColumns = useMemo(
    () => buildFundAllocationClaimSheetTableColumns({ onAction: handleClaimSheetAction }),
    [handleClaimSheetAction],
  )

  const columns = isClaimSheetsTab
    ? claimSheetColumns
    : isAllocatedTab
      ? batchColumns
      : passengerColumns

  const bulkActions = useMemo(() => {
    if (listingTab !== 'pending_allocation') return undefined
    return [
      {
        label: 'Allocate funds',
        icon: <Wallet size={14} />,
        onClick: (rows: FundAllocationPassengerRow[]) => openBulkAllocate(rows),
      },
    ]
  }, [listingTab, openBulkAllocate])

  const allocatedTable = (
    <AdminListingTable
      columns={batchColumns}
      data={paginatedBatches}
      filterSourceData={filterSourceBatches}
      rowKey="id"
      state={tableState}
      onStateChange={handleTableStateChange}
      columnFilters={columnFilters}
      onColumnFiltersChange={setColumnFilters}
      getCellValue={getFundAllocationBatchCellValue}
      onRowClick={selectBatch}
      stickyHeader
      emptyTitle={emptyState.title}
      emptyDescription={emptyState.description}
    />
  )

  const pendingTable = (
    <AdminListingTable
      columns={passengerColumns}
      data={paginatedRows}
      filterSourceData={filterSourceRows}
      rowKey="id"
      state={tableState}
      onStateChange={handleTableStateChange}
      columnFilters={columnFilters}
      onColumnFiltersChange={setColumnFilters}
      getCellValue={getFundAllocationCellValue}
      onRowClick={selectPassenger}
      bulkActions={bulkActions}
      stickyHeader
      emptyTitle={emptyState.title}
      emptyDescription={emptyState.description}
    />
  )

  const claimSheetsTable = (
    <AdminListingTable
      columns={claimSheetColumns}
      data={paginatedClaimSheets}
      filterSourceData={filterSourceClaimSheets}
      rowKey="id"
      state={tableState}
      onStateChange={handleTableStateChange}
      columnFilters={columnFilters}
      onColumnFiltersChange={setColumnFilters}
      getCellValue={getFundAllocationClaimSheetCellValue}
      onRowClick={selectClaimSheet}
      stickyHeader
      emptyTitle={emptyState.title}
      emptyDescription={emptyState.description}
    />
  )

  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleExport = useCallback(() => {
    if (isClaimSheetsTab) {
      downloadFundAllocationClaimSheetsCsv(filterSourceClaimSheets)
      showToast({
        title: 'Export started',
        description: 'Your claim sheet export will download shortly.',
        variant: 'success',
      })
      return
    }
    if (isAllocatedTab) {
      downloadFundAllocationCsv(filterSourceBatches.flatMap(batch => batch.passengers))
    } else {
      downloadFundAllocationCsv(filterSourceRows)
    }
    showToast({
      title: 'Export started',
      description: 'Your fund allocation export will download shortly.',
      variant: 'success',
    })
  }, [
    filterSourceBatches,
    filterSourceClaimSheets,
    filterSourceRows,
    isAllocatedTab,
    isClaimSheetsTab,
    showToast,
  ])

  const gridItems = useMemo(() => {
    if (isClaimSheetsTab) {
      return paginatedClaimSheets.map(sheet => ({
        id: sheet.id,
        title: sheet.claimNumber,
        subtitle: `${sheet.generatedBy} · ${sheet.team || '—'}`,
        meta: `${sheet.cases.length} case${sheet.cases.length === 1 ? '' : 's'}`,
        status: sheet.status,
      }))
    }

    if (isAllocatedTab) {
      return paginatedBatches.map(batch => ({
        id: batch.id,
        title: batch.passengerLabel,
        subtitle: `${batch.country} • ${batch.visaType}`,
        meta: `${batch.passengerCount} passenger${batch.passengerCount === 1 ? '' : 's'} · ${batch.gltsApplicationId}`,
        status: 'allocated',
      }))
    }

    return paginatedRows.map(row => ({
      id: row.id,
      title: row.passengerName,
      subtitle: `${row.country} • ${row.visaType}`,
      meta: `${customerSegmentDisplayLabel(row.customerSegment)} · ${row.gltsApplicationId}`,
      status: row.allocationStatus,
    }))
  }, [
    isAllocatedTab,
    isClaimSheetsTab,
    paginatedBatches,
    paginatedClaimSheets,
    paginatedRows,
  ])

  const handleAllocate = useCallback(
    (payload: FundAllocationActionPayload) => {
      const id = actionModalRecord?.id
      if (!id) return

      mutateAndRefresh(() => {
        fundAllocationService.allocateFunds(id, payload)
      })

      setActionModalRecord(null)
      showToast({
        title: 'Funds allocated',
        description: 'Amount and fund transfer synced to Ground Operations.',
        variant: 'success',
      })
    },
    [actionModalRecord, mutateAndRefresh, showToast],
  )

  const handleBulkAllocate = useCallback(
    (records: FundAllocationPassengerRow[], payload: FundAllocationBulkConfirmPayload) => {
      const summary = computeRequestedBulkSummary(records)
      mutateAndRefresh(() => {
        fundAllocationService.allocateFundsBulk(records.map(record => record.id), record =>
          computePassengerRequestedBulkAllocationInput(record, {
            fundTransfer: payload.fundTransfer,
            notes: payload.notes,
            allocatedAmount: payload.allocatedAmount,
            grandTotal: summary.grandTotal,
          }),
        )
      })

      setBulkModalRecords([])
      setTableState(state => ({ ...state, selectedRows: [] }))
      showToast({
        title: 'Funds allocated',
        description: `${records.length} passenger${records.length === 1 ? '' : 's'} updated. Amount and fund transfer synced to Ground Operations.`,
        variant: 'success',
      })
    },
    [mutateAndRefresh, setTableState, showToast],
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  const paginationTotal = isClaimSheetsTab
    ? totalClaimSheets
    : isAllocatedTab
      ? totalBatches
      : total

  const listingBody =
    viewMode === 'table' ? (
      <Stack spacing={0}>
        {listingTab === 'pending_allocation' && bulkActions && tableState.selectedRows.length > 0 ? (
          <BulkActions
            selectedRows={selectedRows}
            actions={bulkActions}
            onAction={(action, rows) => action.onClick(rows)}
            onDeselectAll={() => setTableState(state => ({ ...state, selectedRows: [] }))}
          />
        ) : null}
        {isClaimSheetsTab ? claimSheetsTable : isAllocatedTab ? allocatedTable : pendingTable}
      </Stack>
    ) : (
      <AdminListingGrid
        items={gridItems}
        onItemClick={id => {
          if (isClaimSheetsTab) {
            const sheet = paginatedClaimSheets.find(entry => entry.id === id)
            if (sheet) selectClaimSheet(sheet)
            return
          }
          if (isAllocatedTab) {
            const batch = paginatedBatches.find(entry => entry.id === id)
            if (batch) selectBatch(batch)
            return
          }
          const row = paginatedRows.find(entry => entry.id === id)
          if (row) selectPassenger(row)
        }}
      />
    )

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Fund allocation"
            description="Passenger-level VFS submission fund allocation across retail, corporate, marine, and B2B agent applications."
          />
        }
        kpis={
          isClaimSheetsTab ? undefined : (
            <FundAllocationKpiRow
              totalPassengers={kpis.totalPassengers}
              pendingAllocation={kpis.pendingAllocation}
              allocatedPassengers={kpis.allocatedPassengers}
              pendingAmount={kpis.pendingAmount}
            />
          )
        }
        tabs={[...FUND_ALLOCATION_LISTING_TABS]}
        tabValue={listingTab}
        onTabChange={value => handleListingTabChange(value as FundAllocationListingTab)}
        toolbar={
          <AdminListingToolbar
            searchValue={searchValue}
            onSearch={handleSearch}
            searchPlaceholder={
              isClaimSheetsTab
                ? 'Search claim number, generated by, passenger, application…'
                : isAllocatedTab
                  ? 'Search allocation, passenger, application ID, company, team, user…'
                  : 'Search passenger, application ID, company, jurisdiction, team, user…'
            }
            onExport={handleExport}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={toolbarColumns}
            hiddenColumnKeys={tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={keys =>
              setTableState(state => ({ ...state, hiddenColumnKeys: keys }))
            }
            filterPopover={
              isClaimSheetsTab
                ? undefined
                : {
                    active: hasActiveFilters,
                    value: queueFilters,
                    onApply: setQueueFilters,
                    onClear: clearFilters,
                    hasActive: hasFundAllocationFiltersActive,
                    width: 'wide',
                    scrollable: true,
                    children: (draft, patch) => (
                      <FundAllocationAdvancedFilterFields
                        draft={draft}
                        patch={patch}
                        options={filterOptions}
                      />
                    ),
                  }
            }
          />
        }
        listingContent={listingBody}
        footer={
          <Box sx={{ bgcolor: footerBg }}>
            <Pagination
              page={tableState.page}
              pageSize={tableState.pageSize}
              total={paginationTotal}
              onPage={page => setTableState(state => ({ ...state, page }))}
              onPageSize={pageSize => setTableState(state => ({ ...state, pageSize, page: 0 }))}
            />
          </Box>
        }
      />

      <FundAllocationDetailDrawer
        open={Boolean(selectedPassenger) && !isAllocatedTab && !isClaimSheetsTab}
        record={selectedPassenger ?? null}
        onClose={closeDetail}
      />

      <FundAllocationBatchDetailDrawer
        open={Boolean(selectedBatch) && isAllocatedTab}
        record={selectedBatch ?? null}
        onClose={closeDetail}
      />

      <FundAllocationClaimSheetDetailDrawer
        open={Boolean(selectedClaimSheet) && isClaimSheetsTab}
        sheet={selectedClaimSheet ?? null}
        onClose={closeDetail}
        onReviewed={refresh}
      />

      <ConfirmDialog
        open={claimReviewConfirm?.action === 'approve'}
        onClose={() => setClaimReviewConfirm(null)}
        title="Approve claim sheet"
        description={
          claimReviewConfirm
            ? `Approve ${claimReviewConfirm.sheet.claimNumber}? Finance will mark this claim as approved.`
            : undefined
        }
        confirmLabel="Approve"
        onConfirm={handleConfirmClaimReview}
      />

      <ConfirmDialog
        open={claimReviewConfirm?.action === 'reject'}
        onClose={() => setClaimReviewConfirm(null)}
        title="Reject claim sheet"
        description={
          claimReviewConfirm
            ? `Reject ${claimReviewConfirm.sheet.claimNumber}? Ground Operations will need to revise and resubmit.`
            : undefined
        }
        confirmLabel="Reject"
        variant="destructive"
        onConfirm={handleConfirmClaimReview}
      />

      <FundAllocationActionModal
        open={Boolean(actionModalRecord)}
        record={actionModalRecord}
        onClose={() => setActionModalRecord(null)}
        onConfirm={handleAllocate}
      />

      <FundAllocationBulkActionModal
        open={bulkModalRecords.length > 0}
        records={bulkModalRecords}
        onClose={() => setBulkModalRecords([])}
        onConfirm={handleBulkAllocate}
      />
    </>
  )
}
