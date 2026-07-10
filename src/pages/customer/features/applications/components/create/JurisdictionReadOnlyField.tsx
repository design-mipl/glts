import { Box } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  FORM_CONTROL,
  formControlHeight,
  formControlInactiveSurface,
} from '@/design-system/formControl'

export interface JurisdictionReadOnlyFieldProps {
  value: string
  placeholder: string
}

export function JurisdictionReadOnlyField({ value, placeholder }: JurisdictionReadOnlyFieldProps) {
  const theme = useTheme()
  const colors = usePublicBrandColors()
  const inputHeight = formControlHeight('sm')
  const inactive = formControlInactiveSurface(theme)
  const trimmed = value.trim()

  return (
    <Box
      role="textbox"
      aria-readonly
      aria-label="Jurisdiction"
      sx={{
        display: 'flex',
        alignItems: 'center',
        minHeight: inputHeight,
        height: inputHeight,
        px: 1.5,
        boxSizing: 'border-box',
        bgcolor: inactive.background,
        border: `1px solid ${inactive.border}`,
        borderRadius: FORM_CONTROL.borderRadius,
        cursor: 'default',
      }}
    >
      <Box
        component="span"
        sx={{
          fontSize: trimmed ? FORM_CONTROL.fontSize : 12,
          fontWeight: trimmed ? 500 : 400,
          color: trimmed ? colors.text : colors.textMuted,
          lineHeight: 1.4,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}
      >
        {trimmed || placeholder}
      </Box>
    </Box>
  )
}
