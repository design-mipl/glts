import type { SxProps, Theme } from '@mui/material/styles'
import { BORDER_RADIUS, tokens } from '@/design-system/tokens'
import { FORM_CONTROL } from '@/design-system/formControl'

const modalContentUnit = tokens.spacing[16]

export const vfsServicePickerLayout = {
  contentMinHeight: `calc(${modalContentUnit} * 7)`,
  listMinHeight: `calc(${modalContentUnit} * 5)`,
  listMaxHeight: `calc(${modalContentUnit} * 6)`,
  serviceRowMinHeight: FORM_CONTROL.heightSm,
  contextLabelMinWidth: tokens.spacing[12],
  bodyFontSize: FORM_CONTROL.fontSize,
  listBorderRadius: BORDER_RADIUS.lg,
} as const

export const vfsServicePickerListSx: SxProps<Theme> = {
  border: 1,
  borderColor: 'divider',
  borderRadius: vfsServicePickerLayout.listBorderRadius,
  overflow: 'hidden',
  minHeight: vfsServicePickerLayout.listMinHeight,
  maxHeight: vfsServicePickerLayout.listMaxHeight,
  overflowY: 'auto',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}

export const vfsServicePickerEmptyStateSx: SxProps<Theme> = {
  py: tokens.spacing[3],
  px: tokens.spacing[2],
  textAlign: 'center',
  flex: 1,
  minHeight: vfsServicePickerLayout.listMinHeight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const vfsServicePickerServiceRowSx: SxProps<Theme> = {
  px: tokens.spacing[2],
  py: tokens.spacing[1],
  minHeight: vfsServicePickerLayout.serviceRowMinHeight,
}
