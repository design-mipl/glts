import type { ApplicationPipelineStageData } from '../../shared/widgets/operations/ApplicationPipeline'
import {
  APPLICATION_FUNNEL_SEGMENT_SCALE,
  type ApplicationFunnelSegmentId,
} from '../config/applicationFunnelSegments'

/** Scale pipeline stage counts for a selected application-management segment. */
export function scalePipelineStagesBySegment(
  stages: ApplicationPipelineStageData[],
  segment: ApplicationFunnelSegmentId,
): ApplicationPipelineStageData[] {
  if (segment === 'all') return stages

  const factor = APPLICATION_FUNNEL_SEGMENT_SCALE[segment]
  return stages.map((stage) => ({
    ...stage,
    count: Math.max(0, Math.round(stage.count * factor)),
    delayedCount: Math.max(0, Math.round(stage.delayedCount * factor)),
    averageAgeHours: Math.max(
      0,
      Math.round(stage.averageAgeHours * (0.92 + factor * 0.2)),
    ),
    slaPercent: Math.min(
      100,
      Math.max(70, Math.round(stage.slaPercent + (segment === 'corporate' ? 2 : segment === 'b2b' ? -2 : 0))),
    ),
  }))
}
