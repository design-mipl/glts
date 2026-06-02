import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import {
  Button,
  ConfirmDialog,
  Pagination,
  useToast,
} from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { serviceMasterService } from '@/shared/services/serviceMasterService'
import type { ServiceMaster, ServiceMasterListFilters } from '@/shared/types/serviceMaster'
import { ServiceAdvancedFilters } from '../components/ServiceAdvancedFilters'
import { ServiceFormDrawer } from '../components/ServiceFormDrawer'
import { buildServiceColumns } from '../components/ServiceTableColumns'
import {
  downloadServiceCsv,
  getServiceCellValue,
  getServiceEmptyState,
  matchesServiceSearch,
} from '../utils/serviceListingUtils'

const EMPTY_FILTERS: ServiceMasterListFilters = {
  status: 'all',
  category: 'all',
  currency: 'all',
}

export function ServiceListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [rows, setRows] = useState<ServiceMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<ServiceMasterListFilters>(EMPTY_FILTERS)
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<ServiceMaster | null>(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [statusTarget, setStatusTarget] = useState<ServiceMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(serviceMasterService.list(filters))
    setLoading(false)
  }, [filters])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getServiceCellValue,
    searchMatch: matchesServiceSearch,
    initialPageSize: 10,
  })

  const openEdit = (row: ServiceMaster) => {
    setEditRecord(row)
    setFormOpen(true)
  }

  const openCreate = () => {
    setEditRecord(null)
    setFormOpen(true)
  }

  const openStatusToggle = (row: ServiceMaster) => {
    setStatusTarget(row)
    setStatusOpen(true)
  }

  const columns = useMemo(
    () =>
      buildServiceColumns({
        onOpenEdit: openEdit,
        onToggleStatus: openStatusToggle,
      }),
    [],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getServiceEmptyState(openCreate), [])

  const handleExport = useCallback(() => {
    downloadServiceCsv(listing.filteredRows)
    showToast({ title: 'Export started', variant: 'success' })
  }, [listing.filteredRows, showToast])

  const handleRefresh = useCallback(() => {
    loadRows()
    showToast({ title: 'List refreshed', variant: 'info' })
  }, [loadRows, showToast])

  const handleClearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS)
    listing.handleSearch('')
    listing.setColumnFilters({})
  }, [listing])

  const handleConfirmStatus = () => {
    if (!statusTarget) return
    setActionLoading(true)
    const nextStatus = statusTarget.status === 'active' ? 'inactive' : 'active'
    serviceMasterService.setStatus(statusTarget.id, nextStatus)
    setActionLoading(false)
    showToast({
      title: nextStatus === 'active' ? 'Service activated' : 'Service deactivated',
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

  const hasActiveFilters =
    (filters.category && filters.category !== 'all') ||
    (filters.currency && filters.currency !== 'all') ||
    Boolean(listing.tableState.searchQuery)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Service Master"
            description="Maintain services used in quotations, invoices, pricing, and billing."
            actions={
              <Button label="Add Service" startIcon={<Plus size={14} />} onClick={openCreate} />
            }
          />
        }
        toolbar={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <AdminListingToolbar
              searchValue={listing.tableState.searchQuery}
              onSearch={listing.handleSearch}
              searchPlaceholder="Search service code, name, category…"
              onExport={handleExport}
              columns={toolbarColumns}
              hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
              onHiddenColumnKeysChange={(keys) =>
                listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
              }
              moreMenuItems={[
                { label: 'Refresh list', onClick: handleRefresh },
                ...(hasActiveFilters
                  ? [{ label: 'Clear all filters', onClick: handleClearFilters }]
                  : []),
              ]}
            />
            <ServiceAdvancedFilters filters={filters} onChange={setFilters} />
          </Box>
        }
        listingContent={
          <AdminListingTable
            columns={columns}
            data={listing.paginatedRows}
            filterSourceData={listing.filterSourceRows}
            rowKey="id"
            state={listing.tableState}
            onStateChange={listing.setTableState}
            columnFilters={listing.columnFilters}
            onColumnFiltersChange={listing.setColumnFilters}
            getCellValue={getServiceCellValue}
            stickyHeader
            enableColumnSort={false}
            enableColumnFilters={false}
            loading={loading}
            emptyTitle={emptyState.emptyTitle}
            emptyDescription={emptyState.emptyDescription}
            emptyAction={emptyState.emptyAction}
          />
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

      <ServiceFormDrawer
        open={formOpen}
        record={editRecord}
        onClose={() => {
          setFormOpen(false)
          setEditRecord(null)
        }}
        onSaved={loadRows}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false)
          setStatusTarget(null)
        }}
        onConfirm={handleConfirmStatus}
        loading={actionLoading}
        title={statusTarget?.status === 'active' ? 'Deactivate service?' : 'Activate service?'}
        description={
          statusTarget
            ? `Set "${statusTarget.serviceName}" to ${statusTarget.status === 'active' ? 'inactive' : 'active'}?`
            : undefined
        }
        confirmLabel={statusTarget?.status === 'active' ? 'Deactivate' : 'Activate'}
      />
    </>
  )
}
