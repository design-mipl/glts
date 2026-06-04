import { useMemo, useCallback, useState } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { navigateToCreateApplication } from '../utils/createApplicationNavigation'
import { CustomerListingShell } from '@/pages/customer/features/shared/components/listing/CustomerListingShell'
import { CustomerListingToolbar } from '@/pages/customer/features/shared/components/listing/CustomerListingToolbar'
import { CustomerListingTable } from '@/pages/customer/features/shared/components/listing/CustomerListingTable'
import { CustomerListingGrid } from '@/pages/customer/features/shared/components/listing/CustomerListingGrid'
import { CustomerListingPagination } from '@/pages/customer/features/shared/components/listing/CustomerListingPagination'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { getListingCellValue } from '../utils/applicationListingUtils'
import { mapApplicationRowsToGridItems } from '../utils/applicationListingGrid'
import { useApplicationListingWorkspace } from '../hooks/useApplicationListingWorkspace'
import { ApplicationListingHeader } from '../components/listing/ApplicationListingHeader'
import { buildUnifiedApplicationColumns } from '../components/listing/applicationListingColumns'
import type { ApplicationListingTab } from '../types/applicationListing.types'
import type { ApplicationListingRow } from '../types/applicationListing.types'
import type { BulkBatchRow, SingleApplicationRow } from '../data/applicationFlowData'
import type { Column } from '@/design-system/UIComponents'

function getEmptyState(
  tab: ApplicationListingTab,
  base: string,
  navigate: NavigateFunction,
  onTabChange: (tab: ApplicationListingTab) => void,
) {
  switch (tab) {
    case 'draft':
      return {
        emptyTitle: 'No draft applications',
        emptyDescription: 'Drafts are saved automatically. Start a new application to continue later.',
        emptyAction: { label: 'Create application', onClick: () => navigateToCreateApplication(navigate, base) },
      }
    case 'submitted':
      return {
        emptyTitle: 'No submitted applications',
        emptyDescription: 'Submitted applications appear here once they enter the processing pipeline.',
        emptyAction: { label: 'View all applications', onClick: () => onTabChange('all') },
      }
    default:
      return {
        emptyTitle: 'No applications found',
        emptyDescription: 'Adjust filters or create a new application to get started.',
        emptyAction: { label: 'Create application', onClick: () => navigateToCreateApplication(navigate, base) },
      }
  }
}

export function ApplicationsListPage() {
  const navigate = useNavigate()
  const { base, isSuperAdmin, isAdmin } = useCustomerPortalBase()
  const showCreatedBy = isSuperAdmin || isAdmin
  const { showToast } = useToast()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const { singles, bulks } = useMemo(() => customerPortalService.getApplicationListingRows(), [])

  const workspace = useApplicationListingWorkspace({ singles, bulks })
  const { listing, activeTab, setActiveTab } = workspace

  const columnParams = useMemo(
    () => ({ base, navigate, showToast, showCreatedBy }),
    [base, navigate, showToast, showCreatedBy],
  )

  const columns = useMemo(
    () => buildUnifiedApplicationColumns(columnParams) as Column<ApplicationListingRow>[],
    [columnParams],
  )

  const toolbarColumns = useMemo(
    () => columns.filter(c => c.key !== 'actions').map(c => ({ key: c.key, label: c.label })),
    [columns],
  )

  const tableRows = listing.paginatedRows
  const gridItems = useMemo(() => mapApplicationRowsToGridItems(tableRows), [tableRows])

  const emptyState = useMemo(
    () => getEmptyState(activeTab, base, navigate, setActiveTab),
    [activeTab, base, navigate, setActiveTab],
  )

  const handleRowClick = useCallback(
    (row: SingleApplicationRow | BulkBatchRow) => {
      navigate(`${base}/applications/${row.id}`)
    },
    [base, navigate],
  )

  const handleExport = useCallback(() => {
    showToast({
      title: 'Export started',
      description: 'Your application list export will download shortly.',
      variant: 'success',
    })
  }, [showToast])

  const handleTabChange = useCallback(
    (tab: ApplicationListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
    },
    [setActiveTab],
  )

  return (
    <CustomerListingShell
      stickyPageHeader={<ApplicationListingHeader />}
      tabs={[
        { value: 'all', label: 'All applications' },
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
      ]}
      tabValue={activeTab}
      onTabChange={v => handleTabChange(v as ApplicationListingTab)}
      toolbar={
        <CustomerListingToolbar
          searchValue={listing.tableState.searchQuery}
          onSearch={listing.handleSearch}
          searchPlaceholder="Search by GLTS reference, applicant, company, passport, booker name, or visa type…"
          onExport={handleExport}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          columns={toolbarColumns}
          hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
          onHiddenColumnKeysChange={keys => listing.setTableState(s => ({ ...s, hiddenColumnKeys: keys }))}
          moreMenuItems={[
            { label: 'Refresh list', onClick: () => showToast({ title: 'Refreshed', variant: 'info' }) },
            {
              label: 'Download bulk template',
              onClick: () => navigate(`${base}/applications/new`),
            },
          ]}
        />
      }
      table={
        viewMode === 'table' ? (
          <CustomerListingTable
            columns={columns}
            data={tableRows}
            filterSourceData={listing.filterSourceRows}
            rowKey="id"
            state={listing.tableState}
            onStateChange={listing.setTableState}
            columnFilters={listing.columnFilters}
            onColumnFiltersChange={listing.setColumnFilters}
            getCellValue={getListingCellValue}
            onRowClick={handleRowClick}
            stickyHeader
            emptyTitle={emptyState.emptyTitle}
            emptyDescription={emptyState.emptyDescription}
            emptyAction={emptyState.emptyAction}
          />
        ) : (
          <CustomerListingGrid
            items={gridItems}
            onItemClick={id => navigate(`${base}/applications/${id}`)}
          />
        )
      }
      pagination={
        <CustomerListingPagination
          page={listing.tableState.page}
          pageSize={listing.tableState.pageSize}
          total={listing.total}
          onPage={page => listing.setTableState(s => ({ ...s, page }))}
          onPageSize={pageSize => listing.setTableState(s => ({ ...s, pageSize, page: 0 }))}
        />
      }
    />
  )
}
