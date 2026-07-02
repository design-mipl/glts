import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import {
  ExecutiveSectionHeader,
  ExecutiveTeamWorkloadPanel,
} from '@/pages/admin/dashboard/components'
import type { TeamWorkloadRow } from '../../data/operationsDashboardMock'

export interface TeamWorkloadSectionProps {
  teamWorkload: TeamWorkloadRow[]
}

export function TeamWorkloadSection({ teamWorkload }: TeamWorkloadSectionProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()

  return (
    <>
      <ExecutiveSectionHeader
        title="Team workload"
        description="Capacity, SLA health, and throughput across operational teams."
        actionLabel="View teams"
        onAction={() => navigate('/admin/access/teams')}
      />
      <ExecutiveTeamWorkloadPanel
        items={teamWorkload.map((row) => ({
          id: row.id,
          team: row.team,
          openCases: row.openCases,
          completedToday: row.completedToday,
          capacityPct: row.capacityPct,
          slaPct: row.slaPct,
        }))}
        onViewTeam={(item) =>
          showToast({ title: `Opening ${item.team} queue`, variant: 'info' })
        }
      />
    </>
  )
}
