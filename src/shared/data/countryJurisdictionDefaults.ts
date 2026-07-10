import type {
  CountryDocumentChecklistItem,
  CountryJurisdictionDocumentRule,
  CountryJurisdictionProcessingRules,
  CountryVisaJurisdiction,
  DocumentOwnerType,
  JurisdictionDocumentGroup,
} from '@/shared/types/countryMaster'

const SEED_DOCUMENT_OWNER_TYPES: Partial<Record<string, DocumentOwnerType>> = {
  passport: 'applicant',
  'travel-ticket': 'company',
  insurance: 'applicant',
}

export const DEFAULT_JURISDICTION_PROCESSING_RULES: CountryJurisdictionProcessingRules = {
  biometricsRequired: false,
  interviewRequired: false,
  originalDocumentsRequired: true,
  appointmentMandatory: false,
}

export function generateJurisdictionId(): string {
  return `jur-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function generateDocumentRuleId(): string {
  return `doc-rule-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function generateVfsServiceRateId(): string {
  return `vfs-rate-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function checklistToJurisdictionDocuments(
  items: CountryDocumentChecklistItem[],
  group: JurisdictionDocumentGroup = 'common',
): CountryJurisdictionDocumentRule[] {
  return items.map((item, index) => ({
    id: generateDocumentRuleId(),
    documentId: item.documentId,
    group,
    mandatory: item.mandatory,
    ocrEnabled: item.documentId === 'passport',
    multipleUpload: false,
    commonDocument: group === 'common',
    originalDocument: false,
    ownerType: SEED_DOCUMENT_OWNER_TYPES[item.documentId],
    description: item.description,
    acceptedFormats: item.documentId === 'photo' ? ['JPG', 'PNG'] : ['PDF', 'JPG', 'PNG'],
    validationRules: item.mandatory ? 'Required for submission' : undefined,
    sortOrder: item.sortOrder ?? index,
  }))
}

export function jurisdiction(
  partial: Omit<CountryVisaJurisdiction, 'processingRules' | 'documents'> & {
    processingRules?: CountryJurisdictionProcessingRules
    documents?: CountryJurisdictionDocumentRule[]
  },
): CountryVisaJurisdiction {
  return {
    processingRules: partial.processingRules ?? { ...DEFAULT_JURISDICTION_PROCESSING_RULES },
    documents: partial.documents ?? [],
    ...partial,
  }
}

export function defaultJurisdictionsForVisa(
  _visaName: string,
  countryName: string,
  applicationDocuments: CountryDocumentChecklistItem[],
): CountryVisaJurisdiction[] {
  return [
    jurisdiction({
      id: 'delhi',
      name: 'Delhi',
      embassyOrVfs: `Chinese Embassy — ${countryName}`,
      submissionCenter: 'VFS Delhi',
      processingTime: '10',
      priorityLevel: 'standard',
      status: 'active',
      applicableStates: ['Delhi', 'Haryana', 'Rajasthan', 'Uttar Pradesh'],
      processingRules: {
        biometricsRequired: true,
        interviewRequired: false,
        originalDocumentsRequired: true,
        appointmentMandatory: true,
      },
      documents: checklistToJurisdictionDocuments(applicationDocuments, 'jurisdiction'),
    }),
    jurisdiction({
      id: 'mumbai',
      name: 'Mumbai',
      embassyOrVfs: `Chinese Consulate — Mumbai`,
      submissionCenter: 'VFS Mumbai',
      processingTime: '12',
      priorityLevel: 'standard',
      status: 'active',
      applicableStates: ['Maharashtra', 'Goa', 'Gujarat'],
      processingRules: {
        biometricsRequired: true,
        interviewRequired: false,
        originalDocumentsRequired: true,
        appointmentMandatory: true,
      },
      documents: checklistToJurisdictionDocuments(
        applicationDocuments.filter((d) => d.documentId !== 'insurance'),
        'jurisdiction',
      ),
    }),
  ]
}

export function singleJurisdictionForVisa(
  id: string,
  name: string,
  countryName: string,
  applicationDocuments: CountryDocumentChecklistItem[],
): CountryVisaJurisdiction {
  return jurisdiction({
    id,
    name,
    embassyOrVfs: `Chinese Embassy — ${countryName}`,
    submissionCenter: `VFS ${name}`,
    processingTime: '12',
    priorityLevel: 'standard',
    status: 'active',
    applicableStates: ['All states'],
    documents: checklistToJurisdictionDocuments(applicationDocuments, 'jurisdiction'),
  })
}
