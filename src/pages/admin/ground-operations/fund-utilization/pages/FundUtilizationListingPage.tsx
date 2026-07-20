import { useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { Button, Pagination, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import { AdminListingStickyHeader, AdminListingToolbar } from '@/pages/admin/components/listing'
import {
  FundAllocationAdvancedFilterFields,
  hasFundAllocationFiltersActive,
} from '@/pages/admin/finance/fund-allocation/components/FundAllocationAdvancedFilters'
import { FundAllocationBatchDetailDrawer } from '@/pages/admin/finance/fund-allocation/components/FundAllocationBatchDetailDrawer'
import { FundSettlementDrawer } from '../components/FundSettlementDrawer'
import { FundUtilizationCardList } from '../components/FundUtilizationCardList'
import { useFundUtilizationListing } from '../hooks/useFundUtilizationListing'
import { buildFundSettlementUserOptions } from '../utils/fundUtilizationSettlementUtils'

export function FundUtilizationListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const [settlementOpen, setSettlementOpen] = useState(false)

  const {
    searchValue,
    handleSearch,
    queueFilters,
    setQueueFilters,
    clearFilters,
    filterOptions,
    tableState,
    setTableState,
    paginatedBatches,
    total,
    selectedRecord,
    selectRecord,
    closeDetail,
    refresh,
    refreshKey,
  } = useFundUtilizationListing()

  const settlementUserOptions = useMemo(
    () => buildFundSettlementUserOptions(filterOptions.users),
    [filterOptions.users],
  )

  const hasActiveFilters = Boolean(
    hasFundAllocationFiltersActive(queueFilters) || searchValue.trim(),
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
            title="Fund utilization"
            description="Allocated fund releases available for ground operations utilization"
            actions={
              <Button
                label="Fund settlement"
                variant="contained"
                onClick={() => setSettlementOpen(true)}
              />
            }
          />
        }
        toolbar={
          <AdminListingToolbar
            searchValue={searchValue}
            onSearch={handleSearch}
            searchPlaceholder="Search allocation, passenger, application, company, services…"
            onExport={() =>
              showToast({
                title: 'Export started',
                description: 'Fund utilization export will download shortly.',
                variant: 'success',
              })
            }
            filterPopover={{
              active: hasActiveFilters,
              value: queueFilters,
              onApply: setQueueFilters,
              onClear: clearFilters,
              hasActive: hasFundAllocationFiltersActive,
              width: 'wide',
              scrollable: true,
              children: (draft, patch) => (
                <FundAllocationAdvancedFilterFields
                  draft={draft}
                  patch={patch}
                  options={filterOptions}
                />
              ),
            }}
          />
        }
        listingContent={
          <FundUtilizationCardList
            batches={paginatedBatches}
            selectedId={selectedRecord?.id}
            onSelect={selectRecord}
          />
        }
        footer={
          <Box sx={{ bgcolor: footerBg }}>
            <Pagination
              page={tableState.page}
              pageSize={tableState.pageSize}
              total={total}
              onPage={page => setTableState(state => ({ ...state, page }))}
              onPageSize={pageSize => setTableState(state => ({ ...state, pageSize, page: 0 }))}
            />
          </Box>
        }
      />

      <FundAllocationBatchDetailDrawer
        open={Boolean(selectedRecord)}
        record={selectedRecord}
        onClose={closeDetail}
      />

      <FundSettlementDrawer
        open={settlementOpen}
        userOptions={settlementUserOptions}
        refreshKey={refreshKey}
        onClose={() => setSettlementOpen(false)}
        onWithdrawn={refresh}
      />
    </>
  )
}
