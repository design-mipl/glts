import type { SxProps, Theme } from '@mui/material/styles'
import { websiteDesignSystem as ds } from './websiteDesignSystem'

/** Semantic type roles for public pages; breakpoint keys map to the existing Foundation values. */
export const websiteHeadingSx = {
  display: {
    fontFamily: ds.fonts.display,
    fontSize: { xs: ds.type.display.mobile, sm: ds.type.display.tablet, xl: ds.type.display.size },
    fontWeight: ds.type.display.weight,
    lineHeight: ds.type.display.lineHeight,
    letterSpacing: ds.type.display.tracking,
  },
  h1: {
    fontFamily: ds.fonts.display,
    fontSize: { xs: ds.type.h1.mobile, lg: ds.type.h1.tablet, desktop: ds.type.h1.size },
    fontWeight: ds.type.h1.weight,
    lineHeight: ds.type.h1.lineHeight,
    letterSpacing: ds.type.h1.tracking,
  },
  h2: {
    fontFamily: ds.fonts.display,
    fontSize: { xs: ds.type.h2.mobile, lg: ds.type.h2.tablet, desktop: ds.type.h2.size },
    fontWeight: ds.type.h2.weight,
    lineHeight: ds.type.h2.lineHeight,
    letterSpacing: ds.type.h2.tracking,
  },
  h2Compact: {
    fontFamily: ds.fonts.display,
    fontSize: { xs: ds.component.text.sectionCompact.mobile, lg: ds.component.text.sectionCompact.tablet, desktop: ds.component.text.sectionCompact.size },
    fontWeight: ds.component.text.sectionCompact.weight,
    lineHeight: ds.component.text.sectionCompact.lineHeight,
    letterSpacing: ds.component.text.sectionCompact.tracking,
  },
  h3: {
    fontFamily: ds.fonts.heading,
    fontSize: { xs: ds.type.h3.mobile, lg: ds.type.h3.tablet, desktop: ds.type.h3.size },
    fontWeight: ds.type.h3.weight,
    lineHeight: ds.type.h3.lineHeight,
    letterSpacing: ds.type.h3.tracking,
  },
  cardTitle: {
    fontFamily: ds.fonts.heading,
    fontSize: { xs: ds.component.text.cardTitle.mobile, lg: ds.component.text.cardTitle.size },
    fontWeight: ds.component.text.cardTitle.weight,
    lineHeight: ds.component.text.cardTitle.lineHeight,
  },
  authTitle: {
    fontFamily: ds.fonts.display,
    fontSize: { xs: ds.component.text.authTitle.mobile, desktop: ds.component.text.authTitle.size },
    fontWeight: ds.component.text.authTitle.weight,
    lineHeight: ds.component.text.authTitle.lineHeight,
    letterSpacing: ds.component.text.authTitle.tracking,
  },
  authPanelTitle: {
    fontFamily: ds.fonts.display,
    fontSize: { xs: ds.component.text.authPanelTitle.mobile, desktop: ds.component.text.authPanelTitle.size },
    fontWeight: ds.component.text.authPanelTitle.weight,
    lineHeight: ds.component.text.authPanelTitle.lineHeight,
  },
} as const

/** Standard public-site button variant; marketing and product variants live beside it in the DS. */
export const websiteButtonSx: SxProps<Theme> = {
  minHeight: ds.component.button.website.minHeight,
  borderRadius: `${ds.component.button.website.radius}px`,
  fontSize: `${ds.component.button.website.fontSize}px`,
  fontWeight: ds.component.button.website.fontWeight,
  px: `${ds.component.button.website.paddingX}px`,
  '& .MuiButton-startIcon > svg, & .MuiButton-endIcon > svg': {
    width: `${ds.component.button.website.iconSize}px`,
    height: `${ds.component.button.website.iconSize}px`,
    flexShrink: 0,
  },
  '&.MuiButton-containedPrimary': { backgroundColor: ds.semanticColor.interactive.primaryDefault, color: ds.color.onBrand },
  '&.MuiButton-containedPrimary:hover': { backgroundColor: ds.semanticColor.interactive.primaryHover, color: ds.color.onBrand },
  '&.MuiButton-containedPrimary:active': { backgroundColor: ds.semanticColor.interactive.primaryPressed, color: ds.semanticColor.text.inverse },
  '&.MuiButton-containedPrimary.Mui-disabled': { backgroundColor: ds.semanticColor.interactive.primaryDisabled, color: ds.semanticColor.text.secondary },
  '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 2 },
}

/** Standard public outlined action; hero-specific styles may opt into the 48px marketing size. */
export const websiteSecondaryButtonSx: SxProps<Theme> = {
  minHeight: ds.component.button.website.minHeight,
  borderRadius: `${ds.component.button.website.radius}px`,
  fontSize: `${ds.component.button.website.fontSize}px`,
  fontWeight: ds.component.button.website.fontWeight,
  textTransform: 'none',
  px: `${ds.component.button.website.paddingX}px`,
  '& .MuiButton-startIcon > svg, & .MuiButton-endIcon > svg': {
    width: `${ds.component.button.website.iconSize}px`,
    height: `${ds.component.button.website.iconSize}px`,
    flexShrink: 0,
  },
  '&:focus-visible': { outline: `3px solid ${ds.color.focus}`, outlineOffset: 3 },
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
