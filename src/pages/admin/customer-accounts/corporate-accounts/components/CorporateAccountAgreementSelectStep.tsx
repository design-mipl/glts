import { Box, Typography } from '@mui/material'
import { FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, FormField, Input, Select } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import { agreementEmbeddedTableSx } from '../../agreements/components/agreementFormLayout'
import { billingTypeLabel, workflowTypeLabel } from '../../agreements/config/agreementStatusConfig'

interface CorporateAccountAgreementSelectStepProps {
  data: CorporateAccountFormData
  onChange: (next: CorporateAccountFormData) => void
  onSelectAgreement: (agreementId: string) => void
  variant?: 'selection' | 'summary'
}

function CommercialSummaryPlaceholder() {
  return (
    <Box sx={{ ...agreementEmbeddedTableSx, width: '100%', gridColumn: '1 / -1' }}>
      <Box sx={{ py: 3, px: 3, textAlign: 'center' }}>
        <Box sx={{ color: 'text.disabled', mb: 1, display: 'flex', justifyContent: 'center' }}>
          <FileText size={32} strokeWidth={1.5} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', fontSize: 13 }}>
          Select an approved agreement above to view commercial terms and assign a branch.
        </Typography>
      </Box>
    </Box>
  )
}
function NoApprovedAgreementsState({ onGoToAgreements }: { onGoToAgreements: () => void }) {
  return (
    <Box sx={{ ...agreementEmbeddedTableSx, width: '100%' }}>
      <Box sx={{ py: 4, px: 3, textAlign: 'center' }}>
        <Box sx={{ color: 'text.disabled', mb: 1.5, display: 'flex', justifyContent: 'center' }}>
          <FileText size={40} strokeWidth={1.5} />
        </Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.75 }}>
          No approved agreements available
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, maxWidth: 420, mx: 'auto', fontSize: 13 }}
        >
          Approve a commercial agreement before creating a corporate account. Draft or submitted agreements must be
          approved from Agreements & contracts first.
        </Typography>
        <Button label="Go to agreements" size="sm" onClick={onGoToAgreements} />
      </Box>
    </Box>
  )
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
      return <CommercialSummaryPlaceholder />
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
      <NoApprovedAgreementsState onGoToAgreements={() => navigate('/admin/customer-accounts/agreements')} />
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
