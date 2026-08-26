import { Box } from '@mui/material'
import {
  CreditCard,
  FileText,
  HandCoins,
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
  extras: Sparkles,
  pay: CreditCard,
}

/** Primary journey chrome — Purpose | Travel profile | Sponsor | Documents | Extras | Payment. */
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
        gap: { xs: 0.35, sm: 0.75 },
        px: { xs: 0.75, sm: 1.25 },
        py: { xs: 1, sm: 1.25 },
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
              flex: 1,
              minWidth: 0,
              appearance: 'none',
              border: 'none',
              borderRadius: BORDER_RADIUS.md,
              cursor: isUnlocked ? 'pointer' : 'default',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: { xs: 0.35, sm: 0.75 },
              px: { xs: 0.5, sm: 1.25 },
              py: 0.85,
              bgcolor: isActive ? colors.greenBright : 'transparent',
              color: isActive ? colors.onBrandFilled : colors.textSecondary,
              fontFamily: 'inherit',
              fontSize: { xs: '11px', sm: '13px' },
              fontWeight: isActive ? 700 : 600,
              letterSpacing: '0.01em',
              textAlign: 'center',
              lineHeight: 1.2,
              opacity: isUnlocked || isActive ? 1 : 0.4,
              transition: 'background-color 0.15s ease, color 0.15s ease',
              '&:hover':
                isUnlocked && !isActive
                  ? { bgcolor: colors.surfaceAlt, color: colors.navy }
                  : undefined,
              '&:disabled': { cursor: 'default' },
            }}
          >
            <Icon size={14} strokeWidth={isActive ? 2.5 : 2} aria-hidden />
            <Box
              component="span"
              sx={{
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
