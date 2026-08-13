import type { ReactNode } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { HandCoins } from 'lucide-react'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { DASHBOARD_SPACING } from '../../constants'
import type {
  DashboardClientIntelligenceData,
  DashboardCommercialHeroData,
  DashboardSegmentComparisonRow,
  DashboardSegmentTrendPoint,
  ManagementFinanceDashboardData,
} from '../../types'
import { FinanceCommercialHeroStrip } from './FinanceCommercialHeroStrip'
import { FinanceClientIntelligenceSections } from './FinanceClientIntelligenceSections'
import { FinanceSegmentAnalyticsSections } from './FinanceSegmentAnalyticsSections'
import { ManagementFinanceDashboard } from './ManagementFinanceDashboard'

function FinancePulseBanner({
  description,
  tone,
  action,
}: {
  description: string
  tone: 'info' | 'warning' | 'error' | 'success'
  action?: ReactNode
}) {
  const colors = usePublicBrandColors()
  const bgcolor =
    tone === 'error'
      ? 'error.main'
      : tone === 'warning'
        ? 'warning.main'
        : tone === 'success'
          ? 'success.main'
          : 'info.main'

  return (
    <Box
      sx={{
        ...executiveCardLevel2Sx(colors),
        px: 2,
        py: 1.5,
        display: 'flex',
        alignItems: { xs: 'stretch', sm: 'center' },
        justifyContent: 'space-between',
        gap: 1.5,
        flexDirection: { xs: 'column', sm: 'row' },
      }}
    >
      <Stack direction="row" spacing={1.25} alignItems="center" minWidth={0}>
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: '8px',
            display: 'grid',
            placeItems: 'center',
            bgcolor,
            color: 'common.white',
            flexShrink: 0,
            opacity: 0.92,
          }}
        >
          <HandCoins size={16} />
        </Box>
        <Box minWidth={0}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
            Finance pulse
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {description}
          </Typography>
        </Box>
      </Stack>
      {action}
    </Box>
  )
}

function buildFinancePulseParts(data: ManagementFinanceDashboardData): string[] {
  const blocked = data.workspace.blockedCash
  const overdueCount = data.kpiStrip.overdueInvoiceCount
  const creditExposure = data.riskCallouts.creditExposure

  return [
    blocked.applicationCount > 0 ? `${blocked.amount} blocked · ${blocked.applicationCount} apps` : null,
    overdueCount > 0 ? `${overdueCount} overdue invoices` : null,
    creditExposure ? `Credit exposure ${creditExposure}` : null,
  ].filter(Boolean) as string[]
}

export interface FinanceSegmentAnalyticsProps {
  comparisonRows: DashboardSegmentComparisonRow[]
  revenueTrend: DashboardSegmentTrendPoint[]
  applicationTrend: DashboardSegmentTrendPoint[]
  onChartClick?: () => void
}

export interface FinanceWorkspaceViewProps {
  data: ManagementFinanceDashboardData
  loading?: boolean
  onNavigateAccounts?: () => void
  onNavigateInvoices?: () => void
  onNavigateCredit?: () => void
  onNavigateSlaCash?: () => void
  pulseAction?: ReactNode
  segmentAnalytics?: FinanceSegmentAnalyticsProps
  clientIntelligence?: DashboardClientIntelligenceData
  commercialHero?: DashboardCommercialHeroData
  onGrossRevenueClick?: () => void
  onNetRevenueClick?: () => void
  onCollectionsClick?: () => void
  onOutstandingClick?: () => void
}

/** Shared management finance workspace — pulse banner + KPI strip + workspace rows. */
export function FinanceWorkspaceView({
  data,
  loading,
  onNavigateAccounts,
  onNavigateInvoices,
  onNavigateCredit,
  onNavigateSlaCash,
  pulseAction,
  segmentAnalytics,
  clientIntelligence,
  commercialHero,
  onGrossRevenueClick,
  onNetRevenueClick,
  onCollectionsClick,
  onOutstandingClick,
}: FinanceWorkspaceViewProps) {
  const pulseParts = buildFinancePulseParts(data)
  const overdueCount = data.kpiStrip.overdueInvoiceCount

  return (
    <Stack spacing={DASHBOARD_SPACING.dense}>
      {pulseParts.length > 0 ? (
        <FinancePulseBanner
          description={pulseParts.join(' · ')}
          tone={overdueCount > 0 ? 'error' : 'warning'}
          action={pulseAction}
        />
      ) : null}

      {commercialHero ? (
        <FinanceCommercialHeroStrip
          data={commercialHero}
          loading={loading}
          onGrossRevenueClick={onGrossRevenueClick}
          onNetRevenueClick={onNetRevenueClick}
          onCollectionsClick={onCollectionsClick}
          onOutstandingClick={onOutstandingClick}
        />
      ) : null}

      <ManagementFinanceDashboard
        data={data}
        loading={loading}
        onNavigateAccounts={onNavigateAccounts}
        onNavigateInvoices={onNavigateInvoices}
        onNavigateCredit={onNavigateCredit}
        onNavigateSlaCash={onNavigateSlaCash}
        analyticsSlot={
          segmentAnalytics || clientIntelligence ? (
            <Stack spacing={DASHBOARD_SPACING.section} divider={<Divider flexItem />}>
              {segmentAnalytics ? (
                <FinanceSegmentAnalyticsSections
                  comparisonRows={segmentAnalytics.comparisonRows}
                  revenueTrend={segmentAnalytics.revenueTrend}
                  applicationTrend={segmentAnalytics.applicationTrend}
                  loading={loading}
                  onChartClick={segmentAnalytics.onChartClick}
                />
              ) : null}
              {clientIntelligence ? (
                <FinanceClientIntelligenceSections data={clientIntelligence} loading={loading} />
              ) : null}
            </Stack>
          ) : undefined
        }
      />
    </Stack>
  )
}
