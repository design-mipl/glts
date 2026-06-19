import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import { Button, ConfirmDialog, Pagination, useToast } from '@/design-system/UIComponents'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { vendorService } from '@/shared/services/vendorService'
import type { Vendor } from '@/shared/types/vendor'
import {
  EMPTY_VENDOR_FILTERS,
  VendorAdvancedFilterFields,
  hasVendorFiltersActive,
  vendorFiltersToListFilters,
} from '../components/VendorAdvancedFilters'
import { VendorKpiRow } from '../components/VendorKpiRow'
import { buildVendorColumns } from '../components/VendorTableColumns'
import {
  downloadVendorCsv,
  getVendorCellValue,
  getVendorEmptyState,
  mapVendorRowsToGridItems,
  matchesVendorSearch,
} from '../utils/vendorListingUtils'

export function VendorListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [filters, setFilters] = useState(EMPTY_VENDOR_FILTERS)
  const [statusOpen, setStatusOpen] = useState(false)
  const [statusTarget, setStatusTarget] = useState<Vendor | null>(null)
  const [statusAction, setStatusAction] = useState<'activate' | 'deactivate'>('deactivate')
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(vendorService.list(vendorFiltersToListFilters(filters)))
    setLoading(false)
  }, [filters])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getVendorCellValue,
    searchMatch: matchesVendorSearch,
    initialPageSize: 10,
  })

  const openStatusToggle = useCallback((row: Vendor, action: 'activate' | 'deactivate') => {
    setStatusTarget(row)
    setStatusAction(action)
    setStatusOpen(true)
  }, [])

  const columns = useMemo(
    () =>
      buildVendorColumns({
        onOpenDetail: (row) => navigate(`/admin/vendor-management/vendors/${row.id}`),
        onOpenEdit: (row) => navigate(`/admin/vendor-management/vendors/${row.id}/edit`),
        onActivate: (row) => openStatusToggle(row, 'activate'),
        onDeactivate: (row) => openStatusToggle(row, 'deactivate'),
      }),
    [navigate, openStatusToggle],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleCreate = useCallback(() => {
    navigate('/admin/vendor-management/vendors/new')
  }, [navigate])

  const emptyState = useMemo(() => {
    const base = getVendorEmptyState(Boolean(listing.tableState.searchQuery) || hasVendorFiltersActive(filters))
    return {
      ...base,
      emptyAction: base.emptyAction ? { ...base.emptyAction, onClick: handleCreate } : undefined,
    }
  }, [listing.tableState.searchQuery, filters, handleCreate])

  const gridItems = useMemo(() => mapVendorRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const handleConfirmStatus = () => {
    if (!statusTarget) return
    setActionLoading(true)
    const nextStatus = statusAction === 'activate' ? 'active' : 'inactive'
    vendorService.setStatus(statusTarget.id, nextStatus)
    setActionLoading(false)
    showToast({
      title: nextStatus === 'active' ? 'Vendor activated' : 'Vendor deactivated',
      variant: 'success',
    })
    setStatusOpen(false)
    setStatusTarget(null)
    loadRows()
  }

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Vendors"
            description="Centralized vendor management for operational and financial partners across GLTS services"
            actions={<Button label="Add vendor" startIcon={<Plus size={14} />} onClick={handleCreate} />}
          />
        }
        kpis={<VendorKpiRow vendors={rows} />}
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search by vendor name, ID, contact, or email…"
            onExport={() => {
              downloadVendorCsv(listing.filterSourceRows)
              showToast({ title: 'Export started', variant: 'success' })
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={toolbarColumns}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={(keys) =>
              listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
            }
            filterPopover={{
              active: hasVendorFiltersActive(filters),
              value: filters,
              onApply: (next) => {
                setFilters(next)
                listing.setTableState((state) => ({ ...state, page: 0 }))
              },
              onClear: () => setFilters(EMPTY_VENDOR_FILTERS),
              hasActive: hasVendorFiltersActive,
              children: (draft, patch) => <VendorAdvancedFilterFields draft={draft} patch={patch} />,
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
              getCellValue={getVendorCellValue}
              onRowClick={(row) => navigate(`/admin/vendor-management/vendors/${row.id}`)}
              loading={loading}
              stickyHeader
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
            />
          ) : (
            <AdminListingGrid
              items={gridItems}
              onItemClick={(id) => navigate(`/admin/vendor-management/vendors/${id}`)}
            />
          )
        }
        footer={
          <Box sx={{ bgcolor: footerBg }}>
            <Pagination
              page={listing.tableState.page}
              pageSize={listing.tableState.pageSize}
              total={listing.total}
              onPage={(page) => listing.setTableState((state) => ({ ...state, page }))}
              onPageSize={(pageSize) => listing.setTableState((state) => ({ ...state, pageSize, page: 0 }))}
            />
          </Box>
        }
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false)
          setStatusTarget(null)
        }}
        onConfirm={handleConfirmStatus}
        loading={actionLoading}
        title={statusAction === 'deactivate' ? 'Deactivate vendor?' : 'Activate vendor?'}
        description={
          statusTarget
            ? `${statusAction === 'deactivate' ? 'Deactivate' : 'Activate'} "${statusTarget.vendorName}"?`
            : undefined
        }
        confirmLabel={statusAction === 'deactivate' ? 'Deactivate' : 'Activate'}
        variant={statusAction === 'deactivate' ? 'destructive' : 'default'}
      />
    </>
  )
}
