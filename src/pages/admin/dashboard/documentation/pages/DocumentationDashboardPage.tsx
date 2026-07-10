import { Box, Stack } from '@mui/material'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { BaseCard, Button, LoadingOverlay } from '@/design-system/UIComponents'
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

  if (dashboard.status === 'error') {
    return (
      <Box>
        <AdminPageHeader
          eyebrow="Dashboard"
          title="Documentation dashboard"
          description="Document processing and quality control workspace."
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
        title="Documentation dashboard"
        description={`Document processing queue for ${dashboard.executiveName} — applications assigned to you.`}
        actions={
          <DocumentationDashboardFiltersBar
            filters={dashboard.filters}
            onChange={dashboard.setFilters}
          />
        }
      />

      <LoadingOverlay loading={isLoading} label="Loading dashboard...">
        <Stack spacing={2} sx={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 200ms ease' }}>
          <TodayKpiSection metrics={dashboard.kpis} />
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
          <QcCorrectionSection
            reviewQcQueue={dashboard.reviewQcQueue}
            correctionRequests={dashboard.correctionRequests}
            getReviewQcCellValue={dashboard.getReviewQcCellValue}
            getCorrectionCellValue={dashboard.getCorrectionCellValue}
            loading={isLoading}
          />
          <SubmissionManagementSection
            readyForSubmission={dashboard.readyForSubmission}
            submissionPending={dashboard.submissionPending}
            getReadySubmissionCellValue={dashboard.getReadySubmissionCellValue}
            getSubmissionPendingCellValue={dashboard.getSubmissionPendingCellValue}
            loading={isLoading}
          />
          <CriticalAlertsActivitySection
            criticalAlerts={dashboard.criticalAlerts}
            myActivity={dashboard.myActivity}
            getActivityCellValue={dashboard.getActivityCellValue}
            showInactivityWarning={dashboard.showInactivityWarning}
            minutesSinceLastActivity={dashboard.minutesSinceLastActivity}
            loading={isLoading}
          />
          <MyPerformanceSection metrics={dashboard.myPerformance} />
        </Stack>
      </LoadingOverlay>
    </Box>
  )
}
