import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import { FORM_CONTROL } from '../../../formControl'

const bodyFontSize = FORM_CONTROL.fontSize
const bodyLineHeight = FORM_CONTROL.textareaLineHeight

function proseBlockSx(theme: Theme, isDark: boolean) {
  return {
    '& p': {
      m: 0,
      fontSize: bodyFontSize,
      lineHeight: bodyLineHeight,
      fontWeight: 400,
      '& + p': { mt: 0.75 },
    },
    '& h1': { fontSize: '1.5em', fontWeight: 700, mt: 1, mb: 0.5, lineHeight: 1.3 },
    '& h2': { fontSize: '1.25em', fontWeight: 700, mt: 1, mb: 0.5, lineHeight: 1.35 },
    '& h3': { fontSize: '1.1em', fontWeight: 700, mt: 1, mb: 0.5, lineHeight: 1.4 },
    '& ul, & ol': { pl: 3, my: 0.5, fontSize: bodyFontSize, lineHeight: bodyLineHeight },
    '& li': { fontSize: bodyFontSize, lineHeight: bodyLineHeight },
    '& blockquote': {
      borderLeft: `3px solid ${theme.palette.divider}`,
      pl: 2,
      color: theme.palette.text.secondary,
      my: 1,
      fontSize: bodyFontSize,
      lineHeight: bodyLineHeight,
    },
    '& code': {
      fontFamily: 'monospace',
      fontSize: '0.875em',
      bgcolor: alpha(theme.palette.text.primary, 0.06),
      px: 0.5,
      borderRadius: 0.5,
    },
    '& pre': {
      bgcolor: isDark ? alpha(theme.palette.common.white, 0.05) : alpha(theme.palette.text.primary, 0.04),
      borderRadius: 1,
      p: 1.5,
      overflow: 'auto',
      '& code': { bgcolor: 'transparent', p: 0 },
    },
    '& a': { color: theme.palette.primary.main, cursor: 'pointer' },
  } as const
}

/** Shared ProseMirror / rich-text content styles for editor and read-only display. */
export function getRichTextProseSx(theme: Theme, options?: { minHeight?: number }) {
  const isDark = theme.palette.mode === 'dark'
  const minHeight = options?.minHeight
  const blocks = proseBlockSx(theme, isDark)

  return {
    fontSize: bodyFontSize,
    fontFamily: theme.typography.fontFamily,
    lineHeight: bodyLineHeight,
    color: 'text.primary',
    ...blocks,
    '& .ProseMirror': {
      outline: 'none',
      fontSize: bodyFontSize,
      fontFamily: theme.typography.fontFamily,
      lineHeight: bodyLineHeight,
      fontWeight: 400,
      color: theme.palette.text.primary,
      ...(minHeight != null ? { minHeight } : {}),
      ...blocks,
    },
  } as const
}
