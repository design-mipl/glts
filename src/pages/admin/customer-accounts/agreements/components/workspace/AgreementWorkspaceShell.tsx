import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { BaseCard } from '@/design-system/UIComponents'
import { AdminRecordPageChrome } from '@/pages/admin/components/AdminRecordPageChrome'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from '@/pages/admin/components/adminFullPageFormLayout'
import {
  ADMIN_RECORD_PAGE_TITLE_SX,
  ADMIN_RECORD_PAGE_TITLE_VARIANT,
} from '@/pages/admin/components/adminRecordPageTitle'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { BreadcrumbItem } from '@/design-system/UIComponents'

export interface AgreementWorkspaceSectionNavItem {
  id: string
  label: string
  complete?: boolean
}

interface AgreementWorkspaceShellProps {
  breadcrumbs: BreadcrumbItem[]
  title: string
  description?: string
  headerActions?: ReactNode
  sections: AgreementWorkspaceSectionNavItem[]
  activeSectionId?: string
  onSectionClick: (sectionId: string) => void
  centerPanel: ReactNode
  footer: ReactNode
}

export function AgreementWorkspaceShell({
  breadcrumbs,
  title,
  description,
  headerActions,
  sections,
  activeSectionId,
  onSectionClick,
  centerPanel,
  footer,
}: AgreementWorkspaceShellProps) {
  const colors = usePublicBrandColors()
  const { shellPaddingX, stickyFooterZIndex } = ADMIN_FULL_PAGE_FORM_LAYOUT

  const panelPadding = { xs: 2, sm: 2.5, md: 3 }

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

        <BaseCard sx={{ overflow: 'visible' }}>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', lg: '280px minmax(0, 1fr)' },
              alignItems: 'stretch',
              minHeight: { xs: 280, md: 360 },
            }}
          >
            <Box
              sx={{
                p: panelPadding,
                minWidth: 0,
                borderBottomWidth: { xs: 1, lg: 0 },
                borderBottomStyle: { xs: 'solid', lg: 'none' },
                borderBottomColor: { xs: 'divider', lg: 'transparent' },
                borderRightWidth: { lg: 1 },
                borderRightStyle: { lg: 'solid' },
                borderRightColor: { lg: 'divider' },
              }}
            >
              <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1.5, px: 0.5 }}>
                Sections
              </Typography>
              <Stack spacing={0.5}>
                {sections.map((section) => {
                  const isActive = activeSectionId === section.id
                  return (
                  <Box
                    key={section.id}
                    onClick={() => onSectionClick(section.id)}
                    sx={{
                      px: 1.5,
                      py: 1,
                      borderRadius: 1.5,
                      cursor: 'pointer',
                      bgcolor: isActive ? colors.greenMuted : 'transparent',
                      '&:hover': { bgcolor: isActive ? colors.greenMuted : 'action.hover' },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="body2" fontWeight={isActive ? 600 : 400}>
                        {section.label}
                      </Typography>
                      {section.complete !== undefined ? (
                        <Typography variant="caption" color={section.complete ? 'success.main' : 'text.disabled'}>
                          {section.complete ? '✓' : '•'}
                        </Typography>
                      ) : null}
                    </Stack>
                  </Box>
                  )
                })}
              </Stack>
            </Box>

            <Box sx={{ p: panelPadding, minWidth: 0 }}>{centerPanel}</Box>
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
      </Stack>
    </AdminRecordPageChrome>
  )
}
