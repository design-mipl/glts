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
  borderWidth: '1px',
} as const

/** Text-button padding: horizontal = 2 × vertical (not used for IconButton). */
export type ButtonPaddingSize = 'sm' | 'md' | 'lg'

/** Canonical button dimensions — shared by MUI theme, overlays, and product CTAs */
export const BUTTON = {
  borderRadius: FORM_CONTROL.borderRadius,
  fontSize: FORM_CONTROL.fontSize,
  fontWeight: 600,
  minHeightMd: '36px',
  minHeightSm: '32px',
  paddingSm: { y: 4, x: 8 },
  paddingMd: { y: 8, x: 16 },
  paddingLg: { y: 10, x: 20 },
} as const

/** CSS padding shorthand for MUI Button: `vertical horizontal`. */
export function buttonPaddingCss(size: ButtonPaddingSize): string {
  const map = {
    sm: BUTTON.paddingSm,
    md: BUTTON.paddingMd,
    lg: BUTTON.paddingLg,
  } as const
  const { y, x } = map[size]
  return `${y}px ${x}px`
}

export function formControlHeight(size: 'sm' | 'md' = 'sm'): string {
  return size === 'sm' ? FORM_CONTROL.heightSm : FORM_CONTROL.heightMd
}

/** Default outlined field border — matches generateTheme MuiOutlinedInput */
export function formControlBorderDefault(theme: Theme): string {
  return alpha(theme.palette.text.primary, 0.18)
}

/** Hover outlined field border */
export function formControlBorderHover(theme: Theme): string {
  return alpha(theme.palette.text.primary, 0.32)
}

export function formControlFieldBackground(theme: Theme): string {
  return theme.palette.mode === 'light'
    ? theme.palette.background.paper
    : alpha(theme.palette.background.paper, 0.6)
}

/** Label typography matching FormField — use above controls when label is external */
export function formFieldLabelSx() {
  return {
    fontSize: FORM_CONTROL.labelFontSize,
    fontWeight: FORM_CONTROL.labelFontWeight,
    color: 'text.primary',
    lineHeight: 1.4,
    display: 'block',
    mb: 0.75,
  } as const
}

/** Popper/listbox for Autocomplete — fixed strategy keeps menu aligned inside scrollable admin shells */
export function autocompleteSlotProps(theme: Theme) {
  return {
    popper: {
      placement: 'bottom-start' as const,
      disablePortal: false,
      popperOptions: {
        strategy: 'fixed' as const,
      },
      modifiers: [
        { name: 'offset', options: { offset: [0, 6] } },
        {
          name: 'preventOverflow',
          options: { rootBoundary: 'viewport', padding: 8 },
        },
        {
          name: 'flip',
          options: { fallbackPlacements: ['bottom-start', 'top-start'] as const },
        },
      ],
      sx: { zIndex: theme.zIndex.modal },
    },
    paper: {
      sx: {
        mt: 0.5,
        borderRadius: FORM_CONTROL.borderRadius,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: theme.shadows[4],
      },
    },
    listbox: {
      sx: { maxHeight: 280, py: 0.5 },
    },
  }
}

/** Autocomplete / MultiSelect / TagInput — flat outlined field with chip wrapping */
export function autocompleteOutlinedFieldSx(theme: Theme, height: string) {
  return {
    ...outlinedFieldSx(theme, height),
    '& .MuiOutlinedInput-root, & .MuiInputBase-root': {
      minHeight: height,
      height: 'auto',
      boxSizing: 'border-box',
      py: 0,
      pl: '6px',
      pr: '32px',
      alignItems: 'center',
      alignContent: 'center',
      flexWrap: 'wrap',
      gap: '6px',
      fontSize: FORM_CONTROL.fontSize,
      borderRadius: FORM_CONTROL.borderRadius,
      backgroundColor: formControlFieldBackground(theme),
      transition: 'border-color 0.2s ease, background-color 0.2s ease',
    },
    '& .MuiAutocomplete-tag': {
      margin: 0,
      display: 'inline-flex',
      alignItems: 'center',
    },
    '& .MuiAutocomplete-input': {
      minWidth: '48px !important',
      padding: '0 !important',
      margin: 0,
      alignSelf: 'center',
      fontSize: FORM_CONTROL.fontSize,
      lineHeight: 1.4,
    },
    '& .MuiAutocomplete-endAdornment': {
      position: 'absolute',
      right: 9,
      top: '50%',
      transform: 'translateY(-50%)',
      '& .MuiButtonBase-root': {
        padding: '2px',
      },
    },
    '& .MuiChip-root': {
      height: 22,
      margin: 0,
      fontSize: 12,
      borderRadius: '6px',
      '& .MuiChip-label': {
        px: 1,
        lineHeight: 1.2,
      },
    },
  }
}

/** Checkbox, toggle, and other control labels */
export function controlLabelSx(theme: Theme) {
  return {
    '& .MuiFormControlLabel-label': {
      fontSize: FORM_CONTROL.fontSize,
      fontWeight: 500,
      color: theme.palette.text.primary,
      lineHeight: 1.45,
    },
    '& .MuiFormControlLabel-label.Mui-disabled': {
      color: theme.palette.text.disabled,
    },
  }
}

/** MUI X DatePicker / DateRangePicker — v8 uses PickersOutlinedInput, not OutlinedInput */
export function pickersOutlinedFieldSx(theme: Theme, height: string) {
  const borderDefault = formControlBorderDefault(theme)
  const borderHover = formControlBorderHover(theme)
  const radius = FORM_CONTROL.borderRadius

  return {
    '& .MuiPickersOutlinedInput-root, & .MuiPickersInputBase-root': {
      height,
      minHeight: height,
      fontSize: FORM_CONTROL.fontSize,
      borderRadius: radius,
      backgroundColor: formControlFieldBackground(theme),
      transition: 'border-color 0.2s ease, background-color 0.2s ease',
    },
    '& .MuiPickersOutlinedInput-notchedOutline': {
      borderColor: borderDefault,
      borderWidth: FORM_CONTROL.borderWidth,
      borderRadius: radius,
    },
    '& .MuiPickersOutlinedInput-root:hover:not(.Mui-disabled):not(.Mui-focused) .MuiPickersOutlinedInput-notchedOutline, & .MuiPickersInputBase-root:hover:not(.Mui-disabled):not(.Mui-focused) .MuiPickersOutlinedInput-notchedOutline':
      {
        borderColor: borderHover,
      },
    '& .MuiPickersOutlinedInput-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline, & .MuiPickersInputBase-root.Mui-focused .MuiPickersOutlinedInput-notchedOutline':
      {
        borderColor: theme.palette.primary.main,
        borderWidth: FORM_CONTROL.borderWidth,
      },
    '& .MuiPickersOutlinedInput-root.Mui-error .MuiPickersOutlinedInput-notchedOutline, & .MuiPickersInputBase-root.Mui-error .MuiPickersOutlinedInput-notchedOutline':
      {
        borderColor: theme.palette.error.main,
        borderWidth: FORM_CONTROL.borderWidth,
      },
    '& .MuiPickersSectionList-root': {
      fontSize: FORM_CONTROL.fontSize,
      padding: `0 ${FORM_CONTROL.paddingX}`,
    },
    '& .MuiFormHelperText-root': {
      fontSize: FORM_CONTROL.helperFontSize,
      mt: '4px',
      mx: 0,
    },
  }
}

/** Shared outlined field styles for DS Input/Select/DatePicker wrappers */
export function outlinedFieldSx(theme: Theme, height: string) {
  const borderDefault = formControlBorderDefault(theme)
  const borderHover = formControlBorderHover(theme)

  return {
    '& .MuiInputLabel-root': {
      fontSize: FORM_CONTROL.labelFontSize,
      fontWeight: FORM_CONTROL.labelFontWeight,
      color: theme.palette.text.primary,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiOutlinedInput-root, & .MuiInputBase-root': {
      height,
      fontSize: FORM_CONTROL.fontSize,
      borderRadius: FORM_CONTROL.borderRadius,
      backgroundColor: formControlFieldBackground(theme),
      transition: 'border-color 0.2s ease, background-color 0.2s ease',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: borderDefault,
      borderWidth: FORM_CONTROL.borderWidth,
      borderRadius: FORM_CONTROL.borderRadius,
    },
    '& .MuiOutlinedInput-root:hover:not(.Mui-disabled):not(.Mui-focused) .MuiOutlinedInput-notchedOutline, & .MuiInputBase-root:hover:not(.Mui-disabled):not(.Mui-focused) .MuiOutlinedInput-notchedOutline':
      {
        borderColor: borderHover,
      },
    '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline, & .MuiInputBase-root.Mui-focused .MuiOutlinedInput-notchedOutline':
      {
        borderColor: theme.palette.primary.main,
        borderWidth: FORM_CONTROL.borderWidth,
      },
    '& .MuiOutlinedInput-root.Mui-error .MuiOutlinedInput-notchedOutline, & .MuiInputBase-root.Mui-error .MuiOutlinedInput-notchedOutline':
      {
        borderColor: theme.palette.error.main,
        borderWidth: FORM_CONTROL.borderWidth,
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
