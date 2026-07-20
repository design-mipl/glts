import { RoleDashboardShell } from '@/pages/admin/dashboard/components'
import { OperationsDashboardFiltersBar } from '../components/OperationsDashboardFiltersBar'
import { TodayKpiSection } from '../components/sections/TodayKpiSection'
import { MyApplicationsSection } from '../components/sections/MyApplicationsSection'
import { TodaysWorkSection } from '../components/sections/TodaysWorkSection'
import { OperationalQueuesSection } from '../components/sections/OperationalQueuesSection'
import { MarinePrioritySection } from '../components/sections/MarinePrioritySection'
import { CriticalAlertsActivitySection } from '../components/sections/CriticalAlertsActivitySection'
import { MyPerformanceSection } from '../components/sections/MyPerformanceSection'
import { useOperationsConsultantDashboard } from '../hooks/useOperationsConsultantDashboard'

export function OperationsConsultantDashboardPage() {
  const dashboard = useOperationsConsultantDashboard()
  const isLoading = dashboard.status === 'loading'
  const marineCaseCount = dashboard.marinePriorityCases.length

  return (
    <RoleDashboardShell
      title="Operations dashboard"
      subtitle={`Work queue for ${dashboard.consultantName} — applications assigned to you.`}
      filters={
        <OperationsDashboardFiltersBar
          filters={dashboard.filters}
          onChange={dashboard.setFilters}
        />
      }
      kpis={<TodayKpiSection metrics={dashboard.kpis} />}
      loading={isLoading}
      error={dashboard.status === 'error'}
      onRetry={dashboard.retry}
      defaultTab="work"
      tabs={[
        {
          id: 'work',
          label: 'My work',
          content: (
            <>
              <MyApplicationsSection
                applications={dashboard.myApplications}
                getCellValue={dashboard.getMyApplicationCellValue}
                loading={isLoading}
              />
              <TodaysWorkSection
                todayTasks={dashboard.todayTasks}
                correctionRequests={dashboard.correctionRequests}
                awaitingDocuments={dashboard.awaitingDocuments}
                getCorrectionCellValue={dashboard.getCorrectionCellValue}
                getAwaitingDocumentCellValue={dashboard.getAwaitingDocumentCellValue}
                loading={isLoading}
              />
            </>
          ),
        },
        {
          id: 'queues',
          label: 'Queues',
          content: (
            <OperationalQueuesSection
              reviewQcQueue={dashboard.reviewQcQueue}
              appointmentSubmissionQueue={dashboard.appointmentSubmissionQueue}
              getReviewQcCellValue={dashboard.getReviewQcCellValue}
              getAppointmentSubmissionCellValue={dashboard.getAppointmentSubmissionCellValue}
              loading={isLoading}
            />
          ),
        },
        {
          id: 'marine',
          label: 'Marine',
          hidden: marineCaseCount === 0 && !isLoading,
          content: (
            <MarinePrioritySection
              marinePriorityCases={dashboard.marinePriorityCases}
              getCellValue={dashboard.getMarinePriorityCellValue}
              loading={isLoading}
            />
          ),
        },
        {
          id: 'activity',
          label: 'Activity',
          content: (
            <>
              <CriticalAlertsActivitySection
                criticalAlerts={dashboard.criticalAlerts}
                myActivity={dashboard.myActivity}
                getMyActivityCellValue={dashboard.getMyActivityCellValue}
                loading={isLoading}
              />
              <MyPerformanceSection metrics={dashboard.myPerformance} />
            </>
          ),
        },
      ]}
    />
  )
}
