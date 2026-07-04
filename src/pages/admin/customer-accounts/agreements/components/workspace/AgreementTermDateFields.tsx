import { FormField, Input } from '@/design-system/UIComponents'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { agreementFieldError } from '../agreementFormLayout'

interface AgreementTermDateFieldsProps {
  data: CommercialAgreementFormData
  errors?: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  onClearError?: (field: string) => void
}

export function AgreementTermDateFields({
  data,
  errors = {},
  onChange,
  onClearError,
}: AgreementTermDateFieldsProps) {
  const clear = (field: string) => onClearError?.(field)

  return (
    <>
      <FormField label="Agreement start date" required {...agreementFieldError(errors, 'startDate')}>
        <Input
          type="date"
          value={data.startDate}
          onChange={(startDate) => {
            onChange({ ...data, startDate })
            clear('startDate')
            if (data.endDate && startDate && data.endDate < startDate) {
              clear('endDate')
            }
          }}
          placeholder="Select start date"
          fullWidth
        />
      </FormField>
      <FormField label="Agreement expiry date" required {...agreementFieldError(errors, 'endDate')}>
        <Input
          type="date"
          value={data.endDate}
          onChange={(endDate) => {
            onChange({ ...data, endDate })
            clear('endDate')
          }}
          placeholder="Select agreement expiry date"
          fullWidth
        />
      </FormField>
    </>
  )
}
