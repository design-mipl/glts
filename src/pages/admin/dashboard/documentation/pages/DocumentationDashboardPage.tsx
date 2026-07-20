import { RoleDashboardShell } from '@/pages/admin/dashboard/components'
import { DocumentationDashboardFiltersBar } from '../components/DocumentationDashboardFiltersBar'
import { TodayKpiSection } from '../components/sections/TodayKpiSection'
import { MyApplicationsSection } from '../components/sections/MyApplicationsSection'
import { ProcessingTasksSection } from '../components/sections/ProcessingTasksSection'
import { QcCorrectionSection } from '../components/sections/QcCorrectionSection'
import { SubmissionManagementSection } from '../components/sections/SubmissionManagementSection'
import { CriticalAlertsActivitySection } from '../components/sections/CriticalAlertsActivitySection'
import { MyPerformanceSection } from '../components/sections/MyPerformanceSection'
import { useDocumentationDashboard } from '../hooks/useDocumentationDashboard'

export function DocumentationDashboardPage() {
  const dashboard = useDocumentationDashboard()
  const isLoading = dashboard.status === 'loading'

  return (
    <RoleDashboardShell
      title="Documentation dashboard"
      subtitle={`Document processing queue for ${dashboard.executiveName} — applications assigned to you.`}
      filters={
        <DocumentationDashboardFiltersBar
          filters={dashboard.filters}
          onChange={dashboard.setFilters}
        />
      }
      kpis={<TodayKpiSection metrics={dashboard.kpis} />}
      loading={isLoading}
      error={dashboard.status === 'error'}
      onRetry={dashboard.retry}
      defaultTab="processing"
      tabs={[
        {
          id: 'processing',
          label: 'Processing',
          content: (
            <>
              <MyApplicationsSection
                applications={dashboard.myApplications}
                getCellValue={dashboard.getApplicationCellValue}
                loading={isLoading}
              />
              <ProcessingTasksSection
                formsToFill={dashboard.formsToFill}
                feesToPay={dashboard.feesToPay}
                appointmentsToBook={dashboard.appointmentsToBook}
                getFormCellValue={dashboard.getFormCellValue}
                getFeeCellValue={dashboard.getFeeCellValue}
                getAppointmentCellValue={dashboard.getAppointmentCellValue}
                loading={isLoading}
              />
            </>
          ),
        },
        {
          id: 'qc',
          label: 'QC',
          content: (
            <QcCorrectionSection
              reviewQcQueue={dashboard.reviewQcQueue}
              correctionRequests={dashboard.correctionRequests}
              getReviewQcCellValue={dashboard.getReviewQcCellValue}
              getCorrectionCellValue={dashboard.getCorrectionCellValue}
              loading={isLoading}
            />
          ),
        },
        {
          id: 'submission',
          label: 'Submission',
          content: (
            <SubmissionManagementSection
              readyForSubmission={dashboard.readyForSubmission}
              submissionPending={dashboard.submissionPending}
              getReadySubmissionCellValue={dashboard.getReadySubmissionCellValue}
              getSubmissionPendingCellValue={dashboard.getSubmissionPendingCellValue}
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
                getActivityCellValue={dashboard.getActivityCellValue}
                showInactivityWarning={dashboard.showInactivityWarning}
                minutesSinceLastActivity={dashboard.minutesSinceLastActivity}
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
