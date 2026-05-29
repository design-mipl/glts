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
  p: 0.25,
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
    <Box sx={{ width: '100%', py: { xs: 1, md: 1.25 } }}>
      <Stack
        direction="row"
        spacing={`${SEGMENT_GAP}px`}
        sx={{ width: '100%' }}
        role="progressbar"
        aria-valuenow={activeIndex + 1}
        aria-valuemin={1}
        aria-valuemax={steps.length}
        aria-label={`Step ${activeIndex + 1} of ${steps.length}: ${current?.label ?? ''}`}
      >
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

      <Stack
        direction="row"
        alignItems="center"
        justifyContent={showNav ? 'space-between' : 'center'}
        sx={{ mt: 1, minHeight: 24 }}
      >
        {onPrevious ? (
          <IconButton
            size="small"
            onClick={onPrevious}
            disabled={disablePrevious}
            aria-label="Previous step"
            sx={arrowButtonSx(colors)}
          >
            <ChevronLeft size={18} />
          </IconButton>
        ) : showNav ? (
          <Box sx={{ width: 28 }} />
        ) : null}

        <Typography
          noWrap
          sx={{
            flex: showNav ? 1 : undefined,
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 500,
            color: colors.textSecondary,
            lineHeight: 1.3,
            px: showNav ? 1 : 0,
          }}
        >
          <Box component="span" sx={{ color: colors.navy, fontWeight: 600 }}>
            {current?.label}
          </Box>
          <Box component="span" sx={{ color: colors.textMuted, mx: 0.75 }}>
            ·
          </Box>
          {activeIndex + 1} of {steps.length}
        </Typography>

        {onNext ? (
          <IconButton
            size="small"
            onClick={onNext}
            disabled={disableNext}
            aria-label="Next step"
            sx={arrowButtonSx(colors)}
          >
            <ChevronRight size={18} />
          </IconButton>
        ) : showNav ? (
          <Box sx={{ width: 28 }} />
        ) : null}
      </Stack>
    </Box>
  )
}
