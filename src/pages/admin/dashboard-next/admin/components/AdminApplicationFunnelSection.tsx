import { useMemo, useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { ApplicationPipeline } from '../../shared'
import type { ApplicationPipelineStageData } from '../../shared/widgets/operations/ApplicationPipeline'
import type { ApplicationPipelineStageId } from '../../shared/config/applicationPipeline'
import {
  APPLICATION_FUNNEL_SEGMENT_ROUTES,
  APPLICATION_FUNNEL_SEGMENT_TABS,
  type ApplicationFunnelSegmentId,
} from '../config/applicationFunnelSegments'
import { scalePipelineStagesBySegment } from '../utils/scalePipelineBySegment'

export interface AdminApplicationFunnelSectionProps {
  stages: ApplicationPipelineStageData[]
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onStageClick?: (stageId: ApplicationPipelineStageId, segment: ApplicationFunnelSegmentId) => void
}

/**
 * Application funnel in one container with segment tabs
 * (All / B2B Agent / Corporate / Marine / Retail) — same Tabs-in-card pattern as
 * application-management workspace tabs.
 */
export function AdminApplicationFunnelSection({
  stages,
  loading,
  onRetry,
  onNavigate,
  onStageClick,
}: AdminApplicationFunnelSectionProps) {
  const colors = usePublicBrandColors()
  const [segment, setSegment] = useState<ApplicationFunnelSegmentId>('all')

  const filteredStages = useMemo(
    () => scalePipelineStagesBySegment(stages, segment),
    [stages, segment],
  )

  const handleStageClick = (stageId: ApplicationPipelineStageId) => {
    if (onStageClick) {
      onStageClick(stageId, segment)
      return
    }
    const base = APPLICATION_FUNNEL_SEGMENT_ROUTES[segment]
    onNavigate(`${base}?stage=${stageId}`)
  }

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
      <Stack spacing={0}>
        <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
          <ExecutiveSectionHeader
            title="Application funnel"
            description="Stage health across the network — filter by application-management segment."
            actionLabel="Open applications"
            onAction={() => onNavigate(APPLICATION_FUNNEL_SEGMENT_ROUTES[segment])}
          />
        </Box>
        <Box
          sx={{
            px: 2,
            borderBottom: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Tabs
            value={segment}
            onChange={(value) => setSegment(value as ApplicationFunnelSegmentId)}
            variant="underline"
            size="sm"
            items={APPLICATION_FUNNEL_SEGMENT_TABS.map((tab) => ({
              value: tab.value,
              label: tab.label,
            }))}
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <ApplicationPipeline
            title={undefined}
            subtitle={undefined}
            stages={filteredStages}
            loading={loading}
            onRetry={onRetry}
            onStageClick={handleStageClick}
            card={false}
            hideHeader
          />
        </Box>
      </Stack>
    </Box>
  )
}
