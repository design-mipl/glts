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
import { quotationService } from '@/shared/services/quotationService'
import type { QuotationRecord } from '@/shared/types/quotation'
import { QuotationKpiRow } from '../components/QuotationKpiRow'
import { QuotationAdvancedFilterFields } from '../components/QuotationAdvancedFilters'
import { buildQuotationColumns } from '../components/QuotationTableColumns'
import { QuotationShareModal } from '../components/QuotationShareModal'
import { QuotationConvertDialog } from '../components/QuotationConvertDialog'
import {
  downloadQuotationCsv,
  getQuotationCellValue,
  getQuotationEmptyState,
  hasActiveQuotationFilters,
  INITIAL_QUOTATION_ADVANCED_FILTERS,
  mapQuotationRowsToGridItems,
  matchesQuotationAdvancedFilters,
  matchesQuotationSearch,
  type QuotationAdvancedFilterState,
} from '../utils/quotationListingUtils'

const QUOTATION_ACTOR = 'Admin User'

export function QuotationListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<QuotationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [filters, setFilters] = useState<QuotationAdvancedFilterState>(INITIAL_QUOTATION_ADVANCED_FILTERS)
  const [shareTarget, setShareTarget] = useState<QuotationRecord>()
  const [convertTarget, setConvertTarget] = useState<QuotationRecord>()
  const [convertVersionId, setConvertVersionId] = useState<string>()

  const loadRows = useCallback(async () => {
    setLoading(true)
    setRows(quotationService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    void loadRows()
  }, [loadRows])

  const filteredRows = useMemo(
    () => rows.filter((row) => matchesQuotationAdvancedFilters(row, filters)),
    [rows, filters],
  )

  const listing = useCustomerListing({
    rows: filteredRows,
    getCellValue: getQuotationCellValue,
    searchMatch: matchesQuotationSearch,
    initialPageSize: 10,
  })

  const columns = useMemo(
    () =>
      buildQuotationColumns({
        onOpenDetail: (row) => navigate(`/admin/customer-accounts/quotations/${row.id}`),
        onOpenEdit: (row) => navigate(`/admin/customer-accounts/quotations/${row.id}/edit`),
        onShare: (row) => setShareTarget(row),
        onGeneratePdf: (row) => navigate(`/admin/customer-accounts/quotations/${row.id}/pdf`),
        onConvert: (row) => {
          setConvertTarget(row)
          setConvertVersionId(undefined)
        },
      }),
    [navigate],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleCreate = useCallback(() => {
    navigate('/admin/customer-accounts/quotations/new')
  }, [navigate])

  const emptyState = useMemo(() => {
    const base = getQuotationEmptyState(Boolean(listing.tableState.searchQuery))
    return {
      ...base,
      emptyAction: base.emptyAction ? { ...base.emptyAction, onClick: handleCreate } : undefined,
    }
  }, [listing.tableState.searchQuery, handleCreate])

  const gridItems = useMemo(() => mapQuotationRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Quotation Management"
            description="Create commercial proposals, manage pricing versions, and progress toward agreements."
            actions={<Button label="Create Quotation" startIcon={<Plus size={14} />} onClick={handleCreate} />}
          />
        }
        kpis={<QuotationKpiRow quotations={rows} />}
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={(value) => {
              listing.handleSearch(value)
              listing.setTableState((state) => ({ ...state, page: 0 }))
            }}
            searchPlaceholder="Search by quotation no., company, or status…"
            onExport={() => {
              downloadQuotationCsv(listing.filterSourceRows)
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
              active: hasActiveQuotationFilters(filters),
              value: filters,
              onApply: (next) => {
                setFilters(next)
                listing.setTableState((state) => ({ ...state, page: 0 }))
              },
              onClear: () => setFilters(INITIAL_QUOTATION_ADVANCED_FILTERS),
              hasActive: hasActiveQuotationFilters,
              width: 'wide',
              scrollable: true,
              children: (draft, patch) => <QuotationAdvancedFilterFields draft={draft} patch={patch} />,
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
                getCellValue={getQuotationCellValue}
                onRowClick={(row) => navigate(`/admin/customer-accounts/quotations/${row.id}`)}
                loading={loading}
                stickyHeader
                emptyTitle={emptyState.emptyTitle}
                emptyDescription={emptyState.emptyDescription}
                emptyAction={emptyState.emptyAction}
              />
            ) : (
              <AdminListingGrid
                items={gridItems}
                onItemClick={(id) => navigate(`/admin/customer-accounts/quotations/${id}`)}
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

      <QuotationShareModal
        open={Boolean(shareTarget)}
        quotation={shareTarget}
        onClose={() => setShareTarget(undefined)}
        onShared={async () => {
          setShareTarget(undefined)
          showToast({ title: 'Quotation shared', variant: 'success' })
          await loadRows()
        }}
        actor={QUOTATION_ACTOR}
      />

      <QuotationConvertDialog
        open={Boolean(convertTarget)}
        quotation={convertTarget}
        initialVersionId={convertVersionId}
        onClose={() => {
          setConvertTarget(undefined)
          setConvertVersionId(undefined)
        }}
        onConfirm={(versionId) => {
          if (!convertTarget) return
          const result = quotationService.markConverted(convertTarget.id, versionId)
          if (!result.ok) {
            showToast({ title: 'Cannot convert', description: result.issues?.join('; '), variant: 'error' })
            return
          }
          const quotationId = convertTarget.id
          setConvertTarget(undefined)
          setConvertVersionId(undefined)
          navigate(`/admin/customer-accounts/agreements/new?quotationId=${quotationId}&versionId=${versionId}`)
        }}
      />
    </>
  )
}
