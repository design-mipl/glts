import type { ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Anchor, Briefcase, Ship, Store } from 'lucide-react'
import {
  BranchPerformance,
  BusinessSegmentBreakdown,
  CountryDistribution,
  ProcessingTrend,
  RevenueSnapshot,
  VisaDistribution,
  DASHBOARD_SPACING,
} from '../../shared'
import {
  ComparisonLayout,
  ExecutiveGrid,
  RankingList,
  SegmentCard,
} from '../../shared/dashboard-ui-kit'
import type { SuperAdminDashboardTabProps, SuperAdminRankItem, SuperAdminSegmentCard } from '../types'

const SEGMENT_ICONS = {
  marine: <Ship size={20} />,
  corporate: <Briefcase size={20} />,
  retail: <Store size={20} />,
  b2b: <Anchor size={20} />,
} as const

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

function SegmentMetrics({ segment }: { segment: SuperAdminSegmentCard }) {
  const rows: Array<[string, string]> = [
    ['Cost', segment.cost],
    ['Gross margin', segment.grossMarginPercent],
    ['Approval', segment.approvalPercent],
    ['Avg TAT', segment.avgTat],
    ['Outstanding', segment.outstanding],
    ['Clients', segment.activeClients],
    ['Pipeline', segment.pipelineValue],
  ]
  if (segment.repeatBusinessPercent) {
    rows.push(['Repeat', segment.repeatBusinessPercent])
  }
  if (segment.winRate) {
    rows.push(['Win rate', segment.winRate])
  }

  return (
    <Stack spacing={1.25}>
      <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.4 }}>
        {segment.revenue}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {segment.applications} · {segment.growthLabel}
      </Typography>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0.75,
        }}
      >
        {rows.map(([label, value]) => (
          <Box key={label}>
            <Typography
              color="text.secondary"
              sx={{ fontSize: 10, fontWeight: 600, letterSpacing: 0.2 }}
            >
              {label}
            </Typography>
            <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
              {value}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography variant="caption" color="text.secondary">
        {segment.insight}
      </Typography>
    </Stack>
  )
}

/** Business story — revenue, rich segment cards, and growth drivers. */
export function BusinessTab({ data, loading, onRetry }: SuperAdminDashboardTabProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <ProcessingTrend
        title="Monthly revenue trend"
        subtitle="₹ Cr · last 12 months · vs collections"
        points={data.revenueTrend}
        secondaryLabel="Collected"
        loading={loading}
        onRetry={onRetry}
      />

      <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
        {data.segmentCards.map((segment) => (
          <SegmentCard
            key={segment.id}
            icon={SEGMENT_ICONS[segment.id] as ReactNode}
            title={segment.label}
            subtitle={segment.status === 'live' ? 'Live' : 'Preview · sample data'}
            hoverable={segment.status === 'live'}
          >
            <SegmentMetrics segment={segment} />
          </SegmentCard>
        ))}
      </ExecutiveGrid>

      <BusinessSegmentBreakdown
        title="Revenue by segment"
        subtitle="Share of network volume"
        slices={data.businessSegments}
        loading={loading}
        onRetry={onRetry}
      />

      <ComparisonLayout
        left={
          <RevenueSnapshot data={data.revenueSnapshot} loading={loading} onRetry={onRetry} />
        }
        right={
          <CountryDistribution
            title="Revenue by country"
            slices={data.countryDistribution}
            loading={loading}
            onRetry={onRetry}
          />
        }
      />
      <ComparisonLayout
        left={
          <VisaDistribution
            title="Revenue by visa type"
            slices={data.visaDistribution}
            loading={loading}
            onRetry={onRetry}
          />
        }
        right={
          <BranchPerformance
            title="Branch contribution"
            branches={data.branchPerformance}
            loading={loading}
            onRetry={onRetry}
          />
        }
      />
      <ComparisonLayout
        left={
          <RankingList
            title="Top 10 revenue clients"
            items={toRankingItems(data.topRevenueClients)}
            loading={loading}
          />
        }
        right={
          <RankingList
            title="Fastest growing clients"
            items={toRankingItems(data.fastestGrowingClients)}
            loading={loading}
          />
        }
      />
    </Stack>
  )
}
