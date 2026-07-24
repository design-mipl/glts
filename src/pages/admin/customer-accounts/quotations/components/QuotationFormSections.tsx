import type { Dispatch, SetStateAction } from 'react'
import { FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFieldSpan,
  type AdminFullPageFormSection,
} from '@/pages/admin/components/AdminFullPageFormShell'
import { taxMasterService } from '@/shared/services/taxMasterService'
import type { QuotationFormData } from '@/shared/types/quotation'
import { syncQuotationGstFromRateId } from '@/shared/utils/quotationGstUtils'
import { clearIncompatiblePricing } from '@/shared/utils/quotationPricingUtils'
import { quotationCustomerTypeOptions } from '../config/quotationCustomerTypeOptions'
import { QuotationEnquirySelectField } from './QuotationEnquirySelectField'
import { QuotationEnquiryVisaDetailsReadOnly } from './QuotationEnquiryVisaDetailsReadOnly'
import { QuotationPricingSection } from './pricing/QuotationPricingSection'
import { QuotationPricingTemplateControls } from './pricing/QuotationPricingTemplateControls'
import type { EnquiryRecord } from '@/shared/types/enquiry'

export interface QuotationFormSectionsProps {
  formData: QuotationFormData
  setFormData: Dispatch<SetStateAction<QuotationFormData>>
  errors: Record<string, string>
  readOnlyPricing?: boolean
  selectedEnquiry?: EnquiryRecord | null
  onSelectEnquiry?: (enquiryId: string) => void
  onClearEnquiry?: () => void
  showEnquirySelect?: boolean
}

export function buildQuotationFormSections({
  formData,
  setFormData,
  errors,
  readOnlyPricing = false,
  selectedEnquiry = null,
  onSelectEnquiry,
  onClearEnquiry,
  showEnquirySelect = true,
}: QuotationFormSectionsProps): AdminFullPageFormSection[] {
  const patch = (partial: Partial<QuotationFormData>) => {
    setFormData((prev) => ({ ...prev, ...partial }))
  }

  const gstOptions = taxMasterService.listActiveGstOptions()
  const fromEnquiry = Boolean(selectedEnquiry)

  const customerInfoSection: AdminFullPageFormSection = {
    id: 'customer-info',
    title: 'Customer Information',
    columns: 2,
    importance: 'primary',
    children: (
      <>
        {showEnquirySelect ? (
          <AdminFullPageFormFieldSpan>
            <QuotationEnquirySelectField
              enquiryId={formData.enquiryId}
              onSelectEnquiry={(enquiryId) => onSelectEnquiry?.(enquiryId)}
              onClearEnquiry={() => onClearEnquiry?.()}
            />
          </AdminFullPageFormFieldSpan>
        ) : null}
        <FormField
          label="Customer / Company Name"
          required
          error={Boolean(errors.companyName)}
          helperText={errors.companyName}
        >
          <Input
            value={formData.customer.companyName}
            onChange={(v) => patch({ customer: { ...formData.customer, companyName: v } })}
            placeholder="Enter company or customer name"
            fullWidth
          />
        </FormField>
        <FormField label="Customer Type" required>
          <Select
            value={formData.workflowType}
            onChange={(v) => {
              const workflowType = v as QuotationFormData['workflowType']
              setFormData((prev) => clearIncompatiblePricing(workflowType, prev))
            }}
            options={quotationCustomerTypeOptions}
            placeholder="Select customer type"
            fullWidth
          />
        </FormField>
        <FormField
          label="Contact Person Name"
          required
          error={Boolean(errors.contactPersonName)}
          helperText={errors.contactPersonName}
        >
          <Input
            value={formData.customer.contactPersonName}
            onChange={(v) => patch({ customer: { ...formData.customer, contactPersonName: v } })}
            placeholder="Enter contact person name"
            fullWidth
          />
        </FormField>
        <FormField label="Mobile Number" error={Boolean(errors.contactNumber)} helperText={errors.contactNumber}>
          <Input
            value={formData.customer.contactNumber}
            onChange={(v) => patch({ customer: { ...formData.customer, contactNumber: v } })}
            placeholder="Enter mobile number"
            fullWidth
          />
        </FormField>
        <FormField label="Landline Number">
          <Input
            value={formData.customer.alternateContactNumber ?? ''}
            onChange={(v) =>
              patch({ customer: { ...formData.customer, alternateContactNumber: v } })
            }
            placeholder="Enter landline number"
            fullWidth
          />
        </FormField>
        <FormField label="Email Address">
          <Input
            value={formData.customer.emailAddress}
            onChange={(v) => patch({ customer: { ...formData.customer, emailAddress: v } })}
            placeholder="name@company.com"
            fullWidth
          />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <FormField label="Company Address">
            <Textarea
              value={formData.customer.companyAddress}
              onChange={(v) => patch({ customer: { ...formData.customer, companyAddress: v } })}
              placeholder="Street, city, state, postal code"
              minRows={2}
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
      </>
    ),
  }

  const quotationInfoSection: AdminFullPageFormSection = {
    id: 'quotation-info',
    title: 'Quotation Information',
    columns: 2,
    importance: 'secondary',
    children: (
      <>
        <FormField label="Quotation date" required error={Boolean(errors.quotationDate)} helperText={errors.quotationDate}>
          <Input type="date" value={formData.quotationDate} onChange={(v) => patch({ quotationDate: v })} fullWidth />
        </FormField>
        <FormField label="Valid till" required error={Boolean(errors.validTill)} helperText={errors.validTill}>
          <Input type="date" value={formData.validTill} onChange={(v) => patch({ validTill: v })} fullWidth />
        </FormField>
        <FormField label="GST rate" required error={Boolean(errors.gstRateId)} helperText={errors.gstRateId}>
          <Select
            value={formData.gstRateId}
            onChange={(v) => patch(syncQuotationGstFromRateId(String(v)))}
            placeholder="Select GST rate"
            options={gstOptions}
            size="sm"
            fullWidth
          />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <FormField label="Notes">
            <Textarea
              value={formData.notes}
              onChange={(v) => patch({ notes: v })}
              placeholder="Quotation notes"
              rows={3}
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
      </>
    ),
  }

  const pricingSection: AdminFullPageFormSection = {
    id: 'pricing',
    title: 'Pricing',
    span: 2,
    columns: 1,
    importance: 'primary',
    headerAction: (
      <QuotationPricingTemplateControls
        formData={formData}
        onChange={patch}
        readOnly={readOnlyPricing}
      />
    ),
    children: (
      <QuotationPricingSection
        formData={formData}
        onChange={patch}
        error={errors.pricingMatrix}
        readOnly={readOnlyPricing}
      />
    ),
  }

  const sections: AdminFullPageFormSection[] = []

  sections.push(customerInfoSection, quotationInfoSection)

  if (fromEnquiry && selectedEnquiry) {
    sections.push({
      id: 'visa-requirements',
      title: 'Country Visa Requirement Details',
      span: 2,
      columns: 1,
      importance: 'primary',
      children: <QuotationEnquiryVisaDetailsReadOnly enquiry={selectedEnquiry} />,
    })
  }

  sections.push(pricingSection)

  return sections
}
