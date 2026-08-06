import { useMemo } from 'react'
import { Box, Skeleton, Stack, Typography } from '@mui/material'
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Button } from '@/design-system/UIComponents'
import { useChartTheme } from '@/design-system/UIComponents/Charts/utils/chartTheme'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ComparisonMetric, ExecutiveGrid } from '../../shared/dashboard-ui-kit'
import { useSuperAdminChartColors } from './SuperAdminChrome'
import type { SuperAdminDashboardData } from '../types'

export interface OverviewRevenueCollectionsProps {
  data: SuperAdminDashboardData
  loading?: boolean
  onDrillDown?: () => void
}

function formatCr(n: number): string {
  return `₹${n.toFixed(2)}Cr`
}

function efficiencyPct(gross: number, collected: number): number {
  if (gross <= 0) return 0
  return Math.round((collected / gross) * 1000) / 10
}

/** Gross Revenue (bars) vs Collections (line) — never Net Revenue. */
export function OverviewRevenueCollections({
  data,
  loading,
  onDrillDown,
}: OverviewRevenueCollectionsProps) {
  const colors = usePublicBrandColors()
  const chart = useSuperAdminChartColors()
  const ct = useChartTheme()
  const h = ct.isMobile ? 200 : 260

  const points = useMemo(
    () =>
      data.revenueTrend.map((p) => {
        const gross = p.value
        const collected = p.secondary ?? 0
        const outstanding = Math.max(0, Number((gross - collected).toFixed(2)))
        return {
          label: p.label,
          grossRevenue: gross,
          collections: collected,
          outstanding,
          efficiency: efficiencyPct(gross, collected),
          target: Number((gross * 1.05).toFixed(2)),
        }
      }),
    [data.revenueTrend],
  )

  const totals = useMemo(() => {
    const gross = points.reduce((s, p) => s + p.grossRevenue, 0)
    const collected = points.reduce((s, p) => s + p.collections, 0)
    return {
      grossLabel: data.revenueHero.mtd.value,
      collectionsLabel: data.collectionsHero.mtd.value,
      efficiency: efficiencyPct(gross, collected),
      outstandingLabel: data.executiveSummary.outstanding.amount,
      grossDelta: data.revenueHero.mtd.delta,
      collectionsDelta: data.collectionsHero.mtd.delta,
    }
  }, [data, points])

  const empty = !loading && points.length === 0

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
            Revenue vs collections
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
            Gross (invoiced) vs cash collected · last 12 months (₹Cr) · Net profit is on Business /
            Finance
          </Typography>
        </Box>
        <Button label="Finance" variant="text" size="sm" onClick={onDrillDown} />
      </Stack>

      <Box sx={{ px: 2, pb: 1.5 }}>
        <ExecutiveGrid columns={4} spacing={1}>
          <ComparisonMetric
            label="Gross revenue"
            value={totals.grossLabel}
            delta={totals.grossDelta}
            deltaLabel="MTD"
            tone="info"
            loading={loading}
          />
          <ComparisonMetric
            label="Collections"
            value={totals.collectionsLabel}
            delta={totals.collectionsDelta}
            deltaLabel="MTD"
            tone="positive"
            loading={loading}
          />
          <ComparisonMetric
            label="Collection efficiency"
            value={`${totals.efficiency}%`}
            tone={totals.efficiency >= 80 ? 'positive' : totals.efficiency >= 65 ? 'warning' : 'negative'}
            loading={loading}
          />
          <ComparisonMetric
            label="Outstanding"
            value={totals.outstandingLabel}
            delta={data.executiveSummary.outstanding.delta}
            deltaLabel={data.executiveSummary.outstanding.deltaLabel}
            tone="warning"
            loading={loading}
          />
        </ExecutiveGrid>
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        {loading ? (
          <Skeleton variant="rectangular" width="100%" height={h} sx={{ borderRadius: 1 }} />
        ) : empty ? (
          <Typography variant="body2" color="text.secondary">
            No revenue trend for the selected filters.
          </Typography>
        ) : (
          <Box
            role={onDrillDown ? 'button' : undefined}
            tabIndex={onDrillDown ? 0 : undefined}
            onClick={onDrillDown}
            onKeyDown={(event) => {
              if (!onDrillDown) return
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                onDrillDown()
              }
            }}
            sx={{
              cursor: onDrillDown ? 'pointer' : 'default',
              '&:hover': onDrillDown ? { opacity: 0.97 } : undefined,
            }}
          >
            <ResponsiveContainer width="100%" height={h}>
              <ComposedChart
                data={points}
                margin={{
                  top: 4,
                  right: ct.isMobile ? 4 : 16,
                  left: ct.isMobile ? -20 : 0,
                  bottom: 4,
                }}
              >
                <CartesianGrid
                  stroke={ct.gridProps.stroke}
                  strokeDasharray={ct.gridProps.strokeDasharray}
                  strokeOpacity={ct.gridProps.strokeOpacity}
                />
                <XAxis
                  dataKey="label"
                  tick={ct.axisStyle}
                  tickLine={false}
                  axisLine={{ stroke: ct.gridProps.stroke }}
                />
                <YAxis
                  tick={ct.axisStyle}
                  tickLine={false}
                  axisLine={false}
                  width={ct.isMobile ? 30 : 42}
                />
                <RechartsTooltip
                  contentStyle={ct.tooltipStyle}
                  content={({ active, payload, label }) => {
                    if (!active || !payload?.length) return null
                    const row = payload[0]?.payload as (typeof points)[number] | undefined
                    if (!row) return null
                    return (
                      <Box
                        sx={{
                          bgcolor: 'background.paper',
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          boxShadow: 1,
                          p: 1.25,
                          display: 'flex',
                          flexDirection: 'column',
                          gap: 0.5,
                        }}
                      >
                        <Typography sx={{ fontSize: 11, color: 'text.secondary', mb: 0.25 }}>
                          {label}
                        </Typography>
                        <Typography sx={{ fontSize: 12 }}>
                          Gross revenue: {formatCr(row.grossRevenue)}
                        </Typography>
                        <Typography sx={{ fontSize: 12 }}>
                          Collections: {formatCr(row.collections)}
                        </Typography>
                        <Typography sx={{ fontSize: 12 }}>
                          Outstanding: {formatCr(row.outstanding)}
                        </Typography>
                        <Typography sx={{ fontSize: 12 }}>
                          Collection efficiency: {row.efficiency}%
                        </Typography>
                      </Box>
                    )
                  }}
                />
                <Legend {...ct.legendProps} />
                <Bar
                  dataKey="grossRevenue"
                  name="Gross revenue"
                  fill={chart.navy}
                  barSize={14}
                  radius={[4, 4, 0, 0]}
                />
                <Line
                  type="monotone"
                  dataKey="collections"
                  name="Collections"
                  stroke={chart.green}
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 4, strokeWidth: 0 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  name="Target"
                  stroke={chart.slate}
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </Box>
        )}
      </Box>
    </Box>
  )
}
