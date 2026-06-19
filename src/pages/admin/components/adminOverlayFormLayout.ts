import type { Theme } from '@mui/material/styles'
import {
  ADMIN_FULL_PAGE_FORM_LAYOUT,
  getAdminFullPageFormSectionCardSx,
  getAdminFullPageFormSectionTitleColor,
  type AdminFullPageFormSectionImportance,
} from './adminFullPageFormLayout'

export type { AdminFullPageFormSectionImportance }

/** Modal form — short create/edit (typically 2–8 fields) */
export const ADMIN_MODAL_FORM_LAYOUT = {
  recommendedSize: 'md' as const,
  maxWidthPx: 600,
  fieldColumns: 2 as const,
  fieldGridGap: ADMIN_FULL_PAGE_FORM_LAYOUT.fieldGridGap,
  useFormSection: true,
  useSectionCards: false,
} as const

export const ADMIN_MODAL_FORM_GUIDANCE = {
  shell: 'Modal',
  fieldPattern:
    'FormSection (2 columns) + FormField + Input/Select — same grid as full-page/drawer; use AdminFullPageFormFieldSpan for full-width rows',
  footer: 'Modal footer slot — Cancel (neutral) + Save (contained)',
  whenToUse: 'Quick create/edit with few fields; no primary/secondary section cards inside the dialog.',
} as const

/** Drawer form — side panel (typically 4–12 fields) */
export const ADMIN_DRAWER_FORM_LAYOUT = {
  recommendedWidth: 480,
  /** Primary section field grid — mirrors full-page primary (2-up where fields allow) */
  primarySectionColumns: 2 as const,
  secondarySectionColumns: 1 as const,
  sectionStackGap: 2.5,
  fieldGridGap: ADMIN_FULL_PAGE_FORM_LAYOUT.fieldGridGap,
  useSectionCards: true,
} as const

export const ADMIN_DRAWER_FORM_GUIDANCE = {
  shell: 'AdminDrawerFormShell (Drawer + vertical section stack)',
  fieldPattern:
    'Same primary/secondary section cards and field grid as full-page form — sections stacked top to bottom',
  footer: 'Drawer footer slot — same action hierarchy as AdminFullPageFormFooter',
  whenToUse: 'Medium forms that need more space than a modal but should not navigate away from the listing.',
} as const

/** Stepper form — multi-step workflow */
export const ADMIN_STEPPER_FORM_LAYOUT = {
  primarySectionColumns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
  secondarySectionColumns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
  fieldGridGap: ADMIN_FULL_PAGE_FORM_LAYOUT.fieldGridGap,
  /** @deprecated Use shell padding from ADMIN_FULL_PAGE_FORM_LAYOUT */
  stepPanelPadding: 2.5,
  contentPaddingY: 2.5,
  useSectionCards: true,
} as const

export const ADMIN_STEPPER_FORM_GUIDANCE = {
  shell: 'AdminStepperFormShell — breadcrumb + back · stepper · section cards · footer',
  fieldPattern:
    'Both primary + secondary section cards on the details step (same grid as full-page form), then review on neutral surface',
  footer: 'AdminStepperFormFooter — Cancel/Back (neutral) · draft (soft) · Next/Submit (contained)',
  whenToUse: 'Long or staged workflows where users complete one group of fields at a time.',
} as const

export function getAdminOverlayFormSectionSx(
  importance: AdminFullPageFormSectionImportance,
  theme: Theme,
) {
  return {
    borderRadius: ADMIN_FULL_PAGE_FORM_LAYOUT.sectionBorderRadius,
    p: ADMIN_FULL_PAGE_FORM_LAYOUT.sectionPadding,
    ...getAdminFullPageFormSectionCardSx(importance, theme),
  }
}

export { getAdminFullPageFormSectionTitleColor }
