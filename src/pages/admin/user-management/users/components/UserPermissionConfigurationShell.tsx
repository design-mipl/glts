import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { BaseCard } from '@/design-system/UIComponents'
import { AdminRecordPageChrome } from '@/pages/admin/components/AdminRecordPageChrome'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from '@/pages/admin/components/adminFullPageFormLayout'
import {
  ADMIN_RECORD_PAGE_TITLE_SX,
  ADMIN_RECORD_PAGE_TITLE_VARIANT,
} from '@/pages/admin/components/adminRecordPageTitle'

export interface UserPermissionConfigurationShellProps {
  breadcrumbs: BreadcrumbItem[]
  title: string
  description?: string
  userContext?: ReactNode
  mainPanel: ReactNode
  summaryPanel: ReactNode
  footer: ReactNode
}

export function UserPermissionConfigurationShell({
  breadcrumbs,
  title,
  description,
  userContext,
  mainPanel,
  summaryPanel,
  footer,
}: UserPermissionConfigurationShellProps) {
  const { shellPaddingX, stickyFooterZIndex } = ADMIN_FULL_PAGE_FORM_LAYOUT

  return (
    <AdminRecordPageChrome breadcrumbs={breadcrumbs}>
      <Stack spacing={2}>
        <BaseCard sx={{ overflow: 'visible' }}>
          <Box sx={{ px: shellPaddingX, pt: shellPaddingX, pb: shellPaddingX }}>
            <Stack spacing={1}>
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
                <Typography variant="body2" color="text.secondary" sx={{ maxWidth: 720 }}>
                  {description}
                </Typography>
              ) : null}
              {userContext}
            </Stack>
          </Box>
        </BaseCard>

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', lg: 'minmax(0, 1fr) 320px' },
            gap: 2,
            alignItems: 'start',
          }}
        >
          <BaseCard sx={{ p: 2.5, minWidth: 0 }}>{mainPanel}</BaseCard>
          <Box
            sx={{
              position: { lg: 'sticky' },
              top: { lg: 72 },
              alignSelf: 'start',
            }}
          >
            <BaseCard sx={{ p: 2.5 }}>
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5 }}>
                Permission summary
              </Typography>
              {summaryPanel}
            </BaseCard>
          </Box>
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
          }}
        >
          {footer}
        </Box>
      </Stack>
    </AdminRecordPageChrome>
  )
}
