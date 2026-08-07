import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  Anchor,
  Briefcase,
  Ship,
  Store,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Button, DonutChart } from '@/design-system/UIComponents'
import {
  MarineTimeline,
  MetricComparison,
  DASHBOARD_SPACING,
} from '../../shared'
import { useDashboardFiltersOptional } from '../../shared/dashboard-intelligence'
import { ExecutiveSection } from '../../shared/dashboard-ui-kit'
import {
  SA_CHART_HEIGHT,
  SuperAdminPanel,
  SuperAdminRankChart,
  SuperAdminSection,
  TopNSelect,
  colorSlices,
  sliceTopN,
  useSuperAdminChartColors,
  useSuperAdminChartSeries,
  useTopN,
} from '../components/SuperAdminChrome'
import type {
  SuperAdminDashboardTabProps,
  SuperAdminRankItem,
  SuperAdminVerticalPreview,
} from '../types'

type SegmentFocus = 'marine' | 'corporate' | 'retail' | 'b2b'

const SEGMENT_OPTIONS: Array<{
  id: SegmentFocus
  label: string
  icon: ReactNode
}> = [
  { id: 'marine', label: 'Marine', icon: <Ship size={14} /> },
  { id: 'corporate', label: 'Corporate', icon: <Briefcase size={14} /> },
  { id: 'retail', label: 'Retail', icon: <Store size={14} /> },
  { id: 'b2b', label: 'B2B', icon: <Anchor size={14} /> },
]

function normalizeSegment(value: string | undefined): SegmentFocus {
  const v = (value ?? 'marine').toLowerCase()
  if (v === 'marine' || v === 'corporate' || v === 'retail' || v === 'b2b') return v
  return 'marine'
}

function SegmentStatusChip({ status }: { status: 'live' | 'placeholder' }) {
  if (status !== 'live') return null
  return (
    <Box
      component="span"
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        px: 1,
        py: 0.25,
        borderRadius: '999px',
        fontSize: 11,
        fontWeight: 700,
        bgcolor: (t) => alpha(t.palette.success.main, 0.12),
        color: 'success.dark',
      }}
    >
      Live
    </Box>
  )
}

function SegmentSwitcher({
  active,
  onChange,
}: {
  active: SegmentFocus
  onChange: (next: SegmentFocus) => void
}) {
  return (
    <Stack
      direction="row"
      flexWrap="wrap"
      useFlexGap
      spacing={1}
      sx={{
        p: 1,
        borderRadius: 2,
        bgcolor: (t) => alpha(t.palette.text.primary, 0.03),
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {SEGMENT_OPTIONS.map((option) => {
        const selected = option.id === active
        return (
          <Button
            key={option.id}
            size="sm"
            variant={selected ? 'contained' : 'outlined'}
            label={option.label}
            startIcon={option.icon}
            onClick={() => onChange(option.id)}
            aria-pressed={selected}
          />
        )
      })}
    </Stack>
  )
}

function MixCharts({
  entityTitle,
  entityItems,
  countryTitle,
  countryItems,
  loading,
}: {
  entityTitle: string
  entityItems: SuperAdminRankItem[]
  countryTitle: string
  countryItems: SuperAdminRankItem[]
  loading?: boolean
}) {
  const chartColors = useSuperAdminChartColors()
  const series = useSuperAdminChartSeries()
  const countryTop = useTopN('10')

  const countrySlices = useMemo(() => {
    const sorted = [...countryItems].sort(
      (a, b) => (Number(b.value) || b.progress || 0) - (Number(a.value) || a.progress || 0),
    )
    return colorSlices(
      sliceTopN(sorted, countryTop.topN).map((item) => ({
        key: item.id,
        label: item.primary,
        value: Number(item.value) || item.progress || 0,
      })),
      series,
    )
  }, [countryItems, countryTop.topN, series])

  const countryTotal = countrySlices.reduce((sum, s) => sum + s.value, 0)

  return (
    <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
      <Grid size={{ xs: 12, md: 6 }}>
        <SuperAdminRankChart
          title={entityTitle}
          items={entityItems}
          loading={loading}
          valueLabel="Applications"
          initialTopN="10"
        />
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <SuperAdminPanel
          title={countryTitle}
          action={
            <TopNSelect
              value={countryTop.topN}
              onChange={countryTop.setTopN}
              ariaLabel={`${countryTitle} top N`}
            />
          }
        >
          <DonutChart
            data={
              countrySlices.length > 0
                ? countrySlices
                : [{ key: 'none', label: 'None', value: 1, color: chartColors.slate }]
            }
            height={SA_CHART_HEIGHT}
            loading={loading}
            centerLabel="mix"
            centerValue={String(countryTotal)}
          />
        </SuperAdminPanel>
      </Grid>
    </Grid>
  )
}

function MarineSegmentView({
  data,
  loading,
  onRetry,
  onNavigate,
}: SuperAdminDashboardTabProps) {
  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <ExecutiveSection
        title="Commercial KPIs"
        action={<SegmentStatusChip status="live" />}
      >
        <MetricComparison
          title="Marine commercial KPIs"
          metrics={data.marineMetrics}
          loading={loading}
          onRetry={onRetry}
        />
      </ExecutiveSection>

      <ExecutiveSection title="Applications mix">
        <MixCharts
          entityTitle="By shipping company"
          entityItems={data.marineByCompany}
          countryTitle="By country"
          countryItems={data.marineByCountry}
          loading={loading}
        />
      </ExecutiveSection>

      <ExecutiveSection title="Joining-date risk">
        <MarineTimeline
          title="Joining date & crew risk"
          rows={[...data.marineTimeline].sort((a, b) => {
            const rank = (r: string) => (r === 'red' ? 0 : r === 'amber' ? 1 : 2)
            return rank(a.ragStatus) - rank(b.ragStatus)
          })}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/application-management/marine')}
        />
      </ExecutiveSection>

      <ExecutiveSection title="Queues">
        <SuperAdminRankChart
          title="Pending crew visas"
          items={data.pendingCrewVisas}
          loading={loading}
          valueLabel="Priority"
          initialTopN="5"
        />
      </ExecutiveSection>
    </Stack>
  )
}

function PreviewSegmentView({
  vertical,
  preview,
  loading,
  pendingTitle,
  clientsTitle,
  entityChartTitle,
}: {
  vertical: string
  preview: SuperAdminVerticalPreview
  loading?: boolean
  pendingTitle: string
  clientsTitle: string
  entityChartTitle: string
}) {
  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <ExecutiveSection title="Commercial KPIs">
        <MetricComparison title={`${vertical} KPIs`} metrics={preview.kpis} loading={loading} />
      </ExecutiveSection>

      <ExecutiveSection title="Applications mix">
        <MixCharts
          entityTitle={entityChartTitle}
          entityItems={preview.byEntity}
          countryTitle="By country / destination"
          countryItems={preview.byCountry}
          loading={loading}
        />
      </ExecutiveSection>

      <ExecutiveSection title="Queues & accounts">
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminRankChart
              title={pendingTitle}
              items={preview.pending}
              loading={loading}
              valueLabel="Priority"
              initialTopN="5"
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <SuperAdminRankChart
              title={clientsTitle}
              items={preview.topClients}
              loading={loading}
              valueLabel="Revenue"
            />
          </Grid>
        </Grid>
      </ExecutiveSection>
    </Stack>
  )
}

/** Unified Marine · Corporate · Retail · B2B — driven by global segment filter. */
export function SegmentsTab(props: SuperAdminDashboardTabProps) {
  const { data, loading } = props
  const filterCtx = useDashboardFiltersOptional()
  const [searchParams, setSearchParams] = useSearchParams()
  const active = normalizeSegment(filterCtx?.filters.segment ?? searchParams.get('segment') ?? 'marine')
  const appliedUrlSegment = useRef<string | null>(null)

  // Apply deep-link ?segment= once when URL changes externally (search / openSegments).
  // "all" (or missing) maps to Marine — no cross-segment comparison view on this tab.
  useEffect(() => {
    const raw = searchParams.get('segment')
    const fromUrl = normalizeSegment(raw ?? 'marine')
    const key = raw ?? 'marine'
    if (appliedUrlSegment.current === key) return
    appliedUrlSegment.current = key
    if (!filterCtx) return
    if (fromUrl === normalizeSegment(filterCtx.filters.segment)) return
    filterCtx.setFilter('segment', fromUrl)
  }, [filterCtx, searchParams])

  const setSegment = (next: SegmentFocus) => {
    appliedUrlSegment.current = next
    filterCtx?.setFilter('segment', next)
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev)
        if (!params.get('tab')) params.set('tab', 'segments')
        params.set('segment', next)
        return params
      },
      { replace: true },
    )
  }

  const activeMeta = SEGMENT_OPTIONS.find((o) => o.id === active) ?? SEGMENT_OPTIONS[0]

  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <SuperAdminSection
        title="Business segments"
        description="One workspace for Marine, Corporate, Retail, and B2B"
      >
        <Stack spacing={1.5}>
          <SegmentSwitcher active={active} onChange={setSegment} />
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            {activeMeta.icon}
            <Typography variant="body2" fontWeight={700}>
              Viewing: {activeMeta.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Deep-dive — change segment above or in the filter bar
            </Typography>
          </Stack>
        </Stack>
      </SuperAdminSection>

      {active === 'marine' ? <MarineSegmentView {...props} /> : null}

      {active === 'corporate' ? (
        <PreviewSegmentView
          vertical="Corporate"
          preview={data.corporatePreview}
          loading={loading}
          pendingTitle="Pending business visas"
          clientsTitle="Top corporate clients"
          entityChartTitle="By company"
        />
      ) : null}

      {active === 'retail' ? (
        <PreviewSegmentView
          vertical="Retail"
          preview={data.retailPreview}
          loading={loading}
          pendingTitle="Payment status & ratings"
          clientsTitle="Destination revenue"
          entityChartTitle="Channel mix"
        />
      ) : null}

      {active === 'b2b' ? (
        <PreviewSegmentView
          vertical="B2B"
          preview={data.b2bPreview}
          loading={loading}
          pendingTitle="Partner signals · outstanding"
          clientsTitle="Most active agencies"
          entityChartTitle="By travel partner"
        />
      ) : null}
    </Stack>
  )
}
