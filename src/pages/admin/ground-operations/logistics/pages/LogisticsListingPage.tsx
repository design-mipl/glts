import { useMemo } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { Pagination, Tabs, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import { AdminListingStickyHeader, AdminListingToolbar } from '@/pages/admin/components/listing'
import {
  OperationsDeskFilterFields,
  hasOperationsDeskFiltersActive,
} from '../../case-handling/components/CaseHandlingFilterBar'
import { OperationsDeskCardList } from '../../case-handling/components/OperationsDeskCardList'
import { LogisticsCaseDetailDrawer } from '../components/LogisticsCaseDetailDrawer'
import { useLogisticsDesk } from '../hooks/useLogisticsDesk'
import {
  getLogisticsDeskEmptyState,
  getLogisticsFilterOptions,
  type LogisticsStatusTab,
} from '../../case-handling/utils/operationalCaseHandlingUtils'

export function LogisticsListingPage() {
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
    handleCaseStatusChanged,
  } = useLogisticsDesk()

  const filterOptions = useMemo(() => getLogisticsFilterOptions(allRows), [allRows])
  const emptyState = useMemo(() => getLogisticsDeskEmptyState(statusTab), [statusTab])

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
            title="Tracking & Logistics"
            description="Passenger cases after document submission — collection, dispatch, and completion"
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
                onChange={value => setStatusTab(value as LogisticsStatusTab)}
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
                  description: 'Logistics queue export will download shortly.',
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

      <LogisticsCaseDetailDrawer
        open={Boolean(selectedCase)}
        record={selectedCase ?? null}
        onClose={closeDetail}
        onUpdated={refresh}
        onStatusChanged={handleCaseStatusChanged}
      />
    </>
  )
}
