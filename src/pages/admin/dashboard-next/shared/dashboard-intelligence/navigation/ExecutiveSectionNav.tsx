import { useMemo, useState } from 'react'
import { Box, Collapse, IconButton, Stack, Typography } from '@mui/material'
import { ChevronDown, ChevronUp, List } from 'lucide-react'
import { StoryNav } from '../../dashboard-ui-kit'
import { DASHBOARD_SPACING } from '../../constants'
import type { ExecutiveSectionNavItem } from '../types'
import { useScrollSpy, useSegmentSectionFocus } from './useScrollSpy'
import { useDashboardFiltersOptional } from '../filters'

export interface ExecutiveSectionNavProps {
  sections: ExecutiveSectionNavItem[]
  sticky?: boolean
  collapsibleOnMobile?: boolean
}

/**
 * Sticky executive section navigation with scroll spy + keyboard-friendly jumps.
 */
export function ExecutiveSectionNav({
  sections,
  sticky = true,
  collapsibleOnMobile = true,
}: ExecutiveSectionNavProps) {
  const { activeId, scrollToSection } = useScrollSpy({ sections })
  const filters = useDashboardFiltersOptional()
  const [mobileOpen, setMobileOpen] = useState(false)

  useSegmentSectionFocus(filters?.filters.segment ?? 'all', sections, scrollToSection)

  const items = useMemo(
    () => sections.map((section) => ({ id: section.id, label: section.label })),
    [sections],
  )

  return (
    <Box
      component="nav"
      aria-label="Executive sections"
      sx={{
        position: sticky ? 'sticky' : 'relative',
        top: sticky ? 56 : undefined,
        zIndex: (theme) => theme.zIndex.appBar - 2,
        mb: DASHBOARD_SPACING.section,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(15, 23, 42, 0.88)'
            : 'rgba(248, 250, 252, 0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid',
        borderColor: 'divider',
        px: { xs: 0.5, md: 0 },
        py: 0.5,
      }}
    >
      {collapsibleOnMobile ? (
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ display: { xs: 'flex', md: 'none' }, px: 1, py: 0.5 }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            <List size={16} />
            <Typography variant="caption" fontWeight={700}>
              Jump to section
            </Typography>
          </Stack>
          <IconButton
            size="small"
            aria-label={mobileOpen ? 'Collapse section navigation' : 'Expand section navigation'}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </IconButton>
        </Stack>
      ) : null}

      <Collapse in={!collapsibleOnMobile || mobileOpen} sx={{ display: { xs: 'block', md: 'none' } }}>
        <StoryNav items={items} activeId={activeId} onSelect={scrollToSection} />
      </Collapse>

      <Box sx={{ display: { xs: 'none', md: 'block' } }}>
        <StoryNav items={items} activeId={activeId} onSelect={scrollToSection} />
      </Box>
    </Box>
  )
}
