import { Box, Stack } from '@mui/material'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { BaseCard, Button, LoadingOverlay } from '@/design-system/UIComponents'
import { DashboardFiltersBar } from '../components/DashboardFiltersBar'
import { ExecutiveKpiSection } from '../components/sections/ExecutiveKpiSection'
import { ExecutivePipelineSection } from '../components/sections/ExecutivePipelineSection'
import { TeamWorkloadAlertsSection } from '../components/sections/TeamWorkloadAlertsSection'
import { VerificationPassportSection } from '../components/sections/VerificationPassportSection'
import { PerformanceAnalyticsSection } from '../components/sections/PerformanceAnalyticsSection'
import { BusinessPerformanceSection } from '../components/sections/BusinessPerformanceSection'
import { OperationalMonitoringSection } from '../components/sections/OperationalMonitoringSection'
import { useAdminDashboard } from '../hooks/useAdminDashboard'

export function OperationsDashboardPage() {
  const dashboard = useAdminDashboard()
  const isLoading = dashboard.status === 'loading'

  if (dashboard.status === 'error') {
    return (
      <Box>
        <AdminPageHeader
          eyebrow="Dashboard"
          title="Admin dashboard"
          description="Executive command center for management visibility."
        />
        <BaseCard sx={{ p: 3, textAlign: 'center' }}>
          <Button label="Retry loading dashboard" onClick={dashboard.retry} />
        </BaseCard>
      </Box>
    )
  }

  return (
    <Box>
      <AdminPageHeader
        eyebrow="Dashboard"
        title="Admin dashboard"
        description="Executive command center for management visibility."
        actions={
          <DashboardFiltersBar filters={dashboard.filters} onChange={dashboard.setFilters} />
        }
      />

      <LoadingOverlay loading={isLoading} label="Loading dashboard...">
        <Stack spacing={2} sx={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 200ms ease' }}>
          <ExecutiveKpiSection metrics={dashboard.kpis} />
          <ExecutivePipelineSection stages={dashboard.pipelineStages} />
          <TeamWorkloadAlertsSection
            teamWorkload={dashboard.teamWorkload}
            criticalAlerts={dashboard.criticalAlerts}
            getCellValue={dashboard.getTeamWorkloadCellValue}
            loading={isLoading}
          />
          <VerificationPassportSection
            verificationQueue={dashboard.verificationQueue}
            passportSummary={dashboard.passportSummary}
            passportTransit={dashboard.passportTransit}
            getVerificationCellValue={dashboard.getVerificationQueueCellValue}
            getPassportTransitCellValue={dashboard.getPassportTransitCellValue}
            loading={isLoading}
          />
          <PerformanceAnalyticsSection
            slaCompliance={dashboard.slaCompliance}
            teamProductivity={dashboard.teamProductivity}
            weeklyCompletion={dashboard.weeklyCompletion}
          />
          <BusinessPerformanceSection
            revenueSnapshot={dashboard.revenueSnapshot}
            countryDistribution={dashboard.countryDistribution}
            visaTypeDistribution={dashboard.visaTypeDistribution}
            segmentDistribution={dashboard.segmentDistribution}
          />
          <OperationalMonitoringSection
            escalations={dashboard.escalations}
            noMovementCases={dashboard.noMovementCases}
            getEscalationCellValue={dashboard.getEscalationCellValue}
            getNoMovementCellValue={dashboard.getNoMovementCellValue}
            loading={isLoading}
          />
        </Stack>
      </LoadingOverlay>
    </Box>
  )
}
