import { useMemo, useState } from 'react'
import { Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, LineChart } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import type { Column, TableState } from '@/design-system/UIComponents'
import {
  ANALYTICS_CHART_HEIGHT,
  AnalyticsPanel,
  TopNSelect,
} from '../components/AnalyticsChrome'
import { AnalyticsKpiGrid } from '../components/AnalyticsKpiGrid'
import { ADMIN_CHART_COLORS } from '../../data/adminChartColors'
import { sliceTopN, type VisaAnalyticsTopN } from '../config/visaAnalyticsConfig'
import type { VisaAnalyticsData, VisaAnalyticsJurisdictionRow } from '../types'

function toBarRows(rows: { label: string; value: number }[]) {
  return rows.map((row) => ({ name: row.label, value: row.value }))
}

function useTopN(initial: VisaAnalyticsTopN = '10') {
  const [topN, setTopN] = useState<VisaAnalyticsTopN>(initial)
  return { topN, setTopN }
}

export function ExecutiveSummarySection({ data }: { data: VisaAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        Instant snapshot of visa business performance — click any KPI to drill down.
      </Typography>
      <AnalyticsKpiGrid items={data.executiveKpis} />
    </Stack>
  )
}

export function VolumeSection({ data }: { data: VisaAnalyticsData }) {
  const country = useTopN('10')
  const client = useTopN('10')
  const countries = sliceTopN(data.volumeByCountry, country.topN)
  const clients = sliceTopN(data.volumeByClient, client.topN)

  return (
    <Grid container spacing={1.5}>
      <Grid size={{ xs: 12, lg: 7 }}>
        <AnalyticsPanel
          title="Visa count by country"
          description="Applications, approval %, and revenue signal"
          action={<TopNSelect value={country.topN} onChange={country.setTopN} />}
        >
          <BarChart
            data={toBarRows(countries)}
            xKey="name"
            bars={[{ key: 'value', label: 'Applications' }]}
            orientation="horizontal"
            height={ANALYTICS_CHART_HEIGHT}
            barSize={14}
            showLegend={false}
          />
        </AnalyticsPanel>
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <AnalyticsPanel
          title="Visa count by segment"
          description="Marine · Corporate · Retail · B2B share"
        >
          <DonutChart
            data={data.volumeBySegment.map((s) => ({
              key: s.id,
              label: s.label,
              value: s.value,
            }))}
            height={ANALYTICS_CHART_HEIGHT}
            centerLabel="apps"
            centerValue={String(
              data.volumeBySegment.reduce((sum, s) => sum + s.value, 0),
            )}
          />
        </AnalyticsPanel>
      </Grid>
      <Grid size={{ xs: 12, lg: 7 }}>
        <AnalyticsPanel
          title="Visa count by client"
          description="Applications by client account"
          action={<TopNSelect value={client.topN} onChange={client.setTopN} />}
        >
          <BarChart
            data={toBarRows(clients)}
            xKey="name"
            bars={[{ key: 'value', label: 'Applications' }]}
            orientation="horizontal"
            height={ANALYTICS_CHART_HEIGHT}
            barSize={14}
            showLegend={false}
          />
        </AnalyticsPanel>
      </Grid>
      <Grid size={{ xs: 12, lg: 5 }}>
        <AnalyticsPanel title="Monthly volume trend" description="Applications and MoM growth">
          <LineChart
            data={data.monthlyVolumeTrend}
            xKey="label"
            lines={[
              { key: 'value', label: 'Applications', color: ADMIN_CHART_COLORS.navy },
              { key: 'secondary', label: 'MoM growth %', color: ADMIN_CHART_COLORS.green },
            ]}
            height={ANALYTICS_CHART_HEIGHT}
          />
        </AnalyticsPanel>
      </Grid>
    </Grid>
  )
}

export function SubmissionSection({ data }: { data: VisaAnalyticsData }) {
  const byCountry = useTopN('10')
  const byJurisdiction = useTopN('10')

  return (
    <Stack spacing={1.25}>
      <AnalyticsKpiGrid items={data.submissionKpis} />
      <Grid container spacing={1.25}>
        <Grid size={{ xs: 12, md: 7 }}>
          <AnalyticsPanel title="Submission trend" description="Daily submission volume">
            <LineChart
              data={data.submissionTrend}
              xKey="label"
              lines={[{ key: 'value', label: 'Submitted' }]}
              height={ANALYTICS_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <AnalyticsPanel title="Submission status" description="Pipeline mix">
            <DonutChart
              data={data.submissionStatus.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={ANALYTICS_CHART_HEIGHT}
              showLegend
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Submission by country"
            action={<TopNSelect value={byCountry.topN} onChange={byCountry.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.submissionByCountry, byCountry.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Submitted' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Submission by jurisdiction"
            action={<TopNSelect value={byJurisdiction.topN} onChange={byJurisdiction.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.submissionByJurisdiction, byJurisdiction.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Submitted' }]}
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

export function CollectionSection({ data }: { data: VisaAnalyticsData }) {
  const byJurisdiction = useTopN('10')

  return (
    <Stack spacing={1.25}>
      <AnalyticsKpiGrid items={data.collectionKpis} />
      <Grid container spacing={1.25}>
        <Grid size={{ xs: 12, md: 5 }}>
          <AnalyticsPanel title="Collection status">
            <DonutChart
              data={data.collectionStatus.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={ANALYTICS_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <AnalyticsPanel title="Collection trend" description="Daily collection volume">
            <LineChart
              data={data.collectionTrend}
              xKey="label"
              lines={[{ key: 'value', label: 'Collected' }]}
              height={ANALYTICS_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel
            title="Collection by jurisdiction"
            action={<TopNSelect value={byJurisdiction.topN} onChange={byJurisdiction.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.collectionByJurisdiction, byJurisdiction.topN))}
              xKey="name"
              bars={[{ key: 'value', label: 'Collected' }]}
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

export function DispatchSection({ data }: { data: VisaAnalyticsData }) {
  const courierTopN = useTopN('10')

  return (
    <Stack spacing={1.25}>
      <AnalyticsKpiGrid items={data.dispatchKpis} />
      <Grid container spacing={1.25}>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Dispatch mode">
            <DonutChart
              data={data.dispatchMode.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={ANALYTICS_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <AnalyticsPanel title="Dispatch trend">
            <LineChart
              data={data.dispatchTrend}
              xKey="label"
              lines={[{ key: 'value', label: 'Dispatched' }]}
              height={ANALYTICS_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel
            title="Courier performance"
            description="Shipments · delivery SLA % · delayed"
            action={<TopNSelect value={courierTopN.topN} onChange={courierTopN.setTopN} />}
          >
            <BarChart
              data={sliceTopN(data.courierPerformance, courierTopN.topN).map((row) => ({
                name: row.label,
                shipments: row.value,
                sla: row.secondary,
                delayed: row.tertiary,
              }))}
              xKey="name"
              bars={[
                { key: 'shipments', label: 'Shipments', color: ADMIN_CHART_COLORS.navy },
                { key: 'sla', label: 'Delivery SLA %', color: ADMIN_CHART_COLORS.green },
                { key: 'delayed', label: 'Delayed', color: ADMIN_CHART_COLORS.coral },
              ]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={12}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

const JURISDICTION_COLUMNS: Column<VisaAnalyticsJurisdictionRow>[] = [
  {
    key: 'jurisdiction',
    label: 'Jurisdiction',
    widthSize: 'lg',
    sortable: true,
    filterable: true,
    searchable: true,
  },
  { key: 'submitted', label: 'Submitted', widthSize: 'sm', sortable: true, filterable: true },
  { key: 'pending', label: 'Pending', widthSize: 'sm', sortable: true, filterable: true },
  { key: 'completed', label: 'Completed', widthSize: 'sm', sortable: true, filterable: true },
  { key: 'delayed', label: 'Delayed', widthSize: 'sm', sortable: true, filterable: true },
  {
    key: 'slaPercent',
    label: 'SLA %',
    widthSize: 'sm',
    sortable: true,
    filterable: true,
    render: (value: number) => `${value}%`,
  },
]

/** Pan India performance rolled up by Jurisdiction Master. */
export function JurisdictionsSection({ data }: { data: VisaAnalyticsData }) {
  const ranking = useTopN('10')
  const [tableState, setTableState] = useState<TableState>({
    page: 0,
    pageSize: 10,
    sortKey: null,
    sortDirection: 'asc',
    filters: [],
    searchQuery: '',
    columnSearch: {},
    selectedRows: [],
    expandedRows: [],
    hiddenColumnKeys: [],
  })
  const [columnFilters, setColumnFilters] = useState<Record<string, string[]>>({})

  const jurisdictions = useMemo(() => {
    return sliceTopN(
      [...data.panIndiaJurisdictions].sort((a, b) => b.submitted - a.submitted),
      ranking.topN,
    )
  }, [data.panIndiaJurisdictions, ranking.topN])

  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        Which jurisdictions carry volume and SLA risk.
      </Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel
            title="Submitted by jurisdiction"
            description="Highest volume processing loci"
            action={<TopNSelect value={ranking.topN} onChange={ranking.setTopN} />}
          >
            <BarChart
              data={toBarRows(
                jurisdictions.map((row) => ({
                  label: row.jurisdiction,
                  value: row.submitted,
                })),
              )}
              xKey="name"
              bars={[{ key: 'value', label: 'Submitted' }]}
              orientation="horizontal"
              height={ANALYTICS_CHART_HEIGHT}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel title="Jurisdiction performance">
            <AdminListingTable
              columns={JURISDICTION_COLUMNS}
              data={data.panIndiaJurisdictions}
              filterSourceData={data.panIndiaJurisdictions}
              rowKey="id"
              state={tableState}
              onStateChange={setTableState}
              columnFilters={columnFilters}
              onColumnFiltersChange={setColumnFilters}
              getCellValue={(row, key) =>
                String(row[key as keyof VisaAnalyticsJurisdictionRow] ?? '')
              }
              enableColumnSort
              enableColumnFilters
              stickyHeader
              emptyTitle="No jurisdiction data"
              emptyDescription="Jurisdiction performance appears when cases are tagged to Jurisdiction Master."
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

/** @deprecated Use JurisdictionsSection — city axis replaced by jurisdiction. */
export function PanIndiaSection({ data }: { data: VisaAnalyticsData }) {
  return <JurisdictionsSection data={data} />
}
