import { FormField, Input } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { agreementFieldError } from './agreementFormLayout'

interface AgreementFinanceContactFieldsProps {
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
  errors?: Record<string, string>
  onClearError?: (field: string) => void
}

export function AgreementFinanceContactFields({
  data,
  onChange,
  errors = {},
  onClearError,
}: AgreementFinanceContactFieldsProps) {
  const update = (patch: Partial<CommercialAgreementFormData['financeContacts']>, errorKey?: string) => {
    onChange({ ...data, financeContacts: { ...data.financeContacts, ...patch } })
    if (errorKey) onClearError?.(errorKey)
  }

  return (
    <>
      <FormField label="Accounts SPOC name" required {...agreementFieldError(errors, 'accountsSpocName')}>
        <Input
          value={data.financeContacts.accountsSpocName}
          onChange={(v) => update({ accountsSpocName: v }, 'accountsSpocName')}
          placeholder="Enter accounts SPOC name"
          fullWidth
        />
      </FormField>
      <FormField label="Accounts team email" required {...agreementFieldError(errors, 'accountsTeamEmail')}>
        <Input
          value={data.financeContacts.accountsTeamEmail}
          onChange={(v) => update({ accountsTeamEmail: v }, 'accountsTeamEmail')}
          placeholder="Enter accounts team email"
          fullWidth
        />
      </FormField>
      <FormField label="Accounts contact number" required {...agreementFieldError(errors, 'accountsContactNumber')}>
        <Input
          value={data.financeContacts.accountsContactNumber}
          onChange={(v) => update({ accountsContactNumber: v }, 'accountsContactNumber')}
          placeholder="Enter accounts contact number"
          fullWidth
        />
      </FormField>
      <FormField label="Invoice submission email" required {...agreementFieldError(errors, 'invoiceSubmissionEmail')}>
        <Input
          value={data.financeContacts.invoiceSubmissionEmail}
          onChange={(v) => update({ invoiceSubmissionEmail: v }, 'invoiceSubmissionEmail')}
          placeholder="Enter invoice submission email"
          fullWidth
        />
      </FormField>
      <AdminFullPageFormFieldSpan>
        <FormField label="Payment follow-up contact" required {...agreementFieldError(errors, 'paymentFollowUpContact')}>
          <Input
            value={data.financeContacts.paymentFollowUpContact}
            onChange={(v) => update({ paymentFollowUpContact: v }, 'paymentFollowUpContact')}
            placeholder="Enter payment follow-up contact"
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
    </>
  )
}
