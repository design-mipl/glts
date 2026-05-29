import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
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
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import type { BusinessSegment, CountryMaster } from '@/shared/types/countryMaster'
import { buildCountryColumns } from '../components/CountryTableColumns'
import {
  COUNTRY_LISTING_TABS,
  type CountryListingTab,
  listingTabToSegment,
} from '../config/countrySegmentConfig'
import {
  downloadCountryCsv,
  filterCountryRowsByTab,
  getCountryCellValue,
  getCountryEmptyState,
  mapCountryRowsToGridItems,
  matchesCountrySearch,
} from '../utils/countryListingUtils'

export function CountryListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [rows, setRows] = useState<CountryMaster[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<CountryListingTab>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [statusOpen, setStatusOpen] = useState(false)
  const [activeCountry, setActiveCountry] = useState<CountryMaster | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const listingSegment = listingTabToSegment(activeTab)

  const loadRows = useCallback(() => {
    setLoading(true)
    const data = countryMasterAdminService.list({
      segment: activeTab === 'all' ? 'all' : listingSegment,
    })
    setRows(data)
    setLoading(false)
  }, [activeTab, listingSegment])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const tabFilteredRows = useMemo(
    () => filterCountryRowsByTab(rows, activeTab),
    [rows, activeTab],
  )

  const listing = useCustomerListing({
    rows: tabFilteredRows,
    getCellValue: (row, key) => getCountryCellValue(row, key, listingSegment),
    searchMatch: matchesCountrySearch,
    initialPageSize: 10,
  })

  const navigateDetail = (row: CountryMaster, segment?: BusinessSegment, tab?: string) => {
    const seg = segment ?? countryMasterAdminService.getEnabledSegments(row)[0] ?? 'retail'
    const params = new URLSearchParams({ segment: seg })
    if (tab) params.set('tab', tab)
    navigate(`/admin/masters/country/${row.id}?${params.toString()}`)
  }

  const openStatusToggle = (record: CountryMaster) => {
    setActiveCountry(record)
    setStatusOpen(true)
  }

  const columns = useMemo(
    () =>
      buildCountryColumns({
        listingSegment,
        onOpenDetail: (row, seg) => navigateDetail(row, seg),
        onOpenEdit: (row) => navigate(`/admin/masters/country/${row.id}/edit`),
        onToggleStatus: openStatusToggle,
        onConfigureVisaTypes: (row, seg) => navigateDetail(row, seg, 'visa-types'),
        onConfigureChecklist: (row, seg) => navigateDetail(row, seg, 'checklist'),
      }),
    [listingSegment, navigate],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(
    () => getCountryEmptyState(activeTab, () => navigate('/admin/masters/country/new')),
    [activeTab, navigate],
  )

  const handleExport = useCallback(() => {
    downloadCountryCsv(listing.filteredRows, listingSegment)
    showToast({
      title: 'Export started',
      description: 'Country master CSV download has started.',
      variant: 'success',
    })
  }, [listing.filteredRows, listingSegment, showToast])

  const handleRefresh = useCallback(() => {
    loadRows()
    showToast({ title: 'List refreshed', variant: 'info' })
  }, [loadRows, showToast])

  const handleClearFilters = useCallback(() => {
    listing.handleSearch('')
    listing.setColumnFilters({})
  }, [listing])

  const handleTabChange = useCallback(
    (tab: CountryListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState((state) => ({ ...state, page: 0 }))
    },
    [listing],
  )

  const handleConfirmStatus = async () => {
    if (!activeCountry) return
    setActionLoading(true)
    const nextStatus = activeCountry.status === 'active' ? 'inactive' : 'active'
    countryMasterAdminService.setStatus(activeCountry.id, nextStatus)
    setActionLoading(false)
    setStatusOpen(false)
    showToast({
      title: nextStatus === 'active' ? 'Country activated' : 'Country deactivated',
      variant: 'success',
    })
    loadRows()
  }

  const gridItems = useMemo(
    () => mapCountryRowsToGridItems(listing.paginatedRows, listingSegment),
    [listing.paginatedRows, listingSegment],
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
                onClick={() => navigate('/admin/masters/country/new')}
              />
            }
          />
        }
        tabs={COUNTRY_LISTING_TABS.map((t) => ({ value: t.value, label: t.label }))}
        tabValue={activeTab}
        onTabChange={(value) => handleTabChange(value as CountryListingTab)}
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search by country name, code, or notes…"
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
              getCellValue={(row, key) => getCountryCellValue(row, key, listingSegment)}
              onRowClick={(row) => navigateDetail(row, listingSegment)}
              loading={loading}
              stickyHeader
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
            />
          ) : (
            <AdminListingGrid
              items={gridItems}
              onItemClick={(id) => {
                const row = listing.paginatedRows.find((r) => r.id === id)
                if (row) navigateDetail(row, listingSegment)
              }}
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

      <ConfirmDialog
        open={statusOpen}
        onClose={() => setStatusOpen(false)}
        title={activeCountry?.status === 'active' ? 'Deactivate country?' : 'Activate country?'}
        description={
          activeCountry?.status === 'active'
            ? 'Inactive countries are hidden from operational workflows until reactivated.'
            : 'This country will be available for processing configuration.'
        }
        confirmLabel={activeCountry?.status === 'active' ? 'Deactivate' : 'Activate'}
        onConfirm={handleConfirmStatus}
        loading={actionLoading}
        variant={activeCountry?.status === 'active' ? 'destructive' : 'default'}
      />
    </>
  )
}
