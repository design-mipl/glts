import {
  DOCUMENT_OWNER_TYPE_LABELS,
  MARINE_DOCUMENT_OWNER_TAB_ORDER,
} from '@/shared/constants/documentOwnerType'
import { documentMasterService } from '@/shared/services/documentMasterService'
import type {
  CountryJurisdictionDocumentRule,
  CountryVisaJurisdiction,
  CountryVisaType,
  DocumentOwnerType,
  RequirementDocumentRow,
  RequirementPreviewCard,
  VisaApplicationWindow,
} from '@/shared/types/countryMaster'
import { richTextToPlainText } from '@/shared/utils/richTextUtils'

const OWNER_VARIANT: Record<DocumentOwnerType, RequirementPreviewCard['variant']> = {
  seafarer: 'crew',
  applicant: 'crew',
  company: 'shipping',
  shipping_agent: 'embassy',
  inviting_company: 'embassy',
  inviting_family_friend: 'embassy',
}

export function enrichRequirementDocumentRow(
  row: RequirementDocumentRow,
  documentId?: string,
): RequirementDocumentRow {
  const master = documentId ? documentMasterService.getById(documentId) : documentMasterService.getById(row.id)
  const description = row.description?.trim() || master?.description?.trim()
  return {
    ...row,
    name: master?.documentType ?? row.name ?? documentId ?? row.id,
    description,
    remarks: description ? undefined : row.remarks,
    originalDocument: row.originalDocument,
    hasSample: row.hasSample,
    sampleDocumentName: row.sampleDocumentName,
    sampleDocumentUrl: row.sampleDocumentUrl,
  }
}

function documentRuleToRow(rule: CountryJurisdictionDocumentRule): RequirementDocumentRow {
  return enrichRequirementDocumentRow(
    {
      id: rule.id,
      name: '',
      mandatory: rule.mandatory,
      originalDocument: rule.originalDocument,
      description: rule.description,
      remarks: rule.validationRules,
      hasSample: rule.hasSample,
      sampleDocumentName: rule.sampleDocumentName,
      sampleDocumentUrl: rule.sampleDocumentUrl,
    },
    rule.documentId,
  )
}

function jurisdictionDocumentsForOwner(
  jurisdiction: CountryVisaJurisdiction,
  ownerType: DocumentOwnerType,
): CountryJurisdictionDocumentRule[] {
  return jurisdiction.documents
    .filter((rule) => rule.ownerType === ownerType && rule.group !== 'optional')
    .sort((a, b) => a.sortOrder - b.sortOrder)
}

export function resolveJurisdictionForState(
  visaType: CountryVisaType | undefined,
  stateName: string,
): CountryVisaJurisdiction | undefined {
  if (!visaType || !stateName.trim()) return undefined
  const normalized = stateName.trim()
  return (visaType.jurisdictions ?? [])
    .filter((jurisdiction) => jurisdiction.status === 'active')
    .find((jurisdiction) => jurisdiction.applicableStates.includes(normalized))
}

/** Embassy/VFS jurisdiction workflow applies when jurisdictions are configured and enabled. */
export function shouldShowJurisdictionNodes(
  visaType: Pick<CountryVisaType, 'jurisdictionEnabled' | 'jurisdictions' | 'visaMode'> | undefined,
): boolean {
  if (!visaType) return false
  if (visaType.jurisdictionEnabled === false) return false
  if (visaType.visaMode === 'e_visa' && visaType.jurisdictionEnabled !== true) return false
  if (visaType.jurisdictionEnabled === true) {
    return (visaType.jurisdictions?.length ?? 0) > 0
  }
  return (visaType.jurisdictions?.length ?? 0) > 0
}

/** Application flow — passport state + jurisdiction fields only when states are configured. */
export function visaTypeRequiresJurisdictionSelection(
  visaType: CountryVisaType | undefined,
): boolean {
  if (!shouldShowJurisdictionNodes(visaType)) return false
  return getApplicableStatesForVisaType(visaType).length > 0
}

export function getApplicableStatesForVisaType(visaType: CountryVisaType | undefined): string[] {
  if (!visaType) return []
  const states = new Set<string>()
  for (const jurisdiction of visaType.jurisdictions ?? []) {
    if (jurisdiction.status !== 'active') continue
    jurisdiction.applicableStates.forEach((state) => states.add(state))
  }
  return [...states].sort((a, b) => a.localeCompare(b))
}

export function buildRequirementPreviewCardsFromJurisdiction(
  jurisdiction: CountryVisaJurisdiction,
): RequirementPreviewCard[] {
  const cards: RequirementPreviewCard[] = []

  for (const ownerType of MARINE_DOCUMENT_OWNER_TAB_ORDER) {
    const rules = jurisdictionDocumentsForOwner(jurisdiction, ownerType)
    if (!rules.length) continue
    cards.push({
      id: ownerType,
      title: DOCUMENT_OWNER_TYPE_LABELS[ownerType],
      ownerType,
      variant: OWNER_VARIANT[ownerType],
      documents: rules.map(documentRuleToRow),
    })
  }

  const gltsScope = jurisdiction.gltsScope?.trim()
  if (gltsScope && richTextToPlainText(gltsScope).length > 0) {
    cards.push({
      id: 'glts',
      title: 'GLTS',
      variant: 'glts',
      gltsScopeHtml: gltsScope,
    })
  }

  return cards
}

export function buildRequirementPreviewCardsFromVisaType(
  visaType: CountryVisaType,
): RequirementPreviewCard[] {
  const rules = (visaType.documents ?? [])
    .filter((rule) => rule.group !== 'optional')
    .sort((a, b) => a.sortOrder - b.sortOrder)

  const cards: RequirementPreviewCard[] = []
  if (rules.length) {
    cards.push({
      id: 'visa-type-documents',
      title: 'Documents',
      variant: 'embassy',
      documents: rules.map(documentRuleToRow),
    })
  }

  const gltsScope = visaType.gltsScope?.trim()
  if (gltsScope && richTextToPlainText(gltsScope).length > 0) {
    cards.push({
      id: 'glts',
      title: 'GLTS',
      variant: 'glts',
      gltsScopeHtml: gltsScope,
    })
  }

  return cards
}

export function formatVisaApplicationWindowLabel(window: VisaApplicationWindow): string {
  const unitLabel = window.value === 1 ? window.unit.slice(0, -1) : window.unit
  return `Intended travel should fall within ${window.value} ${unitLabel} of your application filing window.`
}

export function getTravelDateInputBounds(window?: VisaApplicationWindow): {
  min: string
  max?: string
  helperText: string
} {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const min = today.toISOString().slice(0, 10)

  if (!window?.value) {
    return { min, helperText: 'Select the crew member intended travel date.' }
  }

  const maxDate = new Date(today)
  if (window.unit === 'days') {
    maxDate.setDate(maxDate.getDate() + window.value)
  } else if (window.unit === 'weeks') {
    maxDate.setDate(maxDate.getDate() + window.value * 7)
  } else {
    maxDate.setMonth(maxDate.getMonth() + window.value)
  }

  return {
    min,
    max: maxDate.toISOString().slice(0, 10),
    helperText: formatVisaApplicationWindowLabel(window),
  }
}
