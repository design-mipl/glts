import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button, ConfirmDialog, Pagination, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { getCurrentListingHref, navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { requirementMasterService } from '@/shared/services/requirementMasterService'
import type { RequirementMaster } from '@/shared/types/requirementMaster'
import { RequirementKpiRow } from '../components/RequirementKpiRow'
import { buildRequirementColumns } from '../components/RequirementTableColumns'
import {
  downloadRequirementCsv,
  getRequirementCellValue,
  getRequirementEmptyState,
  mapRequirementRowsToGridItems,
  matchesRequirementSearch,
} from '../utils/requirementListingUtils'

const LISTING_PATH = '/admin/masters/requirements'

export function RequirementListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const listingReturnHref = getCurrentListingHref(location)
  const [rows, setRows] = useState<RequirementMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [deleteTarget, setDeleteTarget] = useState<RequirementMaster | null>(null)
  const [statusTarget, setStatusTarget] = useState<RequirementMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(requirementMasterService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getRequirementCellValue,
    searchMatch: matchesRequirementSearch,
    initialPageSize: 10,
  })

  const openCreate = () => navigate(`${LISTING_PATH}/new`)
  const openEdit = (row: RequirementMaster) =>
    navigateFromListing(navigate, `${LISTING_PATH}/${row.id}/edit`, listingReturnHref)

  const columns = useMemo(
    () =>
      buildRequirementColumns({
        onOpenEdit: openEdit,
        onToggleStatus: setStatusTarget,
        onDelete: setDeleteTarget,
      }),
    [listingReturnHref, navigate],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getRequirementEmptyState(openCreate), [])
  const gridItems = useMemo(
    () => mapRequirementRowsToGridItems(listing.paginatedRows),
    [listing.paginatedRows],
  )
  const kpiCounts = useMemo(() => requirementMasterService.getKpiCounts(rows), [rows])

  const handleExport = useCallback(() => {
    downloadRequirementCsv(listing.filteredRows)
    showToast({ title: 'Export started', variant: 'success' })
  }, [listing.filteredRows, showToast])

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Requirement Master"
            description="Reusable questionnaire and document packs. Name is temporary."
            actions={
              <Button label="Create pack" startIcon={<Plus size={14} />} onClick={openCreate} />
            }
          />
        }
        kpis={<RequirementKpiRow counts={kpiCounts} />}
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search by name or description…"
            onExport={handleExport}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={toolbarColumns}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={(keys) =>
              listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
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
              getCellValue={getRequirementCellValue}
              stickyHeader
              enableColumnSort
              enableColumnFilters
              loading={loading}
              onRowClick={openEdit}
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
            />
          ) : (
            <AdminListingGrid items={gridItems} onItemClick={(id) => {
              const row = rows.find((item) => item.id === id)
              if (row) openEdit(row)
            }} />
          )
        }
        footer={
          <Box sx={{ bgcolor: footerBg }}>
            <Pagination
              page={listing.tableState.page}
              pageSize={listing.tableState.pageSize}
              total={listing.total}
              onPage={(page) => listing.setTableState((state) => ({ ...state, page }))}
              onPageSize={(pageSize) =>
                listing.setTableState((state) => ({ ...state, pageSize, page: 0 }))
              }
            />
          </Box>
        }
      />

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        loading={actionLoading}
        variant="destructive"
        title="Delete this pack?"
        description={
          deleteTarget
            ? `Permanently delete "${deleteTarget.name}"? This cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        onConfirm={() => {
          if (!deleteTarget) return
          setActionLoading(true)
          requirementMasterService.remove(deleteTarget.id)
          setActionLoading(false)
          setDeleteTarget(null)
          showToast({ title: 'Requirement pack deleted', variant: 'success' })
          loadRows()
        }}
      />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        loading={actionLoading}
        title={statusTarget?.status === 'active' ? 'Deactivate this pack?' : 'Activate this pack?'}
        description={
          statusTarget
            ? `"${statusTarget.name}" will be marked ${statusTarget.status === 'active' ? 'inactive' : 'active'}.`
            : undefined
        }
        confirmLabel={statusTarget?.status === 'active' ? 'Deactivate' : 'Activate'}
        onConfirm={() => {
          if (!statusTarget) return
          const next = statusTarget.status === 'active' ? 'inactive' : 'active'
          setActionLoading(true)
          requirementMasterService.setStatus(statusTarget.id, next)
          setActionLoading(false)
          setStatusTarget(null)
          showToast({
            title: next === 'active' ? 'Pack activated' : 'Pack deactivated',
            variant: 'success',
          })
          loadRows()
        }}
      />
    </>
  )
}
