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
import { organizationLocationMasterService } from '@/shared/services/organizationLocationMasterService'
import type {
  OrganizationLocationMaster,
  OrganizationLocationMasterListFilters,
} from '@/shared/types/organizationLocationMaster'
import {
  EMPTY_ORGANIZATION_LOCATION_FILTERS,
  OrganizationLocationAdvancedFilterFields,
  hasOrganizationLocationFiltersActive,
} from '../components/OrganizationLocationAdvancedFilters'
import { OrganizationLocationFormDrawer } from '../components/OrganizationLocationFormDrawer'
import { buildOrganizationLocationColumns } from '../components/OrganizationLocationTableColumns'
import {
  downloadOrganizationLocationCsv,
  getOrganizationLocationCellValue,
  getOrganizationLocationEmptyState,
  matchesOrganizationLocationSearch,
} from '../utils/organizationLocationListingUtils'

export function OrganizationLocationListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [rows, setRows] = useState<OrganizationLocationMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [formOpen, setFormOpen] = useState(false)
  const [editRecord, setEditRecord] = useState<OrganizationLocationMaster | null>(null)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<OrganizationLocationMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [filters, setFilters] = useState<OrganizationLocationMasterListFilters>(
    EMPTY_ORGANIZATION_LOCATION_FILTERS,
  )

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(organizationLocationMasterService.list(filters))
    setLoading(false)
  }, [filters])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getOrganizationLocationCellValue,
    searchMatch: matchesOrganizationLocationSearch,
    initialPageSize: 10,
  })

  const openEdit = (row: OrganizationLocationMaster) => {
    setEditRecord(row)
    setFormOpen(true)
  }

  const openCreate = () => {
    setEditRecord(null)
    setFormOpen(true)
  }

  const openDelete = (row: OrganizationLocationMaster) => {
    setDeleteTarget(row)
    setDeleteOpen(true)
  }

  const columns = useMemo(
    () =>
      buildOrganizationLocationColumns({
        onOpenEdit: openEdit,
        onDelete: openDelete,
      }),
    [],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getOrganizationLocationEmptyState(openCreate), [])

  const handleExport = useCallback(() => {
    downloadOrganizationLocationCsv(listing.filteredRows)
    showToast({ title: 'Export started', variant: 'success' })
  }, [listing.filteredRows, showToast])

  const handleConfirmDelete = () => {
    if (!deleteTarget) return
    setActionLoading(true)
    organizationLocationMasterService.delete(deleteTarget.id)
    setActionLoading(false)
    showToast({
      title: 'Location deleted',
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
            title="Organization & Location Master"
            description="Manage GLTS branches and partner locations used across operations."
            actions={
              <Button label="Add location" startIcon={<Plus size={14} />} onClick={openCreate} />
            }
          />
        }
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search name, contact, city…"
            onExport={handleExport}
            columns={toolbarColumns}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={(keys) =>
              listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
            }
            filterPopover={{
              active: hasOrganizationLocationFiltersActive(filters),
              value: filters,
              onApply: (next) => {
                setFilters(next)
                listing.setTableState((state) => ({ ...state, page: 0 }))
              },
              onClear: () => setFilters(EMPTY_ORGANIZATION_LOCATION_FILTERS),
              hasActive: hasOrganizationLocationFiltersActive,
              children: (draft, patch) => (
                <OrganizationLocationAdvancedFilterFields draft={draft} patch={patch} />
              ),
            }}
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
            getCellValue={getOrganizationLocationCellValue}
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

      <OrganizationLocationFormDrawer
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
        title="Delete location?"
        description={
          deleteTarget
            ? `Remove "${deleteTarget.name}" from the organization & location master? This action cannot be undone.`
            : undefined
        }
        confirmLabel="Delete"
        variant="destructive"
      />
    </>
  )
}
