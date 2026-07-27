import { Box, Chip, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Breadcrumb } from '@/design-system/UIComponents'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { AdminHeaderChrome } from './AdminHeaderChrome'

export interface AdminPageHeaderProps {
  title: string
  titleVariant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  titleSx?: Record<string, unknown>
  description?: string
  eyebrow?: string
  /** Compact pill rendered beside the title (e.g. "Next"). */
  badge?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: ReactNode
  meta?: ReactNode
  /** When false, omits search + profile chrome. Default true. */
  showChrome?: boolean
}

export function AdminPageHeader({
  title,
  titleVariant = 'h4',
  titleSx,
  description,
  eyebrow,
  badge,
  breadcrumbs,
  actions,
  meta,
  showChrome = true,
}: AdminPageHeaderProps) {
  const hasBreadcrumbs = Boolean(breadcrumbs && breadcrumbs.length > 0)
  const chrome = showChrome ? <AdminHeaderChrome /> : null
  const endActions =
    actions || chrome ? (
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        flexWrap="wrap"
        useFlexGap
        sx={{ flexShrink: 0, width: { xs: hasBreadcrumbs ? 'auto' : '100%', md: 'auto' } }}
      >
        {actions}
        {chrome}
      </Stack>
    ) : null

  return (
    <Box sx={{ mb: badge ? 2 : 3 }}>
      {hasBreadcrumbs && breadcrumbs ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ mb: 1.5 }}
        >
          <Breadcrumb items={breadcrumbs} sx={{ mb: 0, minWidth: 0, flex: 1 }} />
          {endActions}
        </Stack>
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
          <Stack direction="row" alignItems="center" spacing={1.25} useFlexGap flexWrap="wrap">
            <Typography
              variant={titleVariant}
              component="h1"
              fontWeight={700}
              color="text.primary"
              sx={titleSx}
            >
              {title}
            </Typography>
            {badge ? (
              <Chip
                label={badge}
                size="small"
                color="primary"
                sx={{ height: 22, fontWeight: 700, fontSize: 11, letterSpacing: 0.2 }}
              />
            ) : null}
          </Stack>
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
              {description}
            </Typography>
          ) : null}
          {meta ? <Box sx={{ mt: 1.5 }}>{meta}</Box> : null}
        </Box>

        {!hasBreadcrumbs ? endActions : null}
      </Stack>
    </Box>
  )
}
