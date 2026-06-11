import { useCallback, useMemo, useState } from 'react'
import { Box, Stack, alpha, useTheme } from '@mui/material'
import { RefreshCw } from 'lucide-react'
import { Button, Pagination, useToast } from '@/design-system/UIComponents'
import { AdminListingShell } from '@/pages/admin/components/AdminListingShell'
import { AdminListingStickyHeader, AdminListingToolbar } from '@/pages/admin/components/listing'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import { CaseHandlingFilterBar } from '../components/CaseHandlingFilterBar'
import { OperationalCaseActionModal, type ActionPayload } from '../components/OperationalCaseActionModal'
import type { AdminCaseAction } from '../components/OperationalCaseActionMenu'
import { OperationalCaseDetailDrawer } from '../components/OperationalCaseDetailDrawer'
import { OperationsDeskCardList } from '../components/OperationsDeskCardList'
import { PriorityQueueCardList } from '../components/PriorityQueueCardList'
import { PriorityQueueKpiRow } from '../components/PriorityQueueKpiRow'
import { TeamCapacityStrip } from '../components/TeamCapacityStrip'
import { useOperationalCaseHandling } from '../hooks/useOperationalCaseHandling'
import {
  computePriorityQueueKpis,
  getFilterOptions,
  getTabEmptyState,
  type CaseHandlingTab,
} from '../utils/operationalCaseHandlingUtils'

export function OperationalCaseHandlingPage() {
  const theme = useTheme()
  const { showToast } = useToast()

  const {
    activeTab,
    priorityFilters,
    setPriorityFilters,
    deskFilters,
    setDeskFilters,
    tableState,
    setTableState,
    columnFilters,
    setColumnFilters,
    filterSourceRows,
    allRows,
    paginatedRows,
    total,
    teamCapacity,
    selectedCaseId,
    selectedCase,
    searchValue,
    handleTabChange,
    handleSearch,
    clearFilters,
    selectCase,
    closeDetail,
    refresh,
    mutateAndRefresh,
  } = useOperationalCaseHandling()

  const [actionModal, setActionModal] = useState<{
    action: AdminCaseAction
    record: OperationalCase
  } | null>(null)

  const filterOptions = useMemo(() => getFilterOptions(allRows), [allRows])
  const kpis = useMemo(() => computePriorityQueueKpis(allRows), [allRows])
  const emptyState = useMemo(() => getTabEmptyState(activeTab), [activeTab])

  const hasActiveFilters =
    activeTab === 'priority_queue'
      ? Boolean(
          priorityFilters.priority ||
            priorityFilters.cityTeam ||
            priorityFilters.country ||
            priorityFilters.datePreset !== 'today' ||
            Object.values(columnFilters).some(values => values.length > 0) ||
            tableState.sortKey,
        )
      : Boolean(deskFilters.status || deskFilters.team || deskFilters.datePreset !== 'today')

  const handleAdminAction = useCallback((action: AdminCaseAction, row: OperationalCase) => {
    setActionModal({ action, record: row })
  }, [])

  const applyAction = useCallback(
    (payload: ActionPayload) => {
      const id = actionModal?.record.id
      if (!id) return

      mutateAndRefresh(() => {
        switch (payload.action) {
          case 'set_priority':
            return operationalCaseHandlingService.setPriority(id, payload.priority)
          case 'assign_team':
            return operationalCaseHandlingService.assignTeam(id, payload.team)
          case 'assign_executive':
            return operationalCaseHandlingService.assignExecutive(id, payload.executive)
          case 'reassign':
            return operationalCaseHandlingService.reassign(id, payload.team, payload.executive)
          case 'move_next_day':
            return operationalCaseHandlingService.moveToNextDay(id)
          default:
            return undefined
        }
      })

      setActionModal(null)
      showToast({ title: 'Case updated', variant: 'success' })
    },
    [actionModal, mutateAndRefresh, showToast],
  )

  const footerBg =
    theme.palette.mode === 'dark'
      ? alpha(theme.palette.common.white, 0.04)
      : alpha(theme.palette.common.black, 0.02)

  const listingBody =
    activeTab === 'priority_queue' ? (
      <PriorityQueueCardList
        rows={paginatedRows}
        filterSourceRows={filterSourceRows}
        selectedId={selectedCaseId}
        onSelect={selectCase}
        onAction={handleAdminAction}
        emptyTitle={emptyState.emptyTitle}
        emptyDescription={emptyState.emptyDescription}
        tableState={tableState}
        onTableStateChange={setTableState}
        columnFilters={columnFilters}
        onColumnFiltersChange={setColumnFilters}
      />
    ) : (
      <OperationsDeskCardList
        rows={paginatedRows}
        selectedId={selectedCaseId}
        onSelect={selectCase}
        emptyTitle={emptyState.emptyTitle}
        emptyDescription={emptyState.emptyDescription}
      />
    )

  return (
    <>
      <AdminListingShell
        stickyPageHeader={
          <AdminListingStickyHeader
            title="Operational case handling"
            description="Operations control center for priority monitoring and ground execution"
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
        kpis={
          activeTab === 'priority_queue' ? (
            <Stack spacing={1}>
              <PriorityQueueKpiRow metrics={kpis} />
              <TeamCapacityStrip teams={teamCapacity} />
            </Stack>
          ) : undefined
        }
        tabs={[
          { value: 'priority_queue', label: 'Priority Queue' },
          { value: 'operations_desk', label: 'Operations Desk' },
        ]}
        tabValue={activeTab}
        onTabChange={value => handleTabChange(value as CaseHandlingTab)}
        toolbar={
          <Stack spacing={1.5}>
            <AdminListingToolbar
              searchValue={searchValue}
              onSearch={handleSearch}
              searchPlaceholder="Search application ID, company, country, team, executive…"
              onExport={() =>
                showToast({
                  title: 'Export started',
                  description: 'Operational queue export will download shortly.',
                  variant: 'success',
                })
              }
              moreMenuItems={[
                { label: 'Refresh queue', onClick: refresh },
                { label: 'Clear all filters', onClick: clearFilters },
              ]}
            />
            {activeTab === 'priority_queue' ? (
              <CaseHandlingFilterBar
                variant="priority_queue"
                filters={priorityFilters}
                onFiltersChange={next => {
                  setPriorityFilters(next)
                  setTableState(state => ({ ...state, page: 0 }))
                }}
                options={filterOptions}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            ) : (
              <CaseHandlingFilterBar
                variant="operations_desk"
                filters={deskFilters}
                onFiltersChange={next => {
                  setDeskFilters(next)
                  setTableState(state => ({ ...state, page: 0 }))
                }}
                options={{
                  statuses: filterOptions.statuses,
                  cityTeams: filterOptions.cityTeams,
                }}
                onClear={clearFilters}
                hasActiveFilters={hasActiveFilters}
              />
            )}
          </Stack>
        }
        listingContent={listingBody}
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
        mode={activeTab}
        onClose={closeDetail}
        onUpdated={refresh}
      />

      <OperationalCaseActionModal
        open={Boolean(actionModal)}
        action={actionModal?.action ?? null}
        record={actionModal?.record ?? null}
        onClose={() => setActionModal(null)}
        onConfirm={applyAction}
      />
    </>
  )
}
