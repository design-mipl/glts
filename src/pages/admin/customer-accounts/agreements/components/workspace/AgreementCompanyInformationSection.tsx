import { FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { companyMasterService } from '@/shared/services/companyMasterService'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { AGREEMENT_WORKFLOW_OPTIONS } from '../../config/agreementStatusConfig'
import { agreementFieldError } from '../agreementFormLayout'

interface AgreementCompanyInformationSectionProps {
  data: CommercialAgreementFormData
  errors: Record<string, string>
  onChange: (next: CommercialAgreementFormData) => void
  onClearError: (field: string) => void
}

const COMPANY_TYPE_OPTIONS = [
  { value: 'private_limited', label: 'Private Limited' },
  { value: 'public_limited', label: 'Public Limited' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
  { value: 'other', label: 'Other' },
]

export function AgreementCompanyInformationSection({
  data,
  errors,
  onChange,
  onClearError,
}: AgreementCompanyInformationSectionProps) {
  const parentCompanyOptions = companyMasterService.getSelectOptions()

  const updateCompany = (patch: Partial<CommercialAgreementFormData['company']>) => {
    onChange({ ...data, company: { ...data.company, ...patch } })
  }

  const showFullForm =
    data.customerSourceMode === 'new' ||
    data.customerSourceMode === 'quotation' ||
    Boolean(data.company.companyName)

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
        gap: 16,
      }}
    >
      <AdminFullPageFormFieldSpan>
        <FormField label="Parent company">
          <Select
            value={data.parentCompanyId}
            onChange={(v) => onChange({ ...data, parentCompanyId: String(v) })}
            options={[
              { value: '', label: 'No parent company' },
              ...parentCompanyOptions.map((c) => ({ value: c.value, label: c.label })),
            ]}
            placeholder="Select parent company (optional)"
            fullWidth
            clearable
          />
        </FormField>
      </AdminFullPageFormFieldSpan>

      <FormField label="Workflow type" required>
        <Select
          value={data.workflowType}
          onChange={(v) => onChange({ ...data, workflowType: v as CommercialAgreementFormData['workflowType'] })}
          options={AGREEMENT_WORKFLOW_OPTIONS}
          placeholder="Select workflow type"
          fullWidth
        />
      </FormField>

      {showFullForm ? (
        <>
          <FormField label="Company name" required {...agreementFieldError(errors, 'companyName')}>
            <Input
              value={data.company.companyName}
              onChange={(v) => {
                updateCompany({ companyName: v })
                onClearError('companyName')
              }}
              placeholder="Enter company name"
              fullWidth
            />
          </FormField>
          <FormField label="Company type" required {...agreementFieldError(errors, 'companyType')}>
            <Select
              value={data.company.companyType}
              onChange={(v) => {
                updateCompany({ companyType: String(v) })
                onClearError('companyType')
              }}
              options={COMPANY_TYPE_OPTIONS}
              placeholder="Select company type"
              fullWidth
            />
          </FormField>
          <FormField label="Industry type" required {...agreementFieldError(errors, 'industryType')}>
            <Input
              value={data.company.industryType}
              onChange={(v) => {
                updateCompany({ industryType: v })
                onClearError('industryType')
              }}
              placeholder="Enter industry type"
              fullWidth
            />
          </FormField>
          <FormField label="Contact person" required {...agreementFieldError(errors, 'contactPerson')}>
            <Input
              value={data.company.contactPersonName}
              onChange={(v) => {
                updateCompany({ contactPersonName: v })
                onClearError('contactPerson')
              }}
              placeholder="Enter contact person name"
              fullWidth
            />
          </FormField>
          <FormField label="Contact number" required {...agreementFieldError(errors, 'contactNumber')}>
            <Input
              value={data.company.contactNumber}
              onChange={(v) => {
                updateCompany({ contactNumber: v })
                onClearError('contactNumber')
              }}
              placeholder="Enter contact number"
              fullWidth
            />
          </FormField>
          <FormField label="Email address" required {...agreementFieldError(errors, 'emailAddress')}>
            <Input
              value={data.company.emailAddress}
              onChange={(v) => {
                updateCompany({ emailAddress: v })
                onClearError('emailAddress')
              }}
              placeholder="Enter email address"
              fullWidth
            />
          </FormField>
          <AdminFullPageFormFieldSpan>
            <FormField label="Company address" required {...agreementFieldError(errors, 'companyAddress')}>
              <Textarea
                value={data.company.companyAddress}
                onChange={(v) => {
                  updateCompany({ companyAddress: v })
                  onClearError('companyAddress')
                }}
                placeholder="Enter company address"
                fullWidth
                rows={2}
              />
            </FormField>
          </AdminFullPageFormFieldSpan>
          <FormField label="GST number">
            <Input
              value={data.company.gstNumber}
              onChange={(v) => updateCompany({ gstNumber: v })}
              placeholder="Enter GST number"
              fullWidth
            />
          </FormField>
          <FormField label="PAN number">
            <Input
              value={data.company.panNumber}
              onChange={(v) => updateCompany({ panNumber: v })}
              placeholder="Enter PAN number"
              fullWidth
            />
          </FormField>
        </>
      ) : null}
    </div>
  )
}
