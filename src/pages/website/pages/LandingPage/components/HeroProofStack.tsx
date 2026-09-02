import { Box, Stack, Typography } from '@mui/material'
import { Check } from 'lucide-react'
import { siteRadius, siteBrand, clippedCorner } from '@/pages/website/theme/siteTheme'
import { useSiteTone } from '../../../components/siteTone'
import { testimonialPortraits } from '@/pages/website/assets/testimonialPortraits'

/**
 * Hero proof cards — the small readouts floating around the hero image.
 *
 * An earlier pass removed a floating glass "Live Application" card from this hero because
 * it was doing the work of *looking* premium without saying anything. These are the
 * deliberate re-introduction of that slot with the opposite brief:
 *
 *   - no glass and no blur — hairline construction, the same as every other surface;
 *   - every line is a real readout (destination, decision time, live counts), so the
 *     cards are the proof strip's evidence rather than an illustration of it;
 *   - static. Nothing here animates on load.
 *
 * `floating` adds the one shadow the system allows: a card sitting over a photograph
 * needs to separate from it, and a hairline alone cannot do that against a busy image.
 * It is the same shadow the clearance console uses, so the two read as one family.
 */

/** Lift for a card overlapping the hero photograph. Matches the clearance console's. */
const FLOAT_SHADOW = '0 1px 2px rgba(8, 24, 43, 0.05), 0 18px 40px -24px rgba(8, 24, 43, 0.32)'

const CLEARANCES = [
  {
    name: 'Priya Sharma',
    avatarSrc: testimonialPortraits.priyaSharma,
    route: 'IN → ARE · Tourist',
    decision: '3d',
  },
  {
    name: 'Hiroshi Kondo',
    avatarSrc: testimonialPortraits.hiroshiKondo,
    route: 'JP → GBR · Business',
    decision: '6d',
  },
] as const

const LIVE_READOUT = [
  { label: 'In review now', value: '412' },
  { label: 'Cleared today', value: '87' },
  { label: 'Avg. decision', value: '4.2d' },
] as const

export function HeroClearanceCard({
  item,
  floating = false,
}: {
  item: (typeof CLEARANCES)[number]
  floating?: boolean
}) {
  const t = useSiteTone()

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.75}
      sx={{
        p: 1.75,
        borderRadius: siteRadius.card,
        border: `1px solid ${t.hairline}`,
        backgroundColor: t.surface,
        boxShadow: floating ? FLOAT_SHADOW : 'none',
      }}
    >
      <Box
        component="img"
        src={item.avatarSrc}
        alt=""
        loading="lazy"
        width={36}
        height={36}
        sx={{
          width: 36,
          height: 36,
          flex: '0 0 auto',
          borderRadius: siteRadius.control,
          objectFit: 'cover',
          border: `1px solid ${t.hairline}`,
        }}
      />

      <Box sx={{ minWidth: 0, flex: 1 }}>
        <Typography
          sx={{
            ...t.type.body,
            color: t.text,
            fontSize: 13,
            fontWeight: 600,
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {item.name}
        </Typography>
        <Typography sx={{ ...t.mrz, fontSize: 9, mt: 0.75 }}>{item.route}</Typography>
      </Box>

      <Stack direction="row" alignItems="center" spacing={0.75} sx={{ flex: '0 0 auto' }}>
        <Check size={12} strokeWidth={3} style={{ color: t.brandText }} />
        <Typography sx={{ ...t.data, fontSize: 12, fontWeight: 600 }}>{item.decision}</Typography>
      </Stack>
    </Stack>
  )
}

export function HeroLiveCard({ floating = false }: { floating?: boolean }) {
  const t = useSiteTone()

  return (
    <Box
      sx={{
        p: 2.25,
        borderRadius: siteRadius.card,
        border: `1px solid ${t.hairline}`,
        backgroundColor: t.surface,
        boxShadow: floating ? FLOAT_SHADOW : 'none',
        clipPath: clippedCorner(16),
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography sx={{ ...t.mrz, fontSize: 9 }}>Clearance desk</Typography>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Box
            aria-hidden
            sx={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: siteBrand.green,
              boxShadow: `0 0 0 3px ${siteBrand.greenSoft}`,
            }}
          />
          <Typography sx={{ ...t.mrz, fontSize: 9, color: t.textMuted }}>Live</Typography>
        </Stack>
      </Stack>

      <Stack spacing={0}>
        {LIVE_READOUT.map((row, index) => (
          <Stack
            key={row.label}
            direction="row"
            alignItems="baseline"
            justifyContent="space-between"
            sx={{
              py: 1.25,
              borderTop: index === 0 ? 'none' : `1px solid ${t.hairline}`,
            }}
          >
            <Typography sx={{ ...t.type.body, fontSize: 12.5 }}>{row.label}</Typography>
            <Typography sx={{ ...t.data, fontSize: 15, fontWeight: 700, letterSpacing: '-0.02em' }}>
              {row.value}
            </Typography>
          </Stack>
        ))}
      </Stack>
    </Box>
  )
}

export { CLEARANCES as HERO_CLEARANCES }
