import { Box, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { LiveStatusPanel } from '@/pages/website-v2/components/liveStatusPanel/LiveStatusPanel'
import { StatusStepper } from '@/pages/website-v2/components/statusStepper/StatusStepper'
import { getElevatedStatusCardSx } from '@/pages/website-v2/theme/statusVisualTokens'
import { buildTrackingSteps } from './buildTrackingSteps'
import {
  DEFAULT_TRACKING_APPLICATION_ID,
  getTrackedApplication,
} from './data/applicationTrackingMock'

/** B21 — Application Tracking. Returning customers land on /track/:applicationId. */
export function ApplicationTrackingPage() {
  const colors = usePublicBrandColors()
  const { applicationId = DEFAULT_TRACKING_APPLICATION_ID } = useParams<{ applicationId: string }>()
  const application = getTrackedApplication(applicationId)

  if (!application) {
    return (
      <Box sx={{ maxWidth: 720, mx: 'auto', px: 3, py: { xs: 6, md: 10 }, textAlign: 'center' }}>
        <Typography sx={{ fontSize: 22, fontWeight: 700, color: colors.navy, mb: 1 }}>
          Application not found
        </Typography>
        <Typography sx={{ fontSize: 14, color: colors.textSecondary, mb: 3 }}>
          We couldn&apos;t find tracking details for <strong>{applicationId}</strong>.
        </Typography>
        <Typography
          component={RouterLink}
          to={`/track/${DEFAULT_TRACKING_APPLICATION_ID}`}
          sx={{ fontSize: 14, fontWeight: 700, color: colors.greenDark, textDecoration: 'none' }}
        >
          Open a sample application
        </Typography>
      </Box>
    )
  }

  const hasEstimate = Boolean(application.estimatedApprovalDate)
  const steps = buildTrackingSteps(application)
  const tripCaption = `${application.destination} · ${application.visaType}`

  return (
    <Box sx={{ bgcolor: colors.surface, minHeight: '60vh' }}>
      <Box sx={{ maxWidth: 720, mx: 'auto', px: { xs: 2, sm: 3 }, py: { xs: 4, md: 6 } }}>
        <Stack spacing={0.75} sx={{ mb: 3 }}>
          <Typography
            sx={{
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.textMuted,
            }}
          >
            Application tracking
          </Typography>
          <Typography sx={{ fontSize: { xs: 22, md: 26 }, fontWeight: 700, color: colors.navy }}>
            {application.id}
          </Typography>
          {application.applicantName ? (
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: colors.navy }}>
              {application.applicantName}
            </Typography>
          ) : null}
          <Typography sx={{ fontSize: 14, color: colors.textSecondary }}>{tripCaption}</Typography>
        </Stack>

        <Stack spacing={2.5}>
          <LiveStatusPanel
            headline={{
              eyebrow: hasEstimate ? 'Estimated approval' : 'Awaiting next update',
              value: hasEstimate ? (application.estimatedApprovalDate as string) : '—',
              caption: tripCaption,
            }}
          />

          <Box
            sx={{
              p: { xs: 2, sm: 2.5 },
              borderRadius: '12px',
              ...getElevatedStatusCardSx(colors.border),
              bgcolor: colors.white,
            }}
          >
            <Typography sx={{ fontSize: 14, fontWeight: 700, color: colors.navy, mb: 2 }}>
              Progress
            </Typography>
            <StatusStepper steps={steps} orientation="vertical" />
          </Box>
        </Stack>
      </Box>
    </Box>
  )
}
