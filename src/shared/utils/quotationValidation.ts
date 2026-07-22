import type { QuotationFormData, QuotationRecord } from '@/shared/types/quotation'
import { hasAnyPricing, isRetailPricingMode } from '@/shared/utils/quotationPricingUtils'

export function validateQuotationForm(data: QuotationFormData): Record<string, string> {
  const errors: Record<string, string> = {}
  if (!data.customer.companyName.trim()) errors.companyName = 'Company name is required'
  if (!data.customer.contactPersonName.trim()) errors.contactPersonName = 'Contact person is required'
  if (!data.customer.contactNumber.trim() && !data.customer.emailAddress.trim()) {
    errors.contactNumber = 'Mobile number or email is required'
  }
  if (!data.quotationDate) errors.quotationDate = 'Quotation date is required'
  if (!data.validTill) errors.validTill = 'Valid till date is required'
  if (!data.gstRateId) errors.gstRateId = 'GST rate is required'

  if (isRetailPricingMode(data.workflowType)) {
    if (data.retailVisaPricing.length === 0) {
      errors.pricingMatrix = 'Add at least one processing visa fees item'
    } else {
      const incomplete = data.retailVisaPricing.some(
        (item) =>
          !item.countryId ||
          !item.visaType.trim() ||
          (item.gltsServices.length === 0 && item.vfsServices.length === 0),
      )
      if (incomplete) {
        errors.pricingMatrix =
          'Each processing visa fees card needs country, visa type, and at least one service'
      }
    }
  } else if (data.commercialVisaPricing.length === 0) {
    errors.pricingMatrix = 'Add at least one processing visa fees entry'
  } else {
    const incomplete = data.commercialVisaPricing.some((entry) => {
      if (entry.serviceFee <= 0) return true
      if (entry.scope === 'country' && !entry.countryId) return true
      if (entry.scope === 'country_group' && !entry.countryGroupId) return true
      return false
    })
    if (incomplete) {
      errors.pricingMatrix = 'Complete all processing visa fees before saving'
    }
  }

  return errors
}

export function validateForShare(record: QuotationRecord): { ok: boolean; issues: string[] } {
  const version = getCurrentVersion(record)
  const issues: string[] = []
  if (
    !version ||
    !hasAnyPricing({
      workflowType: record.workflowType,
      retailVisaPricing: version.retailVisaPricing ?? [],
      commercialVisaPricing: version.commercialVisaPricing ?? [],
    })
  ) {
    issues.push('Add at least one pricing item before sharing')
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
  else if (
    !hasAnyPricing({
      workflowType: record.workflowType,
      retailVisaPricing: version.retailVisaPricing ?? [],
      commercialVisaPricing: version.commercialVisaPricing ?? [],
    }) &&
    version.pricingMatrix.length === 0
  ) {
    issues.push('Selected version must have at least one pricing item')
  }
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
