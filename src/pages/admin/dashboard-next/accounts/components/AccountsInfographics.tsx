import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, Select, Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { AGEING_BUCKET_LABELS, type AgeingBucketId } from '../../shared/config/ageingBuckets'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { ACCOUNTS_CHART_COLORS } from '../data/accountsChartColors'
import type { AccountsDashboardData } from '../types'

type AgeingTab = 'amount' | 'count'
type SpendView = 'all' | 'credit_card' | 'insurance' | 'courier' | 'ticketing' | 'cash'

const SPEND_OPTIONS = [
  { label: 'All packs', value: 'all' },
  { label: 'Credit card', value: 'credit_card' },
  { label: 'Insurance', value: 'insurance' },
  { label: 'Courier', value: 'courier' },
  { label: 'Ticketing', value: 'ticketing' },
  { label: 'Cash', value: 'cash' },
] as const

const PACK_COLORS: Record<string, string> = {
  credit_card: ACCOUNTS_CHART_COLORS.coral,
  insurance: ACCOUNTS_CHART_COLORS.blue,
  courier: ACCOUNTS_CHART_COLORS.amber,
  ticketing: ACCOUNTS_CHART_COLORS.violet,
  cash: ACCOUNTS_CHART_COLORS.teal,
  invoiced_uninvoiced: ACCOUNTS_CHART_COLORS.slate,
}

function ChartPanel({
  title,
  description,
  action,
  children,
}: {
  title: string
  description?: string
  action?: React.ReactNode
  children: React.ReactNode
}) {
  const colors = usePublicBrandColors()
  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden', height: '100%' }}>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'flex-start' }}
        justifyContent="space-between"
        spacing={1}
        sx={{ px: 2, pt: 2, pb: 1.25 }}
      >
        <Box sx={{ minWidth: 0 }}>
          <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 14 }}>
            {title}
          </Typography>
          {description ? (
            <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
              {description}
            </Typography>
          ) : null}
        </Box>
        {action}
      </Stack>
      <Box sx={{ px: 2, pb: 2 }}>{children}</Box>
    </Box>
  )
}

function parseAmountLakhs(amount: string): number {
  const cleaned = amount.replace(/[₹,\s]/g, '').toUpperCase()
  if (cleaned.endsWith('L')) return Number.parseFloat(cleaned) || 0
  const n = Number.parseFloat(cleaned)
  return Number.isFinite(n) ? n / 100000 : 0
}

export interface AccountsInfographicsProps {
  data: AccountsDashboardData
  loading?: boolean
}

/** Overview infographics — AR ageing · segment mix · expense packs (multi-color). */
export function AccountsInfographics({ data, loading }: AccountsInfographicsProps) {
  const [ageingTab, setAgeingTab] = useState<AgeingTab>('amount')
  const [spendView, setSpendView] = useState<SpendView>('all')

  const ageingSlices = useMemo(() => {
    const colors = [
      ACCOUNTS_CHART_COLORS.green,
      ACCOUNTS_CHART_COLORS.amber,
      ACCOUNTS_CHART_COLORS.coral,
      ACCOUNTS_CHART_COLORS.navy,
    ]
    return data.ageingBuckets.map((bucket, index) => ({
      key: bucket.id,
      label: AGEING_BUCKET_LABELS[bucket.id as AgeingBucketId] ?? bucket.id,
      value: ageingTab === 'amount' ? Math.round(bucket.amount / 1000) : (bucket.count ?? 0),
      color: colors[index % colors.length],
    }))
  }, [data.ageingBuckets, ageingTab])

  const ageingTotal = ageingSlices.reduce((sum, s) => sum + s.value, 0)

  const segmentSlices = useMemo(
    () =>
      data.revenueBySegment.map((row, index) => {
        const colors = [
          ACCOUNTS_CHART_COLORS.navy,
          ACCOUNTS_CHART_COLORS.blue,
          ACCOUNTS_CHART_COLORS.teal,
          ACCOUNTS_CHART_COLORS.violet,
          ACCOUNTS_CHART_COLORS.amber,
        ]
        const numeric = Number.parseFloat(row.revenue.replace(/[₹,L]/gi, '')) || row.sharePercent
        return {
          key: row.id,
          label: row.name,
          value: Math.max(1, Math.round(numeric)),
          color: colors[index % colors.length],
        }
      }),
    [data.revenueBySegment],
  )

  const segmentTotal = segmentSlices.reduce((sum, s) => sum + s.value, 0)

  const spendBars = useMemo(() => {
    const packs = ['credit_card', 'insurance', 'courier', 'ticketing', 'cash'] as const
    const rows = packs
      .filter((pack) => spendView === 'all' || pack === spendView)
      .map((pack) => {
        const items = data.expenseDailyRows.filter((r) => r.pack === pack)
        return {
          pack: SPEND_OPTIONS.find((o) => o.value === pack)?.label ?? pack,
          amount: items.reduce((sum, r) => sum + parseAmountLakhs(r.amount) * 100000, 0) / 1000,
          count: items.length,
        }
      })
    return rows
  }, [data.expenseDailyRows, spendView])

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel
          title="AR ageing"
          description="Outstanding by age bucket"
          action={
            <Tabs
              value={ageingTab}
              onChange={(value) => setAgeingTab(value as AgeingTab)}
              variant="underline"
              size="sm"
              items={[
                { value: 'amount', label: 'Amount' },
                { value: 'count', label: 'Count' },
              ]}
            />
          }
        >
          <DonutChart
            data={ageingSlices}
            height={240}
            loading={loading}
            centerLabel={ageingTab === 'amount' ? '₹k' : 'inv'}
            centerValue={String(ageingTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6, lg: 4 }}>
        <ChartPanel
          title="Revenue by segment"
          description="Marine · B2B · Corporate · B2C"
        >
          <DonutChart
            data={segmentSlices}
            height={240}
            loading={loading}
            centerLabel="₹L"
            centerValue={String(segmentTotal)}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, lg: 4 }}>
        <ChartPanel
          title="Daily expense packs"
          description="Card · insurance · courier · ticketing · cash"
          action={
            <Box sx={{ width: { xs: '100%', sm: 140 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Expense pack filter"
                value={spendView}
                options={[...SPEND_OPTIONS]}
                onChange={(v) => setSpendView(String(v) as SpendView)}
              />
            </Box>
          }
        >
          <BarChart
            data={spendBars}
            xKey="pack"
            height={220}
            barSize={22}
            showLegend={false}
            loading={loading}
            bars={[
              {
                key: 'amount',
                label: 'Amount (₹k)',
                color:
                  spendView === 'all'
                    ? ACCOUNTS_CHART_COLORS.amber
                    : (PACK_COLORS[spendView] ?? ACCOUNTS_CHART_COLORS.amber),
              },
            ]}
          />
        </ChartPanel>
      </Grid>
    </Grid>
  )
}

export interface AccountsCollectionsTrendProps {
  data: AccountsDashboardData
  loading?: boolean
}

/** Collections vs billed trend — used beside recent activity on Overview. */
export function AccountsCollectionsTrend({ data, loading }: AccountsCollectionsTrendProps) {
  const bars = data.processingTrend.map((point) => ({
    label: point.label,
    billed: point.value,
    collected: point.secondary ?? Math.round(point.value * 0.7),
  }))

  return (
    <ChartPanel title="Collections trend" description="Billed vs recovered (₹L)">
      <BarChart
        data={bars}
        xKey="label"
        height={260}
        barSize={18}
        showLegend
        loading={loading}
        bars={[
          { key: 'billed', label: 'Billed', color: ACCOUNTS_CHART_COLORS.navy },
          { key: 'collected', label: 'Collected', color: ACCOUNTS_CHART_COLORS.green },
        ]}
      />
    </ChartPanel>
  )
}
