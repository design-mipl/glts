import { Box, Stack, Typography } from '@mui/material'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { PublicBrandColors } from '@/shared/theme/publicBrand'
import { retailFlowColors } from '@/pages/website/theme/retailFlowTokens'
import { statusVisualRadius, getElevatedStatusCardSx } from '@/pages/website/theme/statusVisualTokens'
import type { TravellerUploadStatusItem } from './types'

const CRITICAL_TEXT = '#DC2626'
const CRITICAL_TINT_BG = 'rgba(220, 38, 38, 0.10)'
const CRITICAL_TINT_FG = '#B91C1C'

export interface TravellerUploadStatusRowProps {
  item: TravellerUploadStatusItem
  onReupload?: (id: string) => void
}

type SemanticTone = 'high' | 'medium' | 'attention' | 'neutral'

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (!parts.length) return 'T'
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
  return parts[0].slice(0, 2).toUpperCase()
}

function statusCopy(item: TravellerUploadStatusItem): string {
  switch (item.status) {
    case 'pending':
      return 'Not uploaded yet'
    case 'uploading':
      return 'Uploading…'
    case 'processing':
      return 'Reading passport details…'
    case 'uploaded':
      return item.fileName ?? 'Uploaded'
    case 'needs_attention':
      return item.attentionReason ?? 'Needs a clearer re-upload'
  }
}

function confidenceLabel(confidence: number): string {
  if (confidence >= 85) return 'High confidence'
  if (confidence >= 60) return 'Medium confidence'
  return 'Low confidence'
}

function toneFromConfidence(confidence: number): SemanticTone {
  if (confidence >= 85) return 'high'
  if (confidence >= 60) return 'medium'
  return 'attention'
}

function avatarTone(item: TravellerUploadStatusItem): SemanticTone {
  if (item.status === 'needs_attention') return 'attention'
  if (item.status === 'uploaded' && item.quality?.confidence != null) {
    return toneFromConfidence(item.quality.confidence)
  }
  return 'neutral'
}

function avatarColors(tone: SemanticTone, colors: PublicBrandColors): { bg: string; fg: string } {
  switch (tone) {
    case 'high':
      return { bg: colors.greenMuted, fg: colors.greenDark }
    case 'medium':
      return { bg: colors.goldMuted, fg: colors.goldDark }
    case 'attention':
      return { bg: CRITICAL_TINT_BG, fg: CRITICAL_TINT_FG }
    default:
      return { bg: colors.surfaceAlt, fg: colors.textSecondary }
  }
}

function ringStroke(tone: SemanticTone, colors: PublicBrandColors): string {
  switch (tone) {
    case 'high':
      return colors.greenBright
    case 'medium':
      return colors.goldBright
    case 'attention':
      return CRITICAL_TEXT
    default:
      return colors.textMuted
  }
}

/**
 * Real SVG confidence ring — stroke-dasharray sized to %, label centered with flexbox
 * (absolute overlay + flex center, verified pattern for Chrome).
 */
function ConfidenceRing({
  confidence,
  colors,
}: {
  confidence: number
  colors: PublicBrandColors
}) {
  const size = 40
  const stroke = 3
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.min(100, Math.max(0, confidence))
  const dash = (clamped / 100) * c
  const tone = toneFromConfidence(clamped)
  const strokeColor = ringStroke(tone, colors)
  const labelColor =
    tone === 'high' ? colors.greenDark : tone === 'medium' ? colors.goldDark : CRITICAL_TINT_FG

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
          stroke={colors.border}
          strokeWidth={stroke}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={strokeColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </Box>
      <Typography
        component="span"
        sx={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
          fontSize: 10,
          fontWeight: 800,
          lineHeight: 1,
          color: labelColor,
          fontVariantNumeric: 'tabular-nums',
          fontFeatureSettings: '"tnum"',
          pointerEvents: 'none',
        }}
      >
        {clamped}%
      </Typography>
    </Box>
  )
}

function StatusIndicator({ item, colors }: { item: TravellerUploadStatusItem; colors: PublicBrandColors }) {
  if (item.status === 'pending') {
    return (
      <Typography sx={{ fontSize: 11.5, fontWeight: 600, color: colors.textMuted, flexShrink: 0 }}>
        Not uploaded
      </Typography>
    )
  }

  if (item.status === 'uploading' || item.status === 'processing') {
    return (
      <Stack direction="row" alignItems="center" spacing={0.6} sx={{ flexShrink: 0, color: colors.textSecondary }}>
        <Box
          component={Loader2}
          size={14}
          sx={{
            '@keyframes glts-upload-spin': { from: { transform: 'rotate(0deg)' }, to: { transform: 'rotate(360deg)' } },
            animation: 'glts-upload-spin 0.9s linear infinite',
          }}
        />
        <Typography sx={{ fontSize: 11.5, fontWeight: 600 }}>
          {item.status === 'uploading' ? 'Uploading' : 'Processing'}
        </Typography>
      </Stack>
    )
  }

  if (item.status === 'needs_attention') {
    return (
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0, color: CRITICAL_TEXT }}>
        <AlertTriangle size={15} />
        <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>Re-check</Typography>
      </Stack>
    )
  }

  const confidence = item.quality?.confidence
  if (confidence == null) {
    return (
      <Stack direction="row" alignItems="center" spacing={0.5} sx={{ flexShrink: 0, color: retailFlowColors.green }}>
        <CheckCircle2 size={15} />
        <Typography sx={{ fontSize: 11.5, fontWeight: 700 }}>Uploaded</Typography>
      </Stack>
    )
  }

  return (
    <Stack direction="row" alignItems="center" spacing={1} sx={{ flexShrink: 0 }}>
      <Typography sx={{ fontSize: 11, fontWeight: 600, color: colors.textSecondary }}>
        {confidenceLabel(confidence)}
      </Typography>
      <ConfidenceRing confidence={confidence} colors={colors} />
    </Stack>
  )
}

/** One row per traveller — SVG confidence ring, semantic avatar, attention = left border only. */
export function TravellerUploadStatusRow({ item, onReupload }: TravellerUploadStatusRowProps) {
  const colors = usePublicBrandColors()
  const attention = item.status === 'needs_attention'
  const av = avatarColors(avatarTone(item), colors)

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{
        px: 1.5,
        py: 1.25,
        borderRadius: statusVisualRadius.control,
        ...getElevatedStatusCardSx(colors.border),
        // Needs attention: 3px solid left border only — white/default bg, never a red fill tint.
        borderLeft: attention ? `3px solid ${CRITICAL_TEXT}` : `1px solid ${colors.border}`,
        bgcolor: colors.white,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: statusVisualRadius.full,
          bgcolor: av.bg,
          color: av.fg,
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {initials(item.name)}
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: colors.navy }} noWrap>
          {item.name}
        </Typography>
        <Typography sx={{ fontSize: 11.5, color: attention ? CRITICAL_TEXT : colors.textMuted, mt: 0.15 }} noWrap>
          {statusCopy(item)}
        </Typography>
      </Box>

      <StatusIndicator item={item} colors={colors} />

      {attention ? (
        <Box
          component="button"
          type="button"
          onClick={() => onReupload?.(item.id)}
          sx={{
            appearance: 'none',
            border: `1px solid ${CRITICAL_TEXT}33`,
            borderRadius: statusVisualRadius.control,
            bgcolor: colors.white,
            color: CRITICAL_TEXT,
            fontSize: 12,
            fontWeight: 700,
            px: 1.25,
            py: 0.6,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          Re-upload
        </Box>
      ) : null}
    </Stack>
  )
}
