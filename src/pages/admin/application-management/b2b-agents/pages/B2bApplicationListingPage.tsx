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
import type { MarineApplicationRow as B2bApplicationRow } from '@/shared/services/marineApplicationAdminService'
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
import { B2bApplicationKpiRow } from '../components/B2bApplicationKpiRow'
import {
  B2bApplicationAdvancedFilterFields,
  hasB2bApplicationFiltersActive,
} from '../components/B2bApplicationAdvancedFilters'
import { B2bApplicationAssignTeamModal } from '../components/B2bApplicationAssignTeamModal'
import { buildB2bApplicationColumns } from '../components/B2bApplicationTableColumns'
import {
  B2B_APPLICATION_LISTING_TABS,
  type B2bApplicationListingTab,
} from '../config/B2bApplicationListingTabs'
import {
  downloadB2bApplicationCsv,
  filterB2bRowsByTab,
  getAllB2bListingRows,
  getB2bApplicationCellValue,
  getB2bApplicationEmptyState,
  mapB2bApplicationRowsToGridItems,
  matchesB2bApplicationSearch,
} from '../utils/B2bApplicationListingUtils'

const B2B_LISTING_PATH = '/admin/application-management/b2b-agents'
const B2B_TAB_VALUES = B2B_APPLICATION_LISTING_TABS.map(
  tab => tab.value,
) as readonly B2bApplicationListingTab[]

export function B2bApplicationListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useListingTabParam(B2B_TAB_VALUES, 'all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [refreshKey, setRefreshKey] = useState(0)
  const [assignTarget, setAssignTarget] = useState<B2bApplicationRow | null>(null)
  const [filters, setFilters] = useState<ApplicationListingFilterState>(EMPTY_APPLICATION_LISTING_FILTERS)
  const listingReturnHref = getCurrentListingHref(location)

  const { singles, bulks } = useMemo(
    () => marineApplicationAdminService.listApplicationsBySegment('b2bAgents'),
    [refreshKey],
  )

  const allRows = useMemo(() => getAllB2bListingRows(singles, bulks), [singles, bulks])

  const tabFilteredRows = useMemo(
    () => filterB2bRowsByTab(allRows, activeTab),
    [allRows, activeTab],
  )

  const filterOptions = useMemo(
    () => getFilterOptions(singles, bulks),
    [singles, bulks],
  )

  const advancedFilteredRows = useMemo(
    () =>
      applyAdvancedFilters(tabFilteredRows as ApplicationListingRow[], filters) as B2bApplicationRow[],
    [tabFilteredRows, filters],
  )

  const listing = useCustomerListing({
    rows: advancedFilteredRows,
    getCellValue: getB2bApplicationCellValue,
    searchMatch: matchesB2bApplicationSearch,
    initialPageSize: 10,
  })

  const openAssignTeam = useCallback((row: B2bApplicationRow) => {
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
      buildB2bApplicationColumns({
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
    navigateFromListing(navigate, `${B2B_LISTING_PATH}/new`, listingReturnHref, {
      state: { freshStart: true },
    })
  }, [listingReturnHref, navigate])

  const emptyState = useMemo(
    () => getB2bApplicationEmptyState(activeTab, handleCreate),
    [activeTab, handleCreate],
  )

  const handleExport = useCallback(() => {
    downloadB2bApplicationCsv(listing.filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your application list export will download shortly.',
      variant: 'success',
    })
  }, [listing.filterSourceRows, showToast])

  const handleTabChange = useCallback(
    (tab: B2bApplicationListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState(state => ({ ...state, page: 0 }))
    },
    [listing, setActiveTab],
  )

  const gridItems = useMemo(
    () => mapB2bApplicationRowsToGridItems(listing.paginatedRows),
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
          description="Operational workspace for B2B agents applications across the full submission pipeline"
          actions={
            <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap>
              <Button label="Create application" startIcon={<Plus size={14} />} onClick={handleCreate} />
            </Stack>
          }
        />
      }
      kpis={<B2bApplicationKpiRow rows={allRows} />}
      tabs={B2B_APPLICATION_LISTING_TABS.map(tab => ({
        value: tab.value,
        label: tab.label,
      }))}
      tabValue={activeTab}
      onTabChange={value => handleTabChange(value as B2bApplicationListingTab)}
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
            active: hasB2bApplicationFiltersActive(filters),
            value: filters,
            onApply: (next) => {
              setFilters(next)
              listing.setTableState((state) => ({ ...state, page: 0 }))
            },
            onClear: () => setFilters(EMPTY_APPLICATION_LISTING_FILTERS),
            hasActive: hasB2bApplicationFiltersActive,
            width: 'wide',
            scrollable: true,
            children: (draft, patch) => (
              <B2bApplicationAdvancedFilterFields
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
            getCellValue={getB2bApplicationCellValue}
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
      <B2bApplicationAssignTeamModal
        open={Boolean(assignTarget)}
        record={assignTarget}
        onClose={() => setAssignTarget(null)}
        onSubmit={handleAssignTeamSubmit}
      />
    </>
  )
}
