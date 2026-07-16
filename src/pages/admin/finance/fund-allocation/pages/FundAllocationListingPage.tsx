import { useCallback, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { RefreshCw, Wallet } from 'lucide-react'
import { BulkActions, Button, Pagination, type TableState, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import type { FundAllocationListingTab } from '@/shared/types/fundAllocation'
import type { FundAllocationPassengerRow } from '@/shared/types/fundAllocation'
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
import { FundAllocationKpiRow } from '../components/FundAllocationKpiRow'
import {
  buildFundAllocationTableColumns,
  type FundAllocationAdminAction,
} from '../components/FundAllocationTableColumns'
import { FUND_ALLOCATION_LISTING_TABS } from '../config/fundAllocationListingTabs'
import { useFundAllocationListing } from '../hooks/useFundAllocationListing'
import {
  computeFundAllocationKpis,
  downloadFundAllocationCsv,
  getFundAllocationCellValue,
  getFundAllocationCountryKey,
  getFundAllocationAssigneeKey,
  getFundAllocationFilterOptions,
  getFundAllocationTabEmptyState,
  sanitizeFundAllocationSelection,
} from '../utils/fundAllocationListingUtils'
import { computePassengerRequestedBulkAllocationInput, computeRequestedBulkSummary } from '../utils/fundAllocationBulkUtils'
import { customerSegmentDisplayLabel } from '../config/fundAllocationStatusConfig'

export function FundAllocationListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [actionModalRecord, setActionModalRecord] = useState<FundAllocationPassengerRow | null>(null)
  const [bulkModalRecords, setBulkModalRecords] = useState<FundAllocationPassengerRow[]>([])

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
    searchValue,
    handleListingTabChange,
    handleSearch,
    clearFilters,
    selectPassenger,
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
    [filterSourceRows, setTableState, showToast, tableState.selectedRows],
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

  const columns = useMemo(
    () => buildFundAllocationTableColumns({ listingTab, onAction: handleAction }),
    [handleAction, listingTab],
  )

  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )

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

  const handleExport = useCallback(() => {
    downloadFundAllocationCsv(filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your fund allocation export will download shortly.',
      variant: 'success',
    })
  }, [filterSourceRows, showToast])

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

  const gridItems = useMemo(
    () =>
      paginatedRows.map(row => ({
        id: row.id,
        title: row.passengerName,
        subtitle: `${row.country} • ${row.visaType}`,
        meta: `${customerSegmentDisplayLabel(row.customerSegment)} · ${row.gltsApplicationId}`,
        status: row.allocationStatus,
      })),
    [paginatedRows],
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

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
        <AdminListingTable
          columns={columns}
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
      </Stack>
    ) : (
      <AdminListingGrid
        items={gridItems}
        onItemClick={id => {
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
            actions={
              <Button
                label="Refresh queue"
                variant="neutral"
                size="sm"
                startIcon={<RefreshCw size={14} />}
                onClick={() => {
                  refresh()
                  showToast({ title: 'Queue refreshed', variant: 'info' })
                }}
              />
            }
          />
        }
        kpis={
          <FundAllocationKpiRow
            totalPassengers={kpis.totalPassengers}
            pendingAllocation={kpis.pendingAllocation}
            allocatedPassengers={kpis.allocatedPassengers}
            pendingAmount={kpis.pendingAmount}
          />
        }
        tabs={[...FUND_ALLOCATION_LISTING_TABS]}
        tabValue={listingTab}
        onTabChange={value => handleListingTabChange(value as FundAllocationListingTab)}
        toolbar={
          <AdminListingToolbar
            searchValue={searchValue}
            onSearch={handleSearch}
            searchPlaceholder="Search passenger, application ID, company, jurisdiction, team, user…"
            onExport={handleExport}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={toolbarColumns}
            hiddenColumnKeys={tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={keys =>
              setTableState(state => ({ ...state, hiddenColumnKeys: keys }))
            }
            filterPopover={{
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
            }}
          />
        }
        listingContent={listingBody}
        footer={
          <Box sx={{ bgcolor: footerBg }}>
            <Pagination
              page={tableState.page}
              pageSize={tableState.pageSize}
              total={total}
              onPage={page => setTableState(state => ({ ...state, page }))}
              onPageSize={pageSize => setTableState(state => ({ ...state, pageSize, page: 0 }))}
            />
          </Box>
        }
      />

      <FundAllocationDetailDrawer
        open={Boolean(selectedPassenger)}
        record={selectedPassenger ?? null}
        onClose={closeDetail}
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
