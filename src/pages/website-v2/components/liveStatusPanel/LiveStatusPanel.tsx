import { Box, Stack, Typography } from '@mui/material'
import { CheckCircle2 } from 'lucide-react'
import { publicLightColors, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { getAmbientGlowSx, statusVisualRadius } from '@/pages/website-v2/theme/statusVisualTokens'

export interface LiveStatusHeadline {
  /** Small uppercase label above the stat, e.g. "ESTIMATED APPROVAL". */
  eyebrow: string
  /** The one emphasis number/value — always rendered in gold, e.g. "94%" or "Aug 29". */
  value: string
  /** Optional line under the stat, e.g. "Based on your route and travel dates". */
  caption?: string
}

export interface LiveStatusPanelProps {
  headline: LiveStatusHeadline
  /** Data-backed trust lines, e.g. "94% approved on this route in last 90 days". */
  bullets: string[]
  /** Ambient bloom color behind the headline number — restrained, single color. Defaults to green so gold stays confined to the number itself. */
  glowTone?: 'green' | 'gold'
}

/** Dark navy status card: gold headline stat with an ambient glow, green trust bullets below. Not wired to a real screen yet. */
export function LiveStatusPanel({ headline, bullets, glowTone = 'green' }: LiveStatusPanelProps) {
  const colors = usePublicBrandColors()
  const glowRgb = glowTone === 'gold' ? '254, 193, 7' : '115, 192, 100'

  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        borderRadius: statusVisualRadius.hero,
        background: `linear-gradient(160deg, ${publicLightColors.navy} 0%, ${publicLightColors.navyMid} 55%, ${publicLightColors.navyLight} 100%)`,
        border: `1px solid rgba(255, 255, 255, 0.08)`,
        px: 3,
        py: 3.5,
      }}
    >
      <Box
        sx={{
          position: 'relative',
          textAlign: 'center',
          pb: 3,
          mb: 2.5,
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Box sx={{ ...getAmbientGlowSx(glowRgb, 200, 0.3) }} />
          <Typography
            sx={{
              position: 'relative',
              zIndex: 1,
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
              position: 'relative',
              zIndex: 1,
              fontSize: { xs: 40, sm: 48 },
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
                position: 'relative',
                zIndex: 1,
                fontSize: 12.5,
                color: 'rgba(255, 255, 255, 0.55)',
                mt: 1,
              }}
            >
              {headline.caption}
            </Typography>
          ) : null}
        </Box>
      </Box>

      <Stack spacing={1.25}>
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
    </Box>
  )
}
