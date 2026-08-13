import { useMemo, useState } from 'react'
import {
  Box,
  Collapse,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
  alpha,
} from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { AlertTriangle, ChevronDown, ChevronRight } from 'lucide-react'
import {
  Bar,
  BarChart as RechartsBarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { BarChart } from '@/design-system/UIComponents'
import { useDashboardChartColors } from '@/shared/theme/dashboardChartColors'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { DASHBOARD_SPACING } from '../../constants'
import {
  primaryForecastRisk,
  sortPlMetrics,
} from '../../utils/managementFinanceSelectors'
import { ChartPanel } from '../ChartPanel'
import { VerticalProfitabilityTrendList } from './VerticalProfitabilityTrendList'
import type {
  BlockedCashDetail,
  CashWaterfallStep,
  FinanceDashboardWorkspaceData,
  FinanceForecastPeriod,
  PlMetricBlock,
} from '../../types'

const CHART_HEIGHT_DEFAULT = 200
const CHART_HEIGHT_COMPACT = 168

function formatLakhs(value: unknown) {
  const n = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(n)) return String(value ?? '')
  const rounded = Number.isInteger(n) ? String(n) : n.toFixed(1)
  return `₹${rounded}L`
}

function buildWaterfallChartData(steps: CashWaterfallStep[]) {
  let running = 0
  return steps.map((step) => {
    if (step.type === 'opening') {
      running = step.amountL
      return { label: step.label, base: 0, value: step.amountL, kind: step.type, running }
    }
    if (step.type === 'closing') {
      return { label: step.label, base: 0, value: running, kind: step.type, running }
    }
    const isInflow = step.amountL >= 0
    const magnitude = Math.abs(step.amountL)
    const base = isInflow ? running : running + step.amountL
    running += step.amountL
    return {
      label: step.label,
      base: Math.max(0, base),
      value: magnitude,
      kind: isInflow ? 'inflow' : 'outflow',
      running,
    }
  })
}

function CashWaterfallPanel({
  steps,
  loading,
  chartHeight,
}: {
  steps: CashWaterfallStep[]
  loading?: boolean
  chartHeight: number
}) {
  const chart = useDashboardChartColors()
  const theme = useTheme()
  const rows = useMemo(() => buildWaterfallChartData(steps), [steps])

  const colorFor = (kind: string) => {
    if (kind === 'opening' || kind === 'closing') return chart.navy
    if (kind === 'inflow') return chart.green
    return chart.coral
  }

  return (
    <ChartPanel title="Net cash position" subtitle="Where did our cash go?" loading={loading}>
      <Box sx={{ width: '100%', height: chartHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <RechartsBarChart data={rows} margin={{ top: 8, right: 8, left: 0, bottom: 4 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
              tickLine={false}
              axisLine={{ stroke: theme.palette.divider }}
              interval={0}
              angle={-22}
              textAnchor="end"
              height={56}
            />
            <YAxis
              tick={{ fontSize: 10, fill: theme.palette.text.secondary }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatLakhs(v)}
              width={48}
            />
            <Tooltip
              formatter={(value, name) => [
                name === 'base' ? '' : formatLakhs(value),
                name === 'base' ? '' : 'Amount',
              ]}
              labelStyle={{ fontSize: 11 }}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Bar dataKey="base" stackId="wf" fill="transparent" legendType="none" />
            <Bar dataKey="value" stackId="wf" radius={[4, 4, 0, 0]}>
              {rows.map((row) => (
                <Cell key={row.label} fill={colorFor(row.kind)} />
              ))}
            </Bar>
          </RechartsBarChart>
        </ResponsiveContainer>
      </Box>
    </ChartPanel>
  )
}

function PlTargetBarsPanel({
  metrics,
  loading,
  compact,
}: {
  metrics: PlMetricBlock[]
  loading?: boolean
  compact?: boolean
}) {
  const chart = useDashboardChartColors()
  const ordered = useMemo(() => sortPlMetrics(metrics), [metrics])

  return (
    <ChartPanel title="P&L" subtitle="Actual · target · prior month" loading={loading}>
      <Stack spacing={compact ? 1 : 1.75}>
        {ordered.map((metric) => {
          const deltaUp = metric.priorMonthDelta >= 0
          return (
            <Box key={metric.id}>
              <Stack direction="row" justifyContent="space-between" alignItems="baseline">
                <Typography
                  variant="caption"
                  color="text.secondary"
                  fontWeight={700}
                  sx={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: 0.4 }}
                >
                  {metric.label}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                  Target {metric.target}
                </Typography>
              </Stack>
              <Typography fontWeight={800} sx={{ fontSize: compact ? '1rem' : '1.1rem', mt: 0.25 }}>
                {metric.actual}
              </Typography>
              <LinearProgress
                variant="determinate"
                value={metric.achievementPercent}
                sx={{
                  mt: 0.5,
                  height: compact ? 5 : 6,
                  borderRadius: 999,
                  bgcolor: alpha(chart.navy, 0.1),
                  '& .MuiLinearProgress-bar': { borderRadius: 999, bgcolor: chart.navy },
                }}
              />
              <Stack direction="row" justifyContent="space-between" sx={{ mt: 0.35 }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 10 }}>
                  {metric.achievementPercent}% · Prior {metric.priorMonth}
                </Typography>
                <Typography
                  variant="caption"
                  fontWeight={700}
                  sx={{ fontSize: 10, color: deltaUp ? 'success.main' : 'error.main' }}
                >
                  {deltaUp ? '↑' : '↓'} {Math.abs(metric.priorMonthDelta)}%
                </Typography>
              </Stack>
            </Box>
          )
        })}
      </Stack>
    </ChartPanel>
  )
}

function BlockedCashPanel({
  blocked,
  loading,
  compact,
}: {
  blocked: BlockedCashDetail
  loading?: boolean
  compact?: boolean
}) {
  const chart = useDashboardChartColors()
  const bars = blocked.byCountry.map((row) => ({ country: row.country, amount: row.amountL }))
  const barHeight = compact ? bars.length * 18 + 12 : bars.length * 22 + 20
  const panelMinHeightSpacing = Math.max(8, Math.ceil((barHeight + 8) / 8))

  return (
    <ChartPanel
      title={`Blocked Embassy / VFS · ${blocked.amount}`}
      subtitle={`${blocked.applicationCount} apps · ${blocked.expectedReleaseLabel} · ${blocked.expectedReleaseFrom}–${blocked.expectedReleaseTo}`}
      loading={loading}
      heightSpacing={panelMinHeightSpacing}
    >
      <BarChart
        data={bars}
        xKey="country"
        height={barHeight}
        barSize={compact ? 12 : 14}
        orientation="horizontal"
        showLegend={false}
        showGrid={false}
        loading={loading}
        formatX={formatLakhs}
        bars={[{ key: 'amount', label: 'Blocked ₹L', color: chart.coral }]}
      />
    </ChartPanel>
  )
}

function ArAgeingDetailPanel({
  buckets,
  loading,
  compact,
}: {
  buckets: FinanceDashboardWorkspaceData['arAgeingDetail']
  loading?: boolean
  compact?: boolean
}) {
  const chart = useDashboardChartColors()
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const barData = buckets.map((b) => ({ bucket: b.label, amount: b.amountL, id: b.id }))

  return (
    <ChartPanel title="AR ageing" subtitle="Expand buckets for top clients" loading={loading}>
      <BarChart
        data={barData}
        xKey="bucket"
        height={compact ? 120 : 140}
        barSize={22}
        orientation="horizontal"
        showLegend={false}
        loading={loading}
        formatX={(v) => formatLakhs(v)}
        bars={[{ key: 'amount', label: 'Amount ₹L', color: chart.navy }]}
      />
      <Stack spacing={0.5} sx={{ mt: 1.5 }}>
        {buckets.map((bucket) => {
          const open = expandedId === bucket.id
          return (
            <Box
              key={bucket.id}
              sx={{ border: '1px solid', borderColor: 'divider', borderRadius: '8px', overflow: 'hidden' }}
            >
              <Box
                role="button"
                tabIndex={0}
                onClick={() => setExpandedId(open ? null : bucket.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    setExpandedId(open ? null : bucket.id)
                  }
                }}
                sx={{
                  px: 1.25,
                  py: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <Stack direction="row" spacing={0.75} alignItems="center">
                  {open ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
                    {bucket.label}
                  </Typography>
                </Stack>
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: 12 }}>
                  {formatLakhs(bucket.amountL)}
                </Typography>
              </Box>
              <Collapse in={open}>
                <Stack spacing={0.25} sx={{ px: 1.25, pb: 1, pt: 0.25 }}>
                  {bucket.clients.map((client) => (
                    <Stack key={client.name} direction="row" justifyContent="space-between" spacing={1}>
                      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                        {client.name}
                      </Typography>
                      <Typography variant="caption" fontWeight={600} sx={{ fontSize: 11 }}>
                        {formatLakhs(client.amountL)}
                      </Typography>
                    </Stack>
                  ))}
                </Stack>
              </Collapse>
            </Box>
          )
        })}
      </Stack>
    </ChartPanel>
  )
}

function CreditExposureRankPanel({
  clients,
  loading,
}: {
  clients: FinanceDashboardWorkspaceData['creditExposureClients']
  loading?: boolean
}) {
  const chart = useDashboardChartColors()
  const bars = clients.map((c) => ({ name: c.name, amount: c.amountL }))

  return (
    <ChartPanel title="Credit exposure" subtitle="Top clients by financial exposure" loading={loading}>
      <BarChart
        data={bars}
        xKey="name"
        height={Math.max(220, bars.length * 44 + 48)}
        barSize={18}
        orientation="horizontal"
        wrapCategoryLabels
        showLegend={false}
        loading={loading}
        formatX={formatLakhs}
        bars={[{ key: 'amount', label: 'Exposure ₹L', color: chart.amber }]}
      />
    </ChartPanel>
  )
}

function RegisteredAgentCountriesPanel({
  countries,
  loading,
}: {
  countries: FinanceDashboardWorkspaceData['registeredAgentCountries']
  loading?: boolean
}) {
  const rowHeight = 28
  const contentHeight = countries.length * rowHeight + 4
  const heightSpacing = Math.max(8, Math.ceil(contentHeight / 8))

  return (
    <ChartPanel title="Registered agent countries" loading={loading} heightSpacing={heightSpacing}>
      <Stack spacing={0.25}>
        {countries.map((row) => (
          <Stack
            key={row.country}
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ py: 0.35, minHeight: rowHeight }}
          >
            <Typography variant="body2" fontWeight={600} sx={{ fontSize: 12 }}>
              {row.country}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: 11 }}>
              {row.agentCount} agents
            </Typography>
          </Stack>
        ))}
      </Stack>
    </ChartPanel>
  )
}

function FinanceForwardOutlookPanel({
  periods,
  loading,
  chartHeight,
}: {
  periods: FinanceForecastPeriod[]
  loading?: boolean
  chartHeight: number
}) {
  const chart = useDashboardChartColors()
  const barData = periods.map((p) => ({
    period: p.horizonLabel.replace(' days', 'D'),
    forecast: p.forecastL,
    target: p.targetL,
    achievement: p.achievementPercent,
  }))

  return (
    <ChartPanel title="Forward view" subtitle="30 / 60 / 90-day forecast vs target" loading={loading}>
      <BarChart
        data={barData}
        xKey="period"
        height={chartHeight}
        barSize={22}
        showLegend
        loading={loading}
        formatY={formatLakhs}
        bars={[
          { key: 'forecast', label: 'Forecast', color: chart.navy },
          { key: 'target', label: 'Target', color: chart.amber },
        ]}
        tooltipExtras={[{ key: 'achievement', label: 'Achievement', format: (v) => `${v}%` }]}
      />
      <Grid container spacing={1} sx={{ mt: 1.5 }}>
        {periods.map((period) => (
          <Grid key={period.horizonDays} size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                p: 1.25,
                borderRadius: '8px',
                border: '1px solid',
                borderColor: 'divider',
                height: '100%',
              }}
            >
              <Typography variant="caption" fontWeight={700} sx={{ fontSize: 11 }}>
                {period.horizonLabel.toUpperCase()}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 12, mt: 0.5 }}>
                {formatLakhs(period.forecastL)} forecast / {formatLakhs(period.targetL)} target
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11, display: 'block' }}>
                {period.achievementPercent}% of target
              </Typography>
              <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.75 }}>
                <AlertTriangle size={12} color="#FF9800" />
                <Typography variant="caption" color="warning.main" sx={{ fontSize: 10, fontWeight: 600 }}>
                  Risk: {primaryForecastRisk(period.downsideRisks)}
                </Typography>
              </Stack>
            </Box>
          </Grid>
        ))}
      </Grid>
    </ChartPanel>
  )
}

export interface FinanceDashboardSectionsProps {
  data: FinanceDashboardWorkspaceData
  loading?: boolean
  compact?: boolean
}

/** Management finance workspace — cash/P&L · collections · verticals · forward view. */
export function FinanceDashboardSections({ data, loading, compact = true }: FinanceDashboardSectionsProps) {
  const sectionSpacing = compact ? DASHBOARD_SPACING.dense : DASHBOARD_SPACING.section
  const chartHeight = compact ? CHART_HEIGHT_COMPACT : CHART_HEIGHT_DEFAULT

  return (
    <Stack spacing={sectionSpacing} divider={<Divider flexItem />}>
      <Stack component="section" spacing={1} aria-label="Cash and P&L">
        <ExecutiveSectionHeader title="Cash + P&L" />
        <Grid container spacing={1} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 7 }}>
            <CashWaterfallPanel steps={data.cashWaterfall} loading={loading} chartHeight={chartHeight} />
          </Grid>
          <Grid size={{ xs: 12, lg: 5 }}>
            <PlTargetBarsPanel metrics={data.plMetrics} loading={loading} compact={compact} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <BlockedCashPanel blocked={data.blockedCash} loading={loading} compact={compact} />
          </Grid>
        </Grid>
      </Stack>

      <Stack component="section" spacing={1} aria-label="Collections and credit">
        <ExecutiveSectionHeader title="Collections + credit" />
        <Grid container spacing={1} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <ArAgeingDetailPanel buckets={data.arAgeingDetail} loading={loading} compact={compact} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <CreditExposureRankPanel clients={data.creditExposureClients} loading={loading} />
          </Grid>
        </Grid>
      </Stack>

      <Stack component="section" spacing={1} aria-label="Vertical performance">
        <ExecutiveSectionHeader title="Vertical performance" />
        <Grid container spacing={1} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <VerticalProfitabilityTrendList rows={data.verticalMargins} loading={loading} />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <RegisteredAgentCountriesPanel countries={data.registeredAgentCountries} loading={loading} />
          </Grid>
        </Grid>
      </Stack>

      <Stack component="section" spacing={1} aria-label="Forward view">
        <FinanceForwardOutlookPanel
          periods={data.forwardOutlook}
          loading={loading}
          chartHeight={chartHeight}
        />
      </Stack>
    </Stack>
  )
}
