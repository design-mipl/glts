import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { SxProps, Theme } from '@mui/material/styles'
import { Breadcrumb, Divider } from '@/design-system/components'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  breadcrumb?: { label: string; href?: string }[]
  actions?: ReactNode
  sx?: SxProps<Theme>
}

export default function PageHeader({
  title,
  subtitle,
  breadcrumb,
  actions,
  sx,
}: PageHeaderProps) {
  return (
    <Box sx={[{ mb: 3 }, ...(Array.isArray(sx) ? sx : sx ? [sx] : [])]}>
      {breadcrumb && <Breadcrumb items={breadcrumb} sx={{ mb: 2 }} />}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        gap={2}
        sx={{ mb: 2 }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: subtitle ? 0.75 : 0 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          )}
        </Box>
        {actions && (
          <Box sx={{ display: 'flex', gap: 1, flexShrink: 0 }}>
            {actions}
          </Box>
        )}
      </Stack>
      <Divider />
    </Box>
  )
}
