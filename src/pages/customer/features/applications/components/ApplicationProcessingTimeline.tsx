import { Box, Stack, Typography } from '@mui/material'
import { Check, Circle, Clock3 } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { SubmitTimelineStatus } from '../types/applicationDetail.types'

export interface ApplicationProcessingTimelineStep {
  id: string
  label: string
  status: SubmitTimelineStatus
}

interface ApplicationProcessingTimelineProps {
  steps: ApplicationProcessingTimelineStep[]
}

export function ApplicationProcessingTimeline({ steps }: ApplicationProcessingTimelineProps) {
  const colors = usePublicBrandColors()

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
                <Typography sx={{ fontSize: 11, fontWeight: isCompleted || isActive ? 700 : 600, color: textColor, pr: 0.5 }}>
                  {step.label}
                </Typography>
              </Stack>
            </Box>
          )
        })}
      </Stack>
    </Box>
  )
}
