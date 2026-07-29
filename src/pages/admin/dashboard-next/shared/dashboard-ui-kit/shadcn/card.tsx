import { forwardRef } from 'react'
import { Box, type BoxProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { tokens } from '@/design-system/tokens'
import { publicShadows } from '@/shared/theme/publicBrand'
import { cn } from './utils'

export interface CardProps extends BoxProps {
  elevation?: 'flat' | 'raised' | 'overlay'
  interactive?: boolean
}

const CardRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'elevation' && prop !== 'interactive',
})<{ elevation?: CardProps['elevation']; interactive?: boolean }>(
  ({ theme, elevation = 'raised', interactive }) => ({
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: tokens.borderRadius.xl,
    border: `1px solid ${theme.palette.divider}`,
    boxShadow:
      elevation === 'flat'
        ? tokens.shadow.none
        : elevation === 'overlay'
          ? publicShadows.cardHover
          : publicShadows.card,
    display: 'flex',
    flexDirection: 'column',
    gap: 0,
    height: '100%',
    transition: `box-shadow ${tokens.transition.normal}, transform ${tokens.transition.normal}, border-color ${tokens.transition.normal}`,
    ...(interactive
      ? {
          cursor: 'pointer',
          '@media (prefers-reduced-motion: no-preference)': {
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: publicShadows.cardHover,
              borderColor: theme.palette.mode === 'light' ? theme.palette.grey[300] : theme.palette.grey[700],
            },
          },
          '&:focus-visible': {
            outline: `2px solid ${theme.palette.primary.main}`,
            outlineOffset: 2,
          },
        }
      : {}),
  }),
)

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation = 'raised', interactive, ...props }, ref) => (
    <CardRoot
      ref={ref}
      className={cn('dui-card', className)}
      elevation={elevation}
      interactive={interactive}
      {...props}
    />
  ),
)
Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, BoxProps>(({ className, sx, ...props }, ref) => (
  <Box
    ref={ref}
    className={cn('dui-card-header', className)}
    sx={{
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'start',
      gap: 1.25,
      px: { xs: 2, md: 2.5 },
      pt: { xs: 2, md: 2.5 },
      pb: 0,
      ...((sx as object) ?? {}),
    }}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, BoxProps>(({ className, sx, ...props }, ref) => (
  <Box
    ref={ref}
    component="h3"
    className={cn('dui-card-title', className)}
    sx={{
      m: 0,
      fontSize: tokens.fontSize.base,
      fontWeight: 700,
      letterSpacing: -0.2,
      lineHeight: tokens.lineHeight.tight,
      color: 'text.primary',
      ...((sx as object) ?? {}),
    }}
    {...props}
  />
))
CardTitle.displayName = 'CardTitle'

export const CardDescription = forwardRef<HTMLParagraphElement, BoxProps>(
  ({ className, sx, ...props }, ref) => (
    <Box
      ref={ref}
      component="p"
      className={cn('dui-card-description', className)}
      sx={{
        m: 0,
        mt: 0.5,
        fontSize: tokens.fontSize.sm,
        lineHeight: tokens.lineHeight.normal,
        color: 'text.secondary',
        ...((sx as object) ?? {}),
      }}
      {...props}
    />
  ),
)
CardDescription.displayName = 'CardDescription'

export const CardAction = forwardRef<HTMLDivElement, BoxProps>(({ className, sx, ...props }, ref) => (
  <Box
    ref={ref}
    className={cn('dui-card-action', className)}
    sx={{
      gridColumn: '2',
      gridRow: '1 / span 2',
      alignSelf: 'start',
      justifySelf: 'end',
      ...((sx as object) ?? {}),
    }}
    {...props}
  />
))
CardAction.displayName = 'CardAction'

export const CardContent = forwardRef<HTMLDivElement, BoxProps>(({ className, sx, ...props }, ref) => (
  <Box
    ref={ref}
    className={cn('dui-card-content', className)}
    sx={{
      px: { xs: 2, md: 2.5 },
      py: { xs: 2, md: 2.25 },
      flex: 1,
      minWidth: 0,
      ...((sx as object) ?? {}),
    }}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, BoxProps>(({ className, sx, ...props }, ref) => (
  <Box
    ref={ref}
    className={cn('dui-card-footer', className)}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1,
      px: { xs: 2, md: 2.5 },
      pb: { xs: 2, md: 2.5 },
      pt: 0,
      ...((sx as object) ?? {}),
    }}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'
