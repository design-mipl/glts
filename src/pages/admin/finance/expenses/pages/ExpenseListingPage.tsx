import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
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
import { getCurrentListingHref, navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import { ExpenseApplicationKpiRow } from '../components/ExpenseApplicationKpiRow'
import { buildExpenseApplicationColumns } from '../components/ExpenseApplicationTableColumns'
import {
  EXPENSE_LISTING_BASE_PATH,
  EXPENSE_LISTING_TABS,
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

export function ExpenseListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useListingTabParam(EXPENSE_TAB_VALUES, 'marine')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const listingReturnHref = getCurrentListingHref(location)

  useEffect(() => {
    applicationExpenseManagementService.syncAllSubmitted()
  }, [])

  const tabRows = useMemo(() => loadExpenseListingRows(activeTab), [activeTab])

  const listing = useCustomerListing({
    rows: tabRows,
    getCellValue: getExpenseListingCellValue,
    searchMatch: matchesExpenseListingSearch,
    initialPageSize: 10,
  })

  const kpis = useMemo(() => computeExpenseListingKpis(tabRows), [tabRows])
  const columns = useMemo(
    () => buildExpenseApplicationColumns({ navigate, fromListing: listingReturnHref }),
    [navigate, listingReturnHref],
  )
  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )
  const emptyState = useMemo(
    () => getExpenseListingEmptyState(activeTab, Boolean(listing.tableState.searchQuery.trim())),
    [activeTab, listing.tableState.searchQuery],
  )
  const gridItems = useMemo(() => mapExpenseRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const handleExport = useCallback(() => {
    downloadExpenseListingCsv(listing.filterSourceRows)
    showToast({ title: 'Export started', description: 'Your expense listing export will download shortly.', variant: 'success' })
  }, [listing.filterSourceRows, showToast])

  const handleTabChange = useCallback(
    (tab: ExpenseListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState(state => ({ ...state, page: 0 }))
    },
    [listing, setActiveTab],
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
          description="Consolidated financial view of submitted applications and mapped expenses."
        />
      }
      kpis={
        activeTab === 'marine' ? (
          <ExpenseApplicationKpiRow
            submittedApplications={kpis.submittedApplications}
            totalExpense={kpis.totalExpense}
            pendingPayment={kpis.pendingPayment}
            paidApplications={kpis.paidApplications}
          />
        ) : undefined
      }
      tabs={EXPENSE_LISTING_TABS}
      tabValue={activeTab}
      onTabChange={value => handleTabChange(value as ExpenseListingTab)}
      toolbar={
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
            emptyTitle={emptyState.title}
            emptyDescription={emptyState.description}
          />
        ) : (
          <AdminListingGrid
            items={gridItems}
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
