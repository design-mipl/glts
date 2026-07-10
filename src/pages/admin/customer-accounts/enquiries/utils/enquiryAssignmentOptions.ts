import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import { teamService } from '@/shared/services/teamService'
import { enquiryPriorityOptions } from '../config/enquiryFilterConfig'

export interface AssignmentSelectOption {
  label: string
  value: string
}

const ENQUIRY_BRANCH_OPTIONS: AssignmentSelectOption[] = [
  { label: 'Mumbai', value: 'Mumbai' },
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Chennai', value: 'Chennai' },
  { label: 'Bengaluru', value: 'Bengaluru' },
  { label: 'Singapore', value: 'Singapore' },
  { label: 'Dubai', value: 'Dubai' },
]

export function getEnquiryAssignmentTeamOptions(): AssignmentSelectOption[] {
  return teamService
    .list({ status: 'active' })
    .map((team) => ({ value: team.name, label: team.name }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function getEnquiryAssignmentUserOptions(assignedTeam?: string): AssignmentSelectOption[] {
  const team = assignedTeam?.trim() ? teamService.getByName(assignedTeam.trim()) : undefined
  const users = team
    ? adminPortalUserService.listByTeamId(team.id).filter((user) => user.status === 'active')
    : adminPortalUserService.list({ status: 'active' })

  return users
    .map((user) => ({
      value: user.fullName,
      label: `${user.fullName} (${user.email})`,
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function getEnquiryAssignmentBranchOptions(): AssignmentSelectOption[] {
  return ENQUIRY_BRANCH_OPTIONS
}

export function getEnquiryAssignmentPriorityOptions(): AssignmentSelectOption[] {
  return enquiryPriorityOptions
    .filter((option) => option.value)
    .map((option) => ({ value: String(option.value), label: option.label }))
}
