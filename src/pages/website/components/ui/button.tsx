/*
 * eslint-disable react-refresh/only-export-components --
 * shadcn kit file: buttonVariants sit beside the component by convention, and the rule
 * cannot tell a component assigned from an expression from a plain constant. This costs
 * a fast-refresh round-trip when editing this file, nothing at runtime.
 */
/* eslint-disable react-refresh/only-export-components */
import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { styled, type SxProps, type Theme } from '@mui/material/styles'
import { accent, ink, paper, paperFont, paperMotion, paperRadius } from '../../theme/sitePaper'
import { cn } from './utils'

/**
 * Button — shadcn's API, Paper's surface.
 *
 * Follows shadcn/ui's contract exactly (`variant`, `size`, `asChild` via Radix `Slot`)
 * so the component is swappable and familiar, but the styling comes from MUI's `styled`
 * against `sitePaper` tokens rather than Tailwind classes. This project has no Tailwind;
 * see `src/pages/admin/dashboard-next/shared/dashboard-ui-kit/shadcn/` for the same
 * pattern applied to the admin portal.
 *
 * Motion, per the interaction rules this site follows:
 *  - `:active` scales to 0.97 so a press is felt. Buttons that do not move under the
 *    finger read as broken regardless of how fast the handler is.
 *  - Only `background-color`, `border-color`, `color` and `transform` transition. Never
 *    `all` — it animates layout properties by accident and drops frames.
 *  - Hover is gated behind a fine pointer; touch devices fire hover on tap.
 */
export const buttonVariants = cva('gl-btn', {
  variants: {
    variant: {
      /** The one action on a section. Gold fill, near-black label. */
      default: 'gl-btn--default',
      /** Sits beside `default`. White card on paper, hairline edge. */
      secondary: 'gl-btn--secondary',
      /** Tertiary. No chrome until hover. */
      ghost: 'gl-btn--ghost',
      /** Reads as prose. Underline is the affordance, so it is present at rest. */
      link: 'gl-btn--link',
    },
    size: {
      sm: 'gl-btn--sm',
      md: 'gl-btn--md',
      /** Hero and section CTAs only. */
      lg: 'gl-btn--lg',
      icon: 'gl-btn--icon',
    },
  },
  defaultVariants: { variant: 'default', size: 'md' },
})

type Variant = NonNullable<VariantProps<typeof buttonVariants>['variant']>
type Size = NonNullable<VariantProps<typeof buttonVariants>['size']>

const SIZES: Record<Size, { height: number; px: number; fontSize: number; gap: number }> = {
  sm: { height: 34, px: 14, fontSize: 13, gap: 6 },
  md: { height: 42, px: 18, fontSize: 14, gap: 8 },
  lg: { height: 50, px: 26, fontSize: 15, gap: 10 },
  icon: { height: 42, px: 0, fontSize: 14, gap: 0 },
}

const forwardProp = (prop: PropertyKey) => prop !== 'glVariant' && prop !== 'glSize'

/**
 * Why two styled components instead of one with an `as` prop.
 *
 * The obvious implementation is `<Styled as={asChild ? Slot : undefined}>`. It silently
 * does not work here. Overriding `shouldForwardProp` — which this component must do, to
 * keep `glVariant`/`glSize` off the DOM — also makes `as` forwardable, so Emotion passes
 * it through as an attribute rather than consuming it. The result renders a real
 * `<button>` with an unstyled `<a>` nested inside it: invalid HTML, a nested-interactive
 * accessibility failure, and a link that inherits the browser's default underline.
 *
 * Building the style function once and mounting it on both hosts is explicit and cannot
 * fail that way.
 */
const styleFor = ({ glVariant, glSize }: { glVariant: Variant; glSize: Size }) => {
  const dims = SIZES[glSize]

  const base = {
    appearance: 'none' as const,
    margin: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: dims.gap,
    height: dims.height,
    minWidth: glSize === 'icon' ? dims.height : undefined,
    paddingInline: dims.px,
    borderRadius: glSize === 'icon' ? paperRadius.control : paperRadius.control,
    fontFamily: paperFont.body,
    fontSize: dims.fontSize,
    fontWeight: 600,
    letterSpacing: '-0.005em',
    lineHeight: 1,
    whiteSpace: 'nowrap' as const,
    textDecoration: 'none',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: [
      `background-color ${paperMotion.hoverMs}ms ease`,
      `border-color ${paperMotion.hoverMs}ms ease`,
      `color ${paperMotion.hoverMs}ms ease`,
      `transform ${paperMotion.pressMs}ms ${paperMotion.easeOut}`,
    ].join(', '),

    '&:active': { transform: 'scale(0.97)' },

    '&:focus-visible': {
      outline: 'none',
      boxShadow: `0 0 0 3px ${accent.ring}`,
    },

    '&:disabled': {
      cursor: 'not-allowed',
      opacity: 0.55,
      transform: 'none',
    },

    '@media (prefers-reduced-motion: reduce)': {
      transition: `background-color ${paperMotion.hoverMs}ms linear, color ${paperMotion.hoverMs}ms linear`,
      '&:active': { transform: 'none' },
    },
  }

  const variants: Record<Variant, object> = {
    default: {
      // Gold is legible here because it is a background and the label is near-black
      // (~11:1). This is the only variant allowed to use `accent.fill`.
      backgroundColor: accent.fill,
      color: accent.onFill,
      borderColor: accent.fill,
      '@media (hover: hover) and (pointer: fine)': {
        '&:hover:not(:disabled)': {
          backgroundColor: accent.fillStrong,
          borderColor: accent.fillStrong,
        },
      },
    },
    secondary: {
      backgroundColor: paper.white,
      color: ink.strong,
      borderColor: paper.hairlineStrong,
      '@media (hover: hover) and (pointer: fine)': {
        '&:hover:not(:disabled)': {
          backgroundColor: paper.base,
          borderColor: accent.border,
        },
      },
    },
    ghost: {
      backgroundColor: 'transparent',
      color: ink.strong,
      borderColor: 'transparent',
      '@media (hover: hover) and (pointer: fine)': {
        '&:hover:not(:disabled)': { backgroundColor: accent.softer },
      },
    },
    link: {
      height: 'auto',
      paddingInline: 0,
      backgroundColor: 'transparent',
      color: accent.ink,
      borderColor: 'transparent',
      borderRadius: 4,
      textDecoration: 'underline',
      textUnderlineOffset: '3px',
      textDecorationThickness: '1px',
      textDecorationColor: accent.border,
      '&:active': { transform: 'none' },
      '@media (hover: hover) and (pointer: fine)': {
        '&:hover:not(:disabled)': {
          color: accent.inkStrong,
          textDecorationColor: accent.inkStrong,
        },
      },
    },
  }

  return { ...base, ...variants[glVariant] }
}

const StyledButton = styled('button', { shouldForwardProp: forwardProp })<{
  glVariant: Variant
  glSize: Size
}>(styleFor)

/** `asChild` host — Radix `Slot` merges these styles onto the caller's own element. */
const StyledSlot = styled(Slot, { shouldForwardProp: forwardProp })<{
  glVariant: Variant
  glSize: Size
}>(styleFor)

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Render as the single child element instead of a `<button>` — shadcn's `asChild`. */
  asChild?: boolean
  /**
   * Layout-only overrides (width, margin, grid placement). The variant owns colour, type
   * and motion — reach for `sx` to place the button, not to restyle it.
   */
  sx?: SxProps<Theme>
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', asChild = false, type, ...props }, ref) => {
    const shared = {
      ref,
      className: cn(buttonVariants({ variant, size }), className),
      glVariant: variant ?? 'default',
      glSize: size ?? 'md',
      ...props,
    }

    if (asChild) return <StyledSlot {...shared} />

    // A bare <button> inside a <form> defaults to submit; be explicit when we own the tag.
    return <StyledButton type={type ?? 'button'} {...shared} />
  },
)
Button.displayName = 'Button'
