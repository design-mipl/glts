import { Box, Divider, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { Mail, Phone } from 'lucide-react'
import { BaseCard } from '@/design-system/UIComponents'
import { ADMIN_FULL_PAGE_FORM_LAYOUT } from '@/pages/admin/components/adminFullPageFormLayout'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { ContactSupportSectionNavItem } from '../../config/contactSupportSections'
import { SUPPORT_CONTACT_INFO, SUPPORT_QUICK_TIPS } from '../../data/supportContactInfo'

interface ContactSupportWorkspaceShellProps {
  sections: ContactSupportSectionNavItem[]
  activeSectionId: string
  onSectionClick: (sectionId: string) => void
  contentPanel: ReactNode
  footer?: ReactNode
  navTitle?: string
}

function SidebarBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Box>
      <Typography variant="subtitle2" fontWeight={600} sx={{ fontSize: 13, mb: 1 }}>
        {title}
      </Typography>
      {children}
    </Box>
  )
}

export function ContactSupportWorkspaceShell({
  sections,
  activeSectionId,
  onSectionClick,
  contentPanel,
  footer,
  navTitle = 'Sections',
}: ContactSupportWorkspaceShellProps) {
  const colors = usePublicBrandColors()
  const { shellPaddingX, stickyFooterZIndex } = ADMIN_FULL_PAGE_FORM_LAYOUT
  const panelPadding = { xs: 2, sm: 2.5, md: 3 }

  return (
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
            {navTitle}
          </Typography>
          <Stack spacing={0.5}>
            {sections.map(section => {
              const isActive = activeSectionId === section.id
              return (
                <Box
                  key={section.id}
                  component="button"
                  type="button"
                  onClick={() => onSectionClick(section.id)}
                  sx={{
                    width: '100%',
                    px: 1.5,
                    py: 1,
                    borderRadius: 1.5,
                    border: 0,
                    cursor: 'pointer',
                    bgcolor: isActive ? colors.greenMuted : 'transparent',
                    textAlign: 'left',
                    '&:hover': { bgcolor: isActive ? colors.greenMuted : 'action.hover' },
                  }}
                >
                  <Typography variant="body2" fontWeight={isActive ? 600 : 400}>
                    {section.label}
                  </Typography>
                </Box>
              )
            })}
          </Stack>

          <Divider sx={{ my: 2 }} />

          <Stack spacing={2}>
            <SidebarBlock title="Need immediate help?">
              <Stack spacing={1.25}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Mail size={14} style={{ flexShrink: 0 }} color={colors.textMuted} />
                  <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                    {SUPPORT_CONTACT_INFO.email}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Phone size={14} style={{ flexShrink: 0 }} color={colors.textMuted} />
                  <Typography variant="body2" sx={{ fontSize: 12, fontWeight: 600 }}>
                    {SUPPORT_CONTACT_INFO.helpline}
                  </Typography>
                </Stack>
                <Box>
                  <Typography variant="caption" fontWeight={600} color="text.secondary" display="block">
                    Working hours
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, lineHeight: 1.5 }}>
                    {SUPPORT_CONTACT_INFO.workingHours}
                  </Typography>
                </Box>
              </Stack>
            </SidebarBlock>

            <Divider />

            <SidebarBlock title="Quick tips">
              <Stack component="ul" spacing={0.75} sx={{ m: 0, pl: 3 }}>
                {SUPPORT_QUICK_TIPS.map(tip => (
                  <Typography
                    key={tip}
                    component="li"
                    variant="body2"
                    color="text.secondary"
                    sx={{ fontSize: 12, lineHeight: 1.55 }}
                  >
                    {tip}
                  </Typography>
                ))}
              </Stack>
            </SidebarBlock>
          </Stack>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', minWidth: 0 }}>
          <Box sx={{ p: panelPadding, flex: 1, minWidth: 0 }}>{contentPanel}</Box>
          {footer ? (
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
          ) : null}
        </Box>
      </Box>
    </BaseCard>
  )
}
