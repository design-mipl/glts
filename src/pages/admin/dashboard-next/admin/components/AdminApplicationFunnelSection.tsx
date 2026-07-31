import { Box, Stack } from '@mui/material'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { ApplicationPipeline } from '../../shared'
import type { ApplicationPipelineStageData } from '../../shared/widgets/operations/ApplicationPipeline'
import type { ApplicationPipelineStageId } from '../../shared/config/applicationPipeline'
import {
  APPLICATION_MANAGEMENT_LIST_BASE,
  applicationPipelineStageHref,
} from '../../shared/config/applicationPipeline'
import { useDashboardFiltersOptional } from '../../shared/dashboard-intelligence'

export interface AdminApplicationFunnelSectionProps {
  stages: ApplicationPipelineStageData[]
  loading?: boolean
  onRetry?: () => void
  onNavigate: (href: string) => void
  onStageClick?: (stageId: ApplicationPipelineStageId) => void
}

/**
 * Application funnel — Application Management listing tabs as pipeline stages.
 * Counts respect page global filters (date, segment, country, client, team).
 */
export function AdminApplicationFunnelSection({
  stages,
  loading,
  onRetry,
  onNavigate,
  onStageClick,
}: AdminApplicationFunnelSectionProps) {
  const colors = usePublicBrandColors()
  const filterCtx = useDashboardFiltersOptional()
  const segmentLabel =
    filterCtx?.filters.segment && filterCtx.filters.segment !== 'all'
      ? filterCtx.filters.segment
      : 'all segments'

  const handleStageClick = (stageId: ApplicationPipelineStageId) => {
    if (onStageClick) {
      onStageClick(stageId)
      return
    }
    onNavigate(applicationPipelineStageHref(stageId))
  }

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
      <Stack spacing={0}>
        <Box sx={{ px: 2, pt: 2, pb: 1.5 }}>
          <ExecutiveSectionHeader
            title="Application pipeline — by state"
            description={`Application Management queues (${segmentLabel}). Uses page global filters.`}
            actionLabel="Open applications"
            onAction={() => onNavigate(APPLICATION_MANAGEMENT_LIST_BASE)}
          />
        </Box>
        <Box sx={{ p: 2 }}>
          <ApplicationPipeline
            title={undefined}
            subtitle={undefined}
            stages={stages}
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
