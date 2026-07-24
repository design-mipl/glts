import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
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
import { useListingTabParam } from '@/shared/hooks/useListingTabParam'
import { getCurrentListingHref, navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { clientDocumentMasterService } from '@/shared/services/clientDocumentMasterService'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type { ClientDocumentMaster } from '@/shared/types/clientDocumentMaster'
import type {
  DocumentMaster,
  DocumentMasterStatus,
} from '@/shared/types/documentMaster'
import { ClientDocumentFormModal } from '../components/ClientDocumentFormModal'
import { buildClientDocumentColumns } from '../components/ClientDocumentTableColumns'
import { DocumentFormModal } from '../components/DocumentFormModal'
import { DocumentDeleteDialog } from '../components/DocumentDeleteDialog'
import { buildDocumentColumns } from '../components/DocumentTableColumns'
import {
  DOCUMENT_CONFIGURATION_TABS,
  type DocumentConfigurationTab,
} from '../config/documentTabs'
import {
  downloadClientDocumentCsv,
  getClientDocumentCellValue,
  getClientDocumentEmptyState,
  matchesClientDocumentSearch,
} from '../utils/clientDocumentListingUtils'
import {
  downloadDocumentCsv,
  getDocumentCellValue,
  getDocumentEmptyState,
  mapDocumentRowsToGridItems,
  matchesDocumentSearch,
} from '../utils/documentListingUtils'

const DOCUMENT_LISTING_PATH = '/admin/masters/documents'
const DOCUMENT_TAB_VALUES = DOCUMENT_CONFIGURATION_TABS.map(
  tab => tab.id,
) as readonly DocumentConfigurationTab[]

export function DocumentListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useListingTabParam(DOCUMENT_TAB_VALUES, 'documents')
  const [rows, setRows] = useState<DocumentMaster[]>([])
  const [clientRows, setClientRows] = useState<ClientDocumentMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const listingReturnHref = getCurrentListingHref(location)

  const [documentFormOpen, setDocumentFormOpen] = useState(false)
  const [editDocument, setEditDocument] = useState<DocumentMaster | null>(null)
  const [clientFormOpen, setClientFormOpen] = useState(false)
  const [editClient, setEditClient] = useState<ClientDocumentMaster | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [activeDocument, setActiveDocument] = useState<DocumentMaster | null>(null)
  const [clientStatusTarget, setClientStatusTarget] = useState<ClientDocumentMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(documentMasterService.list())
    setClientRows(clientDocumentMasterService.list())
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

  const clientListing = useCustomerListing({
    rows: clientRows,
    getCellValue: getClientDocumentCellValue,
    searchMatch: matchesClientDocumentSearch,
    initialPageSize: 10,
  })

  const activeListing = activeTab === 'documents' ? listing : clientListing

  const openDelete = (record: DocumentMaster) => {
    setActiveDocument(record)
    setDeleteOpen(true)
  }

  const openDocumentStatusToggle = (record: DocumentMaster) => {
    setActiveDocument(record)
    setStatusOpen(true)
  }

  const openClientEdit = (row: ClientDocumentMaster) => {
    setEditClient(row)
    setClientFormOpen(true)
  }

  const openClientStatusToggle = (row: ClientDocumentMaster) => {
    setClientStatusTarget(row)
    setStatusOpen(true)
  }

  const columns = useMemo(
    () =>
      buildDocumentColumns({
        onOpenDetail: (row) =>
          navigateFromListing(navigate, `${DOCUMENT_LISTING_PATH}/${row.id}`, listingReturnHref),
        onOpenEdit: (row) => {
          setEditDocument(row)
          setDocumentFormOpen(true)
        },
        onToggleStatus: openDocumentStatusToggle,
        onDelete: openDelete,
      }),
    [listingReturnHref, navigate],
  )

  const clientColumns = useMemo(
    () =>
      buildClientDocumentColumns({
        onOpenEdit: openClientEdit,
        onToggleStatus: openClientStatusToggle,
      }),
    [],
  )

  const toolbarColumns = useMemo(() => {
    const cols = activeTab === 'documents' ? columns : clientColumns
    return cols.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label }))
  }, [activeTab, columns, clientColumns])

  const handleAdd = () => {
    if (activeTab === 'documents') {
      setEditDocument(null)
      setDocumentFormOpen(true)
    } else {
      setEditClient(null)
      setClientFormOpen(true)
    }
  }

  const emptyState = useMemo(() => {
    if (activeTab === 'documents') {
      return getDocumentEmptyState(() => {
        setEditDocument(null)
        setDocumentFormOpen(true)
      })
    }
    return getClientDocumentEmptyState(handleAdd)
  }, [activeTab])

  const handleExport = useCallback(() => {
    if (activeTab === 'documents') {
      downloadDocumentCsv(listing.filteredRows)
      showToast({
        title: 'Export started',
        description: 'Document master CSV download has started.',
        variant: 'success',
      })
    } else {
      downloadClientDocumentCsv(clientListing.filteredRows)
      showToast({
        title: 'Export started',
        description: 'Client document master CSV download has started.',
        variant: 'success',
      })
    }
  }, [activeTab, listing.filteredRows, clientListing.filteredRows, showToast])

  const handleTabChange = (tab: DocumentConfigurationTab) => {
    setActiveTab(tab)
    listing.setTableState((state) => ({ ...state, page: 0 }))
    clientListing.setTableState((state) => ({ ...state, page: 0 }))
  }

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
    if (activeTab === 'documents' && activeDocument) {
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
      return
    }

    if (activeTab === 'client' && clientStatusTarget) {
      setActionLoading(true)
      const nextStatus = clientStatusTarget.status === 'active' ? 'inactive' : 'active'
      clientDocumentMasterService.setStatus(clientStatusTarget.id, nextStatus)
      setActionLoading(false)
      showToast({
        title: nextStatus === 'active' ? 'Client document activated' : 'Client document deactivated',
        variant: 'success',
      })
      setStatusOpen(false)
      setClientStatusTarget(null)
      loadRows()
    }
  }

  const gridItems = useMemo(
    () => mapDocumentRowsToGridItems(listing.paginatedRows),
    [listing.paginatedRows],
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  const statusTarget = activeTab === 'documents' ? activeDocument : clientStatusTarget
  const pendingStatusLabel = statusTarget?.status === 'active' ? 'deactivate' : 'activate'

  const statusRecordLabel =
    activeTab === 'documents' && activeDocument
      ? `${activeDocument.documentType} (${activeDocument.id})`
      : clientStatusTarget?.documentType

  const pageDescription =
    activeTab === 'documents'
      ? 'Maintain standard document types used across country and visa checklists.'
      : 'Maintain document types required from corporate, marine, and B2B clients.'

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Document Master"
            description={pageDescription}
            actions={
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button
                  label={activeTab === 'documents' ? 'New Document' : 'New Client Document'}
                  startIcon={<Plus size={14} />}
                  onClick={handleAdd}
                />
              </Stack>
            }
          />
        }
        tabs={DOCUMENT_CONFIGURATION_TABS.map((tab) => ({
          value: tab.id,
          label: tab.label,
        }))}
        tabValue={activeTab}
        onTabChange={(value) => handleTabChange(value as DocumentConfigurationTab)}
        toolbar={
          <AdminListingToolbar
            searchValue={activeListing.tableState.searchQuery}
            onSearch={activeListing.handleSearch}
            searchPlaceholder={
              activeTab === 'documents'
                ? 'Search by ID, document type, or description…'
                : 'Search by document type, description, or applicability…'
            }
            onExport={handleExport}
            viewMode={activeTab === 'documents' ? viewMode : undefined}
            onViewModeChange={activeTab === 'documents' ? setViewMode : undefined}
            columns={toolbarColumns}
            hiddenColumnKeys={activeListing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={(keys) =>
              activeListing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
            }
          />
        }
        listingContent={
          activeTab === 'documents' ? (
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
                onRowClick={(row) =>
                  navigateFromListing(navigate, `${DOCUMENT_LISTING_PATH}/${row.id}`, listingReturnHref)
                }
                stickyHeader
                enableColumnSort
                enableColumnFilters
                loading={loading}
                emptyTitle={emptyState.emptyTitle}
                emptyDescription={emptyState.emptyDescription}
                emptyAction={emptyState.emptyAction}
              />
            ) : (
              <AdminListingGrid
                items={gridItems}
                onItemClick={(id) =>
                  navigateFromListing(navigate, `${DOCUMENT_LISTING_PATH}/${id}`, listingReturnHref)
                }
              />
            )
          ) : (
            <AdminListingTable<ClientDocumentMaster>
              columns={clientColumns}
              data={clientListing.paginatedRows}
              filterSourceData={clientListing.filterSourceRows}
              rowKey="id"
              state={clientListing.tableState}
              onStateChange={clientListing.setTableState}
              columnFilters={clientListing.columnFilters}
              onColumnFiltersChange={clientListing.setColumnFilters}
              getCellValue={getClientDocumentCellValue}
              stickyHeader
              enableColumnSort
              enableColumnFilters
              loading={loading}
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
            />
          )
        }
        footer={
          <Box sx={{ bgcolor: footerBg }}>
            <Pagination
              page={activeListing.tableState.page}
              pageSize={activeListing.tableState.pageSize}
              total={activeListing.total}
              onPage={(page) => activeListing.setTableState((state) => ({ ...state, page }))}
              onPageSize={(pageSize) =>
                activeListing.setTableState((state) => ({ ...state, pageSize, page: 0 }))
              }
            />
          </Box>
        }
      />

      <DocumentFormModal
        open={documentFormOpen}
        record={editDocument}
        onClose={() => {
          setDocumentFormOpen(false)
          setEditDocument(null)
        }}
        onSaved={loadRows}
      />

      <ClientDocumentFormModal
        open={clientFormOpen}
        record={editClient}
        onClose={() => {
          setClientFormOpen(false)
          setEditClient(null)
        }}
        onSaved={loadRows}
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
          setClientStatusTarget(null)
        }}
        onConfirm={handleConfirmStatus}
        title={`${pendingStatusLabel.charAt(0).toUpperCase()}${pendingStatusLabel.slice(1)} ${activeTab === 'client' ? 'client document' : 'document'}?`}
        description={
          statusRecordLabel
            ? `Set "${statusRecordLabel}" to ${statusTarget?.status === 'active' ? 'inactive' : 'active'}?`
            : undefined
        }
        confirmLabel={statusTarget?.status === 'active' ? 'Deactivate' : 'Activate'}
        loading={actionLoading}
      />
    </>
  )
}
