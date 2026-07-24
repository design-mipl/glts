import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { Button, Pagination, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { workflowMasterService } from '@/shared/services/workflowMasterService'
import type { WorkflowMaster } from '@/shared/types/workflowMaster'
import { WorkflowFormDrawer } from '../components/WorkflowFormDrawer'
import { buildWorkflowColumns } from '../components/WorkflowTableColumns'
import { WorkflowViewModal } from '../components/WorkflowViewModal'
import {
  downloadWorkflowCsv,
  getWorkflowCellValue,
  getWorkflowEmptyState,
  matchesWorkflowSearch,
} from '../utils/workflowListingUtils'

export function WorkflowListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [rows, setRows] = useState<WorkflowMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<WorkflowMaster | null>(null)
  const [viewOpen, setViewOpen] = useState(false)
  const [viewRecord, setViewRecord] = useState<WorkflowMaster | null>(null)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(workflowMasterService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getWorkflowCellValue,
    searchMatch: matchesWorkflowSearch,
    initialPageSize: 10,
  })

  const openView = (row: WorkflowMaster) => {
    setViewRecord(row)
    setViewOpen(true)
  }

  const openEdit = (row: WorkflowMaster) => {
    setEditRecord(row)
    setFormOpen(true)
  }

  const openCreate = () => {
    setEditRecord(null)
    setFormOpen(true)
  }

  const columns = useMemo(
    () =>
      buildWorkflowColumns({
        onOpenView: openView,
        onOpenEdit: openEdit,
      }),
    [],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getWorkflowEmptyState(openCreate), [])

  const handleExport = useCallback(() => {
    downloadWorkflowCsv(listing.filteredRows)
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
            title="Workflow Master"
            description="Create reusable visa processing workflows with ordered statuses."
            actions={
              <Button label="Create Workflow" startIcon={<Plus size={14} />} onClick={openCreate} />
            }
          />
        }
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search workflow name or description…"
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
            getCellValue={getWorkflowCellValue}
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

      <WorkflowViewModal
        open={viewOpen}
        record={viewRecord}
        onClose={() => {
          setViewOpen(false)
          setViewRecord(null)
        }}
        onEdit={openEdit}
      />

      <WorkflowFormDrawer
        open={formOpen}
        record={editRecord}
        onClose={() => {
          setFormOpen(false)
          setEditRecord(null)
        }}
        onSaved={loadRows}
      />
    </>
  )
}
