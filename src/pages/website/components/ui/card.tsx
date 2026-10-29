import { forwardRef } from 'react'
import { Box, type BoxProps } from '@mui/material'
import { styled } from '@mui/material/styles'
import { ink, paper, paperFont, paperMotion, paperRadius, paperShadow } from '../../theme/sitePaper'
import { cn } from './utils'

export interface CardProps extends BoxProps {
  /**
   * `flat` is the default on purpose. A trust surface built from hairlines reads as
   * printed; the same surface built from soft drop shadows reads as a template. Only a
   * card that genuinely floats above the page should be `lifted`.
   */
  elevation?: 'flat' | 'lifted'
  /** Adds hover lift, pointer cursor and a focus ring. Use only when the whole card is a link. */
  interactive?: boolean
}

const CardRoot = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'elevation' && prop !== 'interactive',
})<{ elevation?: CardProps['elevation']; interactive?: boolean }>(
  ({ elevation = 'flat', interactive }) => ({
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
    minWidth: 0,
    height: '100%',
    backgroundColor: paper.white,
    color: ink.strong,
    borderRadius: paperRadius.card,
    border: `1px solid ${paper.hairline}`,
    boxShadow: elevation === 'lifted' ? paperShadow.lift : paperShadow.none,
    transition: [
      `border-color ${paperMotion.hoverMs}ms ease`,
      `box-shadow ${paperMotion.hoverMs}ms ease`,
      `transform ${paperMotion.hoverMs}ms ${paperMotion.easeOut}`,
    ].join(', '),

    ...(interactive
      ? {
          cursor: 'pointer',
          '&:focus-visible': {
            outline: `2px solid ${ink.strong}`,
            outlineOffset: 2,
          },
          '@media (hover: hover) and (pointer: fine)': {
            '&:hover': {
              borderColor: paper.hairlineStrong,
              boxShadow: paperShadow.lift,
              transform: 'translateY(-2px)',
            },
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: `border-color ${paperMotion.hoverMs}ms linear`,
            '&:hover': { transform: 'none' },
          },
        }
      : {}),
  }),
)

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, elevation = 'flat', interactive, ...props }, ref) => (
    <CardRoot
      ref={ref}
      className={cn('gl-card', className)}
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
    className={cn('gl-card-header', className)}
    sx={{ px: { xs: 2.5, md: 3 }, pt: { xs: 2.5, md: 3 }, pb: 0, ...((sx as object) ?? {}) }}
    {...props}
  />
))
CardHeader.displayName = 'CardHeader'

export const CardTitle = forwardRef<HTMLHeadingElement, BoxProps>(({ className, sx, ...props }, ref) => (
  <Box
    ref={ref}
    component="h3"
    className={cn('gl-card-title', className)}
    sx={{
      m: 0,
      fontFamily: paperFont.display,
      fontSize: { xs: 17, md: 18.5 },
      fontWeight: 700,
      letterSpacing: '-0.018em',
      lineHeight: 1.25,
      color: ink.strong,
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
      className={cn('gl-card-description', className)}
      sx={{
        m: 0,
        mt: 1,
        fontFamily: paperFont.body,
        fontSize: 14.5,
        lineHeight: 1.6,
        color: ink.muted,
        ...((sx as object) ?? {}),
      }}
      {...props}
    />
  ),
)
CardDescription.displayName = 'CardDescription'

export const CardContent = forwardRef<HTMLDivElement, BoxProps>(({ className, sx, ...props }, ref) => (
  <Box
    ref={ref}
    className={cn('gl-card-content', className)}
    sx={{ px: { xs: 2.5, md: 3 }, py: { xs: 2.5, md: 3 }, flex: 1, minWidth: 0, ...((sx as object) ?? {}) }}
    {...props}
  />
))
CardContent.displayName = 'CardContent'

export const CardFooter = forwardRef<HTMLDivElement, BoxProps>(({ className, sx, ...props }, ref) => (
  <Box
    ref={ref}
    className={cn('gl-card-footer', className)}
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.25,
      px: { xs: 2.5, md: 3 },
      pb: { xs: 2.5, md: 3 },
      pt: 0,
      ...((sx as object) ?? {}),
    }}
    {...props}
  />
))
CardFooter.displayName = 'CardFooter'
