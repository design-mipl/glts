import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { ChevronRight } from 'lucide-react'
import { Badge } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import type { PipelineProgress, PipelineStage } from '../data/operationsDashboardMock'

function progressLabel(progress: PipelineProgress): string {
  if (progress === 'on_track') return 'On track'
  if (progress === 'at_risk') return 'Near SLA'
  return 'SLA breached'
}

function progressBadgeColor(progress: PipelineProgress): 'success' | 'warning' | 'error' {
  if (progress === 'on_track') return 'success'
  if (progress === 'at_risk') return 'warning'
  return 'error'
}

function StageNode({ stage }: { stage: PipelineStage }) {
  const theme = useTheme()
  const colors = usePublicBrandColors()
  const accent = theme.palette[progressBadgeColor(stage.progress)].main

  return (
    <Box
      sx={{
        minWidth: { xs: 128, sm: 136 },
        flexShrink: 0,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          p: 1.25,
          borderRadius: '12px',
          border: `1px solid ${colors.border}`,
          bgcolor: colors.white,
          boxShadow: stage.delayed > 0 ? `inset 0 -2px 0 0 ${alpha(accent, 0.55)}` : undefined,
          cursor: 'pointer',
          transition: 'box-shadow 160ms ease, border-color 160ms ease, transform 160ms ease',
          '&:hover': {
            borderColor: accent,
            transform: 'translateY(-1px)',
            boxShadow: theme.shadows[2],
          },
        }}
      >
        <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textMuted, lineHeight: 1.2 }}>
          {stage.label}
        </Typography>
        <Typography sx={{ fontSize: 20, fontWeight: 900, color: colors.navy, mt: 0.35, lineHeight: 1 }}>
          {stage.total}
        </Typography>
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }} flexWrap="wrap" useFlexGap>
          {stage.delayed > 0 ? (
            <Badge label={`${stage.delayed} delayed`} color="warning" size="sm" />
          ) : (
            <Typography sx={{ fontSize: 10, color: colors.textMuted }}>No delays</Typography>
          )}
          <Badge label={progressLabel(stage.progress)} color={progressBadgeColor(stage.progress)} size="sm" />
        </Stack>
      </Box>
    </Box>
  )
}

function StageConnector() {
  const colors = usePublicBrandColors()
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        flexShrink: 0,
        px: 0.25,
        color: colors.textMuted,
      }}
    >
      <Box sx={{ width: 12, height: 2, bgcolor: colors.border, borderRadius: 99 }} />
      <ChevronRight size={14} />
      <Box sx={{ width: 12, height: 2, bgcolor: colors.border, borderRadius: 99 }} />
    </Box>
  )
}

export interface DashboardPipelineTrackerProps {
  stages: PipelineStage[]
  title?: string
  subtitle?: string
  onViewPipeline?: () => void
}

export function DashboardPipelineTracker({
  stages,
  title = 'Application lifecycle pipeline',
  subtitle = 'Connected workflow stages with volume, delays, and SLA health',
  onViewPipeline,
}: DashboardPipelineTrackerProps) {
  const colors = usePublicBrandColors()

  return (
    <Box>
      <ExecutiveSectionHeader
        title={title}
        description={subtitle}
        actionLabel="View pipeline"
        onAction={onViewPipeline}
      />
      <Box sx={{ ...executiveCardLevel2Sx(colors), px: 2, py: 2 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.25,
            overflowX: 'auto',
            pb: 0.5,
            '&::-webkit-scrollbar': { height: 6 },
            '&::-webkit-scrollbar-thumb': {
              bgcolor: colors.border,
              borderRadius: 99,
            },
          }}
        >
          {stages.map((stage, index) => (
            <Box key={stage.id} sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <StageNode stage={stage} />
              {index < stages.length - 1 ? <StageConnector /> : null}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  )
}
