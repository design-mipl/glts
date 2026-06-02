import { Box, Stack } from '@mui/material'
import { FormField, RadioGroup, Select } from '@/design-system/UIComponents'
import { quotationReferenceService } from '@/shared/services/quotationReferenceService'
import { companyMasterService } from '@/shared/services/companyMasterService'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { agreementFieldError } from '../agreementFormLayout'

interface AgreementCustomerSourceSectionProps {
  data: CommercialAgreementFormData
  errors: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  onSelectQuotation: (quotationId: string) => void
  onSelectExisting: (companyId: string) => void
  onClearError: (field: string) => void
}

export function AgreementCustomerSourceSection({
  data,
  errors,
  onChange,
  onSelectQuotation,
  onSelectExisting,
  onClearError,
}: AgreementCustomerSourceSectionProps) {
  const quotationOptions = quotationReferenceService.getSelectOptions()
  const companyOptions = companyMasterService.getSelectOptions()

  return (
    <Stack spacing={3}>
      <RadioGroup
        value={data.customerSourceMode}
        onChange={(value) => {
          onChange({
            ...data,
            customerSourceMode: value as CommercialAgreementFormData['customerSourceMode'],
            referenceQuotationId: '',
            existingCompanyId: '',
          })
        }}
        orientation="vertical"
        options={[
          { label: 'From reference quotation', value: 'quotation' },
          { label: 'Existing customer', value: 'existing' },
          { label: 'Add new customer', value: 'new' },
        ]}
      />

      {data.customerSourceMode === 'quotation' || data.customerSourceMode === 'existing' ? (
        <Box sx={{ maxWidth: 560 }}>
          {data.customerSourceMode === 'quotation' ? (
            <FormField label="Reference quotation" required {...agreementFieldError(errors, 'referenceQuotationId')}>
              <Select
                value={data.referenceQuotationId}
                onChange={(v) => {
                  const id = String(v)
                  onChange({ ...data, referenceQuotationId: id })
                  onClearError('referenceQuotationId')
                  if (id) onSelectQuotation(id)
                }}
                options={[
                  { value: '', label: 'Select reference quotation' },
                  ...quotationOptions.map((q) => ({
                    value: q.value,
                    label: `${q.quotationId} · ${q.label}${q.gstNumber ? ` · GST ${q.gstNumber}` : ''}`,
                  })),
                ]}
                placeholder="Select reference quotation"
                fullWidth
              />
            </FormField>
          ) : null}

          {data.customerSourceMode === 'existing' ? (
            <FormField label="Existing customer" required {...agreementFieldError(errors, 'existingCompanyId')}>
              <Select
                value={data.existingCompanyId}
                onChange={(v) => {
                  const id = String(v)
                  onChange({ ...data, existingCompanyId: id })
                  onClearError('existingCompanyId')
                  if (id) onSelectExisting(id)
                }}
                options={[
                  { value: '', label: 'Select existing customer' },
                  ...companyOptions.map((c) => ({
                    value: c.value,
                    label: `${c.label}${c.gstNumber ? ` · GST ${c.gstNumber}` : ''} · ${c.value}`,
                  })),
                ]}
                placeholder="Select existing customer"
                fullWidth
              />
            </FormField>
          ) : null}
        </Box>
      ) : null}
    </Stack>
  )
}
