export type ApplicationProcessingStageId =
  | 'ready'
  | 'submitted'
  | 'appointment'
  | 'embassy'
  | 'passport-ready'
  | 'dispatch'
  | 'delivered'

export type ApplicationProcessingTimelineStatus = 'completed' | 'active' | 'pending'

export interface ApplicationProcessingTimelineStep {
  id: ApplicationProcessingStageId
  label: string
  status: ApplicationProcessingTimelineStatus
  /** Formatted display date when the stage was reached or is in progress */
  date?: string
}

export type ApplicationProcessingStageDates = Partial<
  Record<ApplicationProcessingStageId, string>
>

export const APPLICATION_PROCESSING_STAGE_ORDER: ApplicationProcessingStageId[] = [
  'ready',
  'submitted',
  'appointment',
  'embassy',
  'passport-ready',
  'dispatch',
  'delivered',
]

export const APPLICATION_PROCESSING_STAGE_LABELS: Record<ApplicationProcessingStageId, string> = {
  ready: 'Ready of submission',
  submitted: 'Submitted',
  appointment: 'Appointment booked',
  embassy: 'Embassy processing',
  'passport-ready': 'Passport ready',
  dispatch: 'Dispatch',
  delivered: 'Delivered',
}
