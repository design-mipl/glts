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
import { departmentService } from '@/shared/services/departmentService'
import type { DepartmentMaster } from '@/shared/types/departmentMaster'
import { DepartmentFormDrawer } from '../components/DepartmentFormDrawer'
import { buildDepartmentColumns } from '../components/DepartmentTableColumns'
import {
  downloadDepartmentCsv,
  getDepartmentCellValue,
  getDepartmentEmptyState,
  matchesDepartmentSearch,
} from '../utils/departmentListingUtils'

export function DepartmentListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<DepartmentMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<DepartmentMaster | null>(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [statusTarget, setStatusTarget] = useState<DepartmentMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(departmentService.list({ status: 'all' }))
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getDepartmentCellValue,
    searchMatch: matchesDepartmentSearch,
    initialPageSize: 10,
  })

  const openDetail = (row: DepartmentMaster) =>
    navigate(`/admin/user-management/departments/${row.id}`)
  const openEdit = (row: DepartmentMaster) => {
    setEditRecord(row)
    setFormOpen(true)
  }
  const openCreate = () => {
    setEditRecord(null)
    setFormOpen(true)
  }
  const openStatusToggle = (row: DepartmentMaster) => {
    setStatusTarget(row)
    setStatusOpen(true)
  }

  const columns = useMemo(
    () =>
      buildDepartmentColumns({
        onOpenDetail: openDetail,
        onOpenEdit: openEdit,
        onToggleStatus: openStatusToggle,
      }),
    [navigate],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getDepartmentEmptyState(openCreate), [])

  const handleExport = useCallback(() => {
    downloadDepartmentCsv(listing.filteredRows)
    showToast({ title: 'Export started', variant: 'success' })
  }, [listing.filteredRows, showToast])

  const handleConfirmStatus = () => {
    if (!statusTarget) return
    setActionLoading(true)
    const nextStatus = statusTarget.status === 'active' ? 'inactive' : 'active'
    departmentService.setStatus(statusTarget.id, nextStatus)
    setActionLoading(false)
    showToast({
      title: nextStatus === 'active' ? 'Department activated' : 'Department deactivated',
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
            title="Department"
            description="Manage organizational departments. User assignment happens in User & permission."
            actions={
              <Button label="Add Department" startIcon={<Plus size={14} />} onClick={openCreate} />
            }
          />
        }
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search department name or description…"
            onExport={handleExport}
            columns={toolbarColumns}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={(keys) =>
              listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
            }
          />
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
            getCellValue={getDepartmentCellValue}
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

      <DepartmentFormDrawer
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
        title={statusTarget?.status === 'active' ? 'Deactivate department?' : 'Activate department?'}
        description={
          statusTarget
            ? `Set "${statusTarget.name}" to ${statusTarget.status === 'active' ? 'inactive' : 'active'}?`
            : undefined
        }
        confirmLabel={statusTarget?.status === 'active' ? 'Deactivate' : 'Activate'}
      />
    </>
  )
}
