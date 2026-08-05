import { useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, LineChart, PieChart } from '@/design-system/UIComponents'
import {
  ANALYTICS_CHART_HEIGHT,
  AnalyticsPanel,
  TopNSelect,
} from '../components/AnalyticsChrome'
import { AnalyticsKpiGrid } from '../components/AnalyticsKpiGrid'
import { ADMIN_CHART_COLORS } from '../../data/adminChartColors'
import { sliceTopN, type VisaAnalyticsTopN } from '../config/visaAnalyticsConfig'
import type { VisaAnalyticsData } from '../types'

function toBarRows(rows: { label: string; value: number }[]) {
  return rows.map((row) => ({ name: row.label, value: row.value }))
}

function useTopN(initial: VisaAnalyticsTopN = '10') {
  const [topN, setTopN] = useState<VisaAnalyticsTopN>(initial)
  return { topN, setTopN }
}

export function RefusalSection({ data }: { data: VisaAnalyticsData }) {
  const byCountry = useTopN('10')
  const byEmbassy = useTopN('10')
  const clients = useTopN('10')
  const byStaff = useTopN('10')

  return (
    <Stack spacing={1.25}>
      <AnalyticsKpiGrid items={data.refusalKpis} />
      <Grid container spacing={1.25}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Refusal by country"
            action={<TopNSelect value={byCountry.topN} onChange={byCountry.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.refusalByCountry, byCountry.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Refusals' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Refusal by embassy"
            action={<TopNSelect value={byEmbassy.topN} onChange={byEmbassy.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.refusalByEmbassy, byEmbassy.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Refusals' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Refusal by client"
            action={<TopNSelect value={clients.topN} onChange={clients.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.refusalByClient, clients.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Refusals' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Refusal by staff"
            description="Count and error %"
            action={<TopNSelect value={byStaff.topN} onChange={byStaff.setTopN} />}
          >
            <BarChart
              data={sliceTopN(data.refusalByStaff, byStaff.topN).map((row) => ({
                name: row.label,
                refusals: row.value,
                errorPct: row.secondary,
              }))}
              xKey="name"
              bars={[
                { key: 'refusals', label: 'Refusals', color: ADMIN_CHART_COLORS.coral },
                { key: 'errorPct', label: 'Error %', color: ADMIN_CHART_COLORS.amber },
              ]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={12}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <AnalyticsPanel title="Refusal reasons">
            <PieChart
              data={data.refusalReasons.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={ANALYTICS_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <AnalyticsPanel title="Client profile refusal" description="Refusal % by segment">
            <DonutChart
              data={data.refusalBySegment.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={ANALYTICS_CHART_HEIGHT}
              centerLabel="%"
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function ApprovalSection({ data }: { data: VisaAnalyticsData }) {
  const byCountry = useTopN('10')
  const byClient = useTopN('10')

  return (
    <Stack spacing={1.25}>
      <AnalyticsKpiGrid items={data.approvalKpis} />
      <Grid container spacing={1.25}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Approval by country"
            action={<TopNSelect value={byCountry.topN} onChange={byCountry.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.approvalByCountry, byCountry.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Approved' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Approval by client"
            action={<TopNSelect value={byClient.topN} onChange={byClient.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.approvalByClient, byClient.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Approved' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <AnalyticsPanel title="Approval trend" description="Monthly approval rate %">
            <LineChart
              data={data.approvalTrend}
              xKey="label"
              lines={[{ key: 'value', label: 'Approval rate %' }]}
              height={ANALYTICS_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function SlaSection({ data }: { data: VisaAnalyticsData }) {
  const byCountry = useTopN('10')
  const byClient = useTopN('10')
  const byJurisdiction = useTopN('10')

  return (
    <Stack spacing={1.25}>
      <AnalyticsKpiGrid items={data.slaKpis} />
      <AnalyticsPanel title="Average processing time by stage" description="Hours across pipeline">
        <Grid container spacing={1.25}>
          {data.processingStageTimes.map((stage) => (
            <Grid key={stage.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <Stack
                spacing={0.5}
                sx={{
                  p: 1.25,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  height: '100%',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  {stage.label}
                </Typography>
                <Typography fontWeight={800} sx={{ fontSize: 18 }}>
                  {stage.hours}h
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </AnalyticsPanel>
      <Grid container spacing={1.25}>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel
            title="SLA by country"
            description="Compliance %"
            action={<TopNSelect value={byCountry.topN} onChange={byCountry.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.slaByCountry, byCountry.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'SLA %' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel
            title="SLA by client"
            action={<TopNSelect value={byClient.topN} onChange={byClient.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.slaByClient, byClient.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'SLA %' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel
            title="SLA by jurisdiction"
            action={<TopNSelect value={byJurisdiction.topN} onChange={byJurisdiction.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.slaByJurisdiction, byJurisdiction.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'SLA %' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel title="Processing time trend" description="Average days">
            <LineChart
              data={data.processingTimeTrend}
              xKey="label"
              lines={[{ key: 'value', label: 'Avg days' }]}
              height={ANALYTICS_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function RankingsSection({ data }: { data: VisaAnalyticsData }) {
  const topN = useTopN('10')
  return (
    <Stack spacing={1.25}>
      <Stack direction="row" justifyContent="flex-end">
        <TopNSelect value={topN.topN} onChange={topN.setTopN} ariaLabel="Business ranking limit" />
      </Stack>
      <Grid container spacing={1.25}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Top countries" description="Applications · approval · SLA · revenue">
            <BarChart
              data={toBarRows(sliceTopN(data.topCountries, topN.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Applications' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Top clients">
            <BarChart
              data={toBarRows(sliceTopN(data.topClients, topN.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Applications' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Top jurisdictions">
            <BarChart
              data={toBarRows(sliceTopN(data.topJurisdictions, topN.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Applications' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Top submission cities">
            <BarChart
              data={toBarRows(sliceTopN(data.topSubmissionCities, topN.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Applications' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Bottom countries" description="Intervention needed">
            <BarChart
              data={toBarRows(data.bottomCountries)}
              xKey="name"
              bars={[{ key: 'value', label: 'SLA %' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Bottom clients">
            <BarChart
              data={toBarRows(data.bottomClients)}
              xKey="name"
              bars={[{ key: 'value', label: 'Approval %' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Bottom jurisdictions">
            <BarChart
              data={toBarRows(data.bottomJurisdictions)}
              xKey="name"
              bars={[{ key: 'value', label: 'SLA %' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function RevenueSection({ data }: { data: VisaAnalyticsData }) {
  const byCountry = useTopN('10')
  const byClient = useTopN('10')

  return (
    <Stack spacing={1.25}>
      <AnalyticsKpiGrid items={data.revenueKpis} />
      <Grid container spacing={1.25}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Revenue by country"
            description="₹ Lakhs"
            action={<TopNSelect value={byCountry.topN} onChange={byCountry.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.revenueByCountry, byCountry.topN))}
              xKey="name"
              bars={[{ key: 'value', label: '₹ Lakh' }]}
              height={ANALYTICS_CHART_HEIGHT}
              barSize={22}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Revenue by client"
            description="₹ Lakhs"
            action={<TopNSelect value={byClient.topN} onChange={byClient.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.revenueByClient, byClient.topN))}
              xKey="name"
              bars={[{ key: 'value', label: '₹ Lakh' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Revenue by segment">
            <DonutChart
              data={data.revenueBySegment.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={ANALYTICS_CHART_HEIGHT}
              centerLabel="share"
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Revenue trend" description="₹ Lakhs monthly">
            <LineChart
              data={data.revenueTrend}
              xKey="label"
              lines={[{ key: 'value', label: 'Revenue' }]}
              height={ANALYTICS_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Month-over-month growth" description="% change">
            <LineChart
              data={data.momGrowthTrend}
              xKey="label"
              lines={[{ key: 'value', label: 'MoM %' }]}
              height={ANALYTICS_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}
