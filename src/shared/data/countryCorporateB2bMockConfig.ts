import { jurisdiction } from '@/shared/data/countryJurisdictionDefaults'
import { MOCK_DOCUMENT_SAMPLE_TEMPLATES } from '@/shared/data/mockDocumentSampleTemplates'
import type {
  CountryDocumentChecklistItem,
  CountryJurisdictionDocumentRule,
  CountryVisaJurisdiction,
  DocumentOwnerType,
} from '@/shared/types/countryMaster'

const INDIA_DELHI_STATES = [
  'Delhi',
  'Haryana',
  'Punjab',
  'Chandigarh',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Uttar Pradesh',
  'Uttarakhand',
  'Rajasthan',
] as const

const INDIA_MUMBAI_STATES = [
  'Maharashtra',
  'Goa',
  'Gujarat',
  'Madhya Pradesh',
  'Chhattisgarh',
  'Daman',
  'Diu',
  'Dadra & Nagar Haveli',
] as const

const STICKER_PROCESSING_RULES = {
  biometricsRequired: true,
  interviewRequired: false,
  originalDocumentsRequired: true,
  appointmentMandatory: true,
} as const

const SAMPLES = MOCK_DOCUMENT_SAMPLE_TEMPLATES

interface DocSpec {
  id: string
  docId: string
  description?: string
  sample?: { fileName: string; url: string }
  originalDocument?: boolean
  commonDocument?: boolean
  mandatory?: boolean
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function gltsScope(lines: string[]): string {
  const items = lines.map((line) => `<li>${escapeHtml(line)}</li>`).join('')
  return `<ul>${items}</ul>`
}

function embassyLabels(countryName: string): { delhi: string; mumbai: string } {
  switch (countryName) {
    case 'China':
      return {
        delhi: "Embassy of the People's Republic of China",
        mumbai: 'Chinese Consulate — Mumbai',
      }
    case 'France':
      return {
        delhi: 'Embassy of France',
        mumbai: 'Consulate General of France — Mumbai',
      }
    case 'Default':
      return {
        delhi: 'Embassy — Delhi',
        mumbai: 'Consulate General — Mumbai',
      }
    default:
      return {
        delhi: `Embassy of ${countryName}`,
        mumbai: `Consulate General of ${countryName} — Mumbai`,
      }
  }
}

function docRule(
  ruleId: string,
  documentId: string,
  ownerType: DocumentOwnerType,
  sortOrder: number,
  options?: {
    mandatory?: boolean
    originalDocument?: boolean
    commonDocument?: boolean
    description?: string
    sample?: { fileName: string; url: string }
  },
): CountryJurisdictionDocumentRule {
  const mandatory = options?.mandatory ?? true
  const sample = options?.sample
  return {
    id: ruleId,
    documentId,
    group: 'jurisdiction',
    mandatory,
    ocrEnabled: documentId === 'passport',
    multipleUpload: false,
    commonDocument: options?.commonDocument ?? false,
    originalDocument: options?.originalDocument ?? false,
    ownerType,
    description: options?.description,
    hasSample: Boolean(sample),
    sampleDocumentName: sample?.fileName,
    sampleDocumentUrl: sample?.url,
    acceptedFormats: documentId === 'photo' ? ['JPG', 'PNG'] : ['PDF', 'JPG', 'PNG'],
    validationRules: mandatory ? 'Required for submission' : undefined,
    sortOrder,
  }
}

function ownerDocs(
  prefix: string,
  ownerType: DocumentOwnerType,
  specs: DocSpec[],
  startOrder = 0,
): CountryJurisdictionDocumentRule[] {
  return specs.map((item, index) =>
    docRule(`${prefix}-${item.id}`, item.docId, ownerType, startOrder + index, {
      description: item.description,
      sample: item.sample,
      originalDocument: item.originalDocument,
      commonDocument: item.commonDocument,
      mandatory: item.mandatory,
    }),
  )
}

function specsToChecklist(groups: DocSpec[][]): CountryDocumentChecklistItem[] {
  return groups
    .flat()
    .filter((item) => item.docId !== 'passport' && item.docId !== 'photo')
    .map((item, index) => ({
      documentId: item.docId,
      mandatory: item.mandatory ?? true,
      sortOrder: index,
      originalDocument: item.originalDocument,
      description: item.description,
    }))
}

const APPLICANT_IDENTITY: DocSpec[] = [
  {
    id: 'passport',
    docId: 'passport',
    originalDocument: true,
    description: 'Valid passport bio-data pages with at least six months remaining validity.',
  },
  {
    id: 'photo',
    docId: 'photo',
    originalDocument: true,
    description: 'Recent passport-size photograph meeting embassy specifications.',
  },
]

const APPLICANT_FINANCIAL: DocSpec[] = [
  {
    id: 'bank',
    docId: 'bank',
    description: 'Personal bank statements covering the last three months for financial assessment.',
  },
  {
    id: 'bank-balance-certificate',
    docId: 'bank-balance-certificate',
    description: 'Bank-issued balance certificate confirming sufficient funds for the trip.',
  },
]

const APPLICANT_TRAVEL: DocSpec[] = [
  {
    id: 'travel-ticket',
    docId: 'travel-ticket',
    description: 'Confirmed or reservation travel itinerary covering arrival and return dates.',
  },
  {
    id: 'insurance',
    docId: 'insurance',
    description: 'Travel insurance covering the intended stay duration.',
  },
]

const COMPANY_DOCS: DocSpec[] = [
  {
    id: 'company-covering-letter',
    docId: 'company-covering-letter',
    commonDocument: true,
    description:
      'Employer covering letter confirming employment, travel purpose, visa requirement, and expense responsibility.',
    sample: SAMPLES.companyCoveringLetter,
  },
  {
    id: 'employment-certificate',
    docId: 'employment-certificate',
    description: 'Employer certificate confirming current role, tenure, and authorised business travel.',
  },
]

const INVITING_COMPANY_DOCS: DocSpec[] = [
  {
    id: 'invitation',
    docId: 'invitation',
    commonDocument: true,
    description: 'Invitation letter from the overseas host company stating visit dates and purpose.',
    sample: SAMPLES.invitationLetter,
  },
]

const WORK_EXTRA_COMPANY_DOCS: DocSpec[] = [
  {
    id: 'employment-contract',
    docId: 'employment-contract',
    description: 'Signed employment contract supporting a long-stay or work visa application.',
  },
]

function combineRules(...groups: CountryJurisdictionDocumentRule[][]): CountryJurisdictionDocumentRule[] {
  return groups.flat().map((rule, index) => ({ ...rule, sortOrder: index }))
}

function corporateBusinessDocuments(prefix: string, includeWorkContract = false): CountryJurisdictionDocumentRule[] {
  const applicant = ownerDocs(`${prefix}-applicant`, 'applicant', [
    ...APPLICANT_IDENTITY,
    ...APPLICANT_FINANCIAL,
    ...APPLICANT_TRAVEL,
  ])
  const company = ownerDocs(
    `${prefix}-company`,
    'company',
    includeWorkContract ? [...COMPANY_DOCS, ...WORK_EXTRA_COMPANY_DOCS] : COMPANY_DOCS,
    applicant.length,
  )
  const inviting = ownerDocs(
    `${prefix}-inviting`,
    'inviting_company',
    INVITING_COMPANY_DOCS,
    applicant.length + company.length,
  )
  return combineRules(applicant, company, inviting)
}

function b2bTouristDocuments(prefix: string): CountryJurisdictionDocumentRule[] {
  return ownerDocs(`${prefix}-applicant`, 'applicant', [
    ...APPLICANT_IDENTITY,
    ...APPLICANT_FINANCIAL,
    ...APPLICANT_TRAVEL,
  ])
}

function b2bBusinessDocuments(prefix: string): CountryJurisdictionDocumentRule[] {
  const applicant = ownerDocs(`${prefix}-applicant`, 'applicant', [
    ...APPLICANT_IDENTITY,
    ...APPLICANT_FINANCIAL,
    ...APPLICANT_TRAVEL,
  ])
  const company = ownerDocs(`${prefix}-company`, 'company', COMPANY_DOCS, applicant.length)
  const inviting = ownerDocs(
    `${prefix}-inviting`,
    'inviting_company',
    INVITING_COMPANY_DOCS,
    applicant.length + company.length,
  )
  return combineRules(applicant, company, inviting)
}

function withoutOriginals(rules: CountryJurisdictionDocumentRule[]): CountryJurisdictionDocumentRule[] {
  return rules.map((rule) => ({ ...rule, originalDocument: false }))
}

function delhiMumbaiJurisdictions(
  countryName: string,
  prefix: string,
  documents: CountryJurisdictionDocumentRule[],
  scopeLines: string[],
): CountryVisaJurisdiction[] {
  const labels = embassyLabels(countryName)
  const scope = gltsScope(scopeLines)
  return [
    jurisdiction({
      id: 'delhi',
      name: 'Delhi',
      embassyOrVfs: labels.delhi,
      submissionCenter: 'VFS Delhi',
      processingTime: '10',
      priorityLevel: 'standard',
      status: 'active',
      applicableStates: [...INDIA_DELHI_STATES],
      processingRules: { ...STICKER_PROCESSING_RULES },
      gltsScope: scope,
      documents: documents.map((rule) => ({ ...rule, id: `${prefix}-delhi-${rule.documentId}` })),
    }),
    jurisdiction({
      id: 'mumbai',
      name: 'Mumbai',
      embassyOrVfs: labels.mumbai,
      submissionCenter: 'VFS Mumbai',
      processingTime: '12',
      priorityLevel: 'standard',
      status: 'active',
      applicableStates: [...INDIA_MUMBAI_STATES],
      processingRules: { ...STICKER_PROCESSING_RULES },
      gltsScope: scope,
      documents: documents.map((rule) => ({ ...rule, id: `${prefix}-mumbai-${rule.documentId}` })),
    }),
  ]
}

const CORPORATE_SCOPE = [
  'Business visa application preparation and document validation',
  'Corporate covering letter and invitation letter review',
  'Embassy / VFS appointment handling and submission',
  'Status tracking and passport return coordination',
]

const B2B_TOURIST_SCOPE = [
  'Agent tourist visa application preparation and document validation',
  'Travel itinerary and insurance checklist review',
  'Embassy / VFS appointment handling and submission',
  'Status tracking and client updates',
]

const B2B_BUSINESS_SCOPE = [
  'Agent business visa filing on behalf of the client company',
  'Invitation letter and employer document review',
  'Embassy / VFS appointment handling and submission',
  'Status tracking and client updates',
]

export const corporateApplicationDocuments: CountryDocumentChecklistItem[] = specsToChecklist([
  APPLICANT_FINANCIAL,
  APPLICANT_TRAVEL,
  COMPANY_DOCS,
  INVITING_COMPANY_DOCS,
])

export const b2bTouristApplicationDocuments: CountryDocumentChecklistItem[] = specsToChecklist([
  APPLICANT_FINANCIAL,
  APPLICANT_TRAVEL,
])

export const b2bBusinessApplicationDocuments: CountryDocumentChecklistItem[] = specsToChecklist([
  APPLICANT_FINANCIAL,
  APPLICANT_TRAVEL,
  COMPANY_DOCS,
  INVITING_COMPANY_DOCS,
])

export const corporateWorkApplicationDocuments: CountryDocumentChecklistItem[] = specsToChecklist([
  APPLICANT_FINANCIAL,
  APPLICANT_TRAVEL,
  COMPANY_DOCS,
  WORK_EXTRA_COMPANY_DOCS,
  INVITING_COMPANY_DOCS,
])

export function buildCorporateBusinessJurisdictions(
  countryName: string,
  prefix: string,
): CountryVisaJurisdiction[] {
  return delhiMumbaiJurisdictions(
    countryName,
    prefix,
    corporateBusinessDocuments(prefix),
    CORPORATE_SCOPE,
  )
}

export function buildCorporateWorkJurisdictions(
  countryName: string,
  prefix: string,
): CountryVisaJurisdiction[] {
  return delhiMumbaiJurisdictions(
    countryName,
    `${prefix}-work`,
    corporateBusinessDocuments(`${prefix}-work`, true),
    [
      'Work visa application preparation and employment document validation',
      'Contract, covering letter, and invitation review',
      'Embassy / VFS appointment handling and submission',
      'Status tracking and passport return coordination',
    ],
  )
}

export function buildB2bTouristJurisdictions(
  countryName: string,
  prefix: string,
): CountryVisaJurisdiction[] {
  return delhiMumbaiJurisdictions(countryName, prefix, b2bTouristDocuments(prefix), B2B_TOURIST_SCOPE)
}

export function buildB2bBusinessJurisdictions(
  countryName: string,
  prefix: string,
): CountryVisaJurisdiction[] {
  return delhiMumbaiJurisdictions(countryName, prefix, b2bBusinessDocuments(prefix), B2B_BUSINESS_SCOPE)
}

export function buildCorporateEvisaDocuments(prefix: string): CountryJurisdictionDocumentRule[] {
  return withoutOriginals(corporateBusinessDocuments(prefix))
}

export function buildB2bTouristEvisaDocuments(prefix: string): CountryJurisdictionDocumentRule[] {
  return withoutOriginals(b2bTouristDocuments(prefix))
}

export function buildB2bBusinessEvisaDocuments(prefix: string): CountryJurisdictionDocumentRule[] {
  return withoutOriginals(b2bBusinessDocuments(prefix))
}
