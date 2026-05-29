import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { Badge } from '@/design-system/UIComponents'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import {
  agreementTypeLabel,
  billingTypeLabel,
  onboardingDocumentStatusLabel,
  workflowTypeLabel,
} from '../config/agreementStatusConfig'

interface AgreementReviewPanelProps {
  data: CommercialAgreementFormData
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

export function AgreementReviewPanel({ data }: AgreementReviewPanelProps) {
  const theme = useTheme()
  const companyLabel =
    data.companyMode === 'existing'
      ? data.company.companyName || data.existingCompanyId
      : data.company.companyName

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
        Review before submit
      </Typography>
      <Stack spacing={2}>
        <Stack spacing={1}>
          <ReviewRow label="Company" value={companyLabel} />
          <ReviewRow label="Agreement type" value={agreementTypeLabel[data.agreementType]} />
          <ReviewRow label="Workflow" value={workflowTypeLabel[data.workflowType]} />
          <ReviewRow label="Billing" value={billingTypeLabel[data.billingType]} />
          <ReviewRow label="Period" value={`${data.startDate || '—'} → ${data.endDate || '—'}`} />
          <ReviewRow label="Pricing rows" value={String(data.pricingMatrix.length)} />
          <ReviewRow label="Misc. costs" value={String(data.miscellaneousCosts.length)} />
        </Stack>

        <Stack spacing={1}>
          <Typography variant="body2" fontWeight={600}>
            Documents
          </Typography>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {data.documents.map((doc) => (
              <Badge
                key={doc.documentKey}
                label={`${doc.name}: ${onboardingDocumentStatusLabel[doc.status]}`}
                color={doc.status === 'verified' || doc.status === 'uploaded' ? 'success' : 'neutral'}
                size="sm"
              />
            ))}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  )
}
