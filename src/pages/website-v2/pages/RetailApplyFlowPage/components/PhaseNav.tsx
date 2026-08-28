import { Box } from '@mui/material'
import { Check } from 'lucide-react'
import {
  accentGoldRgb,
  applyFlow,
  applyFont,
  applyMotion,
  tabularNums,
} from '@/pages/website-v2/theme/applyFlowTheme'
import { RETAIL_PHASE_LABEL, RETAIL_PHASE_ORDER } from '../config/stepPlan'
import type { RetailPhaseId } from '../types'

interface PhaseNavProps {
  currentPhase: RetailPhaseId
  unlockedPhases: Set<RetailPhaseId>
  onSelectPhase: (phase: RetailPhaseId) => void
}

/** Left offset of the connector track — aligns to the centre of the number column. */
const TRACK_X = 26

/**
 * Phase index — a typographic table of contents, not a stepper widget.
 *
 * Composition notes:
 * - Numbers encode real sequence, so they earn their place as the structural device.
 * - One continuous connector runs the full column and fills gold up to the current phase,
 *   so "relationship between steps" and "progress" are the same object, not two widgets.
 * - The active row carries a gold edge bar plus a wash that fades out to the right, so the
 *   row physically bleeds toward the content pane instead of sitting in its own box.
 */
export function PhaseNav({ currentPhase, unlockedPhases, onSelectPhase }: PhaseNavProps) {
  const currentIndex = RETAIL_PHASE_ORDER.indexOf(currentPhase)

  return (
    <Box
      role="navigation"
      aria-label="Application phases"
      sx={{ position: 'relative', width: '100%', py: { xs: 0, md: 1 } }}
    >
      {/* Connector — idle track. */}
      <Box
        aria-hidden
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: TRACK_X,
          top: 22,
          bottom: 22,
          width: '1px',
          backgroundColor: applyFlow.railLine,
        }}
      />
      {/* Connector — cleared portion. Height is driven off row count so it lands on the node. */}
      <Box
        aria-hidden
        sx={{
          display: { xs: 'none', md: 'block' },
          position: 'absolute',
          left: TRACK_X,
          top: 22,
          width: '1px',
          height: `calc((100% - 44px) * ${currentIndex / Math.max(RETAIL_PHASE_ORDER.length - 1, 1)})`,
          backgroundColor: applyFlow.accent,
          transition: `height ${applyMotion.stepMs}ms ${applyMotion.easeInOut}`,
          '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
        }}
      />

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'row', md: 'column' },
          gap: { xs: 1, md: 0 },
          overflowX: { xs: 'auto', md: 'visible' },
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {RETAIL_PHASE_ORDER.map((phase, index) => {
          const isActive = phase === currentPhase
          const isCleared = index < currentIndex
          const isUnlocked = unlockedPhases.has(phase)

          return (
            <Box
              key={phase}
              component="button"
              type="button"
              disabled={!isUnlocked}
              onClick={() => isUnlocked && onSelectPhase(phase)}
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Phase ${index + 1}: ${RETAIL_PHASE_LABEL[phase]}${
                isCleared ? ', completed' : isActive ? ', current' : ''
              }`}
              sx={{
                position: 'relative',
                zIndex: 1,
                appearance: 'none',
                border: 'none',
                background: 'none',
                font: 'inherit',
                cursor: isUnlocked ? 'pointer' : 'default',
                display: 'flex',
                alignItems: 'center',
                gap: { xs: 1.5, md: 3 },
                width: { xs: 'auto', md: '100%' },
                flex: '0 0 auto',
                textAlign: 'left',
                pl: { xs: 2, md: `${TRACK_X - 11}px` },
                pr: { xs: 2, md: 4 },
                py: { xs: 2.5, md: 3 },
                minHeight: 44,
                // The wash fades to the right so the active row reads as pointing into content.
                backgroundImage: isActive
                  ? `linear-gradient(90deg, rgba(${accentGoldRgb}, 0.16) 0%, rgba(${accentGoldRgb}, 0.04) 55%, transparent 100%)`
                  : 'none',
                transition: `background-color 200ms ${applyMotion.easeOut}`,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: '2.5px',
                  backgroundColor: applyFlow.accent,
                  transform: isActive ? 'scaleY(1)' : 'scaleY(0)',
                  transition: `transform 220ms ${applyMotion.easeOut}`,
                },
                ...(isActive
                  ? {}
                  : {
                      '@media (hover: hover) and (pointer: fine)': {
                        '&:hover:not(:disabled)': {
                          backgroundColor: 'rgba(255, 255, 255, 0.04)',
                        },
                      },
                    }),
                '&:focus-visible': {
                  outline: 'none',
                  boxShadow: `inset 0 0 0 1.5px ${applyFlow.accent}`,
                },
                '@media (prefers-reduced-motion: reduce)': {
                  transition: 'none',
                  '&::before': { transition: 'none' },
                },
              }}
            >
              {/* Node — sits on the connector, so the track reads as threading through it. */}
              <Box
                aria-hidden
                sx={{
                  flex: '0 0 auto',
                  width: 22,
                  height: 22,
                  display: 'grid',
                  placeItems: 'center',
                  borderRadius: isCleared || isActive ? '5px' : '50%',
                  backgroundColor: isCleared
                    ? applyFlow.accent
                    : isActive
                      ? applyFlow.accent
                      : applyFlow.railBg,
                  border: isCleared || isActive ? 'none' : `1px solid ${applyFlow.railLineStrong}`,
                  boxShadow: isActive ? `0 0 0 4px rgba(${accentGoldRgb}, 0.18)` : 'none',
                  color: isCleared || isActive ? applyFlow.onAccent : applyFlow.railTextFaint,
                  fontFamily: applyFont.mono,
                  fontSize: 10,
                  fontWeight: 700,
                  ...tabularNums,
                  transition: `background-color 200ms ${applyMotion.easeOut}, box-shadow 200ms ${applyMotion.easeOut}, border-radius 200ms ${applyMotion.easeOut}`,
                }}
              >
                {isCleared ? <Check size={12} strokeWidth={3.5} /> : String(index + 1).padStart(2, '0')}
              </Box>

              <Box
                component="span"
                sx={{
                  fontFamily: applyFont.mono,
                  fontSize: 11,
                  fontWeight: isActive ? 700 : 500,
                  letterSpacing: '0.09em',
                  textTransform: 'uppercase',
                  whiteSpace: 'nowrap',
                  color: isActive
                    ? applyFlow.railText
                    : isCleared
                      ? applyFlow.railTextMuted
                      : applyFlow.railTextFaint,
                  display: { xs: isActive ? 'block' : 'none', md: 'block' },
                  transition: `color 200ms ${applyMotion.easeOut}`,
                }}
              >
                {RETAIL_PHASE_LABEL[phase]}
              </Box>
            </Box>
          )
        })}
      </Box>
    </Box>
  )
}
