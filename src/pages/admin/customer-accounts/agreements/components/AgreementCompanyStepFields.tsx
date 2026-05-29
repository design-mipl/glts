import { Stack, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material'
import { FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { companyMasterService } from '@/shared/services/companyMasterService'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'

interface AgreementCompanyStepFieldsProps {
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
  onSelectExisting: (companyId: string) => void
  variant?: 'selection' | 'billing'
}

export function AgreementCompanyStepFields({
  data,
  onChange,
  onSelectExisting,
  variant = 'selection',
}: AgreementCompanyStepFieldsProps) {
  const companyOptions = companyMasterService.getSelectOptions()

  const updateCompany = (patch: Partial<CommercialAgreementFormData['company']>) => {
    onChange({ ...data, company: { ...data.company, ...patch } })
  }

  if (variant === 'billing') {
    if (data.companyMode === 'existing') {
      return (
        <Typography variant="body2" color="text.secondary">
          Billing and tax identifiers are inherited from the selected company record.
        </Typography>
      )
    }

    return (
      <>
        <FormField label="Billing entity details">
          <Input value={data.company.billingEntityName} onChange={(v) => updateCompany({ billingEntityName: v })} fullWidth />
        </FormField>
        <FormField label="Billing address">
          <Input value={data.company.billingAddress} onChange={(v) => updateCompany({ billingAddress: v })} fullWidth />
        </FormField>
        <FormField label="GST number">
          <Input value={data.company.gstNumber} onChange={(v) => updateCompany({ gstNumber: v })} fullWidth />
        </FormField>
        <FormField label="PAN number">
          <Input value={data.company.panNumber} onChange={(v) => updateCompany({ panNumber: v })} fullWidth />
        </FormField>
      </>
    )
  }

  return (
    <Stack spacing={2}>
      <Stack spacing={1}>
        <Typography variant="body2" fontWeight={600}>
          Company selection
        </Typography>
        <ToggleButtonGroup
          exclusive
          size="small"
          value={data.companyMode}
          onChange={(_, value) => {
            if (value) onChange({ ...data, companyMode: value as 'existing' | 'new' })
          }}
        >
          <ToggleButton value="existing">Select existing company</ToggleButton>
          <ToggleButton value="new">Add new company</ToggleButton>
        </ToggleButtonGroup>
      </Stack>

      {data.companyMode === 'existing' ? (
        <AdminFullPageFormFieldSpan>
          <FormField label="Search company" required>
            <Select
              value={data.existingCompanyId}
              onChange={(v) => {
                const id = String(v)
                onChange({ ...data, existingCompanyId: id })
                onSelectExisting(id)
              }}
              options={[
                { value: '', label: 'Select by name, GST, or company ID…' },
                ...companyOptions.map((c) => ({
                  value: c.value,
                  label: `${c.label}${c.gstNumber ? ` · GST ${c.gstNumber}` : ''}`,
                })),
              ]}
              fullWidth
            />
          </FormField>
        </AdminFullPageFormFieldSpan>
      ) : (
        <>
          <FormField label="Company name" required>
            <Input value={data.company.companyName} onChange={(v) => updateCompany({ companyName: v })} fullWidth />
          </FormField>
          <FormField label="Company type">
            <Select
              value={data.company.companyType}
              onChange={(v) => updateCompany({ companyType: String(v) })}
              options={[
                { value: 'private_limited', label: 'Private Limited' },
                { value: 'public_limited', label: 'Public Limited' },
                { value: 'partnership', label: 'Partnership' },
                { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
                { value: 'other', label: 'Other' },
              ]}
              fullWidth
            />
          </FormField>
          <FormField label="Industry type">
            <Input value={data.company.industryType} onChange={(v) => updateCompany({ industryType: v })} fullWidth />
          </FormField>
          <FormField label="Contact person" required>
            <Input value={data.company.contactPersonName} onChange={(v) => updateCompany({ contactPersonName: v })} fullWidth />
          </FormField>
          <FormField label="Contact number">
            <Input value={data.company.contactNumber} onChange={(v) => updateCompany({ contactNumber: v })} fullWidth />
          </FormField>
          <FormField label="Email address" required>
            <Input value={data.company.emailAddress} onChange={(v) => updateCompany({ emailAddress: v })} fullWidth />
          </FormField>
          <AdminFullPageFormFieldSpan>
            <FormField label="Company address">
              <Textarea value={data.company.companyAddress} onChange={(v) => updateCompany({ companyAddress: v })} minRows={2} fullWidth />
            </FormField>
          </AdminFullPageFormFieldSpan>
        </>
      )}
    </Stack>
  )
}
