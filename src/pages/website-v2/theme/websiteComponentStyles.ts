import type { SxProps, Theme } from '@mui/material/styles'
import { websiteDesignSystem as ds } from './websiteDesignSystem'

/** Standard public-site button variant; marketing and product variants live beside it in the DS. */
export const websiteButtonSx: SxProps<Theme> = {
  minHeight: ds.component.button.website.minHeight,
  borderRadius: `${ds.component.button.website.radius}px`,
  fontSize: `${ds.component.button.website.fontSize}px`,
  fontWeight: ds.component.button.website.fontWeight,
  px: `${ds.component.button.website.paddingX}px`,
  '&.MuiButton-containedPrimary': { backgroundColor: ds.semanticColor.interactive.primaryDefault, color: ds.color.onBrand },
  '&.MuiButton-containedPrimary:hover': { backgroundColor: ds.semanticColor.interactive.primaryHover, color: ds.color.onBrand },
  '&.MuiButton-containedPrimary:active': { backgroundColor: ds.semanticColor.interactive.primaryPressed, color: ds.semanticColor.text.inverse },
  '&.MuiButton-containedPrimary.Mui-disabled': { backgroundColor: ds.semanticColor.interactive.primaryDisabled, color: ds.semanticColor.text.secondary },
  '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 2 },
}

/** Shared public-site dimensions and focus state for Input, Select and Textarea. */
export const websiteFieldSx: SxProps<Theme> = {
  minWidth: 220,
  '& .MuiOutlinedInput-root': {
    minHeight: ds.component.field.website.minHeight,
    borderRadius: `${ds.component.field.website.radius}px`,
  },
  '& .MuiOutlinedInput-root.Mui-focused': {
    outline: `2px solid ${ds.color.focus}`,
    outlineOffset: 2,
  },
  '& .MuiOutlinedInput-root:hover:not(.Mui-disabled) .MuiOutlinedInput-notchedOutline': {
    borderColor: ds.semanticColor.border.strong,
  },
  '& .MuiOutlinedInput-root.Mui-disabled': {
    backgroundColor: ds.semanticColor.surface.subtle,
  },
}
