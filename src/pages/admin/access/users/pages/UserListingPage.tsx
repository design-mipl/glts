import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import type { AdminPortalUser, AdminPortalUserListFilters } from '@/shared/types/adminPortalUser'
import { UserAdvancedFilters } from '../components/UserAdvancedFilters'
import { buildUserColumns } from '../components/UserTableColumns'
import {
  downloadUserCsv,
  getUserCellValue,
  getUserEmptyState,
  matchesUserSearch,
} from '../utils/userListingUtils'

const EMPTY_FILTERS: AdminPortalUserListFilters = {
  status: 'all',
  teamId: 'all',
  designation: 'all',
}

export function UserListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<AdminPortalUser[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<AdminPortalUserListFilters>(EMPTY_FILTERS)
  const [statusOpen, setStatusOpen] = useState(false)
  const [statusTarget, setStatusTarget] = useState<AdminPortalUser | null>(null)
  const [superAdminConfirm, setSuperAdminConfirm] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(adminPortalUserService.list(filters))
    setLoading(false)
  }, [filters])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getUserCellValue,
    searchMatch: matchesUserSearch,
    initialPageSize: 10,
  })

  const openDetail = (row: AdminPortalUser) => navigate(`/admin/access/users/${row.id}`)
  const openEdit = (row: AdminPortalUser) => navigate(`/admin/access/users/${row.id}/edit`)
  const openConfigurePermissions = (row: AdminPortalUser) =>
    navigate(`/admin/access/users/${row.id}/permissions`)
  const openCreate = () => navigate('/admin/access/users/new')

  const openStatusToggle = (row: AdminPortalUser) => {
    setStatusTarget(row)
    setSuperAdminConfirm(false)
    setStatusOpen(true)
  }

  const handleResetPassword = (row: AdminPortalUser) => {
    adminPortalUserService.resetPassword(row.id)
    showToast({ title: 'Password reset initiated', variant: 'success' })
  }

  const columns = useMemo(
    () =>
      buildUserColumns({
        onOpenDetail: openDetail,
        onOpenEdit: openEdit,
        onConfigurePermissions: openConfigurePermissions,
        onToggleStatus: openStatusToggle,
        onResetPassword: handleResetPassword,
      }),
    [navigate, showToast],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getUserEmptyState(openCreate), [])

  const handleExport = useCallback(() => {
    downloadUserCsv(listing.filteredRows)
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
    if (
      statusTarget.isSuperAdmin &&
      statusTarget.status === 'active' &&
      !superAdminConfirm
    ) {
      setSuperAdminConfirm(true)
      return
    }
    setActionLoading(true)
    const nextStatus = statusTarget.status === 'active' ? 'inactive' : 'active'
    const result = adminPortalUserService.setStatus(statusTarget.id, nextStatus, {
      confirmSuperAdmin: statusTarget.isSuperAdmin && nextStatus === 'inactive',
    })
    setActionLoading(false)
    if (result && 'error' in result) return
    showToast({
      title: nextStatus === 'active' ? 'User activated' : 'User deactivated',
      description:
        nextStatus === 'inactive'
          ? 'Login access is blocked. Historical data and logs are preserved.'
          : undefined,
      variant: 'success',
    })
    setStatusOpen(false)
    setStatusTarget(null)
    setSuperAdminConfirm(false)
    loadRows()
  }

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  const hasActiveFilters =
    (filters.teamId && filters.teamId !== 'all') ||
    (filters.designation && filters.designation !== 'all') ||
    Boolean(listing.tableState.searchQuery)

  const statusDialogDescription = statusTarget
    ? statusTarget.isSuperAdmin &&
      statusTarget.status === 'active' &&
      superAdminConfirm
      ? 'This will disable the only Super Admin account. Admin login access will be blocked until another Super Admin is activated.'
      : statusTarget.status === 'active'
        ? `Deactivate "${statusTarget.fullName}"? Login access will be blocked. User data and activity logs will be preserved.`
        : `Activate "${statusTarget.fullName}"?`
    : undefined

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="User & permission"
            description="Manage admin users, team assignment, and module permissions."
            actions={
              <Button label="Add User" startIcon={<Plus size={14} />} onClick={openCreate} />
            }
          />
        }
        toolbar={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <AdminListingToolbar
              searchValue={listing.tableState.searchQuery}
              onSearch={listing.handleSearch}
              searchPlaceholder="Search user name, email, or team…"
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
            <UserAdvancedFilters filters={filters} onChange={setFilters} />
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
            getCellValue={getUserCellValue}
            onRowClick={openDetail}
            stickyHeader
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

      <ConfirmDialog
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false)
          setStatusTarget(null)
          setSuperAdminConfirm(false)
        }}
        onConfirm={handleConfirmStatus}
        loading={actionLoading}
        title={
          statusTarget?.status === 'active'
            ? superAdminConfirm && statusTarget.isSuperAdmin
              ? 'Deactivate Super Admin?'
              : 'Deactivate user?'
            : 'Activate user?'
        }
        description={statusDialogDescription}
        confirmLabel={
          statusTarget?.status === 'active'
            ? superAdminConfirm && statusTarget?.isSuperAdmin
              ? 'Deactivate Super Admin'
              : 'Deactivate'
            : 'Activate'
        }
        variant={statusTarget?.status === 'active' ? 'destructive' : 'default'}
      />
    </>
  )
}
