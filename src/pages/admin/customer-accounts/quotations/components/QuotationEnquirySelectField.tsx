import { FormField, Select } from '@/design-system/UIComponents'
import { enquiryReferenceService } from '@/shared/services/enquiryReferenceService'

interface QuotationEnquirySelectFieldProps {
  enquiryId?: string
  onSelectEnquiry: (enquiryId: string) => void
  onClearEnquiry: () => void
}

export function QuotationEnquirySelectField({
  enquiryId,
  onSelectEnquiry,
  onClearEnquiry,
}: QuotationEnquirySelectFieldProps) {
  const enquiryOptions = enquiryReferenceService.getSelectOptions()

  return (
    <FormField
      label="Reference Enquiry"
      helperText="Optional. Select an enquiry to auto-fill customer details and show visa requirements."
    >
      <Select
        value={enquiryId ?? ''}
        onChange={(v) => {
          const id = String(v)
          if (!id) onClearEnquiry()
          else onSelectEnquiry(id)
        }}
        options={[
          { value: '', label: 'None — enter all details manually' },
          ...enquiryOptions,
        ]}
        placeholder="Select reference enquiry"
        fullWidth
      />
    </FormField>
  )
}
