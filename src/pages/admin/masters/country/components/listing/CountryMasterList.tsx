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
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type { CountryMaster } from '@/shared/types/countryMaster'
import { CountryKpiRow } from '../CountryKpiRow'
import { buildCountryColumns } from '../CountryTableColumns'
import { AddCountryModal } from '../workspace/drawers/AddCountryModal'
import {
  downloadCountryCsv,
  getCountryCellValue,
  getCountryEmptyState,
  mapCountryRowsToGridItems,
  matchesCountrySearch,
} from '../../utils/countryListingUtils'

interface CountryMasterListProps {
  onNavigateConfigure: (countryId: string) => void
  onNavigateEdit?: (countryId: string) => void
}

export function CountryMasterList({ onNavigateConfigure, onNavigateEdit }: CountryMasterListProps) {
  const theme = useTheme()
  const { showToast } = useToast()

  const [rows, setRows] = useState<CountryMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [addOpen, setAddOpen] = useState(false)
  const [archiveOpen, setArchiveOpen] = useState(false)
  const [archiveTarget, setArchiveTarget] = useState<CountryMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(countryMasterAdminService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const listing = useCustomerListing({
    rows,
    getCellValue: (row, key) => getCountryCellValue(row, key),
    searchMatch: matchesCountrySearch,
    initialPageSize: 10,
  })

  const columns = useMemo(
    () =>
      buildCountryColumns({
        onConfigure: (row) => onNavigateConfigure(row.id),
        onDuplicate: (row) => {
          const copy = countryMasterAdminService.duplicate(row.id)
          if (copy) {
            showToast({ title: 'Country duplicated', variant: 'success' })
            loadRows()
          }
        },
        onArchive: (row) => {
          setArchiveTarget(row)
          setArchiveOpen(true)
        },
      }),
    [loadRows, onNavigateConfigure, showToast],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getCountryEmptyState('all', () => setAddOpen(true)), [])

  const handleExport = useCallback(() => {
    downloadCountryCsv(listing.filteredRows)
    showToast({
      title: 'Export started',
      description: 'Country master CSV download has started.',
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

  const handleConfirmArchive = async () => {
    if (!archiveTarget) return
    setActionLoading(true)
    countryMasterAdminService.archive(archiveTarget.id)
    setActionLoading(false)
    setArchiveOpen(false)
    showToast({ title: 'Country archived', variant: 'success' })
    loadRows()
  }

  const gridItems = useMemo(
    () => mapCountryRowsToGridItems(listing.paginatedRows),
    [listing.paginatedRows],
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Country Master"
            description="Configure visa processing by country and business segment"
            actions={
              <Button
                label="Add Country"
                variant="contained"
                startIcon={<Plus size={14} />}
                onClick={() => setAddOpen(true)}
              />
            }
          />
        }
        kpis={<CountryKpiRow counts={countryMasterAdminService.getKpiCounts()} />}
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search by country name, code, or region…"
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
              getCellValue={(row, key) => getCountryCellValue(row, key)}
              onRowClick={(row) => onNavigateConfigure(row.id)}
              loading={loading}
              stickyHeader
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
            />
          ) : (
            <AdminListingGrid
              items={gridItems}
              onItemClick={(id) => onNavigateConfigure(id)}
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

      <AddCountryModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onCreated={(id) => (onNavigateEdit ?? onNavigateConfigure)(id)}
      />

      <ConfirmDialog
        open={archiveOpen}
        onClose={() => setArchiveOpen(false)}
        title="Archive country?"
        description="Archived countries are deactivated and hidden from operational workflows until reactivated."
        confirmLabel="Archive"
        onConfirm={handleConfirmArchive}
        loading={actionLoading}
        variant="destructive"
      />
    </>
  )
}
