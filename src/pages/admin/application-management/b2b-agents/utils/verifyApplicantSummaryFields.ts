import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import { ensureRowBasicDetails } from '@/pages/customer/features/applications/utils/applicantBasicDetailsUtils'
import {
  buildFormAssistFieldsForStep,
  resolveFormAssistFlowExtras,
  type FormAssistContext,
} from './formAssistFieldBuilder'

export interface VerifySummaryField {
  label: string
  value: string
}

function pickFields(
  ctx: FormAssistContext,
  stepIds: string[],
  fieldIds: string[],
): VerifySummaryField[] {
  const byId = new Map<string, VerifySummaryField>()
  for (const stepId of stepIds) {
    for (const field of buildFormAssistFieldsForStep(stepId, ctx)) {
      if (!byId.has(field.id)) {
        byId.set(field.id, { label: field.label, value: field.value })
      }
    }
  }
  return fieldIds
    .map(id => byId.get(id))
    .filter((field): field is VerifySummaryField => Boolean(field))
}

export function buildVerifyApplicantSummaryFields(
  row: UploadQueueRow,
  detail: ApplicationDetailViewModel,
  applicationId: string,
  documentsLabel: string,
): { primary: VerifySummaryField[]; B2b: VerifySummaryField[] } {
  const ctx: FormAssistContext = {
    row: ensureRowBasicDetails(row),
    detail,
    flowExtras: resolveFormAssistFlowExtras(applicationId),
  }

  const primary = pickFields(
    ctx,
    ['personal', 'passport', 'travel'],
    [
      'rank',
      'traveler',
      'passportNo',
      'nationality',
      'dateOfBirth',
      'passportExpiry',
      'paxContactNo',
      'paxEmailId',
      'travel',
      'visa',
      'country',
      'jurisdiction',
    ],
  )

  primary.push({ label: 'Documents', value: documentsLabel })

  const B2b = pickFields(
    ctx,
    ['employment', 'details', 'address'],
    [
      'crewId',
      'cdcNumber',
      'employmentOccupation',
      'lastContractSignDate',
      'poCidNo',
      'compassNo',
      'joiningPort',
      'billingEntity',
      'vesselName',
      'imoNumber',
      'location',
      'billingAddress',
    ],
  )

  return { primary, B2b }
}
