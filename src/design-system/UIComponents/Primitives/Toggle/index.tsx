import MuiSwitch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { alpha, useTheme } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import { controlLabelSx, FORM_CONTROL } from '../../../formControl'

type ToggleColor = 'primary' | 'secondary' | 'success'
type ToggleSize = 'sm' | 'md' | 'lg'

export interface ToggleProps {
  label?: string
  description?: string
  checked?: boolean
  defaultChecked?: boolean
  onChange?: (checked: boolean) => void
  disabled?: boolean
  size?: ToggleSize
  color?: ToggleColor
  labelPlacement?: 'end' | 'start'
  sx?: SxProps<Theme>
}

const TOGGLE_SIZE = {
  sm: { width: 32, height: 18, thumb: 14, travel: 14 },
  md: { width: 40, height: 22, thumb: 18, travel: 18 },
  lg: { width: 48, height: 26, thumb: 22, travel: 22 },
} as const

const THUMB_INSET = 2

export default function Toggle({
  label,
  description,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  size = 'md',
  color = 'primary',
  labelPlacement = 'end',
  sx,
}: ToggleProps) {
  const theme = useTheme()
  const metrics = TOGGLE_SIZE[size]

  const switchEl = (
    <MuiSwitch
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
      disabled={disabled}
      color={color}
      disableRipple
      sx={{
        width: metrics.width,
        height: metrics.height,
        padding: 0,
        flexShrink: 0,
        transform: 'none',
        [theme.breakpoints.down('lg')]: {
          transform: 'none',
        },
        '& .MuiSwitch-switchBase': {
          padding: `${THUMB_INSET}px`,
          color: theme.palette.common.white,
          '&.Mui-checked': {
            transform: `translateX(${metrics.travel}px)`,
            color: theme.palette.common.white,
            '& + .MuiSwitch-track': {
              backgroundColor: theme.palette[color].main,
              opacity: 1,
            },
          },
        },
        '& .MuiSwitch-thumb': {
          width: metrics.thumb,
          height: metrics.thumb,
          boxShadow: 'none',
          backgroundColor: theme.palette.common.white,
        },
        '& .MuiSwitch-track': {
          borderRadius: metrics.height / 2,
          opacity: 1,
          backgroundColor: alpha(theme.palette.text.primary, 0.24),
          border: 0,
        },
        '& .MuiSwitch-input': {
          left: 0,
          width: '100%',
        },
        '&.Mui-disabled': {
          opacity: 0.5,
        },
      }}
    />
  )

  const labelContent = (label || description) ? (
    <Box>
      {label && (
        <Typography sx={{ fontSize: FORM_CONTROL.fontSize, fontWeight: 500, lineHeight: 1.45 }}>
          {label}
        </Typography>
      )}
      {description && (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          sx={{ fontSize: FORM_CONTROL.helperFontSize, mt: 0.25, lineHeight: 1.4 }}
        >
          {description}
        </Typography>
      )}
    </Box>
  ) : null

  if (labelContent) {
    return (
      <FormControlLabel
        control={switchEl}
        label={labelContent}
        labelPlacement={labelPlacement}
        disabled={disabled}
        sx={[
          controlLabelSx(theme),
          { gap: 2, ml: 0, mr: 0 },
          ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
        ]}
      />
    )
  }

  return <Box sx={sx}>{switchEl}</Box>
}
