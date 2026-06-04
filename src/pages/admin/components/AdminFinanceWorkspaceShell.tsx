import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { BaseCard } from '@/design-system/UIComponents'
import { AdminRecordPageChrome } from './AdminRecordPageChrome'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from './adminFullPageFormLayout'
import {
  ADMIN_RECORD_PAGE_TITLE_SX,
  ADMIN_RECORD_PAGE_TITLE_VARIANT,
} from './adminRecordPageTitle'

export interface AdminFinanceWorkspaceShellProps {
  breadcrumbs: BreadcrumbItem[]
  title: string
  description?: string
  headerActions?: ReactNode
  leftPanel: ReactNode
  centerPanel: ReactNode
  rightPanel?: ReactNode
  footer: ReactNode
}

export function AdminFinanceWorkspaceShell({
  breadcrumbs,
  title,
  description,
  headerActions,
  leftPanel,
  centerPanel,
  rightPanel,
  footer,
}: AdminFinanceWorkspaceShellProps) {
  const { shellPaddingX, stickyFooterZIndex } = ADMIN_FULL_PAGE_FORM_LAYOUT

  return (
    <AdminRecordPageChrome breadcrumbs={breadcrumbs}>
      <Stack spacing={2}>
        <BaseCard sx={{ overflow: 'visible' }}>
          <Box sx={{ px: shellPaddingX, pt: shellPaddingX, pb: shellPaddingX }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              alignItems={{ xs: 'stretch', sm: 'center' }}
              justifyContent="space-between"
              spacing={1.5}
            >
              <Box sx={{ minWidth: 0 }}>
                <Typography
                  variant={ADMIN_RECORD_PAGE_TITLE_VARIANT}
                  component="h1"
                  fontWeight={700}
                  color="text.primary"
                  sx={ADMIN_RECORD_PAGE_TITLE_SX}
                >
                  {title}
                </Typography>
                {description ? (
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75, maxWidth: 720 }}>
                    {description}
                  </Typography>
                ) : null}
              </Box>
              {headerActions ? (
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {headerActions}
                </Stack>
              ) : null}
            </Stack>
          </Box>
        </BaseCard>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              lg: rightPanel
                ? 'minmax(0, 1fr) minmax(0, 1fr) 320px'
                : 'minmax(0, 1fr) minmax(0, 1fr)',
            },
            gap: 2,
            alignItems: 'start',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>{leftPanel}</Box>
          <Box sx={{ minWidth: 0 }}>{centerPanel}</Box>
          {rightPanel ? (
            <Box
              sx={{
                position: { lg: 'sticky' },
                top: { lg: 72 },
                alignSelf: 'start',
              }}
            >
              {rightPanel}
            </Box>
          ) : null}
        </Box>

        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: stickyFooterZIndex,
            bgcolor: 'background.default',
            borderTop: 1,
            borderColor: 'divider',
            px: shellPaddingX,
            py: 2,
            mt: 1,
          }}
        >
          {footer}
        </Box>
      </Stack>
    </AdminRecordPageChrome>
  )
}
