import type { AssignmentAssigneeType } from '@/shared/types/operationalPassengerAssignment'

export type { AssignmentAssigneeType }

/** Row action + modal copy for assignment queue operations. */
export const ASSIGN_USER_VENDOR_ACTION_LABEL = 'Assign Resource'

export const ASSIGNMENT_ASSIGNEE_TYPE_OPTIONS: Array<{
  value: AssignmentAssigneeType
  label: string
}> = [
  { value: 'user', label: 'User' },
  { value: 'vendor', label: 'Vendor' },
  { value: 'passenger', label: 'Passenger' },
]
