export type AssignmentAdminAction =
  | 'assign_user'
  | 'change_priority'
  | 'update_status'
  | 'reassign'
  | 'add_notes'
  | 'move_next_date'
  | 'open_application'
  | 'open_passenger_detail'
  | 'view_timeline'

export type DeskPassengerAction =
  | 'update_status'
  | 'add_notes'
  | 'upload_proof'
  | 'mark_complete'
  | 'escalate'
