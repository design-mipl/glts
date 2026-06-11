import { useCallback, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  Button,
  Pagination,
  useToast,
} from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { MarineApplicationKpiRow } from '../components/MarineApplicationKpiRow'
import { buildMarineApplicationColumns } from '../components/MarineApplicationTableColumns'
import {
  downloadMarineApplicationCsv,
  filterMarineRowsByTab,
  getAllMarineListingRows,
  getMarineApplicationCellValue,
  getMarineApplicationEmptyState,
  mapMarineApplicationRowsToGridItems,
  matchesMarineApplicationSearch,
  type MarineApplicationListingTab,
} from '../utils/marineApplicationListingUtils'

export function MarineApplicationListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<MarineApplicationListingTab>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const { singles, bulks } = useMemo(
    () => marineApplicationAdminService.listSubmittedMarineApplications(),
    [],
  )

  const allRows = useMemo(() => getAllMarineListingRows(singles, bulks), [singles, bulks])

  const tabFilteredRows = useMemo(
    () => filterMarineRowsByTab(allRows, activeTab),
    [allRows, activeTab],
  )

  const listing = useCustomerListing({
    rows: tabFilteredRows,
    getCellValue: getMarineApplicationCellValue,
    searchMatch: matchesMarineApplicationSearch,
    initialPageSize: 10,
  })

  const columns = useMemo(
    () => buildMarineApplicationColumns({ navigate, showToast }),
    [navigate, showToast],
  )

  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleCreate = useCallback(() => {
    navigate('/admin/application-management/marine/new', { state: { freshStart: true } })
  }, [navigate])

  const emptyState = useMemo(
    () => getMarineApplicationEmptyState(activeTab, handleCreate),
    [activeTab, handleCreate],
  )

  const handleExport = useCallback(() => {
    downloadMarineApplicationCsv(listing.filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your application list export will download shortly.',
      variant: 'success',
    })
  }, [listing.filterSourceRows, showToast])

  const handleClearFilters = useCallback(() => {
    listing.handleSearch('')
    listing.setColumnFilters({})
  }, [listing])

  const handleTabChange = useCallback(
    (tab: MarineApplicationListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState(state => ({ ...state, page: 0 }))
    },
    [listing],
  )

  const handleRowClick = useCallback(
    (row: MarineApplicationRow) => {
      navigate(`/admin/application-management/marine/${row.id}`)
    },
    [navigate],
  )

  const gridItems = useMemo(
    () => mapMarineApplicationRowsToGridItems(listing.paginatedRows),
    [listing.paginatedRows],
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <AdminListingShell
      stickyPageHeader={
        <AdminListingStickyHeader
          title="Application Management"
          description="Operational workspace for submitted applications"
          actions={
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button label="Create application" startIcon={<Plus size={14} />} onClick={handleCreate} />
            </Stack>
          }
        />
      }
      kpis={<MarineApplicationKpiRow rows={allRows} />}
      tabs={[
        { value: 'all', label: 'All applications' },
        { value: 'new_applications', label: 'New applications' },
        { value: 'under_verification', label: 'Under verification' },
        { value: 'ready_for_submission', label: 'Ready for submission' },
        { value: 'embassy_processing', label: 'Embassy processing' },
        { value: 'visa_approved', label: 'Visa approved' },
        { value: 'completed', label: 'Completed' },
      ]}
      tabValue={activeTab}
      onTabChange={value => handleTabChange(value as MarineApplicationListingTab)}
      toolbar={
        <AdminListingToolbar
          searchValue={listing.tableState.searchQuery}
          onSearch={listing.handleSearch}
          searchPlaceholder="Search by GLTS reference, applicant, company, jurisdiction, passport no."
          onExport={handleExport}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          columns={toolbarColumns}
          hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
          onHiddenColumnKeysChange={keys =>
            listing.setTableState(state => ({ ...state, hiddenColumnKeys: keys }))
          }
          moreMenuItems={[
            { label: 'Refresh list', onClick: () => showToast({ title: 'List refreshed', variant: 'info' }) },
            { label: 'Clear all filters', onClick: handleClearFilters },
          ]}
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
            getCellValue={getMarineApplicationCellValue}
            onRowClick={handleRowClick}
            stickyHeader
            emptyTitle={emptyState.emptyTitle}
            emptyDescription={emptyState.emptyDescription}
            emptyAction={emptyState.emptyAction}
          />
        ) : (
          <AdminListingGrid
            items={gridItems}
            onItemClick={id => navigate(`/admin/application-management/marine/${id}`)}
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
            onPageSize={pageSize => listing.setTableState(state => ({ ...state, pageSize, page: 0 }))}
          />
        </Box>
      }
    />
  )
}
