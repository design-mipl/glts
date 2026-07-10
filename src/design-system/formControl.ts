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
  paddingY: '8px',
  borderWidth: '1px',
  textareaLineHeight: 1.6,
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

/** Muted surface for read-only / view-only fields — distinct from editable but not heavy gray */
export function formControlInactiveSurface(theme: Theme) {
  return {
    background:
      theme.palette.mode === 'light'
        ? alpha(theme.palette.text.primary, 0.04)
        : alpha(theme.palette.common.white, 0.05),
    border: alpha(theme.palette.text.primary, 0.1),
  }
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

/** Select dropdown — portaled above listing cards and scroll regions */
export function selectMenuSlotProps(theme: Theme) {
  return {
    disableScrollLock: true,
    slotProps: {
      paper: {
        sx: {
          mt: 0.5,
          borderRadius: FORM_CONTROL.borderRadius,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: theme.shadows[4],
          zIndex: theme.zIndex.modal,
          '& .MuiMenuItem-root': {
            fontSize: FORM_CONTROL.fontSize,
            py: 1,
            px: 1.5,
            borderRadius: '4px',
            mx: 0.5,
            minHeight: 36,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.06),
            },
            '&.Mui-selected': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              fontWeight: 500,
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.14),
              },
            },
          },
        },
      },
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
      py: '5px',
      pl: '6px',
      pr: '32px',
      alignItems: 'flex-start',
      alignContent: 'flex-start',
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
      top: 7,
      transform: 'none',
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
    ...subtleDisabledOutlinedFieldSx(theme),
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
      color: theme.palette.text.secondary,
    },
  }
}

/** Subtle disabled field chrome — muted surface, no heavy gray fill */
export function subtleDisabledOutlinedFieldSx(theme: Theme) {
  const { background, border } = formControlInactiveSurface(theme)

  return {
    '& .MuiInputBase-root.Mui-disabled, & .MuiPickersOutlinedInput-root.Mui-disabled': {
      backgroundColor: background,
      cursor: 'default',
      opacity: 1,
      pointerEvents: 'none',
    },
    '& .MuiOutlinedInput-root.Mui-disabled .MuiOutlinedInput-notchedOutline, & .MuiInputBase-root.Mui-disabled .MuiOutlinedInput-notchedOutline':
      {
        borderColor: border,
      },
    '& .MuiInputBase-input.Mui-disabled, & .MuiSelect-select.Mui-disabled': {
      WebkitTextFillColor: theme.palette.text.secondary,
      color: theme.palette.text.secondary,
      cursor: 'default',
      opacity: 1,
    },
    '& .MuiInputLabel-root.Mui-disabled': {
      color: theme.palette.text.secondary,
    },
    '&.Mui-disabled .MuiOutlinedInput-notchedOutline': {
      borderColor: border,
    },
    '&.Mui-disabled .MuiInputBase-root': {
      backgroundColor: background,
      cursor: 'default',
      opacity: 1,
      pointerEvents: 'none',
    },
    '&.Mui-disabled .MuiSelect-select': {
      WebkitTextFillColor: theme.palette.text.secondary,
      color: theme.palette.text.secondary,
      cursor: 'default',
      opacity: 1,
    },
    '&.Mui-disabled .MuiSelect-icon': {
      color: alpha(theme.palette.text.primary, 0.28),
    },
    '& .MuiAutocomplete-endAdornment .Mui-disabled': {
      opacity: 0.35,
    },
  } as const
}

/** Read-only Input/Textarea wrapper — blocks hover/focus affordances */
export function readOnlyFieldWrapperSx(theme: Theme) {
  const { background, border } = formControlInactiveSurface(theme)

  return {
    '& .MuiOutlinedInput-root': {
      cursor: 'default',
      pointerEvents: 'none',
      backgroundColor: background,
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: border,
      },
      '&:hover .MuiOutlinedInput-notchedOutline, &.Mui-focused .MuiOutlinedInput-notchedOutline': {
        borderColor: border,
        borderWidth: FORM_CONTROL.borderWidth,
      },
    },
    '& .MuiInputBase-input, & .MuiInputBase-inputMultiline': {
      color: theme.palette.text.secondary,
      WebkitTextFillColor: theme.palette.text.secondary,
      cursor: 'default',
    },
  } as const
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

/** Force MUI X pickers (incl. Autocomplete-backed fields) to span the parent width. */
export function pickersFullWidthSx() {
  return {
    width: '100%',
    maxWidth: '100%',
    display: 'block',
    '& .MuiFormControl-root': { width: '100%', maxWidth: '100%' },
    '& .MuiAutocomplete-root': { width: '100%', maxWidth: '100%', display: 'block' },
    '& .MuiTextField-root': { width: '100%', maxWidth: '100%' },
    '& .MuiPickersTextField-root': { width: '100%', maxWidth: '100%' },
    '& .MuiPickersInputBase-root': { width: '100%', maxWidth: '100%' },
    '& .MuiOutlinedInput-root': { width: '100%', maxWidth: '100%' },
    '& .MuiInputBase-root': { width: '100%', maxWidth: '100%' },
    '& .MuiAutocomplete-inputRoot': { width: '100%', maxWidth: '100%' },
  } as const
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
    ...subtleDisabledOutlinedFieldSx(theme),
  }
}

/** Theme-level multiline exemptions — keep in sync with textareaOutlinedFieldSx */
export const multilineOutlinedInputThemeOverrides = {
  '& .MuiOutlinedInput-root.MuiInputBase-multiline': {
    minHeight: 'unset !important',
    height: 'auto !important',
    alignItems: 'flex-start',
  },
  '& .MuiOutlinedInput-inputMultiline': {
    padding: `${FORM_CONTROL.paddingY} ${FORM_CONTROL.paddingX}`,
    fontSize: FORM_CONTROL.fontSize,
    lineHeight: FORM_CONTROL.textareaLineHeight,
  },
} as const

export const multilineOutlinedInputRootOverrides = {
  '&.MuiInputBase-multiline': {
    minHeight: 'unset !important',
    height: 'auto !important',
    alignItems: 'flex-start',
  },
} as const

/** Outlined multiline field — DS Textarea wrapper (no fixed 34px height) */
export function textareaOutlinedFieldSx(theme: Theme) {
  const borderDefault = formControlBorderDefault(theme)
  const borderHover = formControlBorderHover(theme)

  return {
    ...multilineOutlinedInputThemeOverrides,
    '& .MuiInputLabel-root': {
      fontSize: FORM_CONTROL.labelFontSize,
      fontWeight: FORM_CONTROL.labelFontWeight,
      color: theme.palette.text.primary,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiOutlinedInput-root, & .MuiInputBase-root': {
      height: 'auto',
      minHeight: 'unset',
      fontSize: FORM_CONTROL.fontSize,
      borderRadius: FORM_CONTROL.borderRadius,
      backgroundColor: formControlFieldBackground(theme),
      transition: 'border-color 0.2s ease, background-color 0.2s ease',
      alignItems: 'flex-start',
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
    '& .MuiInputBase-inputMultiline': {
      lineHeight: FORM_CONTROL.textareaLineHeight,
      fontFamily: 'inherit',
      resize: 'vertical',
    },
    '& .MuiFormHelperText-root': {
      fontSize: FORM_CONTROL.helperFontSize,
      mt: '4px',
      mx: 0,
    },
    ...subtleDisabledOutlinedFieldSx(theme),
  }
}
