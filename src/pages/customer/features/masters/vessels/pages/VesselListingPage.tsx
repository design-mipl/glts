import { useCallback, useEffect, useMemo, useState } from 'react'
import { Typography } from '@mui/material'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import type { VesselMaster } from '@/shared/types/vesselMaster'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { CustomerListingShell } from '@/pages/customer/features/shared/components/listing/CustomerListingShell'
import { CustomerListingToolbar } from '@/pages/customer/features/shared/components/listing/CustomerListingToolbar'
import { CustomerListingTable } from '@/pages/customer/features/shared/components/listing/CustomerListingTable'
import { CustomerListingPagination } from '@/pages/customer/features/shared/components/listing/CustomerListingPagination'
import { CustomerListingGrid } from '@/pages/customer/features/shared/components/listing/CustomerListingGrid'
import { VesselFormDrawer } from '../components/VesselFormDrawer'
import { buildVesselColumns } from '../components/VesselTableColumns'
import {
  downloadVesselCsv,
  getVesselCellValue,
  mapVesselRowsToGridItems,
  matchesVesselSearch,
} from '../utils/vesselListingUtils'

export function VesselListingPage() {
  const navigate = useNavigate()
  const { base, canAccessMasters } = useCustomerPortalBase()
  const { showToast } = useToast()

  const [rows, setRows] = useState<VesselMaster[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editVessel, setEditVessel] = useState<VesselMaster | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [activeRecord, setActiveRecord] = useState<VesselMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setRows(vesselMasterService.list())
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getVesselCellValue,
    searchMatch: matchesVesselSearch,
    initialPageSize: 10,
  })

  const paginatedRows = useMemo(() => {
    const start = listing.tableState.page * listing.tableState.pageSize
    return listing.filteredRows.slice(start, start + listing.tableState.pageSize)
  }, [listing.filteredRows, listing.tableState.page, listing.tableState.pageSize])

  const openEdit = (record: VesselMaster) => {
    setEditVessel(record)
    setDrawerOpen(true)
  }

  const columns = useMemo(
    () =>
      buildVesselColumns({
        onOpenDetail: row => navigate(`${base}/masters/vessels/${row.id}`),
        onOpenEdit: openEdit,
        onToggleStatus: record => {
          setActiveRecord(record)
          setStatusOpen(true)
        },
        onDelete: record => {
          setActiveRecord(record)
          setDeleteOpen(true)
        },
      }),
    [base, navigate],
  )

  if (!canAccessMasters) {
    return (
      <>
        <Typography sx={{ fontWeight: 800, fontSize: '20px', mb: 1 }}>Vessel master</Typography>
        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
          Only Super Admins and Admins can manage vessels. Sign in with admin@glts.com or an admin account.
        </Typography>
      </>
    )
  }

  return (
    <>
      <CustomerListingShell
        title="Vessel master"
        subtitle="Manage vessels linked to your organization for marine visa workflows."
        headerActions={
          <Button
            variant="contained"
            label="Add vessel"
            startIcon={<Plus size={14} />}
            onClick={() => {
              setEditVessel(undefined)
              setDrawerOpen(true)
            }}
          />
        }
        toolbar={
          <CustomerListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search vessels…"
            onExport={() => {
              downloadVesselCsv(listing.filteredRows)
              showToast({ title: 'Export complete', variant: 'success' })
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={columns.filter(c => c.key !== 'actions').map(c => ({ key: c.key, label: c.label }))}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={keys => listing.setTableState(s => ({ ...s, hiddenColumnKeys: keys }))}
          />
        }
        table={
          viewMode === 'table' ? (
            <CustomerListingTable<VesselMaster>
              columns={columns}
              data={paginatedRows}
              filterSourceData={listing.filterSourceRows}
              rowKey="id"
              state={listing.tableState}
              onStateChange={listing.setTableState}
              columnFilters={listing.columnFilters}
              onColumnFiltersChange={listing.setColumnFilters}
              getCellValue={getVesselCellValue}
              onRowClick={row => navigate(`${base}/masters/vessels/${row.id}`)}
              emptyTitle="No vessels found"
              emptyDescription="Add a vessel to support marine application workflows."
            />
          ) : (
            <CustomerListingGrid
              items={mapVesselRowsToGridItems(paginatedRows)}
              onItemClick={id => navigate(`${base}/masters/vessels/${id}`)}
            />
          )
        }
        pagination={
          <CustomerListingPagination
            page={listing.tableState.page}
            pageSize={listing.tableState.pageSize}
            total={listing.filteredRows.length}
            onPage={page => listing.setTableState(s => ({ ...s, page }))}
            onPageSize={pageSize => listing.setTableState(s => ({ ...s, pageSize, page: 0 }))}
          />
        }
      />

      <VesselFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editVessel}
        onSaved={record => {
          loadRows()
          showToast({
            title: editVessel ? 'Vessel updated' : 'Vessel created',
            description: `${record.vesselName} saved successfully.`,
            variant: 'success',
          })
        }}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title={activeRecord?.status === 'active' ? 'Inactivate vessel?' : 'Activate vessel?'}
        description={`${activeRecord?.vesselName ?? 'This vessel'} will be marked as ${activeRecord?.status === 'active' ? 'inactive' : 'active'}.`}
        confirmLabel={activeRecord?.status === 'active' ? 'Inactivate' : 'Activate'}
        onConfirm={() => {
          if (!activeRecord) return
          setActionLoading(true)
          const next = activeRecord.status === 'active' ? 'inactive' : 'active'
          vesselMasterService.setStatus(activeRecord.id, next)
          showToast({ title: `Vessel ${next === 'active' ? 'activated' : 'inactivated'}`, variant: 'success' })
          loadRows()
          setStatusOpen(false)
          setActiveRecord(null)
          setActionLoading(false)
        }}
        loading={actionLoading}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete / archive vessel?"
        description={`${activeRecord?.vesselName ?? 'This vessel'} will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (!activeRecord) return
          setActionLoading(true)
          const result = vesselMasterService.remove(activeRecord.id)
          if (result.ok) {
            showToast({ title: 'Vessel archived', variant: 'success' })
            loadRows()
          } else {
            showToast({ title: 'Cannot delete', description: 'Vessel is linked to active applications.', variant: 'warning' })
          }
          setDeleteOpen(false)
          setActiveRecord(null)
          setActionLoading(false)
        }}
        loading={actionLoading}
      />
    </>
  )
}
