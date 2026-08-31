import { Box, Stack, Typography } from '@mui/material'
import { Link as RouterLink, useParams } from 'react-router-dom'
import { Check, Clock3, Loader2 } from 'lucide-react'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  getAccentButtonSx,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
import { buildTrackingSteps } from './buildTrackingSteps'
import {
  DEFAULT_TRACKING_APPLICATION_ID,
  getTrackedApplication,
} from './data/applicationTrackingMock'

/**
 * B21 — Application tracking. Returning customers land on /track/:applicationId.
 *
 * Styled from the apply-flow tokens rather than the shared brand palette so the screen a
 * customer returns to reads as the same product they applied through. The stage list is
 * rendered here instead of via the shared `StatusStepper` because that component is used
 * by other website surfaces and restyling it would change them too.
 */
export function ApplicationTrackingPage() {
  const { applicationId = DEFAULT_TRACKING_APPLICATION_ID } = useParams<{ applicationId: string }>()
  const application = getTrackedApplication(applicationId)

  if (!application) {
    return (
      <Box sx={{ maxWidth: 620, mx: 'auto', px: 4, py: { xs: 10, md: 16 }, textAlign: 'center' }}>
        <Typography
          sx={{
            fontFamily: applyFont.display,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: '-0.02em',
            color: applyFlow.ink,
            mb: 2,
          }}
        >
          We can&apos;t find that application
        </Typography>
        <Typography
          sx={{
            fontFamily: applyFont.body,
            fontSize: 14,
            color: applyFlow.inkMuted,
            mb: 5,
            lineHeight: 1.55,
          }}
        >
          No tracking record matches reference{' '}
          <Box component="span" sx={{ fontFamily: applyFont.mono, color: applyFlow.ink }}>
            {applicationId}
          </Box>
          . Check the reference in your confirmation email, or open a sample application.
        </Typography>
        <Box
          component={RouterLink}
          to={`/track/${DEFAULT_TRACKING_APPLICATION_ID}`}
          sx={{
            ...getAccentButtonSx(),
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 5,
            minHeight: 44,
            textDecoration: 'none',
          }}
        >
          Open a sample application
        </Box>
      </Box>
    )
  }

  const steps = buildTrackingSteps(application)
  const currentStep = steps.find((step) => step.state === 'current')
  const completedCount = steps.filter((step) => step.state === 'completed').length
  const percent = Math.round((completedCount / Math.max(steps.length, 1)) * 100)
  const hasEstimate = Boolean(application.estimatedApprovalDate)

  return (
    <Box sx={{ bgcolor: applyFlow.surface, minHeight: '60vh' }}>
      <Box sx={{ maxWidth: 680, mx: 'auto', px: { xs: 4, sm: 5 }, py: { xs: 5, md: 7 } }}>
        {/* Identity of the thing being tracked. */}
        <Typography
          sx={{
            fontFamily: applyFont.mono,
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: applyFlow.inkMuted,
          }}
        >
          Application tracking
        </Typography>
        <Typography
          sx={{
            ...tabularNums,
            fontFamily: applyFont.mono,
            fontSize: { xs: 20, md: 23 },
            fontWeight: 700,
            letterSpacing: '0.02em',
            color: applyFlow.ink,
            mt: 1.25,
            lineHeight: 1.1,
          }}
        >
          {application.id}
        </Typography>
        <Typography
          sx={{
            fontFamily: applyFont.body,
            fontSize: 14,
            color: applyFlow.inkMuted,
            mt: 1.5,
          }}
        >
          {application.applicantName ? `${application.applicantName} · ` : ''}
          {application.destination} · {application.visaType}
        </Typography>

        {/* Where it is right now — the answer people came for. */}
        <Box
          sx={{
            mt: 4,
            px: 3.5,
            py: 2.75,
            borderRadius: applyRadius.card,
            border: `1px solid ${applyFlow.accentBorder}`,
            backgroundColor: applyFlow.accentSoft,
          }}
        >
          <Typography
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: applyFlow.inkMuted,
            }}
          >
            {hasEstimate ? 'Estimated decision' : 'Current stage'}
          </Typography>
          <Typography
            sx={{
              fontFamily: applyFont.display,
              fontSize: { xs: 17, md: 20 },
              fontWeight: 700,
              letterSpacing: '-0.02em',
              color: applyFlow.ink,
              mt: 1,
              lineHeight: 1.2,
            }}
          >
            {hasEstimate ? application.estimatedApprovalDate : (currentStep?.label ?? 'In progress')}
          </Typography>
          <Typography
            sx={{
              fontFamily: applyFont.body,
              fontSize: 13,
              color: applyFlow.inkMuted,
              mt: 1.5,
              lineHeight: 1.5,
            }}
          >
            {currentStep
              ? `${currentStep.label} — ${currentStep.description ?? 'in progress'}`
              : 'Everything on this application is complete.'}
          </Typography>

          <Box
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={percent}
            aria-label="Application progress"
            sx={{
              mt: 3,
              height: '2px',
              borderRadius: '1px',
              backgroundColor: 'rgba(15, 23, 42, 0.12)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${percent}%`,
                backgroundColor: applyFlow.accent,
                transition: `width 400ms ${applyMotion.easeInOut}`,
              }}
            />
          </Box>
          <Typography
            sx={{
              ...tabularNums,
              fontFamily: applyFont.mono,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: applyFlow.inkMuted,
              mt: 1.5,
            }}
          >
            {completedCount} of {steps.length} stages complete
          </Typography>
        </Box>

        {/* The full timeline: what is done, what is happening, what is still to come. */}
        <Typography
          sx={{
            fontFamily: applyFont.mono,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: applyFlow.inkMuted,
            mt: 5,
            mb: 0.5,
          }}
        >
          Progress
        </Typography>

        <Box>
          {steps.map((step, index) => {
            const done = step.state === 'completed'
            const current = step.state === 'current'
            const last = index === steps.length - 1

            return (
              <Stack key={step.id} direction="row" spacing={2.5} alignItems="flex-start" sx={{ py: 1.5 }}>
                <Box
                  aria-hidden
                  sx={{
                    position: 'relative',
                    width: 24,
                    height: 24,
                    flex: '0 0 auto',
                    display: 'grid',
                    placeItems: 'center',
                    borderRadius: '50%',
                    backgroundColor: done
                      ? applyFlow.success
                      : current
                        ? applyFlow.accent
                        : applyFlow.surface,
                    border: `1px solid ${
                      done
                        ? applyFlow.success
                        : current
                          ? applyFlow.accent
                          : applyFlow.hairlineStrong
                    }`,
                    color: done ? '#FFFFFF' : current ? applyFlow.onAccent : applyFlow.inkFaint,
                    '&::after': last
                      ? undefined
                      : {
                          content: '""',
                          position: 'absolute',
                          top: 26,
                          left: '50%',
                          width: '1px',
                          height: 'calc(100% + 8px)',
                          backgroundColor: done ? applyFlow.successBorder : applyFlow.hairline,
                        },
                  }}
                >
                  {done ? (
                    <Check size={13} strokeWidth={3} />
                  ) : current ? (
                    <Loader2
                      size={13}
                      strokeWidth={2.4}
                      style={{ animation: 'trackSpin 1100ms linear infinite' }}
                    />
                  ) : (
                    <Clock3 size={12} strokeWidth={1.9} />
                  )}
                  <Box
                    component="style"
                    dangerouslySetInnerHTML={{
                      // Constant rotation is the one motion here; reduced-motion holds it
                      // still — the stage is already identified by colour and position.
                      __html:
                        '@keyframes trackSpin{to{transform:rotate(360deg)}}' +
                        '@media (prefers-reduced-motion: reduce){[style*="trackSpin"]{animation:none!important}}',
                    }}
                  />
                </Box>

                <Box sx={{ minWidth: 0, pb: last ? 0 : 1 }}>
                  <Typography
                    sx={{
                      fontFamily: applyFont.body,
                      fontSize: 13.5,
                      fontWeight: current || done ? 600 : 500,
                      color: done || current ? applyFlow.ink : applyFlow.inkMuted,
                      lineHeight: 1.3,
                    }}
                  >
                    {step.label}
                  </Typography>
                  {step.description ? (
                    <Typography
                      sx={{
                        ...tabularNums,
                        fontFamily: done ? applyFont.mono : applyFont.body,
                        fontSize: done ? 11 : 12.5,
                        color: applyFlow.inkMuted,
                        mt: 0.5,
                        lineHeight: 1.45,
                      }}
                    >
                      {step.description}
                    </Typography>
                  ) : null}
                </Box>
              </Stack>
            )
          })}
        </Box>

        <Typography
          sx={{
            fontFamily: applyFont.body,
            fontSize: 12.5,
            color: applyFlow.inkFaint,
            mt: 5,
            lineHeight: 1.55,
          }}
        >
          We email you at every stage change, so there is nothing you need to do here. If a
          document needs replacing we will contact you directly with what is missing.
        </Typography>
      </Box>
    </Box>
  )
}
