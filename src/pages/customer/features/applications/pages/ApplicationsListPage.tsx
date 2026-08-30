import { useMemo, useCallback, useState } from 'react'
import { useNavigate, type NavigateFunction } from 'react-router-dom'
import { ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import {
  navigateToContinueRetailApplication,
  navigateToCreateApplication,
} from '../utils/createApplicationNavigation'
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
import { useApplicationFlowPolicy } from '../context/ApplicationFlowPolicyContext'
import type { ApplicationListingTab } from '../types/applicationListing.types'
import type { ApplicationListingRow } from '../types/applicationListing.types'
import type { BulkBatchRow, SingleApplicationRow } from '../data/applicationFlowData'
import type { Column } from '@/design-system/UIComponents'
import { deleteRetailWebsiteApplicationDraft } from '@/shared/services/retailWebsiteApplicationService'
import { removeCustomerDraftListingRow } from '@/shared/services/applicationListingDraftStorage'

function getEmptyState(
  tab: ApplicationListingTab,
  base: string,
  navigate: NavigateFunction,
  onTabChange: (tab: ApplicationListingTab) => void,
  isRetail: boolean,
) {
  if (isRetail) {
    switch (tab) {
      case 'draft':
        return {
          emptyTitle: 'No ongoing applications',
          emptyDescription: 'Applications you start but have not purchased yet appear here. Continue anytime from where you left off.',
          emptyAction: { label: 'Start application', onClick: () => navigate('/countries') },
        }
      case 'submitted':
        return {
          emptyTitle: 'No purchased applications',
          emptyDescription: 'After payment, your applications move here so you can track processing.',
          emptyAction: { label: 'View ongoing', onClick: () => onTabChange('draft') },
        }
      default:
        return {
          emptyTitle: 'No applications found',
          emptyDescription: 'Start a visa application from the website, or continue a saved draft.',
          emptyAction: { label: 'Browse destinations', onClick: () => navigate('/countries') },
        }
    }
  }

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
  const { base, isBusiness, isSuperAdmin, isAdmin } = useCustomerPortalBase()
  const isRetail = !isBusiness
  const { customerSegment } = useApplicationFlowPolicy()
  const showCreatedBy = isSuperAdmin || isAdmin
  const { showToast } = useToast()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [listingVersion, setListingVersion] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<SingleApplicationRow | null>(null)

  const { singles, bulks } = useMemo(() => customerPortalService.getApplicationListingRows(), [listingVersion])

  const workspace = useApplicationListingWorkspace({
    singles,
    bulks,
    defaultTab: isRetail ? 'draft' : 'all',
  })
  const { listing, activeTab, setActiveTab } = workspace

  const handleContinue = useCallback(
    (row: SingleApplicationRow) => {
      navigateToContinueRetailApplication(navigate, row, base)
    },
    [navigate, base],
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return
    const removedWebsite = deleteRetailWebsiteApplicationDraft(deleteTarget.id)
    const removedCustomer = removeCustomerDraftListingRow(deleteTarget.id)
    setDeleteTarget(null)
    if (removedWebsite || removedCustomer) {
      setListingVersion(v => v + 1)
      showToast({ title: 'Application deleted', description: 'The ongoing application was removed.', variant: 'success' })
    } else {
      showToast({ title: 'Could not delete', description: 'Only ongoing draft applications can be deleted.', variant: 'error' })
    }
  }, [deleteTarget, showToast])

  const columnParams = useMemo(
    () => ({
      base,
      navigate,
      showToast,
      showCreatedBy: isRetail ? false : showCreatedBy,
      customerSegment: isRetail ? ('retail' as const) : customerSegment,
      isRetail,
      onContinueDraft: isRetail ? handleContinue : undefined,
      onDeleteDraft: isRetail ? (row: SingleApplicationRow) => setDeleteTarget(row) : undefined,
    }),
    [base, navigate, showToast, showCreatedBy, customerSegment, isRetail, handleContinue],
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
    () => getEmptyState(activeTab, base, navigate, setActiveTab, isRetail),
    [activeTab, base, navigate, setActiveTab, isRetail],
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

  const tabs = isRetail
    ? [
        { value: 'draft', label: 'Ongoing Applications' },
        { value: 'submitted', label: 'Purchased Applications' },
      ]
    : [
        { value: 'all', label: 'All applications' },
        { value: 'draft', label: 'Draft' },
        { value: 'submitted', label: 'Submitted' },
      ]

  return (
    <>
      <CustomerListingShell
        stickyPageHeader={<ApplicationListingHeader />}
        tabs={tabs}
        tabValue={activeTab}
        onTabChange={v => handleTabChange(v as ApplicationListingTab)}
        toolbar={
          <CustomerListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder={
              isRetail
                ? 'Search by reference, applicant, country, or visa type…'
                : 'Search by GLTS reference, applicant, company, vessel, passport, booker name, or visa type…'
            }
            onExport={handleExport}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={toolbarColumns}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={keys => listing.setTableState(s => ({ ...s, hiddenColumnKeys: keys }))}
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

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Delete ongoing application?"
        description={
          deleteTarget
            ? `This will permanently remove ${deleteTarget.id} (${deleteTarget.visaType} · ${deleteTarget.country}). This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        variant="destructive"
      />
    </>
  )
}
