import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { useLocation, useNavigate } from 'react-router-dom'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import { Pagination, useToast } from '@/design-system/UIComponents'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { useListingTabParam } from '@/shared/hooks/useListingTabParam'
import { getCurrentListingHref, navigateFromListing } from '@/shared/utils/listingNavigationUtils'
import { supportTicketService } from '@/shared/services/supportTicketService'
import type { SupportTicket, SupportTicketStatus } from '@/shared/types/supportTicket'
import { AssignTicketModal } from '../components/AssignTicketModal'
import { SupportTicketKpiRow } from '../components/SupportTicketKpiRow'
import { buildSupportTicketColumns } from '../components/SupportTicketTableColumns'
import { UpdateStatusModal } from '../components/UpdateStatusModal'
import {
  downloadSupportTicketCsv,
  filterSupportTicketRowsByTab,
  getSupportTicketCellValue,
  getSupportTicketEmptyState,
  mapSupportTicketRowsToGridItems,
  matchesSupportTicketSearch,
  type SupportTicketListingTab,
} from '../utils/supportTicketListingUtils'

const TICKET_LISTING_PATH = '/admin/support/tickets'
const TICKET_TAB_VALUES: readonly SupportTicketListingTab[] = [
  'all',
  'open',
  'active',
  'waiting',
  'resolved',
  'closed',
]

export function SupportTicketListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const [rows, setRows] = useState<SupportTicket[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useListingTabParam(TICKET_TAB_VALUES, 'all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const listingReturnHref = getCurrentListingHref(location)

  const goFromListing = useCallback(
    (to: string) => navigateFromListing(navigate, to, listingReturnHref),
    [listingReturnHref, navigate],
  )

  const [assignOpen, setAssignOpen] = useState(false)
  const [statusOpen, setStatusOpen] = useState(false)
  const [activeTicketId, setActiveTicketId] = useState<string>()
  const [activeTicketStatus, setActiveTicketStatus] = useState<SupportTicketStatus>('open')
  const [assignee, setAssignee] = useState('')
  const [statusValue, setStatusValue] = useState<SupportTicketStatus>('assigned')

  const loadRows = useCallback(() => {
    setLoading(true)
    setRows(supportTicketService.list())
    setLoading(false)
  }, [])

  useEffect(() => {
    loadRows()
  }, [loadRows])

  const openAssign = (record: SupportTicket) => {
    setActiveTicketId(record.id)
    setAssignee(record.assignedExecutive ?? '')
    setAssignOpen(true)
  }

  const openStatus = (record: SupportTicket) => {
    setActiveTicketId(record.id)
    setActiveTicketStatus(record.status)
    const allowed = supportTicketService.getAllowedStatusTransitions(record.status)
    setStatusValue(allowed[0] ?? record.status)
    setStatusOpen(true)
  }

  const columns = useMemo(
    () =>
      buildSupportTicketColumns({
        onOpenDetail: (row) => goFromListing(`${TICKET_LISTING_PATH}/${row.id}`),
        onOpenConversation: (row) =>
          goFromListing(`${TICKET_LISTING_PATH}/${row.id}?tab=conversation`),
        onOpenAssign: openAssign,
        onOpenStatus: openStatus,
      }),
    [goFromListing],
  )

  const tabFilteredRows = useMemo(
    () => filterSupportTicketRowsByTab(rows, activeTab),
    [rows, activeTab],
  )

  const listing = useCustomerListing({
    rows: tabFilteredRows,
    getCellValue: getSupportTicketCellValue,
    searchMatch: matchesSupportTicketSearch,
    initialPageSize: 10,
  })

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const emptyState = useMemo(() => getSupportTicketEmptyState(activeTab), [activeTab])

  const handleExport = useCallback(() => {
    downloadSupportTicketCsv(listing.filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your support ticket export will download shortly.',
      variant: 'success',
    })
  }, [listing.filterSourceRows, showToast])

  const handleTabChange = useCallback(
    (tab: SupportTicketListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState((state) => ({ ...state, page: 0 }))
    },
    [listing, setActiveTab],
  )

  const gridItems = useMemo(
    () => mapSupportTicketRowsToGridItems(listing.paginatedRows),
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
            title="Support tickets"
            description="View, assign, and progress support tickets raised from the customer portal."
          />
        }
        kpis={<SupportTicketKpiRow tickets={rows} />}
        tabs={[
          { value: 'all', label: 'All' },
          { value: 'open', label: 'Open' },
          { value: 'active', label: 'Active' },
          { value: 'waiting', label: 'Waiting' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'closed', label: 'Closed' },
        ]}
        tabValue={activeTab}
        onTabChange={(value) => handleTabChange(value as SupportTicketListingTab)}
        toolbar={
          <AdminListingToolbar
            searchValue={listing.tableState.searchQuery}
            onSearch={listing.handleSearch}
            searchPlaceholder="Search by ticket, subject, customer, category…"
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
              getCellValue={getSupportTicketCellValue}
              onRowClick={(row) => goFromListing(`${TICKET_LISTING_PATH}/${row.id}`)}
              loading={loading}
              stickyHeader
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
            />
          ) : (
            <AdminListingGrid
              items={gridItems}
              onItemClick={(id) => goFromListing(`${TICKET_LISTING_PATH}/${id}`)}
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
              onPageSize={(pageSize) =>
                listing.setTableState((state) => ({ ...state, pageSize, page: 0 }))
              }
            />
          </Box>
        }
      />

      <AssignTicketModal
        open={assignOpen}
        value={assignee}
        onClose={() => setAssignOpen(false)}
        onChange={setAssignee}
        onSubmit={() => {
          if (!activeTicketId || !assignee.trim()) return
          supportTicketService.assign(activeTicketId, assignee.trim())
          setAssignOpen(false)
          loadRows()
          showToast({ title: 'Ticket assigned', variant: 'success' })
        }}
      />

      <UpdateStatusModal
        open={statusOpen}
        currentStatus={activeTicketStatus}
        value={statusValue}
        onClose={() => setStatusOpen(false)}
        onChange={setStatusValue}
        onSubmit={() => {
          if (!activeTicketId) return
          supportTicketService.updateStatus(activeTicketId, statusValue)
          setStatusOpen(false)
          loadRows()
          showToast({ title: 'Status updated', variant: 'success' })
        }}
      />
    </>
  )
}
