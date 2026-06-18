import type { QuotationFormData, QuotationRecord } from '@/shared/types/quotation'

export function validateQuotationForm(data: QuotationFormData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.customer.companyName.trim()) errors.companyName = 'Company name is required'
  if (!data.customer.contactPersonName.trim()) errors.contactPersonName = 'Contact person is required'
  if (!data.customer.contactNumber.trim() && !data.customer.emailAddress.trim()) {
    errors.contactNumber = 'Contact number or email is required'
  }
  if (!data.quotationDate) errors.quotationDate = 'Quotation date is required'
  if (!data.validTill) errors.validTill = 'Valid till date is required'
  if (data.pricingMatrix.length === 0) errors.pricingMatrix = 'Add at least one pricing row'
  return errors
}

export function validateForSubmit(record: QuotationRecord): { ok: boolean; issues: string[] } {
  const issues: string[] = []
  const version = record.pricingVersions.find((v) => v.id === record.currentVersionId)
  if (!version) issues.push('Current pricing version not found')
  else if (version.status !== 'draft') issues.push('Only draft versions can be submitted')
  if (!record.customer.companyName.trim()) issues.push('Company name is required')
  if (version && version.pricingMatrix.length === 0) issues.push('At least one pricing row is required')
  return { ok: issues.length === 0, issues }
}

export function validateForShare(record: QuotationRecord): { ok: boolean; issues: string[] } {
  const version = getCurrentVersion(record)
  const issues: string[] = []
  if (!version || version.status !== 'approved') issues.push('Quotation must be approved before sharing')
  if (record.sharedStatus === 'shared') issues.push('Quotation is already shared')
  return { ok: issues.length === 0, issues }
}

export function validateForConvert(record: QuotationRecord): { ok: boolean; issues: string[] } {
  const approved = getLatestApprovedVersion(record)
  const issues: string[] = []
  if (!approved) issues.push('An approved pricing version is required')
  if (record.convertedAgreementId) issues.push('Quotation has already been converted')
  return { ok: issues.length === 0, issues }
}

export function getCurrentVersion(record: QuotationRecord) {
  return record.pricingVersions.find((v) => v.id === record.currentVersionId)
}

export function getLatestApprovedVersion(record: QuotationRecord) {
  return [...record.pricingVersions]
    .filter((v) => v.status === 'approved')
    .sort((a, b) => b.versionNumber - a.versionNumber)[0]
}
