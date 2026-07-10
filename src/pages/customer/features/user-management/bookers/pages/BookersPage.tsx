import { useCallback, useEffect, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, ConfirmDialog, useToast } from '@/design-system/UIComponents'
import { bookerManagementService } from '@/shared/services/bookerManagementService'
import type { BookerUser } from '@/shared/types/bookerUser'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { CustomerListingShell } from '@/pages/customer/features/shared/components/listing/CustomerListingShell'
import { CustomerListingToolbar } from '@/pages/customer/features/shared/components/listing/CustomerListingToolbar'
import { CustomerListingTable } from '@/pages/customer/features/shared/components/listing/CustomerListingTable'
import { CustomerListingPagination } from '@/pages/customer/features/shared/components/listing/CustomerListingPagination'
import { CustomerListingGrid } from '@/pages/customer/features/shared/components/listing/CustomerListingGrid'
import { CustomerEmptyState } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import {
  BookerAdvancedFilterFields,
  EMPTY_BOOKER_LIST_FILTERS,
  hasBookerFiltersActive,
  type BookerListFilters,
} from '../components/BookerAdvancedFilters'
import { BookerFormDrawer } from '../components/BookerFormDrawer'
import { BookerPasswordDialog } from '../components/BookerPasswordDialog'
import { buildBookerColumns } from '../components/BookerTableColumns'
import {
  downloadBookerCsv,
  getBookerCellValue,
  mapBookerRowsToGridItems,
  matchesBookerSearch,
} from '../utils/bookerListingUtils'

export function BookersPage() {
  const navigate = useNavigate()
  const { base, canAccessBookerManagement } = useCustomerPortalBase()
  const { showToast } = useToast()

  const [rows, setRows] = useState<BookerUser[]>([])
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [listFilters, setListFilters] = useState<BookerListFilters>(EMPTY_BOOKER_LIST_FILTERS)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editBooker, setEditBooker] = useState<BookerUser | undefined>()
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [activeRecord, setActiveRecord] = useState<BookerUser | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [passwordBooker, setPasswordBooker] = useState<BookerUser>()
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false)
  const [passwordUpdating, setPasswordUpdating] = useState(false)

  const loadRows = useCallback(() => {
    setRows(bookerManagementService.listForSession())
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const filteredByAdvanced = useMemo(() => {
    return rows.filter(row => {
      if (listFilters.status !== 'all' && row.status !== listFilters.status) return false
      if (listFilters.location !== 'all' && row.location !== listFilters.location) return false
      if (listFilters.createdBy !== 'all' && row.createdBy !== listFilters.createdBy) return false
      return true
    })
  }, [rows, listFilters])

  const listing = useCustomerListing({
    rows: filteredByAdvanced,
    getCellValue: getBookerCellValue,
    searchMatch: matchesBookerSearch,
    initialPageSize: 10,
  })

  const paginatedRows = useMemo(() => {
    const start = listing.tableState.page * listing.tableState.pageSize
    return listing.filteredRows.slice(start, start + listing.tableState.pageSize)
  }, [listing.filteredRows, listing.tableState.page, listing.tableState.pageSize])

  const openEdit = (record: BookerUser) => {
    setEditBooker(record)
    setDrawerOpen(true)
  }

  const handleSendLogin = (record: BookerUser) => {
    const payload = bookerManagementService.sendLoginEmail(record.id)
    if (!payload) {
      showToast({ title: 'Could not send credentials', variant: 'error' })
      return
    }
    loadRows()
    showToast({
      title: 'Login credentials sent',
      description: `${payload.portalUrl} · ${payload.username} · ${payload.temporaryPassword}`,
      variant: 'success',
    })
  }

  const handleChangePassword = (password: string) => {
    if (!passwordBooker) return
    setPasswordUpdating(true)
    const payload = bookerManagementService.changePassword(passwordBooker.id, password)
    setPasswordUpdating(false)
    if (!payload) {
      showToast({ title: 'Could not update password', variant: 'error' })
      return
    }
    setPasswordDialogOpen(false)
    setPasswordBooker(undefined)
    loadRows()
    showToast({
      title: 'Password updated',
      description: `${payload.username} · ${payload.temporaryPassword}`,
      variant: 'success',
    })
  }

  const columns = useMemo(
    () =>
      buildBookerColumns({
        onOpenDetail: row => navigate(`${base}/users/bookers/${row.id}`),
        onOpenEdit: openEdit,
        onSendLogin: handleSendLogin,
        onChangePassword: record => {
          setPasswordBooker(record)
          setPasswordDialogOpen(true)
        },
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

  if (!canAccessBookerManagement) {
    return (
      <CustomerEmptyState
        title="Access restricted"
        description="Only Super Admins and Admins can manage booker users."
        actionLabel="Back to dashboard"
        onAction={() => navigate(`${base}/dashboard`)}
      />
    )
  }

  return (
    <>
      <CustomerListingShell
        title="Booker management"
        subtitle="Create and manage booker users who can create visa applications."
        headerActions={
          <Button
            variant="contained"
            label="Add booker"
            startIcon={<Plus size={14} />}
            onClick={() => {
              setEditBooker(undefined)
              setDrawerOpen(true)
            }}
          />
        }
        toolbar={
          <CustomerListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search bookers…"
            onExport={() => {
              downloadBookerCsv(listing.filteredRows)
              showToast({ title: 'Export complete', variant: 'success' })
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={columns.filter(c => c.key !== 'actions').map(c => ({ key: c.key, label: c.label }))}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={keys => listing.setTableState(s => ({ ...s, hiddenColumnKeys: keys }))}
            filterPopover={{
              active: hasBookerFiltersActive(listFilters),
              value: listFilters,
              onApply: next => {
                setListFilters(next)
                listing.setTableState(s => ({ ...s, page: 0 }))
              },
              onClear: () => setListFilters(EMPTY_BOOKER_LIST_FILTERS),
              hasActive: hasBookerFiltersActive,
              children: (draft, patch) => (
                <BookerAdvancedFilterFields draft={draft} patch={patch} />
              ),
            }}
          />
        }
        table={
          viewMode === 'table' ? (
            <CustomerListingTable<BookerUser>
              columns={columns}
              data={paginatedRows}
              filterSourceData={listing.filterSourceRows}
              rowKey="id"
              state={listing.tableState}
              onStateChange={listing.setTableState}
              columnFilters={listing.columnFilters}
              onColumnFiltersChange={listing.setColumnFilters}
              getCellValue={getBookerCellValue}
              onRowClick={row => navigate(`${base}/users/bookers/${row.id}`)}
              emptyTitle="No bookers found"
              emptyDescription="Add a booker to grant application creation access."
            />
          ) : (
            <CustomerListingGrid
              items={mapBookerRowsToGridItems(paginatedRows)}
              onItemClick={id => navigate(`${base}/users/bookers/${id}`)}
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

      <BookerFormDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        initial={editBooker}
        onSaved={record => {
          loadRows()
          showToast({
            title: editBooker ? 'Booker updated' : 'Booker created',
            description: `${record.fullName} saved successfully.`,
            variant: 'success',
          })
        }}
      />

      <BookerPasswordDialog
        open={passwordDialogOpen}
        booker={passwordBooker}
        onClose={() => {
          setPasswordDialogOpen(false)
          setPasswordBooker(undefined)
        }}
        onConfirm={handleChangePassword}
        loading={passwordUpdating}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title={activeRecord?.status === 'active' ? 'Deactivate user?' : 'Activate user?'}
        description={
          activeRecord
            ? activeRecord.status === 'active'
              ? `${activeRecord.fullName} will lose portal login access until reactivated.`
              : `${activeRecord.fullName} will be able to sign in to the corporate portal again.`
            : 'Update portal access for this booker.'
        }
        confirmLabel={activeRecord?.status === 'active' ? 'Deactivate' : 'Activate'}
        variant={activeRecord?.status === 'active' ? 'destructive' : 'default'}
        onConfirm={() => {
          if (!activeRecord) return
          setActionLoading(true)
          const next = activeRecord.status === 'active' ? 'inactive' : 'active'
          bookerManagementService.setStatus(activeRecord.id, next)
          showToast({ title: `Booker ${next === 'active' ? 'activated' : 'deactivated'}`, variant: 'success' })
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
        title="Delete / archive booker?"
        description={`${activeRecord?.fullName ?? 'This booker'} will be permanently removed.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={() => {
          if (!activeRecord) return
          setActionLoading(true)
          const result = bookerManagementService.remove(activeRecord.id)
          if (result.ok) {
            showToast({ title: 'Booker archived', variant: 'success' })
            loadRows()
          } else {
            showToast({ title: 'Cannot delete', description: 'Booker account is in use.', variant: 'warning' })
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
