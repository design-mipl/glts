import type { SxProps, Theme } from '@mui/material/styles'
import { BUTTON, FORM_CONTROL } from './formControl'

/** Compact height for listing toolbar rows — matches Button `size="sm"`. */
export const LISTING_TOOLBAR_HEIGHT = BUTTON.minHeightSm

const listingToolbarFieldHeightOverride = {
  '& .MuiInputBase-root, & .MuiOutlinedInput-root': {
    height: LISTING_TOOLBAR_HEIGHT,
    minHeight: LISTING_TOOLBAR_HEIGHT,
  },
} as const

const iconButtonBase = {
  width: LISTING_TOOLBAR_HEIGHT,
  height: LISTING_TOOLBAR_HEIGHT,
  minWidth: LISTING_TOOLBAR_HEIGHT,
  minHeight: LISTING_TOOLBAR_HEIGHT,
  borderRadius: FORM_CONTROL.borderRadius,
  p: 0,
} as const

/** Root row for search + toolbar actions. */
export function listingToolbarRootSx(): SxProps<Theme> {
  return {
    display: 'flex',
    gap: 1.5,
    alignItems: 'center',
    width: '100%',
    flexWrap: 'wrap',
  }
}

/** Search field width + compact height aligned with toolbar buttons. */
export function listingToolbarSearchSx(): SxProps<Theme> {
  return {
    width: { xs: '100%', sm: 280 },
    flex: { xs: '1 1 100%', sm: '0 0 280px' },
    ...listingToolbarFieldHeightOverride,
  }
}

/** Right-side action cluster (export, columns, view toggle, more). */
export function listingToolbarActionsSx(): SxProps<Theme> {
  return {
    display: 'flex',
    gap: 0.75,
    alignItems: 'center',
    ml: { xs: 0, sm: 'auto' },
    flexShrink: 0,
    minHeight: LISTING_TOOLBAR_HEIGHT,
  }
}

/** Bordered icon affordances (columns, more). */
export function listingToolbarIconButtonSx(active?: boolean): SxProps<Theme> {
  return {
    ...iconButtonBase,
    border: '1px solid',
    borderColor: 'divider',
    color: active ? 'primary.main' : 'text.secondary',
  }
}

/** Table / grid view toggle group. */
export function listingToolbarViewToggleSx(): SxProps<Theme> {
  return {
    display: 'flex',
    height: LISTING_TOOLBAR_HEIGHT,
    border: '1px solid',
    borderColor: 'divider',
    borderRadius: FORM_CONTROL.borderRadius,
    overflow: 'hidden',
  }
}

/** Icon buttons inside the view toggle group. */
export function listingToolbarViewToggleButtonSx(selected: boolean): SxProps<Theme> {
  return {
    ...iconButtonBase,
    borderRadius: 0,
    bgcolor: selected ? 'action.selected' : 'transparent',
  }
}

/**
 * Apply on filter row containers (grid, stack, flex) so Select/Input match toolbar height.
 */
export function listingToolbarFiltersContainerSx(): SxProps<Theme> {
  return listingToolbarFieldHeightOverride
}

/**
 * Wrap advanced filter grids so Select/Input controls match toolbar height (32px).
 * Apply on the filter row container, not individual fields.
 */
export function listingToolbarFiltersGridSx(
  gridColumns?: string | number | Record<string, string | number>,
): SxProps<Theme> {
  return {
    display: 'grid',
    gap: 1.5,
    ...listingToolbarFieldHeightOverride,
    ...(gridColumns ? { gridTemplateColumns: gridColumns } : {}),
  }
}

/** Popover panel for listing column pickers — shared across admin/customer/DS toolbars. */
export function columnPickerPopoverPaperSx(): SxProps<Theme> {
  return {
    width: 260,
    maxWidth: 'calc(100vw - 24px)',
    borderRadius: FORM_CONTROL.borderRadius,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    overflow: 'hidden',
  }
}

/** Compact filter popover anchored to listing toolbar Filter button. */
export function listingFilterPopoverPaperSx(): SxProps<Theme> {
  return {
    width: 280,
    maxWidth: 'calc(100vw - 24px)',
    borderRadius: FORM_CONTROL.borderRadius,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    mt: 0.75,
  }
}

/** Wider filter popover for modules with many filter fields. */
export function listingFilterPopoverWidePaperSx(): SxProps<Theme> {
  return {
    width: 380,
    maxWidth: 'calc(100vw - 24px)',
    borderRadius: FORM_CONTROL.borderRadius,
    border: '1px solid',
    borderColor: 'divider',
    boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    mt: 0.75,
  }
}
