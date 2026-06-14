import { Box } from '@mui/material'
import type { ReactNode } from 'react'
import { Button } from '@/design-system/UIComponents'
import { tokens } from '@/design-system/tokens'

export interface AdminFullPageFormFooterProps {
  onCancel?: () => void
  cancelLabel?: string
  onDraft?: () => void
  draftLabel?: string
  onSave?: () => void
  saveLabel?: string
  loading?: boolean
  disabled?: boolean
  /** Additional actions before primary Save (e.g. Save & Assign) */
  extraActions?: ReactNode
}

/**
 * Standard full-page form footer actions — matches DS FormActions button hierarchy:
 * Cancel (neutral gray) · optional draft (soft) · extras · Save (contained primary)
 */
export function AdminFullPageFormFooter({
  onCancel,
  cancelLabel = 'Cancel',
  onDraft,
  draftLabel = 'Save draft',
  onSave,
  saveLabel = 'Save',
  loading = false,
  disabled = false,
  extraActions,
}: AdminFullPageFormFooterProps) {
  const isDisabled = disabled || loading

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'flex-end',
        flexWrap: 'wrap',
        gap: tokens.spacing[3],
      }}
    >
      {onCancel ? (
        <Button
          variant="neutral"
          onClick={onCancel}
          disabled={isDisabled}
          fullWidth
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {cancelLabel}
        </Button>
      ) : null}
      {onDraft ? (
        <Button
          variant="soft"
          color="primary"
          onClick={onDraft}
          disabled={isDisabled}
          fullWidth
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {draftLabel}
        </Button>
      ) : null}
      {extraActions}
      {onSave ? (
        <Button
          variant="contained"
          color="primary"
          onClick={onSave}
          disabled={isDisabled}
          loading={loading}
          fullWidth
          sx={{ width: { xs: '100%', sm: 'auto' } }}
        >
          {saveLabel}
        </Button>
      ) : null}
    </Box>
  )
}

/** Primary header action for full-page forms */
export function AdminFullPageFormHeaderSave(props: {
  onClick?: () => void
  label?: string
  loading?: boolean
  disabled?: boolean
}) {
  const { onClick, label = 'Save', loading = false, disabled = false } = props
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      loading={loading}
      disabled={disabled || loading}
    >
      {label}
    </Button>
  )
}
