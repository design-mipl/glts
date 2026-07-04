/** Row action + modal copy for assignment queue operations. */
export const ASSIGN_USER_VENDOR_ACTION_LABEL = 'Assign user / vendor'

export type AssignmentAssigneeType = 'user' | 'vendor'

export const ASSIGNMENT_ASSIGNEE_TYPE_OPTIONS: Array<{
  value: AssignmentAssigneeType
  label: string
}> = [
  { value: 'user', label: 'User' },
  { value: 'vendor', label: 'Vendor' },
]
