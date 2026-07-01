import { DashboardPipelineTracker } from '../DashboardPipelineTracker'
import type { PipelineStage } from '../../data/operationsDashboardMock'

export interface ExecutivePipelineSectionProps {
  stages: PipelineStage[]
}

export function ExecutivePipelineSection({ stages }: ExecutivePipelineSectionProps) {
  return <DashboardPipelineTracker stages={stages} title="Application lifecycle pipeline" />
}
