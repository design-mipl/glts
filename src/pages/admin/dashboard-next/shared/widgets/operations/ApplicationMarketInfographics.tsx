import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, Select } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { useDashboardChartColors } from '@/shared/theme/dashboardChartColors'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { DASHBOARD_SPACING } from '../../constants'

export interface ApplicationMarketRankingPoint {
  name: string
  value: number
  sharePercent: number
}

export interface ApplicationMarketSlice {
  key: string
  label: string
  value: number
  color?: string
}

type TopN = 5 | 7 | 10

const TOP_N_OPTIONS = [
  { label: 'Top 5', value: '5' },
  { label: 'Top 7', value: '7' },
  { label: 'Top 10', value: '10' },
] as const

function toTopBars(rows: ApplicationMarketRankingPoint[], limit: TopN) {
  return rows.slice(0, limit).map((row) => ({
    name: row.name,
    share: row.sharePercent,
  }))
}

function topChartHeight(count: number): number {
  return Math.max(260, count * 44 + 56)
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

export interface ApplicationMarketInfographicsProps {
  topClients: ApplicationMarketRankingPoint[]
  topCountries: ApplicationMarketRankingPoint[]
  submissionByJurisdiction?: ApplicationMarketRankingPoint[]
  loading?: boolean
}

/** Top clients · Top countries · Submission by jurisdiction — Ops + Documentation Overview. */
export function ApplicationMarketInfographics({
  topClients,
  topCountries,
  submissionByJurisdiction = [],
  loading,
}: ApplicationMarketInfographicsProps) {
  const chart = useDashboardChartColors()
  const [clientTopN, setClientTopN] = useState<TopN>(5)
  const [countryTopN, setCountryTopN] = useState<TopN>(5)

  const topClientBars = useMemo(() => toTopBars(topClients, clientTopN), [topClients, clientTopN])
  const topCountryBars = useMemo(
    () => toTopBars(topCountries, countryTopN),
    [topCountries, countryTopN],
  )

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel
          title="Top clients"
          description="Share of applications (%)"
          action={
            <Box sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Top clients count"
                value={String(clientTopN)}
                options={[...TOP_N_OPTIONS]}
                onChange={(v) => setClientTopN(Number(v) as TopN)}
              />
            </Box>
          }
        >
          <BarChart
            data={topClientBars}
            xKey="name"
            height={topChartHeight(clientTopN)}
            barSize={18}
            orientation="horizontal"
            wrapCategoryLabels
            showLegend={false}
            loading={loading}
            bars={[{ key: 'share', label: 'Share %', color: chart.violet }]}
          />
        </ChartPanel>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel
          title="Top countries"
          description="Share of applications (%)"
          action={
            <Box sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0 }}>
              <Select
                size="sm"
                fullWidth
                aria-label="Top countries count"
                value={String(countryTopN)}
                options={[...TOP_N_OPTIONS]}
                onChange={(v) => setCountryTopN(Number(v) as TopN)}
              />
            </Box>
          }
        >
          <BarChart
            data={topCountryBars}
            xKey="name"
            height={topChartHeight(countryTopN)}
            barSize={18}
            orientation="horizontal"
            wrapCategoryLabels
            showLegend={false}
            loading={loading}
            bars={[{ key: 'share', label: 'Share %', color: chart.blue }]}
          />
        </ChartPanel>
      </Grid>

      {submissionByJurisdiction.length > 0 ? (
        <Grid size={{ xs: 12 }}>
          <SubmissionByJurisdiction data={submissionByJurisdiction} loading={loading} />
        </Grid>
      ) : null}
    </Grid>
  )
}

export interface SubmissionByJurisdictionProps {
  data: ApplicationMarketRankingPoint[]
  loading?: boolean
  dense?: boolean
}

/** Horizontal ranking — submissions grouped by jurisdiction (VFS / consulate desk). */
export function SubmissionByJurisdiction({
  data,
  loading,
  dense = false,
}: SubmissionByJurisdictionProps) {
  const chart = useDashboardChartColors()
  const [topN, setTopN] = useState<TopN>(5)

  const bars = useMemo(
    () =>
      data.slice(0, topN).map((row) => ({
        name: row.name,
        value: row.value,
      })),
    [data, topN],
  )

  return (
    <ChartPanel
      title="Submission by jurisdiction"
      description="Applications by VFS / consulate desk"
      action={
        <Box sx={{ width: { xs: '100%', sm: 120 }, flexShrink: 0 }}>
          <Select
            size="sm"
            fullWidth
            aria-label="Submission by jurisdiction count"
            value={String(topN)}
            options={[...TOP_N_OPTIONS]}
            onChange={(v) => setTopN(Number(v) as TopN)}
          />
        </Box>
      }
    >
      <BarChart
        data={bars}
        xKey="name"
        height={dense ? Math.max(180, topN * 36 + 40) : topChartHeight(topN)}
        barSize={dense ? 14 : 18}
        orientation="horizontal"
        wrapCategoryLabels
        showLegend={false}
        loading={loading}
        bars={[{ key: 'value', label: 'Submitted', color: chart.teal }]}
      />
    </ChartPanel>
  )
}

export interface PostSubmissionVisibilityProps {
  data: ApplicationMarketSlice[]
  loading?: boolean
}

/** Embassy/VFS · Collection · Collected · Dispatched — sits beside Recent activity. */
export function PostSubmissionVisibility({ data, loading }: PostSubmissionVisibilityProps) {
  const chart = useDashboardChartColors()
  const visibilityBars = data.map((s) => ({
    stage: s.label,
    value: s.value,
  }))

  return (
    <ChartPanel
      title="Post-submission visibility"
      description="Embassy/VFS · Collection · Collected · Dispatched — open Application Management"
    >
      <BarChart
        data={visibilityBars}
        xKey="stage"
        height={200}
        barSize={28}
        showLegend={false}
        loading={loading}
        bars={[{ key: 'value', label: 'Count', color: chart.violet }]}
      />
    </ChartPanel>
  )
}
