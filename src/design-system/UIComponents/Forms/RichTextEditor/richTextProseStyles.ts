import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'
import { tokens } from '../../../tokens'

/** Shared ProseMirror / rich-text content styles for editor and read-only display. */
export function getRichTextProseSx(theme: Theme, options?: { minHeight?: number }) {
  const isDark = theme.palette.mode === 'dark'
  const minHeight = options?.minHeight

  return {
    fontSize: tokens.fontSize.base,
    fontFamily: theme.typography.fontFamily,
    color: 'text.primary',
    '& p': { m: 0, '& + p': { mt: 0.75 } },
    '& h1': { fontSize: '1.5em', fontWeight: 700, mt: 1, mb: 0.5 },
    '& h2': { fontSize: '1.25em', fontWeight: 700, mt: 1, mb: 0.5 },
    '& h3': { fontSize: '1.1em', fontWeight: 700, mt: 1, mb: 0.5 },
    '& ul, & ol': { pl: 3, my: 0.5 },
    '& blockquote': {
      borderLeft: `3px solid ${theme.palette.divider}`,
      pl: 2,
      color: theme.palette.text.secondary,
      my: 1,
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
    ...(minHeight != null
      ? {
          '& .ProseMirror': {
            outline: 'none',
            minHeight,
          },
        }
      : {}),
  } as const
}
