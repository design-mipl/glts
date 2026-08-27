import type { ReactNode } from 'react'
import { Box } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'

interface StepTransitionProps {
  stepKey: string
  direction: 1 | -1
  children: ReactNode
}

const SLIDE_PX = 28

/**
 * Directional slide + fade between apply steps.
 * This box is the scroll container so tall steps (checklist, review, payment)
 * remain fully reachable inside the viewport-locked apply shell.
 */
export function StepTransition({ stepKey, direction, children }: StepTransitionProps) {
  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        minHeight: 0,
        position: 'relative',
        overflowX: 'hidden',
        overflowY: 'auto',
        WebkitOverflowScrolling: 'touch',
      }}
    >
      <AnimatePresence mode="wait" initial={false} custom={direction}>
        <Box
          key={stepKey}
          component={motion.div}
          custom={direction}
          initial="enter"
          animate="center"
          exit="exit"
          variants={{
            enter: (dir: 1 | -1) => ({
              x: dir > 0 ? SLIDE_PX : -SLIDE_PX,
              opacity: 0,
            }),
            center: {
              x: 0,
              opacity: 1,
            },
            exit: (dir: 1 | -1) => ({
              x: dir > 0 ? -SLIDE_PX : SLIDE_PX,
              opacity: 0,
            }),
          }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            flex: '1 0 auto',
            minHeight: '100%',
            '& > *': {
              flex: '1 0 auto',
              width: '100%',
              minHeight: '100%',
            },
          }}
        >
          {children}
        </Box>
      </AnimatePresence>
    </Box>
  )
}
