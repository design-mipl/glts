import { useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, LineChart, PieChart } from '@/design-system/UIComponents'
import { AnalyticsPanel, TopNSelect } from '../components/AnalyticsChrome'
import { AnalyticsKpiGrid } from '../components/AnalyticsKpiGrid'
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
  const clients = useTopN('10')
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.refusalKpis} columns={3} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Refusal by country">
            <BarChart
              data={toBarRows(data.refusalByCountry)}
              xKey="name"
              bars={[{ key: 'value', label: 'Refusals' }]}
              orientation="horizontal"
              height={240}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Refusal by embassy">
            <BarChart
              data={toBarRows(data.refusalByEmbassy)}
              xKey="name"
              bars={[{ key: 'value', label: 'Refusals' }]}
              orientation="horizontal"
              height={240}
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
              height={240}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Refusal by staff" description="Count and error %">
            <BarChart
              data={data.refusalByStaff.map((row) => ({
                name: row.label,
                refusals: row.value,
                errorPct: row.secondary,
              }))}
              xKey="name"
              bars={[
                { key: 'refusals', label: 'Refusals' },
                { key: 'errorPct', label: 'Error %' },
              ]}
              orientation="horizontal"
              height={240}
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
              height={240}
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
              height={220}
              centerLabel="%"
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function ApprovalSection({ data }: { data: VisaAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.approvalKpis} columns={3} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Approval by country">
            <BarChart
              data={toBarRows(data.approvalByCountry)}
              xKey="name"
              bars={[{ key: 'value', label: 'Approved' }]}
              orientation="horizontal"
              height={240}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Approval by client">
            <BarChart
              data={toBarRows(data.approvalByClient)}
              xKey="name"
              bars={[{ key: 'value', label: 'Approved' }]}
              orientation="horizontal"
              height={240}
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
              height={240}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function SlaSection({ data }: { data: VisaAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.slaKpis} columns={3} />
      <AnalyticsPanel title="Average processing time by stage" description="Hours across pipeline">
        <Grid container spacing={1.25}>
          {data.processingStageTimes.map((stage) => (
            <Grid key={stage.id} size={{ xs: 6, sm: 4, md: 3 }}>
              <Stack
                spacing={0.5}
                sx={{
                  p: 1.5,
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 2,
                  height: '100%',
                }}
              >
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
                  {stage.label}
                </Typography>
                <Typography fontWeight={800} sx={{ fontSize: 20 }}>
                  {stage.hours}h
                </Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </AnalyticsPanel>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="SLA by country" description="Compliance %">
            <BarChart
              data={toBarRows(data.slaByCountry)}
              xKey="name"
              bars={[{ key: 'value', label: 'SLA %' }]}
              orientation="horizontal"
              height={240}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="SLA by client">
            <BarChart
              data={toBarRows(data.slaByClient)}
              xKey="name"
              bars={[{ key: 'value', label: 'SLA %' }]}
              orientation="horizontal"
              height={240}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="SLA by branch">
            <BarChart
              data={toBarRows(data.slaByBranch)}
              xKey="name"
              bars={[{ key: 'value', label: 'SLA %' }]}
              orientation="horizontal"
              height={240}
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
              height={240}
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
    <Stack spacing={1.5}>
      <Stack direction="row" justifyContent="flex-end">
        <TopNSelect value={topN.topN} onChange={topN.setTopN} ariaLabel="Business ranking limit" />
      </Stack>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Top countries" description="Applications · approval · SLA · revenue">
            <BarChart
              data={toBarRows(sliceTopN(data.topCountries, topN.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Applications' }]}
              orientation="horizontal"
              height={240}
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
              height={240}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Top branches">
            <BarChart
              data={toBarRows(sliceTopN(data.topBranches, topN.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Applications' }]}
              orientation="horizontal"
              height={220}
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
              height={220}
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
              height={200}
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
              height={200}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Bottom branches">
            <BarChart
              data={toBarRows(data.bottomBranches)}
              xKey="name"
              bars={[{ key: 'value', label: 'SLA %' }]}
              orientation="horizontal"
              height={200}
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
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.revenueKpis} columns={3} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Revenue by country" description="₹ Lakhs">
            <BarChart
              data={toBarRows(data.revenueByCountry)}
              xKey="name"
              bars={[{ key: 'value', label: '₹ Lakh' }]}
              height={240}
              barSize={22}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Revenue by client" description="₹ Lakhs">
            <BarChart
              data={toBarRows(data.revenueByClient)}
              xKey="name"
              bars={[{ key: 'value', label: '₹ Lakh' }]}
              orientation="horizontal"
              height={240}
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
              height={220}
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
              height={220}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Month-over-month growth" description="% change">
            <LineChart
              data={data.momGrowthTrend}
              xKey="label"
              lines={[{ key: 'value', label: 'MoM %' }]}
              height={220}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}
