import type { SxProps, Theme } from '@mui/material/styles'
import { BUTTON, buttonPaddingCss } from '../../formControl'

/**
 * Modal / drawer / confirm panel titles.
 * Do not use Typography variant="h6" — theme h6 is 11px (micro label), not a panel title.
 */
export const overlayHeaderTitleSx: SxProps<Theme> = {
  fontSize: '16px',
  fontWeight: 600,
  lineHeight: 1.4,
  color: 'text.primary',
}

export const overlayHeaderSubtitleSx: SxProps<Theme> = {
  fontSize: '13px',
  fontWeight: 400,
  lineHeight: 1.5,
  color: 'text.secondary',
}

/** Drawer / modal footer — same radius for outlined and contained (do not mix theme md + getPrimaryButtonSx). */
export const overlayFooterButtonSx: SxProps<Theme> = {
  textTransform: 'none',
  fontSize: BUTTON.fontSize,
  fontWeight: BUTTON.fontWeight,
  borderRadius: BUTTON.borderRadius,
  minHeight: BUTTON.minHeightMd,
  padding: buttonPaddingCss('md'),
}
