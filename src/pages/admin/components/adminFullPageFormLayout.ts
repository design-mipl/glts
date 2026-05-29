import { alpha, type Theme } from '@mui/material/styles'

/** Section emphasis inside AdminFullPageFormShell */
export type AdminFullPageFormSectionImportance = 'primary' | 'secondary'

/** Layout tokens — keep in sync with AdminFullPageFormShell */
export const ADMIN_FULL_PAGE_FORM_LAYOUT = {
  pageStackGap: 2.5,
  sectionGridGap: 2.5,
  fieldGridGap: 3,
  sectionPadding: 2.5,
  sectionBorderRadius: 2,
  shellPaddingX: { xs: 2, md: 2.5 },
  stickyFooterZIndex: 2,
} as const

/** When to use each section surface — reference for implementers */
export const ADMIN_FULL_PAGE_FORM_SECTION_GUIDANCE: Record<
  AdminFullPageFormSectionImportance,
  {
    label: string
    useFor: string
    backgroundLight: string
    backgroundDark: string
    titleColor: string
    border: string
  }
> = {
  primary: {
    label: 'Primary',
    useFor:
      'Core / required record data: identity, classification, main workflow fields, and the first block users must complete.',
    backgroundLight: 'primary @ 5% opacity on paper',
    backgroundDark: 'primary @ 12% opacity on paper',
    titleColor: 'theme.palette.primary.main',
    border: 'theme.palette.divider',
  },
  secondary: {
    label: 'Secondary',
    useFor:
      'Supplemental / optional data: notes, assignments, metadata, audit fields, or lower-priority follow-up information.',
    backgroundLight: 'theme.palette.grey[50]',
    backgroundDark: 'white @ 4% on surface',
    titleColor: 'theme.palette.text.secondary',
    border: 'theme.palette.divider',
  },
}

export function getAdminFullPageFormSectionCardSx(
  importance: AdminFullPageFormSectionImportance,
  theme: Theme,
) {
  const mode = theme.palette.mode
  const border = { border: 1, borderColor: 'divider' as const }

  if (importance === 'primary') {
    return {
      ...border,
      bgcolor: alpha(theme.palette.primary.main, mode === 'light' ? 0.05 : 0.12),
    }
  }

  return {
    ...border,
    bgcolor: mode === 'light' ? 'grey.50' : alpha('#fff', 0.04),
  }
}

export function getAdminFullPageFormSectionTitleColor(
  importance: AdminFullPageFormSectionImportance,
): 'primary.main' | 'text.secondary' {
  return importance === 'primary' ? 'primary.main' : 'text.secondary'
}
