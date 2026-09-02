import { Box, Typography } from '@mui/material'
import { siteBrand } from '@/pages/website/theme/siteTheme'
import { useSiteTone } from '../../../components/siteTone'

/**
 * Approval-rate ring.
 *
 * The homepage's loudest number used to be set as plain type in the proof strip, which
 * made it one of three equal figures. Here the headline figure is the ring itself — the
 * same `stroke-dasharray` arc the apply flow uses for document readiness, so a visitor
 * meets the product's progress language before they ever open an application.
 *
 * Green, not gold — the locked spec puts readiness and progress rings in green and keeps
 * gold for the single action. The arc is the raw brand green on both grounds (it is a
 * stroke on a track, not text); the figure's `%` uses the ground-corrected `brandText`.
 *
 * Deliberately not animated. This sits above the fold on the most-visited screen on the
 * site; a counting or sweeping arc would delay the figure the visitor came to read.
 */

const SIZE = 132
const STROKE = 6
const RADIUS = (SIZE - STROKE) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

export function HeroApprovalRing({
  value = 98,
  label = 'Approval rate',
  caption = 'Last 12 months',
}: {
  value?: number
  label?: string
  caption?: string
}) {
  const t = useSiteTone()
  const clamped = Math.max(0, Math.min(100, value))
  const filled = (clamped / 100) * CIRCUMFERENCE

  return (
    <Box
      sx={{
        position: 'relative',
        width: SIZE,
        height: SIZE,
        flex: '0 0 auto',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <Box
        component="svg"
        aria-hidden
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        sx={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }}
      >
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={t.hairlineStrong}
          strokeWidth={STROKE}
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          stroke={siteBrand.green}
          strokeWidth={STROKE}
          strokeLinecap="butt"
          strokeDasharray={`${filled} ${CIRCUMFERENCE - filled}`}
        />
      </Box>

      <Box sx={{ position: 'relative', textAlign: 'center' }}>
        <Typography
          sx={{
            ...t.data,
            fontSize: 30,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          {clamped}
          <Box component="span" sx={{ fontSize: 17, color: t.brandText }}>
            %
          </Box>
        </Typography>
        <Typography sx={{ ...t.mrz, fontSize: 9, mt: 1 }}>{label}</Typography>
        <Typography sx={{ ...t.mrz, fontSize: 8.5, mt: 0.5, letterSpacing: '0.12em' }}>
          {caption}
        </Typography>
      </Box>
    </Box>
  )
}
