import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { motion, useReducedMotion } from 'framer-motion'

interface StepTransitionProps {
  stepKey: string
  direction: 1 | -1
  children: ReactNode
}

const SLIDE_PX = 20

/**
 * Directional enter animation between apply steps.
 *
 * Purpose is spatial consistency — forward steps enter from the right, Back enters from
 * the left, so reversing the journey is legible.
 *
 * Deliberately enter-only, with no `AnimatePresence`. An earlier version used
 * `AnimatePresence mode="wait"`, which deadlocked: when the exit animation failed to
 * report completion, the outgoing step was never unmounted and the next step never
 * appeared — the step counter advanced while the content stayed frozen. Keying a single
 * `motion.div` on `stepKey` makes React swap the subtree outright, so there is no exit
 * lifecycle to stall on. The instant exit also reads as more responsive, which is what
 * you want on a control the user hits ~15 times per application.
 */
export function StepTransition({ stepKey, direction, children }: StepTransitionProps) {
  const reduceMotion = useReducedMotion()

  return (
    <Box
      sx={{
        flex: '1 1 auto',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: 0,
        maxHeight: '100%',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        key={stepKey}
        component={motion.div}
        initial={{ x: reduceMotion ? 0 : direction > 0 ? SLIDE_PX : -SLIDE_PX, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: reduceMotion ? 0.12 : 0.2, ease: [0.23, 1, 0.32, 1] }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          flex: '1 1 auto',
          minHeight: 0,
          height: '100%',
        }}
      >
        {children}
      </Box>
    </Box>
  )
}
