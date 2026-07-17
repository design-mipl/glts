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
import { marineApplicationAdminService, isCustomerSubmitted } from '@/shared/services/marineApplicationAdminService'
import { opensMarineViewFormDirectly } from '../config/marineWorkspaceMode'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
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
import { MarineApplicationKpiRow } from '../components/MarineApplicationKpiRow'
import {
  MarineApplicationAdvancedFilterFields,
  hasMarineApplicationFiltersActive,
} from '../components/MarineApplicationAdvancedFilters'
import { MarineApplicationAssignTeamModal } from '../components/MarineApplicationAssignTeamModal'
import { buildMarineApplicationColumns } from '../components/MarineApplicationTableColumns'
import {
  MARINE_APPLICATION_LISTING_TABS,
  type MarineApplicationListingTab,
} from '../config/marineApplicationListingTabs'
import {
  downloadMarineApplicationCsv,
  filterMarineRowsByTab,
  getAllMarineListingRows,
  getMarineApplicationCellValue,
  getMarineApplicationEmptyState,
  mapMarineApplicationRowsToGridItems,
  matchesMarineApplicationSearch,
} from '../utils/marineApplicationListingUtils'

const MARINE_LISTING_PATH = '/admin/application-management/marine'
const MARINE_TAB_VALUES = MARINE_APPLICATION_LISTING_TABS.map(
  tab => tab.value,
) as readonly MarineApplicationListingTab[]

export function MarineApplicationListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useListingTabParam(MARINE_TAB_VALUES, 'all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [refreshKey, setRefreshKey] = useState(0)
  const [assignTarget, setAssignTarget] = useState<MarineApplicationRow | null>(null)
  const [filters, setFilters] = useState<ApplicationListingFilterState>(EMPTY_APPLICATION_LISTING_FILTERS)
  const listingReturnHref = getCurrentListingHref(location)

  const { singles, bulks } = useMemo(
    () => marineApplicationAdminService.listMarineApplications(),
    [refreshKey],
  )

  const allRows = useMemo(() => getAllMarineListingRows(singles, bulks), [singles, bulks])

  const tabFilteredRows = useMemo(
    () => filterMarineRowsByTab(allRows, activeTab),
    [allRows, activeTab],
  )

  const filterOptions = useMemo(
    () => getFilterOptions(singles, bulks),
    [singles, bulks],
  )

  const advancedFilteredRows = useMemo(
    () =>
      applyAdvancedFilters(tabFilteredRows as ApplicationListingRow[], filters) as MarineApplicationRow[],
    [tabFilteredRows, filters],
  )

  const listing = useCustomerListing({
    rows: advancedFilteredRows,
    getCellValue: getMarineApplicationCellValue,
    searchMatch: matchesMarineApplicationSearch,
    initialPageSize: 10,
  })

  const openAssignTeam = useCallback((row: MarineApplicationRow) => {
    setAssignTarget(row)
  }, [])

  const handleAssignTeamSubmit = useCallback(
    (teamId: string, userId: string) => {
      if (!assignTarget) return
      const updated = marineApplicationAdminService.assignTeam(assignTarget.id, teamId, userId)
      if (!updated) {
        showToast({
          title: 'Assignment failed',
          description: 'Could not assign the selected team and user.',
          variant: 'error',
        })
        return
      }

      const teamName = teamService.getById(teamId)?.name ?? 'Team'
      const userName = adminPortalUserService.getById(userId)?.fullName ?? 'User'
      setAssignTarget(null)
      setRefreshKey(key => key + 1)
      showToast({
        title: 'Team assigned',
        description: `${assignTarget.id} assigned to ${teamName} · ${userName}`,
        variant: 'success',
      })
    },
    [assignTarget, showToast],
  )

  const columns = useMemo(
    () =>
      buildMarineApplicationColumns({
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
    navigateFromListing(navigate, `${MARINE_LISTING_PATH}/new`, listingReturnHref, {
      state: { freshStart: true },
    })
  }, [listingReturnHref, navigate])

  const emptyState = useMemo(
    () => getMarineApplicationEmptyState(activeTab, handleCreate),
    [activeTab, handleCreate],
  )

  const handleExport = useCallback(() => {
    downloadMarineApplicationCsv(listing.filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your application list export will download shortly.',
      variant: 'success',
    })
  }, [listing.filterSourceRows, showToast])

  const handleTabChange = useCallback(
    (tab: MarineApplicationListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState(state => ({ ...state, page: 0 }))
    },
    [listing, setActiveTab],
  )

  const handleRowClick = useCallback(
    (row: MarineApplicationRow) => {
      if (!isCustomerSubmitted(row)) {
        showToast({
          title: 'Draft application',
          description: 'Submit this application before opening document verification.',
          variant: 'info',
        })
        return
      }
      const detailPath = `${MARINE_LISTING_PATH}/${row.id}`
      navigateFromListing(
        navigate,
        opensMarineViewFormDirectly(row) ? `${detailPath}/view-form` : detailPath,
        listingReturnHref,
      )
    },
    [listingReturnHref, navigate, showToast],
  )

  const gridItems = useMemo(
    () => mapMarineApplicationRowsToGridItems(listing.paginatedRows),
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
          description="Operational workspace for marine applications across the full submission pipeline"
          actions={
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Button label="Create application" startIcon={<Plus size={14} />} onClick={handleCreate} />
            </Stack>
          }
        />
      }
      kpis={<MarineApplicationKpiRow rows={allRows} />}
      tabs={MARINE_APPLICATION_LISTING_TABS.map(tab => ({
        value: tab.value,
        label: tab.label,
      }))}
      tabValue={activeTab}
      onTabChange={value => handleTabChange(value as MarineApplicationListingTab)}
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
            active: hasMarineApplicationFiltersActive(filters),
            value: filters,
            onApply: (next) => {
              setFilters(next)
              listing.setTableState((state) => ({ ...state, page: 0 }))
            },
            onClear: () => setFilters(EMPTY_APPLICATION_LISTING_FILTERS),
            hasActive: hasMarineApplicationFiltersActive,
            width: 'wide',
            scrollable: true,
            children: (draft, patch) => (
              <MarineApplicationAdvancedFilterFields
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
            getCellValue={getMarineApplicationCellValue}
            onRowClick={handleRowClick}
            stickyHeader
            emptyTitle={emptyState.emptyTitle}
            emptyDescription={emptyState.emptyDescription}
            emptyAction={emptyState.emptyAction}
          />
        ) : (
          <AdminListingGrid
            items={gridItems}
            onItemClick={id => navigate(`/admin/application-management/marine/${id}`)}
          />
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
      <MarineApplicationAssignTeamModal
        open={Boolean(assignTarget)}
        record={assignTarget}
        onClose={() => setAssignTarget(null)}
        onSubmit={handleAssignTeamSubmit}
      />
    </>
  )
}
