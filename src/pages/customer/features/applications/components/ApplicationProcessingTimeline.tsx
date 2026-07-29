import { Box, Stack, Typography } from '@mui/material'
import { Check, Circle, Clock3 } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'

export type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'

interface ApplicationProcessingTimelineProps {
  steps: ApplicationProcessingTimelineStep[]
  orientation?: 'horizontal' | 'vertical'
}

function statusLabel(status: ApplicationProcessingTimelineStep['status']): string {
  if (status === 'completed') return 'Completed'
  if (status === 'active') return 'In progress'
  return 'Pending'
}

export function ApplicationProcessingTimeline({
  steps,
  orientation = 'horizontal',
}: ApplicationProcessingTimelineProps) {
  const colors = usePublicBrandColors()

  if (orientation === 'vertical') {
    return (
      <Box
        sx={{
          px: 1.5,
          py: 1.5,
          borderRadius: '10px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.white,
        }}
      >
        <Stack spacing={0}>
          {steps.map((step, index) => {
            const isCompleted = step.status === 'completed'
            const isActive = step.status === 'active'
            const dotBorder = isCompleted ? colors.green : isActive ? '#60A5FA' : colors.border
            const textColor = isCompleted || isActive ? colors.navy : colors.textMuted
            const connectorColor = isCompleted ? colors.greenBright : isActive ? '#93C5FD' : colors.border
            const isLast = index === steps.length - 1

            return (
              <Stack key={step.id} direction="row" spacing={1.25} alignItems="stretch">
                <Stack alignItems="center" sx={{ width: 28, flexShrink: 0 }}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: colors.white,
                      border: `1px solid ${dotBorder}`,
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isCompleted ? (
                      <Check size={14} color={colors.greenDark} />
                    ) : isActive ? (
                      <Clock3 size={14} color="#2563EB" />
                    ) : (
                      <Circle size={12} color={colors.textMuted} />
                    )}
                  </Box>
                  {!isLast ? (
                    <Box
                      sx={{
                        width: 3,
                        flex: 1,
                        minHeight: 20,
                        borderRadius: 2,
                        bgcolor: connectorColor,
                        my: 0.5,
                      }}
                    />
                  ) : null}
                </Stack>

                <Box sx={{ pb: isLast ? 0 : 2, minWidth: 0, flex: 1, pt: 0.25 }}>
                  <Typography
                    sx={{
                      fontSize: 13,
                      fontWeight: isCompleted || isActive ? 700 : 600,
                      color: textColor,
                      lineHeight: 1.35,
                    }}
                  >
                    {step.label}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.25 }}>
                    {statusLabel(step.status)}
                    {step.date ? ` · ${step.date}` : ''}
                  </Typography>
                </Box>
              </Stack>
            )
          })}
        </Stack>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        px: 1,
        py: 1.25,
        borderRadius: '10px',
        border: `1px solid ${colors.border}`,
        bgcolor: colors.white,
      }}
    >
      <Stack direction="row" spacing={1.25} sx={{ width: '100%', overflowX: 'auto', pb: 0.5 }}>
        {steps.map((step, index) => {
          const isCompleted = step.status === 'completed'
          const isActive = step.status === 'active'
          const dotBorder = isCompleted ? colors.green : isActive ? '#60A5FA' : colors.border
          const textColor = isCompleted || isActive ? colors.navy : colors.textMuted
          const connectorColor = isCompleted ? colors.greenBright : isActive ? '#93C5FD' : colors.border

          return (
            <Box
              key={step.id}
              sx={{
                minWidth: 158,
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                px: 0.25,
              }}
            >
              <Stack spacing={0.6} sx={{ minWidth: 0, width: '100%' }}>
                <Stack direction="row" alignItems="center" spacing={0.75}>
                  <Box
                    sx={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      bgcolor: colors.white,
                      border: `1px solid ${dotBorder}`,
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isCompleted ? (
                      <Check size={14} color={colors.greenDark} />
                    ) : isActive ? (
                      <Clock3 size={14} color="#2563EB" />
                    ) : (
                      <Circle size={12} color={colors.textMuted} />
                    )}
                  </Box>
                  {index < steps.length - 1 && (
                    <Box
                      sx={{
                        height: 3,
                        flex: 1,
                        borderRadius: 2,
                        bgcolor: connectorColor,
                      }}
                    />
                  )}
                </Stack>
                <Typography
                  sx={{
                    fontSize: 11,
                    fontWeight: isCompleted || isActive ? 700 : 600,
                    color: textColor,
                    pr: 0.5,
                  }}
                >
                  {step.label}
                </Typography>
                {step.date ? (
                  <Typography sx={{ fontSize: 10, color: colors.textMuted, pr: 0.5 }}>
                    {step.date}
                  </Typography>
                ) : null}
              </Stack>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
