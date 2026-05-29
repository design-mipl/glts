import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import { billingTypeLabel, workflowTypeLabel } from '../../agreements/config/agreementStatusConfig'
import { corporatePortalStatusLabel } from '../config/corporateAccountStatusConfig'

interface CorporateAccountReviewPanelProps {
  data: CorporateAccountFormData
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack direction="row" spacing={2} sx={{ fontSize: 13 }}>
      <Typography component="span" sx={{ fontWeight: 600, minWidth: 120, color: 'text.secondary' }}>
        {label}
      </Typography>
      <Typography component="span" color="text.primary">
        {value || '—'}
      </Typography>
    </Stack>
  )
}

export function CorporateAccountReviewPanel({ data }: CorporateAccountReviewPanelProps) {
  const theme = useTheme()
  const agreement = data.agreementId ? commercialAgreementService.getById(data.agreementId) : undefined
  const counts = {
    totalAdmins: data.admins.length + (data.superAdmin.fullName ? 1 : 0),
    totalEntities: data.entityIds.length,
    totalVessels: data.vesselIds.length,
  }

  return (
    <Box
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: 'divider',
        bgcolor: theme.palette.mode === 'light' ? 'grey.50' : alpha('#fff', 0.04),
        p: 2,
      }}
    >
      <Typography variant="subtitle2" fontWeight={600} color="text.secondary" sx={{ mb: 1.5 }}>
        Review before activation
      </Typography>
      <Stack spacing={1}>
        <ReviewRow label="Company" value={data.companyName} />
        <ReviewRow label="Branch" value={data.branch} />
        <ReviewRow label="Workflow" value={workflowTypeLabel[data.workflowType as keyof typeof workflowTypeLabel] ?? data.workflowType} />
        <ReviewRow label="Account type" value={data.accountType} />
        <ReviewRow label="Super admin" value={data.superAdmin.fullName} />
        <ReviewRow label="Super admin email" value={data.superAdmin.emailAddress} />
        <ReviewRow label="Portal status" value={corporatePortalStatusLabel[data.portalActivation.portalStatus]} />
        <ReviewRow label="Admins" value={String(counts.totalAdmins)} />
        <ReviewRow label="Entities" value={String(counts.totalEntities)} />
        <ReviewRow label="Vessels" value={String(counts.totalVessels)} />
        <ReviewRow
          label="Billing"
          value={agreement ? billingTypeLabel[agreement.billingType] : '—'}
        />
      </Stack>
    </Box>
  )
}
