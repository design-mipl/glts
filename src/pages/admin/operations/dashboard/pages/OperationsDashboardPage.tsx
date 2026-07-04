import { Box, Stack } from '@mui/material'
import { BaseCard, Button, LoadingOverlay } from '@/design-system/UIComponents'
import {
  ExecutiveCompactHeader,
  NeedsImmediateAttentionSection,
} from '@/pages/admin/dashboard/components'
import { EXECUTIVE_DASHBOARD_SPACING } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { useToast } from '@/design-system/UIComponents'
import { DashboardFiltersBar } from '../components/DashboardFiltersBar'
import { ExecutiveKpiSection } from '../components/sections/ExecutiveKpiSection'
import { ExecutivePipelineSection } from '../components/sections/ExecutivePipelineSection'
import { TeamWorkloadSection } from '../components/sections/TeamWorkloadSection'
import { VerificationPassportSection } from '../components/sections/VerificationPassportSection'
import { PerformanceAnalyticsSection } from '../components/sections/PerformanceAnalyticsSection'
import { BusinessPerformanceSection } from '../components/sections/BusinessPerformanceSection'
import { OperationalMonitoringSection } from '../components/sections/OperationalMonitoringSection'
import { resolveExecutiveAlertIcon } from '../utils/executiveAlertIcons'
import { useAdminDashboard } from '../hooks/useAdminDashboard'

export function OperationsDashboardPage() {
  const dashboard = useAdminDashboard()
  const { showToast } = useToast()
  const isLoading = dashboard.status === 'loading'

  if (dashboard.status === 'error') {
    return (
      <Box>
        <ExecutiveCompactHeader
          eyebrow="Dashboard"
          title="Admin dashboard"
          subtitle="Executive command center for management visibility."
        />
        <BaseCard sx={{ p: 3, textAlign: 'center' }}>
          <Button label="Retry loading dashboard" onClick={dashboard.retry} />
        </BaseCard>
      </Box>
    )
  }

  return (
    <Box>
      <ExecutiveCompactHeader
        eyebrow="Dashboard"
        title="Admin dashboard"
        subtitle="Executive command center for management visibility across operations, documentation, and finance."
        filters={
          <DashboardFiltersBar filters={dashboard.filters} onChange={dashboard.setFilters} />
        }
      />

      <LoadingOverlay loading={isLoading} label="Loading dashboard...">
        <Stack
          spacing={EXECUTIVE_DASHBOARD_SPACING.section}
          sx={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 200ms ease', pb: 2 }}
        >
          <ExecutiveKpiSection metrics={dashboard.kpis} />
          <NeedsImmediateAttentionSection
            alerts={dashboard.criticalAlerts}
            resolveIcon={resolveExecutiveAlertIcon}
            onViewAlert={(alert) =>
              showToast({
                title: `Opening ${alert.title}`,
                description: `${alert.count} cases need review.`,
                variant: 'info',
              })
            }
          />
          <ExecutivePipelineSection stages={dashboard.pipelineStages} />
          <TeamWorkloadSection teamWorkload={dashboard.teamWorkload} />
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
