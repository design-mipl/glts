import { Box } from '@mui/material'
import { motion } from 'framer-motion'
import {
  ClipboardCheck,
  CreditCard,
  FileText,
  HandCoins,
  MapPin,
  Plane,
  Sparkles,
  UserRound,
  type LucideIcon,
} from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { RETAIL_PHASE_LABEL, RETAIL_PHASE_ORDER } from '../config/stepPlan'
import type { RetailPhaseId } from '../types'

interface PhaseNavProps {
  currentPhase: RetailPhaseId
  unlockedPhases: Set<RetailPhaseId>
  onSelectPhase: (phase: RetailPhaseId) => void
}

const PHASE_ICON: Record<RetailPhaseId, LucideIcon> = {
  purpose: Plane,
  traveller: UserRound,
  sponsor: HandCoins,
  documents: FileText,
  collection: MapPin,
  extras: Sparkles,
  review: ClipboardCheck,
  pay: CreditCard,
}

/** Primary journey chrome — Purpose → … → Review → Payment. */
export function PhaseNav({ currentPhase, unlockedPhases, onSelectPhase }: PhaseNavProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      role="navigation"
      aria-label="Application phases"
      sx={{
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: { xs: 0.25, sm: 0.5 },
        px: { xs: 0.5, sm: 1 },
        py: { xs: 0.85, sm: 1 },
        border: `1px solid ${colors.border}`,
        borderRadius: BORDER_RADIUS.lg,
        bgcolor: colors.white,
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(15, 23, 42, 0.04)',
        boxSizing: 'border-box',
      }}
    >
      {RETAIL_PHASE_ORDER.map((phase) => {
        const isActive = phase === currentPhase
        const isUnlocked = unlockedPhases.has(phase)
        const Icon = PHASE_ICON[phase]

        return (
          <Box
            key={phase}
            component="button"
            type="button"
            disabled={!isUnlocked}
            onClick={() => isUnlocked && onSelectPhase(phase)}
            aria-current={isActive ? 'step' : undefined}
            sx={{
              position: 'relative',
              flex: 1,
              minWidth: 0,
              appearance: 'none',
              border: 'none',
              borderRadius: BORDER_RADIUS.md,
              cursor: isUnlocked ? 'pointer' : 'default',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 0.25, sm: 0.5 },
              px: { xs: 0.35, sm: 0.75 },
              py: 0.75,
              bgcolor: 'transparent',
              color: isActive ? colors.onBrandFilled : colors.textSecondary,
              fontFamily: 'inherit',
              fontSize: { xs: '10px', sm: '12px' },
              fontWeight: isActive ? 700 : 600,
              letterSpacing: '0.01em',
              textAlign: 'center',
              lineHeight: 1.2,
              opacity: isUnlocked || isActive ? 1 : 0.4,
              transition: 'color 0.15s ease',
              '&:hover':
                isUnlocked && !isActive
                  ? { bgcolor: colors.surfaceAlt, color: colors.navy }
                  : undefined,
              '&:disabled': { cursor: 'default' },
            }}
          >
            {isActive ? (
              <Box
                component={motion.div}
                layoutId="phase-nav-active-pill"
                transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
                sx={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: BORDER_RADIUS.md,
                  bgcolor: colors.greenBright,
                  zIndex: 0,
                }}
              />
            ) : null}
            <Icon
              size={13}
              strokeWidth={isActive ? 2.5 : 2}
              aria-hidden
              style={{ position: 'relative', zIndex: 1, flexShrink: 0 }}
            />
            <Box
              component="span"
              sx={{
                position: 'relative',
                zIndex: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: { xs: phase === currentPhase ? 'inline' : 'none', sm: 'inline' },
              }}
            >
              {RETAIL_PHASE_LABEL[phase]}
            </Box>
          </Box>
        )
      })}
    </Box>
  )
}
