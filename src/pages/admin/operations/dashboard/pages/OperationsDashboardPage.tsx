import {
  NeedsImmediateAttentionSection,
  RoleDashboardShell,
} from '@/pages/admin/dashboard/components'
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

  const riskBadge = dashboard.escalations.length + dashboard.noMovementCases.length

  return (
    <RoleDashboardShell
      title="Admin dashboard"
      subtitle="Executive command center for management visibility across operations, documentation, and finance."
      filters={
        <DashboardFiltersBar filters={dashboard.filters} onChange={dashboard.setFilters} />
      }
      kpis={<ExecutiveKpiSection metrics={dashboard.kpis} />}
      alerts={
        dashboard.criticalAlerts.length > 0 || isLoading ? (
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
        ) : null
      }
      loading={isLoading}
      error={dashboard.status === 'error'}
      onRetry={dashboard.retry}
      defaultTab="overview"
      tabs={[
        {
          id: 'overview',
          label: 'Overview',
          content: (
            <>
              <ExecutivePipelineSection stages={dashboard.pipelineStages} />
              <TeamWorkloadSection teamWorkload={dashboard.teamWorkload} />
            </>
          ),
        },
        {
          id: 'verification',
          label: 'Verification',
          content: (
            <VerificationPassportSection
              verificationQueue={dashboard.verificationQueue}
              passportSummary={dashboard.passportSummary}
              passportTransit={dashboard.passportTransit}
              getVerificationCellValue={dashboard.getVerificationQueueCellValue}
              getPassportTransitCellValue={dashboard.getPassportTransitCellValue}
              loading={isLoading}
            />
          ),
        },
        {
          id: 'performance',
          label: 'Performance',
          content: (
            <PerformanceAnalyticsSection
              slaCompliance={dashboard.slaCompliance}
              teamProductivity={dashboard.teamProductivity}
              weeklyCompletion={dashboard.weeklyCompletion}
            />
          ),
        },
        {
          id: 'business',
          label: 'Business',
          content: (
            <BusinessPerformanceSection
              revenueSnapshot={dashboard.revenueSnapshot}
              countryDistribution={dashboard.countryDistribution}
              visaTypeDistribution={dashboard.visaTypeDistribution}
              segmentDistribution={dashboard.segmentDistribution}
            />
          ),
        },
        {
          id: 'risk',
          label: 'Risk',
          badge: riskBadge,
          content: (
            <OperationalMonitoringSection
              escalations={dashboard.escalations}
              noMovementCases={dashboard.noMovementCases}
              getEscalationCellValue={dashboard.getEscalationCellValue}
              getNoMovementCellValue={dashboard.getNoMovementCellValue}
              loading={isLoading}
            />
          ),
        },
      ]}
    />
  )
}
