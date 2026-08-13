export interface FollowupModalValue {
  followupType: string
  followupDate: string
  followupTime: string
  discussionSummary: string
  nextAction: string
  assignedUser: string
  reminderRequired: boolean
  followupStatus: string
  outcome: string
}

export const FOLLOWUP_TYPE_OPTIONS = [
  { label: 'Call', value: 'call' },
  { label: 'Email', value: 'email' },
  { label: 'Meeting', value: 'meeting' },
  { label: 'WhatsApp', value: 'whatsapp' },
  { label: 'Internal', value: 'internal' },
] as const

export const FOLLOWUP_STATUS_OPTIONS = [
  { label: 'Scheduled', value: 'scheduled' },
  { label: 'Completed', value: 'completed' },
  { label: 'Missed', value: 'missed' },
  { label: 'Rescheduled', value: 'rescheduled' },
] as const

export const FOLLOWUP_OUTCOME_OPTIONS = [
  { label: 'Interested', value: 'interested' },
  { label: 'Quotation Sent', value: 'quotation_sent' },
  { label: 'Follow-up Required', value: 'follow_up_required' },
  { label: 'No Response', value: 'no_response' },
  { label: 'Change in Plans', value: 'change_in_plans' },
  { label: 'Not Interested', value: 'not_interested' },
] as const

function todayInputDate(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function labelFor(
  options: ReadonlyArray<{ label: string; value: string }>,
  value: string | undefined,
): string {
  if (!value?.trim()) return '—'
  return options.find((option) => option.value === value)?.label ?? value
}

export function createInitialFollowupValue(
  overrides: Partial<FollowupModalValue> = {},
): FollowupModalValue {
  return {
    followupType: 'call',
    followupDate: todayInputDate(),
    followupTime: '10:00',
    discussionSummary: '',
    nextAction: '',
    assignedUser: '',
    reminderRequired: true,
    followupStatus: 'scheduled',
    outcome: '',
    ...overrides,
  }
}

export function formatFollowupTypeLabel(value: string | undefined): string {
  return labelFor(FOLLOWUP_TYPE_OPTIONS, value)
}

export function formatFollowupStatusLabel(value: string | undefined): string {
  return labelFor(FOLLOWUP_STATUS_OPTIONS, value)
}

export function formatFollowupOutcomeLabel(value: string | undefined): string {
  return labelFor(FOLLOWUP_OUTCOME_OPTIONS, value)
}

export function validateFollowupValue(value: FollowupModalValue): string | null {
  if (!value.followupType.trim()) return 'Select a follow-up type'
  if (!value.followupDate.trim()) return 'Select a follow-up date'
  if (!value.followupTime.trim()) return 'Select a follow-up time'
  if (!value.discussionSummary.trim()) return 'Enter a discussion summary'
  if (!value.followupStatus.trim()) return 'Select a follow-up status'
  return null
}
