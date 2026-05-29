import { Grid, Stack, Typography } from '@mui/material'
import { Badge } from '@/design-system/UIComponents'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { billingTypeLabel, onboardingDocumentStatusLabel, workflowTypeLabel } from '../../config/agreementStatusConfig'

interface OverviewTabProps {
  agreement: CommercialAgreement
}

export function OverviewTab({ agreement }: OverviewTabProps) {
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
            Workflow
          </Typography>
          <Typography variant="body2">{workflowTypeLabel[agreement.workflowType]}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Billing
          </Typography>
          <Typography variant="body2">{billingTypeLabel[agreement.billingType]}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Period
          </Typography>
          <Typography variant="body2">
            {agreement.startDate || '—'} → {agreement.endDate || '—'}
          </Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Credit limit
          </Typography>
          <Typography variant="body2">₹{agreement.billingConfig.creditLimit.toLocaleString('en-IN')}</Typography>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <Typography variant="caption" color="text.secondary">
            Accounts SPOC
          </Typography>
          <Typography variant="body2">{agreement.financeContacts.accountsSpocName || '—'}</Typography>
        </Grid>
      </Grid>

      <Stack spacing={1}>
        <Typography variant="body2" fontWeight={600}>
          Pricing matrix
        </Typography>
        {agreement.pricingMatrix.map((row) => (
          <Typography key={row.id} variant="body2" color="text.secondary">
            {row.country} · {row.visaType} · ₹{row.serviceFee.toLocaleString('en-IN')}
          </Typography>
        ))}
      </Stack>

      <Stack spacing={1}>
        <Typography variant="body2" fontWeight={600}>
          Miscellaneous costs
        </Typography>
        {agreement.miscellaneousCosts.map((row) => (
          <Typography key={row.id} variant="body2" color="text.secondary">
            {row.serviceName} · ₹{row.amount.toLocaleString('en-IN')}
          </Typography>
        ))}
      </Stack>
    </Stack>
  )
}

export function DocumentsTab({ agreement }: OverviewTabProps) {
  return (
    <Stack spacing={1.5}>
      {agreement.documents.map((doc) => (
        <Stack key={doc.documentKey} direction="row" spacing={1} alignItems="center">
          <Badge label={onboardingDocumentStatusLabel[doc.status]} size="sm" />
          <Typography variant="body2" fontWeight={doc.required ? 600 : 400}>
            {doc.name}
            {doc.fileName ? ` · ${doc.fileName}` : ''}
          </Typography>
        </Stack>
      ))}
    </Stack>
  )
}

export function ActivityTab({ agreement }: OverviewTabProps) {
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
