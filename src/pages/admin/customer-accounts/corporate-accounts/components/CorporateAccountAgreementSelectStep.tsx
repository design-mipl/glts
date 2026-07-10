import { Box, Stack, Typography } from '@mui/material'
import { FileText } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button, FormField, Input, Select } from '@/design-system/UIComponents'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import { agreementEmbeddedTableSx } from '../../agreements/components/agreementFormLayout'
import {
  agreementStatusLabel,
  billingTypeLabel,
} from '../../agreements/config/agreementStatusConfig'
import { CorporateAccountWorkflowConfigFields } from './CorporateAccountWorkflowConfigFields'

interface CorporateAccountAgreementSelectStepProps {
  data: CorporateAccountFormData
  onChange: (next: CorporateAccountFormData) => void
  onSelectAgreement: (agreementId: string) => void
  corporateAccountId?: string
  variant?: 'selection' | 'summary'
}

function buildAgreementSelectOptions(
  readyAgreements: CommercialAgreement[],
  selected?: CommercialAgreement,
): { value: string; label: string }[] {
  const options = readyAgreements.map((a) => ({
    value: a.id,
    label: `${a.companyName} · ${a.agreementId}`,
  }))

  if (selected && !readyAgreements.some((a) => a.id === selected.id)) {
    options.unshift({
      value: selected.id,
      label: `${selected.companyName} · ${selected.agreementId} (${agreementStatusLabel[selected.status]})`,
    })
  }

  return options
}

function CommercialSummaryPlaceholder() {
  return (
    <Box sx={{ ...agreementEmbeddedTableSx, width: '100%', gridColumn: '1 / -1' }}>
      <Box sx={{ py: 3, px: 3, textAlign: 'center' }}>
        <Box sx={{ color: 'text.disabled', mb: 1, display: 'flex', justifyContent: 'center' }}>
          <FileText size={32} strokeWidth={1.5} />
        </Box>
        <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 420, mx: 'auto', fontSize: 13 }}>
          Select an agreement ready for activation above to view commercial terms.
        </Typography>
      </Box>
    </Box>
  )
}

function NoReadyAgreementsState({ onGoToAgreements }: { onGoToAgreements: () => void }) {
  return (
    <Box sx={{ ...agreementEmbeddedTableSx, width: '100%' }}>
      <Box sx={{ py: 4, px: 3, textAlign: 'center' }}>
        <Box sx={{ color: 'text.disabled', mb: 1.5, display: 'flex', justifyContent: 'center' }}>
          <FileText size={40} strokeWidth={1.5} />
        </Box>
        <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 0.75 }}>
          No agreements ready for activation
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mb: 2, maxWidth: 420, mx: 'auto', fontSize: 13 }}
        >
          Mark a commercial agreement ready for activation before creating a corporate account. Draft agreements must be
          completed from Agreements first.
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
  corporateAccountId,
  variant = 'selection',
}: CorporateAccountAgreementSelectStepProps) {
  const navigate = useNavigate()
  const readyAgreements = commercialAgreementService.listReadyForActivationForOnboarding({
    excludeCorporateAccountId: corporateAccountId,
  })
  const selected = data.agreementId ? commercialAgreementService.getById(data.agreementId) : undefined
  const selectOptions = buildAgreementSelectOptions(readyAgreements, selected)

  if (variant === 'summary') {
    if (!selected) {
      return <CommercialSummaryPlaceholder />
    }

    return (
      <>
        <FormField label="Company">
          <Input value={selected.companyName} disabled fullWidth />
        </FormField>
        <FormField label="Billing type">
          <Input value={billingTypeLabel[selected.billingType]} disabled fullWidth />
        </FormField>
      </>
    )
  }

  if (selectOptions.length === 0) {
    return (
      <NoReadyAgreementsState onGoToAgreements={() => navigate('/admin/customer-accounts/agreements')} />
    )
  }

  return (
    <Stack spacing={2}>
      <AdminFullPageFormFieldSpan>
        <FormField label="Agreement company" required>
          <Select
            value={data.agreementId}
            onChange={(v) => onSelectAgreement(String(v))}
            options={selectOptions}
            placeholder="Select agreement ready for activation…"
            fullWidth
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
      <CorporateAccountWorkflowConfigFields data={data} onChange={onChange} />
    </Stack>
  )
}
