import { RoleDashboardShell } from '@/pages/admin/dashboard/components'
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

  return (
    <RoleDashboardShell
      title="Accounts dashboard"
      subtitle={`Financial operations workspace for ${dashboard.executiveName} — invoicing, collections, and reconciliation.`}
      filters={
        <AccountsDashboardFiltersBar
          filters={dashboard.filters}
          onChange={dashboard.setFilters}
        />
      }
      kpis={<FinancialKpiSection metrics={dashboard.kpis} />}
      loading={isLoading}
      error={dashboard.status === 'error'}
      onRetry={dashboard.retry}
      defaultTab="collections"
      tabs={[
        {
          id: 'collections',
          label: 'Collections',
          content: (
            <>
              <PendingCollectionsSection
                collections={dashboard.pendingCollections}
                getCellValue={dashboard.getPendingCollectionCellValue}
                loading={isLoading}
              />
              <CreditControlSection
                outstandingCollections={dashboard.outstandingCollections}
                invoiceSubmissions={dashboard.invoiceSubmissions}
                getOutstandingCollectionCellValue={dashboard.getOutstandingCollectionCellValue}
                loading={isLoading}
              />
            </>
          ),
        },
        {
          id: 'daily-ops',
          label: 'Daily ops',
          content: (
            <DailyFinancialOperationsSection
              invoicePostingQueue={dashboard.invoicePostingQueue}
              vendorPayments={dashboard.vendorPayments}
              reconciliationQueue={dashboard.reconciliationQueue}
              getInvoicePostingCellValue={dashboard.getInvoicePostingCellValue}
              getVendorPaymentCellValue={dashboard.getVendorPaymentCellValue}
              getReconciliationCellValue={dashboard.getReconciliationCellValue}
              loading={isLoading}
            />
          ),
        },
        {
          id: 'analytics',
          label: 'Analytics',
          content: (
            <FinancialAnalyticsSection
              revenueOverview={dashboard.revenueOverview}
              collectionPerformance={dashboard.collectionPerformance}
              ageingAnalysis={dashboard.ageingAnalysis}
            />
          ),
        },
        {
          id: 'reports',
          label: 'Reports',
          content: (
            <>
              <BusinessReportsSection
                topClients={dashboard.topClients}
                topCountries={dashboard.topCountries}
                revenueBySegment={dashboard.revenueBySegment}
                purchaseVsRevenue={dashboard.purchaseVsRevenue}
                getTopRevenueCellValue={dashboard.getTopRevenueCellValue}
                loading={isLoading}
              />
              <DailyReportsSection reports={dashboard.dailyReports} />
            </>
          ),
        },
        {
          id: 'alerts',
          label: 'Alerts',
          content: (
            <AlertsActivitySection
              financialAlerts={dashboard.financialAlerts}
              accountsActivity={dashboard.accountsActivity}
              getActivityCellValue={dashboard.getActivityCellValue}
              loading={isLoading}
            />
          ),
        },
      ]}
    />
  )
}
