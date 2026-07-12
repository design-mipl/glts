import { useCallback, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
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
  EMPTY_ADMIN_LISTING_FILTERS,
  type AdminListingFilterState,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { useListingTabParam } from '@/shared/hooks/useListingTabParam'
import { TEMPLATE_DEMO_ROWS, type TemplateListingTab } from '../config/demoEntity'
import { TemplateDemoKpiRow } from '../components/TemplateDemoKpiRow'
import { buildTemplateListingColumns } from '../components/templateDemoColumns'
import {
  applyTemplateAdvancedFilters,
  filterTemplateRowsByTab,
  getTemplateCellValue,
  getTemplateEmptyState,
  getTemplateFilterOptions,
  mapTemplateRowsToGridItems,
  matchesTemplateSearch,
} from '../utils/templateListingUtils'

const TEMPLATE_LISTING_TABS: readonly TemplateListingTab[] = ['single', 'bulk', 'draft', 'submitted']

export function ListingTemplatePage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useListingTabParam(TEMPLATE_LISTING_TABS, 'single')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [advancedFilters, setAdvancedFilters] = useState<AdminListingFilterState>(EMPTY_ADMIN_LISTING_FILTERS)

  const tabFilteredRows = useMemo(
    () => filterTemplateRowsByTab(TEMPLATE_DEMO_ROWS, activeTab),
    [activeTab],
  )

  const advancedFilteredRows = useMemo(
    () => applyTemplateAdvancedFilters(tabFilteredRows, advancedFilters),
    [tabFilteredRows, advancedFilters],
  )

  const listing = useCustomerListing({
    rows: advancedFilteredRows,
    getCellValue: getTemplateCellValue,
    searchMatch: matchesTemplateSearch,
    initialPageSize: 10,
  })

  const filterOptions = useMemo(() => getTemplateFilterOptions(TEMPLATE_DEMO_ROWS), [])

  const columns = useMemo(
    () =>
      buildTemplateListingColumns(activeTab, {
        onOpenDetail: () =>
          showToast({ title: 'Open detail', description: 'Navigate to detail route in production modules.', variant: 'info' }),
      }),
    [activeTab, showToast],
  )

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getTemplateEmptyState(activeTab), [activeTab])

  const handleExport = useCallback(() => {
    showToast({
      title: 'Export started',
      description: 'Your listing export will download shortly.',
      variant: 'success',
    })
  }, [showToast])

  const handleClearFilters = useCallback(() => {
    setAdvancedFilters(EMPTY_ADMIN_LISTING_FILTERS)
    listing.handleSearch('')
    listing.setColumnFilters({})
  }, [listing])

  const handleTabChange = useCallback((tab: TemplateListingTab) => {
    setActiveTab(tab)
    setViewMode('table')
    listing.setTableState((state) => ({ ...state, page: 0 }))
  }, [listing])

  const gridItems = useMemo(() => mapTemplateRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Listing module"
            actions={
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button label="New record" startIcon={<Plus size={14} />} />
              </Stack>
            }
          />
        }
        kpis={<TemplateDemoKpiRow rows={TEMPLATE_DEMO_ROWS} />}
        tabs={[
          { value: 'single', label: 'Single records' },
          { value: 'bulk', label: 'Bulk records' },
          { value: 'draft', label: 'Draft records' },
          { value: 'submitted', label: 'Submitted records' },
        ]}
        tabValue={activeTab}
        onTabChange={(value) => handleTabChange(value as TemplateListingTab)}
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search by reference, name, country, or assignee…"
            filter={{
              filters: advancedFilters,
              onApply: (next) => {
                setAdvancedFilters(next)
                listing.setTableState((state) => ({ ...state, page: 0 }))
              },
              onClear: handleClearFilters,
              countries: filterOptions.countries,
              statuses: filterOptions.statuses,
              priorities: filterOptions.priorities,
            }}
            onExport={handleExport}
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
              getCellValue={getTemplateCellValue}
              onRowClick={() =>
                showToast({ title: 'Row opened', description: 'Wire row click to detail route in production.', variant: 'info' })
              }
              stickyHeader
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
            />
          ) : (
            <AdminListingGrid
              items={gridItems}
              onItemClick={() =>
                showToast({ title: 'Card opened', description: 'Wire grid item click to detail route in production.', variant: 'info' })
              }
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
    </>
  )
}
