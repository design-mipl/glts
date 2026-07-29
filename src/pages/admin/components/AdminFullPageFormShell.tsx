import { Box, Divider, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { BaseCard } from '@/design-system/UIComponents'
import type { BreadcrumbItem } from '@/design-system/UIComponents'
import { AdminFormSectionsLayout } from './AdminFormSectionsLayout'
import { AdminRecordPageChrome } from './AdminRecordPageChrome'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from './adminFullPageFormLayout'
import type { AdminFullPageFormSectionImportance } from './adminFullPageFormLayout'
import {
  ADMIN_RECORD_PAGE_TITLE_SX,
  ADMIN_RECORD_PAGE_TITLE_VARIANT,
} from './adminRecordPageTitle'

export type { AdminFullPageFormSectionImportance }

export interface AdminFullPageFormSection {
  id: string
  title: string
  description?: string
  headerAction?: ReactNode
  /** 1 = half width on desktop; 2 = full width row in the section grid */
  span?: 1 | 2
  columns?: 1 | 2 | 3
  /** Primary = brand-tinted surface; secondary = neutral gray — see adminFullPageFormLayout.ts */
  importance?: AdminFullPageFormSectionImportance
  children: ReactNode
}

export interface AdminFullPageFormShellProps {
  breadcrumbs: BreadcrumbItem[]
  title: string
  description?: string
  headerActions?: ReactNode
  sections: AdminFullPageFormSection[]
  footer: ReactNode
}

export function AdminFullPageFormShell({
  breadcrumbs,
  title,
  description,
  headerActions,
  sections,
  footer,
}: AdminFullPageFormShellProps) {
  const { shellPaddingX, stickyFooterZIndex } = ADMIN_FULL_PAGE_FORM_LAYOUT

  return (
    <AdminRecordPageChrome breadcrumbs={breadcrumbs}>
      <BaseCard sx={{ overflow: 'visible' }}>
        <Box sx={{ px: shellPaddingX, pt: shellPaddingX, pb: 0 }}>
          <Stack
            direction={{ xs: 'column', sm: 'row' }}
            alignItems={{ xs: 'stretch', sm: 'flex-start' }}
            justifyContent="space-between"
            spacing={1.5}
          >
            <Box sx={{ minWidth: 0, flex: 1 }}>
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
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 720 }}>
                  {description}
                </Typography>
              ) : null}
            </Box>
            {headerActions ? (
              <Box
                sx={{
                  flexShrink: 0,
                  width: { xs: '100%', sm: 'auto' },
                  display: 'flex',
                  alignItems: 'center',
                  alignSelf: { xs: 'stretch', sm: 'center' },
                }}
              >
                {headerActions}
              </Box>
            ) : null}
          </Stack>

          <Divider sx={{ mt: 2, mb: 2.5 }} />
        </Box>

        <Box sx={{ px: shellPaddingX, pb: 2.5 }}>
          <AdminFormSectionsLayout sections={sections} variant="page" fieldColumnsFrom="sm" />
        </Box>

        <Box
          sx={{
            position: 'sticky',
            bottom: 0,
            zIndex: stickyFooterZIndex,
            flexShrink: 0,
            px: shellPaddingX,
            py: 2,
            bgcolor: 'background.paper',
            borderTop: 1,
            borderColor: 'divider',
          }}
        >
          {footer}
        </Box>
      </BaseCard>
    </AdminRecordPageChrome>
  )
}

/** Spans the full row in a multi-column section field grid — use for long values (names, addresses, notes). */
export function AdminFullPageFormFieldSpan({ children }: { children: ReactNode }) {
  return <Box sx={{ gridColumn: '1 / -1' }}>{children}</Box>
}
