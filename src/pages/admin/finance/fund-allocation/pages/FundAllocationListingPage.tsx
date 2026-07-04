import { useCallback, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { RefreshCw } from 'lucide-react'
import { Button, Pagination, useToast } from '@/design-system/UIComponents'
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
  getFundAllocationFilterOptions,
  getFundAllocationTabEmptyState,
} from '../utils/fundAllocationListingUtils'
import { customerSegmentDisplayLabel } from '../config/fundAllocationStatusConfig'

export function FundAllocationListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [actionModalRecord, setActionModalRecord] = useState<FundAllocationPassengerRow | null>(null)

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

  const hasActiveFilters = Boolean(
    queueFilters.customerSegment ||
      queueFilters.country ||
      queueFilters.visaType ||
      queueFilters.jurisdiction ||
      searchValue ||
      Object.values(columnFilters).some(values => values.length > 0) ||
      tableState.sortKey,
  )

  const handleAction = useCallback(
    (action: FundAllocationAdminAction, row: FundAllocationPassengerRow) => {
      if (action === 'view_details') {
        selectPassenger(row)
        return
      }
      setActionModalRecord(row)
    },
    [selectPassenger],
  )

  const columns = useMemo(
    () => buildFundAllocationTableColumns({ listingTab, onAction: handleAction }),
    [handleAction, listingTab],
  )

  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )

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
      showToast({ title: 'Funds allocated', variant: 'success' })
    },
    [actionModalRecord, mutateAndRefresh, showToast],
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
      <AdminListingTable
        columns={columns}
        data={paginatedRows}
        filterSourceData={filterSourceRows}
        rowKey="id"
        state={tableState}
        onStateChange={setTableState}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        getCellValue={getFundAllocationCellValue}
        onRowClick={selectPassenger}
        stickyHeader
        emptyTitle={emptyState.title}
        emptyDescription={emptyState.description}
      />
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
            searchPlaceholder="Search passenger, application ID, company, jurisdiction…"
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
              onApply: next => {
                setQueueFilters(next)
                setTableState(state => ({ ...state, page: 0 }))
              },
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
    </>
  )
}
