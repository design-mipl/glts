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
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { useCustomerListing } from '@/pages/customer/features/shared/hooks/useCustomerListing'
import { enquiryService } from '@/shared/services/enquiryService'
import type { EnquiryRecord, EnquiryStatus } from '@/shared/types/enquiry'
import { AddFollowupModal, type FollowupModalValue } from '../components/AddFollowupModal'
import { AssignmentModal, type AssignmentModalValue } from '../components/AssignmentModal'
import { EnquiryKpiRow } from '../components/EnquiryKpiRow'
import { StatusUpdateModal } from '../components/StatusUpdateModal'
import { buildEnquiryColumns } from '../components/EnquiryTableColumns'
import { getEnquiryActor } from '../utils/enquiryActor'
import {
  downloadEnquiryCsv,
  filterEnquiryRowsByTab,
  getEnquiryCellValue,
  getEnquiryEmptyState,
  mapEnquiryRowsToGridItems,
  matchesEnquirySearch,
  type EnquiryListingTab,
} from '../utils/enquiryListingUtils'

const initialAssignment: AssignmentModalValue = {
  assignedTeam: '',
  assignedUser: '',
  branch: '',
  priority: 'medium',
  slaTarget: '',
  assignmentNotes: '',
}

const initialFollowup: FollowupModalValue = {
  followupType: 'call',
  followupDate: '',
  followupTime: '10:00',
  discussionSummary: '',
  nextAction: '',
  assignedUser: '',
  reminderRequired: true,
  followupStatus: 'scheduled',
}

export function EnquiryListingPage() {
  const theme = useTheme()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [rows, setRows] = useState<EnquiryRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<EnquiryListingTab>('all')
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')

  const [statusModalOpen, setStatusModalOpen] = useState(false)
  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false)
  const [followupModalOpen, setFollowupModalOpen] = useState(false)
  const [activeEnquiryId, setActiveEnquiryId] = useState<string>()
  const [activeEnquiryStatus, setActiveEnquiryStatus] = useState<EnquiryStatus>('new')
  const [statusValue, setStatusValue] = useState('under_discussion')
  const [statusReason, setStatusReason] = useState('')
  const [assignmentValue, setAssignmentValue] = useState<AssignmentModalValue>(initialAssignment)
  const [followupValue, setFollowupValue] = useState<FollowupModalValue>(initialFollowup)

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
    setActiveEnquiryStatus(record.status)
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

  const openFollowup = (record: EnquiryRecord) => {
    setActiveEnquiryId(record.id)
    setFollowupValue({
      ...initialFollowup,
      assignedUser: record.assignment.assignedUser ?? '',
    })
    setFollowupModalOpen(true)
  }

  const columns = useMemo(
    () =>
      buildEnquiryColumns({
        onOpenDetail: (row) => navigate(`/admin/customer-accounts/enquiries/${row.id}`),
        onOpenEdit: (row) => navigate(`/admin/customer-accounts/enquiries/${row.id}/edit`),
        onOpenAssignment: openAssignment,
        onOpenStatus: openStatus,
        onOpenFollowup: openFollowup,
      }),
    [navigate],
  )

  const tabFilteredRows = useMemo(
    () => filterEnquiryRowsByTab(rows, activeTab),
    [rows, activeTab],
  )

  const listing = useCustomerListing({
    rows: tabFilteredRows,
    getCellValue: getEnquiryCellValue,
    searchMatch: matchesEnquirySearch,
    initialPageSize: 10,
  })

  const toolbarColumns = useMemo(
    () => columns.filter((col) => col.key !== 'actions').map((col) => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleCreate = useCallback(() => {
    navigate('/admin/customer-accounts/enquiries/new')
  }, [navigate])

  const emptyState = useMemo(
    () => getEnquiryEmptyState(activeTab, handleCreate),
    [activeTab, handleCreate],
  )

  const allowedStatuses = useMemo(
    () => enquiryService.getAllowedStatusTransitions(activeEnquiryStatus),
    [activeEnquiryStatus],
  )

  const bulkActions: BulkAction[] = [
    {
      label: 'Bulk Status Update',
      onClick: (selected) => {
        if (selected.length === 0) return
        if (selected.length > 1) {
          showToast({
            title: 'Select one enquiry',
            description: 'Select one enquiry at a time for status updates.',
            variant: 'info',
          })
          return
        }
        openStatus(selected[0] as EnquiryRecord)
      },
    },
    {
      label: 'Bulk Assignment',
      onClick: (selected) => {
        if (selected.length === 0) return
        if (selected.length > 1) {
          showToast({
            title: 'Select one enquiry',
            description: 'Select one enquiry at a time for assignment updates.',
            variant: 'info',
          })
          return
        }
        openAssignment(selected[0] as EnquiryRecord)
      },
    },
  ]

  const handleExport = useCallback(() => {
    downloadEnquiryCsv(listing.filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your enquiry export will download shortly.',
      variant: 'success',
    })
  }, [listing.filterSourceRows, showToast])

  const handleTabChange = useCallback(
    (tab: EnquiryListingTab) => {
      setActiveTab(tab)
      setViewMode('table')
      listing.setTableState((state) => ({ ...state, page: 0 }))
    },
    [listing],
  )

  const gridItems = useMemo(() => mapEnquiryRowsToGridItems(listing.paginatedRows), [listing.paginatedRows])

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
                <Button label="Create Enquiry" startIcon={<Plus size={14} />} onClick={handleCreate} />
              </Stack>
            }
          />
        }
        kpis={<EnquiryKpiRow enquiries={rows} />}
        tabs={[
          { value: 'all', label: 'All enquiries' },
          { value: 'new', label: 'New' },
          { value: 'active', label: 'Active' },
          { value: 'converted', label: 'Converted' },
          { value: 'closed', label: 'Closed' },
        ]}
        tabValue={activeTab}
        onTabChange={(value) => handleTabChange(value as EnquiryListingTab)}
        toolbar={
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
              getCellValue={getEnquiryCellValue}
              onRowClick={(row) => navigate(`/admin/customer-accounts/enquiries/${row.id}`)}
              loading={loading}
              bulkActions={bulkActions}
              stickyHeader
              emptyTitle={emptyState.emptyTitle}
              emptyDescription={emptyState.emptyDescription}
              emptyAction={emptyState.emptyAction}
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
        allowedStatuses={allowedStatuses}
        onClose={() => setStatusModalOpen(false)}
        onStatusChange={setStatusValue}
        onReasonChange={setStatusReason}
        onSubmit={async () => {
          if (!activeEnquiryId) return
          const actor = getEnquiryActor()
          const result = await enquiryService.updateStatus(
            activeEnquiryId,
            statusValue as EnquiryStatus,
            actor,
            statusReason,
          )
          if (!result.ok) {
            showToast({
              title: 'Status update failed',
              description: 'message' in result ? result.message : 'Invalid status transition',
              variant: 'error',
            })
            return
          }
          setStatusModalOpen(false)
          showToast({ title: 'Status updated', variant: 'success' })
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
            getEnquiryActor(),
          )
          setAssignmentModalOpen(false)
          showToast({ title: 'Assignment updated', variant: 'success' })
          await loadRows()
        }}
      />

      <AddFollowupModal
        open={followupModalOpen}
        value={followupValue}
        onClose={() => setFollowupModalOpen(false)}
        onChange={setFollowupValue}
        onSubmit={async () => {
          if (!activeEnquiryId) return
          await enquiryService.addFollowup(
            activeEnquiryId,
            {
              ...followupValue,
              followupType: followupValue.followupType as 'call',
              followupStatus: followupValue.followupStatus as 'scheduled',
              createdBy: getEnquiryActor(),
            },
            getEnquiryActor(),
          )
          setFollowupModalOpen(false)
          setFollowupValue(initialFollowup)
          showToast({ title: 'Follow-up scheduled', variant: 'success' })
          await loadRows()
        }}
      />
    </>
  )
}
