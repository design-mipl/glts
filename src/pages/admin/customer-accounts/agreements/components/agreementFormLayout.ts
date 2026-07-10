import type { SxProps, Theme } from '@mui/material/styles'

/** Bordered table surface inside AdminOverlayFormSection (stepper section cards). */
export const agreementEmbeddedTableSx: SxProps<Theme> = {
  border: 1,
  borderColor: 'divider',
  borderRadius: 2,
  overflow: 'hidden',
  bgcolor: 'background.paper',
}

/** Scrollable body for embedded tables when columns or rows exceed the workspace panel. */
export const agreementEmbeddedTableScrollSx: SxProps<Theme> = {
  overflowX: 'auto',
  overflowY: 'auto',
  maxHeight: 360,
  WebkitOverflowScrolling: 'touch',
}

/** Minimum width for wide embedded tables before horizontal scroll kicks in. */
export const agreementEmbeddedTableMinWidthSx: SxProps<Theme> = {
  minWidth: 960,
}

export function agreementFieldError(errors: Record<string, string>, key: string) {
  return {
    error: Boolean(errors[key]),
    helperText: errors[key],
  }
}

export const agreementEmbeddedTableHeadCellSx: SxProps<Theme> = {
  fontSize: 12,
  fontWeight: 600,
  color: 'text.secondary',
  textTransform: 'uppercase',
  letterSpacing: '0.04em',
  bgcolor: 'action.hover',
  borderBottom: 1,
  borderColor: 'divider',
  py: 1,
}
