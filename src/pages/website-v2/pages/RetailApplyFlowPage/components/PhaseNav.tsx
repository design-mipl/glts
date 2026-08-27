import { Box } from '@mui/material'
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

/** Vertical journey chrome — icon above label, no card container. */
export function PhaseNav({ currentPhase, unlockedPhases, onSelectPhase }: PhaseNavProps) {
  const colors = usePublicBrandColors()

  return (
    <Box
      role="navigation"
      aria-label="Application phases"
      sx={{
        display: 'flex',
        flexDirection: { xs: 'row', md: 'column' },
        alignItems: 'center',
        justifyContent: { xs: 'flex-start', md: 'center' },
        width: '100%',
        height: { xs: 'auto', md: '100%' },
        gap: { xs: 1.5, md: 4.5 },
        p: 0,
        bgcolor: 'transparent',
        boxSizing: 'border-box',
        overflowX: { xs: 'auto', md: 'visible' },
      }}
    >
      {RETAIL_PHASE_ORDER.map((phase) => {
        const isActive = phase === currentPhase
        const isUnlocked = unlockedPhases.has(phase)
        const Icon = PHASE_ICON[phase]
        const tone = isActive
          ? colors.greenBright
          : isUnlocked
            ? colors.navy
            : colors.textMuted

        return (
          <Box
            key={phase}
            component="button"
            type="button"
            disabled={!isUnlocked}
            onClick={() => isUnlocked && onSelectPhase(phase)}
            aria-current={isActive ? 'step' : undefined}
            sx={{
              appearance: 'none',
              border: 'none',
              bgcolor: 'transparent',
              cursor: isUnlocked ? 'pointer' : 'default',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              width: { xs: 'auto', md: '100%' },
              flex: '0 0 auto',
              minWidth: { xs: 48, md: 0 },
              px: { xs: 0.5, md: 0 },
              py: 0,
              fontFamily: 'inherit',
              color: tone,
              opacity: isUnlocked || isActive ? 1 : 0.55,
              transition: 'color 0.15s ease, opacity 0.15s ease',
              '&:hover':
                isUnlocked && !isActive
                  ? { color: colors.greenBright }
                  : undefined,
              '&:disabled': { cursor: 'default' },
            }}
          >
            <Icon size={20} strokeWidth={isActive ? 2.25 : 1.75} aria-hidden />
            <Box
              component="span"
              sx={{
                fontSize: 11,
                fontWeight: isActive ? 700 : 500,
                lineHeight: 1.15,
                textAlign: 'center',
                whiteSpace: 'nowrap',
                display: { xs: isActive ? 'block' : 'none', md: 'block' },
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
