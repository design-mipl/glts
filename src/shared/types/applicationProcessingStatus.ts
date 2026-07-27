import type { ApplicationProcessingStageDates } from '@/shared/types/applicationProcessingTimeline'

export type ApplicationProcessingStatusAction = 'advance' | 'reject' | 'hold' | 'resume'

export interface ApplicationProcessingStatusHistoryEntry {
  statusId: string
  at: string
  by: string
  action: ApplicationProcessingStatusAction
  note?: string
}

/** Explicit processing-timeline cursor for an application traveler (or whole application). */
export interface ApplicationProcessingStatusState {
  applicationId: string
  /** Upload queue row id; use application id when single-traveler / app-level. */
  travelerRowId: string
  /** Active Status Master id. */
  currentStatusId: string
  /** When rejected path is taken, may override country default workflow. */
  workflowId?: string
  /** Status the case was on before Hold. */
  heldFromStatusId?: string
  history: ApplicationProcessingStatusHistoryEntry[]
  updatedAt: string
  updatedBy: string
}

export interface SetApplicationProcessingStatusInput {
  applicationId: string
  travelerRowId: string
  nextStatusId: string
  action: ApplicationProcessingStatusAction
  note?: string
  actor?: string
  /** Country / visa context used to resolve default workflow when none stored. */
  countryId?: string
  countryName?: string
  visaTypeLabel?: string
  visaOfferingId?: string
}

export interface ApplicationProcessingStatusTransitionOption {
  statusId: string
  label: string
  action: ApplicationProcessingStatusAction
}

export type ApplicationProcessingStatusPatch = {
  currentStatusId: string
  workflowId?: string
  processingStage: string
  processingStageDates?: ApplicationProcessingStageDates
  operationalStatus?: string
}
