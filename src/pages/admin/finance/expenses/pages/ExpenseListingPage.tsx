import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { ClipboardCheck, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, Pagination, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
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

export function ExpenseListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<ExpenseListingTab>('marine')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    applicationExpenseManagementService.syncAllSubmitted()
  }, [refreshKey])

  const tabRows = useMemo(
    () => loadExpenseListingRows(activeTab),
    [activeTab, refreshKey],
  )

  const listing = useCustomerListing({
    rows: tabRows,
    getCellValue: getExpenseListingCellValue,
    searchMatch: matchesExpenseListingSearch,
    initialPageSize: 10,
  })

  const kpis = useMemo(() => computeExpenseListingKpis(tabRows), [tabRows])
  const columns = useMemo(() => buildExpenseApplicationColumns({ navigate }), [navigate])
  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )
  const emptyState = useMemo(
    () => getExpenseListingEmptyState(activeTab, Boolean(listing.tableState.searchQuery.trim())),
    [activeTab, listing.tableState.searchQuery],
  )
  const gridItems = useMemo(() => mapExpenseRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const handleRefresh = useCallback(() => {
    setRefreshKey(key => key + 1)
    showToast({ title: 'Expenses refreshed', description: 'Synced application-linked expenses.', variant: 'success' })
  }, [showToast])

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
    [listing],
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
          actions={
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button
                label="Approval queue"
                variant="outlined"
                startIcon={<ClipboardCheck size={14} />}
                onClick={() => navigate(`${EXPENSE_LISTING_BASE_PATH}/approval-queue`)}
              />
              <Button
                label="Refresh"
                variant="neutral"
                startIcon={<RefreshCw size={14} />}
                onClick={handleRefresh}
              />
            </Stack>
          }
        />
      }
      kpis={
        activeTab === 'marine' ? (
          <ExpenseApplicationKpiRow
            submittedApplications={kpis.submittedApplications}
            totalExpense={kpis.totalExpense}
            pendingApproval={kpis.pendingApproval}
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
            onRowClick={row => navigate(`${EXPENSE_LISTING_BASE_PATH}/${row.applicationId}`)}
            stickyHeader
            emptyTitle={emptyState.title}
            emptyDescription={emptyState.description}
          />
        ) : (
          <AdminListingGrid
            items={gridItems}
            onItemClick={id => navigate(`${EXPENSE_LISTING_BASE_PATH}/${id}`)}
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
