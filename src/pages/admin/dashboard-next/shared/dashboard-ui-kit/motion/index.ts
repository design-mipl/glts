import type { SxProps, Theme } from '@mui/material/styles'
import { UI_KIT_MOTION } from '../tokens'
import { useUiKitReducedMotion } from '../hooks'

export function useUiKitHoverElevationSx(enabled = true): SxProps<Theme> {
  const reduced = useUiKitReducedMotion()
  if (!enabled || reduced) return {}
  return {
    transition: `box-shadow ${UI_KIT_MOTION.normal}, transform ${UI_KIT_MOTION.normal}`,
    '&:hover': {
      transform: UI_KIT_MOTION.hoverLift,
    },
  }
}

export const uiKitFadeInSx: SxProps<Theme> = {
  '@media (prefers-reduced-motion: no-preference)': {
    animation: 'uiKitFadeIn 280ms ease',
    '@keyframes uiKitFadeIn': {
      from: { opacity: 0, transform: 'translateY(6px)' },
      to: { opacity: 1, transform: 'none' },
    },
  },
}

export const uiKitExpandSx: SxProps<Theme> = {
  transition: `height ${UI_KIT_MOTION.slow}, opacity ${UI_KIT_MOTION.normal}`,
}
