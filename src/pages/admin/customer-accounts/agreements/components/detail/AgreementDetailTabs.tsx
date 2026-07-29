import type { ReactNode } from 'react'
import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { deriveAdvanceRuleSummary } from '@/shared/utils/commercialAgreementValidation'
import { formatAgreementDate } from '../../utils/agreementFormUtils'
import {
  agreementTypeLabel,
  billingTypeLabel,
  customerSourceModeLabel,
  workflowTypeLabel,
} from '../../config/agreementStatusConfig'
import { getSelectedFinanceContactPersons } from '@/shared/utils/agreementFinanceContacts'
import { AgreementBillingConfigSection } from '../workspace/AgreementBillingConfigSection'
import { AgreementOnboardingDocumentsSection } from '../workspace/AgreementOnboardingDocumentsSection'
import { AgreementEntitiesTable } from '../workspace/AgreementEntitiesTable'
import { AgreementCommercialPricingSection } from '../workspace/AgreementCommercialPricingSection'
import { AgreementTaxConfigSection } from '../workspace/AgreementTaxConfigSection'

interface TabProps {
  agreement: CommercialAgreement
}

function OverviewField({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack spacing={0.35}>
      <Typography variant="caption" color="text.secondary">
        {label}
      </Typography>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography variant="body2" color="text.primary" sx={{ wordBreak: 'break-word' }}>
          {value || '—'}
        </Typography>
      ) : (
        value
      )}
    </Stack>
  )
}

function OverviewSection({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', mb: 1.25, letterSpacing: '0.02em' }}
      >
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export function OverviewTab({ agreement }: TabProps) {
  const formData = commercialAgreementService.agreementToFormData(agreement)
  const financeContacts = getSelectedFinanceContactPersons(formData)
  const primaryFinanceContact = financeContacts[0]

  const contactPerson =
    formData.company.contactPersonName.trim() ||
    agreement.financeContacts.accountsSpocName.trim() ||
    primaryFinanceContact?.contactPerson ||
    '—'
  const contactEmail =
    formData.company.emailAddress.trim() ||
    agreement.financeContacts.accountsTeamEmail.trim() ||
    primaryFinanceContact?.email ||
    '—'
  const contactPhone =
    formData.company.contactNumber.trim() ||
    agreement.financeContacts.accountsContactNumber.trim() ||
    primaryFinanceContact?.phone ||
    '—'

  return (
    <Stack spacing={2.5} divider={<Divider />}>
      <OverviewSection title="Company & contact">
        <Grid container spacing={1.75}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField label="Company" value={agreement.companyName} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField label="Customer source" value={customerSourceModeLabel[agreement.customerSourceMode]} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField label="Contact person" value={contactPerson} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField label="Contact email" value={contactEmail} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField label="Contact phone" value={contactPhone} />
          </Grid>
        </Grid>
      </OverviewSection>

      <OverviewSection title="Agreement & billing">
        <Grid container spacing={1.75}>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField label="Workflow" value={workflowTypeLabel[agreement.workflowType]} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField label="Billing type" value={billingTypeLabel[agreement.billingType]} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField label="Agreement type" value={agreementTypeLabel[agreement.agreementType]} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField label="Start date" value={formatAgreementDate(agreement.startDate)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField label="Expiry date" value={formatAgreementDate(agreement.endDate)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField label="Entities" value={String(agreement.entities.length)} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 4 }}>
            <OverviewField
              label="Credit limit"
              value={
                agreement.billingConfig.creditLimit
                  ? `₹${agreement.billingConfig.creditLimit.toLocaleString('en-IN')}`
                  : '—'
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 8 }}>
            <OverviewField
              label="Advance rule"
              value={deriveAdvanceRuleSummary(agreement.billingType, agreement.billingConfig)}
            />
          </Grid>
        </Grid>
      </OverviewSection>
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
  return (
    <AgreementCommercialPricingSection
      data={formData}
      errors={{}}
      onChange={() => {}}
      readOnly
    />
  )
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
