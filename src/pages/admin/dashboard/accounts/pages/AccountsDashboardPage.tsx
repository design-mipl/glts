import { Box, Stack } from '@mui/material'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { BaseCard, Button, LoadingOverlay } from '@/design-system/UIComponents'
import { AccountsDashboardFiltersBar } from '../components/AccountsDashboardFiltersBar'
import { FinancialKpiSection } from '../components/sections/FinancialKpiSection'
import { PendingCollectionsSection } from '../components/sections/PendingCollectionsSection'
import { DailyFinancialOperationsSection } from '../components/sections/DailyFinancialOperationsSection'
import { CreditControlSection } from '../components/sections/CreditControlSection'
import { FinancialAnalyticsSection } from '../components/sections/FinancialAnalyticsSection'
import { BusinessReportsSection } from '../components/sections/BusinessReportsSection'
import { DailyReportsSection } from '../components/sections/DailyReportsSection'
import { AlertsActivitySection } from '../components/sections/AlertsActivitySection'
import { useAccountsDashboard } from '../hooks/useAccountsDashboard'

export function AccountsDashboardPage() {
  const dashboard = useAccountsDashboard()
  const isLoading = dashboard.status === 'loading'

  if (dashboard.status === 'error') {
    return (
      <Box>
        <AdminPageHeader
          eyebrow="Dashboard"
          title="Accounts dashboard"
          description="Financial operations workspace for invoicing, collections, and reporting."
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
        title="Accounts dashboard"
        description={`Financial operations workspace for ${dashboard.executiveName} — invoicing, collections, and reconciliation.`}
        actions={
          <AccountsDashboardFiltersBar
            filters={dashboard.filters}
            onChange={dashboard.setFilters}
          />
        }
      />

      <LoadingOverlay loading={isLoading} label="Loading dashboard...">
        <Stack spacing={2} sx={{ opacity: isLoading ? 0.6 : 1, transition: 'opacity 200ms ease' }}>
          <FinancialKpiSection metrics={dashboard.kpis} />
          <PendingCollectionsSection
            collections={dashboard.pendingCollections}
            getCellValue={dashboard.getPendingCollectionCellValue}
            loading={isLoading}
          />
          <DailyFinancialOperationsSection
            invoicePostingQueue={dashboard.invoicePostingQueue}
            vendorPayments={dashboard.vendorPayments}
            reconciliationQueue={dashboard.reconciliationQueue}
            getInvoicePostingCellValue={dashboard.getInvoicePostingCellValue}
            getVendorPaymentCellValue={dashboard.getVendorPaymentCellValue}
            getReconciliationCellValue={dashboard.getReconciliationCellValue}
            loading={isLoading}
          />
          <CreditControlSection
            outstandingCollections={dashboard.outstandingCollections}
            invoiceSubmissions={dashboard.invoiceSubmissions}
            getOutstandingCollectionCellValue={dashboard.getOutstandingCollectionCellValue}
            loading={isLoading}
          />
          <FinancialAnalyticsSection
            revenueOverview={dashboard.revenueOverview}
            collectionPerformance={dashboard.collectionPerformance}
            ageingAnalysis={dashboard.ageingAnalysis}
          />
          <BusinessReportsSection
            topClients={dashboard.topClients}
            topCountries={dashboard.topCountries}
            revenueBySegment={dashboard.revenueBySegment}
            purchaseVsRevenue={dashboard.purchaseVsRevenue}
            getTopRevenueCellValue={dashboard.getTopRevenueCellValue}
            loading={isLoading}
          />
          <DailyReportsSection reports={dashboard.dailyReports} />
          <AlertsActivitySection
            financialAlerts={dashboard.financialAlerts}
            accountsActivity={dashboard.accountsActivity}
            getActivityCellValue={dashboard.getActivityCellValue}
            loading={isLoading}
          />
        </Stack>
      </LoadingOverlay>
    </Box>
  )
}
