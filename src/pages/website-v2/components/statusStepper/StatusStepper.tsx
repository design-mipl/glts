import { Box, Stack, Typography } from '@mui/material'
import { Check } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { PublicBrandColors } from '@/shared/theme/publicBrand'
import { statusVisualRadius } from '@/pages/website-v2/theme/statusVisualTokens'
import type { StatusStepConfig, StatusStepState } from './types'

export interface StatusStepperProps {
  /** Any number of steps — drives Application Tracking and the Cancellation Policy timeline. */
  steps: StatusStepConfig[]
  orientation?: 'vertical' | 'horizontal'
}

const CIRCLE_SIZE = 32
const DASHED_LINE = (colorHex: string) =>
  `repeating-linear-gradient(to bottom, ${colorHex} 0 4px, transparent 4px 9px)`
const DASHED_LINE_HORIZONTAL = (colorHex: string) =>
  `repeating-linear-gradient(to right, ${colorHex} 0 4px, transparent 4px 9px)`

function StepCircle({ step, colors }: { step: StatusStepConfig; colors: PublicBrandColors }) {
  if (step.state === 'completed') {
    return (
      <Box
        sx={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: statusVisualRadius.full,
          bgcolor: colors.greenBright,
          color: colors.onBrandFilled,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Check size={16} strokeWidth={3} />
      </Box>
    )
  }

  if (step.state === 'current') {
    const Icon = step.icon
    return (
      <Box
        sx={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: statusVisualRadius.full,
          bgcolor: colors.goldBright,
          color: colors.onBrandFilled,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: `0 0 0 4px ${colors.goldBright}29`,
        }}
      >
        {Icon ? <Icon size={15} strokeWidth={2.25} /> : null}
      </Box>
    )
  }

  const PendingIcon = step.icon
  return (
    <Box
      sx={{
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: statusVisualRadius.full,
        border: `1.5px dashed ${colors.border}`,
        color: colors.textMuted,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {PendingIcon ? <PendingIcon size={13} strokeWidth={2} /> : null}
    </Box>
  )
}

function StatePill({ state, colors }: { state: StatusStepState; colors: PublicBrandColors }) {
  const tone =
    state === 'completed'
      ? { label: 'Completed', bg: colors.greenMuted, text: colors.greenDark }
      : state === 'current'
        ? { label: 'In Progress', bg: colors.goldMuted, text: colors.goldDark }
        : { label: 'Pending', bg: colors.surfaceAlt, text: colors.textMuted }

  return (
    <Box
      sx={{
        display: 'inline-flex',
        mt: 0.5,
        px: 1,
        py: 0.3,
        borderRadius: 999,
        bgcolor: tone.bg,
      }}
    >
      <Typography sx={{ fontSize: 11, fontWeight: 700, color: tone.text }}>{tone.label}</Typography>
    </Box>
  )
}

function VerticalStepper({ steps, colors }: { steps: StatusStepConfig[]; colors: PublicBrandColors }) {
  return (
    <Stack spacing={0}>
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1
        const connectorSolid = step.state === 'completed'
        return (
          <Stack key={step.id} direction="row" spacing={1.5} alignItems="flex-start">
            <Stack alignItems="center" sx={{ flexShrink: 0 }}>
              <StepCircle step={step} colors={colors} />
              {!isLast ? (
                <Box
                  sx={{
                    width: 2,
                    minHeight: 30,
                    flex: 1,
                    my: 0.5,
                    background: connectorSolid ? colors.greenBright : DASHED_LINE(colors.border),
                  }}
                />
              ) : null}
            </Stack>
            <Box sx={{ pb: isLast ? 0 : 2.5, pt: 0.35 }}>
              <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: colors.navy }}>{step.label}</Typography>
              {step.description ? (
                <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.15 }}>{step.description}</Typography>
              ) : null}
              <StatePill state={step.state} colors={colors} />
            </Box>
          </Stack>
        )
      })}
    </Stack>
  )
}

function HorizontalStepper({ steps, colors }: { steps: StatusStepConfig[]; colors: PublicBrandColors }) {
  return (
    <Stack direction="row" alignItems="flex-start">
      {steps.map((step, index) => {
        const prevCompleted = index > 0 && steps[index - 1].state === 'completed'
        return (
          <Box
            key={step.id}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              flex: 1,
              minWidth: 0,
              px: 0.5,
            }}
          >
            {index !== 0 ? (
              <Box
                sx={{
                  position: 'absolute',
                  top: CIRCLE_SIZE / 2 - 1,
                  left: '-50%',
                  width: '100%',
                  height: 2,
                  background: prevCompleted ? colors.greenBright : DASHED_LINE_HORIZONTAL(colors.border),
                  zIndex: 0,
                }}
              />
            ) : null}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <StepCircle step={step} colors={colors} />
            </Box>
            <Typography
              sx={{ fontSize: 12.5, fontWeight: 700, color: colors.navy, mt: 1, textAlign: 'center' }}
            >
              {step.label}
            </Typography>
            {step.description ? (
              <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.15, textAlign: 'center' }}>
                {step.description}
              </Typography>
            ) : null}
            <StatePill state={step.state} colors={colors} />
          </Box>
        )
      })}
    </Stack>
  )
}

/** Generic, config-driven step indicator — any length. Drives Application Tracking and the Cancellation Policy timeline. Not wired to a real screen yet. */
export function StatusStepper({ steps, orientation = 'vertical' }: StatusStepperProps) {
  const colors = usePublicBrandColors()
  if (!steps.length) return null
  return orientation === 'horizontal' ? (
    <HorizontalStepper steps={steps} colors={colors} />
  ) : (
    <VerticalStepper steps={steps} colors={colors} />
  )
}
