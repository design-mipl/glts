import type {
  ApplicationPriority,
  BulkBatchRow,
  SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { teamService } from '@/shared/services/teamService'

export type ApplicationConsultantRow = SingleApplicationRow | BulkBatchRow

export function resolveApplicationConsultantName(row: ApplicationConsultantRow): string {
  if (!row.assignedUserId) return '—'
  return adminPortalUserService.getById(row.assignedUserId)?.fullName?.trim() || '—'
}

export function resolveApplicationConsultantTeamName(row: ApplicationConsultantRow): string {
  if (!row.assignedTeamId) return '—'
  return teamService.getById(row.assignedTeamId)?.name?.trim() || '—'
}

export function resolveApplicationPriorityLabel(row: ApplicationConsultantRow): string {
  return row.priority?.trim() || '—'
}

export interface ApplicationConsultantAssignmentPayload {
  teamId: string
  userId: string
  priority: ApplicationPriority
  isVip: boolean
}
