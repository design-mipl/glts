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
import { taxMasterService } from '@/shared/services/taxMasterService'
import type { GstRate, TaxMasterListFilters, TdsSection } from '@/shared/types/taxMaster'
import { GstRateFormModal } from '../components/GstRateFormModal'
import { buildGstRateColumns } from '../components/GstRateTableColumns'
import { TdsSectionFormModal } from '../components/TdsSectionFormModal'
import { buildTdsSectionColumns } from '../components/TdsSectionTableColumns'
import { TaxAdvancedFilters } from '../components/TaxAdvancedFilters'
import { TAX_CONFIGURATION_TABS, type TaxConfigurationTab } from '../config/taxTabs'
import {
  downloadGstRateCsv,
  getGstRateCellValue,
  getGstRateEmptyState,
  matchesGstRateSearch,
} from '../utils/gstRateListingUtils'
import {
  downloadTdsSectionCsv,
  getTdsSectionCellValue,
  getTdsSectionEmptyState,
  matchesTdsSectionSearch,
} from '../utils/tdsSectionListingUtils'

const EMPTY_FILTERS: TaxMasterListFilters = { status: 'all', applicableOn: 'all' }

export function TaxConfigurationPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<TaxConfigurationTab>('gst')
  const [filters, setFilters] = useState<TaxMasterListFilters>(EMPTY_FILTERS)
  const [gstRows, setGstRows] = useState<GstRate[]>([])
  const [tdsRows, setTdsRows] = useState<TdsSection[]>([])
  const [loading, setLoading] = useState(true)

  const [gstFormOpen, setGstFormOpen] = useState(false)
  const [tdsFormOpen, setTdsFormOpen] = useState(false)
  const [editGst, setEditGst] = useState<GstRate | null>(null)
  const [editTds, setEditTds] = useState<TdsSection | null>(null)
  const [statusOpen, setStatusOpen] = useState(false)
  const [statusTarget, setStatusTarget] = useState<GstRate | TdsSection | null>(null)
  const [actionLoading, setActionLoading] = useState(false)

  const loadRows = useCallback(() => {
    setLoading(true)
    setGstRows(taxMasterService.listGst(filters))
    setTdsRows(taxMasterService.listTds(filters))
    setLoading(false)
  }, [filters])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const gstListing = useCustomerListing({
    rows: gstRows,
    getCellValue: getGstRateCellValue,
    searchMatch: matchesGstRateSearch,
    initialPageSize: 10,
  })

  const tdsListing = useCustomerListing({
    rows: tdsRows,
    getCellValue: getTdsSectionCellValue,
    searchMatch: matchesTdsSectionSearch,
    initialPageSize: 10,
  })

  const listing = activeTab === 'gst' ? gstListing : tdsListing

  const openGstEdit = (row: GstRate) => {
    setEditGst(row)
    setGstFormOpen(true)
  }

  const openTdsEdit = (row: TdsSection) => {
    setEditTds(row)
    setTdsFormOpen(true)
  }

  const openStatusToggle = (row: GstRate | TdsSection) => {
    setStatusTarget(row)
    setStatusOpen(true)
  }

  const gstColumns = useMemo(
    () =>
      buildGstRateColumns({
        onOpenEdit: openGstEdit,
        onToggleStatus: openStatusToggle,
      }),
    [],
  )

  const tdsColumns = useMemo(
    () =>
      buildTdsSectionColumns({
        onOpenEdit: openTdsEdit,
        onToggleStatus: openStatusToggle,
      }),
    [],
  )

  const toolbarColumns = useMemo(() => {
    const cols = activeTab === 'gst' ? gstColumns : tdsColumns
    return cols.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label }))
  }, [activeTab, gstColumns, tdsColumns])

  const handleAdd = () => {
    if (activeTab === 'gst') {
      setEditGst(null)
      setGstFormOpen(true)
    } else {
      setEditTds(null)
      setTdsFormOpen(true)
    }
  }

  const emptyState = useMemo(() => {
    if (activeTab === 'gst') return getGstRateEmptyState(handleAdd)
    return getTdsSectionEmptyState(handleAdd)
  }, [activeTab])

  const handleExport = useCallback(() => {
    if (activeTab === 'gst') {
      downloadGstRateCsv(gstListing.filteredRows)
    } else {
      downloadTdsSectionCsv(tdsListing.filteredRows)
    }
    showToast({ title: 'Export started', variant: 'success' })
  }, [activeTab, gstListing.filteredRows, tdsListing.filteredRows, showToast])

  const handleRefresh = useCallback(() => {
    loadRows()
    showToast({ title: 'List refreshed', variant: 'info' })
  }, [loadRows, showToast])

  const handleClearFilters = useCallback(() => {
    setFilters(EMPTY_FILTERS)
    listing.handleSearch('')
    listing.setColumnFilters({})
  }, [listing])

  const handleTabChange = (tab: TaxConfigurationTab) => {
    setActiveTab(tab)
    setFilters(EMPTY_FILTERS)
    gstListing.setTableState((state) => ({ ...state, page: 0 }))
    tdsListing.setTableState((state) => ({ ...state, page: 0 }))
  }

  const handleConfirmStatus = () => {
    if (!statusTarget) return
    setActionLoading(true)
    const nextStatus = statusTarget.status === 'active' ? 'inactive' : 'active'
    if ('slabName' in statusTarget) {
      taxMasterService.setGstStatus(statusTarget.id, nextStatus)
    } else {
      taxMasterService.setTdsStatus(statusTarget.id, nextStatus)
    }
    setActionLoading(false)
    showToast({
      title: nextStatus === 'active' ? 'Record activated' : 'Record deactivated',
      variant: 'success',
    })
    setStatusOpen(false)
    setStatusTarget(null)
    loadRows()
  }

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  const pendingStatusLabel =
    statusTarget?.status === 'active' ? 'deactivate' : 'activate'

  const statusRecordLabel =
    statusTarget && 'slabName' in statusTarget
      ? statusTarget.slabName
      : statusTarget?.sectionCode

  const hasActiveFilters =
    (activeTab === 'tds' && filters.applicableOn && filters.applicableOn !== 'all') ||
    Boolean(listing.tableState.searchQuery)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Tax Configuration"
            description="GST slabs and TDS sections used across invoicing"
            actions={
              <Button
                label={activeTab === 'gst' ? 'Add Rate' : 'Add TDS Section'}
                startIcon={<Plus size={14} />}
                onClick={handleAdd}
              />
            }
          />
        }
        tabs={TAX_CONFIGURATION_TABS.map((tab) => ({
          value: tab.id,
          label: tab.label,
        }))}
        tabValue={activeTab}
        onTabChange={(value) => handleTabChange(value as TaxConfigurationTab)}
        toolbar={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <AdminListingToolbar
              searchValue={listing.tableState.searchQuery}
              onSearch={listing.handleSearch}
              searchPlaceholder={
                activeTab === 'gst'
                  ? 'Search slab name, rate, or description…'
                  : 'Search section code, rate, or description…'
              }
              onExport={handleExport}
              columns={toolbarColumns}
              hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
              onHiddenColumnKeysChange={(keys) =>
                listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
              }
              moreMenuItems={[
                { label: 'Refresh list', onClick: handleRefresh },
                ...(hasActiveFilters
                  ? [{ label: 'Clear all filters', onClick: handleClearFilters }]
                  : []),
              ]}
            />
            {activeTab === 'tds' ? (
              <TaxAdvancedFilters activeTab={activeTab} filters={filters} onChange={setFilters} />
            ) : null}
          </Box>
        }
        listingContent={
          activeTab === 'gst' ? (
            <AdminListingTable<GstRate>
              columns={gstColumns}
              data={gstListing.paginatedRows}
              filterSourceData={gstListing.filterSourceRows}
              rowKey="id"
              state={gstListing.tableState}
              onStateChange={gstListing.setTableState}
              columnFilters={gstListing.columnFilters}
              onColumnFiltersChange={gstListing.setColumnFilters}
              getCellValue={getGstRateCellValue}
              stickyHeader
              enableColumnSort={false}
              enableColumnFilters={false}
              loading={loading}
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
            />
          ) : (
            <AdminListingTable<TdsSection>
              columns={tdsColumns}
              data={tdsListing.paginatedRows}
              filterSourceData={tdsListing.filterSourceRows}
              rowKey="id"
              state={tdsListing.tableState}
              onStateChange={tdsListing.setTableState}
              columnFilters={tdsListing.columnFilters}
              onColumnFiltersChange={tdsListing.setColumnFilters}
              getCellValue={getTdsSectionCellValue}
              stickyHeader
              enableColumnSort={false}
              enableColumnFilters={false}
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

      <GstRateFormModal
        open={gstFormOpen}
        record={editGst}
        onClose={() => {
          setGstFormOpen(false)
          setEditGst(null)
        }}
        onSaved={loadRows}
      />

      <TdsSectionFormModal
        open={tdsFormOpen}
        record={editTds}
        onClose={() => {
          setTdsFormOpen(false)
          setEditTds(null)
        }}
        onSaved={loadRows}
      />

      <ConfirmDialog
        open={statusOpen}
        onClose={() => {
          setStatusOpen(false)
          setStatusTarget(null)
        }}
        onConfirm={handleConfirmStatus}
        loading={actionLoading}
        title={`${pendingStatusLabel.charAt(0).toUpperCase()}${pendingStatusLabel.slice(1)} record?`}
        description={
          statusRecordLabel
            ? `Set "${statusRecordLabel}" to ${statusTarget?.status === 'active' ? 'inactive' : 'active'}?`
            : undefined
        }
        confirmLabel={statusTarget?.status === 'active' ? 'Deactivate' : 'Activate'}
      />
    </>
  )
}
