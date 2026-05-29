import { useCallback, useEffect, useMemo, useState } from 'react'
import { Typography } from '@mui/material'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { getPrimaryButtonSx, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { entityMasterService } from '@/shared/services/entityMasterService'
import type { EntityMaster } from '@/shared/types/entityMaster'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { CustomerListingShell } from '@/pages/customer/features/shared/components/listing/CustomerListingShell'
import { CustomerListingToolbar } from '@/pages/customer/features/shared/components/listing/CustomerListingToolbar'
import { CustomerListingTable } from '@/pages/customer/features/shared/components/listing/CustomerListingTable'
import { CustomerListingPagination } from '@/pages/customer/features/shared/components/listing/CustomerListingPagination'
import { CustomerListingGrid } from '@/pages/customer/features/shared/components/listing/CustomerListingGrid'
import { EntityAdvancedFilters } from '../components/EntityAdvancedFilters'
import { EntityFormDrawer } from '../components/EntityFormDrawer'
import { buildEntityColumns } from '../components/EntityTableColumns'
import {
  downloadEntityCsv,
  getEntityCellValue,
  mapEntityRowsToGridItems,
  matchesEntitySearch,
} from '../utils/entityListingUtils'

export function EntityListingPage() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { base, canAccessMasters } = useCustomerPortalBase()
  const { showToast } = useToast()

  const [rows, setRows] = useState<EntityMaster[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [countryFilter, setCountryFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editEntity, setEditEntity] = useState<EntityMaster | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [activeRecord, setActiveRecord] = useState<EntityMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setRows(entityMasterService.list())
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const filteredByAdvanced = useMemo(() => {
    return rows.filter(row => {
      if (countryFilter !== 'all' && row.country !== countryFilter) return false
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      return true
    })
  }, [rows, countryFilter, statusFilter])

  const listing = useCustomerListing({
    rows: filteredByAdvanced,
    getCellValue: getEntityCellValue,
    searchMatch: matchesEntitySearch,
    initialPageSize: 10,
  })

  const paginatedRows = useMemo(() => {
    const start = listing.tableState.page * listing.tableState.pageSize
    return listing.filteredRows.slice(start, start + listing.tableState.pageSize)
  }, [listing.filteredRows, listing.tableState.page, listing.tableState.pageSize])

  const countryOptions = useMemo(() => entityMasterService.getCountryOptions(), [rows])

  const openEdit = (record: EntityMaster) => {
    setEditEntity(record)
    setDrawerOpen(true)
  }

  const openDelete = (record: EntityMaster) => {
    setActiveRecord(record)
    setDeleteOpen(true)
  }

  const openStatusToggle = (record: EntityMaster) => {
    setActiveRecord(record)
    setStatusOpen(true)
  }

  const handleConfirmStatus = async () => {
    if (!activeRecord) return
    setActionLoading(true)
    const next = activeRecord.status === 'active' ? 'inactive' : 'active'
    entityMasterService.setStatus(activeRecord.id, next)
    showToast({
      title: next === 'active' ? 'Entity activated' : 'Entity inactivated',
      description: `${activeRecord.entityName} is now ${next}.`,
      variant: 'success',
    })
    loadRows()
    setStatusOpen(false)
    setActiveRecord(null)
    setActionLoading(false)
  }

  const handleConfirmDelete = async () => {
    if (!activeRecord) return
    setActionLoading(true)
    const result = entityMasterService.remove(activeRecord.id)
    if (result.ok) {
      showToast({ title: 'Entity archived', description: `${activeRecord.entityName} was removed.`, variant: 'success' })
      loadRows()
    } else if (result.reason === 'in_use') {
      showToast({
        title: 'Cannot delete',
        description: 'This entity is linked to active applications.',
        variant: 'warning',
      })
    }
    setDeleteOpen(false)
    setActiveRecord(null)
    setActionLoading(false)
  }

  const columns = useMemo(
    () =>
      buildEntityColumns({
        onOpenDetail: row => navigate(`${base}/masters/entities/${row.id}`),
        onOpenEdit: openEdit,
        onToggleStatus: openStatusToggle,
        onDelete: openDelete,
      }),
    [base, navigate],
  )

  if (!canAccessMasters) {
    return (
      <>
        <Typography sx={{ fontWeight: 800, fontSize: '20px', mb: 1 }}>Entity master</Typography>
        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
          Only Super Admins and Admins can manage entities. Sign in with admin@glts.com or an admin account.
        </Typography>
      </>
    )
  }

  return (
    <>
      <CustomerListingShell
        title="Entity master"
        subtitle="Manage child companies, branches, and subsidiaries under your organization."
        headerActions={
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => {
              setEditEntity(undefined)
              setDrawerOpen(true)
            }}
            sx={{ ...getPrimaryButtonSx(colors) }}
          >
            Add entity
          </Button>
        }
        toolbar={
          <CustomerListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search entities…"
            onExport={() => {
              downloadEntityCsv(listing.filteredRows)
              showToast({ title: 'Export complete', description: 'Entity list downloaded.', variant: 'success' })
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={columns.filter(c => c.key !== 'actions').map(c => ({ key: c.key, label: c.label }))}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={keys => listing.setTableState(s => ({ ...s, hiddenColumnKeys: keys }))}
          />
        }
        advancedFilters={
          <EntityAdvancedFilters
            country={countryFilter}
            status={statusFilter}
            countryOptions={countryOptions}
            onCountryChange={v => {
              setCountryFilter(v)
              listing.setTableState(s => ({ ...s, page: 0 }))
            }}
            onStatusChange={v => {
              setStatusFilter(v)
              listing.setTableState(s => ({ ...s, page: 0 }))
            }}
          />
        }
        table={
          viewMode === 'table' ? (
            <CustomerListingTable<EntityMaster>
              columns={columns}
              data={paginatedRows}
              filterSourceData={listing.filterSourceRows}
              rowKey="id"
              state={listing.tableState}
              onStateChange={listing.setTableState}
              columnFilters={listing.columnFilters}
              onColumnFiltersChange={listing.setColumnFilters}
              getCellValue={getEntityCellValue}
              onRowClick={row => navigate(`${base}/masters/entities/${row.id}`)}
              emptyTitle="No entities found"
              emptyDescription="Add a new entity to manage branches and subsidiaries."
            />
          ) : (
            <CustomerListingGrid
              items={mapEntityRowsToGridItems(paginatedRows)}
              onItemClick={id => navigate(`${base}/masters/entities/${id}`)}
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

      <EntityFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editEntity}
        onSaved={record => {
          loadRows()
          showToast({
            title: editEntity ? 'Entity updated' : 'Entity created',
            description: `${record.entityName} saved successfully.`,
            variant: 'success',
          })
        }}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title={activeRecord?.status === 'active' ? 'Inactivate entity?' : 'Activate entity?'}
        description={`${activeRecord?.entityName ?? 'This entity'} will be marked as ${activeRecord?.status === 'active' ? 'inactive' : 'active'}.`}
        confirmLabel={activeRecord?.status === 'active' ? 'Inactivate' : 'Activate'}
        onConfirm={handleConfirmStatus}
        loading={actionLoading}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete / archive entity?"
        description={`${activeRecord?.entityName ?? 'This entity'} will be permanently removed from the master list.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
      />
    </>
  )
}
