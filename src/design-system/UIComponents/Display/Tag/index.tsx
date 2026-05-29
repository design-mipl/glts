import Chip from '@mui/material/Chip'
import chroma from 'chroma-js'
import type { SxProps, Theme } from '@mui/material/styles'
import { BORDER_RADIUS, BORDER_WIDTH } from '../../../tokens'

export type TagVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'custom'

const VARIANT_COLORS: Record<Exclude<TagVariant, 'custom'>, { bg: string; text: string }> = {
  default: { bg: '#DBEAFE', text: '#1D4ED8' },
  success: { bg: '#DCFCE7', text: '#15803D' },
  warning: { bg: '#FEF3C7', text: '#92400E' },
  error:   { bg: '#FEE2E2', text: '#B91C1C' },
  info:    { bg: '#CFFAFE', text: '#0E7490' },
  neutral: { bg: '#F3F4F6', text: '#374151' },
}

export interface TagProps {
  label: string
  variant?: TagVariant
  color?: string
  onDelete?: () => void
  onClick?: () => void
  size?: 'sm' | 'md'
  sx?: SxProps<Theme>
}

function deriveTextColor(bg: string): string {
  try {
    return chroma.contrast(bg, '#ffffff') > 2.5 ? '#ffffff' : '#111111'
  } catch {
    return '#111111'
  }
}

export default function Tag({
  label,
  variant = 'default',
  color,
  onDelete,
  onClick,
  size = 'md',
  sx,
}: TagProps) {
  const isCustom = variant === 'custom' || !!color
  const resolvedColor = color ?? '#6366F1'
  const bgColor = isCustom ? resolvedColor : VARIANT_COLORS[variant as Exclude<TagVariant, 'custom'>].bg
  const textColor = isCustom ? deriveTextColor(resolvedColor) : VARIANT_COLORS[variant as Exclude<TagVariant, 'custom'>].text

  const height = size === 'sm' ? 20 : 24
  const fontSize = size === 'sm' ? '11px' : '12px'

  return (
    <Chip
      label={label}
      size="small"
      onClick={onClick}
      onDelete={onDelete}
      sx={[
        {
          height,
          fontSize,
          fontWeight: 500,
          borderRadius: BORDER_RADIUS.md,
          border: `${BORDER_WIDTH.thin} solid`,
          borderColor: isCustom
            ? `${chroma(resolvedColor).alpha(0.3).css()}`
            : `${chroma(textColor).alpha(0.3).css()}`,
          bgcolor: bgColor,
          color: textColor,
          cursor: onClick ? 'pointer' : 'default',
          '& .MuiChip-deleteIcon': {
            color: textColor,
            opacity: 0.6,
            fontSize: '14px',
            '&:hover': { opacity: 1, color: textColor },
          },
          '& .MuiChip-label': { px: '8px' },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}
