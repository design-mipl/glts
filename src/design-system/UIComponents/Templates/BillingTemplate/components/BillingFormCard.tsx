import { Box, Typography, Card, Divider } from '@mui/material'
import type { ReactNode } from 'react'
import { Button } from '@/design-system/components'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'

export interface BillingFormCardProps {
  title: string
  subtitle?: string
  children: ReactNode
  onCancel?: () => void
  onSaveDraft?: () => void
  onSave?: () => void
  cancelLabel?: string
  saveLabel?: string
  showHeaderActions?: boolean
  showFooter?: boolean
}

export default function BillingFormCard({
  title,
  subtitle,
  children,
  onCancel,
  onSaveDraft,
  onSave,
  cancelLabel = 'Cancel',
  saveLabel = 'Save',
  showHeaderActions = true,
  showFooter = true,
}: BillingFormCardProps) {
  const actionButtons = (
    <>
      {onCancel && (
        <Button variant="outlined" color="secondary" onClick={onCancel}>
          {cancelLabel}
        </Button>
      )}
      {onSaveDraft && (
        <Button variant="outlined" color="warning" onClick={onSaveDraft}>
          Save as draft
        </Button>
      )}
      {onSave && (
        <Button variant="contained" color="primary" onClick={onSave}>
          {saveLabel}
        </Button>
      )}
    </>
  )

  return (
    <Card
      elevation={0}
      sx={{
        border: `${BORDER_WIDTH.thin} solid`,
        borderColor: 'divider',
        borderRadius: BORDER_RADIUS.lg,
        boxShadow: SHADOWS.sm,
        bgcolor: 'background.paper',
        overflow: 'hidden',
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: 2,
            mb: 3,
            pb: 2,
            borderBottom: `${BORDER_WIDTH.thin} solid`,
            borderColor: 'divider',
          }}
        >
          <Box>
            <Typography variant="h2" sx={{ mb: subtitle ? 0.5 : 0 }}>
              {title}
            </Typography>
            {subtitle ? (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            ) : null}
          </Box>
          {showHeaderActions ? (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                width: { xs: '100%', md: 'auto' },
                justifyContent: { xs: 'flex-start', md: 'flex-end' },
              }}
            >
              {actionButtons}
            </Box>
          ) : null}
        </Box>

        {children}

        {showFooter ? (
          <>
            <Divider sx={{ mt: 2, mb: 2 }} />
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'flex-end',
                gap: 1,
              }}
            >
              {actionButtons}
            </Box>
          </>
        ) : null}
      </Box>
    </Card>
  )
}
