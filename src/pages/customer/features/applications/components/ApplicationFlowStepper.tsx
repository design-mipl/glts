import { Box, Stack, Typography, IconButton } from '@mui/material'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo } from 'react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

const BAR_HEIGHT = 5
const SEGMENT_GAP = 7

export interface FlowStep {
  id: string
  /** Display name in `01 · NAME` (uppercased automatically) */
  label: string
}

interface ApplicationFlowStepperProps {
  steps: FlowStep[]
  activeIndex: number
  onStepClick?: (index: number) => void
  onPrevious?: () => void
  onNext?: () => void
  disablePrevious?: boolean
  disableNext?: boolean
}

function formatStepCaption(index: number, label: string): string {
  const num = String(index + 1).padStart(2, '0')
  return `${num} · ${label.toUpperCase()}`
}

export function ApplicationFlowStepper({
  steps,
  activeIndex,
  onStepClick,
  onPrevious,
  onNext,
  disablePrevious = false,
  disableNext = false,
}: ApplicationFlowStepperProps) {
  const colors = usePublicBrandColors()
  const stepperColors = useMemo(
    () => ({
      barActive: colors.greenBright,
      barInactive: colors.surfaceAlt,
      labelCompleted: colors.greenDark,
      labelActive: colors.navy,
      labelInactive: colors.textMuted,
    }),
    [colors],
  )

  const arrowButtonSx = {
    flexShrink: 0,
    p: 0.5,
    mt: '-12px',
    color: colors.textSecondary,
    '&:hover': { bgcolor: 'transparent', color: colors.navy },
    '&.Mui-disabled': { color: colors.textMuted, opacity: 0.45 },
  }

  return (
    <Box
      sx={{
        width: '100%',
        py: { xs: 1.75, md: 2.25 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ width: '100%' }}>
        {onPrevious && (
          <IconButton
            size="small"
            onClick={onPrevious}
            disabled={disablePrevious}
            aria-label="Previous step"
            sx={arrowButtonSx}
          >
            <ChevronLeft size={22} />
          </IconButton>
        )}
        <Stack direction="row" spacing={`${SEGMENT_GAP}px`} sx={{ flex: 1, minWidth: 0 }}>
        {steps.map((step, i) => {
          const completed = i < activeIndex
          const active = i === activeIndex
          const clickable = Boolean(onStepClick && i <= activeIndex)
          const barFilled = completed || active

          const labelColor = active
            ? stepperColors.labelActive
            : completed
              ? stepperColors.labelCompleted
              : stepperColors.labelInactive

          return (
            <Box
              key={step.id}
              role={clickable ? 'button' : undefined}
              tabIndex={clickable ? 0 : undefined}
              aria-current={active ? 'step' : undefined}
              aria-label={step.label}
              onClick={clickable ? () => onStepClick?.(i) : undefined}
              onKeyDown={
                clickable
                  ? e => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault()
                        onStepClick?.(i)
                      }
                    }
                  : undefined
              }
              sx={{
                flex: 1,
                minWidth: 0,
                cursor: clickable ? 'pointer' : 'default',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: BAR_HEIGHT,
                  borderRadius: '2px',
                  bgcolor: barFilled ? stepperColors.barActive : stepperColors.barInactive,
                  transition: 'background-color 220ms ease',
                }}
              />
              <Typography
                noWrap
                sx={{
                  mt: 0.75,
                  fontSize: { xs: '8px', sm: '9px', md: '10px' },
                  fontWeight: active ? 700 : completed ? 600 : 500,
                  letterSpacing: '0.04em',
                  color: labelColor,
                  textAlign: 'center',
                  lineHeight: 1.2,
                  transition: 'color 220ms ease',
                }}
              >
                {formatStepCaption(i, step.label)}
              </Typography>
            </Box>
          )
        })}
        </Stack>
        {onNext && (
          <IconButton
            size="small"
            onClick={onNext}
            disabled={disableNext}
            aria-label="Next step"
            sx={arrowButtonSx}
          >
            <ChevronRight size={22} />
          </IconButton>
        )}
      </Stack>
    </Box>
  )
}
