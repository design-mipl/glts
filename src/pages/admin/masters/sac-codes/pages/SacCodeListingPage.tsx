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
import { sacCodeMasterService } from '@/shared/services/sacCodeMasterService'
import type { SacCodeMaster, SacCodeMasterListFilters } from '@/shared/types/sacCodeMaster'
import { SacCodeAdvancedFilters } from '../components/SacCodeAdvancedFilters'
import { SacCodeFormDrawer } from '../components/SacCodeFormDrawer'
import { buildSacCodeColumns } from '../components/SacCodeTableColumns'
import {
  downloadSacCodeCsv,
  getSacCodeCellValue,
  getSacCodeEmptyState,
  matchesSacCodeSearch,
} from '../utils/sacCodeListingUtils'

const EMPTY_FILTERS: SacCodeMasterListFilters = { status: 'all', category: 'all' }

export function SacCodeListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [rows, setRows] = useState<SacCodeMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<SacCodeMasterListFilters>(EMPTY_FILTERS)
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<SacCodeMaster | null>(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [statusTarget, setStatusTarget] = useState<SacCodeMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(sacCodeMasterService.list(filters))
    setLoading(false)
  }, [filters])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getSacCodeCellValue,
    searchMatch: matchesSacCodeSearch,
    initialPageSize: 10,
  })

  const openEdit = (row: SacCodeMaster) => {
    setEditRecord(row)
    setFormOpen(true)
  }

  const openCreate = () => {
    setEditRecord(null)
    setFormOpen(true)
  }

  const openStatusToggle = (row: SacCodeMaster) => {
    setStatusTarget(row)
    setStatusOpen(true)
  }

  const columns = useMemo(
    () =>
      buildSacCodeColumns({
        onOpenEdit: openEdit,
        onToggleStatus: openStatusToggle,
      }),
    [],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getSacCodeEmptyState(openCreate), [])

  const handleExport = useCallback(() => {
    downloadSacCodeCsv(listing.filteredRows)
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
    sacCodeMasterService.setStatus(statusTarget.id, nextStatus)
    setActionLoading(false)
    showToast({
      title: nextStatus === 'active' ? 'SAC code activated' : 'SAC code deactivated',
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
    Boolean(listing.tableState.searchQuery)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="SAC Code Master"
            description="Service classification codes and default tax mapping for invoicing."
            actions={
              <Button label="Add SAC Code" startIcon={<Plus size={14} />} onClick={openCreate} />
            }
          />
        }
        toolbar={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <AdminListingToolbar
              searchValue={listing.tableState.searchQuery}
              onSearch={listing.handleSearch}
              searchPlaceholder="Search SAC code, title, or category…"
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
            <SacCodeAdvancedFilters filters={filters} onChange={setFilters} />
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
            getCellValue={getSacCodeCellValue}
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

      <SacCodeFormDrawer
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
          statusTarget?.status === 'active' ? 'Deactivate SAC code?' : 'Activate SAC code?'
        }
        description={
          statusTarget
            ? `Set "${statusTarget.sacCode}" to ${statusTarget.status === 'active' ? 'inactive' : 'active'}?`
            : undefined
        }
        confirmLabel={statusTarget?.status === 'active' ? 'Deactivate' : 'Activate'}
      />
    </>
  )
}
