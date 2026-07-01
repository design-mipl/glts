import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '../DashboardSectionTable'
import { ExecutiveCriticalAlertsPanel } from '../ExecutiveCriticalAlertsPanel'
import { buildTeamWorkloadColumns } from '../columns/teamWorkloadColumns'
import type { ExecutiveCriticalAlert, TeamWorkloadRow } from '../../data/operationsDashboardMock'

export interface TeamWorkloadAlertsSectionProps {
  teamWorkload: TeamWorkloadRow[]
  criticalAlerts: ExecutiveCriticalAlert[]
  getCellValue: (row: TeamWorkloadRow, key: string) => string
  loading?: boolean
}

export function TeamWorkloadAlertsSection({
  teamWorkload,
  criticalAlerts,
  getCellValue,
  loading = false,
}: TeamWorkloadAlertsSectionProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const columns = useMemo(
    () =>
      buildTeamWorkloadColumns({
        onView: (row) =>
          showToast({ title: `Opening ${row.team} workload`, variant: 'info' }),
      }),
    [showToast],
  )

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 8.4 }}>
        <DashboardSectionTable
          title="Team workload dashboard"
          subtitle="Open cases, capacity, and SLA by operational team"
          columns={columns}
          data={teamWorkload}
          rowKey="id"
          getCellValue={getCellValue}
          loading={loading}
          onViewAll={() => navigate('/admin/access/teams')}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 3.6 }}>
        <ExecutiveCriticalAlertsPanel alerts={criticalAlerts} />
      </Grid>
    </Grid>
  )
}
