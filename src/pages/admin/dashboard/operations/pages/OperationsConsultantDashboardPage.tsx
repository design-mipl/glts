import { Box, Stack } from '@mui/material'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { BaseCard, Button, LoadingOverlay } from '@/design-system/UIComponents'
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

  if (dashboard.status === 'error') {
    return (
      <Box>
        <AdminPageHeader
          eyebrow="Dashboard"
          title="Operations dashboard"
          description="Work management dashboard for operations consultants."
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
        title="Operations dashboard"
        description={`Work queue for ${dashboard.consultantName} — applications assigned to you.`}
        actions={
          <OperationsDashboardFiltersBar
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
          <OperationalQueuesSection
            reviewQcQueue={dashboard.reviewQcQueue}
            appointmentSubmissionQueue={dashboard.appointmentSubmissionQueue}
            getReviewQcCellValue={dashboard.getReviewQcCellValue}
            getAppointmentSubmissionCellValue={dashboard.getAppointmentSubmissionCellValue}
            loading={isLoading}
          />
          <MarinePrioritySection
            marinePriorityCases={dashboard.marinePriorityCases}
            getCellValue={dashboard.getMarinePriorityCellValue}
            loading={isLoading}
          />
          <CriticalAlertsActivitySection
            criticalAlerts={dashboard.criticalAlerts}
            myActivity={dashboard.myActivity}
            getMyActivityCellValue={dashboard.getMyActivityCellValue}
            loading={isLoading}
          />
          <MyPerformanceSection metrics={dashboard.myPerformance} />
        </Stack>
      </LoadingOverlay>
    </Box>
  )
}
