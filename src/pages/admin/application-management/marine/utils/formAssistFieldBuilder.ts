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

export interface FormAssistFieldSection {
  id: string
  title: string
  fields: FormAssistField[]
}

interface FormAssistFieldSectionDefinition {
  id: string
  title: string
  fieldIds: string[]
}

const FORM_ASSIST_STEP_SECTIONS: Record<string, FormAssistFieldSectionDefinition[]> = {
  personal: [
    {
      id: 'identity',
      title: 'Applicant identity',
      fieldIds: ['traveler', 'nationality', 'dateOfBirth'],
    },
    {
      id: 'contact',
      title: 'Contact details',
      fieldIds: ['paxContactNo', 'paxEmailId'],
    },
  ],
  passport: [
    {
      id: 'passport-identification',
      title: 'Passport identification',
      fieldIds: ['passportNo', 'nationality'],
    },
    {
      id: 'passport-validity',
      title: 'Passport validity',
      fieldIds: ['passportExpiry'],
    },
  ],
  travel: [
    {
      id: 'travel-itinerary',
      title: 'Travel itinerary',
      fieldIds: ['travel', 'country'],
    },
    {
      id: 'visa-information',
      title: 'Visa information',
      fieldIds: ['visa', 'jurisdiction'],
    },
  ],
  employment: [
    {
      id: 'employment-record',
      title: 'Employment record',
      fieldIds: ['crewId', 'cdcNumber', 'employmentOccupation', 'lastContractSignDate'],
    },
    {
      id: 'vessel-assignment',
      title: 'Vessel & port',
      fieldIds: ['vesselName', 'imoNumber', 'joiningPort'],
    },
  ],
  address: [
    {
      id: 'organization',
      title: 'Organization',
      fieldIds: ['entityName', 'location'],
    },
    {
      id: 'billing',
      title: 'Billing address',
      fieldIds: ['billingAddress'],
    },
  ],
}

export interface FormAssistStepDefinition {
  id: string
  label: string
}

export const GENERIC_FORM_ASSIST_STEPS: FormAssistStepDefinition[] = [
  { id: 'personal', label: 'Personal details' },
  { id: 'passport', label: 'Passport details' },
  { id: 'travel', label: 'Travel details' },
  { id: 'employment', label: 'Employment / Marine details' },
  { id: 'address', label: 'Address details' },
  { id: 'review', label: 'Review' },
  { id: 'submission', label: 'Submission & Payment' },
]

const FORM_ASSIST_COPY_STEP_IDS = new Set([
  'personal',
  'passport',
  'travel',
  'employment',
  'address',
])

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
    jurisdiction?: string
  }
}

function resolveFormAssistFieldSections(
  stepId: string,
  fields: FormAssistField[],
  titlePrefix?: string,
): FormAssistFieldSection[] {
  const definitions = FORM_ASSIST_STEP_SECTIONS[stepId]
  if (!definitions) {
    return fields.length > 0
      ? [{ id: stepId, title: titlePrefix ?? 'Details', fields }]
      : []
  }

  const fieldById = new Map(fields.map(field => [field.id, field]))

  return definitions
    .map(definition => ({
      id: titlePrefix ? `${stepId}-${definition.id}` : definition.id,
      title: titlePrefix ? `${titlePrefix} · ${definition.title}` : definition.title,
      fields: definition.fieldIds
        .map(fieldId => fieldById.get(fieldId))
        .filter((field): field is FormAssistField => Boolean(field)),
    }))
    .filter(section => section.fields.length > 0)
}

export function buildFormAssistFieldSectionsForStep(
  stepId: string,
  ctx: FormAssistContext,
): FormAssistFieldSection[] {
  if (stepId === 'review') {
    return [...FORM_ASSIST_COPY_STEP_IDS].flatMap(copyStepId => {
      const step = GENERIC_FORM_ASSIST_STEPS.find(item => item.id === copyStepId)
      const fields = buildFormAssistFieldsForStep(copyStepId, ctx)
      return resolveFormAssistFieldSections(copyStepId, fields, step?.label)
    })
  }

  const fields = buildFormAssistFieldsForStep(stepId, ctx)
  return resolveFormAssistFieldSections(stepId, fields)
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
        field(
          'jurisdiction',
          'Jurisdiction',
          app?.jurisdiction ?? extras.jurisdiction ?? '',
        ),
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
      return [...FORM_ASSIST_COPY_STEP_IDS].flatMap(stepId =>
        buildFormAssistFieldsForStep(stepId, ctx),
      )
    case 'submission':
      return []
    default:
      return []
  }
}

export function collectAllFormAssistFields(ctx: FormAssistContext): FormAssistField[] {
  return GENERIC_FORM_ASSIST_STEPS.filter(step => FORM_ASSIST_COPY_STEP_IDS.has(step.id)).flatMap(
    step => buildFormAssistFieldsForStep(step.id, ctx),
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
    jurisdiction: '',
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
    jurisdiction: flowState.jurisdiction || fromSeed.jurisdiction,
  }
}
