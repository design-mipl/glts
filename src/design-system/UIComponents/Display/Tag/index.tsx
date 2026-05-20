import Chip from '@mui/material/Chip'
import chroma from 'chroma-js'
import type { SxProps, Theme } from '@mui/material/styles'

export interface TagProps {
  label: string
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
    return '#ffffff'
  }
}

export default function Tag({
  label,
  color = '#6366F1',
  onDelete,
  onClick,
  size = 'md',
  sx,
}: TagProps) {
  const textColor = deriveTextColor(color)
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
          borderRadius: '9999px',
          bgcolor: color,
          color: textColor,
          cursor: onClick ? 'pointer' : 'default',
          '& .MuiChip-deleteIcon': { color: textColor, opacity: 0.7 },
          '& .MuiChip-label': { px: '8px' },
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    />
  )
}
