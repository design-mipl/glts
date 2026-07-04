import { Card, Grid, Stack, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { ApplicationReviewOverview } from '../../utils/applicationReviewOverview'
import { resolveApplicationReferenceDisplay } from '../../utils/gltsReferenceIds'

export interface ApplicationReviewOverviewCardProps {
  overview: ApplicationReviewOverview
  travelerCount: number
  /** Admin verify uses DS BaseCard; customer uses branded Card */
  variant?: 'customer' | 'admin'
}

export function ApplicationReviewOverviewCard({
  overview,
  travelerCount,
  variant = 'customer',
}: ApplicationReviewOverviewCardProps) {
  const colors = usePublicBrandColors()
  const visaLabel = overview.purposeLabel
    ? `${overview.visaTypeLabel} · ${overview.purposeLabel}`
    : overview.visaTypeLabel
  const { primaryId, batchId } = resolveApplicationReferenceDisplay(
    overview.gltsApplicationId,
    overview.gltsBatchId,
  )

  const content = (
    <>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 13,
          mb: 1.5,
          ...(variant === 'admin' ? {} : { color: colors.navy }),
        }}
      >
        Application overview
      </Typography>
      {primaryId ? (
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
          <Typography
            sx={{
              fontSize: 13,
              fontFamily: 'monospace',
              fontWeight: 700,
              color: variant === 'admin' ? 'primary.main' : colors.navy,
            }}
          >
            {primaryId}
          </Typography>
          {batchId ? (
            <Typography
              sx={{
                fontSize: 13,
                fontFamily: 'monospace',
                color: variant === 'admin' ? 'text.secondary' : colors.textSecondary,
              }}
            >
              · Batch {batchId}
            </Typography>
          ) : null}
        </Stack>
      ) : null}
      <Grid container spacing={1.5} columns={{ xs: 2, md: 5 }}>
        {[
          ['Country', `${overview.countryFlag} ${overview.countryName}`],
          ['Visa', visaLabel],
          ...(overview.issuedPassportLocationLabel
            ? ([['Passport state', overview.issuedPassportLocationLabel]] as const)
            : []),
          ...(overview.placeOfResidenceLabel
            ? ([['Place of residence', overview.placeOfResidenceLabel]] as const)
            : []),
          ['Jurisdiction', overview.jurisdiction || '—'],
          ['Travel', overview.travelDate || '—'],
          ['Travelers', String(travelerCount)],
        ].map(([label, value]) => (
          <Grid size={1} key={label} sx={{ minWidth: 0 }}>
            <Typography
              sx={{
                fontSize: 11,
                color: variant === 'admin' ? 'text.secondary' : colors.textMuted,
              }}
            >
              {label}
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                fontWeight: 600,
                wordBreak: 'break-word',
              }}
            >
              {value}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </>
  )

  if (variant === 'admin') {
    return <BaseCard sx={{ p: 2 }}>{content}</BaseCard>
  }

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: BORDER_RADIUS.xl,
        border: `${BORDER_WIDTH.thin} solid ${colors.border}`,
        bgcolor: colors.white,
      }}
    >
      {content}
    </Card>
  )
}
