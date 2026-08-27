import { useMemo, useRef } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { getPrimaryButtonSx, usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import { statusVisualRadius, getElevatedStatusCardSx } from '@/pages/website-v2/theme/statusVisualTokens'

interface SuccessStepProps {
  journey: RetailJourney
  /** @deprecated Kept for call-site compat; primary CTA now goes to Application Tracking. */
  listingHref?: string
  /** Optional stable reference for preview / tests. */
  applicationReference?: string
  submittedAt?: string
  nextExpectedUpdate?: string
}

function formatToday(): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date())
}

function defaultNextUpdate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 4)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(d)
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const colors = usePublicBrandColors()
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="baseline"
      spacing={2}
      sx={{ py: 1.1 }}
    >
      <Typography
        sx={{
          fontSize: 11,
          fontWeight: 700,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          color: colors.textMuted,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          fontSize: 14,
          fontWeight: 600,
          color: colors.navy,
          textAlign: 'right',
          fontVariantNumeric: 'tabular-nums',
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

/**
 * B20 — Application Created. Boarding-pass style confirmation:
 * calm relief tone (not celebration), perforated ticket divider, CTA → B21 tracking.
 */
export function SuccessStep({
  journey,
  applicationReference,
  submittedAt,
  nextExpectedUpdate,
}: SuccessStepProps) {
  const colors = usePublicBrandColors()
  const generatedRef = useRef(
    `GLTS-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
  )
  const reference = applicationReference ?? generatedRef.current
  const submitted = submittedAt ?? formatToday()
  const nextUpdate = nextExpectedUpdate ?? defaultNextUpdate()

  const notchColor = colors.surface
  const cardRadius = '16px'
  const notchSize = 12

  const perforationSx = useMemo(
    () => ({
      position: 'relative' as const,
      height: 24,
      mx: 0,
      // Dashed ticket tear line
      backgroundImage: `repeating-linear-gradient(to right, ${colors.border} 0 6px, transparent 6px 12px)`,
      backgroundPosition: 'center',
      backgroundSize: '100% 1.5px',
      backgroundRepeat: 'no-repeat',
      // Semi-circle die-cuts on left/right edges at the perforation
      '&::before, &::after': {
        content: '""',
        position: 'absolute',
        top: '50%',
        width: notchSize * 2,
        height: notchSize * 2,
        borderRadius: '50%',
        backgroundColor: notchColor,
        transform: 'translateY(-50%)',
        zIndex: 1,
      },
      '&::before': { left: -notchSize },
      '&::after': { right: -notchSize },
    }),
    [colors.border, notchColor],
  )

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 440,
        mx: 'auto',
        // Surface behind ticket so edge notches read as die-cuts
        bgcolor: colors.surface,
        borderRadius: cardRadius,
        p: { xs: 2, sm: 2.5 },
      }}
    >
      <Box
        sx={{
          position: 'relative',
          bgcolor: colors.white,
          borderRadius: cardRadius,
          ...getElevatedStatusCardSx(colors.border),
          overflow: 'hidden',
        }}
      >
        {/* Top stub — calm confirmation */}
        <Box sx={{ px: { xs: 2.5, sm: 3 }, pt: 3, pb: 2.5, textAlign: 'center' }}>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: colors.greenDark,
              mb: 1.25,
            }}
          >
            Application received
          </Typography>
          <Typography
            sx={{
              fontSize: { xs: 18, sm: 20 },
              fontWeight: 700,
              color: colors.navy,
              lineHeight: 1.35,
              mb: 1,
            }}
          >
            You&apos;re all set — we&apos;ve got it from here.
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: colors.textSecondary, lineHeight: 1.5, mb: 2.5 }}>
            We&apos;ll email you as things move. You can check progress any time with your reference.
          </Typography>

          <Box
            sx={{
              display: 'inline-flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0.5,
              px: 2,
              py: 1.25,
              borderRadius: statusVisualRadius.control,
              bgcolor: colors.greenMuted,
              border: `1px solid rgba(115, 192, 100, 0.22)`,
            }}
          >
            <Typography
              sx={{
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: colors.greenDark,
              }}
            >
              Reference
            </Typography>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 800,
                color: colors.navy,
                letterSpacing: '0.04em',
                fontVariantNumeric: 'tabular-nums',
                fontFamily: '"Roboto", system-ui, sans-serif',
              }}
            >
              {reference}
            </Typography>
          </Box>
        </Box>

        {/* Perforated divider with edge notches */}
        <Box sx={perforationSx} aria-hidden />

        {/* Bottom stub — journey details */}
        <Box sx={{ px: { xs: 2.5, sm: 3 }, pt: 1.5, pb: 3 }}>
          <Stack
            spacing={0}
            sx={{
              '& > *:not(:last-child)': {
                borderBottom: `1px solid ${colors.border}`,
              },
            }}
          >
            <DetailRow label="Destination" value={journey.country.name} />
            <DetailRow label="Visa type" value={journey.visaType.name} />
            <DetailRow label="Submitted" value={submitted} />
            <DetailRow label="Next update" value={nextUpdate} />
          </Stack>

          <Box
            component={RouterLink}
            to={`/track/${encodeURIComponent(reference)}`}
            sx={{
              ...getPrimaryButtonSx(colors),
              mt: 2.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              textDecoration: 'none',
              borderRadius: '10px',
              fontFamily: '"Roboto", system-ui, sans-serif',
            }}
          >
            Track your application
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
