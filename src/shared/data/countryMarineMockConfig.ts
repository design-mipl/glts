import { jurisdiction } from '@/shared/data/countryJurisdictionDefaults'
import { MOCK_DOCUMENT_SAMPLE_TEMPLATES } from '@/shared/data/mockDocumentSampleTemplates'
import type {
  CountryJurisdictionDocumentRule,
  CountryVisaJurisdiction,
  DocumentOwnerType,
} from '@/shared/types/countryMaster'

const CHINA_EMBASSY = "Embassy of the People's Republic of China"

const CHINA_DELHI_STATES = [
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

const CHINA_MARINE_PROCESSING_RULES = {
  biometricsRequired: false,
  interviewRequired: false,
  originalDocumentsRequired: true,
  appointmentMandatory: true,
} as const

const JAPAN_CREW_DELHI_STATES = [
  'Delhi',
  'Haryana',
  'Punjab',
  'Rajasthan',
  'Uttar Pradesh',
  'Uttarakhand',
  'Chandigarh',
  'Himachal Pradesh',
  'Jammu & Kashmir',
  'Assam',
  'Arunachal Pradesh',
  'Meghalaya',
  'Nagaland',
  'Mizoram',
  'Manipur',
  'Tripura',
  'Sikkim',
  'Andaman & Nicobar',
  'Lakshadweep',
] as const

const JAPAN_CREW_MUMBAI_STATES = [
  'Maharashtra',
  'Goa',
  'Gujarat',
  'Madhya Pradesh',
  'Chhattisgarh',
  'Daman',
  'Diu',
  'Dadra & Nagar Haveli',
] as const

const JAPAN_CREW_KOLKATA_STATES = ['West Bengal', 'Bihar', 'Jharkhand', 'Odisha'] as const

interface DocSpec {
  id: string
  docId: string
  description?: string
  sample?: { fileName: string; url: string }
  commonDocument?: boolean
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

function docRule(
  ruleId: string,
  documentId: string,
  ownerType: DocumentOwnerType,
  sortOrder: number,
  options?: {
    mandatory?: boolean
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
    ownerType,
    description: options?.description,
    hasSample: Boolean(sample),
    sampleDocumentName: sample?.fileName,
    sampleDocumentUrl: sample?.url,
    acceptedFormats:
      documentId === 'photo' || documentId === 'digital-photograph'
        ? ['JPG', 'PNG']
        : ['PDF', 'JPG', 'PNG'],
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
      commonDocument: item.commonDocument,
    }),
  )
}

const SAMPLES = MOCK_DOCUMENT_SAMPLE_TEMPLATES

const CHINA_G_TYPE_SEAFARER: DocSpec[] = [
  {
    id: 'passport',
    docId: 'passport',
    description:
      'Valid passport bio-data pages with minimum six months validity remaining for China visa filing.',
  },
  {
    id: 'old-passport',
    docId: 'old-passport',
    description:
      'Previous or expired passport copy when embassy requires travel history or cancelled passport verification.',
  },
  {
    id: 'cdc',
    docId: 'cdc',
    description: 'Continuous Discharge Certificate of the seafarer containing service and vessel records.',
  },
  {
    id: 'old-cdc',
    docId: 'old-cdc',
    description:
      'Superseded CDC copy retained when embassy requires complete seafarer service continuity.',
  },
  {
    id: 'photo',
    docId: 'photo',
    description: 'Recent passport-size photograph meeting China embassy specifications for visa submission.',
  },
  {
    id: 'personal-details-form',
    docId: 'personal-details-form',
    description: 'Completed personal particulars form as required by the China visa application process.',
  },
  {
    id: 'stcw-certificate',
    docId: 'stcw-certificate',
    description: 'STCW training and competency certificates for the seafarer rank being deployed.',
  },
  {
    id: 'aadhaar-card',
    docId: 'aadhaar-card',
    description: 'Aadhaar card copy for applicant identity cross-verification when requested by the embassy.',
  },
  {
    id: 'passport-scan-copy',
    docId: 'passport-scan-copy',
    description: 'Scan copy of passport bio pages uploaded to the China embassy or VFS portal.',
  },
  {
    id: 'cdc-scan-copy',
    docId: 'cdc-scan-copy',
    description: 'Scan copy of CDC uploaded to the China embassy or VFS portal.',
  },
  {
    id: 'digital-photograph',
    docId: 'digital-photograph',
    description: 'Digital photograph meeting China online portal dimension and background requirements.',
  },
]

const CHINA_G_TYPE_COMPANY: DocSpec[] = [
  {
    id: 'company-covering-letter',
    docId: 'company-covering-letter',
    description:
      'Official company letter confirming employment, travel purpose, visa requirement, and expense responsibility.',
    sample: SAMPLES.companyCoveringLetter,
  },
]

const CHINA_G_TYPE_FOREIGN_AGENT: DocSpec[] = [
  {
    id: 'invitation',
    docId: 'invitation',
    description: 'Official invitation issued by the overseas company inviting the applicant for travel.',
    sample: SAMPLES.invitationLetter,
  },
  {
    id: 'loi',
    docId: 'loi',
    description:
      'Formal letter of invitation from the host company or foreign agent specifying visit purpose and arrangements.',
    sample: SAMPLES.letterOfInvitation,
    commonDocument: true,
  },
  {
    id: 'foreign-business-license',
    docId: 'foreign-business-license',
    description: 'Business license or operating permit of the foreign host company or shipping agent.',
  },
  {
    id: 'inviter-id-proof',
    docId: 'inviter-id-proof',
    description: 'Identity document of the overseas inviter or authorized company representative.',
  },
]

const CHINA_M_TYPE_EXTRA_COMPANY: DocSpec[] = [
  {
    id: 'employment-confirmation',
    docId: 'employment-certificate',
    description: 'Employer confirmation of current employment, rank, and deployment for China M type visa.',
  },
  {
    id: 'company-establishment-proof',
    docId: 'certificate-of-incorporation',
    description: 'Company registration certificate confirming legal incorporation of the employing organization.',
  },
  {
    id: 'position-confirmation',
    docId: 'employment-certificate',
    description: 'Position confirmation letter confirming seafarer rank, vessel assignment, and deployment role.',
  },
  {
    id: 'business-activity-declaration',
    docId: 'company-explanation-letter',
    description: 'Company declaration of business activity and travel purpose supporting China M type visa filing.',
  },
]

const JAPAN_CREW_SEAFARER: DocSpec[] = [
  {
    id: 'passport',
    docId: 'passport',
    description:
      'Valid passport bio-data pages with minimum validity as required by the Embassy of Japan for crew visa.',
  },
  {
    id: 'old-passport',
    docId: 'old-passport',
    description: 'Previous passport copy when embassy requires prior travel history or renewal verification.',
  },
  {
    id: 'cdc',
    docId: 'cdc',
    description: 'Continuous Discharge Certificate of the seafarer containing service and vessel records.',
  },
  {
    id: 'old-cdc',
    docId: 'old-cdc',
    description: 'Superseded CDC copy when full seafarer service history must be demonstrated.',
  },
  {
    id: 'photo',
    docId: 'photo',
    description: 'Recent passport-size photograph per Japan embassy crew visa specifications.',
  },
  {
    id: 'bank',
    docId: 'bank',
    description: 'Latest six-month bank statement duly stamped and signed by the bank.',
  },
  {
    id: 'bank-balance-certificate',
    docId: 'bank-balance-certificate',
    description: 'Bank-issued certificate confirming account balance for Japan embassy financial verification.',
  },
  {
    id: 'income-tax-return',
    docId: 'income-tax-return',
    description: 'Filed income tax return substantiating applicant income for Japan crew visa assessment.',
  },
  {
    id: 'itr-declaration',
    docId: 'itr-declaration',
    description:
      'Signed ITR declaration or acknowledgment when full income tax return is not yet available for filing.',
    sample: SAMPLES.itrDeclaration,
  },
  {
    id: 'salary-slip',
    docId: 'salary-slip',
    description: 'Recent salary slip confirming employment income for Japan embassy financial review.',
  },
]

const JAPAN_CREW_COMPANY: DocSpec[] = [
  {
    id: 'company-covering-letter',
    docId: 'company-covering-letter',
    description:
      'Official company letter confirming employment, travel purpose, visa requirement, and expense responsibility.',
    sample: SAMPLES.companyCoveringLetter,
  },
  {
    id: 'certificate-of-incorporation',
    docId: 'certificate-of-incorporation',
    description: 'Company registration certificate confirming legal incorporation of the employing organization.',
  },
  {
    id: 'employment-certificate',
    docId: 'employment-certificate',
    description: 'Employer certificate confirming current employment, role, and tenure for Japan crew visa processing.',
  },
  {
    id: 'employment-contract',
    docId: 'employment-contract',
    description: 'Signed employment contract supporting crew deployment and Japan visa application.',
  },
]

const JAPAN_CREW_FOREIGN_AGENT: DocSpec[] = [
  {
    id: 'invitation',
    docId: 'invitation',
    description: 'Official invitation issued by the overseas company inviting the applicant for travel.',
    sample: SAMPLES.invitationLetter,
  },
  {
    id: 'schedule-of-stay',
    docId: 'schedule-of-stay',
    description:
      'Planned itinerary or schedule of stay detailing dates, cities, and accommodation during the Japan visit.',
    sample: SAMPLES.scheduleOfStay,
  },
  {
    id: 'letter-of-guarantee',
    docId: 'letter-of-guarantee',
    description:
      'Guarantee letter from host or sponsor accepting responsibility for applicant conduct and expenses in Japan.',
    sample: SAMPLES.letterOfGuarantee,
  },
  {
    id: 'foreign-company-registration',
    docId: 'foreign-company-registration',
    description: 'Registration or incorporation proof of the overseas inviting or sponsoring company.',
  },
]

const JAPAN_CREW_KOLKATA_EXTRA_SEAFARER: DocSpec[] = [
  {
    id: 'authority-letter',
    docId: 'authority-letter',
    description:
      'Letter authorizing a representative to act, collect documents, or submit on behalf of the applicant.',
    sample: SAMPLES.authorityLetter,
  },
]

const JAPAN_CREW_KOLKATA_EXTRA_COMPANY: DocSpec[] = [
  {
    id: 'company-income-tax-return',
    docId: 'company-income-tax-return',
    description: 'Corporate income tax return filed by the sponsoring company for Kolkata jurisdiction review.',
  },
  {
    id: 'company-bank-statement',
    docId: 'company-bank-statement',
    description: 'Corporate bank statement demonstrating employer financial standing for Japan crew visa.',
  },
  {
    id: 'company-balance-certificate',
    docId: 'company-balance-certificate',
    description: 'Bank-issued certificate confirming corporate account balance for sponsor verification.',
  },
  {
    id: 'company-explanation-letter',
    docId: 'company-explanation-letter',
    description:
      'Employer letter clarifying travel purpose, itinerary, or supporting facts requested by the consulate.',
  },
]

const CHINA_G_TYPE_GLTS_SCOPE = gltsScope([
  'Completion and submission of visa application',
  'Internal compliance verification',
  'Review of crew documentation',
  'Uploading and handling of documents',
  'Appointment coordination',
  'Fee payment coordination',
  'Status tracking',
  'Passport submission and collection',
  'Travel ticket assistance',
  'Aadhaar affidavit assistance when required',
])

const CHINA_M_TYPE_GLTS_SCOPE = gltsScope([
  'Completion and submission of visa application',
  'Verification of employment-related documents',
  'Validation of company declarations',
  'Internal compliance verification',
  'Uploading and handling of documents',
  'Appointment coordination',
  'Fee payment coordination',
  'Status tracking',
  'Passport submission and collection',
  'Travel ticket assistance',
])

const JAPAN_CREW_DELHI_GLTS_SCOPE = gltsScope([
  'Japan visa application preparation',
  'Financial document verification',
  'Company and agent document validation',
  'Compliance review',
  'Appointment management',
  'Fee payment coordination',
  'Tracking and monitoring',
  'Passport submission and collection',
])

const JAPAN_CREW_KOLKATA_GLTS_SCOPE = gltsScope([
  'Japan visa application preparation',
  'Jurisdiction eligibility verification',
  'Financial document validation',
  'Company document review',
  'Compliance verification',
  'Appointment management',
  'Fee payment coordination',
  'Tracking and monitoring',
  'Passport submission and collection',
])

function buildChinaGTypeDelhiDocuments(): CountryJurisdictionDocumentRule[] {
  const prefix = 'cn-g-delhi'
  const seafarer = ownerDocs(prefix, 'seafarer', CHINA_G_TYPE_SEAFARER)
  const company = ownerDocs(prefix, 'company', CHINA_G_TYPE_COMPANY, seafarer.length)
  const foreign = ownerDocs(
    prefix,
    'shipping_agent',
    CHINA_G_TYPE_FOREIGN_AGENT,
    seafarer.length + company.length,
  )
  return [...seafarer, ...company, ...foreign]
}

function buildChinaMTypeDelhiDocuments(): CountryJurisdictionDocumentRule[] {
  const gTypeDocs = buildChinaGTypeDelhiDocuments()
  const prefix = 'cn-m-delhi'
  const extraCompany = ownerDocs(prefix, 'company', CHINA_M_TYPE_EXTRA_COMPANY, gTypeDocs.length)
  return [...gTypeDocs, ...extraCompany]
}

function buildJapanCrewDelhiDocuments(): CountryJurisdictionDocumentRule[] {
  const prefix = 'jp-crew-delhi'
  const seafarer = ownerDocs(prefix, 'seafarer', JAPAN_CREW_SEAFARER)
  const company = ownerDocs(prefix, 'company', JAPAN_CREW_COMPANY, seafarer.length)
  const foreign = ownerDocs(
    prefix,
    'shipping_agent',
    JAPAN_CREW_FOREIGN_AGENT,
    seafarer.length + company.length,
  )
  return [...seafarer, ...company, ...foreign]
}

function buildJapanCrewKolkataDocuments(): CountryJurisdictionDocumentRule[] {
  const base = buildJapanCrewDelhiDocuments()
  const prefix = 'jp-crew-kolkata'
  const extraSeafarer = ownerDocs(prefix, 'seafarer', JAPAN_CREW_KOLKATA_EXTRA_SEAFARER, base.length)
  const extraCompany = ownerDocs(
    prefix,
    'company',
    JAPAN_CREW_KOLKATA_EXTRA_COMPANY,
    base.length + extraSeafarer.length,
  )
  return [...base, ...extraSeafarer, ...extraCompany]
}

function chinaDelhiJurisdiction(
  documents: CountryJurisdictionDocumentRule[],
  gltsScopeText: string,
): CountryVisaJurisdiction {
  return jurisdiction({
    id: 'delhi',
    name: 'Delhi',
    embassyOrVfs: CHINA_EMBASSY,
    submissionCenter: 'VFS Delhi',
    processingTime: '10',
    priorityLevel: 'standard',
    status: 'active',
    applicableStates: [...CHINA_DELHI_STATES],
    processingRules: { ...CHINA_MARINE_PROCESSING_RULES },
    gltsScope: gltsScopeText,
    documents,
  })
}

function japanCrewJurisdiction(
  id: string,
  name: string,
  embassyLabel: string,
  submissionCenter: string,
  applicableStates: readonly string[],
  documents: CountryJurisdictionDocumentRule[],
  gltsScopeText: string,
): CountryVisaJurisdiction {
  return jurisdiction({
    id,
    name,
    embassyOrVfs: embassyLabel,
    submissionCenter,
    processingTime: '10',
    priorityLevel: 'standard',
    status: 'active',
    applicableStates: [...applicableStates],
    processingRules: { ...CHINA_MARINE_PROCESSING_RULES },
    gltsScope: gltsScopeText,
    documents,
  })
}

export function chinaMarineGTypeDelhiJurisdiction(): CountryVisaJurisdiction {
  return chinaDelhiJurisdiction(buildChinaGTypeDelhiDocuments(), CHINA_G_TYPE_GLTS_SCOPE)
}

export function chinaMarineMTypeDelhiJurisdiction(): CountryVisaJurisdiction {
  return chinaDelhiJurisdiction(buildChinaMTypeDelhiDocuments(), CHINA_M_TYPE_GLTS_SCOPE)
}

export function japanMarineCrewVisaJurisdictions(): CountryVisaJurisdiction[] {
  const delhiDocs = buildJapanCrewDelhiDocuments()
  return [
    japanCrewJurisdiction(
      'delhi',
      'Delhi',
      'Embassy of Japan — New Delhi',
      'VFS Delhi',
      JAPAN_CREW_DELHI_STATES,
      delhiDocs,
      JAPAN_CREW_DELHI_GLTS_SCOPE,
    ),
    japanCrewJurisdiction(
      'mumbai',
      'Mumbai',
      'Consulate General of Japan — Mumbai',
      'VFS Mumbai',
      JAPAN_CREW_MUMBAI_STATES,
      delhiDocs,
      JAPAN_CREW_DELHI_GLTS_SCOPE,
    ),
    japanCrewJurisdiction(
      'kolkata',
      'Kolkata',
      'Consulate General of Japan — Kolkata',
      'VFS Kolkata',
      JAPAN_CREW_KOLKATA_STATES,
      buildJapanCrewKolkataDocuments(),
      JAPAN_CREW_KOLKATA_GLTS_SCOPE,
    ),
  ]
}
