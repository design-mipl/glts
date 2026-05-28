import type { Theme } from '@mui/material/styles'
import { alpha } from '@mui/material/styles'

/** Canonical form field dimensions — keep in sync with root CLAUDE.md */
export const FORM_CONTROL = {
  heightMd: '40px',
  heightSm: '34px',
  fontSize: '13px',
  labelFontSize: '13px',
  labelFontWeight: 600,
  helperFontSize: '12px',
  borderRadius: '10px',
  paddingX: '12px',
} as const

/** Canonical button dimensions — shared by MUI theme, overlays, and product CTAs */
export const BUTTON = {
  borderRadius: FORM_CONTROL.borderRadius,
  fontSize: FORM_CONTROL.fontSize,
  fontWeight: 600,
  minHeightMd: '36px',
  minHeightSm: '32px',
} as const

export function formControlHeight(size: 'sm' | 'md' = 'md'): string {
  return size === 'sm' ? FORM_CONTROL.heightSm : FORM_CONTROL.heightMd
}

/** Shared outlined field styles for DS Input/Select/DatePicker wrappers */
export function outlinedFieldSx(theme: Theme, height: string) {
  return {
    '& .MuiOutlinedInput-root, & .MuiInputBase-root': {
      height,
      fontSize: FORM_CONTROL.fontSize,
      borderRadius: FORM_CONTROL.borderRadius,
      backgroundColor: theme.palette.background.paper,
      transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: theme.palette.divider,
      borderWidth: '1px',
    },
    '& .MuiOutlinedInput-root:hover:not(.Mui-disabled):not(.Mui-focused) .MuiOutlinedInput-notchedOutline, & .MuiInputBase-root:hover:not(.Mui-disabled):not(.Mui-focused) .MuiOutlinedInput-notchedOutline':
      {
        borderColor: theme.palette.text.secondary,
      },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline':
      {
        borderColor: theme.palette.primary.main,
        borderWidth: '1.5px',
      },
    '& .MuiOutlinedInput-root.Mui-focused, & .MuiInputBase-root.Mui-focused': {
      boxShadow: `0 0 0 3px ${alpha(theme.palette.primary.main, 0.12)}`,
      borderRadius: FORM_CONTROL.borderRadius,
    },
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline, & .MuiInputBase-root.Mui-error .MuiOutlinedInput-notchedOutline':
      {
        borderColor: theme.palette.error.main,
        borderWidth: '1.5px',
      },
    '& .MuiOutlinedInput-root.Mui-error.Mui-focused, & .MuiInputBase-root.Mui-error.Mui-focused': {
      boxShadow: `0 0 0 3px ${alpha(theme.palette.error.main, 0.12)}`,
    },
    '& .MuiOutlinedInput-input, & .MuiInputBase-input': {
      padding: `0 ${FORM_CONTROL.paddingX}`,
      fontSize: FORM_CONTROL.fontSize,
      '&::placeholder': {
        color: theme.palette.text.disabled,
        opacity: 1,
      },
    },
    '& .MuiFormHelperText-root': {
      fontSize: FORM_CONTROL.helperFontSize,
      mt: '4px',
      mx: 0,
    },
  }
}
