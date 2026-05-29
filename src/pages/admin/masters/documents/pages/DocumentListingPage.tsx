import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
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
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type {
  DocumentMaster,
  DocumentMasterStatus,
} from '@/shared/types/documentMaster'
import { CreateDocumentModal } from '../components/CreateDocumentModal'
import { DocumentDeleteDialog } from '../components/DocumentDeleteDialog'
import { buildDocumentColumns } from '../components/DocumentTableColumns'
import {
  downloadDocumentCsv,
  getDocumentCellValue,
  getDocumentEmptyState,
  mapDocumentRowsToGridItems,
  matchesDocumentSearch,
} from '../utils/documentListingUtils'

export function DocumentListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<DocumentMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const [createOpen, setCreateOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [activeDocument, setActiveDocument] = useState<DocumentMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    const data = documentMasterService.list()
    setRows(data)
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getDocumentCellValue,
    searchMatch: matchesDocumentSearch,
    initialPageSize: 10,
  })

  const openDelete = (record: DocumentMaster) => {
    setActiveDocument(record)
    setDeleteOpen(true)
  }

  const openStatusToggle = (record: DocumentMaster) => {
    setActiveDocument(record)
    setStatusOpen(true)
  }

  const columns = useMemo(
    () =>
      buildDocumentColumns({
        onOpenDetail: (row) => navigate(`/admin/masters/documents/${row.id}`),
        onOpenEdit: (row) => navigate(`/admin/masters/documents/${row.id}/edit`),
        onToggleStatus: openStatusToggle,
        onDelete: openDelete,
      }),
    [navigate],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(
    () => getDocumentEmptyState(() => setCreateOpen(true)),
    [],
  )

  const handleExport = useCallback(() => {
    downloadDocumentCsv(listing.filteredRows)
    showToast({
      title: 'Export started',
      description: 'Document master CSV download has started.',
      variant: 'success',
    })
  }, [listing.filteredRows, showToast])

  const handleRefresh = useCallback(() => {
    loadRows()
    showToast({ title: 'List refreshed', variant: 'info' })
  }, [loadRows, showToast])

  const handleClearFilters = useCallback(() => {
    listing.handleSearch('')
    listing.setColumnFilters({})
  }, [listing])

  const handleConfirmDelete = async () => {
    if (!activeDocument) return
    setActionLoading(true)
    const result = documentMasterService.remove(activeDocument.id)
    setActionLoading(false)
    if (!result.ok) {
      showToast({
        title: 'Cannot delete document',
        description:
          result.reason === 'in_use'
            ? 'This document is referenced in country checklists.'
            : 'Document not found.',
        variant: 'error',
      })
      setDeleteOpen(false)
      return
    }
    showToast({ title: 'Document deleted', variant: 'success' })
    setDeleteOpen(false)
    setActiveDocument(null)
    loadRows()
  }

  const handleConfirmStatus = async () => {
    if (!activeDocument) return
    const nextStatus: DocumentMasterStatus =
      activeDocument.status === 'active' ? 'inactive' : 'active'
    setActionLoading(true)
    documentMasterService.setStatus(activeDocument.id, nextStatus)
    setActionLoading(false)
    showToast({
      title: nextStatus === 'active' ? 'Document activated' : 'Document deactivated',
      variant: 'success',
    })
    setStatusOpen(false)
    setActiveDocument(null)
    loadRows()
  }

  const gridItems = useMemo(
    () => mapDocumentRowsToGridItems(listing.paginatedRows),
    [listing.paginatedRows],
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  const pendingStatusLabel =
    activeDocument?.status === 'active' ? 'deactivate' : 'activate'

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Document Master"
            description="Maintain standard document types used across country and visa checklists."
            actions={
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  label="New Document"
                  startIcon={<Plus size={14} />}
                  onClick={() => setCreateOpen(true)}
                />
              </Stack>
            }
          />
        }
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search by ID, document type, or description…"
            onExport={handleExport}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={toolbarColumns}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={(keys) =>
              listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
            }
            moreMenuItems={[
              { label: 'Refresh list', onClick: handleRefresh },
              { label: 'Clear all filters', onClick: handleClearFilters },
            ]}
          />
        }
        listingContent={
          viewMode === 'table' ? (
            <AdminListingTable
              columns={columns}
              data={listing.paginatedRows}
              filterSourceData={listing.filterSourceRows}
              rowKey="id"
              state={listing.tableState}
              onStateChange={listing.setTableState}
              columnFilters={listing.columnFilters}
              onColumnFiltersChange={listing.setColumnFilters}
              getCellValue={getDocumentCellValue}
              onRowClick={(row) => navigate(`/admin/masters/documents/${row.id}`)}
              stickyHeader
              enableColumnSort={false}
              enableColumnFilters={false}
              loading={loading}
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
            />
          ) : (
            <AdminListingGrid
              items={gridItems}
              onItemClick={(id) => navigate(`/admin/masters/documents/${id}`)}
            />
          )
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

      <CreateDocumentModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={loadRows}
      />

      <DocumentDeleteDialog
        open={deleteOpen}
        document={activeDocument}
        loading={actionLoading}
        onClose={() => {
          setDeleteOpen(false)
          setActiveDocument(null)
        }}
        onConfirm={handleConfirmDelete}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false)
          setActiveDocument(null)
        }}
        onConfirm={handleConfirmStatus}
        title={`${pendingStatusLabel.charAt(0).toUpperCase()}${pendingStatusLabel.slice(1)} document?`}
        description={
          activeDocument
            ? `Set "${activeDocument.documentType}" (${activeDocument.id}) to ${activeDocument.status === 'active' ? 'inactive' : 'active'}?`
            : undefined
        }
        confirmLabel={activeDocument?.status === 'active' ? 'Deactivate' : 'Activate'}
        loading={actionLoading}
      />
    </>
  )
}
