import { Typography } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { EmptyState, FormField, Input, Select } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import { billingTypeLabel, workflowTypeLabel } from '../../agreements/config/agreementStatusConfig'

interface CorporateAccountAgreementSelectStepProps {
  data: CorporateAccountFormData
  onChange: (next: CorporateAccountFormData) => void
  onSelectAgreement: (agreementId: string) => void
  variant?: 'selection' | 'summary'
}

export function CorporateAccountAgreementSelectStep({
  data,
  onChange,
  onSelectAgreement,
  variant = 'selection',
}: CorporateAccountAgreementSelectStepProps) {
  const navigate = useNavigate()
  const approved = commercialAgreementService.listApprovedForOnboarding()
  const selected = data.agreementId ? commercialAgreementService.getById(data.agreementId) : undefined

  if (variant === 'summary') {
    if (!selected) {
      return (
        <Typography variant="body2" color="text.secondary">
          Select an approved agreement to view commercial terms and assign a branch.
        </Typography>
      )
    }

    return (
      <>
        <FormField label="Company">
          <Input value={selected.companyName} disabled fullWidth />
        </FormField>
        <FormField label="Workflow type">
          <Input value={workflowTypeLabel[selected.workflowType]} disabled fullWidth />
        </FormField>
        <FormField label="Billing type">
          <Input value={billingTypeLabel[selected.billingType]} disabled fullWidth />
        </FormField>
        <AdminFullPageFormFieldSpan>
          <FormField label="Branch">
            <Input value={data.branch} onChange={(v) => onChange({ ...data, branch: v })} placeholder="Assigned branch" fullWidth />
          </FormField>
        </AdminFullPageFormFieldSpan>
      </>
    )
  }

  if (approved.length === 0) {
    return (
      <EmptyState
        variant="no-data"
        title="No approved agreements available"
        description="Approve a commercial agreement before creating a corporate account."
        action={{
          label: 'Go to agreements',
          onClick: () => navigate('/admin/customer-accounts/agreements'),
        }}
      />
    )
  }

  return (
    <AdminFullPageFormFieldSpan>
      <FormField label="Approved agreement company" required>
        <Select
          value={data.agreementId}
          onChange={(v) => onSelectAgreement(String(v))}
          options={[
            { value: '', label: 'Select approved agreement…' },
            ...approved.map((a) => ({
              value: a.id,
              label: `${a.companyName} · ${a.agreementId}`,
            })),
          ]}
          fullWidth
        />
      </FormField>
    </AdminFullPageFormFieldSpan>
  )
}
