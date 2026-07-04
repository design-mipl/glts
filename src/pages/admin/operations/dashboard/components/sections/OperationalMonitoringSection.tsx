import { useMemo } from 'react'
import { Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '../DashboardSectionTable'
import { buildEscalationColumns } from '../columns/escalationColumns'
import { buildNoMovementColumns } from '../columns/noMovementColumns'
import type { EscalationRow, NoMovementCaseRow } from '../../data/operationsDashboardMock'

export interface OperationalMonitoringSectionProps {
  escalations: EscalationRow[]
  noMovementCases: NoMovementCaseRow[]
  getEscalationCellValue: (row: EscalationRow, key: string) => string
  getNoMovementCellValue: (row: NoMovementCaseRow, key: string) => string
  loading?: boolean
}

export function OperationalMonitoringSection({
  escalations,
  noMovementCases,
  getEscalationCellValue,
  getNoMovementCellValue,
  loading = false,
}: OperationalMonitoringSectionProps) {
  const navigate = useNavigate()
  const { showToast } = useToast()

  const escalationColumns = useMemo(
    () =>
      buildEscalationColumns({
        onView: (row) =>
          showToast({ title: `Opening escalation by ${row.raisedBy}`, variant: 'info' }),
      }),
    [showToast],
  )

  const noMovementColumns = useMemo(
    () =>
      buildNoMovementColumns({
        onView: (row) =>
          showToast({ title: `Opening ${row.applicationId}`, variant: 'info' }),
      }),
    [showToast],
  )

  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSectionTable
          title="Escalations"
          subtitle="Open escalations requiring management review."
          actionLabel="Review cases"
          columns={escalationColumns}
          data={escalations}
          rowKey="id"
          getCellValue={getEscalationCellValue}
          loading={loading}
          onViewAll={() => navigate('/admin/ground-operations/case-handling')}
        />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DashboardSectionTable
          title="No movement cases"
          subtitle="Applications with no activity beyond configured SLA."
          actionLabel="Open queue"
          columns={noMovementColumns}
          data={noMovementCases}
          rowKey="id"
          getCellValue={getNoMovementCellValue}
          loading={loading}
          onViewAll={() => navigate('/admin/assignment-priority/marine')}
        />
      </Grid>
    </Grid>
  )
}
