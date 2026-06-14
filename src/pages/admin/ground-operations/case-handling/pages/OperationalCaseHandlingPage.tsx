import { useMemo } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { RefreshCw } from 'lucide-react'
import { Button, Pagination, Select, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import { AdminListingStickyHeader, AdminListingToolbar } from '@/pages/admin/components/listing'
import { OPERATIONS_DESK_GROUP_BY_OPTIONS } from '@/shared/types/operationalCaseHandling'
import type { OperationsDeskGroupBy } from '@/shared/types/operationalCaseHandling'
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
} from '../utils/operationalCaseHandlingUtils'

export function OperationalCaseHandlingPage() {
  const theme = useTheme()
  const { showToast } = useToast()

  const {
    deskFilters,
    setDeskFilters,
    groupBy,
    setGroupBy,
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
  } = useOperationalCaseHandling()

  const filterOptions = useMemo(() => getFilterOptions(allRows), [allRows])
  const emptyState = useMemo(() => getOperationsDeskEmptyState(), [])

  const hasActiveFilters = hasOperationsDeskFiltersActive(deskFilters)

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
            actions={
              <Button
                label="Refresh desk"
                variant="outlined"
                startIcon={<RefreshCw size={14} />}
                onClick={() => {
                  refresh()
                  showToast({ title: 'Desk refreshed', variant: 'info' })
                }}
              />
            }
          />
        }
        toolbar={
          <Stack spacing={1.25}>
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
                hasActive: hasOperationsDeskFiltersActive,
                width: 'wide',
                scrollable: true,
                children: (draft, patch) => (
                  <OperationsDeskFilterFields
                    draft={draft}
                    patch={patch}
                    options={filterOptions}
                  />
                ),
              }}
            />
            <Box sx={{ pb: 0.5 }}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
                <Box sx={{ minWidth: { sm: 220 }, maxWidth: { sm: 280 } }}>
                  <Select
                    value={groupBy}
                    onChange={value => {
                      setGroupBy(String(value) as OperationsDeskGroupBy)
                      setTableState(state => ({ ...state, page: 0 }))
                    }}
                    options={OPERATIONS_DESK_GROUP_BY_OPTIONS}
                    placeholder="Group by"
                    size="sm"
                    fullWidth
                  />
                </Box>
              </Stack>
            </Box>
          </Stack>
        }
        listingContent={
          <OperationsDeskCardList
            groups={paginatedGroups}
            groupBy={groupBy}
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
      />
    </>
  )
}
