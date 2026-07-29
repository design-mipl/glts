import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { styled, alpha } from '@mui/material/styles'
import { tokens } from '@/design-system/tokens'
import { PRODUCT_BUTTON_BORDER_RADIUS } from '@/shared/theme/publicBrand'
import { cn } from './utils'

export const buttonVariants = cva('dui-btn', {
  variants: {
    variant: {
      default: 'dui-btn--default',
      destructive: 'dui-btn--destructive',
      outline: 'dui-btn--outline',
      secondary: 'dui-btn--secondary',
      ghost: 'dui-btn--ghost',
      link: 'dui-btn--link',
    },
    size: {
      default: 'dui-btn--md',
      sm: 'dui-btn--sm',
      lg: 'dui-btn--lg',
      icon: 'dui-btn--icon',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
  },
})

const StyledRoot = styled('button', {
  shouldForwardProp: (prop) => prop !== 'duiVariant' && prop !== 'duiSize',
})<{ duiVariant?: string; duiSize?: string }>(({ theme, duiVariant = 'default', duiSize = 'default' }) => {
  const height =
    duiSize === 'sm' ? 32 : duiSize === 'lg' ? 40 : duiSize === 'icon' ? 36 : 36
  const fontSize = duiSize === 'sm' ? tokens.fontSize.xs : tokens.fontSize.sm
  const padX = duiSize === 'sm' ? 12 : duiSize === 'lg' ? 20 : duiSize === 'icon' ? 0 : 16

  const base = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    whiteSpace: 'nowrap' as const,
    borderRadius: PRODUCT_BUTTON_BORDER_RADIUS,
    fontSize,
    fontWeight: tokens.fontWeight.semibold,
    height,
    minWidth: duiSize === 'icon' ? height : undefined,
    paddingLeft: duiSize === 'icon' ? 0 : padX,
    paddingRight: duiSize === 'icon' ? 0 : padX,
    border: '1px solid transparent',
    cursor: 'pointer',
    transition: `background ${tokens.transition.fast}, color ${tokens.transition.fast}, border-color ${tokens.transition.fast}, box-shadow ${tokens.transition.fast}`,
    fontFamily: 'inherit',
    lineHeight: 1,
    '&:focus-visible': {
      outline: `2px solid ${theme.palette.primary.main}`,
      outlineOffset: 2,
    },
    '&:disabled': {
      opacity: 0.45,
      cursor: 'not-allowed',
      pointerEvents: 'none' as const,
    },
  }

  switch (duiVariant) {
    case 'destructive':
      return {
        ...base,
        backgroundColor: theme.palette.error.main,
        color: theme.palette.error.contrastText,
        '&:hover': { backgroundColor: theme.palette.error.dark },
      }
    case 'outline':
      return {
        ...base,
        backgroundColor: 'transparent',
        color: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.06) },
      }
    case 'secondary':
      return {
        ...base,
        backgroundColor: alpha(theme.palette.primary.main, 0.1),
        color: theme.palette.primary.main,
        '&:hover': { backgroundColor: alpha(theme.palette.primary.main, 0.16) },
      }
    case 'ghost':
      return {
        ...base,
        backgroundColor: 'transparent',
        color: theme.palette.text.secondary,
        '&:hover': {
          backgroundColor: alpha(theme.palette.text.primary, 0.06),
          color: theme.palette.text.primary,
        },
      }
    case 'link':
      return {
        ...base,
        backgroundColor: 'transparent',
        color: theme.palette.primary.main,
        height: 'auto',
        paddingLeft: 0,
        paddingRight: 0,
        textDecoration: 'underline',
        textUnderlineOffset: 4,
        '&:hover': { opacity: 0.85 },
      }
    default:
      return {
        ...base,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.primary.contrastText,
        '&:hover': { backgroundColor: theme.palette.primary.dark },
      }
  }
})

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, type = 'button', ...props }, ref) => {
    if (asChild) {
      return (
        <Slot
          className={cn(buttonVariants({ variant, size }), className)}
          ref={ref}
          {...props}
        />
      )
    }

    return (
      <StyledRoot
        ref={ref}
        type={type}
        className={cn(buttonVariants({ variant, size }), className)}
        duiVariant={variant ?? 'default'}
        duiSize={size ?? 'default'}
        {...props}
      />
    )
  },
)
Button.displayName = 'Button'
