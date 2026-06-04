import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { ChevronRight } from 'lucide-react'
import { Badge, BaseCard } from '@/design-system/UIComponents'
import type { PipelineProgress, PipelineStage } from '../data/operationsDashboardMock'

function progressLabel(progress: PipelineProgress): string {
  if (progress === 'on_track') return 'On track'
  if (progress === 'at_risk') return 'At risk'
  return 'Delayed'
}

function progressBadgeColor(progress: PipelineProgress): 'success' | 'warning' | 'error' {
  if (progress === 'on_track') return 'success'
  if (progress === 'at_risk') return 'warning'
  return 'error'
}

function StageCard({ stage }: { stage: PipelineStage }) {
  const theme = useTheme()
  const progressColor = theme.palette[progressBadgeColor(stage.progress)].main

  return (
    <Box
      sx={{
        minWidth: { xs: 132, sm: 148 },
        flexShrink: 0,
        p: 1.5,
        borderRadius: '10px',
        border: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper',
        cursor: 'pointer',
        transition: 'box-shadow 150ms ease, border-color 150ms ease',
        '&:hover': {
          borderColor: alpha(progressColor, 0.5),
          boxShadow: theme.shadows[1],
        },
      }}
    >
      <Typography variant="caption" fontWeight={600} color="text.secondary" sx={{ lineHeight: 1.2 }}>
        {stage.label}
      </Typography>
      <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5, lineHeight: 1.1 }}>
        {stage.total}
      </Typography>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }} flexWrap="wrap" useFlexGap>
        {stage.delayed > 0 ? (
          <Badge label={`${stage.delayed} delayed`} color="warning" size="sm" />
        ) : (
          <Typography variant="caption" color="text.secondary">
            No delays
          </Typography>
        )}
      </Stack>
      <Box sx={{ mt: 0.75 }}>
        <Badge label={progressLabel(stage.progress)} color={progressBadgeColor(stage.progress)} size="sm" />
      </Box>
    </Box>
  )
}

export interface DashboardPipelineTrackerProps {
  stages: PipelineStage[]
}

export function DashboardPipelineTracker({ stages }: DashboardPipelineTrackerProps) {
  const theme = useTheme()

  return (
    <BaseCard>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="subtitle2" fontWeight={700}>
          Application pipeline
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Stage volumes and delayed cases across the visa workflow
        </Typography>
      </Box>
      <Box
        sx={{
          px: 2,
          pb: 2,
          display: 'flex',
          alignItems: 'stretch',
          gap: 0.5,
          overflowX: 'auto',
          '&::-webkit-scrollbar': { height: 6 },
        }}
      >
        {stages.map((stage, index) => (
          <Box key={stage.id} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <StageCard stage={stage} />
            {index < stages.length - 1 ? (
              <ChevronRight
                size={16}
                style={{
                  flexShrink: 0,
                  margin: '0 4px',
                  color: theme.palette.text.disabled,
                }}
              />
            ) : null}
          </Box>
        ))}
      </Box>
    </BaseCard>
  )
}
