import { fundAllocationService } from '@/shared/services/fundAllocationService'
import type { FundAllocationPassengerRow } from '@/shared/types/fundAllocation'

export type AssignmentFundDisplayState = 'none' | 'requested' | 'allocated'

export function resolveAssignmentFundDisplayState(
  fundRow:
    | Pick<FundAllocationPassengerRow, 'fundRequested' | 'allocationStatus' | 'totalAmount'>
    | undefined
    | null,
): AssignmentFundDisplayState {
  if (!fundRow) return 'none'
  if (fundRow.allocationStatus === 'allocated') return 'allocated'
  if (fundRow.fundRequested && fundRow.totalAmount > 0) return 'requested'
  return 'none'
}

export function getAssignmentFundDisplayStateForPassenger(passengerId: string): AssignmentFundDisplayState {
  return resolveAssignmentFundDisplayState(fundAllocationService.getById(passengerId))
}

export function assignmentFundDisplayLabel(state: AssignmentFundDisplayState): string {
  switch (state) {
    case 'allocated':
      return 'Allocated'
    case 'requested':
      return 'Fund requested'
    case 'none':
    default:
      return 'Not requested'
  }
}

/** @deprecated Use assignmentFundDisplayLabel — kept for export/CSV compatibility. */
export function assignmentFundDisplayCellLabel(state: AssignmentFundDisplayState): string {
  return assignmentFundDisplayLabel(state)
}

export function assignmentFundDisplayBadgeColor(
  state: AssignmentFundDisplayState,
): 'success' | 'warning' | 'info' | 'neutral' {
  if (state === 'allocated') return 'success'
  if (state === 'requested') return 'info'
  return 'neutral'
}

export const ASSIGNMENT_FUND_FILTER_OPTIONS = [
  { value: 'requested', label: 'Fund requested' },
  { value: 'allocated', label: 'Allocated' },
  { value: 'none', label: 'No fund request' },
] as const

export function matchesAssignmentFundFilter(passengerId: string, fundFilter: string): boolean {
  if (!fundFilter) return true
  return getAssignmentFundDisplayStateForPassenger(passengerId) === fundFilter
}
