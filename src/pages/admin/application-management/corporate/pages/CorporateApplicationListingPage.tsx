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
import type { MarineApplicationRow as CorporateApplicationRow } from '@/shared/services/marineApplicationAdminService'
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
import { CorporateApplicationKpiRow } from '../components/CorporateApplicationKpiRow'
import {
  CorporateApplicationAdvancedFilterFields,
  hasCorporateApplicationFiltersActive,
} from '../components/CorporateApplicationAdvancedFilters'
import { CorporateApplicationAssignTeamModal } from '../components/CorporateApplicationAssignTeamModal'
import { buildCorporateApplicationColumns } from '../components/CorporateApplicationTableColumns'
import {
  CORPORATE_APPLICATION_LISTING_TABS,
  type CorporateApplicationListingTab,
} from '../config/CorporateApplicationListingTabs'
import {
  downloadCorporateApplicationCsv,
  filterCorporateRowsByTab,
  getAllCorporateListingRows,
  getCorporateApplicationCellValue,
  getCorporateApplicationEmptyState,
  mapCorporateApplicationRowsToGridItems,
  matchesCorporateApplicationSearch,
} from '../utils/CorporateApplicationListingUtils'

const CORPORATE_LISTING_PATH = '/admin/application-management/corporate'
const CORPORATE_TAB_VALUES = CORPORATE_APPLICATION_LISTING_TABS.map(
  tab => tab.value,
) as readonly CorporateApplicationListingTab[]

export function CorporateApplicationListingPage() {
  const theme = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useListingTabParam(CORPORATE_TAB_VALUES, 'all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [refreshKey, setRefreshKey] = useState(0)
  const [assignTarget, setAssignTarget] = useState<CorporateApplicationRow | null>(null)
  const [filters, setFilters] = useState<ApplicationListingFilterState>(EMPTY_APPLICATION_LISTING_FILTERS)
  const listingReturnHref = getCurrentListingHref(location)

  const { singles, bulks } = useMemo(
    () => marineApplicationAdminService.listApplicationsBySegment('corporate'),
    [refreshKey],
  )

  const allRows = useMemo(() => getAllCorporateListingRows(singles, bulks), [singles, bulks])

  const tabFilteredRows = useMemo(
    () => filterCorporateRowsByTab(allRows, activeTab),
    [allRows, activeTab],
  )

  const filterOptions = useMemo(
    () => getFilterOptions(singles, bulks),
    [singles, bulks],
  )

  const advancedFilteredRows = useMemo(
    () =>
      applyAdvancedFilters(tabFilteredRows as ApplicationListingRow[], filters) as CorporateApplicationRow[],
    [tabFilteredRows, filters],
  )

  const listing = useCustomerListing({
    rows: advancedFilteredRows,
    getCellValue: getCorporateApplicationCellValue,
    searchMatch: matchesCorporateApplicationSearch,
    initialPageSize: 10,
  })

  const openAssignTeam = useCallback((row: CorporateApplicationRow) => {
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
      buildCorporateApplicationColumns({
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
    navigateFromListing(navigate, `${CORPORATE_LISTING_PATH}/new`, listingReturnHref, {
      state: { freshStart: true },
    })
  }, [listingReturnHref, navigate])

  const emptyState = useMemo(
    () => getCorporateApplicationEmptyState(activeTab, handleCreate),
    [activeTab, handleCreate],
  )

  const handleExport = useCallback(() => {
    downloadCorporateApplicationCsv(listing.filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your application list export will download shortly.',
      variant: 'success',
    })
  }, [listing.filterSourceRows, showToast])

  const handleTabChange = useCallback(
    (tab: CorporateApplicationListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState(state => ({ ...state, page: 0 }))
    },
    [listing, setActiveTab],
  )

  const gridItems = useMemo(
    () => mapCorporateApplicationRowsToGridItems(listing.paginatedRows),
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
          description="Operational workspace for corporate applications across the full submission pipeline"
          actions={
            <Stack direction="row" spacing={2.5} flexWrap="wrap" useFlexGap>
              <Button label="Create application" startIcon={<Plus size={14} />} onClick={handleCreate} />
            </Stack>
          }
        />
      }
      kpis={<CorporateApplicationKpiRow rows={allRows} />}
      tabs={CORPORATE_APPLICATION_LISTING_TABS.map(tab => ({
        value: tab.value,
        label: tab.label,
      }))}
      tabValue={activeTab}
      onTabChange={value => handleTabChange(value as CorporateApplicationListingTab)}
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
            active: hasCorporateApplicationFiltersActive(filters),
            value: filters,
            onApply: (next) => {
              setFilters(next)
              listing.setTableState((state) => ({ ...state, page: 0 }))
            },
            onClear: () => setFilters(EMPTY_APPLICATION_LISTING_FILTERS),
            hasActive: hasCorporateApplicationFiltersActive,
            width: 'wide',
            scrollable: true,
            children: (draft, patch) => (
              <CorporateApplicationAdvancedFilterFields
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
            getCellValue={getCorporateApplicationCellValue}
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
      <CorporateApplicationAssignTeamModal
        open={Boolean(assignTarget)}
        record={assignTarget}
        onClose={() => setAssignTarget(null)}
        onSubmit={handleAssignTeamSubmit}
      />
    </>
  )
}
