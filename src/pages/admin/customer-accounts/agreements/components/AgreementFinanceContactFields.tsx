import { FormField, Input } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'

interface AgreementFinanceContactFieldsProps {
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
}

export function AgreementFinanceContactFields({ data, onChange }: AgreementFinanceContactFieldsProps) {
  const update = (patch: Partial<CommercialAgreementFormData['financeContacts']>) => {
    onChange({ ...data, financeContacts: { ...data.financeContacts, ...patch } })
  }

  return (
    <>
      <FormField label="Accounts SPOC name" required>
        <Input value={data.financeContacts.accountsSpocName} onChange={(v) => update({ accountsSpocName: v })} fullWidth />
      </FormField>
      <FormField label="Accounts team email" required>
        <Input value={data.financeContacts.accountsTeamEmail} onChange={(v) => update({ accountsTeamEmail: v })} fullWidth />
      </FormField>
      <FormField label="Accounts contact number">
        <Input value={data.financeContacts.accountsContactNumber} onChange={(v) => update({ accountsContactNumber: v })} fullWidth />
      </FormField>
      <FormField label="Invoice submission email">
        <Input value={data.financeContacts.invoiceSubmissionEmail} onChange={(v) => update({ invoiceSubmissionEmail: v })} fullWidth />
      </FormField>
      <AdminFullPageFormFieldSpan>
        <FormField label="Payment follow-up contact">
          <Input value={data.financeContacts.paymentFollowUpContact} onChange={(v) => update({ paymentFollowUpContact: v })} fullWidth />
        </FormField>
      </AdminFullPageFormFieldSpan>
    </>
  )
}
