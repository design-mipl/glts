import { Box, Typography } from '@mui/material'
import { ImageIcon } from 'lucide-react'
import { usePublicBrandColors, brandPrimaryGreenRgb } from '../../../theme/publicSiteTokens'

interface ImagePlaceholderProps {
  label?: string
  aspectRatio?: string | number
  height?: number | string | Record<string, number | string>
  borderRadius?: string | number
  minHeight?: number | string | Record<string, number | string>
  /** Soft blend mode for hero media (no card chrome). */
  blend?: boolean
}

/** Neutral media slot for photography that will be supplied later. */
export function ImagePlaceholder({
  label = 'Image placeholder',
  aspectRatio,
  height,
  borderRadius = '16px',
  minHeight,
  blend = false,
}: ImagePlaceholderProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      role="img"
      aria-label={label}
      sx={{
        position: 'relative',
        width: '100%',
        height: height ?? (aspectRatio ? undefined : '100%'),
        minHeight,
        aspectRatio: aspectRatio ?? undefined,
        borderRadius: blend ? 0 : borderRadius,
        overflow: 'hidden',
        bgcolor: colors.surfaceAlt,
        border: blend ? 'none' : `1px dashed rgba(${brandPrimaryGreenRgb}, 0.28)`,
        backgroundImage: `
          linear-gradient(135deg, rgba(${brandPrimaryGreenRgb}, 0.08) 0%, transparent 48%),
          linear-gradient(180deg, ${colors.surface} 0%, ${colors.surfaceAlt} 100%)
        `,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 1,
        boxSizing: 'border-box',
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          bgcolor: `rgba(${brandPrimaryGreenRgb}, 0.12)`,
          border: `1px solid rgba(${brandPrimaryGreenRgb}, 0.22)`,
        }}
      >
        <ImageIcon size={22} color={colors.greenBright} strokeWidth={1.75} aria-hidden />
      </Box>
      <Typography
        sx={{
          fontSize: '12px',
          fontWeight: 600,
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          color: colors.textSecondary,
          px: 2,
          textAlign: 'center',
        }}
      >
        {label}
      </Typography>
    </Box>
  )
}
