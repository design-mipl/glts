import type { QuotationFormData, QuotationRecord } from '@/shared/types/quotation'
import { getCurrentVersion } from '@/shared/utils/quotationValidation'
import { hydrateStructuredPricingFromMatrix } from '@/shared/utils/quotationPricingUtils'
import { QuotationPricingSection } from '../pricing/QuotationPricingSection'

export function CurrentPricingTab({ quotation }: { quotation: QuotationRecord }) {
  const version = getCurrentVersion(quotation)
  if (!version) return null

  const hasStructured =
    (version.retailVisaPricing?.length ?? 0) > 0 ||
    (version.commercialVisaPricing?.length ?? 0) > 0 ||
    (version.miscellaneousServices?.length ?? 0) > 0

  const structured = hasStructured
    ? {
        retailVisaPricing: version.retailVisaPricing ?? [],
        commercialVisaPricing: version.commercialVisaPricing ?? [],
        miscellaneousServices: version.miscellaneousServices ?? [],
      }
    : hydrateStructuredPricingFromMatrix(version.pricingMatrix, quotation.workflowType)

  const formData: QuotationFormData = {
    sourceType: quotation.sourceType,
    enquiryId: quotation.enquiryId,
    workflowType: quotation.workflowType,
    customer: quotation.customer,
    quotationDate: quotation.quotationDate,
    validTill: quotation.validTill,
    notes: quotation.notes,
    gstRateId: quotation.gstRateId,
    gstPercentage: quotation.gstPercentage,
    pricingMatrix: version.pricingMatrix,
    ...structured,
  }

  return <QuotationPricingSection formData={formData} onChange={() => {}} readOnly />
}
