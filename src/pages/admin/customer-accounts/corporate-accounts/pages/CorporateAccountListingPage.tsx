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
import { corporateAccountService } from '@/shared/services/corporateAccountService'
import type { CorporateAccount } from '@/shared/types/corporateAccount'
import { CorporateAccountKpiRow } from '../components/CorporateAccountKpiRow'
import { buildCorporateAccountColumns } from '../components/CorporateAccountTableColumns'
import {
  downloadCorporateAccountCsv,
  getCorporateAccountCellValue,
  getCorporateAccountEmptyState,
  mapCorporateAccountRowsToGridItems,
  matchesCorporateAccountSearch,
} from '../utils/corporateAccountListingUtils'

export function CorporateAccountListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<CorporateAccount[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const loadRows = useCallback(async () => {
    setLoading(true)
    setRows(corporateAccountService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: getCorporateAccountCellValue,
    searchMatch: matchesCorporateAccountSearch,
    initialPageSize: 10,
  })

  const columns = useMemo(
    () =>
      buildCorporateAccountColumns({
        onOpenDetail: (row) => navigate(`/admin/customer-accounts/corporate-accounts/${row.id}`),
        onOpenEdit: (row) => navigate(`/admin/customer-accounts/corporate-accounts/${row.id}/edit`),
        onActivate: (row) => {
          const formData = corporateAccountService.accountToFormData(row)
          const result = corporateAccountService.activate(row.id, formData)
          if (!result.ok) {
            showToast({ title: 'Cannot activate', description: result.issues.join('; '), variant: 'error' })
            return
          }
          showToast({ title: 'Account activated', variant: 'success' })
          void loadRows()
        },
        onDeactivate: (row) => {
          corporateAccountService.deactivate(row.id)
          showToast({ title: 'Account deactivated', variant: 'info' })
          void loadRows()
        },
      }),
    [navigate, showToast, loadRows],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleCreate = useCallback(() => {
    navigate('/admin/customer-accounts/corporate-accounts/new')
  }, [navigate])

  const emptyState = useMemo(() => {
    const base = getCorporateAccountEmptyState(Boolean(listing.tableState.searchQuery))
    return {
      ...base,
      emptyAction: base.emptyAction ? { ...base.emptyAction, onClick: handleCreate } : undefined,
    }
  }, [listing.tableState.searchQuery, handleCreate])

  const gridItems = useMemo(() => mapCorporateAccountRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <AdminListingShell
      stickyPageHeader={
        <AdminListingStickyHeader
          title="Corporate accounts"
          description="Operational customer account setup and portal activation"
          actions={<Button label="Create corporate account" startIcon={<Plus size={14} />} onClick={handleCreate} />}
        />
      }
      kpis={<CorporateAccountKpiRow accounts={rows} />}
      toolbar={
        <AdminListingToolbar
          searchValue={listing.tableState.searchQuery}
          onSearch={listing.handleSearch}
          searchPlaceholder="Search by company, ID, or super admin…"
          onExport={() => {
            downloadCorporateAccountCsv(listing.filterSourceRows)
            showToast({ title: 'Export started', variant: 'success' })
          }}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          columns={toolbarColumns}
          hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
          onHiddenColumnKeysChange={(keys) =>
            listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
          }
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
            getCellValue={getCorporateAccountCellValue}
            onRowClick={(row) => navigate(`/admin/customer-accounts/corporate-accounts/${row.id}`)}
            loading={loading}
            stickyHeader
            emptyTitle={emptyState.emptyTitle}
            emptyDescription={emptyState.emptyDescription}
            emptyAction={emptyState.emptyAction}
          />
        ) : (
          <AdminListingGrid
            items={gridItems}
            onItemClick={(id) => navigate(`/admin/customer-accounts/corporate-accounts/${id}`)}
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
            onPageSize={(pageSize) => listing.setTableState((state) => ({ ...state, pageSize, page: 0 }))}
          />
        </Box>
      }
    />
  )
}
