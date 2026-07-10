import { Box, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { BaseCard } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { HelpSupportSectionNavItem } from '../config/helpSupportSections'

interface HelpSupportWorkspaceShellProps {
  sections: HelpSupportSectionNavItem[]
  activeSectionId: string
  onSectionClick: (sectionId: string) => void
  contentPanel: ReactNode
  /** Left nav heading — defaults to "Sections" (agreement workspace pattern). */
  navTitle?: string
}

export function HelpSupportWorkspaceShell({
  sections,
  activeSectionId,
  onSectionClick,
  contentPanel,
  navTitle = 'Sections',
}: HelpSupportWorkspaceShellProps) {
  const colors = usePublicBrandColors()
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
        </Box>

        <Box sx={{ p: panelPadding, minWidth: 0 }}>{contentPanel}</Box>
      </Box>
    </BaseCard>
  )
}
