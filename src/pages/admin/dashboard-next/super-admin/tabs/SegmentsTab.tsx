import type { ReactNode } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import { Box, Divider, Grid, Stack } from '@mui/material'
import { alpha } from '@mui/material/styles'
import {
  Anchor,
  Briefcase,
  Ship,
  Store,
} from 'lucide-react'
import { useSearchParams } from 'react-router-dom'
import { Button, Select } from '@/design-system/UIComponents'
import {
  MarineTimeline,
  DASHBOARD_SPACING,
} from '../../shared'
import { useDashboardFiltersOptional } from '../../shared/dashboard-intelligence'
import { ExecutiveSection } from '../../shared/dashboard-ui-kit'
import { SegmentCommercialKpiStrip } from '../components/SegmentCommercialKpiStrip'
import { SegmentAcquisitionFunnel } from '../components/SegmentAcquisitionFunnel'
import { SegmentDestinationIntelligenceSection } from '../components/SegmentDestinationIntelligenceTable'
import { SegmentNetRevenuePerSuccessfulApp } from '../components/SegmentNetRevenuePerSuccessfulApp'
import { SegmentDestinationMixChart } from '../components/SegmentDestinationMixChart'
import {
  SuperAdminRankChart,
  SuperAdminSection,
} from '../components/SuperAdminChrome'
import { SUPER_ADMIN_COUNTRY_OPTIONS } from '../data/superAdminDashboardMock'
import {
  applyMarineSegmentCountryScope,
  applyVerticalPreviewCountryScope,
  normalizeSegmentCountry,
  type SegmentCountryKey,
} from '../utils/applySegmentCountryScope'
import type {
  SuperAdminDashboardTabProps,
  SuperAdminDestinationMixItem,
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

function SegmentDestinationFilter({
  value,
  onChange,
}: {
  value: SegmentCountryKey
  onChange: (next: SegmentCountryKey) => void
}) {
  return (
    <Box sx={{ width: { xs: '100%', sm: 160 }, flexShrink: 0 }}>
      <Select
        size="sm"
        fullWidth
        aria-label="Destination country scope"
        value={value}
        options={[...SUPER_ADMIN_COUNTRY_OPTIONS]}
        onChange={(next) => onChange(normalizeSegmentCountry(String(next)))}
      />
    </Box>
  )
}

function MixCharts({
  entityTitle,
  entityItems,
  destinationTitle = 'By destination',
  destinationItems,
  loading,
}: {
  entityTitle: string
  entityItems: SuperAdminRankItem[]
  destinationTitle?: string
  destinationItems: SuperAdminDestinationMixItem[]
  loading?: boolean
}) {
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
        <SegmentDestinationMixChart
          title={destinationTitle}
          items={destinationItems}
          loading={loading}
        />
      </Grid>
    </Grid>
  )
}

function MarineSegmentView({
  data,
  loading,
  onRetry,
  onNavigate,
  country,
}: SuperAdminDashboardTabProps & { country: SegmentCountryKey }) {
  const scoped = useMemo(
    () => applyMarineSegmentCountryScope(data, country),
    [data, country],
  )

  return (
    <Stack spacing={DASHBOARD_SPACING.section} divider={<Divider flexItem />}>
      <ExecutiveSection title="Commercial KPIs">
        <SegmentCommercialKpiStrip
          data={scoped.marineCommercialKpis}
          loading={loading}
        />
      </ExecutiveSection>

      <ExecutiveSection
        title="Acquisition funnel"
        subtitle="Lead → quotation → agreement → client account"
      >
        <SegmentAcquisitionFunnel
          data={scoped.marineAcquisitionFunnel}
          loading={loading}
          onNavigate={onNavigate}
        />
      </ExecutiveSection>

      <ExecutiveSection title="Applications mix">
        <MixCharts
          entityTitle="By shipping company"
          entityItems={scoped.marineByCompany}
          destinationTitle="By destination"
          destinationItems={scoped.marineByDestination}
          loading={loading}
        />
      </ExecutiveSection>

      <ExecutiveSection title="Joining-date risk">
        <MarineTimeline
          title="Joining date & crew risk"
          rows={[...scoped.marineTimeline].sort((a, b) => {
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
          items={scoped.pendingCrewVisas}
          loading={loading}
          valueLabel="Priority"
          initialTopN="5"
        />
      </ExecutiveSection>
    </Stack>
  )
}

function PreviewSegmentView({
  preview,
  loading,
  pendingTitle,
  clientsTitle,
  entityChartTitle,
  funnelSubtitle,
  onNavigate,
  country,
  showTopClients = true,
  showQueues = true,
  showDestinationAnalytics = false,
  repeatLabel = 'Repeat accounts',
  repeatTooltip = 'Share of applications from existing active client accounts.',
}: {
  preview: SuperAdminVerticalPreview
  loading?: boolean
  pendingTitle: string
  clientsTitle: string
  entityChartTitle: string
  funnelSubtitle: string
  onNavigate?: (href: string) => void
  country: SegmentCountryKey
  /** Hide when destination revenue is already in the mix pie (Retail). */
  showTopClients?: boolean
  /** Hide queues / pending chart section (Retail). */
  showQueues?: boolean
  /** Destination intelligence table + revenue per successful application (Retail). */
  showDestinationAnalytics?: boolean
  repeatLabel?: string
  repeatTooltip?: string
}) {
  const scoped = useMemo(
    () => applyVerticalPreviewCountryScope(preview, country),
    [preview, country],
  )

  return (
    <Stack spacing={DASHBOARD_SPACING.section} divider={<Divider flexItem />}>
      <ExecutiveSection title="Commercial KPIs">
        <SegmentCommercialKpiStrip
          data={scoped.commercialKpis}
          loading={loading}
          repeatLabel={repeatLabel}
          repeatTooltip={repeatTooltip}
        />
      </ExecutiveSection>

      <ExecutiveSection title="Acquisition funnel" subtitle={funnelSubtitle}>
        <SegmentAcquisitionFunnel
          data={scoped.acquisitionFunnel}
          loading={loading}
          onNavigate={onNavigate}
        />
      </ExecutiveSection>

      <ExecutiveSection title="Applications mix">
        <MixCharts
          entityTitle={entityChartTitle}
          entityItems={scoped.byEntity}
          destinationTitle="By destination"
          destinationItems={scoped.byDestination}
          loading={loading}
        />
      </ExecutiveSection>

      {showDestinationAnalytics ? (
        <>
          <SegmentDestinationIntelligenceSection
            items={scoped.byDestination}
            loading={loading}
          />

          <SegmentNetRevenuePerSuccessfulApp
            items={scoped.byDestination}
            loading={loading}
          />
        </>
      ) : null}

      {showQueues ? (
        <ExecutiveSection title={showTopClients ? 'Queues & accounts' : 'Queues'}>
          <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
            <Grid size={{ xs: 12, md: showTopClients ? 6 : 12 }}>
              <SuperAdminRankChart
                title={pendingTitle}
                items={scoped.pending}
                loading={loading}
                valueLabel="Priority"
                initialTopN="5"
              />
            </Grid>
            {showTopClients ? (
              <Grid size={{ xs: 12, md: 6 }}>
                <SuperAdminRankChart
                  title={clientsTitle}
                  items={scoped.topClients}
                  loading={loading}
                  valueLabel="Revenue"
                />
              </Grid>
            ) : null}
          </Grid>
        </ExecutiveSection>
      ) : null}
    </Stack>
  )
}

/** Unified Marine · Corporate · Retail · B2B — driven by global segment filter. */
export function SegmentsTab(props: SuperAdminDashboardTabProps) {
  const { data, loading } = props
  const filterCtx = useDashboardFiltersOptional()
  const [searchParams, setSearchParams] = useSearchParams()
  const active = normalizeSegment(filterCtx?.filters.segment ?? searchParams.get('segment') ?? 'marine')
  const country = normalizeSegmentCountry(filterCtx?.filters.country)
  const appliedUrlSegment = useRef<string | null>(null)

  const setCountry = (next: SegmentCountryKey) => {
    filterCtx?.setFilter('country', next)
  }

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

  return (
    <Stack spacing={DASHBOARD_SPACING.section} divider={<Divider flexItem />}>
      <SuperAdminSection
        title="Business segments"
        description="One workspace for Marine, Corporate, Retail, and B2B"
        action={
          <SegmentDestinationFilter value={country} onChange={setCountry} />
        }
      >
        <SegmentSwitcher active={active} onChange={setSegment} />
      </SuperAdminSection>

      {active === 'marine' ? <MarineSegmentView {...props} country={country} /> : null}

      {active === 'corporate' ? (
        <PreviewSegmentView
          preview={data.corporatePreview}
          loading={loading}
          country={country}
          pendingTitle="Pending business visas"
          clientsTitle="Top corporate clients"
          entityChartTitle="By company"
          funnelSubtitle="Lead → quotation → agreement → client account"
          onNavigate={props.onNavigate}
        />
      ) : null}

      {active === 'retail' ? (
        <PreviewSegmentView
          preview={data.retailPreview}
          loading={loading}
          country={country}
          pendingTitle="Payment status & ratings"
          clientsTitle="Destination revenue"
          entityChartTitle="Channel mix"
          funnelSubtitle="Lead → quotation → shared → converted"
          onNavigate={props.onNavigate}
          showTopClients={false}
          showQueues={false}
          showDestinationAnalytics
          repeatLabel="Repeat customers"
          repeatTooltip="Share of applications from applicants who used GLTS before."
        />
      ) : null}

      {active === 'b2b' ? (
        <PreviewSegmentView
          preview={data.b2bPreview}
          loading={loading}
          country={country}
          pendingTitle="Partner signals · outstanding"
          clientsTitle="Most active agencies"
          entityChartTitle="By travel partner"
          funnelSubtitle="Lead → quotation → agreement → client account"
          onNavigate={props.onNavigate}
        />
      ) : null}
    </Stack>
  )
}
