import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Breadcrumb } from '@/design-system/UIComponents'
import type { BreadcrumbItem } from '@/design-system/UIComponents'

export interface AdminPageHeaderProps {
  title: string
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  titleSx?: Record<string, unknown>
  description?: string
  eyebrow?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  meta?: ReactNode
}

export function AdminPageHeader({
  title,
  titleVariant = 'h4',
  titleSx,
  description,
  eyebrow,
  breadcrumbs,
  actions,
  meta,
}: AdminPageHeaderProps) {
  return (
    <Box sx={{ mb: 3 }}>
      {breadcrumbs && breadcrumbs.length > 0 ? (
        <Breadcrumb items={breadcrumbs} sx={{ mb: 1.5 }} />
      ) : null}

      <Stack
        direction={{ xs: 'column', md: 'row' }}
        alignItems={{ xs: 'flex-start', md: 'center' }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box sx={{ minWidth: 0 }}>
          {eyebrow ? (
            <Typography
              variant="overline"
              color="text.secondary"
              sx={{ fontWeight: 700, letterSpacing: 0.8 }}
            >
              {eyebrow}
            </Typography>
          ) : null}
          <Typography
            variant={titleVariant}
            component="h1"
            fontWeight={700}
            color="text.primary"
            sx={titleSx}
          >
            {title}
          </Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
              {description}
            </Typography>
          ) : null}
          {meta ? <Box sx={{ mt: 1.5 }}>{meta}</Box> : null}
        </Box>

        {actions ? (
          <Box sx={{ flexShrink: 0, width: { xs: '100%', md: 'auto' } }}>
            {actions}
          </Box>
        ) : null}
      </Stack>
    </Box>
  )
}
