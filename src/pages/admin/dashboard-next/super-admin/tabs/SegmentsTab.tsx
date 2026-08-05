import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  Anchor,
  Briefcase,
  Network,
  Ship,
  Store,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { BarChart, Button, DonutChart } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import {
  MarineTimeline,
  MetricComparison,
  DASHBOARD_SPACING,
} from '../../shared'
import { useDashboardFiltersOptional } from '../../shared/dashboard-intelligence'
import {
  ComparisonLayout,
  ExecutiveGrid,
  ExecutiveSection,
  RankingList,
  SegmentCard,
} from '../../shared/dashboard-ui-kit'
import { SUPER_ADMIN_CHART_COLORS, SUPER_ADMIN_CHART_SERIES } from '../data/superAdminChartColors'
import type {
  SuperAdminDashboardTabProps,
  SuperAdminRankItem,
  SuperAdminSegmentCard,
  SuperAdminVerticalPreview,
} from '../types'

type SegmentFocus = 'all' | 'marine' | 'corporate' | 'retail' | 'b2b'

const SEGMENT_OPTIONS: Array<{
  id: SegmentFocus
  label: string
  icon: ReactNode
}> = [
  { id: 'all', label: 'All segments', icon: <Network size={14} /> },
  { id: 'marine', label: 'Marine', icon: <Ship size={14} /> },
  { id: 'corporate', label: 'Corporate', icon: <Briefcase size={14} /> },
  { id: 'retail', label: 'Retail', icon: <Store size={14} /> },
  { id: 'b2b', label: 'B2B', icon: <Anchor size={14} /> },
]

const SEGMENT_ICONS = {
  marine: <Ship size={20} />,
  corporate: <Briefcase size={20} />,
  retail: <Store size={20} />,
  b2b: <Anchor size={20} />,
} as const

function normalizeSegment(value: string | undefined): SegmentFocus {
  const v = (value ?? 'all').toLowerCase()
  if (v === 'marine' || v === 'corporate' || v === 'retail' || v === 'b2b') return v
  return 'all'
}

function ChartPanel({
  title,
  description,
  children,
}: {
  title: string
  description?: string
  children: ReactNode
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

function SegmentStatusChip({ status }: { status: 'live' | 'placeholder' }) {
  const isLive = status === 'live'
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
        bgcolor: (t) =>
          alpha(isLive ? t.palette.success.main : t.palette.info.main, 0.12),
        color: isLive ? 'success.dark' : 'info.dark',
      }}
    >
      {isLive ? 'Live' : 'Preview'}
    </Box>
  )
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
  if (segment.repeatBusinessPercent) rows.push(['Repeat', segment.repeatBusinessPercent])
  if (segment.winRate) rows.push(['Win rate', segment.winRate])

  return (
    <Stack spacing={1.25}>
      <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: -0.4 }}>
        {segment.revenue}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        {segment.applications} · {segment.growthLabel}
      </Typography>
      <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0.75 }}>
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

function AllSegmentsView({
  data,
  loading,
  onSelectSegment,
}: {
  data: SuperAdminDashboardTabProps['data']
  loading?: boolean
  onSelectSegment: (id: SegmentFocus) => void
}) {
  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <ExecutiveSection
        question="How do the four verticals compare?"
        title="Segment performance"
        subtitle="Select a segment above or in global filters for a full vertical deep-dive."
      >
        <ExecutiveGrid columns={4} spacing={DASHBOARD_SPACING.field}>
          {data.segmentCards.map((segment) => (
            <Box
              key={segment.id}
              onClick={() => onSelectSegment(segment.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSelectSegment(segment.id)
                }
              }}
              role="button"
              tabIndex={0}
              sx={{
                cursor: 'pointer',
                height: '100%',
                borderRadius: 2,
                outline: 'none',
                '&:focus-visible': {
                  boxShadow: (t) => `0 0 0 2px ${t.palette.primary.main}`,
                },
              }}
            >
              <SegmentCard
                icon={SEGMENT_ICONS[segment.id]}
                title={segment.label}
                subtitle={`${segment.status === 'live' ? 'Live' : 'Preview'} · Open ${segment.label}`}
                hoverable
              >
                <Stack spacing={1}>
                  <SegmentStatusChip status={segment.status} />
                  <SegmentMetrics segment={segment} />
                </Stack>
              </SegmentCard>
            </Box>
          ))}
        </ExecutiveGrid>
      </ExecutiveSection>

      <ExecutiveSection
        question="Where should management act first?"
        title="Cross-segment risk — joining-date (Marine)"
        subtitle="Always visible on All — critical crew sign-on pressure."
      >
        <MarineTimeline
          title="Joining date & crew risk"
          subtitle="Vessel sign-on pressure — act on red / amber first"
          rows={data.marineTimeline}
          loading={loading}
          onViewAll={() => onSelectSegment('marine')}
        />
      </ExecutiveSection>

      <ExecutiveSection
        title="Margin by vertical"
        subtitle="Gross margin % this month across Marine · Corporate · Retail · B2B"
      >
        <RankingList
          title="Gross margin by segment"
          items={toRankingItems(data.marginByVertical)}
          loading={loading}
        />
      </ExecutiveSection>
    </Stack>
  )
}

function MixCharts({
  entityTitle,
  entityDescription,
  entityBars,
  entityXKey,
  countryTitle,
  countryDescription,
  countrySlices,
  loading,
}: {
  entityTitle: string
  entityDescription: string
  entityBars: Array<Record<string, string | number>>
  entityXKey: string
  countryTitle: string
  countryDescription: string
  countrySlices: Array<{ key: string; label: string; value: number; color: string }>
  loading?: boolean
}) {
  const countryTotal = countrySlices.reduce((sum, s) => sum + s.value, 0)
  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title={entityTitle} description={entityDescription}>
          <BarChart
            data={entityBars}
            xKey={entityXKey}
            height={220}
            barSize={16}
            showLegend={false}
            loading={loading}
            bars={[{ key: 'score', label: 'Score' }]}
          />
        </ChartPanel>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <ChartPanel title={countryTitle} description={countryDescription}>
          <DonutChart
            data={
              countrySlices.length > 0
                ? countrySlices
                : [{ key: 'none', label: 'None', value: 1, color: SUPER_ADMIN_CHART_COLORS.slate }]
            }
            height={220}
            loading={loading}
            centerLabel="mix"
            centerValue={String(countryTotal)}
          />
        </ChartPanel>
      </Grid>
    </Grid>
  )
}

function VerticalLists({
  entityTitle,
  countryTitle,
  pendingTitle,
  clientsTitle,
  byEntity,
  byCountry,
  pending,
  topClients,
  loading,
}: {
  entityTitle: string
  countryTitle: string
  pendingTitle: string
  clientsTitle: string
  byEntity: SuperAdminRankItem[]
  byCountry: SuperAdminRankItem[]
  pending: SuperAdminRankItem[]
  topClients: SuperAdminRankItem[]
  loading?: boolean
}) {
  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <ComparisonLayout
        left={
          <RankingList
            title={entityTitle}
            items={toRankingItems(byEntity)}
            loading={loading}
          />
        }
        right={
          <RankingList
            title={countryTitle}
            items={toRankingItems(byCountry)}
            loading={loading}
          />
        }
      />
      <ComparisonLayout
        left={
          <RankingList
            title={pendingTitle}
            items={toRankingItems(pending)}
            loading={loading}
          />
        }
        right={
          <RankingList
            title={clientsTitle}
            items={toRankingItems(topClients)}
            loading={loading}
          />
        }
      />
    </Stack>
  )
}

function PreviewNote({ vertical }: { vertical: string }) {
  return (
    <Box
      sx={{
        px: 1.5,
        py: 1,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        bgcolor: (t) => alpha(t.palette.info.main, 0.06),
      }}
    >
      <Typography variant="caption" color="text.secondary">
        {vertical} metrics are preview sample data until this application flow matches Marine depth.
        Use global filters (date, jurisdiction, country) with this segment focus.
      </Typography>
    </Box>
  )
}

function MarineSegmentView({
  data,
  loading,
  onRetry,
  onNavigate,
}: SuperAdminDashboardTabProps) {
  const companyBars = useMemo(
    () =>
      data.marineByCompany.map((item) => ({
        company: item.primary.length > 16 ? `${item.primary.slice(0, 14)}…` : item.primary,
        score: item.progress ?? 0,
      })),
    [data.marineByCompany],
  )
  const countrySlices = useMemo(
    () =>
      data.marineByCountry.map((item, index) => ({
        key: item.id,
        label: item.primary,
        value: item.progress ?? (Number(item.value) || 1),
        color: SUPER_ADMIN_CHART_SERIES[index % SUPER_ADMIN_CHART_SERIES.length],
      })),
    [data.marineByCountry],
  )

  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <ExecutiveSection
        question="How is Marine performing?"
        title="Commercial KPIs"
        subtitle="Revenue · approval · collections · outstanding"
        action={<SegmentStatusChip status="live" />}
      >
        <MetricComparison
          title="Marine commercial KPIs"
          metrics={data.marineMetrics}
          loading={loading}
          onRetry={onRetry}
        />
      </ExecutiveSection>

      <ExecutiveSection
        question="Where is application volume?"
        title="Applications mix"
        subtitle="By shipping company and destination country"
      >
        <MixCharts
          entityTitle="By shipping company"
          entityDescription="Application pressure score"
          entityBars={companyBars}
          entityXKey="company"
          countryTitle="By country"
          countryDescription="Marine destination mix"
          countrySlices={countrySlices}
          loading={loading}
        />
      </ExecutiveSection>

      <ExecutiveSection
        question="What must we clear before sign-on?"
        title="Joining-date risk"
        subtitle="Primary Marine action surface — red / amber first"
      >
        <MarineTimeline
          title="Joining date & crew risk"
          subtitle="Vessel sign-on pressure"
          rows={data.marineTimeline}
          loading={loading}
          onRetry={onRetry}
          onViewAll={() => onNavigate('/admin/application-management/marine')}
        />
      </ExecutiveSection>

      <ExecutiveSection
        title="Queues & key accounts"
        subtitle="Pending crew visas and top Marine clients"
      >
        <VerticalLists
          entityTitle="Applications by shipping company"
          countryTitle="Applications by country"
          pendingTitle="Pending crew visas"
          clientsTitle="Top Marine clients"
          byEntity={data.marineByCompany}
          byCountry={data.marineByCountry}
          pending={data.pendingCrewVisas}
          topClients={data.topMarineClients}
          loading={loading}
        />
      </ExecutiveSection>
    </Stack>
  )
}

function PreviewSegmentView({
  vertical,
  preview,
  loading,
  entityTitle,
  countryTitle,
  pendingTitle,
  clientsTitle,
  entityChartTitle,
  kpisQuestion,
}: {
  vertical: string
  preview: SuperAdminVerticalPreview
  loading?: boolean
  entityTitle: string
  countryTitle: string
  pendingTitle: string
  clientsTitle: string
  entityChartTitle: string
  kpisQuestion: string
}) {
  const entityBars = useMemo(
    () =>
      preview.byEntity.map((item) => ({
        entity: item.primary.length > 16 ? `${item.primary.slice(0, 14)}…` : item.primary,
        score: item.progress ?? (Number(item.value) || 0),
      })),
    [preview.byEntity],
  )
  const countrySlices = useMemo(
    () =>
      preview.byCountry.map((item, index) => ({
        key: item.id,
        label: item.primary,
        value: item.progress ?? (Number(item.value) || 1),
        color: SUPER_ADMIN_CHART_SERIES[index % SUPER_ADMIN_CHART_SERIES.length],
      })),
    [preview.byCountry],
  )

  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <PreviewNote vertical={vertical} />

      <ExecutiveSection
        question={kpisQuestion}
        title="Commercial KPIs"
        action={<SegmentStatusChip status="placeholder" />}
      >
        <MetricComparison title={`${vertical} KPIs`} metrics={preview.kpis} loading={loading} />
      </ExecutiveSection>

      <ExecutiveSection
        question="Where is volume concentrated?"
        title="Applications mix"
      >
        <MixCharts
          entityTitle={entityChartTitle}
          entityDescription="Volume / pressure score"
          entityBars={entityBars}
          entityXKey="entity"
          countryTitle="By country / destination"
          countryDescription="Mix share"
          countrySlices={countrySlices}
          loading={loading}
        />
      </ExecutiveSection>

      <ExecutiveSection title="Queues & accounts" subtitle="Pending work and top contributors">
        <VerticalLists
          entityTitle={entityTitle}
          countryTitle={countryTitle}
          pendingTitle={pendingTitle}
          clientsTitle={clientsTitle}
          byEntity={preview.byEntity}
          byCountry={preview.byCountry}
          pending={preview.pending}
          topClients={preview.topClients}
          loading={loading}
        />
      </ExecutiveSection>

      {preview.notes.length > 0 ? (
        <Stack spacing={0.5}>
          {preview.notes.map((note) => (
            <Typography key={note} variant="caption" color="text.secondary">
              {note}
            </Typography>
          ))}
        </Stack>
      ) : null}
    </Stack>
  )
}

/** Unified Marine · Corporate · Retail · B2B — driven by global segment filter. */
export function SegmentsTab(props: SuperAdminDashboardTabProps) {
  const { data, loading } = props
  const filterCtx = useDashboardFiltersOptional()
  const [searchParams, setSearchParams] = useSearchParams()
  const active = normalizeSegment(filterCtx?.filters.segment ?? searchParams.get('segment') ?? 'all')
  const appliedUrlSegment = useRef<string | null>(null)

  // Apply deep-link ?segment= once when URL changes externally (search / openSegments).
  useEffect(() => {
    const raw = searchParams.get('segment')
    const key = raw ?? 'all'
    if (appliedUrlSegment.current === key) return
    appliedUrlSegment.current = key
    if (!filterCtx) return
    const fromUrl = normalizeSegment(raw ?? 'all')
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
        if (next === 'all') params.delete('segment')
        else params.set('segment', next)
        return params
      },
      { replace: true },
    )
  }

  const activeMeta = SEGMENT_OPTIONS.find((o) => o.id === active) ?? SEGMENT_OPTIONS[0]

  return (
    <Stack spacing={DASHBOARD_SPACING.field}>
      <ExecutiveSection
        question="Which vertical needs attention?"
        title="Business segments"
        subtitle="One workspace for Marine, Corporate, Retail, and B2B. Synced with the global Segment filter."
      >
        <Stack spacing={1.5}>
          <SegmentSwitcher active={active} onChange={setSegment} />
          <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
            {activeMeta.icon}
            <Typography variant="body2" fontWeight={700}>
              Viewing: {activeMeta.label}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {active === 'all'
                ? 'Comparison across all four verticals'
                : 'Deep-dive — change segment above or in the filter bar'}
            </Typography>
          </Stack>
        </Stack>
      </ExecutiveSection>

      {active === 'all' ? (
        <AllSegmentsView data={data} loading={loading} onSelectSegment={setSegment} />
      ) : null}

      {active === 'marine' ? <MarineSegmentView {...props} /> : null}

      {active === 'corporate' ? (
        <PreviewSegmentView
          vertical="Corporate"
          preview={data.corporatePreview}
          loading={loading}
          entityTitle="Applications by company"
          countryTitle="Applications by country"
          pendingTitle="Pending business visas"
          clientsTitle="Top corporate clients"
          entityChartTitle="By company"
          kpisQuestion="How is Corporate performing?"
        />
      ) : null}

      {active === 'retail' ? (
        <PreviewSegmentView
          vertical="Retail"
          preview={data.retailPreview}
          loading={loading}
          entityTitle="Walk-in · online · jurisdiction mix"
          countryTitle="Top destinations"
          pendingTitle="Payment status & ratings"
          clientsTitle="Destination revenue"
          entityChartTitle="Channel mix"
          kpisQuestion="How is Retail converting?"
        />
      ) : null}

      {active === 'b2b' ? (
        <PreviewSegmentView
          vertical="B2B"
          preview={data.b2bPreview}
          loading={loading}
          entityTitle="Applications by travel partner"
          countryTitle="Applications by country"
          pendingTitle="Partner signals · outstanding"
          clientsTitle="Most active agencies"
          entityChartTitle="By travel partner"
          kpisQuestion="How healthy is the partner channel?"
        />
      ) : null}
    </Stack>
  )
}
