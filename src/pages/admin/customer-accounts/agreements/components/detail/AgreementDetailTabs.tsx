import { Stack, Typography } from '@mui/material'
import { Grid } from '@mui/material'
import { Badge } from '@/design-system/UIComponents'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { deriveAdvanceRuleSummary } from '@/shared/utils/commercialAgreementValidation'
import {
  billingTypeColor,
  billingTypeLabel,
  customerSourceModeLabel,
  workflowTypeColor,
  workflowTypeLabel,
} from '../../config/agreementStatusConfig'
import { getSelectedFinanceContactPersons } from '@/shared/utils/agreementFinanceContacts'
import { AgreementBillingConfigSection } from '../workspace/AgreementBillingConfigSection'
import { AgreementOnboardingDocumentsSection } from '../workspace/AgreementOnboardingDocumentsSection'
import { AgreementEntitiesTable } from '../workspace/AgreementEntitiesTable'
import { AgreementPricingMatrixTable } from '../workspace/AgreementPricingMatrixTable'
import { AgreementTaxConfigSection } from '../workspace/AgreementTaxConfigSection'

interface TabProps {
  agreement: CommercialAgreement
}

export function OverviewTab({ agreement }: TabProps) {
  const financeContacts = getSelectedFinanceContactPersons(
    commercialAgreementService.agreementToFormData(agreement),
  )
  return (
    <Stack spacing={3}>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Company
          </Typography>
          <Typography variant="body2" fontWeight={600}>
            {agreement.companyName}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Customer source
          </Typography>
          <Typography variant="body2">{customerSourceModeLabel[agreement.customerSourceMode]}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Workflow
          </Typography>
          <Badge label={workflowTypeLabel[agreement.workflowType]} color={workflowTypeColor[agreement.workflowType]} size="sm" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Billing
          </Typography>
          <Badge label={billingTypeLabel[agreement.billingType]} color={billingTypeColor[agreement.billingType]} size="sm" />
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Entities
          </Typography>
          <Typography variant="body2">{agreement.entities.length}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Credit limit
          </Typography>
          <Typography variant="body2">
            {agreement.billingConfig.creditLimit
              ? `₹${agreement.billingConfig.creditLimit.toLocaleString('en-IN')}`
              : '—'}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Advance rule
          </Typography>
          <Typography variant="body2">
            {deriveAdvanceRuleSummary(agreement.billingType, agreement.billingConfig)}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Finance contacts
          </Typography>
          <Typography variant="body2">{financeContacts.length}</Typography>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function EntitiesTab({ agreement }: TabProps) {
  const formData = commercialAgreementService.agreementToFormData(agreement)
  return (
    <AgreementEntitiesTable
      data={formData}
      errors={{}}
      onChange={() => {}}
      onAddEntity={() => ''}
      onUpdateEntity={() => {}}
      onRemoveEntity={() => {}}
      readOnly
    />
  )
}

export function PricingMatrixTab({ agreement }: TabProps) {
  const formData = commercialAgreementService.agreementToFormData(agreement)
  return <AgreementPricingMatrixTable data={formData} errors={{}} onChange={() => {}} readOnly />
}

export function BillingConfigurationTab({ agreement }: TabProps) {
  const formData = commercialAgreementService.agreementToFormData(agreement)
  return <AgreementBillingConfigSection data={formData} errors={{}} onChange={() => {}} readOnly />
}

export function TaxConfigurationTab({ agreement }: TabProps) {
  const formData = commercialAgreementService.agreementToFormData(agreement)
  return <AgreementTaxConfigSection data={formData} errors={{}} onChange={() => {}} readOnly />
}

export function DocumentsTab({ agreement }: TabProps) {
  const formData = commercialAgreementService.agreementToFormData(agreement)
  return (
    <AgreementOnboardingDocumentsSection
      data={formData}
      errors={{}}
      onChange={() => {}}
      onClearError={() => {}}
      readOnly
    />
  )
}

export function ActivityTab({ agreement }: TabProps) {
  return (
    <Stack spacing={1.5}>
      {agreement.activities.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          No activity recorded yet.
        </Typography>
      ) : (
        agreement.activities.map((act) => (
          <Stack key={act.id} spacing={0.25}>
            <Typography variant="body2" fontWeight={600}>
              {act.action}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {act.detail} · {new Date(act.timestamp).toLocaleString()} · {act.actor}
            </Typography>
          </Stack>
        ))
      )}
    </Stack>
  )
}
