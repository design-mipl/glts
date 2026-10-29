/*
 * eslint-disable react-refresh/only-export-components --
 * shadcn kit file: Radix primitive aliases sit beside the component by convention, and the rule
 * cannot tell a component assigned from an expression from a plain constant. This costs
 * a fast-refresh round-trip when editing this file, nothing at runtime.
 */
/* eslint-disable react-refresh/only-export-components */
import { forwardRef, type ComponentPropsWithoutRef, type ElementRef } from 'react'
import * as SelectPrimitive from '@radix-ui/react-select'
import { styled } from '@mui/material/styles'
import { Check, ChevronDown, ChevronUp } from 'lucide-react'
import { accent, ink, paper, paperFont, paperMotion, paperRadius, paperShadow } from '../../theme/sitePaper'
import { cn } from './utils'

/**
 * Select — Radix primitive, Paper surface.
 *
 * Replaces MUI `Select` on the marketing site. The reason is not consistency for its own
 * sake: MUI's select renders a `<div role="button">` inside a notched-outline fieldset
 * that has to be un-styled property by property before it stops looking like a form
 * control, and the hero's two dropdowns were carrying ~30 lines of override `sx` to do
 * exactly that. Radix ships the listbox semantics and typeahead with no chrome to remove.
 *
 * Motion notes:
 *  - The panel scales from its trigger via `--radix-select-content-transform-origin`.
 *    A dropdown that grows from the centre of the screen has no spatial relationship to
 *    the thing that opened it.
 *  - 200ms, strong ease-out. `ease-in` on an entrance delays the exact moment the user is
 *    watching and reads as sluggish at the same duration.
 *  - Entry starts at `scale(0.97)`, never `scale(0)` — nothing in the world appears from
 *    nothing.
 */

export const Select = SelectPrimitive.Root
export const SelectGroup = SelectPrimitive.Group
export const SelectValue = SelectPrimitive.Value

const StyledTrigger = styled(SelectPrimitive.Trigger)({
  appearance: 'none',
  display: 'flex',
  width: '100%',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8,
  padding: 0,
  border: 'none',
  background: 'transparent',
  cursor: 'pointer',
  fontFamily: paperFont.body,
  fontSize: 15,
  fontWeight: 500,
  lineHeight: 1.4,
  color: ink.strong,
  textAlign: 'left',
  transition: `color ${paperMotion.hoverMs}ms ease`,

  '&[data-placeholder]': { color: ink.faint, fontWeight: 400 },

  '&:focus-visible': {
    outline: 'none',
    color: accent.ink,
  },

  '& .gl-select-caret': {
    flex: '0 0 auto',
    color: ink.faint,
    transition: `transform ${paperMotion.overlayMs}ms ${paperMotion.easeOut}, color ${paperMotion.hoverMs}ms ease`,
  },
  '&[data-state="open"] .gl-select-caret': { transform: 'rotate(180deg)', color: accent.ink },

  '@media (hover: hover) and (pointer: fine)': {
    '&:hover .gl-select-caret': { color: ink.muted },
  },
  '@media (prefers-reduced-motion: reduce)': {
    '& .gl-select-caret': { transition: `color ${paperMotion.hoverMs}ms linear` },
  },

  '&:disabled': { cursor: 'not-allowed', opacity: 0.55 },
})

export const SelectTrigger = forwardRef<
  ElementRef<typeof SelectPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <StyledTrigger ref={ref} className={cn('gl-select-trigger', className)} {...props}>
    {children}
    <SelectPrimitive.Icon asChild>
      <ChevronDown className="gl-select-caret" size={16} strokeWidth={2} aria-hidden />
    </SelectPrimitive.Icon>
  </StyledTrigger>
))
SelectTrigger.displayName = SelectPrimitive.Trigger.displayName

const StyledContent = styled(SelectPrimitive.Content)({
  zIndex: 1400,
  minWidth: 'var(--radix-select-trigger-width)',
  /**
   * Capped, not merely bounded by the viewport. An 11-item list rendered at full height is
   * tall enough that Radix's collision logic flips it above the trigger, where it covers
   * the headline it was opened from. Capping to ~9 rows keeps it below the trigger in a
   * normal viewport and makes the overflow scroll instead.
   */
  maxHeight: 'min(320px, var(--radix-select-content-available-height))',
  overflow: 'hidden',
  backgroundColor: paper.white,
  border: `1px solid ${paper.hairline}`,
  borderRadius: paperRadius.card,
  boxShadow: paperShadow.lift,

  // Scale from the trigger, not from the centre.
  transformOrigin: 'var(--radix-select-content-transform-origin)',
  transition: [
    `opacity ${paperMotion.overlayMs}ms ${paperMotion.easeOut}`,
    `transform ${paperMotion.overlayMs}ms ${paperMotion.easeOut}`,
  ].join(', '),

  '&[data-state="open"]': { opacity: 1, transform: 'scale(1)' },
  '&[data-state="closed"]': { opacity: 0, transform: 'scale(0.97)' },
  '@starting-style': { opacity: 0, transform: 'scale(0.97)' },

  '@media (prefers-reduced-motion: reduce)': {
    transition: `opacity ${paperMotion.overlayMs}ms linear`,
    '&[data-state="closed"]': { transform: 'none' },
    '@starting-style': { transform: 'none' },
  },
})

const scrollButtonSx = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: 24,
  color: ink.faint,
  cursor: 'default',
} as const

export const SelectContent = forwardRef<
  ElementRef<typeof SelectPrimitive.Content>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Content>
>(({ className, children, position = 'popper', sideOffset = 8, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <StyledContent
      ref={ref}
      className={cn('gl-select-content', className)}
      position={position}
      sideOffset={sideOffset}
      {...props}
    >
      <SelectPrimitive.ScrollUpButton style={scrollButtonSx}>
        <ChevronUp size={14} aria-hidden />
      </SelectPrimitive.ScrollUpButton>
      <SelectPrimitive.Viewport style={{ padding: 6 }}>{children}</SelectPrimitive.Viewport>
      <SelectPrimitive.ScrollDownButton style={scrollButtonSx}>
        <ChevronDown size={14} aria-hidden />
      </SelectPrimitive.ScrollDownButton>
    </StyledContent>
  </SelectPrimitive.Portal>
))
SelectContent.displayName = SelectPrimitive.Content.displayName

const StyledItem = styled(SelectPrimitive.Item)({
  position: 'relative',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  minHeight: 38,
  paddingInline: 10,
  paddingBlock: 8,
  borderRadius: paperRadius.control - 2,
  fontFamily: paperFont.body,
  fontSize: 14.5,
  lineHeight: 1.4,
  color: ink.strong,
  cursor: 'pointer',
  userSelect: 'none',
  outline: 'none',

  // Radix moves `data-highlighted` with both pointer and keyboard, so this one rule
  // covers hover and arrow-key navigation identically.
  '&[data-highlighted]': { backgroundColor: accent.softer, color: accent.ink },
  '&[data-state="checked"]': { fontWeight: 600 },
  '&[data-disabled]': { color: ink.disabled, cursor: 'not-allowed' },
})

export const SelectItem = forwardRef<
  ElementRef<typeof SelectPrimitive.Item>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Item>
>(({ className, children, ...props }, ref) => (
  <StyledItem ref={ref} className={cn('gl-select-item', className)} {...props}>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
    <SelectPrimitive.ItemIndicator asChild>
      <Check size={15} strokeWidth={2.5} color={accent.ink} aria-hidden />
    </SelectPrimitive.ItemIndicator>
  </StyledItem>
))
SelectItem.displayName = SelectPrimitive.Item.displayName

const StyledLabel = styled(SelectPrimitive.Label)({
  paddingInline: 10,
  paddingBlock: '8px 4px',
  fontFamily: paperFont.body,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: '0.02em',
  textTransform: 'uppercase',
  color: ink.faint,
})

export const SelectLabel = forwardRef<
  ElementRef<typeof SelectPrimitive.Label>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Label>
>(({ className, ...props }, ref) => (
  <StyledLabel ref={ref} className={cn('gl-select-label', className)} {...props} />
))
SelectLabel.displayName = SelectPrimitive.Label.displayName

const StyledSeparator = styled(SelectPrimitive.Separator)({
  height: 1,
  margin: '6px 4px',
  backgroundColor: paper.hairline,
})

export const SelectSeparator = forwardRef<
  ElementRef<typeof SelectPrimitive.Separator>,
  ComponentPropsWithoutRef<typeof SelectPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <StyledSeparator ref={ref} className={cn('gl-select-separator', className)} {...props} />
))
SelectSeparator.displayName = SelectPrimitive.Separator.displayName
