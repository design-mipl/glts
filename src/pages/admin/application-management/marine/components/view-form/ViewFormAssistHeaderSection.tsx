import type { ReactNode } from 'react'
import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { BaseCard } from '@/design-system/UIComponents'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from '@/pages/admin/components/adminFullPageFormLayout'
import {
  ADMIN_RECORD_PAGE_TITLE_SX,
  ADMIN_RECORD_PAGE_TITLE_VARIANT,
} from '@/pages/admin/components/adminRecordPageTitle'
import { toApplicationReviewOverview } from '@/pages/customer/features/applications/utils/applicationReviewOverview'
import { resolveApplicationReferenceDisplay } from '@/pages/customer/features/applications/utils/gltsReferenceIds'
import { ApplicationTrackingUrlLink } from '@/shared/components/ApplicationTrackingUrlLink'
import type { VerifyOverviewData } from '../../utils/verifyDocumentsUtils'

interface ViewFormAssistHeaderSectionProps {
  overview: VerifyOverviewData
  description?: string
  headerActions?: ReactNode
}

export function ViewFormAssistHeaderSection({
  overview,
  description,
  headerActions,
}: ViewFormAssistHeaderSectionProps) {
  const { shellPaddingX } = ADMIN_FULL_PAGE_FORM_LAYOUT
  const reviewOverview = toApplicationReviewOverview(overview)
  const visaLabel = reviewOverview.purposeLabel
    ? `${reviewOverview.visaTypeLabel} · ${reviewOverview.purposeLabel}`
    : reviewOverview.visaTypeLabel
  const { primaryId, batchId } = resolveApplicationReferenceDisplay(
    reviewOverview.gltsApplicationId,
    reviewOverview.gltsBatchId,
  )

  return (
    <BaseCard sx={{ overflow: 'visible' }}>
      <Box sx={{ px: shellPaddingX, pt: shellPaddingX, pb: shellPaddingX }}>
        <Stack spacing={2}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'center' }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <Box sx={{ minWidth: 0, flexShrink: { sm: 1 } }}>
              <Typography
                variant={ADMIN_RECORD_PAGE_TITLE_VARIANT}
                component="h1"
                fontWeight={700}
                color="text.primary"
                sx={ADMIN_RECORD_PAGE_TITLE_SX}
              >
                External portal form assist
              </Typography>
              {description ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
                  {description}
                </Typography>
              ) : null}
            </Box>
            {headerActions ? (
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                flexWrap="wrap"
                useFlexGap
                sx={{
                  width: { xs: '100%', sm: 'auto' },
                  flexShrink: 0,
                  justifyContent: { xs: 'flex-start', sm: 'flex-end' },
                }}
              >
                {headerActions}
              </Stack>
            ) : null}
          </Stack>

          <Divider />

          <Box>
            <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 13, mb: 1.5 }}>
              Application overview
            </Typography>
            {primaryId ? (
              <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
                <Typography
                  sx={{ fontSize: 13, fontFamily: 'monospace', fontWeight: 700, color: 'primary.main' }}
                >
                  {primaryId}
                </Typography>
                {batchId ? (
                  <Typography sx={{ fontSize: 13, fontFamily: 'monospace', color: 'text.secondary' }}>
                    · Batch {batchId}
                  </Typography>
                ) : null}
              </Stack>
            ) : null}
            <Grid container spacing={1.5} columns={{ xs: 2, md: 5 }}>
              {[
                ['Country', `${reviewOverview.countryFlag} ${reviewOverview.countryName}`],
                ['Visa', visaLabel],
                ['Jurisdiction', reviewOverview.jurisdiction || '—'],
                ['Travel', reviewOverview.travelDate || '—'],
                ['Travelers', String(overview.travelerCount)],
              ].map(([label, value]) => (
                <Grid size={1} key={label} sx={{ minWidth: 0 }}>
                  <Typography sx={{ fontSize: 11, color: 'text.secondary' }}>{label}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600, wordBreak: 'break-word' }}>
                    {value}
                  </Typography>
                </Grid>
              ))}
            </Grid>
            <ApplicationTrackingUrlLink
              countryName={reviewOverview.countryName}
              label="Track on embassy / VFS portal"
              sx={{ mt: 1.5 }}
            />
          </Box>
        </Stack>
      </Box>
    </BaseCard>
  )
}
