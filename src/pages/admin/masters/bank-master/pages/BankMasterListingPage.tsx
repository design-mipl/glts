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
import { bankMasterService } from '@/shared/services/bankMasterService'
import type { BankMaster } from '@/shared/types/bankMaster'
import { BankMasterFormModal } from '../components/BankMasterFormModal'
import { buildBankMasterColumns } from '../components/BankMasterTableColumns'
import {
  downloadBankMasterCsv,
  getBankMasterCellValue,
  getBankMasterEmptyState,
  matchesBankMasterSearch,
} from '../utils/bankMasterListingUtils'

export function BankMasterListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [rows, setRows] = useState<BankMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<BankMaster | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<BankMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(bankMasterService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getBankMasterCellValue,
    searchMatch: matchesBankMasterSearch,
    initialPageSize: 10,
  })

  const openEdit = (row: BankMaster) => {
    setEditRecord(row)
    setFormOpen(true)
  }

  const openCreate = () => {
    setEditRecord(null)
    setFormOpen(true)
  }

  const openDelete = (row: BankMaster) => {
    setDeleteTarget(row)
    setDeleteOpen(true)
  }

  const columns = useMemo(
    () =>
      buildBankMasterColumns({
        onOpenEdit: openEdit,
        onDelete: openDelete,
      }),
    [],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getBankMasterEmptyState(openCreate), [])

  const handleExport = useCallback(() => {
    downloadBankMasterCsv(listing.filteredRows)
    showToast({ title: 'Export started', variant: 'success' })
  }, [listing.filteredRows, showToast])

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    setActionLoading(true)
    bankMasterService.delete(deleteTarget.id)
    setActionLoading(false)
    showToast({
      title: 'Bank deleted',
      variant: 'success',
    })
    setDeleteOpen(false)
    setDeleteTarget(null)
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
            title="Bank Master"
            description="Manage banks used across operations and fund allocation."
            actions={
              <Button label="Add bank" startIcon={<Plus size={14} />} onClick={openCreate} />
            }
          />
        }
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search bank name…"
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
            getCellValue={getBankMasterCellValue}
            stickyHeader
            enableColumnSort
            enableColumnFilters
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

      <BankMasterFormModal
        open={formOpen}
        record={editRecord}
        onClose={() => {
          setFormOpen(false)
          setEditRecord(null)
        }}
        onSaved={loadRows}
      />

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false)
          setDeleteTarget(null)
        }}
        onConfirm={handleConfirmDelete}
        loading={actionLoading}
        title="Delete bank?"
        description={
          deleteTarget
            ? `Remove "${deleteTarget.bankName}" from the bank master? This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        variant="destructive"
      />
    </>
  )
}
