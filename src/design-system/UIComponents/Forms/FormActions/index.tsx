import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'
import { Button } from '../../Primitives'

type FormActionAlign = 'left' | 'center' | 'right'
type SubmitVariant = 'contained' | 'outlined' | 'soft'
type SubmitColor = 'primary' | 'error' | 'success'

export interface FormActionsProps {
  submitLabel?: string
  cancelLabel?: string
  onSubmit?: () => void
  onCancel?: () => void
  loading?: boolean
  disabled?: boolean
  submitVariant?: SubmitVariant
  submitColor?: SubmitColor
  align?: FormActionAlign
  extraActions?: ReactNode
  sticky?: boolean
  sx?: SxProps<Theme>
}

function getJustifyContent(align: FormActionAlign): string {
  if (align === 'left') {
    return 'flex-start'
  }
  if (align === 'center') {
    return 'center'
  }
  return 'space-between'
}

export default function FormActions({
  submitLabel = 'Save',
  cancelLabel = 'Cancel',
  onSubmit,
  onCancel,
  loading = false,
  disabled = false,
  submitVariant = 'contained',
  submitColor = 'primary',
  align = 'right',
  extraActions,
  sticky = false,
  sx,
}: FormActionsProps) {
  const showLeadingExtras = align === 'right'

  return (
    <Box
      sx={[
        {
          position: sticky ? 'sticky' : 'static',
          bottom: sticky ? 0 : 'auto',
          backgroundColor: sticky ? 'background.paper' : 'transparent',
          borderTop: sticky ? '1px solid' : 'none',
          borderColor: sticky ? 'divider' : 'transparent',
          py: sticky ? tokens.spacing[4] : 0,
        },
        ...(Array.isArray(sx) ? sx : sx ? [sx] : []),
      ]}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'stretch', sm: 'center' },
          justifyContent: { xs: 'stretch', sm: getJustifyContent(align) },
          gap: tokens.spacing[3],
        }}
      >
        {showLeadingExtras ? <Box>{extraActions}</Box> : null}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: tokens.spacing[3],
            justifyContent:
              align === 'left' ? 'flex-start' : align === 'center' ? 'center' : 'flex-end',
            width: { xs: '100%', sm: 'auto' },
          }}
        >
          <Button
            variant="neutral"
            onClick={onCancel}
            disabled={disabled || loading}
            fullWidth
          >
            {cancelLabel}
          </Button>
          <Button
            variant={submitVariant}
            color={submitColor}
            onClick={onSubmit}
            disabled={disabled || loading}
            startIcon={loading ? <CircularProgress size={16} color="inherit" /> : undefined}
            fullWidth
          >
            {submitLabel}
          </Button>
        </Box>
        {!showLeadingExtras ? <Box>{extraActions}</Box> : null}
      </Box>
    </Box>
  )
}
