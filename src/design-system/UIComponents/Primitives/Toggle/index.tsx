import MuiSwitch from '@mui/material/Switch'
import FormControlLabel from '@mui/material/FormControlLabel'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'
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

const switchScale = { sm: 0.75, md: 1, lg: 1.25 }

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
  const scale = switchScale[size]

  const switchEl = (
    <MuiSwitch
      checked={checked}
      defaultChecked={defaultChecked}
      onChange={onChange ? (e) => onChange(e.target.checked) : undefined}
      disabled={disabled}
      color={color}
      sx={{
        ...(scale !== 1 ? { transform: `scale(${scale})` } : {}),
        '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
          opacity: 1,
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
        sx={[controlLabelSx(theme), ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}
      />
    )
  }

  return <Box sx={sx}>{switchEl}</Box>
}
