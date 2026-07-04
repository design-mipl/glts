import type { SxProps, Theme } from '@mui/material/styles'
import { BORDER_RADIUS, tokens } from '@/design-system/tokens'
import { FORM_CONTROL } from '@/design-system/formControl'

/** Token-derived heights for the Add VFS Service picker modal (md width). */
const modalContentUnit = tokens.spacing[16]

export const addVfsServicesModalLayout = {
  contentMinHeight: `calc(${modalContentUnit} * 7)`,
  listMinHeight: `calc(${modalContentUnit} * 5)`,
  listMaxHeight: `calc(${modalContentUnit} * 6)`,
  serviceRowMinHeight: FORM_CONTROL.heightSm,
  contextLabelMinWidth: tokens.spacing[12],
  bodyFontSize: FORM_CONTROL.fontSize,
  listBorderRadius: BORDER_RADIUS.lg,
} as const

export const addVfsServicesModalContentSx: SxProps<Theme> = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: addVfsServicesModalLayout.contentMinHeight,
  height: '100%',
}

export const addVfsServicesModalListSx: SxProps<Theme> = {
  border: 1,
  borderColor: 'divider',
  borderRadius: addVfsServicesModalLayout.listBorderRadius,
  overflow: 'hidden',
  minHeight: addVfsServicesModalLayout.listMinHeight,
  maxHeight: addVfsServicesModalLayout.listMaxHeight,
  overflowY: 'auto',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
}

export const addVfsServicesModalEmptyStateSx: SxProps<Theme> = {
  py: tokens.spacing[3],
  px: tokens.spacing[2],
  textAlign: 'center',
  flex: 1,
  minHeight: addVfsServicesModalLayout.listMinHeight,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

export const addVfsServicesModalServiceRowSx: SxProps<Theme> = {
  px: tokens.spacing[2],
  py: tokens.spacing[1],
  minHeight: addVfsServicesModalLayout.serviceRowMinHeight,
}
