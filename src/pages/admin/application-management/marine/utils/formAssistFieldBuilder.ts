import { readApplicationFlowDraftFromSession } from '@/pages/customer/features/applications/utils/applicationFlowDraftStorage'
import type { FlowDraftLikeState } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { getSingleApplicationFlowExtras } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { SingleApplicationFlowExtras } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import { resolveApplicantAdditionalDetails } from '@/pages/customer/features/applications/config/applicantAdditionalDetailsConfig'
import {
  ensureRowBasicDetails,
  resolveApplicantBasicDetails,
} from '@/pages/customer/features/applications/utils/applicantBasicDetailsUtils'

export interface FormAssistField {
  id: string
  label: string
  value: string
}

export interface FormAssistStepDefinition {
  id: string
  label: string
  description?: string
}

export const GENERIC_FORM_ASSIST_STEPS: FormAssistStepDefinition[] = [
  { id: 'personal', label: 'Personal details' },
  { id: 'passport', label: 'Passport details' },
  { id: 'travel', label: 'Travel details' },
  { id: 'employment', label: 'Employment / Marine details' },
  { id: 'address', label: 'Address details' },
  { id: 'review', label: 'Review & submission' },
]

const PLACEHOLDER = '—'

function display(value: string | undefined | null): string {
  const trimmed = (value ?? '').trim()
  return trimmed.length === 0 || trimmed === PLACEHOLDER ? '—' : trimmed
}

function field(id: string, label: string, value: string): FormAssistField {
  return { id, label, value: display(value) }
}

export interface FormAssistContext {
  row: UploadQueueRow
  detail: ApplicationDetailViewModel
  flowExtras?: {
    entityName?: string
    location?: string
    billingAddress?: string
    vesselName?: string
    imoNumber?: string
    joiningPort?: string
  }
}

export function buildFormAssistFieldsForStep(
  stepId: string,
  ctx: FormAssistContext,
): FormAssistField[] {
  const row = ensureRowBasicDetails(ctx.row)
  const basic = resolveApplicantBasicDetails(row)
  const additional = resolveApplicantAdditionalDetails(row.additionalDetails)
  const app = ctx.detail.application
  const extras = ctx.flowExtras ?? {}

  switch (stepId) {
    case 'personal':
      return [
        field('traveler', 'Traveler', basic.applicantName || row.travelerName),
        field('nationality', 'Nationality', basic.nationality || row.nationality),
        field('dateOfBirth', 'Date of birth', basic.dateOfBirth),
        field('paxContactNo', 'PAX Contact No', additional.paxContactNo),
        field('paxEmailId', 'PAX Email ID', additional.paxEmailId),
      ]
    case 'passport':
      return [
        field('passportNo', 'Passport no.', basic.passportNumber || row.passportNo),
        field('passportExpiry', 'Passport expiry', row.expiry),
        field('nationality', 'Nationality', basic.nationality || row.nationality),
      ]
    case 'travel':
      return [
        field('travel', 'Travel', app?.travelDate ?? ''),
        field('visa', 'Visa', app?.visaType ?? ''),
        field('country', 'Country', app?.country ?? ''),
      ]
    case 'employment':
      return [
        field('crewId', 'Applicant no.', basic.crewId || row.gltsApplicantId),
        field('cdcNumber', 'CDC number', basic.cdcNumber),
        field('employmentOccupation', 'Occupation', additional.employmentOccupation),
        field('lastContractSignDate', 'Last Contract Sign Date', additional.lastContractSignDate),
        field('vesselName', 'Vessel name', extras.vesselName ?? ''),
        field('imoNumber', 'IMO number', extras.imoNumber ?? ''),
        field('joiningPort', 'Joining port', extras.joiningPort ?? ''),
      ]
    case 'address':
      return [
        field('entityName', 'Entity', extras.entityName ?? ''),
        field('location', 'Location', extras.location ?? ''),
        field('billingAddress', 'Billing address', extras.billingAddress ?? ''),
      ]
    case 'review':
      return [
        ...buildFormAssistFieldsForStep('personal', ctx),
        ...buildFormAssistFieldsForStep('passport', ctx),
        ...buildFormAssistFieldsForStep('travel', ctx),
        ...buildFormAssistFieldsForStep('employment', ctx),
        ...buildFormAssistFieldsForStep('address', ctx),
      ]
    default:
      return []
  }
}

export function collectAllFormAssistFields(ctx: FormAssistContext): FormAssistField[] {
  return GENERIC_FORM_ASSIST_STEPS.filter(s => s.id !== 'review').flatMap(step =>
    buildFormAssistFieldsForStep(step.id, ctx),
  )
}

function readSavedFlowState(): FlowDraftLikeState | null {
  return readApplicationFlowDraftFromSession()
}

export function resolveFormAssistFlowExtras(applicationId: string): SingleApplicationFlowExtras {
  const fromSeed: SingleApplicationFlowExtras = getSingleApplicationFlowExtras(applicationId) ?? {
    entityName: '',
    location: '',
    billingAddress: '',
    vesselName: '',
    imoNumber: '',
    joiningPort: '',
  }
  const flowState = readSavedFlowState()
  if (!flowState) return fromSeed
  if (flowState.gltsApplicationId !== applicationId && flowState.gltsBatchId !== applicationId) {
    return fromSeed
  }
  return {
    entityName: flowState.entityName || fromSeed.entityName,
    location: flowState.location || fromSeed.location,
    billingAddress: flowState.billingAddress || fromSeed.billingAddress,
    vesselName: flowState.vesselName || fromSeed.vesselName,
    imoNumber: flowState.imoNumber || fromSeed.imoNumber,
    joiningPort: flowState.portOfRegistry || fromSeed.joiningPort,
  }
}
