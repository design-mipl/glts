/**
 * Application Tracking — customer-facing post-submission status.
 *
 * TODO: Replace mock lookup with a real API (e.g. GET /applications/:id/tracking)
 * once backend status events exist. Shape below mirrors the likely response:
 * destination, visaType, high-level status, estimatedApprovalDate, physical-doc flag,
 * and per-stage timestamps.
 */

export type ApplicationTrackingStatus =
  | 'received'
  | 'documents_verified'
  | 'physical_collected'
  | 'submitted_to_authority'
  | 'processing'
  | 'decision'

export type TrackingStageId =
  | 'application_received'
  | 'documents_verified'
  | 'physical_documents_collected'
  | 'submitted'
  | 'processing'
  | 'decision'
  | 'documents_returned'

export interface TrackingStageTimestamps {
  application_received?: string
  documents_verified?: string
  physical_documents_collected?: string
  submitted?: string
  processing?: string
  decision?: string
  documents_returned?: string
}

export interface TrackedApplication {
  id: string
  destination: string
  visaType: string
  /** Primary applicant display name when known. */
  applicantName?: string
  /** High-level pipeline position for this application. */
  status: ApplicationTrackingStatus
  /**
   * When set, LiveStatusPanel shows "Estimated approval" + this date.
   * When null/undefined, panel shows "Awaiting next update".
   */
  estimatedApprovalDate?: string | null
  /**
   * Tied to journey.allowsPhysicalOriginalDocuments / collection-method flow —
   * when false, physical collect + return stages are omitted from the stepper.
   */
  requiresPhysicalDocuments: boolean
  stageTimestamps: TrackingStageTimestamps
  /** Short copy for the current stage when it has no timestamp yet. */
  currentStageHint?: string
  decisionOutcome?: 'approved' | 'refused' | 'pending'
}

/** Demo applications for /track/:applicationId until the API is wired. */
export const APPLICATION_TRACKING_MOCKS: Record<string, TrackedApplication> = {
  'GLTS-2026-0842': {
    id: 'GLTS-2026-0842',
    destination: 'France (Schengen)',
    visaType: 'Tourist visa',
    applicantName: 'Aditi Sharma',
    status: 'processing',
    estimatedApprovalDate: 'Aug 29, 2026',
    // No physical originals on this offering — skip collect/return stages.
    requiresPhysicalDocuments: false,
    stageTimestamps: {
      application_received: 'Aug 12, 2026 · 10:42 AM',
      documents_verified: 'Aug 14, 2026 · 3:05 PM',
      submitted: 'Aug 15, 2026 · 11:20 AM',
    },
    currentStageHint: 'Consulate review usually takes 3–5 business days',
    decisionOutcome: 'pending',
  },
  'GLTS-2026-0911': {
    id: 'GLTS-2026-0911',
    destination: 'United Kingdom',
    visaType: 'Business visa',
    status: 'physical_collected',
    estimatedApprovalDate: null,
    requiresPhysicalDocuments: true,
    stageTimestamps: {
      application_received: 'Aug 18, 2026 · 9:15 AM',
      documents_verified: 'Aug 19, 2026 · 2:40 PM',
      physical_documents_collected: 'Aug 20, 2026 · 4:10 PM',
    },
    currentStageHint: 'We will submit to the application centre once the queue slot opens',
    decisionOutcome: 'pending',
  },
}

export const DEFAULT_TRACKING_APPLICATION_ID = 'GLTS-2026-0842'

export function getTrackedApplication(applicationId: string): TrackedApplication | null {
  const known = APPLICATION_TRACKING_MOCKS[applicationId]
  if (known) return known

  // Provisional record for freshly created references from SuccessStep until the API exists.
  if (/^GLTS-/i.test(applicationId)) {
    return {
      id: applicationId,
      destination: 'Your destination',
      visaType: 'Visa application',
      status: 'received',
      estimatedApprovalDate: null,
      requiresPhysicalDocuments: false,
      stageTimestamps: {
        application_received: new Intl.DateTimeFormat('en-GB', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: 'numeric',
          minute: '2-digit',
        }).format(new Date()),
      },
      currentStageHint: 'We’re confirming your payment and opening your file',
      decisionOutcome: 'pending',
    }
  }

  return null
}
