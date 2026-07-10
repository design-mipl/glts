import { useNavigate } from 'react-router-dom'
import { DashboardPipelineTracker } from '../DashboardPipelineTracker'
import type { PipelineStage } from '../../data/operationsDashboardMock'

export interface ExecutivePipelineSectionProps {
  stages: PipelineStage[]
}

export function ExecutivePipelineSection({ stages }: ExecutivePipelineSectionProps) {
  const navigate = useNavigate()

  return (
    <DashboardPipelineTracker
      stages={stages}
      onViewPipeline={() => navigate('/admin/application-management/marine')}
    />
  )
}
