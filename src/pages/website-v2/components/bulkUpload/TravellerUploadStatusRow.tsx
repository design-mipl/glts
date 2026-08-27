import { Box, Stack, Typography } from '@mui/material'
import { AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { PublicBrandColors } from '@/shared/theme/publicBrand'
import { retailFlowColors } from '@/pages/website-v2/theme/retailFlowTokens'
import { getConicRingBackground, statusVisualRadius } from '@/pages/website-v2/theme/statusVisualTokens'
import type { TravellerUploadStatusItem } from './types'

const CRITICAL_TEXT = '#DC2626'
const CRITICAL_BG = '#FEF2F2'
const CRITICAL_BORDER = '#FECACA'

export interface TravellerUploadStatusRowProps {
  item: TravellerUploadStatusItem
  onReupload?: (id: string) => void
}

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

/** Confidence ring — the one emphasis number on the row, always gold, ring instead of a linear bar. */
function ConfidenceRing({ confidence, colors }: { confidence: number; colors: PublicBrandColors }) {
  return (
    <Box
      sx={{
        width: 38,
        height: 38,
        borderRadius: statusVisualRadius.full,
        background: getConicRingBackground(colors.goldBright, colors.goldMuted, confidence),
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          borderRadius: statusVisualRadius.full,
          bgcolor: colors.white,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography sx={{ fontSize: 10, fontWeight: 800, color: colors.goldDark, lineHeight: 1 }}>
          {confidence}%
        </Typography>
      </Box>
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

/** One row per traveller in a bulk-upload list — status, OCR confidence ring, and a re-upload flag when needed. */
export function TravellerUploadStatusRow({ item, onReupload }: TravellerUploadStatusRowProps) {
  const colors = usePublicBrandColors()
  const attention = item.status === 'needs_attention'

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{
        px: 1.5,
        py: 1.25,
        borderRadius: statusVisualRadius.control,
        border: `1px solid ${attention ? CRITICAL_BORDER : colors.border}`,
        borderLeft: attention ? `3px solid ${CRITICAL_TEXT}` : `1px solid ${colors.border}`,
        bgcolor: attention ? CRITICAL_BG : colors.white,
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: statusVisualRadius.full,
          bgcolor: colors.surfaceAlt,
          border: `1px solid ${colors.border}`,
          color: colors.navy,
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
            bgcolor: '#fff',
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
