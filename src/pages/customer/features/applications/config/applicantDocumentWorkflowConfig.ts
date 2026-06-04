import type { SimpleDocumentRequirementId } from '@/shared/utils/applicantDocumentWorkflowUtils'

export interface SimpleDocumentWorkflowConfig {
  documentId: SimpleDocumentRequirementId
  question: string
  yesOptionLabel: string
  noOptionLabel: string
  arrangeHelperText: string
  uploadLabel: string
  uploadDropzoneTitle: string
}

export const SIMPLE_DOCUMENT_WORKFLOW_CONFIG: Record<
  SimpleDocumentRequirementId,
  SimpleDocumentWorkflowConfig
> = {
  'travel-ticket': {
    documentId: 'travel-ticket',
    question: 'Do you already have a travel ticket?',
    yesOptionLabel: 'Yes, I will upload the ticket',
    noOptionLabel: 'No, GLTS will arrange it',
    arrangeHelperText:
      'GLTS will book your travel ticket. You do not need to upload a ticket now. Status will show as Pending GLTS Booking until GLTS uploads your ticket.',
    uploadLabel: 'Upload Ticket',
    uploadDropzoneTitle: 'Upload travel ticket',
  },
  insurance: {
    documentId: 'insurance',
    question: 'Do you already have travel insurance?',
    yesOptionLabel: 'Yes, I will upload the insurance',
    noOptionLabel: 'No, GLTS will arrange it',
    arrangeHelperText:
      'GLTS will arrange travel insurance for you. You do not need to upload a policy now. Status will show as Pending GLTS Insurance Arrangement until GLTS uploads your insurance document.',
    uploadLabel: 'Upload Insurance',
    uploadDropzoneTitle: 'Upload travel insurance',
  },
}

export const HANDLING_MODE_OPTIONS = [
  { value: 'upload_by_applicant' as const, label: 'Yes — I will upload' },
  { value: 'arrange_by_glts' as const, label: 'No — GLTS will arrange' },
] as const
