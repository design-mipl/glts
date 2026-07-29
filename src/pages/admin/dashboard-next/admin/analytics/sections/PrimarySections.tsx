import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, LineChart, Tabs } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import type { Column, TableState } from '@/design-system/UIComponents'
import { AnalyticsPanel, TopNSelect } from '../components/AnalyticsChrome'
import { AnalyticsKpiGrid } from '../components/AnalyticsKpiGrid'
import { sliceTopN, type VisaAnalyticsTopN } from '../config/visaAnalyticsConfig'
import type { VisaAnalyticsCityRow, VisaAnalyticsData } from '../types'

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
      <AnalyticsKpiGrid items={data.executiveKpis} columns={4} />
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
            height={280}
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
            height={260}
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
            height={280}
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
              { key: 'value', label: 'Applications' },
              { key: 'secondary', label: 'MoM growth %' },
            ]}
            height={260}
          />
        </AnalyticsPanel>
      </Grid>
    </Grid>
  )
}

export function SubmissionSection({ data }: { data: VisaAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.submissionKpis} columns={3} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 7 }}>
          <AnalyticsPanel title="Submission trend" description="Daily submission volume">
            <LineChart
              data={data.submissionTrend}
              xKey="label"
              lines={[{ key: 'value', label: 'Submitted' }]}
              height={240}
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
              height={220}
              showLegend
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Submission by country">
            <BarChart
              data={toBarRows(data.submissionByCountry)}
              xKey="name"
              bars={[{ key: 'value', label: 'Submitted' }]}
              orientation="horizontal"
              height={240}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Submission by branch">
            <BarChart
              data={toBarRows(data.submissionByBranch)}
              xKey="name"
              bars={[{ key: 'value', label: 'Submitted' }]}
              height={240}
              barSize={22}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function CollectionSection({ data }: { data: VisaAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.collectionKpis} columns={3} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 5 }}>
          <AnalyticsPanel title="Collection status">
            <DonutChart
              data={data.collectionStatus.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={220}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <AnalyticsPanel title="Collection trend" description="Daily collection volume">
            <LineChart
              data={data.collectionTrend}
              xKey="label"
              lines={[{ key: 'value', label: 'Collected' }]}
              height={220}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel title="Collection by branch">
            <BarChart
              data={toBarRows(data.collectionByBranch)}
              xKey="name"
              bars={[{ key: 'value', label: 'Collected' }]}
              orientation="horizontal"
              height={240}
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
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.dispatchKpis} columns={3} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Dispatch mode">
            <DonutChart
              data={data.dispatchMode.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={220}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 8 }}>
          <AnalyticsPanel title="Dispatch trend">
            <LineChart
              data={data.dispatchTrend}
              xKey="label"
              lines={[{ key: 'value', label: 'Dispatched' }]}
              height={220}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel
            title="Courier performance"
            description="Shipments · delivery SLA % · delayed"
          >
            <BarChart
              data={data.courierPerformance.map((row) => ({
                name: row.label,
                shipments: row.value,
                sla: row.secondary,
                delayed: row.tertiary,
              }))}
              xKey="name"
              bars={[
                { key: 'shipments', label: 'Shipments' },
                { key: 'sla', label: 'Delivery SLA %' },
                { key: 'delayed', label: 'Delayed' },
              ]}
              orientation="horizontal"
              height={260}
              barSize={12}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

const CITY_COLUMNS: Column<VisaAnalyticsCityRow>[] = [
  { key: 'city', label: 'City', widthSize: 'md', sortable: false, filterable: false },
  { key: 'submitted', label: 'Submitted', widthSize: 'sm', sortable: false, filterable: false },
  { key: 'pending', label: 'Pending', widthSize: 'sm', sortable: false, filterable: false },
  { key: 'completed', label: 'Completed', widthSize: 'sm', sortable: false, filterable: false },
  { key: 'delayed', label: 'Delayed', widthSize: 'sm', sortable: false, filterable: false },
  {
    key: 'slaPercent',
    label: 'SLA %',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    render: (value: number) => `${value}%`,
  },
]

export function PanIndiaSection({ data }: { data: VisaAnalyticsData }) {
  const ranking = useTopN('10')
  const [scope, setScope] = useState<'delhi' | 'pan-india'>('pan-india')
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

  const cities = useMemo(() => {
    const base =
      scope === 'delhi'
        ? data.panIndiaCities.filter((row) => row.id === 'delhi')
        : data.panIndiaCities
    return sliceTopN(
      [...base].sort((a, b) => b.submitted - a.submitted),
      ranking.topN,
    )
  }, [data.panIndiaCities, ranking.topN, scope])

  return (
    <Stack spacing={1.5}>
      <Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }}>
        <Tabs
          value={scope}
          onChange={(value) => setScope(value as 'delhi' | 'pan-india')}
          variant="underline"
          size="sm"
          items={[
            { value: 'delhi', label: 'Delhi' },
            { value: 'pan-india', label: 'Pan India' },
          ]}
        />
      </Box>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, lg: 5 }}>
          <AnalyticsPanel
            title="India submission heat"
            description="Volume intensity by city (map placeholder — chart view)"
          >
            <BarChart
              data={toBarRows(
                cities.map((row) => ({ label: row.city, value: row.submitted })),
              )}
              xKey="name"
              bars={[{ key: 'value', label: 'Submitted' }]}
              orientation="horizontal"
              height={280}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 7 }}>
          <AnalyticsPanel
            title="City ranking"
            description="Submitted volume ranking"
            action={<TopNSelect value={ranking.topN} onChange={ranking.setTopN} />}
          >
            <BarChart
              data={toBarRows(
                cities.map((row) => ({ label: row.city, value: row.submitted })),
              )}
              xKey="name"
              bars={[{ key: 'value', label: 'Submitted' }]}
              orientation="horizontal"
              height={280}
              barSize={14}
              showLegend={false}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel title="City performance table">
            <AdminListingTable
              columns={CITY_COLUMNS}
              data={scope === 'delhi' ? data.panIndiaCities.filter((r) => r.id === 'delhi') : data.panIndiaCities}
              filterSourceData={data.panIndiaCities}
              rowKey="id"
              state={tableState}
              onStateChange={setTableState}
              columnFilters={columnFilters}
              onColumnFiltersChange={setColumnFilters}
              getCellValue={(row, key) => String(row[key as keyof VisaAnalyticsCityRow] ?? '')}
              enableColumnSort={false}
              enableColumnFilters={false}
              stickyHeader
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}
