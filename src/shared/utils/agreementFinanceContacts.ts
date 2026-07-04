import { companyMasterService } from '@/shared/services/companyMasterService'
import type {
  AgreementFinanceContactPerson,
  AgreementFinanceContacts,
  CommercialAgreement,
  CommercialAgreementFormData,
} from '@/shared/types/commercialAgreement'

export function deriveFinanceContactPersons(
  data: CommercialAgreementFormData,
): AgreementFinanceContactPerson[] {
  const contacts: AgreementFinanceContactPerson[] = []

  const companyName = data.company.companyName.trim() || 'Primary company'
  if (
    data.company.contactPersonName.trim() ||
    data.company.emailAddress.trim() ||
    data.company.contactNumber.trim()
  ) {
    contacts.push({
      id: 'fc-company',
      sourceType: 'company',
      sourceLabel: companyName,
      contactPerson: data.company.contactPersonName.trim(),
      email: data.company.emailAddress.trim(),
      phone: data.company.contactNumber.trim(),
    })
  }

  if (data.parentCompanyId) {
    const parent = companyMasterService.getById(data.parentCompanyId)
    if (
      parent &&
      (parent.contactPersonName.trim() || parent.emailAddress.trim() || parent.contactNumber.trim())
    ) {
      contacts.push({
        id: `fc-parent-${parent.id}`,
        sourceType: 'parent_company',
        sourceId: parent.id,
        sourceLabel: `Parent · ${parent.companyName}`,
        contactPerson: parent.contactPersonName.trim(),
        email: parent.emailAddress.trim(),
        phone: parent.contactNumber.trim(),
      })
    }
  }

  for (const entity of data.entities) {
    if (!entity.contactPerson.trim() && !entity.email.trim() && !entity.phone.trim()) continue
    contacts.push({
      id: `fc-entity-${entity.id}`,
      sourceType: 'entity',
      sourceId: entity.id,
      sourceLabel: `Entity · ${entity.entityName.trim() || 'Untitled entity'}`,
      contactPerson: entity.contactPerson.trim(),
      email: entity.email.trim(),
      phone: entity.phone.trim(),
    })
  }

  const manualContacts = data.manualFinanceContacts ?? []

  return [...contacts, ...manualContacts]
}

export function financeContactsSummaryFromPersons(
  persons: AgreementFinanceContactPerson[],
): AgreementFinanceContacts {
  const primary =
    persons.find((person) => person.sourceType === 'company') ??
    persons.find((person) => person.sourceType === 'parent_company') ??
    persons[0]

  const invoiceEmail =
    persons.find((person) => person.sourceType === 'entity' && person.email)?.email ??
    primary?.email ??
    ''

  return {
    accountsSpocName: primary?.contactPerson ?? '',
    accountsTeamEmail: primary?.email ?? '',
    accountsContactNumber: primary?.phone ?? '',
    invoiceSubmissionEmail: invoiceEmail,
    paymentFollowUpContact: primary?.email ?? '',
  }
}

export function syncFinanceContactsFromSources(
  data: CommercialAgreementFormData,
): CommercialAgreementFormData {
  const financeContactPersons = deriveFinanceContactPersons(data)
  const selectedSet = new Set(data.selectedFinanceContactIds)
  const nextSelected =
    selectedSet.size > 0
      ? financeContactPersons.filter((person) => selectedSet.has(person.id)).map((person) => person.id)
      : financeContactPersons.map((person) => person.id)
  const selectedContacts = financeContactPersons.filter((person) => nextSelected.includes(person.id))
  return {
    ...data,
    financeContactPersons,
    selectedFinanceContactIds: nextSelected,
    financeContacts: financeContactsSummaryFromPersons(selectedContacts),
  }
}

export function getSelectedFinanceContactPersons(
  data: CommercialAgreementFormData,
): AgreementFinanceContactPerson[] {
  const contacts = deriveFinanceContactPersons(data)
  const selectedSet = new Set(data.selectedFinanceContactIds)
  if (selectedSet.size === 0) return contacts
  return contacts.filter((contact) => selectedSet.has(contact.id))
}

export function resolveFinanceContactPersons(
  data: CommercialAgreementFormData | CommercialAgreement,
): AgreementFinanceContactPerson[] {
  if ('financeContactPersons' in data && data.financeContactPersons?.length) {
    return data.financeContactPersons
  }
  if ('company' in data) {
    return deriveFinanceContactPersons(data)
  }
  return []
}

export function financeContactSourceTypeLabel(sourceType: AgreementFinanceContactPerson['sourceType']): string {
  switch (sourceType) {
    case 'company':
      return 'Company'
    case 'parent_company':
      return 'Parent company'
    case 'entity':
      return 'Entity'
    case 'manual':
      return 'Manual'
    default:
      return sourceType
  }
}

export function isManualFinanceContact(contact: AgreementFinanceContactPerson): boolean {
  return contact.id.startsWith('fc-manual-')
}

export interface FinanceContactSourceOption {
  value: string
  label: string
  sourceType: AgreementFinanceContactPerson['sourceType']
  sourceId?: string
  sourceLabel: string
}

export function getFinanceContactSourceOptions(
  data: CommercialAgreementFormData,
): FinanceContactSourceOption[] {
  const options: FinanceContactSourceOption[] = []

  if (data.company.companyName.trim()) {
    options.push({
      value: 'company:primary',
      label: `Company · ${data.company.companyName.trim()}`,
      sourceType: 'company',
      sourceId: 'primary',
      sourceLabel: data.company.companyName.trim(),
    })
  }

  if (data.parentCompanyId) {
    const parent = companyMasterService.getById(data.parentCompanyId)
    if (parent) {
      options.push({
        value: `parent:${parent.id}`,
        label: `Parent · ${parent.companyName}`,
        sourceType: 'parent_company',
        sourceId: parent.id,
        sourceLabel: `Parent · ${parent.companyName}`,
      })
    }
  }

  for (const entity of data.entities) {
    options.push({
      value: `entity:${entity.id}`,
      label: `Entity · ${entity.entityName.trim() || 'Untitled entity'}`,
      sourceType: 'entity',
      sourceId: entity.id,
      sourceLabel: `Entity · ${entity.entityName.trim() || 'Untitled entity'}`,
    })
  }

  options.push({
    value: 'manual:standalone',
    label: 'Manual contact',
    sourceType: 'manual',
    sourceLabel: 'Manual contact',
  })

  return options
}

export function getFinanceContactSourceValue(contact: AgreementFinanceContactPerson): string {
  if (contact.sourceType === 'manual') return 'manual:standalone'
  if (contact.sourceType === 'company' && contact.sourceId) return 'company:primary'
  if (!contact.sourceId) return ''
  if (contact.sourceType === 'parent_company') return `parent:${contact.sourceId}`
  if (contact.sourceType === 'entity') return `entity:${contact.sourceId}`
  return ''
}

export function extractManualFinanceContacts(
  agreement: CommercialAgreement | CommercialAgreementFormData,
): AgreementFinanceContactPerson[] {
  if ('manualFinanceContacts' in agreement && agreement.manualFinanceContacts?.length) {
    return [...agreement.manualFinanceContacts]
  }
  return (agreement.financeContactPersons ?? []).filter((contact) => contact.id.startsWith('fc-manual-'))
}

export function createEmptyManualFinanceContact(
  data?: CommercialAgreementFormData,
): AgreementFinanceContactPerson {
  const firstSource = data ? getFinanceContactSourceOptions(data)[0] : undefined
  return {
    id: `fc-manual-${Date.now()}`,
    sourceType: firstSource?.sourceType ?? 'manual',
    sourceId: firstSource?.sourceId,
    sourceLabel: firstSource?.sourceLabel ?? 'Manual contact',
    contactPerson: '',
    email: '',
    phone: '',
  }
}
