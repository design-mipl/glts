import { useState } from 'react'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import WarningAmberIcon from '@mui/icons-material/WarningAmber'
import { alpha } from '@mui/material/styles'
import type { SxProps, Theme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { tokens } from '../../../tokens'
import { Button } from '../../Primitives'
import Modal from '../Modal'

export interface ConfirmDialogProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void | Promise<void>
  title: string
  description?: string
  confirmLabel?: string
  cancelLabel?: string
  variant?: 'default' | 'destructive'
  loading?: boolean
  icon?: ReactNode
  sx?: SxProps<Theme>
}

export default function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  variant = 'default',
  loading = false,
  icon,
  sx,
}: ConfirmDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isLoading = loading || isSubmitting

  const resolvedIcon =
    icon ?? (
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: tokens.spacing[12],
          height: tokens.spacing[12],
          borderRadius: tokens.borderRadius.full,
          backgroundColor: (theme) =>
            alpha(
              variant === 'destructive'
                ? theme.palette.error.main
                : theme.palette.primary.main,
              0.12,
            ),
        }}
      >
        {variant === 'destructive' ? (
          <WarningAmberIcon sx={{ color: 'error.main' }} />
        ) : (
          <HelpOutlineIcon sx={{ color: 'primary.main' }} />
        )}
      </Box>
    )

  async function handleConfirm() {
    try {
      setIsSubmitting(true)
      await onConfirm()
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      size="xs"
      title=""
      hideCloseButton
      sx={sx}
      footer={
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: tokens.spacing[3],
            flexWrap: 'wrap',
          }}
        >
          <Button
            variant="outlined"
            color="secondary"
            onClick={onClose}
            disabled={isLoading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="contained"
            color={variant === 'destructive' ? 'error' : 'primary'}
            onClick={handleConfirm}
            disabled={isLoading}
            startIcon={isLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
          >
            {confirmLabel}
          </Button>
        </Box>
      }
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: tokens.spacing[3],
          py: tokens.spacing[2],
        }}
      >
        {resolvedIcon}
        <Typography variant="h6">{title}</Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        ) : null}
      </Box>
    </Modal>
  )
}
