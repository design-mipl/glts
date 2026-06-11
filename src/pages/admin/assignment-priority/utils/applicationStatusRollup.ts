import type {
  ApplicationRollupStatus,
  OperationalPassengerRow,
  PassengerOperationalStatus,
} from '@/shared/types/operationalPassengerAssignment'

function isActiveStatus(status: PassengerOperationalStatus): boolean {
  return status === 'Assigned' || status === 'In Progress' || status === 'Carry Forward'
}

export function rollupApplicationStatus(
  passengers: OperationalPassengerRow[],
): ApplicationRollupStatus {
  if (!passengers.length) return 'Pending'

  const statuses = passengers.map(p => p.passengerStatus)
  const allCompleted = statuses.every(s => s === 'Completed')
  const allPending = statuses.every(s => s === 'Pending Assignment')
  const anyCompleted = statuses.some(s => s === 'Completed')
  const anyActive = statuses.some(isActiveStatus)
  const anyCarryForward = passengers.some(p => p.carryForward)
  const anyHighPriority = passengers.some(p => p.priority === 'Urgent' || p.priority === 'High')

  if (anyCarryForward && anyHighPriority) return 'Escalated'
  if (allCompleted) return 'Completed'
  if (allPending) return 'Pending'
  if (anyCompleted && anyActive) return 'Partially Completed'
  if (anyActive || anyCompleted) return 'In Progress'
  return 'Pending'
}

export function groupPassengersByApplication(
  rows: OperationalPassengerRow[],
): Map<string, OperationalPassengerRow[]> {
  const map = new Map<string, OperationalPassengerRow[]>()
  for (const row of rows) {
    const existing = map.get(row.gltsApplicationId) ?? []
    existing.push(row)
    map.set(row.gltsApplicationId, existing)
  }
  return map
}

export function getApplicationRollupMap(
  rows: OperationalPassengerRow[],
): Map<string, ApplicationRollupStatus> {
  const grouped = groupPassengersByApplication(rows)
  const result = new Map<string, ApplicationRollupStatus>()
  for (const [appId, passengers] of grouped) {
    result.set(appId, rollupApplicationStatus(passengers))
  }
  return result
}
