import { useCallback, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { Pagination, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { useListingTabParam } from '@/shared/hooks/useListingTabParam'
import { reconciliationService } from '@/shared/services/reconciliationService'
import type { ReconciliationFilters, ReconciliationItem, ReconciliationTab } from '@/shared/types/reconciliation'
import { ReconciliationAdvancedFilterFields } from '../components/ReconciliationAdvancedFilters'
import { ReconciliationDetailDrawer } from '../components/ReconciliationDetailDrawer'
import { ReconciliationKpiRow } from '../components/ReconciliationKpiRow'
import {
  buildReconciliationColumns,
  mapReconciliationRowsToGridItems,
} from '../components/ReconciliationTableColumns'
import { RECONCILIATION_LISTING_TABS } from '../config/reconciliationListingConfig'
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

export function ReconciliationListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useListingTabParam(TAB_VALUES, 'insurance')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [filters, setFilters] = useState<ReconciliationFilters>(EMPTY_RECONCILIATION_FILTERS)
  const [selectedItem, setSelectedItem] = useState<ReconciliationItem | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  const tabRows = useMemo(
    () => reconciliationService.list(activeTab, filters),
    [activeTab, filters, refreshKey],
  )

  const listing = useCustomerListing({
    rows: tabRows,
    getCellValue: getReconciliationCellValue,
    searchMatch: matchesReconciliationSearch,
    initialPageSize: 10,
  })

  const kpis = useMemo(() => computeReconciliationKpis(tabRows), [tabRows])
  const columns = useMemo(
    () =>
      buildReconciliationColumns(activeTab, {
        onOpen: setSelectedItem,
      }),
    [activeTab],
  )
  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )
  const emptyState = useMemo(
    () => getReconciliationEmptyState(activeTab, Boolean(listing.tableState.searchQuery.trim())),
    [activeTab, listing.tableState.searchQuery],
  )
  const gridItems = useMemo(
    () => mapReconciliationRowsToGridItems(listing.paginatedRows),
    [listing.paginatedRows],
  )

  const handleExport = useCallback(() => {
    downloadReconciliationCsv(listing.filterSourceRows, activeTab)
    showToast({
      title: 'Export started',
      description: 'Your reconciliation export will download shortly.',
      variant: 'success',
    })
  }, [activeTab, listing.filterSourceRows, showToast])

  const handleTabChange = useCallback(
    (tab: ReconciliationTab) => {
      setActiveTab(tab)
      setViewMode('table')
      setSelectedItem(null)
      listing.setTableState(state => ({ ...state, page: 0 }))
      if (tab !== 'mode_of_payment' && filters.paymentMode) {
        setFilters(current => ({ ...current, paymentMode: '' }))
      }
    },
    [filters.paymentMode, listing, setActiveTab],
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
            totalAmount={kpis.totalAmount}
          />
        }
        tabs={RECONCILIATION_LISTING_TABS}
        tabValue={activeTab}
        onTabChange={value => handleTabChange(value as ReconciliationTab)}
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search ref, passenger, client, vendor, or reference…"
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
                setFilters(next)
                listing.setTableState(state => ({ ...state, page: 0 }))
              },
              onClear: () => {
                setFilters(EMPTY_RECONCILIATION_FILTERS)
                listing.setTableState(state => ({ ...state, page: 0 }))
              },
              hasActive: value => hasReconciliationFiltersActive(value, activeTab),
              width: 360,
              children: (draft, patch) => (
                <ReconciliationAdvancedFilterFields draft={draft} patch={patch} tab={activeTab} />
              ),
            }}
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
              getCellValue={getReconciliationCellValue}
              onRowClick={row => setSelectedItem(row)}
              stickyHeader
              emptyTitle={emptyState.title}
              emptyDescription={emptyState.description}
            />
          ) : (
            <AdminListingGrid
              items={gridItems}
              onItemClick={id => {
                const row = listing.paginatedRows.find(item => item.id === id)
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

      <ReconciliationDetailDrawer
        open={Boolean(selectedItem)}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onSubmitted={() => setRefreshKey(key => key + 1)}
      />
    </>
  )
}
