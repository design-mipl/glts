import type { ReactNode } from 'react'
import { Grid, Typography } from '@mui/material'
import {
  Building2,
  ClipboardList,
  HandCoins,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import {
  AgeingAnalysis,
  CollectionSummary,
  MetricComparison,
  NotificationPanel,
  ProcessingTrend,
  QuickActions,
  RevenueSnapshot,
  DASHBOARD_SPACING,
} from '../../shared'
import { PredictivePanel } from '../../shared/dashboard-intelligence'
import {
  ComparisonLayout,
  ExecutiveGrid,
  HighlightCard,
  RankingList,
} from '../../shared/dashboard-ui-kit'
import type { SuperAdminDashboardTabProps, SuperAdminRankItem } from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-admin-next': <LayoutDashboard size={18} />,
  'qa-ops-next': <ClipboardList size={18} />,
  'qa-accounts-next': <HandCoins size={18} />,
  'qa-clients': <Users size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-legacy-admin': <Building2 size={18} />,
}

function toRankingItems(items: SuperAdminRankItem[]) {
  return items.map((item, index) => ({
    id: item.id,
    primary: item.primary,
    secondary: item.secondary,
    rank: index + 1,
    value: item.value,
    progress: item.progress,
  }))
}

export function FinanceTab({
  data,
  loading,
  onRetry,
  onNavigate,
  forecasts = [],
}: SuperAdminDashboardTabProps) {
  const cash = data.cashPosition

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
          <HighlightCard
            title="Bank balance"
            highlight={cash.bankBalance}
            highlightLabel="On hand"
            loading={loading}
          >
            <Typography variant="caption" color="text.secondary">
              Mock cash position
            </Typography>
          </HighlightCard>
          <HighlightCard
            title="Blocked in visa fees"
            highlight={cash.blockedInVisaFees}
            highlightLabel="Embassy / VFS"
            loading={loading}
          >
            <Typography variant="caption" color="text.secondary">
              Pending pass-through
            </Typography>
          </HighlightCard>
          <HighlightCard
            title="Expected collections"
            highlight={cash.expectedCollections}
            highlightLabel="Near-term AR"
            loading={loading}
          >
            <Typography variant="caption" color="text.secondary">
              Due window
            </Typography>
          </HighlightCard>
          <HighlightCard
            title="Available funds"
            highlight={cash.availableFunds}
            highlightLabel="Net cash position"
            loading={loading}
          >
            <Typography variant="caption" color="text.secondary">
              Bank − blocked − expected buffer
            </Typography>
          </HighlightCard>
        </ExecutiveGrid>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RevenueSnapshot data={data.revenueSnapshot} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <CollectionSummary
          data={data.collectionSummary}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <AgeingAnalysis buckets={data.ageingBuckets} loading={loading} onRetry={onRetry} />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <RankingList
          title="Gross margin by vertical"
          items={toRankingItems(data.marginByVertical)}
          loading={loading}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <MetricComparison
          title="Finance KPIs"
          metrics={data.financeMetricComparison}
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 7 }}>
        <ProcessingTrend
          title="Revenue vs collections"
          points={data.processingTrend}
          secondaryLabel="Collected"
          loading={loading}
          onRetry={onRetry}
        />
      </Grid>

      {forecasts.length > 0 ? (
        <Grid size={{ xs: 12 }}>
          <PredictivePanel
            title="Revenue forecast"
            subtitle="30 / 60 / 90 day scenarios (heuristic)"
            models={forecasts}
            loading={loading}
          />
        </Grid>
      ) : null}

      <Grid size={{ xs: 12 }}>
        <ComparisonLayout
          left={
            <RankingList
              title="High margin clients"
              items={toRankingItems(data.highMarginClients)}
              loading={loading}
            />
          }
          right={
            <RankingList
              title="Low margin / credit pressure"
              items={toRankingItems(data.lowMarginClients)}
              loading={loading}
            />
          }
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <NotificationPanel
          title="Finance notices"
          items={data.financeNotifications}
          loading={loading}
          onRetry={onRetry}
          maxItems={5}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions
            .filter((action) =>
              ['qa-accounts-next', 'qa-finance', 'qa-admin-next'].includes(action.id),
            )
            .map((action) => ({
              id: action.id,
              title: action.title,
              description: action.description,
              badge: action.badge,
              icon: ACTION_ICONS[action.id],
              onClick: () => onNavigate(action.href),
            }))}
        />
      </Grid>
    </Grid>
  )
}
