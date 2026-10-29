import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { Pagination, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { useListingTabParam } from '@/shared/hooks/useListingTabParam'
import { getCurrentListingHref, navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import { ExpenseApplicationKpiRow } from '../components/ExpenseApplicationKpiRow'
import { buildExpenseApplicationColumns } from '../components/ExpenseApplicationTableColumns'
import {
  EXPENSE_FINANCE_STATUS_TABS,
  EXPENSE_LISTING_BASE_PATH,
  EXPENSE_LISTING_TABS,
  type ExpenseFinanceStatusTab,
  type ExpenseListingTab,
} from '../config/expenseListingTabs'
import {
  computeExpenseListingKpis,
  downloadExpenseListingCsv,
  getExpenseListingCellValue,
  getExpenseListingEmptyState,
  loadExpenseListingRows,
  mapExpenseRowsToGridItems,
  matchesExpenseListingSearch,
} from '../utils/expenseListingUtils'

const EXPENSE_TAB_VALUES = EXPENSE_LISTING_TABS.map(tab => tab.value) as readonly ExpenseListingTab[]
const EXPENSE_STATUS_VALUES = EXPENSE_FINANCE_STATUS_TABS.map(
  tab => tab.value,
) as readonly ExpenseFinanceStatusTab[]

export function ExpenseListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useListingTabParam(EXPENSE_TAB_VALUES, 'marine')
  const [statusTab, setStatusTab] = useListingTabParam(EXPENSE_STATUS_VALUES, 'needs_update', 'status')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const listingReturnHref = getCurrentListingHref(location)
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    applicationExpenseManagementService.syncAllSubmitted()
    setSynced(true)
  }, [])

  const segmentRows = useMemo(
    () => (synced ? loadExpenseListingRows(activeTab) : []),
    [activeTab, synced],
  )
  const tabRows = useMemo(
    () => segmentRows.filter(row => row.financeStatus === statusTab),
    [segmentRows, statusTab],
  )

  const listing = useCustomerListing({
    rows: tabRows,
    getCellValue: getExpenseListingCellValue,
    searchMatch: matchesExpenseListingSearch,
    initialPageSize: 10,
  })

  const kpis = useMemo(() => computeExpenseListingKpis(segmentRows), [segmentRows])
  const columns = useMemo(
    () => buildExpenseApplicationColumns({ navigate, fromListing: listingReturnHref }),
    [navigate, listingReturnHref],
  )
  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )
  const emptyState = useMemo(
    () => getExpenseListingEmptyState(activeTab, statusTab, Boolean(listing.tableState.searchQuery.trim())),
    [activeTab, statusTab, listing.tableState.searchQuery],
  )
  const gridItems = useMemo(() => mapExpenseRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const handleExport = useCallback(() => {
    downloadExpenseListingCsv(listing.filterSourceRows)
    showToast({ title: 'Export started', description: 'Your expense listing export will download shortly.', variant: 'success' })
  }, [listing.filterSourceRows, showToast])

  const resetPage = useCallback(() => {
    listing.setTableState(state => ({ ...state, page: 0 }))
  }, [listing])

  const handleTabChange = useCallback(
    (tab: ExpenseListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      resetPage()
    },
    [resetPage, setActiveTab],
  )

  const handleStatusTabChange = useCallback(
    (tab: ExpenseFinanceStatusTab) => {
      setStatusTab(tab)
      resetPage()
    },
    [resetPage, setStatusTab],
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <AdminListingShell
      stickyPageHeader={
        <AdminListingStickyHeader
          title="Expense management"
          description="Vendor and passenger assignments appear here as expenses. Confirm actuals, then reconcile, then bill."
        />
      }
      kpis={
        <ExpenseApplicationKpiRow
          needsUpdate={kpis.needsUpdate}
          paid={kpis.paid}
          reconciled={kpis.reconciled}
          totalExpense={kpis.totalExpense}
        />
      }
      tabs={EXPENSE_LISTING_TABS}
      tabValue={activeTab}
      onTabChange={value => handleTabChange(value as ExpenseListingTab)}
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
              onChange={value => handleStatusTabChange(value as ExpenseFinanceStatusTab)}
              variant="underline"
              size="sm"
              scrollable
              items={EXPENSE_FINANCE_STATUS_TABS.map(tab => ({
                value: tab.value,
                label: `${tab.label} (${
                  tab.value === 'needs_update'
                    ? kpis.needsUpdate
                    : tab.value === 'paid'
                      ? kpis.paid
                      : kpis.reconciled
                })`,
              }))}
              sx={{ mb: 0, minHeight: 40 }}
            />
          </Box>
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search application ID, company, vessel, or passenger name…"
            onExport={handleExport}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={toolbarColumns}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={keys =>
              listing.setTableState(state => ({ ...state, hiddenColumnKeys: keys }))
            }
          />
        </Stack>
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
            getCellValue={getExpenseListingCellValue}
            onRowClick={row =>
              navigateFromListing(
                navigate,
                `${EXPENSE_LISTING_BASE_PATH}/${row.applicationId}`,
                listingReturnHref,
              )
            }
            stickyHeader
            loading={!synced}
            emptyTitle={emptyState.title}
            emptyDescription={emptyState.description}
          />
        ) : (
          <AdminListingGrid
            items={gridItems}
            loading={!synced}
            onItemClick={id =>
              navigateFromListing(navigate, `${EXPENSE_LISTING_BASE_PATH}/${id}`, listingReturnHref)
            }
          />
        )
      }
      footer={
        <Box sx={{ bgcolor: footerBg }}>
          <Pagination
            page={listing.tableState.page}
            pageSize={listing.tableState.pageSize}
            total={listing.filterSourceRows.length}
            onPage={page => listing.setTableState(state => ({ ...state, page }))}
            onPageSize={pageSize =>
              listing.setTableState(state => ({ ...state, pageSize, page: 0 }))
            }
          />
        </Box>
      }
    />
  )
}
