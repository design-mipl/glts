import { ACCOUNT_MAPPED_COUNTRY_IDS, getMockCountryMasters } from '@/shared/data/mockCountryMasters'
import type { Country } from '@/shared/types/visa'
import type {
  CountryMaster,
  CountryVisaOffering,
  DocumentWorkspaceItem,
  PassportIssueLocation,
  PortalChecklistItem,
  RequirementDocumentRow,
  RequirementPreviewCard,
} from '@/shared/types/countryMaster'

export type { CountryMaster, CountryVisaOffering } from '@/shared/types/countryMaster'
export { ACCOUNT_MAPPED_COUNTRY_IDS } from '@/shared/data/mockCountryMasters'

export interface ListCountryMastersOptions {
  activeOnly?: boolean
  accountMappedOnly?: boolean
  query?: string
}

export function listCountryMasters(options: ListCountryMastersOptions = {}): CountryMaster[] {
  const { activeOnly = true, accountMappedOnly = false, query } = options
  let rows = getMockCountryMasters()

  if (activeOnly) rows = rows.filter((c) => c.status === 'active')
  if (accountMappedOnly) {
    const allowed = new Set<string>(ACCOUNT_MAPPED_COUNTRY_IDS)
    rows = rows.filter(c => allowed.has(c.id))
  }

  const q = query?.trim().toLowerCase()
  if (q) {
    rows = rows.filter(
      c =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        c.region.toLowerCase().includes(q) ||
        c.cities.toLowerCase().includes(q),
    )
  }

  return rows
}

export function getCountryMasterById(countryId: string): CountryMaster | undefined {
  return getMockCountryMasters().find(c => c.id === countryId)
}

export function getPassportIssueLocations(countryId: string): PassportIssueLocation[] {
  const master = getCountryMasterById(countryId)
  if (!master?.passportIssueLocations?.length) return []
  return master.passportIssueLocations.filter((loc) => loc.active !== false)
}

export function resolvePassportJurisdiction(
  countryId: string,
  locationId: string,
): string | undefined {
  return getPassportIssueLocations(countryId).find((loc) => loc.id === locationId)?.jurisdiction
}

export function getPassportIssueLocationLabel(
  countryId: string,
  locationId: string,
): string | undefined {
  return getPassportIssueLocations(countryId).find((loc) => loc.id === locationId)?.label
}

export function getVisaOfferings(countryId: string, activeOnly = true): CountryVisaOffering[] {
  const master = getCountryMasterById(countryId)
  if (!master) return []
  const offerings = master.visaOfferings
  return activeOnly ? offerings.filter(o => o.active) : offerings
}

export function getVisaOfferingById(
  countryId: string,
  offeringId: string,
): CountryVisaOffering | undefined {
  return getVisaOfferings(countryId, false).find(o => o.id === offeringId)
}

/** Map country master to legacy `Country` shape for existing portal cards. */
export function countryMasterToPortalCountry(master: CountryMaster): Country {
  return {
    id: master.id,
    name: master.name,
    code: master.code,
    region: master.region,
    visaTypes: [],
    processingTime: master.processingTime,
    price: master.price,
    rating: master.rating,
    flags: master.flag,
    trending: master.trending,
    trendingPercent: master.trendingPercent,
    visaCategory: master.visaCategory as Country['visaCategory'],
    validity: master.validity,
    documentsNeeded: [],
    heroPhotoId: master.heroPhotoId,
    fastMinutes: master.fastMinutes,
    cities: master.cities,
  }
}

export function listPortalCountries(options: ListCountryMastersOptions = {}): Country[] {
  return listCountryMasters(options).map(countryMasterToPortalCountry)
}

export function patchStateFromVisaOffering(offering: CountryVisaOffering): {
  visaOfferingId: string
  visaType: string
  visaTypeLabel: string
  purpose: string
  purposeLabel: string
  entryType: string
} {
  return {
    visaOfferingId: offering.id,
    visaType: offering.visaTypeId,
    visaTypeLabel: offering.visaTypeLabel,
    purpose: offering.purposeId,
    purposeLabel: offering.purposeLabel,
    entryType: offering.entryType,
  }
}

function defaultRequirementPreviewCards(isCrew: boolean): RequirementPreviewCard[] {
  const crewDocs: RequirementDocumentRow[] = [
    { id: 'passport', name: 'Passport', mandatory: true, hasSample: true },
    { id: 'cdc', name: 'CDC', mandatory: true, hasSample: true },
    { id: 'photos', name: 'Photos', mandatory: true },
    { id: 'aadhaar', name: 'Aadhaar', mandatory: false, remarks: 'If applicable' },
    { id: 'passport-scan', name: 'Passport scans', mandatory: true },
    { id: 'cdc-copy', name: 'CDC copies', mandatory: true },
  ]

  return [
    {
      id: 'crew',
      title: 'Documents required from crew',
      variant: 'crew',
      documents: isCrew
        ? crewDocs
        : [
            { id: 'passport', name: 'Passport', mandatory: true, hasSample: true },
            { id: 'photos', name: 'Photos', mandatory: true },
            { id: 'bank', name: 'Bank statements', mandatory: true, remarks: 'Last 3 months' },
          ],
    },
    {
      id: 'shipping',
      title: 'Documents required from shipping company',
      variant: 'shipping',
      arrangedBy: 'Shipping company',
      documents: [
        { id: 'cover', name: 'Covering letter', mandatory: true, hasSample: true },
        { id: 'employee', name: 'Employee details', mandatory: true },
        { id: 'expense', name: 'Expense clause', mandatory: true },
        { id: 'nature', name: 'Business nature', mandatory: false },
        { id: 'declaration', name: 'Company declaration', mandatory: true },
      ],
    },
    {
      id: 'embassy',
      title: 'Documents required from embassy / agents',
      variant: 'embassy',
      alertNote: 'Embassy formatting rules apply. Confirm LOI validity before upload.',
      documents: [
        { id: 'invitation', name: 'Invitation letter', mandatory: true, hasSample: true },
        { id: 'loi', name: 'LOI', mandatory: isCrew },
        { id: 'license', name: 'Business license', mandatory: false },
        { id: 'agent', name: 'Agent ID proof', mandatory: false },
        { id: 'instructions', name: 'Embassy instructions', mandatory: true, remarks: 'Follow embassy PDF' },
      ],
    },
    {
      id: 'glts',
      title: 'Scope of work — GLTS',
      variant: 'glts',
      scopeItems: [
        'Visa application filing',
        'Compliance verification',
        'Appointment handling',
        'Submission handling',
        'Passport collection',
        'Tracking & updates',
      ],
    },
  ]
}

export function getRequirementPreviewCards(
  countryId: string,
  offeringId: string,
): RequirementPreviewCard[] {
  const offering = getVisaOfferingById(countryId, offeringId)
  if (!offering) return []
  if (offering.requirementPreviewCards?.length) return offering.requirementPreviewCards
  const isCrew = offering.workflowProfile === 'crew'
  return defaultRequirementPreviewCards(isCrew)
}

export function getDocumentWorkspaceItems(
  countryId: string,
  offeringId: string,
  processingType: 'normal' | 'express' = 'normal',
): DocumentWorkspaceItem[] {
  const offering = getVisaOfferingById(countryId, offeringId)
  if (!offering) return []

  const isCrew = offering.workflowProfile === 'crew'
  const isChina = countryId === '13'
  const isExpress = processingType === 'express'

  return offering.documentMappings.map((doc, index) => {
    const base: DocumentWorkspaceItem = {
      id: doc.documentId,
      name: doc.name,
      required: doc.mandatory,
      description: doc.description ?? `${doc.name} as per country master checklist.`,
      formatNotes: doc.formatNotes,
      remarks: doc.remarks,
      ocrSupported: doc.ocrSupported,
    }

    if (doc.documentId === 'passport') {
      return {
        ...base,
        status: 'Verified',
        extractedFields: [
          { label: 'Name', value: 'Priya Sharma' },
          { label: 'Passport No.', value: 'Z1234567' },
          { label: 'Nationality', value: 'IND' },
          { label: 'Date of Birth', value: '14 Mar 1988' },
          { label: 'Gender', value: 'F' },
          { label: 'Issue Date', value: '09 Jun 2021' },
          { label: 'Expiry Date', value: '15 Aug 2032' },
        ],
      }
    }

    if (doc.documentId === 'photo') {
      return { ...base, status: isExpress ? 'Uploaded' : 'Needs Review' }
    }

    if (doc.documentId === 'cdc') {
      return {
        ...base,
        status: 'Low Confidence',
        ocrMismatchAlert: 'CDC number mismatch with passport surname spelling.',
      }
    }

    if (doc.documentId === 'vessel-letter') {
      return {
        ...base,
        status: isExpress ? 'Needs Review' : 'Needs Clarification',
        remarks: isExpress ? undefined : 'Crew joining date missing in uploaded letter.',
      }
    }

    if (doc.documentId === 'bank') {
      return { ...base, status: isExpress ? 'Uploaded' : undefined }
    }

    if (doc.documentId === 'invitation' || index > 2) {
      return {
        ...base,
        status:
          isChina && !isExpress && !isCrew ? 'Needs Clarification' : ('Needs Review' as const),
        remarks:
          isChina && !isExpress && doc.documentId === 'invitation'
            ? 'Invitation format does not match China consulate template.'
            : undefined,
      }
    }

    return base
  })
}

export function getChecklistItemsForOffering(
  countryId: string,
  offeringId: string,
): PortalChecklistItem[] {
  const offering = getVisaOfferingById(countryId, offeringId)
  if (!offering) return []

  const statusCycle: PortalChecklistItem['status'][] = ['uploaded', 'uploaded', 'missing', 'pending', 'missing']

  return offering.documentMappings.map((doc, i) => ({
    id: doc.documentId,
    label: doc.name,
    required: doc.mandatory,
    status: statusCycle[i % statusCycle.length],
  }))
}

export function getPopularVisaLabels(countryId: string): string {
  return getVisaOfferings(countryId)
    .slice(0, 2)
    .map(o => o.visaTypeLabel)
    .join(' · ')
}
