import { useCallback, useEffect, useMemo, useState } from 'react'
import { Typography } from '@mui/material'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { getPrimaryButtonSx, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { adminManagementService } from '@/shared/services/adminManagementService'
import type { AdminUser } from '@/shared/types/adminUser'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { CustomerListingShell } from '@/pages/customer/features/shared/components/listing/CustomerListingShell'
import { CustomerListingToolbar } from '@/pages/customer/features/shared/components/listing/CustomerListingToolbar'
import { CustomerListingTable } from '@/pages/customer/features/shared/components/listing/CustomerListingTable'
import { CustomerListingPagination } from '@/pages/customer/features/shared/components/listing/CustomerListingPagination'
import { CustomerListingGrid } from '@/pages/customer/features/shared/components/listing/CustomerListingGrid'
import { AdminAdvancedFilters } from '../components/AdminAdvancedFilters'
import { AdminFormDrawer } from '../components/AdminFormDrawer'
import { buildAdminColumns } from '../components/AdminTableColumns'
import {
  downloadAdminCsv,
  getAdminCellValue,
  mapAdminRowsToGridItems,
  matchesAdminSearch,
} from '../utils/adminListingUtils'

export function AdminListingPage() {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { base, canAccessAdminManagement } = useCustomerPortalBase()
  const { showToast } = useToast()

  const [rows, setRows] = useState<AdminUser[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [statusFilter, setStatusFilter] = useState('all')
  const [locationFilter, setLocationFilter] = useState('all')
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editAdmin, setEditAdmin] = useState<AdminUser | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [activeRecord, setActiveRecord] = useState<AdminUser | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setRows(adminManagementService.list())
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const filteredByAdvanced = useMemo(() => {
    return rows.filter(row => {
      if (statusFilter !== 'all' && row.status !== statusFilter) return false
      if (locationFilter !== 'all' && row.location !== locationFilter) return false
      return true
    })
  }, [rows, statusFilter, locationFilter])

  const listing = useCustomerListing({
    rows: filteredByAdvanced,
    getCellValue: getAdminCellValue,
    searchMatch: matchesAdminSearch,
    initialPageSize: 10,
  })

  const paginatedRows = useMemo(() => {
    const start = listing.tableState.page * listing.tableState.pageSize
    return listing.filteredRows.slice(start, start + listing.tableState.pageSize)
  }, [listing.filteredRows, listing.tableState.page, listing.tableState.pageSize])

  const openEdit = (record: AdminUser) => {
    setEditAdmin(record)
    setDrawerOpen(true)
  }

  const handleResendInvite = (record: AdminUser) => {
    adminManagementService.resendInvite(record.id)
    loadRows()
    showToast({
      title: 'Invite sent',
      description: `Password reset / invite email sent to ${record.email}.`,
      variant: 'success',
    })
  }

  const columns = useMemo(
    () =>
      buildAdminColumns({
        onOpenDetail: row => navigate(`${base}/users/admins/${row.id}`),
        onOpenEdit: openEdit,
        onToggleStatus: record => {
          setActiveRecord(record)
          setStatusOpen(true)
        },
        onResendInvite: handleResendInvite,
        onDelete: record => {
          setActiveRecord(record)
          setDeleteOpen(true)
        },
      }),
    [base, navigate],
  )

  if (!canAccessAdminManagement) {
    return (
      <>
        <Typography sx={{ fontWeight: 800, fontSize: '20px', mb: 1 }}>Admin management</Typography>
        <Typography sx={{ fontSize: '14px', color: 'text.secondary' }}>
          Only Super Admins can manage admin users. Sign in with admin@glts.com.
        </Typography>
      </>
    )
  }

  return (
    <>
      <CustomerListingShell
        title="Admin management"
        subtitle="Create and manage admin users for the customer portal."
        headerActions={
          <Button
            variant="contained"
            startIcon={<Plus size={16} />}
            onClick={() => {
              setEditAdmin(undefined)
              setDrawerOpen(true)
            }}
            sx={{ ...getPrimaryButtonSx(colors) }}
          >
            Add admin
          </Button>
        }
        toolbar={
          <CustomerListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search admins…"
            onExport={() => {
              downloadAdminCsv(listing.filteredRows)
              showToast({ title: 'Export complete', variant: 'success' })
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={columns.filter(c => c.key !== 'actions').map(c => ({ key: c.key, label: c.label }))}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={keys => listing.setTableState(s => ({ ...s, hiddenColumnKeys: keys }))}
          />
        }
        advancedFilters={
          <AdminAdvancedFilters
            status={statusFilter}
            location={locationFilter}
            onStatusChange={v => {
              setStatusFilter(v)
              listing.setTableState(s => ({ ...s, page: 0 }))
            }}
            onLocationChange={v => {
              setLocationFilter(v)
              listing.setTableState(s => ({ ...s, page: 0 }))
            }}
          />
        }
        table={
          viewMode === 'table' ? (
            <CustomerListingTable<AdminUser>
              columns={columns}
              data={paginatedRows}
              filterSourceData={listing.filterSourceRows}
              rowKey="id"
              state={listing.tableState}
              onStateChange={listing.setTableState}
              columnFilters={listing.columnFilters}
              onColumnFiltersChange={listing.setColumnFilters}
              getCellValue={getAdminCellValue}
              onRowClick={row => navigate(`${base}/users/admins/${row.id}`)}
              emptyTitle="No admins found"
              emptyDescription="Add an admin to grant portal access."
            />
          ) : (
            <CustomerListingGrid
              items={mapAdminRowsToGridItems(paginatedRows)}
              onItemClick={id => navigate(`${base}/users/admins/${id}`)}
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

      <AdminFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editAdmin}
        onSaved={record => {
          loadRows()
          showToast({
            title: editAdmin ? 'Admin updated' : 'Admin created',
            description: `${record.fullName} saved successfully.`,
            variant: 'success',
          })
        }}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title={activeRecord?.status === 'active' ? 'Inactivate admin?' : 'Activate admin?'}
        description={`${activeRecord?.fullName ?? 'This admin'} will be marked as ${activeRecord?.status === 'active' ? 'inactive' : 'active'}.`}
        confirmLabel={activeRecord?.status === 'active' ? 'Inactivate' : 'Activate'}
        onConfirm={() => {
          if (!activeRecord) return
          setActionLoading(true)
          const next = activeRecord.status === 'active' ? 'inactive' : 'active'
          adminManagementService.setStatus(activeRecord.id, next)
          showToast({ title: `Admin ${next === 'active' ? 'activated' : 'inactivated'}`, variant: 'success' })
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
        title="Delete / archive admin?"
        description={`${activeRecord?.fullName ?? 'This admin'} will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (!activeRecord) return
          setActionLoading(true)
          const result = adminManagementService.remove(activeRecord.id)
          if (result.ok) {
            showToast({ title: 'Admin archived', variant: 'success' })
            loadRows()
          } else {
            showToast({ title: 'Cannot delete', description: 'Admin account is in use.', variant: 'warning' })
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
