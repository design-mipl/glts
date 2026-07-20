import { useMemo } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { Pagination, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import { AdminListingStickyHeader, AdminListingToolbar } from '@/pages/admin/components/listing'
import {
  OperationsDeskFilterFields,
  hasOperationsDeskFiltersActive,
} from '../components/CaseHandlingFilterBar'
import { OperationalCaseDetailDrawer } from '../components/OperationalCaseDetailDrawer'
import { OperationsDeskCardList } from '../components/OperationsDeskCardList'
import { useOperationalCaseHandling } from '../hooks/useOperationalCaseHandling'
import {
  getFilterOptions,
  getOperationsDeskEmptyState,
  type OperationsDeskStatusTab,
} from '../utils/operationalCaseHandlingUtils'

export function OperationalCaseHandlingPage() {
  const theme = useTheme()
  const { showToast } = useToast()

  const {
    deskFilters,
    setDeskFilters,
    statusTab,
    setStatusTab,
    statusTabs,
    tableState,
    setTableState,
    allRows,
    paginatedGroups,
    total,
    selectedCase,
    searchValue,
    handleSearch,
    clearFilters,
    selectCase,
    closeDetail,
    refresh,
    handleDocumentsSubmitted,
  } = useOperationalCaseHandling()

  const filterOptions = useMemo(() => getFilterOptions(allRows), [allRows])
  const emptyState = useMemo(() => getOperationsDeskEmptyState(statusTab), [statusTab])

  const hasActiveFilters = hasOperationsDeskFiltersActive(deskFilters, { ignoreStatus: true })

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Operations Desk"
            description="Passenger-level ground execution workspace for assigned operational records"
          />
        }
        toolbar={
          <Stack spacing={1.25}>
            <Box
              sx={{
                mx: -2,
                px: 2,
                borderBottom: 1,
                borderColor: 'divider',
              }}
            >
              <Tabs
                value={statusTab}
                onChange={value => setStatusTab(value as OperationsDeskStatusTab)}
                variant="underline"
                size="sm"
                scrollable
                items={statusTabs}
                sx={{ mb: 0, minHeight: 40 }}
              />
            </Box>
            <AdminListingToolbar
              searchValue={searchValue}
              onSearch={handleSearch}
              searchPlaceholder="Search passenger, operational ID, batch, passport, CDC, vessel…"
              onExport={() =>
                showToast({
                  title: 'Export started',
                  description: 'Operations desk export will download shortly.',
                  variant: 'success',
                })
              }
              filterPopover={{
                active: hasActiveFilters,
                value: deskFilters,
                onApply: next => {
                  setDeskFilters(next)
                  setTableState(state => ({ ...state, page: 0 }))
                },
                onClear: clearFilters,
                hasActive: filters => hasOperationsDeskFiltersActive(filters, { ignoreStatus: true }),
                width: 'wide',
                scrollable: true,
                children: (draft, patch) => (
                  <OperationsDeskFilterFields
                    draft={draft}
                    patch={patch}
                    options={filterOptions}
                    hideStatusFilter
                  />
                ),
              }}
            />
          </Stack>
        }
        listingContent={
          <OperationsDeskCardList
            groups={paginatedGroups}
            groupBy="none"
            selectedId={selectedCase?.id}
            onSelect={selectCase}
            emptyTitle={emptyState.emptyTitle}
            emptyDescription={emptyState.emptyDescription}
          />
        }
        footer={
          <Box sx={{ bgcolor: footerBg }}>
            <Pagination
              page={tableState.page}
              pageSize={tableState.pageSize}
              total={total}
              onPage={page => setTableState(state => ({ ...state, page }))}
              onPageSize={pageSize =>
                setTableState(state => ({ ...state, pageSize, page: 0 }))
              }
            />
          </Box>
        }
      />

      <OperationalCaseDetailDrawer
        open={Boolean(selectedCase)}
        record={selectedCase ?? null}
        onClose={closeDetail}
        onUpdated={refresh}
        onSubmitted={handleDocumentsSubmitted}
      />
    </>
  )
}
