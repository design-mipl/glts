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

  return contacts
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
    default:
      return sourceType
  }
}
