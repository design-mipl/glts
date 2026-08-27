import { Box, Stack, Typography } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { PublicBrandColors } from '@/shared/theme/publicBrand'
import { statusVisualRadius } from '@/pages/website-v2/theme/statusVisualTokens'
import type { StatusStepConfig, StatusStepState } from './types'

export interface StatusStepperProps {
  /** Any number of steps — drives Application Tracking and the Cancellation Policy timeline. */
  steps: StatusStepConfig[]
  orientation?: 'vertical' | 'horizontal'
}

const CIRCLE_SIZE = 28
const ICON_VIEWBOX = 24

/** Hand-drawn check — custom path, not an icon-library glyph. */
function CheckmarkPath({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`} aria-hidden fill="none">
      <path
        d="M5.2 12.4c1.6 1.55 3.1 3.35 4.55 5.5 3.4-6.85 6.35-10.9 9.05-13.4"
        stroke={color}
        strokeWidth={2.4}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/** Custom clock glyph for the current step — muted amber tint hosts this path. */
function ClockPath({ color }: { color: string }) {
  return (
    <svg width={14} height={14} viewBox={`0 0 ${ICON_VIEWBOX} ${ICON_VIEWBOX}`} aria-hidden fill="none">
      <circle cx="12" cy="12" r="7.25" stroke={color} strokeWidth={1.75} />
      <path
        d="M12 8.2v4.15l2.85 1.7"
        stroke={color}
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function StepCircle({ step, colors }: { step: StatusStepConfig; colors: PublicBrandColors }) {
  if (step.state === 'completed') {
    return (
      <Box
        sx={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: statusVisualRadius.full,
          bgcolor: colors.navy,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <CheckmarkPath color={colors.onBrandFilled} />
      </Box>
    )
  }

  if (step.state === 'current') {
    return (
      <Box
        sx={{
          width: CIRCLE_SIZE,
          height: CIRCLE_SIZE,
          borderRadius: statusVisualRadius.full,
          bgcolor: colors.goldMuted,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <ClockPath color={colors.goldDark} />
      </Box>
    )
  }

  return (
    <Box
      sx={{
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: statusVisualRadius.full,
        border: `1.5px dashed ${colors.border}`,
        bgcolor: 'transparent',
        flexShrink: 0,
      }}
    />
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

function StepCopy({
  step,
  colors,
  align = 'left',
}: {
  step: StatusStepConfig
  colors: PublicBrandColors
  align?: 'left' | 'center'
}) {
  return (
    <>
      <Typography
        sx={{
          fontSize: align === 'center' ? 12.5 : 13.5,
          fontWeight: 700,
          color: colors.navy,
          textAlign: align,
        }}
      >
        {step.label}
      </Typography>
      {step.description ? (
        <Typography
          sx={{
            fontSize: align === 'center' ? 11 : 12,
            color: colors.textMuted,
            mt: 0.15,
            textAlign: align,
            fontVariantNumeric: 'tabular-nums',
            fontFeatureSettings: '"tnum"',
          }}
        >
          {step.description}
        </Typography>
      ) : null}
      <Box sx={{ display: 'flex', justifyContent: align === 'center' ? 'center' : 'flex-start' }}>
        <StatePill state={step.state} colors={colors} />
      </Box>
    </>
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
                    minHeight: 28,
                    flex: 1,
                    my: 0.5,
                    bgcolor: connectorSolid ? colors.navy : 'transparent',
                    backgroundImage: connectorSolid
                      ? 'none'
                      : `repeating-linear-gradient(to bottom, ${colors.border} 0 4px, transparent 4px 9px)`,
                  }}
                />
              ) : null}
            </Stack>
            <Box sx={{ pb: isLast ? 0 : 2.25, pt: 0.2 }}>
              <StepCopy step={step} colors={colors} />
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
                  bgcolor: prevCompleted ? colors.navy : 'transparent',
                  backgroundImage: prevCompleted
                    ? 'none'
                    : `repeating-linear-gradient(to right, ${colors.border} 0 4px, transparent 4px 9px)`,
                  zIndex: 0,
                }}
              />
            ) : null}
            <Box sx={{ position: 'relative', zIndex: 1 }}>
              <StepCircle step={step} colors={colors} />
            </Box>
            <Box sx={{ mt: 1, width: '100%' }}>
              <StepCopy step={step} colors={colors} align="center" />
            </Box>
          </Box>
        )
      })}
    </Stack>
  )
}

/** Generic, config-driven step indicator — any length. Previewed in isolation before product wiring. */
export function StatusStepper({ steps, orientation = 'vertical' }: StatusStepperProps) {
  const colors = usePublicBrandColors()
  if (!steps.length) return null
  return orientation === 'horizontal' ? (
    <HorizontalStepper steps={steps} colors={colors} />
  ) : (
    <VerticalStepper steps={steps} colors={colors} />
  )
}
