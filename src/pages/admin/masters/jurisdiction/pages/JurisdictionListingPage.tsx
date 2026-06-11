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
import { jurisdictionMasterService } from '@/shared/services/jurisdictionMasterService'
import type { JurisdictionMaster } from '@/shared/types/jurisdictionMaster'
import { JurisdictionFormModal } from '../components/JurisdictionFormModal'
import { buildJurisdictionColumns } from '../components/JurisdictionTableColumns'
import {
  downloadJurisdictionCsv,
  getJurisdictionCellValue,
  getJurisdictionEmptyState,
  matchesJurisdictionSearch,
} from '../utils/jurisdictionListingUtils'

export function JurisdictionListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [rows, setRows] = useState<JurisdictionMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<JurisdictionMaster | null>(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [statusTarget, setStatusTarget] = useState<JurisdictionMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(jurisdictionMasterService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getJurisdictionCellValue,
    searchMatch: matchesJurisdictionSearch,
    initialPageSize: 10,
  })

  const openEdit = (row: JurisdictionMaster) => {
    setEditRecord(row)
    setFormOpen(true)
  }

  const openCreate = () => {
    setEditRecord(null)
    setFormOpen(true)
  }

  const openStatusToggle = (row: JurisdictionMaster) => {
    setStatusTarget(row)
    setStatusOpen(true)
  }

  const columns = useMemo(
    () =>
      buildJurisdictionColumns({
        onOpenEdit: openEdit,
        onToggleStatus: openStatusToggle,
      }),
    [],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getJurisdictionEmptyState(openCreate), [])

  const handleExport = useCallback(() => {
    downloadJurisdictionCsv(listing.filteredRows)
    showToast({ title: 'Export started', variant: 'success' })
  }, [listing.filteredRows, showToast])

  const handleRefresh = useCallback(() => {
    loadRows()
    showToast({ title: 'List refreshed', variant: 'info' })
  }, [loadRows, showToast])

  const handleClearFilters = useCallback(() => {
    listing.handleSearch('')
    listing.setColumnFilters({})
  }, [listing])

  const handleConfirmStatus = () => {
    if (!statusTarget) return
    setActionLoading(true)
    const nextStatus = statusTarget.status === 'active' ? 'inactive' : 'active'
    jurisdictionMasterService.setStatus(statusTarget.id, nextStatus)
    setActionLoading(false)
    showToast({
      title: nextStatus === 'active' ? 'Jurisdiction activated' : 'Jurisdiction deactivated',
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

  const hasActiveFilters = Boolean(listing.tableState.searchQuery)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Jurisdiction Master"
            description="Manage consulate and VFS processing jurisdictions."
            actions={
              <Button label="Add jurisdiction" startIcon={<Plus size={14} />} onClick={openCreate} />
            }
          />
        }
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search jurisdiction name or description…"
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
            getCellValue={getJurisdictionCellValue}
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

      <JurisdictionFormModal
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
        title={
          statusTarget?.status === 'active' ? 'Deactivate jurisdiction?' : 'Activate jurisdiction?'
        }
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
