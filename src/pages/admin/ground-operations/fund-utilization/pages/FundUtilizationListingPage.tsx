import { Box, alpha, useTheme } from '@mui/material'
import { RefreshCw } from 'lucide-react'
import { Button, Pagination, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import { AdminListingStickyHeader, AdminListingToolbar } from '@/pages/admin/components/listing'
import { FundAllocationDetailDrawer } from '@/pages/admin/finance/fund-allocation/components/FundAllocationDetailDrawer'
import { FundUtilizationCardList } from '../components/FundUtilizationCardList'
import { useFundUtilizationListing } from '../hooks/useFundUtilizationListing'

export function FundUtilizationListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()

  const {
    searchValue,
    handleSearch,
    tableState,
    setTableState,
    paginatedRows,
    total,
    selectedRecord,
    selectRecord,
    closeDetail,
    refresh,
  } = useFundUtilizationListing()

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
            description="Allocated funds available for ground operations utilization"
            actions={
              <Button
                label="Refresh"
                variant="outlined"
                startIcon={<RefreshCw size={14} />}
                onClick={() => {
                  refresh()
                  showToast({ title: 'Fund utilization refreshed', variant: 'info' })
                }}
              />
            }
          />
        }
        toolbar={
          <AdminListingToolbar
            searchValue={searchValue}
            onSearch={handleSearch}
            searchPlaceholder="Search passenger, application, passport, company, services…"
            onExport={() =>
              showToast({
                title: 'Export started',
                description: 'Fund utilization export will download shortly.',
                variant: 'success',
              })
            }
          />
        }
        listingContent={
          <FundUtilizationCardList
            rows={paginatedRows}
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

      <FundAllocationDetailDrawer
        open={Boolean(selectedRecord)}
        record={selectedRecord}
        onClose={closeDetail}
      />
    </>
  )
}
