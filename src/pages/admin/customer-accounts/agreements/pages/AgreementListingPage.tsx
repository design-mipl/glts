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
import { Button, ConfirmDialog, Pagination, useToast } from '@/design-system/UIComponents'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { AgreementKpiRow } from '../components/AgreementKpiRow'
import { buildAgreementColumns } from '../components/AgreementTableColumns'
import {
  downloadAgreementCsv,
  getAgreementCellValue,
  getAgreementEmptyState,
  mapAgreementRowsToGridItems,
  matchesAgreementSearch,
} from '../utils/agreementListingUtils'

export function AgreementListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<CommercialAgreement[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [rejectTarget, setRejectTarget] = useState<CommercialAgreement>()
  const [rejectOpen, setRejectOpen] = useState(false)

  const loadRows = useCallback(async () => {
    setLoading(true)
    setRows(commercialAgreementService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getAgreementCellValue,
    searchMatch: matchesAgreementSearch,
    initialPageSize: 10,
  })

  const columns = useMemo(
    () =>
      buildAgreementColumns({
        onOpenDetail: (row) => navigate(`/admin/customer-accounts/agreements/${row.id}`),
        onOpenEdit: (row) => navigate(`/admin/customer-accounts/agreements/${row.id}/edit`),
        onApprove: (row) => {
          const result = commercialAgreementService.approve(row.id)
          if (!result.ok) {
            showToast({ title: 'Cannot approve', description: result.issues.join('; '), variant: 'error' })
            return
          }
          showToast({ title: 'Agreement approved', variant: 'success' })
          void loadRows()
        },
        onReject: (row) => {
          setRejectTarget(row)
          setRejectOpen(true)
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

  const handleRejectConfirm = () => {
    if (!rejectTarget) return
    commercialAgreementService.reject(rejectTarget.id, 'Rejected by admin')
    showToast({ title: 'Agreement rejected', variant: 'info' })
    setRejectOpen(false)
    setRejectTarget(undefined)
    void loadRows()
  }

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Agreements & contracts"
            description="Corporate onboarding and commercial agreement management"
            actions={<Button label="Create agreement" startIcon={<Plus size={14} />} onClick={handleCreate} />}
          />
        }
        kpis={<AgreementKpiRow agreements={rows} />}
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search by agreement ID, company, or workflow…"
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
            moreMenuItems={[
              { label: 'Refresh list', onClick: () => void loadRows() },
              { label: 'Clear search', onClick: () => listing.handleSearch('') },
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
              getCellValue={getAgreementCellValue}
              onRowClick={(row) => navigate(`/admin/customer-accounts/agreements/${row.id}`)}
              loading={loading}
              stickyHeader
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
            />
          ) : (
            <AdminListingGrid items={gridItems} onItemClick={(id) => navigate(`/admin/customer-accounts/agreements/${id}`)} />
          )
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

      <ConfirmDialog
        open={rejectOpen}
        onClose={() => setRejectOpen(false)}
        title="Reject agreement?"
        description="This agreement will be marked as rejected."
        confirmLabel="Reject"
        variant="destructive"
        onConfirm={handleRejectConfirm}
      />
    </>
  )
}
