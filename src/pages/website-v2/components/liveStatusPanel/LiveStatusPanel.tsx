import { useId } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { CheckCircle2 } from 'lucide-react'
import { publicLightColors, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { statusVisualRadius } from '@/pages/website-v2/theme/statusVisualTokens'

export interface LiveStatusHeadline {
  /** Small uppercase label above the stat, e.g. "ESTIMATED APPROVAL". */
  eyebrow: string
  /** The one emphasis number/value — always rendered in gold, e.g. "94%" or "Aug 29". */
  value: string
  /** Optional line under the stat, e.g. trip context (route + visa type). */
  caption?: string
}

export interface LiveStatusReadiness {
  /** Document-completion percentage for the active traveller, 0–100. */
  percent: number
  /** Estimated minutes remaining for remaining uploads. */
  minutesLeft: number
}

export interface LiveStatusPanelProps {
  headline: LiveStatusHeadline
  /** Data-backed trust lines — used when `readiness` is omitted. */
  bullets?: string[]
  /** When set, replaces the trust-bullet list with a live readiness ring. */
  readiness?: LiveStatusReadiness
}

/**
 * Technical grid overlay — SVG-native &lt;mask&gt; (not CSS mask-image).
 * Subtle lines, strongest at top-right, continuous fade toward bottom-left.
 */
function TechnicalGridOverlay({ uid }: { uid: string }) {
  const gridId = `${uid}-grid`
  const maskId = `${uid}-mask`
  const fadeId = `${uid}-fade`
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
        <defs>
          <mask id={maskId} maskUnits="objectBoundingBox" maskContentUnits="objectBoundingBox">
            <linearGradient id={fadeId} gradientUnits="objectBoundingBox" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity="1" />
              <stop offset="22%" stopColor="#fff" stopOpacity="0.55" />
              <stop offset="48%" stopColor="#fff" stopOpacity="0.18" />
              <stop offset="72%" stopColor="#fff" stopOpacity="0" />
              <stop offset="100%" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <rect x="0" y="0" width="1" height="1" fill={`url(#${fadeId})`} />
          </mask>
          <pattern id={gridId} width="18" height="18" patternUnits="userSpaceOnUse">
            <path
              d="M 18 0 L 0 0 0 18"
              fill="none"
              stroke="rgba(255,255,255,0.11)"
              strokeWidth="0.85"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${gridId})`} mask={`url(#${maskId})`} />
      </svg>
    </Box>
  )
}

function LiveDot() {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'absolute',
        top: 18,
        right: 18,
        zIndex: 2,
        width: 7,
        height: 7,
        borderRadius: '50%',
        bgcolor: publicLightColors.greenBright,
        boxShadow: `0 0 0 2px rgba(115, 192, 100, 0.28)`,
      }}
    />
  )
}

function ReadinessRing({ percent }: { percent: number }) {
  const colors = usePublicBrandColors()
  const size = 52
  const stroke = 3.5
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, Math.round(percent)))
  const dash = (clamped / 100) * c

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="svg"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        aria-hidden
        sx={{ position: 'absolute', inset: 0, display: 'block' }}
      >
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.14)"
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={colors.greenBright}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Box>
    </Box>
  )
}

/** Dark navy status card: gold headline only, technical grid, green live pulse; bullets or readiness footer. */
export function LiveStatusPanel({ headline, bullets = [], readiness }: LiveStatusPanelProps) {
  const colors = usePublicBrandColors()
  const uid = useId().replace(/:/g, '')
  const readyPct = readiness ? Math.min(100, Math.max(0, Math.round(readiness.percent))) : 0

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: statusVisualRadius.hero,
        background: `linear-gradient(160deg, ${publicLightColors.navy} 0%, ${publicLightColors.navyMid} 55%, ${publicLightColors.navyLight} 100%)`,
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        px: { xs: 3.5, sm: 4 },
        py: { xs: 4, sm: 4.5 },
      }}
    >
      <TechnicalGridOverlay uid={uid} />
      <LiveDot />

      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: readiness ? 'left' : 'center',
          pb: readiness || bullets.length ? 3.5 : 0,
          mb: readiness || bullets.length ? 3 : 0,
          borderBottom:
            readiness || bullets.length ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
        }}
      >
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 800,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.6)',
            mb: 1,
          }}
        >
          {headline.eyebrow}
        </Typography>
        <Typography
          sx={{
            fontSize: { xs: 36, sm: readiness ? 40 : 48 },
            fontWeight: 800,
            lineHeight: 1.05,
            color: colors.goldBright,
            letterSpacing: '-0.02em',
          }}
        >
          {headline.value}
        </Typography>
        {headline.caption ? (
          <Typography
            sx={{
              fontSize: 12.5,
              color: 'rgba(255, 255, 255, 0.55)',
              mt: 1,
            }}
          >
            {headline.caption}
          </Typography>
        ) : null}
      </Box>

      {readiness ? (
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ position: 'relative', zIndex: 1 }}
        >
          <ReadinessRing percent={readyPct} />
          <Box>
            <Typography
              sx={{
                fontSize: 18,
                fontWeight: 800,
                color: colors.greenBright,
                lineHeight: 1.15,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {readyPct}% ready
            </Typography>
            <Typography sx={{ fontSize: 12.5, color: 'rgba(255,255,255,0.55)', mt: 0.35 }}>
              {readyPct >= 100
                ? 'All set for this traveller'
                : `About ${Math.max(0, readiness.minutesLeft)} min left`}
            </Typography>
          </Box>
        </Stack>
      ) : (
        <Stack spacing={1.25} sx={{ position: 'relative', zIndex: 1 }}>
          {bullets.map((bullet, index) => (
            <Stack key={index} direction="row" spacing={1} alignItems="flex-start">
              <Box sx={{ color: colors.greenBright, flexShrink: 0, mt: 0.1 }}>
                <CheckCircle2 size={15} strokeWidth={2.25} />
              </Box>
              <Typography sx={{ fontSize: 13, lineHeight: 1.5, color: 'rgba(255, 255, 255, 0.82)' }}>
                {bullet}
              </Typography>
            </Stack>
          ))}
        </Stack>
      )}
    </Box>
  )
}
