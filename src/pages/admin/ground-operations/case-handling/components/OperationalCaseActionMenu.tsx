export type AdminCaseAction =
  | 'set_priority'
  | 'assign_team'
  | 'assign_executive'
  | 'reassign'
  | 'move_next_day'
export type DeskCaseAction =
  | 'update_status'
  | 'schedule_biometrics'
  | 'update_vfs'
  | 'update_passport'
  | 'add_expense'
  | 'mark_completed'
