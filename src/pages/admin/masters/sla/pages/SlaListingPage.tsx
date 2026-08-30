import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button, ConfirmDialog, Pagination, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { slaMasterService } from '@/shared/services/slaMasterService'
import type { SlaMaster } from '@/shared/types/slaMaster'
import { SlaFormDrawer } from '../components/SlaFormDrawer'
import { buildSlaColumns } from '../components/SlaTableColumns'
import { SlaViewModal } from '../components/SlaViewModal'
import {
  downloadSlaCsv,
  getSlaCellValue,
  getSlaEmptyState,
  matchesSlaSearch,
} from '../utils/slaListingUtils'

export function SlaListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [rows, setRows] = useState<SlaMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<SlaMaster | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<SlaMaster | null>(null)
  const [statusTarget, setStatusTarget] = useState<SlaMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(slaMasterService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getSlaCellValue,
    searchMatch: matchesSlaSearch,
    initialPageSize: 10,
  })

  const openView = (row: SlaMaster) => {
    setViewRecord(row)
    setViewOpen(true)
  }

  const openEdit = (row: SlaMaster) => {
    setEditRecord(row)
    setFormOpen(true)
  }

  const openCreate = () => {
    setEditRecord(null)
    setFormOpen(true)
  }

  const columns = useMemo(
    () =>
      buildSlaColumns({
        onOpenView: openView,
        onOpenEdit: openEdit,
        onToggleStatus: setStatusTarget,
      }),
    [],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getSlaEmptyState(openCreate), [])

  const handleExport = useCallback(() => {
    downloadSlaCsv(listing.filteredRows)
    showToast({ title: 'Export started', variant: 'success' })
  }, [listing.filteredRows, showToast])

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="SLA Master"
            description="Create SLA policies by module and submodule. Tab rows change with the selected module; columns cover single and bulk applicant bands."
            actions={
              <Button label="Create SLA" startIcon={<Plus size={14} />} onClick={openCreate} />
            }
          />
        }
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search SLA name or segment…"
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
            getCellValue={getSlaCellValue}
            stickyHeader
            enableColumnSort
            enableColumnFilters
            loading={loading}
            onRowClick={openView}
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

      <SlaViewModal
        open={viewOpen}
        record={viewRecord}
        onClose={() => {
          setViewOpen(false)
          setViewRecord(null)
        }}
        onEdit={openEdit}
      />

      <SlaFormDrawer
        open={formOpen}
        record={editRecord}
        onClose={() => {
          setFormOpen(false)
          setEditRecord(null)
        }}
        onSaved={loadRows}
      />

      <ConfirmDialog
        open={Boolean(statusTarget)}
        onClose={() => setStatusTarget(null)}
        loading={actionLoading}
        title={statusTarget?.status === 'active' ? 'Deactivate this SLA?' : 'Activate this SLA?'}
        description={
          statusTarget
            ? `"${statusTarget.name}" will be marked ${statusTarget.status === 'active' ? 'inactive' : 'active'}.`
            : undefined
        }
        confirmLabel={statusTarget?.status === 'active' ? 'Deactivate' : 'Activate'}
        onConfirm={() => {
          if (!statusTarget) return
          const next = statusTarget.status === 'active' ? 'inactive' : 'active'
          setActionLoading(true)
          slaMasterService.setStatus(statusTarget.id, next)
          setActionLoading(false)
          setStatusTarget(null)
          showToast({
            title: next === 'active' ? 'SLA activated' : 'SLA deactivated',
            variant: 'success',
          })
          loadRows()
        }}
      />
    </>
  )
}
