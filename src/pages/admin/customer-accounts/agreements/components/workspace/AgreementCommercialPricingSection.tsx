import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import type { QuotationFormData } from '@/shared/types/quotation'
import { QuotationPricingSection } from '@/pages/admin/customer-accounts/quotations/components/pricing/QuotationPricingSection'
import { QuotationPricingTemplateControls } from '@/pages/admin/customer-accounts/quotations/components/pricing/QuotationPricingTemplateControls'

interface AgreementCommercialPricingSectionProps {
  data: CommercialAgreementFormData
  errors: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  readOnly?: boolean
  /** When true, templates render inside this section (detail). Workspace uses header actions instead. */
  showTemplateControls?: boolean
}

function toQuotationSlice(data: CommercialAgreementFormData): QuotationFormData {
  return {
    sourceType: 'direct',
    enquiryId: undefined,
    workflowType: data.workflowType === 'retail' ? 'corporate' : data.workflowType,
    customer: {
      companyName: data.company.companyName,
      contactPersonName: data.company.contactPersonName,
      contactNumber: data.company.contactNumber,
      emailAddress: data.company.emailAddress,
      companyAddress: data.company.companyAddress,
    },
    quotationDate: data.startDate,
    validTill: data.endDate,
    notes: '',
    gstRateId: '',
    gstPercentage: data.billingConfig.gstPercentage,
    pricingMatrix: data.pricingMatrix,
    retailVisaPricing: [],
    commercialVisaPricing: data.commercialVisaPricing ?? [],
    miscellaneousServices: data.miscellaneousServices ?? [],
  }
}

function applyPricingPartial(
  data: CommercialAgreementFormData,
  partial: Partial<QuotationFormData>,
): CommercialAgreementFormData {
  return {
    ...data,
    ...(partial.commercialVisaPricing !== undefined
      ? { commercialVisaPricing: partial.commercialVisaPricing }
      : {}),
    ...(partial.miscellaneousServices !== undefined
      ? { miscellaneousServices: partial.miscellaneousServices }
      : {}),
  }
}

export function AgreementCommercialPricingSection({
  data,
  errors,
  onChange,
  readOnly = false,
  showTemplateControls = false,
}: AgreementCommercialPricingSectionProps) {
  const slice = toQuotationSlice(data)

  return (
    <>
      {showTemplateControls ? (
        <QuotationPricingTemplateControls
          formData={slice}
          onChange={(partial) => onChange(applyPricingPartial(data, partial))}
          readOnly={readOnly}
        />
      ) : null}
      <QuotationPricingSection
        formData={slice}
        onChange={(partial) => onChange(applyPricingPartial(data, partial))}
        error={errors.pricingMatrix}
        readOnly={readOnly}
      />
    </>
  )
}

/** Header actions for agreement workspace pricing step. */
export function AgreementPricingHeaderActions({
  data,
  onChange,
  readOnly,
}: {
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
  readOnly?: boolean
}) {
  return (
    <QuotationPricingTemplateControls
      formData={toQuotationSlice(data)}
      onChange={(partial) => onChange(applyPricingPartial(data, partial))}
      readOnly={readOnly}
    />
  )
}
