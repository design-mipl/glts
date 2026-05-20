import MuiDivider from '@mui/material/Divider'
import Typography from '@mui/material/Typography'
import type { SxProps, Theme } from '@mui/material/styles'

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical'
  label?: string
  labelPosition?: 'left' | 'center' | 'right'
  variant?: 'fullWidth' | 'inset' | 'middle'
  sx?: SxProps<Theme>
}

const textAlignMap = {
  left: 'left',
  center: 'center',
  right: 'right',
} as const

export default function Divider({
  orientation = 'horizontal',
  label,
  labelPosition = 'center',
  variant = 'fullWidth',
  sx,
}: DividerProps) {
  if (label) {
    return (
      <MuiDivider
        orientation={orientation}
        variant={variant}
        textAlign={textAlignMap[labelPosition]}
        sx={sx}
      >
        <Typography variant="caption" color="text.secondary" sx={{ px: 1 }}>
          {label}
        </Typography>
      </MuiDivider>
    )
  }

  return (
    <MuiDivider orientation={orientation} variant={variant} sx={sx} />
  )
}
