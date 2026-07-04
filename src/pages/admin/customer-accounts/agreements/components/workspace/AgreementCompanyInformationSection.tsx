import { Stack } from '@mui/material'
import { useMemo } from 'react'
import { FormField, FormSection, Input, Select, Textarea } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { isIndianAddressCountry } from '@/shared/data/indianAddressLocations'
import { AGREEMENT_WORKFLOW_OPTIONS } from '../../config/agreementStatusConfig'
import { getCompanyAddressCountryOptions, getCompanyCityOptions, getCompanyStateOptions } from '../../utils/agreementMasterOptions'
import { agreementFieldError } from '../agreementFormLayout'
import { AgreementTermDateFields } from './AgreementTermDateFields'

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
  const updateCompany = (patch: Partial<CommercialAgreementFormData['company']>) => {
    onChange({ ...data, company: { ...data.company, ...patch } })
  }

  const countryOptions = getCompanyAddressCountryOptions()
  const stateOptions = useMemo(
    () => getCompanyStateOptions(data.company.country),
    [data.company.country],
  )
  const cityOptions = useMemo(
    () => getCompanyCityOptions(data.company.country, data.company.state),
    [data.company.country, data.company.state],
  )
  const addressDropdownsEnabled = isIndianAddressCountry(data.company.country)

  const showFullForm =
    data.customerSourceMode === 'new' ||
    data.customerSourceMode === 'quotation' ||
    Boolean(data.company.companyName)

  return (
    <Stack spacing={0}>
      <FormSection title="Agreement details" columns={2} divider sx={{ mb: 3 }}>
        <FormField label="Workflow type" required>
          <Select
            value={data.workflowType}
            onChange={(v) =>
              onChange(
                commercialAgreementService.syncDocumentsForWorkflow(
                  data,
                  v as CommercialAgreementFormData['workflowType'],
                ),
              )
            }
            options={AGREEMENT_WORKFLOW_OPTIONS}
            placeholder="Select workflow type"
            fullWidth
          />
        </FormField>

        {showFullForm ? (
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
        ) : null}

        <AgreementTermDateFields
          data={data}
          errors={errors}
          onChange={onChange}
          onClearError={onClearError}
        />
      </FormSection>

      {showFullForm ? (
        <>
          <FormSection title="Company details" columns={2} divider sx={{ mb: 3 }}>
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
            <AdminFullPageFormFieldSpan>
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
            </AdminFullPageFormFieldSpan>
          </FormSection>

          <FormSection title="Registered address" columns={2} sx={{ mb: 0 }}>
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
            <FormField label="Country">
              <Select
                value={data.company.country}
                onChange={(v) => {
                  const country = String(v)
                  const option = countryOptions.find((c) => c.value === country)
                  updateCompany({
                    countryId: country,
                    country: option?.countryName ?? country,
                    state: '',
                    city: '',
                  })
                }}
                options={countryOptions.map((c) => ({ value: c.value, label: c.label }))}
                placeholder="Select country"
                clearable
                fullWidth
              />
            </FormField>
            <FormField
              label="State"
              helperText={!data.company.country ? 'Select a country first' : undefined}
            >
              <Select
                value={data.company.state}
                onChange={(v) => {
                  const state = String(v)
                  const nextCity = getCompanyCityOptions(data.company.country, state).some(
                    (option) => option.value === data.company.city,
                  )
                    ? data.company.city
                    : ''
                  updateCompany({ state, city: nextCity })
                }}
                options={stateOptions}
                placeholder="Select state"
                clearable
                fullWidth
                disabled={!addressDropdownsEnabled}
              />
            </FormField>
            <FormField
              label="City"
              helperText={!data.company.state ? 'Select a state first' : undefined}
            >
              <Select
                value={data.company.city}
                onChange={(v) => updateCompany({ city: String(v) })}
                options={cityOptions}
                placeholder="Select city"
                clearable
                fullWidth
                disabled={!addressDropdownsEnabled || !data.company.state}
              />
            </FormField>
            <FormField label="Pincode">
              <Input
                value={data.company.pincode}
                onChange={(v) => updateCompany({ pincode: v })}
                placeholder="Enter pincode"
                fullWidth
              />
            </FormField>
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
          </FormSection>
        </>
      ) : null}
    </Stack>
  )
}
