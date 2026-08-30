import { useCallback, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  Button,
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
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import type { MarineApplicationRow as RetailApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { teamService } from '@/shared/services/teamService'
import {
  EMPTY_APPLICATION_LISTING_FILTERS,
} from '@/pages/customer/features/applications/types/applicationListing.types'
import {
  applyAdvancedFilters,
  getFilterOptions,
} from '@/pages/customer/features/applications/utils/applicationListingUtils'
import type { ApplicationListingFilterState } from '@/pages/customer/features/applications/types/applicationListing.types'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { RetailApplicationKpiRow } from '../components/RetailApplicationKpiRow'
import {
  RetailApplicationAdvancedFilterFields,
  hasRetailApplicationFiltersActive,
} from '../components/RetailApplicationAdvancedFilters'
import { RetailApplicationAssignTeamModal } from '../components/RetailApplicationAssignTeamModal'
import { buildRetailApplicationColumns } from '../components/RetailApplicationTableColumns'
import type { ApplicationConsultantAssignmentPayload } from '../../shared/utils/applicationConsultantUtils'
import {
  RETAIL_APPLICATION_LISTING_TABS,
  type RetailApplicationListingTab,
} from '../config/RetailApplicationListingTabs'
import {
  downloadRetailApplicationCsv,
  filterRetailRowsByTab,
  getAllRetailListingRows,
  getRetailApplicationCellValue,
  getRetailApplicationEmptyState,
  mapRetailApplicationRowsToGridItems,
  matchesRetailApplicationSearch,
} from '../utils/RetailApplicationListingUtils'

const RETAIL_LISTING_PATH = '/admin/application-management/retail'
const RETAIL_TAB_VALUES = RETAIL_APPLICATION_LISTING_TABS.map(
  tab => tab.value,
) as readonly RetailApplicationListingTab[]

export function RetailApplicationListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useListingTabParam(RETAIL_TAB_VALUES, 'all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [refreshKey, setRefreshKey] = useState(0)
  const [assignTarget, setAssignTarget] = useState<RetailApplicationRow | null>(null)
  const [filters, setFilters] = useState<ApplicationListingFilterState>(EMPTY_APPLICATION_LISTING_FILTERS)
  const listingReturnHref = getCurrentListingHref(location)

  const { singles, bulks } = useMemo(
    () => marineApplicationAdminService.listApplicationsBySegment('retail'),
    [refreshKey],
  )

  const allRows = useMemo(() => getAllRetailListingRows(singles, bulks), [singles, bulks])

  const tabFilteredRows = useMemo(
    () => filterRetailRowsByTab(allRows, activeTab),
    [allRows, activeTab],
  )

  const filterOptions = useMemo(
    () => getFilterOptions(singles, bulks),
    [singles, bulks],
  )

  const advancedFilteredRows = useMemo(
    () =>
      applyAdvancedFilters(tabFilteredRows as ApplicationListingRow[], filters) as RetailApplicationRow[],
    [tabFilteredRows, filters],
  )

  const listing = useCustomerListing({
    rows: advancedFilteredRows,
    getCellValue: getRetailApplicationCellValue,
    searchMatch: matchesRetailApplicationSearch,
    initialPageSize: 10,
  })

  const openAssignTeam = useCallback((row: RetailApplicationRow) => {
    setAssignTarget(row)
  }, [])

  const handleAssignTeamSubmit = useCallback(
    (payload: ApplicationConsultantAssignmentPayload) => {
      if (!assignTarget) return
      const { teamId, userId, priority, isVip } = payload
      const updated = marineApplicationAdminService.assignTeam(assignTarget.id, teamId, userId, {
        priority,
        isVip,
      })
      if (!updated) {
        showToast({
          title: 'Assignment failed',
          description: 'Could not assign the selected team and consultant.',
          variant: 'error',
        })
        return
      }

      const teamName = teamService.getById(teamId)?.name ?? 'Team'
      const userName = adminPortalUserService.getById(userId)?.fullName ?? 'Consultant'
      setAssignTarget(null)
      setRefreshKey(key => key + 1)
      showToast({
        title: 'Consultant assigned',
        description: `${assignTarget.id} → ${userName} · ${teamName} · ${priority}${isVip ? ' · VIP' : ''}`,
        variant: 'success',
      })
    },
    [assignTarget, showToast],
  )

  const columns = useMemo(
    () =>
      buildRetailApplicationColumns({
        navigate,
        showToast,
        onAssignTeam: openAssignTeam,
        fromListing: listingReturnHref,
      }),
    [navigate, showToast, openAssignTeam, listingReturnHref],
  )

  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleCreate = useCallback(() => {
    navigateFromListing(navigate, `${RETAIL_LISTING_PATH}/new`, listingReturnHref, {
      state: { freshStart: true },
    })
  }, [listingReturnHref, navigate])

  const emptyState = useMemo(
    () => getRetailApplicationEmptyState(activeTab, handleCreate),
    [activeTab, handleCreate],
  )

  const handleExport = useCallback(() => {
    downloadRetailApplicationCsv(listing.filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your application list export will download shortly.',
      variant: 'success',
    })
  }, [listing.filterSourceRows, showToast])

  const handleTabChange = useCallback(
    (tab: RetailApplicationListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState(state => ({ ...state, page: 0 }))
    },
    [listing, setActiveTab],
  )

  const gridItems = useMemo(
    () => mapRetailApplicationRowsToGridItems(listing.paginatedRows),
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
          title="Application Management"
          description="Operational workspace for retail applications across the full submission pipeline"
          actions={
            <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap>
              <Button label="Create application" startIcon={<Plus size={14} />} onClick={handleCreate} />
            </Stack>
          }
        />
      }
      kpis={<RetailApplicationKpiRow rows={allRows} />}
      tabs={RETAIL_APPLICATION_LISTING_TABS.map(tab => ({
        value: tab.value,
        label: tab.label,
      }))}
      tabValue={activeTab}
      onTabChange={value => handleTabChange(value as RetailApplicationListingTab)}
      toolbar={
        <AdminListingToolbar
          searchValue={listing.tableState.searchQuery}
          onSearch={listing.handleSearch}
          searchPlaceholder="Search by GLTS reference, applicant, company, jurisdiction, passport no."
          onExport={handleExport}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          columns={toolbarColumns}
          hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
          onHiddenColumnKeysChange={keys =>
            listing.setTableState(state => ({ ...state, hiddenColumnKeys: keys }))
          }
          filterPopover={{
            active: hasRetailApplicationFiltersActive(filters),
            value: filters,
            onApply: (next) => {
              setFilters(next)
              listing.setTableState((state) => ({ ...state, page: 0 }))
            },
            onClear: () => setFilters(EMPTY_APPLICATION_LISTING_FILTERS),
            hasActive: hasRetailApplicationFiltersActive,
            width: 'wide',
            scrollable: true,
            children: (draft, patch) => (
              <RetailApplicationAdvancedFilterFields
                draft={draft}
                patch={patch}
                options={{
                  countries: filterOptions.countries,
                  visaTypes: filterOptions.visaTypes,
                  createdByOptions: filterOptions.createdByOptions,
                }}
              />
            ),
          }}
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
            getCellValue={getRetailApplicationCellValue}
            stickyHeader
            emptyTitle={emptyState.emptyTitle}
            emptyDescription={emptyState.emptyDescription}
            emptyAction={emptyState.emptyAction}
          />
        ) : (
          <AdminListingGrid items={gridItems} />
        )
      }
      footer={
        <Box sx={{ bgcolor: footerBg }}>
          <Pagination
            page={listing.tableState.page}
            pageSize={listing.tableState.pageSize}
            total={listing.total}
            onPage={page => listing.setTableState(state => ({ ...state, page }))}
            onPageSize={pageSize => listing.setTableState(state => ({ ...state, pageSize, page: 0 }))}
          />
        </Box>
      }
    />
      <RetailApplicationAssignTeamModal
        open={Boolean(assignTarget)}
        record={assignTarget}
        onClose={() => setAssignTarget(null)}
        onSubmit={handleAssignTeamSubmit}
      />
    </>
  )
}
