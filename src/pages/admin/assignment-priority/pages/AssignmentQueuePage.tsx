import { useCallback, useMemo, useState } from 'react'
import { Box, alpha, useTheme } from '@mui/material'
import { RefreshCw } from 'lucide-react'
import { Button, Pagination, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import {
  AdminListingGrid,
  AdminListingStickyHeader,
  AdminListingTable,
  AdminListingToolbar,
} from '@/pages/admin/components/listing'
import { operationalPassengerAssignmentService } from '@/shared/services/operationalPassengerAssignmentService'
import type {
  AssignmentListingTab,
  AssignmentPriority,
  OperationalPassengerRow,
} from '@/shared/types/operationalPassengerAssignment'
import type { CityTeam } from '@/shared/types/operationalCaseHandling'
import { AssignmentActionModal, type AssignmentActionPayload } from '../components/AssignmentActionModal'
import type { AssignmentAdminAction } from '../components/AssignmentActionMenu'
import { AssignmentAdvancedFilterFields, hasAssignmentQueueFiltersActive } from '../components/AssignmentAdvancedFilters'
import { AssignmentPassengerDetailDrawer } from '../components/AssignmentPassengerDetailDrawer'
import { buildAssignmentTableColumns } from '../components/AssignmentTableColumns'
import { buildOperationalAssignmentTableColumns } from '../components/AssignmentOperationalTableColumns'
import type { AssignmentSegmentConfig } from '../config/assignmentSegmentConfig'
import { useAssignmentQueue } from '../hooks/useAssignmentQueue'
import {
  downloadAssignmentCsv,
  formatSlaDisplayLabel,
  getAssignmentCellValue,
  getAssignmentFilterOptions,
  getAssignmentTabEmptyState,
} from '../utils/assignmentQueueListingUtils'

interface AssignmentQueuePageProps {
  segmentConfig: AssignmentSegmentConfig
}

export function AssignmentQueuePage({ segmentConfig }: AssignmentQueuePageProps) {
  const theme = useTheme()
  const { showToast } = useToast()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [actionModal, setActionModal] = useState<{
    action: AssignmentAdminAction
    record: OperationalPassengerRow
  } | null>(null)

  const {
    listingTab,
    queueFilters,
    setQueueFilters,
    tableState,
    setTableState,
    columnFilters,
    setColumnFilters,
    allRows,
    filterSourceRows,
    paginatedRows,
    total,
    selectedPassenger,
    searchValue,
    handleListingTabChange,
    handleSearch,
    clearFilters,
    selectPassenger,
    closeDetail,
    refresh,
    mutateAndRefresh,
  } = useAssignmentQueue(segmentConfig)

  const filterOptions = useMemo(() => getAssignmentFilterOptions(allRows), [allRows])
  const emptyState = useMemo(() => getAssignmentTabEmptyState(listingTab), [listingTab])

  const isOperationalListing = segmentConfig.listingLayout === 'operational'

  const hasActiveFilters = Boolean(
    queueFilters.jurisdiction ||
      queueFilters.team ||
      queueFilters.assignedUser ||
      queueFilters.priority ||
      queueFilters.country ||
      queueFilters.visaType ||
      queueFilters.status ||
      queueFilters.sla ||
      queueFilters.datePreset !== 'today' ||
      searchValue ||
      Object.values(columnFilters).some(values => values.length > 0) ||
      tableState.sortKey,
  )

  const columns = useMemo(
    () => {
      const columnParams = {
        onAction: (action: AssignmentAdminAction, row: OperationalPassengerRow) => {
          if (action === 'view_details') {
            selectPassenger(row)
            return
          }
          setActionModal({ action, record: row })
        },
      }

      return isOperationalListing
        ? buildOperationalAssignmentTableColumns(columnParams)
        : buildAssignmentTableColumns(columnParams)
    },
    [isOperationalListing, selectPassenger],
  )

  const toolbarColumns = useMemo(
    () => columns.filter(col => col.key !== 'actions').map(col => ({ key: col.key, label: col.label })),
    [columns],
  )

  const handleExport = useCallback(() => {
    downloadAssignmentCsv(filterSourceRows)
    showToast({
      title: 'Export started',
      description: 'Your assignment queue export will download shortly.',
      variant: 'success',
    })
  }, [filterSourceRows, showToast])

  const handleClearFilters = useCallback(() => {
    clearFilters()
  }, [clearFilters])

  const applyAction = useCallback(
    (payload: AssignmentActionPayload) => {
      const id = actionModal?.record.id
      if (!id) return

      mutateAndRefresh(() => {
        switch (payload.action) {
          case 'assign_user':
            if (payload.assigneeType === 'vendor') {
              return operationalPassengerAssignmentService.assignVendor(
                id,
                payload.vendor,
                payload.priority as AssignmentPriority,
              )
            }
            return operationalPassengerAssignmentService.assignUser(
              id,
              payload.team as CityTeam,
              payload.user,
              payload.priority as AssignmentPriority,
            )
          case 'change_priority':
            return operationalPassengerAssignmentService.setPriority(id, payload.priority as AssignmentPriority)
          case 'update_status':
            return operationalPassengerAssignmentService.updateStatus(id, payload.status)
          case 'reassign':
            if (payload.assigneeType === 'vendor') {
              return operationalPassengerAssignmentService.reassign(
                id,
                '',
                payload.vendor,
                payload.priority as AssignmentPriority,
                'vendor',
              )
            }
            return operationalPassengerAssignmentService.reassign(
              id,
              payload.team as CityTeam,
              payload.user,
              payload.priority as AssignmentPriority,
              'user',
            )
          case 'add_notes':
            return operationalPassengerAssignmentService.appendRemark(id, payload.notes)
          case 'move_next_date':
            return operationalPassengerAssignmentService.moveToNextOperationalDate(id)
          case 'upload_proof':
            return operationalPassengerAssignmentService.addAttachment(id, payload.fileName)
          case 'mark_complete':
            return operationalPassengerAssignmentService.markComplete(id)
          case 'escalate':
            return operationalPassengerAssignmentService.escalate(id)
          default:
            return undefined
        }
      })

      setActionModal(null)
      showToast({ title: 'Passenger updated', variant: 'success' })
    },
    [actionModal, mutateAndRefresh, showToast],
  )

  const gridItems = useMemo(
    () =>
      paginatedRows.map(row => ({
        id: row.id,
        title: row.passengerName,
        subtitle: isOperationalListing
          ? `${row.country} • ${row.visaType}`
          : row.gltsApplicationId,
        meta: isOperationalListing
          ? `${row.priority} · ${formatSlaDisplayLabel(row)}`
          : `${row.priority} · ${row.passengerStatus}`,
        status: row.passengerStatus,
      })),
    [paginatedRows, isOperationalListing],
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  const listingBody =
    viewMode === 'table' ? (
      <AdminListingTable
        columns={columns}
        data={paginatedRows}
        filterSourceData={filterSourceRows}
        rowKey="id"
        state={tableState}
        onStateChange={setTableState}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
        getCellValue={getAssignmentCellValue}
        onRowClick={selectPassenger}
        stickyHeader
        emptyTitle={emptyState.title}
        emptyDescription={emptyState.description}
      />
    ) : (
      <AdminListingGrid items={gridItems} onItemClick={id => {
        const row = paginatedRows.find(r => r.id === id)
        if (row) selectPassenger(row)
      }} />
    )

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title={segmentConfig.queueTitle}
            description={segmentConfig.queueSubtitle}
            actions={
              <Button
                label="Refresh queue"
                variant="neutral"
                size="sm"
                startIcon={<RefreshCw size={14} />}
                onClick={() => {
                  refresh()
                  showToast({ title: 'Queue refreshed', variant: 'info' })
                }}
              />
            }
          />
        }
        tabs={[
          { value: 'pending_assignment', label: 'Pending assignment' },
          { value: 'assigned', label: 'Assigned' },
          { value: 'in_progress', label: 'In progress' },
          { value: 'carry_forward', label: 'Carry forward' },
          { value: 'completed', label: 'Completed' },
        ]}
        tabValue={listingTab}
        onTabChange={value => handleListingTabChange(value as AssignmentListingTab)}
        toolbar={
          <AdminListingToolbar
            searchValue={searchValue}
            onSearch={handleSearch}
            searchPlaceholder="Search passenger, application ID, company, jurisdiction…"
            onExport={handleExport}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            columns={toolbarColumns}
            hiddenColumnKeys={tableState.hiddenColumnKeys}
            onHiddenColumnKeysChange={keys =>
              setTableState(state => ({ ...state, hiddenColumnKeys: keys }))
            }
            filterPopover={{
              active: hasActiveFilters,
              value: queueFilters,
              onApply: next => {
                setQueueFilters(next)
                setTableState(state => ({ ...state, page: 0 }))
              },
              onClear: handleClearFilters,
              hasActive: value => hasAssignmentQueueFiltersActive(value, isOperationalListing),
              width: 'wide',
              scrollable: true,
              children: (draft, patch) => (
                <AssignmentAdvancedFilterFields
                  draft={draft}
                  patch={patch}
                  options={filterOptions}
                  extendedFilters={isOperationalListing}
                />
              ),
            }}
          />
        }
        listingContent={listingBody}
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

      <AssignmentPassengerDetailDrawer
        open={Boolean(selectedPassenger)}
        record={selectedPassenger ?? null}
        segmentConfig={segmentConfig}
        onClose={closeDetail}
      />

      <AssignmentActionModal
        open={Boolean(actionModal)}
        action={actionModal?.action ?? null}
        record={actionModal?.record ?? null}
        onClose={() => setActionModal(null)}
        onConfirm={applyAction}
      />
    </>
  )
}
