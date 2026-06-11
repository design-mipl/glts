import { useCallback, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
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
import type { AssignmentAdminAction, DeskPassengerAction } from '../components/AssignmentActionMenu'
import { AssignmentAdvancedFilters } from '../components/AssignmentAdvancedFilters'
import { AssignmentKpiRow } from '../components/AssignmentKpiRow'
import { AssignmentPassengerDetailDrawer } from '../components/AssignmentPassengerDetailDrawer'
import { buildAssignmentTableColumns } from '../components/AssignmentTableColumns'
import { OperationsDeskPanel } from '../components/OperationsDeskPanel'
import type { AssignmentSegmentConfig } from '../config/assignmentSegmentConfig'
import { useAssignmentQueue } from '../hooks/useAssignmentQueue'
import {
  computeAssignmentKpis,
  downloadAssignmentCsv,
  getAssignmentCellValue,
  getAssignmentFilterOptions,
  getAssignmentTabEmptyState,
} from '../utils/assignmentQueueListingUtils'

interface AssignmentQueuePageProps {
  segmentConfig: AssignmentSegmentConfig
}

export function AssignmentQueuePage({ segmentConfig }: AssignmentQueuePageProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table')
  const [actionModal, setActionModal] = useState<{
    action: AssignmentAdminAction | DeskPassengerAction
    record: OperationalPassengerRow
  } | null>(null)

  const {
    pageView,
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
    handlePageViewChange,
    handleListingTabChange,
    handleSearch,
    clearFilters,
    selectPassenger,
    closeDetail,
    refresh,
    mutateAndRefresh,
  } = useAssignmentQueue(segmentConfig)

  const filterOptions = useMemo(() => getAssignmentFilterOptions(allRows), [allRows])
  const kpis = useMemo(() => computeAssignmentKpis(allRows), [allRows])
  const emptyState = useMemo(() => getAssignmentTabEmptyState(listingTab), [listingTab])

  const hasActiveFilters = Boolean(
    queueFilters.jurisdiction ||
      queueFilters.team ||
      queueFilters.assignedUser ||
      queueFilters.priority ||
      queueFilters.status ||
      queueFilters.datePreset !== 'today' ||
      searchValue ||
      Object.values(columnFilters).some(values => values.length > 0) ||
      tableState.sortKey,
  )

  const columns = useMemo(
    () =>
      buildAssignmentTableColumns({
        segmentConfig,
        navigate,
        showToast,
        onAction: (action, row) => {
          if (action === 'open_passenger_detail' || action === 'view_timeline') {
            selectPassenger(row)
            return
          }
          if (action === 'open_application') return
          setActionModal({ action, record: row })
        },
        onOpenDetail: selectPassenger,
      }),
    [segmentConfig, navigate, showToast, selectPassenger],
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
            return operationalPassengerAssignmentService.assignUser(
              id,
              payload.team as CityTeam,
              payload.user,
            )
          case 'change_priority':
            return operationalPassengerAssignmentService.setPriority(id, payload.priority as AssignmentPriority)
          case 'update_status':
            return operationalPassengerAssignmentService.updateStatus(id, payload.status)
          case 'reassign':
            return operationalPassengerAssignmentService.reassign(
              id,
              payload.team as CityTeam,
              payload.user,
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

  const handleDeskAction = useCallback((action: DeskPassengerAction, row: OperationalPassengerRow) => {
    setActionModal({ action, record: row })
  }, [])

  const gridItems = useMemo(
    () =>
      paginatedRows.map(row => ({
        id: row.id,
        title: row.passengerName,
        subtitle: row.gltsApplicationId,
        meta: `${row.priority} · ${row.passengerStatus}`,
        status: row.passengerStatus,
      })),
    [paginatedRows],
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  const listingBody =
    pageView === 'operations_desk' ? (
      <OperationsDeskPanel
        rows={allRows}
        selectedId={selectedPassenger?.id}
        onSelect={selectPassenger}
        onAction={handleDeskAction}
      />
    ) : viewMode === 'table' ? (
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
                variant="outlined"
                startIcon={<RefreshCw size={14} />}
                onClick={() => {
                  refresh()
                  showToast({ title: 'Queue refreshed', variant: 'info' })
                }}
              />
            }
          />
        }
        kpis={pageView === 'assignment_queue' ? <AssignmentKpiRow kpis={kpis} /> : undefined}
        tabs={
          pageView === 'assignment_queue'
            ? [
                { value: 'all', label: 'All' },
                { value: 'pending_assignment', label: 'Pending assignment' },
                { value: 'assigned', label: 'Assigned' },
                { value: 'in_progress', label: 'In progress' },
                { value: 'carry_forward', label: 'Carry forward' },
                { value: 'completed', label: 'Completed' },
              ]
            : undefined
        }
        tabValue={pageView === 'assignment_queue' ? listingTab : undefined}
        onTabChange={
          pageView === 'assignment_queue'
            ? value => handleListingTabChange(value as AssignmentListingTab)
            : undefined
        }
        toolbar={
          <Stack spacing={1.5}>
            <Stack direction="row" spacing={1} sx={{ mb: pageView === 'assignment_queue' ? 0 : -0.5 }}>
              <Button
                variant={pageView === 'assignment_queue' ? 'contained' : 'outlined'}
                size="sm"
                label="Assignment queue"
                onClick={() => handlePageViewChange('assignment_queue')}
              />
              <Button
                variant={pageView === 'operations_desk' ? 'contained' : 'outlined'}
                size="sm"
                label="Operations desk"
                onClick={() => handlePageViewChange('operations_desk')}
              />
            </Stack>
            {pageView === 'assignment_queue' ? (
              <>
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
                  moreMenuItems={[
                    { label: 'Refresh queue', onClick: refresh },
                    { label: 'Clear all filters', onClick: handleClearFilters },
                  ]}
                />
                <AssignmentAdvancedFilters
                  filters={queueFilters}
                  onFiltersChange={next => {
                    setQueueFilters(next)
                    setTableState(state => ({ ...state, page: 0 }))
                  }}
                  options={filterOptions}
                  onClear={handleClearFilters}
                  hasActiveFilters={hasActiveFilters}
                />
              </>
            ) : null}
          </Stack>
        }
        listingContent={listingBody}
        footer={
          pageView === 'assignment_queue' ? (
            <Box sx={{ bgcolor: footerBg }}>
              <Pagination
                page={tableState.page}
                pageSize={tableState.pageSize}
                total={total}
                onPage={page => setTableState(state => ({ ...state, page }))}
                onPageSize={pageSize => setTableState(state => ({ ...state, pageSize, page: 0 }))}
              />
            </Box>
          ) : undefined
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
