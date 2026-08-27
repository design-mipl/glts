import { Box, Stack, Typography } from '@mui/material'
import { CircleHelp, Upload } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { brandPrimaryGreenRgb, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { retailFlowColors, retailFlowLayout } from '@/pages/website-v2/theme/retailFlowTokens'

export type DocumentChecklistStatusTone = 'original' | 'completed' | 'neutral'

interface DocumentChecklistRowProps {
  icon: LucideIcon
  name: string
  description?: string
  completed?: boolean
  optional?: boolean
  onInfoClick: () => void
  /** Required when no `statusTag` — drives the Upload control. */
  onFileSelect?: (file: File) => void
  /**
   * When set, replaces Upload / Completed (e.g. Original Documents step
   * with an "Original required" annotation).
   */
  statusTag?: {
    label: string
    tone?: DocumentChecklistStatusTone
  }
}

function statusTagSx(tone: DocumentChecklistStatusTone, colors: ReturnType<typeof usePublicBrandColors>) {
  if (tone === 'original') {
    return {
      bgcolor: 'rgba(146, 96, 14, 0.1)',
      color: '#92600E',
      border: '1px solid rgba(146, 96, 14, 0.22)',
    }
  }
  if (tone === 'completed') {
    return {
      bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.12)`,
      color: retailFlowColors.green,
      border: '1px solid transparent',
    }
  }
  return {
    bgcolor: colors.surfaceAlt,
    color: colors.textSecondary,
    border: `1px solid ${colors.border}`,
  }
}

export function DocumentChecklistRow({
  icon: Icon,
  name,
  description,
  completed = false,
  optional = false,
  onInfoClick,
  onFileSelect,
  statusTag,
}: DocumentChecklistRowProps) {
  const colors = usePublicBrandColors()
  const tagTone = statusTag?.tone ?? 'neutral'

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.25}
      sx={{
        px: 1.25,
        py: 1.35,
        borderRadius: retailFlowLayout.controlRadius,
        '&:hover': { bgcolor: colors.surfaceAlt },
      }}
    >
      <Box
        sx={{
          width: 34,
          height: 34,
          borderRadius: '50%',
          border: `1px solid ${colors.border}`,
          color: colors.textSecondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          bgcolor: colors.white,
        }}
      >
        <Icon size={15} strokeWidth={1.75} />
      </Box>

      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Stack direction="row" alignItems="center" spacing={0.75}>
          <Typography sx={{ fontSize: 14, fontWeight: 600, color: colors.navy }}>
            {name}
            {optional ? ' (optional)' : ''}
          </Typography>
          <Box
            component="button"
            type="button"
            aria-label={`Why we ask about ${name}`}
            onClick={onInfoClick}
            sx={{
              appearance: 'none',
              border: 'none',
              background: 'none',
              p: 0,
              m: 0,
              cursor: 'pointer',
              color: colors.textMuted,
              display: 'inline-flex',
              '&:hover': { color: colors.greenDark },
            }}
          >
            <CircleHelp size={14} />
          </Box>
        </Stack>
        {description ? (
          <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.25 }}>
            {description}
          </Typography>
        ) : null}
      </Box>

      {statusTag ? (
        <Box
          sx={{
            flexShrink: 0,
            px: 1.1,
            py: 0.4,
            borderRadius: 999,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            ...statusTagSx(tagTone, colors),
          }}
        >
          {statusTag.label}
        </Box>
      ) : completed ? (
        <Box
          sx={{
            flexShrink: 0,
            px: 1.1,
            py: 0.4,
            borderRadius: 999,
            bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.12)`,
            color: retailFlowColors.green,
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
          }}
        >
          Completed
        </Box>
      ) : (
        <Box
          component="label"
          sx={{
            fontSize: 12,
            fontWeight: 700,
            color: colors.greenDark,
            bgcolor: colors.greenMuted,
            border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.15)`,
            borderRadius: '8px',
            px: 1.35,
            py: 0.65,
            cursor: onFileSelect ? 'pointer' : 'default',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            flexShrink: 0,
          }}
        >
          <Upload size={12} /> Upload
          {onFileSelect ? (
            <input
              type="file"
              accept="image/*,.pdf"
              hidden
              onChange={(event) => {
                const file = event.target.files?.[0]
                if (file) onFileSelect(file)
              }}
            />
          ) : null}
        </Box>
      )}
    </Stack>
  )
}
