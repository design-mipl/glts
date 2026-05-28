import { useCallback, useEffect, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { BulkAction } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  Button,
  Pagination,
  useToast,
} from '@/design-system/UIComponents'
import {
  AdminListingAdvancedFilters,
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { enquiryService } from '@/shared/services/enquiryService'
import type { EnquiryRecord } from '@/shared/types/enquiry'
import { AssignmentModal, type AssignmentModalValue } from '../components/AssignmentModal'
import { EnquiryKpiRow } from '../components/EnquiryKpiRow'
import { StatusUpdateModal } from '../components/StatusUpdateModal'
import { buildEnquiryColumns } from '../components/EnquiryTableColumns'
import { enquiryStatusLabel } from '../config/enquiryStatusConfig'
import {
  applyEnquiryAdvancedFilters,
  EMPTY_ENQUIRY_LISTING_FILTERS,
  getEnquiryCellValue,
  getEnquiryFilterOptions,
  matchesEnquirySearch,
} from '../hooks/useEnquiryListingState'

const initialAssignment: AssignmentModalValue = {
  assignedTeam: '',
  assignedUser: '',
  branch: '',
  priority: 'medium',
  slaTarget: '',
  assignmentNotes: '',
}

function getGridStatusColor(status: EnquiryRecord['status']): 'success' | 'warning' | 'info' {
  if (status === 'converted') return 'success'
  if (status === 'on_hold') return 'warning'
  return 'info'
}

export function EnquiryListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [rows, setRows] = useState<EnquiryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [advancedFilters, setAdvancedFilters] = useState(EMPTY_ENQUIRY_LISTING_FILTERS)

  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
  const [activeEnquiryId, setActiveEnquiryId] = useState<string>()
  const [statusValue, setStatusValue] = useState('under_discussion')
  const [statusReason, setStatusReason] = useState('')
  const [assignmentValue, setAssignmentValue] = useState<AssignmentModalValue>(initialAssignment)

  const loadRows = async () => {
    setLoading(true)
    const data = await enquiryService.list()
    setRows(data)
    setLoading(false)
  }

  useEffect(() => {
    void loadRows()
  }, [])

  const openStatus = (record: EnquiryRecord) => {
    setActiveEnquiryId(record.id)
    setStatusValue(record.status)
    setStatusReason('')
    setStatusModalOpen(true)
  }

  const openAssignment = (record: EnquiryRecord) => {
    setActiveEnquiryId(record.id)
    setAssignmentValue({
      assignedTeam: record.assignment.assignedTeam ?? '',
      assignedUser: record.assignment.assignedUser ?? '',
      branch: record.assignment.branch ?? '',
      priority: record.assignment.priority,
      slaTarget: record.assignment.slaTarget?.slice(0, 10) ?? '',
      assignmentNotes: record.assignment.assignmentNotes ?? '',
    })
    setAssignmentModalOpen(true)
  }

  const columns = useMemo(() => buildEnquiryColumns({
    onOpenDetail: (row) => navigate(`/admin/customer-accounts/enquiries/${row.id}`),
    onOpenAssignment: openAssignment,
    onOpenStatus: openStatus,
  }), [navigate])

  const advancedFilteredRows = useMemo(
    () => applyEnquiryAdvancedFilters(rows, advancedFilters),
    [rows, advancedFilters],
  )

  const listing = useCustomerListing({
    rows: advancedFilteredRows,
    getCellValue: getEnquiryCellValue,
    searchMatch: matchesEnquirySearch,
    initialPageSize: 10,
  })

  const filterOptions = useMemo(() => getEnquiryFilterOptions(rows), [rows])

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const hasActiveFilters = Boolean(advancedFilters.country || advancedFilters.status || advancedFilters.priority)

  const bulkActions: BulkAction[] = [
    {
      label: 'Bulk Status Update',
      onClick: (selected) => {
        if (selected.length > 0) {
          const first = selected[0] as EnquiryRecord
          openStatus(first)
        }
      },
    },
    {
      label: 'Bulk Assignment',
      onClick: (selected) => {
        if (selected.length > 0) {
          const first = selected[0] as EnquiryRecord
          openAssignment(first)
        }
      },
    },
  ]

  const handleRefresh = useCallback(async () => {
    await loadRows()
    showToast({ title: 'List refreshed', variant: 'info' })
  }, [showToast])

  const handleExport = useCallback(() => {
    showToast({
      title: 'Export started',
      description: 'Your enquiry export will download shortly.',
      variant: 'success',
    })
  }, [showToast])

  const handleClearFilters = useCallback(() => {
    setAdvancedFilters(EMPTY_ENQUIRY_LISTING_FILTERS)
    listing.handleSearch('')
    listing.setColumnFilters({})
  }, [listing])

  const gridItems = useMemo(
    () =>
      listing.paginatedRows.map((row) => ({
        id: row.id,
        title: row.customer.companyOrCustomerName,
        subtitle: `${row.id} • ${row.customer.contactPersonName}`,
        meta: `${row.visaRequirement.countries.join(', ')} • ${row.visaRequirement.visaType}`,
        status: enquiryStatusLabel[row.status],
        statusColor: getGridStatusColor(row.status),
      })),
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
            title="Enquiry Management"
            description="Capture, qualify, assign, and progress customer enquiries toward quotation."
            actions={
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                <Button label="Create Enquiry" startIcon={<Plus size={14} />} onClick={() => navigate('/admin/customer-accounts/enquiries/new')} />
              </Stack>
            }
          />
        }
        kpis={<EnquiryKpiRow enquiries={rows} />}
        toolbar={
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
            <AdminListingToolbar
              searchValue={listing.tableState.searchQuery}
              onSearch={listing.handleSearch}
              searchPlaceholder="Search by enquiry ID, company, contact, country, or assignee…"
              onExport={handleExport}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              columns={toolbarColumns}
              hiddenColumnKeys={listing.tableState.hiddenColumnKeys}
              onHiddenColumnKeysChange={(keys) =>
                listing.setTableState((state) => ({ ...state, hiddenColumnKeys: keys }))
              }
              moreMenuItems={[
                { label: 'Refresh list', onClick: () => void handleRefresh() },
                { label: 'Clear all filters', onClick: handleClearFilters },
              ]}
            />
            <AdminListingAdvancedFilters
              filters={advancedFilters}
              onFiltersChange={(next) => {
                setAdvancedFilters(next)
                listing.setTableState((state) => ({ ...state, page: 0 }))
              }}
              onClearFilters={handleClearFilters}
              countries={filterOptions.countries}
              statuses={filterOptions.statuses}
              priorities={filterOptions.priorities}
              hasActiveFilters={hasActiveFilters}
            />
          </Box>
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
              getCellValue={getEnquiryCellValue}
              onRowClick={(row) => navigate(`/admin/customer-accounts/enquiries/${row.id}`)}
              loading={loading}
              bulkActions={bulkActions}
              stickyHeader
              emptyTitle="No enquiries available"
              emptyDescription="Create a new enquiry to begin tracking onboarding requirements."
              emptyAction={{
                label: 'Create enquiry',
                onClick: () => navigate('/admin/customer-accounts/enquiries/new'),
              }}
            />
          ) : (
            <AdminListingGrid
              items={gridItems}
              onItemClick={(id) => navigate(`/admin/customer-accounts/enquiries/${id}`)}
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

      <StatusUpdateModal
        open={statusModalOpen}
        value={statusValue}
        reason={statusReason}
        onClose={() => setStatusModalOpen(false)}
        onStatusChange={setStatusValue}
        onReasonChange={setStatusReason}
        onSubmit={async () => {
          if (!activeEnquiryId) return
          await enquiryService.updateStatus(activeEnquiryId, statusValue as EnquiryRecord['status'], 'Admin User', statusReason)
          setStatusModalOpen(false)
          await loadRows()
        }}
      />

      <AssignmentModal
        open={assignmentModalOpen}
        value={assignmentValue}
        onClose={() => setAssignmentModalOpen(false)}
        onChange={setAssignmentValue}
        onSubmit={async () => {
          if (!activeEnquiryId) return
          await enquiryService.assignOwner(
            activeEnquiryId,
            {
              assignedTeam: assignmentValue.assignedTeam,
              assignedUser: assignmentValue.assignedUser,
              branch: assignmentValue.branch,
              priority: assignmentValue.priority as EnquiryRecord['assignment']['priority'],
              slaTarget: assignmentValue.slaTarget,
              assignmentNotes: assignmentValue.assignmentNotes,
            },
            'Admin User',
          )
          setAssignmentModalOpen(false)
          await loadRows()
        }}
      />
    </>
  )
}
