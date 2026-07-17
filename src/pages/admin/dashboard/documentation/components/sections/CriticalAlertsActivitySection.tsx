import { useMemo } from 'react'
import { Grid, Stack } from '@mui/material'
import { Alert } from '@/design-system/UIComponents'
import { DashboardSectionTable } from '@/pages/admin/dashboard/components'
import { DocumentationCriticalAlertsPanel } from '../DocumentationCriticalAlertsPanel'
import { buildDocumentationActivityColumns } from '../columns/documentationActivityColumns'
import { DOCUMENTATION_LISTING_TABLE_SX } from '../documentationTableTokens'
import type { DocumentationActivityRow, DocumentationCriticalAlert } from '../../data/documentationDashboardMock'

export interface CriticalAlertsActivitySectionProps {
  criticalAlerts: DocumentationCriticalAlert[]
  myActivity: DocumentationActivityRow[]
  getActivityCellValue: (row: DocumentationActivityRow, key: string) => string
  showInactivityWarning: boolean
  minutesSinceLastActivity: number | null
  loading?: boolean
}

export function CriticalAlertsActivitySection({
  criticalAlerts,
  myActivity,
  getActivityCellValue,
  showInactivityWarning,
  minutesSinceLastActivity,
  loading = false,
}: CriticalAlertsActivitySectionProps) {
  const activityColumns = useMemo(() => buildDocumentationActivityColumns(), [])

  return (
    <Grid container spacing={2}>
      <Grid size={{ xs: 12, lg: 6 }}>
        <DocumentationCriticalAlertsPanel alerts={criticalAlerts} />
      </Grid>
      <Grid size={{ xs: 12, lg: 6 }}>
        <Stack spacing={1.5}>
          {showInactivityWarning ? (
            <Alert severity="warning" title="Inactivity notice">
              {`No activity recorded in the last ${minutesSinceLastActivity ?? 60}+ minutes during business hours.`}
            </Alert>
          ) : null}
          <DashboardSectionTable
            title="My activity today"
            subtitle="Read-only audit trail of your documentation actions"
            columns={activityColumns}
            data={myActivity}
            rowKey="id"
            getCellValue={getActivityCellValue}
            loading={loading}
            pageSize={8}
            emptyTitle="No activity yet"
            emptyDescription="Your documentation actions today will appear here."
            tableSx={DOCUMENTATION_LISTING_TABLE_SX}
          />
        </Stack>
      </Grid>
    </Grid>
  )
}
