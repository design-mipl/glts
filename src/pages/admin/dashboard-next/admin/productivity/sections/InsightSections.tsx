import { useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import {
  BarChart,
  DonutChart,
  LineChart,
  PieChart,
  RadarChart,
} from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import type { Column, TableState } from '@/design-system/UIComponents'
import { AnalyticsKpiGrid } from '../../analytics/components/AnalyticsKpiGrid'
import { ADMIN_CHART_COLORS } from '../../data/adminChartColors'
import {
  AnalyticsPanel,
  BottomNSelect,
  TopNSelect,
  WORKFORCE_CHART_HEIGHT,
  WORKFORCE_BAR_SIZE,
  WORKFORCE_CHART_HEIGHT_LG,
} from '../components/WorkforceChrome'
import {
  sliceTopN,
  type WorkforceBottomN,
  type WorkforceTopN,
} from '../config/workforceAnalyticsConfig'
import type { WorkforceAnalyticsData, WorkforceDepartmentCard } from '../types'

function toBarRows(rows: { label: string; value: number }[]) {
  return rows.map((row) => ({ name: row.label, value: row.value }))
}

function useTopN(initial: WorkforceTopN = '10') {
  const [topN, setTopN] = useState<WorkforceTopN>(initial)
  return { topN, setTopN }
}

function useBottomN(initial: WorkforceBottomN = '5') {
  const [bottomN, setBottomN] = useState<WorkforceBottomN>(initial)
  return { bottomN, setBottomN }
}

export function SlaSection({ data }: { data: WorkforceAnalyticsData }) {
  const emp = useTopN('10')
  const bottom = useBottomN('5')
  const ranked = [...data.slaByEmployee].sort((a, b) => b.value - a.value)
  const bottomRanked = [...data.slaByEmployee].sort((a, b) => a.value - b.value)

  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.slaKpis} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="SLA by department">
            <BarChart
              data={toBarRows(data.slaByDepartment)}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'SLA %' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="SLA by team">
            <BarChart
              data={toBarRows(data.slaByTeam)}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'SLA %' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="SLA by employee"
            action={<TopNSelect value={emp.topN} onChange={emp.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(ranked, emp.topN))}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'SLA %' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="SLA bottom performers"
            action={<BottomNSelect value={bottom.bottomN} onChange={bottom.setBottomN} />}
          >
            <BarChart
              data={toBarRows(bottomRanked.slice(0, Number(bottom.bottomN)))}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'SLA %' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel title="SLA trend" description="Monthly SLA performance">
            <LineChart
              data={data.slaTrend}
              xKey="label"
              height={WORKFORCE_CHART_HEIGHT}
              lines={[{ key: 'value', label: 'SLA %' }]}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function TrendsSection({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Daily productivity">
            <LineChart
              data={data.dailyProductivity}
              xKey="label"
              height={WORKFORCE_CHART_HEIGHT}
              lines={[{ key: 'value', label: 'Productivity %' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Weekly productivity">
            <LineChart
              data={data.weeklyProductivity}
              xKey="label"
              height={WORKFORCE_CHART_HEIGHT}
              lines={[{ key: 'value', label: 'Productivity %' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Monthly productivity">
            <LineChart
              data={data.monthlyProductivity}
              xKey="label"
              height={WORKFORCE_CHART_HEIGHT}
              lines={[{ key: 'value', label: 'Productivity %' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel
            title="Department trend comparison"
            description="Operations · Documentation · Ground · Accounts"
          >
            <LineChart
              data={data.departmentTrend}
              xKey="label"
              height={WORKFORCE_CHART_HEIGHT}
              lines={[
                { key: 'value', label: 'Operations', color: ADMIN_CHART_COLORS.navy },
                { key: 'secondary', label: 'Documentation', color: ADMIN_CHART_COLORS.green },
                { key: 'tertiary', label: 'Ground Operations', color: ADMIN_CHART_COLORS.blue },
                { key: 'quaternary', label: 'Accounts', color: ADMIN_CHART_COLORS.amber },
              ]}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function QualitySection({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.qualityKpis} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 5 }}>
          <AnalyticsPanel title="Error distribution">
            <PieChart
              data={data.errorDistribution.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={WORKFORCE_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 7 }}>
          <AnalyticsPanel title="QC performance" description="QC completion by department">
            <BarChart
              data={toBarRows(data.qcByDepartment)}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'QC pass %' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel title="Rework trend" description="Monthly correction requests">
            <LineChart
              data={data.reworkTrend}
              xKey="label"
              height={WORKFORCE_CHART_HEIGHT}
              lines={[{ key: 'value', label: 'Rework cases' }]}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function ActivitySection({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.activityKpis} />
      <AnalyticsPanel title="Activity timeline" description="Employee activity through the day">
        <Stack spacing={1.25}>
          {data.activityTimeline.map((event) => (
            <Box
              key={event.id}
              sx={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr',
                gap: 1,
                alignItems: 'start',
              }}
            >
              <Typography
                variant="caption"
                fontWeight={700}
                color="text.secondary"
                sx={{ fontSize: 11, pt: 0.2 }}
              >
                {event.time}
              </Typography>
              <Box>
                <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                  {event.employee}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: 12 }}>
                  {event.action}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </AnalyticsPanel>
    </Stack>
  )
}

const COMPARISON_COLUMNS: Column<WorkforceDepartmentCard>[] = [
  { key: 'label', label: 'Department', widthSize: 'lg', sortable: false, filterable: false },
  { key: 'users', label: 'Users', widthSize: 'sm', sortable: false, filterable: false, align: 'right' },
  { key: 'openCases', label: 'Open', widthSize: 'sm', sortable: false, filterable: false, align: 'right' },
  {
    key: 'completedToday',
    label: 'Completed',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    align: 'right',
  },
  { key: 'pending', label: 'Pending', widthSize: 'sm', sortable: false, filterable: false, align: 'right' },
  {
    key: 'slaPercent',
    label: 'SLA',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    align: 'right',
    render: (value: number) => `${value}%`,
  },
  {
    key: 'productivityPercent',
    label: 'Productivity',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    align: 'right',
    render: (value: number) => `${value}%`,
  },
  {
    key: 'capacityPercent',
    label: 'Capacity',
    widthSize: 'sm',
    sortable: false,
    filterable: false,
    align: 'right',
    render: (value: number) => `${value}%`,
  },
]

export function ComparisonSection({ data }: { data: WorkforceAnalyticsData }) {
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

  return (
    <Stack spacing={1.5}>
      <AnalyticsPanel title="Department comparison table">
        <AdminListingTable
          columns={COMPARISON_COLUMNS}
          data={data.comparisonTable}
          filterSourceData={data.comparisonTable}
          rowKey="id"
          state={tableState}
          onStateChange={setTableState}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          getCellValue={(row, key) => String(row[key as keyof WorkforceDepartmentCard] ?? '')}
          enableColumnSort={false}
          enableColumnFilters={false}
          stickyHeader
        />
      </AnalyticsPanel>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <AnalyticsPanel
            title="Grouped comparison"
            description="Productivity · SLA · Capacity"
          >
            <BarChart
              data={data.comparisonBars.map((row) => ({
                name: row.label,
                productivity: row.value,
                sla: row.secondary,
                capacity: row.tertiary,
              }))}
              xKey="name"
              height={WORKFORCE_CHART_HEIGHT}
              barSize={WORKFORCE_BAR_SIZE}
              bars={[
                { key: 'productivity', label: 'Productivity', color: ADMIN_CHART_COLORS.navy },
                { key: 'sla', label: 'SLA', color: ADMIN_CHART_COLORS.green },
                { key: 'capacity', label: 'Capacity', color: ADMIN_CHART_COLORS.blue },
              ]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <AnalyticsPanel title="Radar comparison" description="Multi-dimension department score">
            <RadarChart
              data={data.radarComparison}
              radars={[
                { key: 'operations', label: 'Operations', color: ADMIN_CHART_COLORS.navy },
                { key: 'documentation', label: 'Documentation', color: ADMIN_CHART_COLORS.green },
                { key: 'ground', label: 'Ground Operations', color: ADMIN_CHART_COLORS.blue },
                { key: 'accounts', label: 'Accounts', color: ADMIN_CHART_COLORS.amber },
              ]}
              angleKey="metric"
              height={WORKFORCE_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function LeaderboardsSection({ data }: { data: WorkforceAnalyticsData }) {
  const performers = useTopN('10')
  const teams = useTopN('10')
  const departments = useTopN('10')

  return (
    <Stack spacing={1.5}>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Top performers"
            action={<TopNSelect value={performers.topN} onChange={performers.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.topPerformers, performers.topN))}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'Productivity' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Top teams"
            action={<TopNSelect value={teams.topN} onChange={teams.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.topTeams, teams.topN))}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'Productivity' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Top departments"
            action={<TopNSelect value={departments.topN} onChange={departments.setTopN} />}
          >
            <BarChart
              data={toBarRows(sliceTopN(data.topDepartments, departments.topN))}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'Productivity' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Most improved employees"
            description="Productivity lift vs prior period"
          >
            <BarChart
              data={toBarRows(data.mostImproved)}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'Improvement %' }]}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function BottlenecksSection({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.bottleneckKpis} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Bottleneck by department">
            <BarChart
              data={toBarRows(data.bottleneckByDepartment)}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'Issues' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Bottleneck by team">
            <BarChart
              data={toBarRows(data.bottleneckByTeam)}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'Issues' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 4 }}>
          <AnalyticsPanel title="Bottleneck by employee">
            <BarChart
              data={toBarRows(data.bottleneckByEmployee)}
              xKey="name"
              orientation="horizontal"
              height={WORKFORCE_CHART_HEIGHT_LG}
              barSize={WORKFORCE_BAR_SIZE}
              showLegend={false}
              bars={[{ key: 'value', label: 'Issues' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Delay reasons">
            <PieChart
              data={data.delayReasons.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={WORKFORCE_CHART_HEIGHT}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Delay mix" description="Share of operational delays">
            <DonutChart
              data={data.delayReasons.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={WORKFORCE_CHART_HEIGHT}
              centerLabel="delays"
              centerValue={String(data.delayReasons.reduce((sum, s) => sum + s.value, 0))}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}
