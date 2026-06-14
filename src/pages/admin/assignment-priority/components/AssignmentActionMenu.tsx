export type AssignmentAdminAction =
  | 'assign_user'
  | 'change_priority'
  | 'update_status'
  | 'reassign'
  | 'add_notes'
  | 'move_next_date'
  | 'view_details'

export type DeskPassengerAction =
  | 'update_status'
  | 'add_notes'
  | 'upload_proof'
  | 'mark_complete'
  | 'escalate'
