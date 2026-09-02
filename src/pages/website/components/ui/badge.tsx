/*
 * eslint-disable react-refresh/only-export-components --
 * shadcn kit file: badgeVariants sit beside the component by convention, and the rule
 * cannot tell a component assigned from an expression from a plain constant. This costs
 * a fast-refresh round-trip when editing this file, nothing at runtime.
 */
/* eslint-disable react-refresh/only-export-components */
import { forwardRef, type HTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { styled } from '@mui/material/styles'
import { accent, ink, paper, paperFont, semantic } from '../../theme/sitePaper'
import { cn } from './utils'

export const badgeVariants = cva('gl-badge', {
  variants: {
    variant: {
      /** Brand mark — accreditation, verified status, category. */
      default: 'gl-badge--default',
      /** Neutral metadata that should not compete. */
      muted: 'gl-badge--muted',
      /** Hairline only, for dense rows where a tint would be noise. */
      outline: 'gl-badge--outline',
      /** Refusal, expired, blocked. */
      critical: 'gl-badge--critical',
    },
  },
  defaultVariants: { variant: 'default' },
})

type Variant = NonNullable<VariantProps<typeof badgeVariants>['variant']>

const forwardProp = (prop: PropertyKey) => prop !== 'glVariant'

/** Two hosts rather than an `as` prop — see the note in `button.tsx`. */
const styleFor = ({ glVariant }: { glVariant: Variant }) => {
  const variants: Record<Variant, object> = {
    default: { backgroundColor: accent.soft, color: accent.ink, borderColor: accent.border },
    muted: { backgroundColor: paper.canvas, color: ink.muted, borderColor: paper.hairline },
    outline: { backgroundColor: 'transparent', color: ink.muted, borderColor: paper.hairlineStrong },
    critical: {
      backgroundColor: semantic.criticalSoft,
      color: semantic.critical,
      borderColor: 'rgba(168, 50, 31, 0.3)',
    },
  }

  return {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    height: 24,
    paddingInline: 9,
    borderRadius: 3,
    border: '1px solid transparent',
    fontFamily: paperFont.body,
    fontSize: 12.5,
    fontWeight: 600,
    letterSpacing: '-0.002em',
    lineHeight: 1,
    whiteSpace: 'nowrap' as const,
    ...variants[glVariant],
  }
}

const StyledBadge = styled('span', { shouldForwardProp: forwardProp })<{ glVariant: Variant }>(styleFor)
const StyledSlot = styled(Slot, { shouldForwardProp: forwardProp })<{ glVariant: Variant }>(styleFor)

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', asChild = false, ...props }, ref) => {
    const shared = {
      ref,
      className: cn(badgeVariants({ variant }), className),
      glVariant: variant ?? 'default',
      ...props,
    }

    return asChild ? <StyledSlot {...shared} /> : <StyledBadge {...shared} />
  },
)
Badge.displayName = 'Badge'
