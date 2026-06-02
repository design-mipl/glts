import type { SxProps, Theme } from '@mui/material/styles'

/** Bordered table surface inside AdminOverlayFormSection (stepper section cards). */
export const agreementEmbeddedTableSx: SxProps<Theme> = {
  border: 1,
  borderColor: 'divider',
  borderRadius: 2,
  overflow: 'hidden',
  bgcolor: 'background.paper',
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
