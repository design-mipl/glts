import type { ReactNode } from 'react'
import { useMemo } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import {
  Building2,
  ClipboardList,
  HandCoins,
  LayoutDashboard,
  Users,
} from 'lucide-react'
import { BarChart, DonutChart } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  QuickActions,
  RecentActivity,
  DASHBOARD_SPACING,
} from '../../shared'
import { ComparisonLayout, RankingList } from '../../shared/dashboard-ui-kit'
import { SuperAdminWorkListing } from '../components/SuperAdminWorkListing'
import { SUPER_ADMIN_CHART_COLORS, SUPER_ADMIN_CHART_SERIES } from '../data/superAdminChartColors'
import type {
  SuperAdminDashboardTabProps,
  SuperAdminRankItem,
  SuperAdminWorkRow,
} from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-admin-next': <LayoutDashboard size={18} />,
  'qa-ops-next': <ClipboardList size={18} />,
  'qa-accounts-next': <HandCoins size={18} />,
  'qa-clients': <Users size={18} />,
  'qa-finance': <HandCoins size={18} />,
  'qa-legacy-admin': <Building2 size={18} />,
}

function ChartPanel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Stack spacing={0.5} sx={{ px: 2, pt: 2, pb: 1.25 }}>
        <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            {description}
          </Typography>
        ) : null}
      </Stack>
      <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
    </Box>
  )
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

export function ClientsTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenClient,
}: SuperAdminDashboardTabProps) {
  const accountRows: SuperAdminWorkRow[] = useMemo(
    () =>
      data.clientRows.map((row) => ({
        id: row.id,
        primary: row.client,
        secondary: `${row.segment} · ${row.applications} apps · Rev ${row.revenue}`,
        category: row.segment,
        status: row.status,
        value: row.outstanding,
        priority: row.status.toLowerCase().includes('risk') ? 'High' : 'Medium',
      })),
    [data.clientRows],
  )

  const segmentSlices = useMemo(() => {
    const counts = new Map<string, number>()
    for (const row of data.clientRows) {
      counts.set(row.segment, (counts.get(row.segment) ?? 0) + 1)
    }
    return Array.from(counts.entries()).map(([label, value], index) => ({
      key: label.toLowerCase(),
      label,
      value,
      color: SUPER_ADMIN_CHART_SERIES[index % SUPER_ADMIN_CHART_SERIES.length],
    }))
  }, [data.clientRows])

  const healthBars = useMemo(
    () =>
      data.clientHealth.map((item) => ({
        client: item.primary.length > 14 ? `${item.primary.slice(0, 12)}…` : item.primary,
        score: item.progress ?? 0,
      })),
    [data.clientHealth],
  )

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel title="Accounts by segment" description="Key account mix">
          <DonutChart
            data={
              segmentSlices.length > 0
                ? segmentSlices
                : [{ key: 'none', label: 'None', value: 1, color: SUPER_ADMIN_CHART_COLORS.slate }]
            }
            height={220}
            loading={loading}
            centerLabel="accts"
            centerValue={String(data.clientRows.length)}
          />
        </ChartPanel>
      </Grid>
      <Grid size={{ xs: 12, md: 6, lg: 8 }}>
        <ChartPanel title="Client health scores" description="Portfolio health ranking">
          <BarChart
            data={healthBars}
            xKey="client"
            height={220}
            barSize={16}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'score', label: 'Score', color: SUPER_ADMIN_CHART_COLORS.green }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <RankingList
          title="Client health"
          items={toRankingItems(data.clientHealth)}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <RankingList
          title="High-risk clients"
          items={toRankingItems(data.highRiskClients)}
          loading={loading}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 4 }}>
        <RankingList
          title="High margin clients"
          items={toRankingItems(data.highMarginClients)}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <RankingList
          title="Low margin clients"
          items={toRankingItems(data.lowMarginClients)}
          loading={loading}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <RankingList
          title="Dormant clients"
          items={toRankingItems(data.dormantClients)}
          loading={loading}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <ComparisonLayout
          left={
            <RankingList
              title="Top 20 by revenue"
              items={toRankingItems(data.topRevenueClients)}
              loading={loading}
            />
          }
          right={
            <RankingList
              title="Top growth opportunities"
              items={toRankingItems(data.fastestGrowingClients)}
              loading={loading}
            />
          }
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <SuperAdminWorkListing
          title="Key accounts"
          description="Outstanding · collections · status — open to manage"
          rows={accountRows}
          loading={loading}
          openLabel="Open"
          onOpen={(row) => onOpenClient?.(row.id)}
          onViewAll={() => onNavigate('/admin/customer-accounts/corporate-accounts')}
          viewAllLabel="Open clients"
          emptyTitle="No key accounts"
          emptyDescription="Accounts will appear here when loaded."
        />
      </Grid>

      <Grid size={{ xs: 12, md: 7 }}>
        <RecentActivity
          title="Client activity"
          items={data.clientActivity}
          loading={loading}
          onRetry={onRetry}
          maxItems={6}
        />
      </Grid>
      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions
            .filter((action) =>
              ['qa-clients', 'qa-accounts-next', 'qa-admin-next'].includes(action.id),
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
