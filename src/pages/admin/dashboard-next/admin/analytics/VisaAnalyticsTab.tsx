import { useState } from 'react'
import { Box, Divider, Grid, Stack, Typography } from '@mui/material'
import { BarChart, Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { DASHBOARD_SPACING } from '../../shared'
import {
  VISA_ANALYTICS_SECTION_TABS,
  sliceTopN,
  type VisaAnalyticsSectionId,
  type VisaAnalyticsTopN,
} from './config/visaAnalyticsConfig'
import { VISA_ANALYTICS_MOCK } from './data/visaAnalyticsMock'
import { TopNSelect } from './components/AnalyticsChrome'
import {
  CollectionSection,
  DispatchSection,
  JurisdictionsSection,
  SubmissionSection,
} from './sections/PrimarySections'
import {
  ApprovalSection,
  RefusalSection,
  SlaSection,
} from './sections/QualitySections'

export interface VisaAnalyticsTabProps {
  loading?: boolean
}

function StageBlock({
  title,
  description,
  children,
  showDivider = false,
}: {
  title: string
  description?: string
  children: React.ReactNode
  showDivider?: boolean
}) {
  return (
    <Stack spacing={1.25}>
      {showDivider ? <Divider /> : null}
      <Box>
        <Typography variant="h6" fontWeight={700} sx={{ fontSize: 16, lineHeight: 1.3 }}>
          {title}
        </Typography>
        {description ? (
          <Typography variant="body2" color="text.secondary" sx={{ fontSize: 12, mt: 0.25 }}>
            {description}
          </Typography>
        ) : null}
      </Box>
      {children}
    </Stack>
  )
}

/**
 * Visa Analytics deep-dive — one focus at a time.
 * Executive snapshot lives on Admin Overview (thin strip only).
 * Pipeline / Outcomes stack stages separated by dividers (no nested tabs or containers).
 */
export function VisaAnalyticsTab({ loading = false }: VisaAnalyticsTabProps) {
  const colors = usePublicBrandColors()
  const [section, setSection] = useState<VisaAnalyticsSectionId>('pipeline')
  const data = VISA_ANALYTICS_MOCK

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1.25 }}>
        <ExecutiveSectionHeader
          title="Visa Analytics"
          description="One focus at a time — pipeline, outcomes, SLA, or jurisdiction."
        />
      </Box>

      <Box
        sx={{
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Tabs
          value={section}
          onChange={(value) => setSection(value as VisaAnalyticsSectionId)}
          variant="underline"
          size="sm"
          items={VISA_ANALYTICS_SECTION_TABS.map((tab) => ({
            value: tab.value,
            label: tab.label,
          }))}
        />
      </Box>

      <Box sx={{ p: 2 }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading visa analytics…
          </Typography>
        ) : (
          <Stack spacing={DASHBOARD_SPACING.field}>
            {section === 'pipeline' ? (
              <Stack spacing={2}>
                <StageBlock
                  title="Submission"
                  description="Volume submitted into embassy / VFS pipelines"
                >
                  <SubmissionSection data={data} />
                </StageBlock>
                <StageBlock
                  title="Collection"
                  description="Passports and visas collected from missions"
                  showDivider
                >
                  <CollectionSection data={data} />
                </StageBlock>
                <StageBlock
                  title="Dispatch"
                  description="Outbound courier and delivery performance"
                  showDivider
                >
                  <DispatchSection data={data} />
                </StageBlock>
              </Stack>
            ) : null}

            {section === 'outcomes' ? (
              <Stack spacing={2}>
                <StageBlock
                  title="Refusal"
                  description="Refusal volume, reasons, and risk drivers"
                >
                  <RefusalSection data={data} />
                </StageBlock>
                <StageBlock
                  title="Approval"
                  description="Approval volume and rate trends"
                  showDivider
                >
                  <ApprovalSection data={data} />
                </StageBlock>
              </Stack>
            ) : null}

            {section === 'sla' ? <SlaSection data={data} /> : null}
            {section === 'jurisdictions' ? <JurisdictionsSection data={data} /> : null}
          </Stack>
        )}
      </Box>
    </Box>
  )
}

/**
 * Thin Overview strip — answers: “How is visa business doing?”
 * 4 KPIs + one ranking chart. Deep dive stays on Visa Analytics.
 */
export function VisaAnalyticsOverviewSnapshot({
  loading = false,
  onOpenAnalytics,
}: {
  loading?: boolean
  onOpenAnalytics?: () => void
}) {
  const colors = usePublicBrandColors()
  const data = VISA_ANALYTICS_MOCK
  const [volumeTopN, setVolumeTopN] = useState<VisaAnalyticsTopN>('5')

  const snapshotKpis = [
    data.executiveKpis.find((k) => k.id === 'total-apps'),
    data.executiveKpis.find((k) => k.id === 'approval-rate'),
    data.executiveKpis.find((k) => k.id === 'refusal-rate'),
    data.executiveKpis.find((k) => k.id === 'sla'),
  ].filter(Boolean)

  const topCountries = sliceTopN(data.topCountries, volumeTopN).map((row) => ({
    name: row.label,
    value: row.value,
  }))

  const byJurisdiction = sliceTopN(data.submissionByJurisdiction, volumeTopN).map((row) => ({
    name: row.label,
    value: row.value,
  }))

  const revenueKpi =
    data.revenueKpis.find((k) => k.id === 'rev-mtd') ?? data.revenueKpis[0]

  if (loading) {
    return (
      <Box sx={{ ...executiveCardLevel2Sx(colors), p: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Loading visa snapshot…
        </Typography>
      </Box>
    )
  }

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1.25 }}>
        <ExecutiveSectionHeader
          title="Visa performance"
          description="Applications, approval, refusal, and SLA — open analytics for pipeline detail."
          actionLabel={onOpenAnalytics ? 'Open Visa Analytics' : undefined}
          onAction={onOpenAnalytics}
        />
      </Box>

      <Box sx={{ px: 2, pb: 2 }}>
        <Grid container spacing={DASHBOARD_SPACING.field} alignItems="stretch">
          <Grid size={{ xs: 12, lg: 5 }}>
            <Stack spacing={1.25} sx={{ height: '100%' }}>
              <Grid container spacing={1}>
                {snapshotKpis.map((kpi) =>
                  kpi ? (
                    <Grid key={kpi.id} size={{ xs: 6 }}>
                      <Box
                        sx={{
                          p: 1.5,
                          borderRadius: '10px',
                          border: '1px solid',
                          borderColor: 'divider',
                          height: '100%',
                        }}
                      >
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          fontWeight={600}
                          sx={{ fontSize: 11 }}
                        >
                          {kpi.label}
                        </Typography>
                        <Typography
                          sx={{
                            mt: 0.5,
                            fontSize: 20,
                            fontWeight: 700,
                            letterSpacing: '-0.02em',
                            lineHeight: 1.15,
                          }}
                        >
                          {kpi.value}
                        </Typography>
                      </Box>
                    </Grid>
                  ) : null,
                )}
              </Grid>
              {revenueKpi ? (
                <Box
                  sx={{
                    px: 1.5,
                    py: 1.25,
                    borderRadius: '10px',
                    border: '1px solid',
                    borderColor: 'divider',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: 1,
                  }}
                >
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ fontSize: 12 }}>
                    {revenueKpi.label}
                  </Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 700 }}>{revenueKpi.value}</Typography>
                </Box>
              ) : null}
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 7 }}>
            <Stack spacing={1.25} sx={{ height: '100%' }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: 'divider',
                  minHeight: 200,
                }}
              >
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  alignItems={{ xs: 'stretch', sm: 'flex-start' }}
                  justifyContent="space-between"
                  spacing={1}
                  sx={{ mb: 1 }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                      Volume concentrate
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                      Top destination countries by applications
                    </Typography>
                  </Box>
                  <TopNSelect
                    value={volumeTopN}
                    onChange={setVolumeTopN}
                    ariaLabel="Volume concentrate ranking limit"
                  />
                </Stack>
                <BarChart
                  data={topCountries}
                  xKey="name"
                  bars={[{ key: 'value', label: 'Applications' }]}
                  orientation="horizontal"
                  height={160}
                  barSize={14}
                  showLegend={false}
                />
              </Box>

              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '10px',
                  border: '1px solid',
                  borderColor: 'divider',
                  minHeight: 200,
                }}
              >
                <Box sx={{ mb: 1 }}>
                  <Typography variant="subtitle2" fontWeight={700} sx={{ fontSize: 13 }}>
                    Submission by jurisdiction
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                    Applications by VFS / consulate desk
                  </Typography>
                </Box>
                <BarChart
                  data={byJurisdiction}
                  xKey="name"
                  bars={[{ key: 'value', label: 'Submitted' }]}
                  orientation="horizontal"
                  height={160}
                  barSize={14}
                  showLegend={false}
                />
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}
