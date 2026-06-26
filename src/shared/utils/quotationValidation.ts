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
  if (!data.gstRateId) errors.gstRateId = 'GST rate is required'
  if (data.pricingMatrix.length === 0) errors.pricingMatrix = 'Add at least one pricing row'
  return errors
}

export function validateForShare(record: QuotationRecord): { ok: boolean; issues: string[] } {
  const version = getCurrentVersion(record)
  const issues: string[] = []
  if (!version || version.pricingMatrix.length === 0) {
    issues.push('Add at least one pricing row before sharing')
  }
  if (record.sharedStatus === 'shared') issues.push('Quotation is already shared')
  return { ok: issues.length === 0, issues }
}

export function validateForConvert(
  record: QuotationRecord,
  versionId?: string,
): { ok: boolean; issues: string[] } {
  const version = versionId ? getVersionById(record, versionId) : getLatestVersion(record)
  const issues: string[] = []
  if (!version) issues.push('A pricing version is required')
  else if (version.pricingMatrix.length === 0) issues.push('Selected version must have at least one pricing row')
  if (record.convertedAgreementId) issues.push('Quotation has already been converted')
  return { ok: issues.length === 0, issues }
}

export function getCurrentVersion(record: QuotationRecord) {
  return record.pricingVersions.find((v) => v.id === record.currentVersionId)
}

export function getVersionById(record: QuotationRecord, versionId: string) {
  return record.pricingVersions.find((v) => v.id === versionId)
}

export function getLatestVersion(record: QuotationRecord) {
  return [...record.pricingVersions].sort((a, b) => b.versionNumber - a.versionNumber)[0]
}
