import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import { Button, Pagination, useToast } from '@/design-system/UIComponents'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { AgreementStatusUpdateDialog } from '../components/AgreementStatusUpdateDialog'
import { AgreementKpiRow } from '../components/AgreementKpiRow'
import { AgreementAdvancedFilterFields } from '../components/AgreementAdvancedFilters'
import { buildAgreementColumns } from '../components/AgreementTableColumns'
import {
  downloadAgreementCsv,
  getAgreementCellValue,
  getAgreementEmptyState,
  hasActiveAgreementFilters,
  INITIAL_AGREEMENT_ADVANCED_FILTERS,
  mapAgreementRowsToGridItems,
  matchesAgreementAdvancedFilters,
  matchesAgreementSearch,
  type AgreementAdvancedFilterState,
} from '../utils/agreementListingUtils'

export function AgreementListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<CommercialAgreement[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [statusTarget, setStatusTarget] = useState<CommercialAgreement>()
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [filters, setFilters] = useState<AgreementAdvancedFilterState>(INITIAL_AGREEMENT_ADVANCED_FILTERS)
  const loadRows = useCallback(async () => {
    setLoading(true)
    setRows(commercialAgreementService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadRows()
  }, [loadRows])

  const filteredRows = useMemo(
    () => rows.filter((row) => matchesAgreementAdvancedFilters(row, filters)),
    [rows, filters],
  )

  const listing = useCustomerListing({
    rows: filteredRows,
    getCellValue: getAgreementCellValue,
    searchMatch: matchesAgreementSearch,
    initialPageSize: 10,
  })

  const columns = useMemo(
    () =>
      buildAgreementColumns({
        onOpenDetail: (row) => navigate(`/admin/customer-accounts/agreements/${row.id}`),
        onOpenEdit: (row) => navigate(`/admin/customer-accounts/agreements/${row.id}/edit`),
        onUpdateStatus: (row) => {
          setStatusTarget(row)
          setStatusDialogOpen(true)
        },
      }),
    [navigate, showToast, loadRows],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleCreate = useCallback(() => {
    navigate('/admin/customer-accounts/agreements/new')
  }, [navigate])

  const emptyState = useMemo(() => {
    const base = getAgreementEmptyState(Boolean(listing.tableState.searchQuery))
    return {
      ...base,
      emptyAction: base.emptyAction ? { ...base.emptyAction, onClick: handleCreate } : undefined,
    }
  }, [listing.tableState.searchQuery, handleCreate])

  const gridItems = useMemo(() => mapAgreementRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  const handleStatusUpdate = (status: 'on_hold' | 'terminated', remarks: string) => {
    if (!statusTarget) return
    setStatusUpdating(true)
    const updated = commercialAgreementService.updateHoldOrTerminateStatus(statusTarget.id, status, remarks)
    setStatusUpdating(false)
    if (!updated) {
      showToast({ title: 'Unable to update status', description: 'Check remarks and current agreement status.', variant: 'error' })
      return
    }
    setStatusDialogOpen(false)
    setStatusTarget(undefined)
    showToast({ title: 'Agreement status updated', variant: 'success' })
    void loadRows()
  }

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Agreements"
            description="Corporate onboarding, finance configuration and commercial agreement management"
            actions={<Button label="Create agreement" startIcon={<Plus size={14} />} onClick={handleCreate} />}
          />
        }
        kpis={<AgreementKpiRow agreements={rows} />}
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={(value) => {
              listing.handleSearch(value)
              listing.setTableState((state) => ({ ...state, page: 0 }))
            }}
            searchPlaceholder="Search by agreement ID, company, GST, entity, or contact person…"
            onExport={() => {
              downloadAgreementCsv(listing.filterSourceRows)
              showToast({ title: 'Export started', variant: 'success' })
            }}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={toolbarColumns}
            hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={(keys) =>
              listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
            }
            filterPopover={{
              active: hasActiveAgreementFilters(filters),
              value: filters,
              onApply: (next) => {
                setFilters(next)
                listing.setTableState((state) => ({ ...state, page: 0 }))
              },
              onClear: () => setFilters(INITIAL_AGREEMENT_ADVANCED_FILTERS),
              hasActive: hasActiveAgreementFilters,
              width: 'wide',
              scrollable: true,
              children: (draft, patch) => (
                <AgreementAdvancedFilterFields draft={draft} patch={patch} />
              ),
            }}
          />
        }
        listingContent={
          <>
            {viewMode === 'table' ? (
              <AdminListingTable
                columns={columns}
                data={listing.paginatedRows}
                filterSourceData={listing.filterSourceRows}
                rowKey="id"
                state={listing.tableState}
                onStateChange={listing.setTableState}
                columnFilters={listing.columnFilters}
                onColumnFiltersChange={listing.setColumnFilters}
                getCellValue={getAgreementCellValue}
                onRowClick={(row) => navigate(`/admin/customer-accounts/agreements/${row.id}`)}
                loading={loading}
                stickyHeader
                emptyTitle={emptyState.emptyTitle}
                emptyDescription={emptyState.emptyDescription}
                emptyAction={emptyState.emptyAction}
              />
            ) : (
              <AdminListingGrid
                items={gridItems}
                onItemClick={(id) => navigate(`/admin/customer-accounts/agreements/${id}`)}
              />
            )}
          </>
        }
        footer={
          <Box sx={{ bgcolor: footerBg }}>
            <Pagination
              page={listing.tableState.page}
              pageSize={listing.tableState.pageSize}
              total={listing.total}
              onPage={(page) => listing.setTableState((state) => ({ ...state, page }))}
              onPageSize={(pageSize) => listing.setTableState((state) => ({ ...state, pageSize, page: 0 }))}
            />
          </Box>
        }
      />

      <AgreementStatusUpdateDialog
        open={statusDialogOpen}
        onClose={() => {
          setStatusDialogOpen(false)
          setStatusTarget(undefined)
        }}
        onConfirm={handleStatusUpdate}
        loading={statusUpdating}
      />
    </>
  )
}
