import { Grid, Stack, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { resolveApplicationReferenceDisplay } from '@/pages/customer/features/applications/utils/gltsReferenceIds'
import type { VerifyOverviewData } from '../../utils/verifyDocumentsUtils'

interface VerifyDocumentsOverviewProps {
  overview: VerifyOverviewData
}

export function VerifyDocumentsOverview({ overview }: VerifyDocumentsOverviewProps) {
  const visaLabel = overview.purposeLabel
    ? `${overview.visaTypeLabel} · ${overview.purposeLabel}`
    : overview.visaTypeLabel
  const { primaryId, batchId } = resolveApplicationReferenceDisplay(
    overview.gltsApplicationId,
    overview.gltsBatchId,
  )

  return (
    <BaseCard sx={{ p: 2 }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1.5 }}>
        Application overview
      </Typography>
      {primaryId ? (
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
          <Typography
            variant="body2"
            fontWeight={700}
            color="primary.main"
            sx={{ fontFamily: 'monospace', fontSize: 13 }}
          >
            {primaryId}
          </Typography>
          {batchId ? (
            <Typography variant="body2" color="text.secondary" sx={{ fontFamily: 'monospace', fontSize: 13 }}>
              · Batch {batchId}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
      <Grid container spacing={1.5} columns={{ xs: 2, md: 5 }}>
        {[
          ['Country', `${overview.countryFlag} ${overview.countryName}`],
          ['Visa', visaLabel],
          ['Jurisdiction', overview.jurisdiction || '—'],
          ['Travel', overview.travelDate || '—'],
          ['Travelers', String(overview.travelerCount)],
        ].map(([label, value]) => (
          <Grid size={1} key={label} sx={{ minWidth: 0 }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
              {label}
            </Typography>
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13, wordBreak: 'break-word' }}>
              {value}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </BaseCard>
  )
}
