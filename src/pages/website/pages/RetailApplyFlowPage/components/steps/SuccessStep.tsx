import { useRef } from 'react'
import { Box, Stack, Typography, keyframes } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ArrowRight, Check, FileSearch, Mail, ShieldCheck, Stamp } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { RetailJourney } from '@/shared/services/retailJourneyResolver'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  getAccentButtonSx,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'

const cardIn = keyframes`
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
`

/** Reduced-motion counterpart: the fade stays (it signals arrival), the travel goes. */
const cardFadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`

interface SuccessStepProps {
  journey: RetailJourney
  /** @deprecated Kept for call-site compat; primary CTA now goes to Application Tracking. */
  listingHref?: string
  /** Optional stable reference for preview / tests. */
  applicationReference?: string
  submittedAt?: string
  nextExpectedUpdate?: string
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function defaultNextUpdate(): string {
  const d = new Date()
  d.setDate(d.getDate() + 4)
  return formatDate(d)
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      alignItems="baseline"
      spacing={3}
      sx={{
        py: 1.5,
        borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
        '&:last-of-type': { borderBottom: 'none' },
      }}
    >
      <Typography
        sx={{
          fontFamily: applyFont.mono,
          fontSize: 9.5,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: applyFlow.inkFaint,
          flexShrink: 0,
        }}
      >
        {label}
      </Typography>
      <Typography
        sx={{
          ...tabularNums,
          fontFamily: applyFont.body,
          fontSize: 13.5,
          fontWeight: 600,
          color: applyFlow.ink,
          textAlign: 'right',
        }}
      >
        {value}
      </Typography>
    </Stack>
  )
}

/** One thing GLTS will do next, in the order it happens. */
function NextStep({
  icon: Icon,
  title,
  detail,
  index,
}: {
  icon: LucideIcon
  title: string
  detail: string
  index: number
}) {
  return (
    <Stack direction="row" spacing={2.5} alignItems="flex-start" sx={{ py: 1.5 }}>
      <Box
        aria-hidden
        sx={{
          position: 'relative',
          width: 24,
          height: 24,
          flex: '0 0 auto',
          display: 'grid',
          placeItems: 'center',
          borderRadius: applyRadius.chip,
          backgroundColor: applyFlow.canvas,
          border: `1px solid ${applyFlow.hairline}`,
          color: applyFlow.inkMuted,
          // Connector down the column — the steps are a sequence, not a bullet list.
          '&::after':
            index < 2
              ? {
                  content: '""',
                  position: 'absolute',
                  top: 26,
                  left: '50%',
                  width: '1px',
                  height: 18,
                  backgroundColor: applyFlow.hairline,
                }
              : undefined,
        }}
      >
        <Icon size={13} strokeWidth={1.9} />
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography
          sx={{
            fontFamily: applyFont.body,
            fontSize: 13.5,
            fontWeight: 600,
            color: applyFlow.ink,
            lineHeight: 1.3,
          }}
        >
          {title}
        </Typography>
        <Typography
          sx={{
            fontFamily: applyFont.body,
            fontSize: 12.5,
            color: applyFlow.inkMuted,
            mt: 0.5,
            lineHeight: 1.45,
          }}
        >
          {detail}
        </Typography>
      </Box>
    </Stack>
  )
}

/**
 * B20 — Application received.
 *
 * Rebuilt on the apply-flow tokens: the previous ticket card pulled from
 * `usePublicBrandColors()`, so the final screen of the retail journey rendered in the
 * portal palette — the same class of theme break as the sponsor dialog.
 *
 * Content-wise it now answers the four questions someone actually has at this moment:
 * did it go through, what is my reference, has my money been taken, and what happens now.
 */
export function SuccessStep({
  journey,
  applicationReference,
  submittedAt,
  nextExpectedUpdate,
}: SuccessStepProps) {
  const generatedRef = useRef(
    `GLTS-${new Date().getFullYear()}-${String(Math.floor(1000 + Math.random() * 9000))}`,
  )
  const reference = applicationReference ?? generatedRef.current
  const submitted = submittedAt ?? formatDate(new Date())
  const nextUpdate = nextExpectedUpdate ?? defaultNextUpdate()

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 620,
        mx: 'auto',
        py: { xs: 2, md: 4 },
        animation: `${cardIn} 0.4s ${applyMotion.easeOut} both`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: `${cardFadeIn} 0.2s linear both`,
        },
      }}
    >
      {/* Confirmation — calm, not confetti. */}
      <Stack direction="row" spacing={2.5} alignItems="center" sx={{ mb: 3 }}>
        <Box
          aria-hidden
          sx={{
            width: 32,
            height: 32,
            flex: '0 0 auto',
            display: 'grid',
            placeItems: 'center',
            borderRadius: '50%',
            backgroundColor: applyFlow.success,
            color: '#FFFFFF',
          }}
        >
          <Check size={16} strokeWidth={3} />
        </Box>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: applyFlow.success,
            }}
          >
            Application received
          </Typography>
          <Typography
            sx={{
              fontFamily: applyFont.display,
              fontSize: { xs: 19, md: 22 },
              fontWeight: 700,
              letterSpacing: '-0.02em',
              lineHeight: 1.15,
              color: applyFlow.ink,
              mt: 0.75,
            }}
          >
            You&apos;re all set — we&apos;ve got it from here.
          </Typography>
        </Box>
      </Stack>

      {/* Reference: the single thing worth copying off this screen. */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'flex-start', sm: 'center' },
          gap: 2.5,
          px: 3,
          py: 2.25,
          mb: 2,
          borderRadius: applyRadius.control,
          border: `1px solid ${applyFlow.accentBorder}`,
          backgroundColor: applyFlow.accentSoft,
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 9.5,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: applyFlow.inkMuted,
              mb: 1,
            }}
          >
            Application reference
          </Typography>
          <Typography
            sx={{
              ...tabularNums,
              fontFamily: applyFont.mono,
              fontSize: { xs: 17, sm: 20 },
              fontWeight: 700,
              letterSpacing: '0.02em',
              color: applyFlow.ink,
              lineHeight: 1.1,
            }}
          >
            {reference}
          </Typography>
        </Box>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{
            flex: '0 0 auto',
            px: 2.5,
            py: 1.25,
            borderRadius: applyRadius.chip,
            backgroundColor: applyFlow.successSoft,
            border: `1px solid ${applyFlow.successBorder}`,
            color: applyFlow.success,
          }}
        >
          <ShieldCheck size={14} strokeWidth={2.2} />
          <Typography
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 10,
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
            }}
          >
            Payment successful
          </Typography>
        </Stack>
      </Box>

      <Box
        sx={{
          borderRadius: applyRadius.control,
          border: `1px solid ${applyFlow.hairline}`,
          backgroundColor: applyFlow.surface,
          px: 3,
          py: 0.5,
          mb: 3,
        }}
      >
        <DetailRow label="Destination" value={journey.country.name} />
        <DetailRow label="Visa type" value={journey.visaType.name} />
        <DetailRow label="Received on" value={submitted} />
        <DetailRow label="Next update by" value={nextUpdate} />
      </Box>

      <Typography
        sx={{
          fontFamily: applyFont.mono,
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
          color: applyFlow.inkMuted,
          mb: 1,
        }}
      >
        What happens next
      </Typography>
      <Box sx={{ mb: 4 }}>
        <NextStep
          index={0}
          icon={FileSearch}
          title="We check your documents"
          detail="Our team reviews every file against the consulate checklist and comes back to you if anything needs replacing."
        />
        <NextStep
          index={1}
          icon={Stamp}
          title="We prepare and submit"
          detail="We draft the forms, book the appointment where one is needed, and lodge the application on your behalf."
        />
        <NextStep
          index={2}
          icon={Mail}
          title="You hear from us at every stage"
          detail={`Email updates as the status changes, with the next one due by ${nextUpdate}.`}
        />
      </Box>

      <Box
        component={RouterLink}
        to={`/track/${encodeURIComponent(reference)}`}
        sx={{
          ...getAccentButtonSx(),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 2,
          width: '100%',
          minHeight: 46,
          textDecoration: 'none',
        }}
      >
        Track your application
        <ArrowRight size={16} />
      </Box>

      <Typography
        sx={{
          fontFamily: applyFont.body,
          fontSize: 12,
          color: applyFlow.inkFaint,
          textAlign: 'center',
          mt: 2.5,
          lineHeight: 1.5,
        }}
      >
        Keep reference {reference} handy — it&apos;s how you or anyone travelling with you can
        check progress at any time.
      </Typography>
    </Box>
  )
}
