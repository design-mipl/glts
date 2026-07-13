import { Box, Stack, Typography, IconButton } from '@mui/material'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

const BAR_HEIGHT = 3
const SEGMENT_GAP = 4

export interface FlowStep {
  id: string
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

const arrowButtonSx = (colors: ReturnType<typeof usePublicBrandColors>) => ({
  flexShrink: 0,
  width: 24,
  height: 24,
  p: 0,
  color: colors.textMuted,
  '&:hover': { bgcolor: 'transparent', color: colors.navy },
  '&.Mui-disabled': { color: colors.textMuted, opacity: 0.35 },
})

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
  const current = steps[activeIndex]
  const showNav = Boolean(onPrevious || onNext)

  return (
    <Box sx={{ width: '100%', pt: 0.25, pb: 0 }}>
      <Typography
        noWrap
        sx={{
          mb: 0.5,
          textAlign: 'center',
          fontSize: 13,
          fontWeight: 500,
          color: colors.textSecondary,
          lineHeight: 1.2,
        }}
      >
        <Box component="span" sx={{ color: colors.navy, fontWeight: 600 }}>
          {current?.label}
        </Box>
        <Box component="span" sx={{ color: colors.textMuted, mx: 0.75 }}>
          {activeIndex + 1} of {steps.length}
        </Box>
      </Typography>

      <Stack
        direction="row"
        alignItems="center"
        spacing={0.5}
        sx={{ width: '100%' }}
        role="progressbar"
        aria-valuenow={activeIndex + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-label={`Step ${activeIndex + 1} of ${steps.length}: ${current?.label ?? ''}`}
      >
        {onPrevious ? (
          <IconButton
            size="small"
            onClick={onPrevious}
            disabled={disablePrevious}
            aria-label="Previous step"
            sx={arrowButtonSx(colors)}
          >
            <ChevronLeft size={16} />
          </IconButton>
        ) : showNav ? (
          <Box sx={{ width: 24, flexShrink: 0 }} />
        ) : null}

        <Stack direction="row" spacing={`${SEGMENT_GAP}px`} sx={{ flex: 1, minWidth: 0 }}>
          {steps.map((step, i) => {
            const filled = i <= activeIndex
            const clickable = Boolean(onStepClick && i <= activeIndex)

            return (
              <Box
                key={step.id}
                role={clickable ? 'button' : undefined}
                tabIndex={clickable ? 0 : undefined}
                aria-current={i === activeIndex ? 'step' : undefined}
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
                  height: BAR_HEIGHT,
                  borderRadius: 999,
                  bgcolor: filled ? colors.navy : colors.surfaceAlt,
                  cursor: clickable ? 'pointer' : 'default',
                  transition: 'background-color 180ms ease',
                }}
              />
            )
          })}
        </Stack>

        {onNext ? (
          <IconButton
            size="small"
            onClick={onNext}
            disabled={disableNext}
            aria-label="Next step"
            sx={arrowButtonSx(colors)}
          >
            <ChevronRight size={16} />
          </IconButton>
        ) : showNav ? (
          <Box sx={{ width: 24, flexShrink: 0 }} />
        ) : null}
      </Stack>
    </Box>
  )
}
