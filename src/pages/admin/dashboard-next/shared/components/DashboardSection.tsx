import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { BaseCard, Button } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING, DASHBOARD_SURFACE } from '../constants'
import { isDashboardPermissionGranted } from '../utils/permission'

export interface DashboardSectionProps {
  title?: string
  subtitle?: string
  actionLabel?: string
  onAction?: () => void
  children: ReactNode
  permission?: boolean
  /** When false, render children without card chrome. */
  card?: boolean
}

export function DashboardSection({
  title,
  subtitle,
  actionLabel,
  onAction,
  children,
  permission,
  card = true,
}: DashboardSectionProps) {
  if (!isDashboardPermissionGranted(permission)) {
    return null
  }

  const header =
    title || actionLabel ? (
      <Stack
        direction="row"
        alignItems="flex-start"
        justifyContent="space-between"
        spacing={DASHBOARD_SPACING.field}
        sx={{ mb: title || subtitle ? DASHBOARD_SPACING.dense : 0 }}
      >
        <Box sx={{ minWidth: 0 }}>
          {title ? (
            <Typography
              variant="subtitle1"
              fontWeight={700}
              color="text.primary"
              sx={{ letterSpacing: -0.2 }}
            >
              {title}
            </Typography>
          ) : null}
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.35 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        {actionLabel && onAction ? (
          <Button label={actionLabel} variant="text" size="sm" onClick={onAction} />
        ) : null}
      </Stack>
    ) : null

  const body = (
    <>
      {header}
      {children}
    </>
  )

  if (!card) {
    return <Box sx={{ height: '100%' }}>{body}</Box>
  }

  return <BaseCard sx={{ ...DASHBOARD_SURFACE.sectionCardSx, height: '100%' }}>{body}</BaseCard>
}
