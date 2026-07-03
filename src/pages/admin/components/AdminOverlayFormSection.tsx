import { Box, Divider, Stack, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import type { ReactNode } from 'react'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from './adminFullPageFormLayout'
import {
  getAdminOverlayFormSectionSx,
  getAdminFullPageFormSectionTitleColor,
  type AdminFullPageFormSectionImportance,
} from './adminOverlayFormLayout'

export interface AdminOverlayFormSectionProps {
  title: string
  description?: string
  importance?: AdminFullPageFormSectionImportance
  columns?: 1 | 2 | 3
  /** Breakpoint where multi-column field grids begin; `xs` = always (default `sm`). */
  fieldColumnsFrom?: 'xs' | 'sm' | 'md'
  headerAction?: ReactNode
  children: ReactNode
}

/**
 * Tinted section block for drawer / stepper step panels — same primary vs secondary
 * surfaces as AdminFullPageFormShell sections.
 */
export function AdminOverlayFormSection({
  title,
  description,
  importance = 'primary',
  columns = 1,
  fieldColumnsFrom = 'sm',
  headerAction,
  children,
}: AdminOverlayFormSectionProps) {
  const theme = useTheme()
  const fieldColumns =
    columns === 1
      ? '1fr'
      : columns === 3
        ? 'repeat(3, minmax(0, 1fr))'
        : 'repeat(2, minmax(0, 1fr))'

  return (
    <Box sx={getAdminOverlayFormSectionSx(importance, theme)}>
      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
        <Box sx={{ minWidth: 0 }}>
          <Typography
            variant="subtitle2"
            fontWeight={600}
            color={getAdminFullPageFormSectionTitleColor(importance)}
          >
            {title}
          </Typography>
          {description ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, fontSize: 12 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {headerAction ? <Box sx={{ flexShrink: 0 }}>{headerAction}</Box> : null}
      </Stack>

      <Divider sx={{ my: 2 }} />

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns:
            fieldColumnsFrom === 'xs'
              ? fieldColumns
              : {
                  xs: '1fr',
                  [fieldColumnsFrom]: fieldColumns,
                },
          gap: ADMIN_FULL_PAGE_FORM_LAYOUT.fieldGridGap,
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
