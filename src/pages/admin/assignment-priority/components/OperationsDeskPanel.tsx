import { Stack } from '@mui/material'
import type { OperationalPassengerRow } from '@/shared/types/operationalPassengerAssignment'
import { isSlaAtRisk } from '../utils/assignmentQueueListingUtils'
import type { DeskPassengerAction } from './AssignmentActionMenu'
import { OperationsDeskSectionList } from './OperationsDeskSectionList'

interface OperationsDeskPanelProps {
  rows: OperationalPassengerRow[]
  selectedId?: string | null
  onSelect: (row: OperationalPassengerRow) => void
  onAction: (action: DeskPassengerAction, row: OperationalPassengerRow) => void
}

export function OperationsDeskPanel({ rows, selectedId, onSelect, onAction }: OperationsDeskPanelProps) {
  const today = new Date().toISOString().slice(0, 10)

  const todaysAssigned = rows.filter(
    r => r.operationalDate === today && r.passengerStatus === 'Assigned' && r.assignedUser,
  )
  const pendingActions = rows.filter(
    r =>
      r.passengerStatus === 'Pending Assignment' ||
      (r.passengerStatus === 'Assigned' && !r.assignedUser),
  )
  const carryForward = rows.filter(r => r.carryForward || r.passengerStatus === 'Carry Forward')
  const slaRisk = rows.filter(isSlaAtRisk)
  const completed = rows.filter(r => r.passengerStatus === 'Completed')

  return (
    <Stack spacing={2.5}>
      <OperationsDeskSectionList
        title="Today's assigned work"
        rows={todaysAssigned}
        selectedId={selectedId}
        onSelect={onSelect}
        onAction={onAction}
      />
      <OperationsDeskSectionList
        title="Pending actions"
        rows={pendingActions}
        selectedId={selectedId}
        onSelect={onSelect}
        onAction={onAction}
      />
      <OperationsDeskSectionList
        title="Carry forward cases"
        rows={carryForward}
        selectedId={selectedId}
        onSelect={onSelect}
        onAction={onAction}
      />
      <OperationsDeskSectionList
        title="SLA breach risk"
        rows={slaRisk}
        selectedId={selectedId}
        onSelect={onSelect}
        onAction={onAction}
      />
      <OperationsDeskSectionList
        title="Completed cases"
        rows={completed}
        selectedId={selectedId}
        onSelect={onSelect}
        onAction={onAction}
        showDeskActions={false}
      />
    </Stack>
  )
}
