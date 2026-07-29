import { useMemo, useState } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { BarChart, DonutChart, LineChart, ProgressBar } from '@/design-system/UIComponents'
import { AdminListingTable } from '@/pages/admin/components/listing'
import type { Column, TableState } from '@/design-system/UIComponents'
import { AnalyticsKpiGrid } from '../../analytics/components/AnalyticsKpiGrid'
import {
  AnalyticsPanel,
  BottomNSelect,
  DepartmentPerfCard,
  TopNSelect,
  WorkloadHeatmap,
} from '../components/WorkforceChrome'
import {
  sliceTopN,
  type WorkforceBottomN,
  type WorkforceTopN,
} from '../config/workforceAnalyticsConfig'
import type { WorkforceAnalyticsData, WorkforceEmployeeRow } from '../types'

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

export function ExecutiveSummarySection({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        High-level workforce performance — click any KPI to drill down. Values follow the page
        global filters.
      </Typography>
      <AnalyticsKpiGrid items={data.executiveKpis} columns={4} />
    </Stack>
  )
}

export function DepartmentOverviewSection({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13 }}>
        Compare Operations, Documentation, Ground Operations, and Accounts.
      </Typography>
      <Grid container spacing={1.5}>
        {data.departments.map((dept) => (
          <Grid key={dept.id} size={{ xs: 12, sm: 6, lg: 3 }}>
            <DepartmentPerfCard
              id={dept.id}
              label={dept.label}
              users={dept.users}
              openCases={dept.openCases}
              completedToday={dept.completedToday}
              pending={dept.pending}
              capacityPercent={dept.capacityPercent}
              slaPercent={dept.slaPercent}
              productivityPercent={dept.productivityPercent}
            />
          </Grid>
        ))}
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel
            title="Department ranking"
            description="Productivity · Capacity · SLA · Completion rate"
          >
            <BarChart
              data={data.departmentRanking.map((row) => ({
                name: row.label,
                productivity: row.value,
                capacity: row.secondary,
                sla: row.tertiary,
                completion: row.quaternary,
              }))}
              xKey="name"
              orientation="horizontal"
              height={280}
              barSize={12}
              bars={[
                { key: 'productivity', label: 'Productivity %' },
                { key: 'capacity', label: 'Capacity %' },
                { key: 'sla', label: 'SLA %' },
                { key: 'completion', label: 'Completion rate' },
              ]}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function TeamProductivitySection({ data }: { data: WorkforceAnalyticsData }) {
  const contributionTotal = data.teamContribution.reduce((sum, s) => sum + s.value, 0)

  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.teamKpis} columns={4} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, lg: 7 }}>
          <AnalyticsPanel
            title="Team comparison"
            description="Open · Completed · Delayed · SLA · Productivity"
          >
            <BarChart
              data={data.teams.map((row) => ({
                name: row.label,
                open: row.openApplications,
                completed: row.completed,
                delayed: row.delayed,
                sla: row.slaPercent,
                productivity: row.productivityPercent,
              }))}
              xKey="name"
              orientation="horizontal"
              height={280}
              barSize={12}
              bars={[
                { key: 'open', label: 'Open' },
                { key: 'completed', label: 'Completed' },
                { key: 'delayed', label: 'Delayed' },
                { key: 'sla', label: 'SLA %' },
                { key: 'productivity', label: 'Productivity %' },
              ]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 5 }}>
          <AnalyticsPanel title="Team contribution" description="Completion share by team">
            <DonutChart
              data={data.teamContribution.map((s) => ({
                key: s.id,
                label: s.label,
                value: s.value,
              }))}
              height={260}
              centerLabel="done"
              centerValue={String(contributionTotal)}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <AnalyticsPanel
            title="Monthly productivity trend"
            description="Marine · Corporate · Retail · B2B"
          >
            <LineChart
              data={data.teamMonthlyTrend}
              xKey="label"
              height={260}
              lines={[
                { key: 'value', label: 'Marine' },
                { key: 'secondary', label: 'Corporate' },
                { key: 'tertiary', label: 'Retail' },
                { key: 'quaternary', label: 'B2B' },
              ]}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

const EMPLOYEE_COLUMNS: Column<WorkforceEmployeeRow>[] = [
  { key: 'name', label: 'Employee', widthSize: 'lg', sortable: false, filterable: false },
  { key: 'department', label: 'Department', widthSize: 'md', sortable: false, filterable: false },
  { key: 'assigned', label: 'Assigned', widthSize: 'sm', sortable: false, filterable: false, align: 'right' },
  { key: 'completed', label: 'Completed', widthSize: 'sm', sortable: false, filterable: false, align: 'right' },
  { key: 'pending', label: 'Pending', widthSize: 'sm', sortable: false, filterable: false, align: 'right' },
  { key: 'delayed', label: 'Delayed', widthSize: 'sm', sortable: false, filterable: false, align: 'right' },
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
]

export function EmployeeProductivitySection({ data }: { data: WorkforceAnalyticsData }) {
  const top = useTopN('10')
  const bottom = useBottomN('5')
  const ranked = useMemo(
    () =>
      [...data.employees].sort((a, b) => b.productivityPercent - a.productivityPercent),
    [data.employees],
  )
  const bottomRanked = useMemo(
    () => [...data.employees].sort((a, b) => a.productivityPercent - b.productivityPercent),
    [data.employees],
  )

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
      <AnalyticsKpiGrid items={data.employeeKpis} columns={3} />
      <AnalyticsPanel
        title="Employee productivity table"
        description="Workload and performance by individual"
      >
        <AdminListingTable
          columns={EMPLOYEE_COLUMNS}
          data={data.employees}
          filterSourceData={data.employees}
          rowKey="id"
          state={tableState}
          onStateChange={setTableState}
          columnFilters={columnFilters}
          onColumnFiltersChange={setColumnFilters}
          getCellValue={(row, key) => String(row[key as keyof WorkforceEmployeeRow] ?? '')}
          enableColumnSort={false}
          enableColumnFilters={false}
          stickyHeader
          emptyTitle="No employees for current filters"
          emptyDescription="Adjust global filters to see employee productivity."
        />
      </AnalyticsPanel>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Employee ranking"
            description="Ranked by productivity %"
            action={<TopNSelect value={top.topN} onChange={top.setTopN} />}
          >
            <BarChart
              data={toBarRows(
                sliceTopN(ranked, top.topN).map((row) => ({
                  label: row.name,
                  value: row.productivityPercent,
                })),
              )}
              xKey="name"
              orientation="horizontal"
              height={280}
              barSize={14}
              showLegend={false}
              bars={[{ key: 'value', label: 'Productivity %' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel
            title="Bottom performers"
            description="Employees requiring intervention"
            action={<BottomNSelect value={bottom.bottomN} onChange={bottom.setBottomN} />}
          >
            <BarChart
              data={toBarRows(
                bottomRanked.slice(0, Number(bottom.bottomN)).map((row) => ({
                  label: row.name,
                  value: row.productivityPercent,
                })),
              )}
              xKey="name"
              orientation="horizontal"
              height={280}
              barSize={14}
              showLegend={false}
              bars={[{ key: 'value', label: 'Productivity %' }]}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function WorkloadSection({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.workloadKpis} columns={3} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, lg: 6 }}>
          <AnalyticsPanel title="Workload by employee" description="Assigned cases per employee">
            <BarChart
              data={toBarRows(data.workloadByEmployee)}
              xKey="name"
              orientation="horizontal"
              height={280}
              barSize={14}
              showLegend={false}
              bars={[{ key: 'value', label: 'Assigned' }]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, lg: 6 }}>
          <AnalyticsPanel
            title="Workload distribution"
            description="Open · Pending · Completed · Delayed"
          >
            <BarChart
              data={data.workloadStack}
              xKey="label"
              height={280}
              barSize={18}
              bars={[
                { key: 'open', label: 'Open' },
                { key: 'pending', label: 'Pending' },
                { key: 'completed', label: 'Completed' },
                { key: 'delayed', label: 'Delayed' },
              ]}
            />
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Workload heatmap" description="Capacity pressure by employee">
            <WorkloadHeatmap
              rows={data.employees.map((row) => ({
                id: row.id,
                name: row.name,
                tone: row.workloadTone,
              }))}
            />
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}

export function CapacitySection({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={1.5}>
      <AnalyticsKpiGrid items={data.capacityKpis} columns={4} />
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="Department capacity" description="Utilization by department">
            <Stack spacing={1.5}>
              {data.departmentCapacity.map((row) => (
                <Box key={row.id}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontSize: 13 }}>
                      {row.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                      {row.value}%
                    </Typography>
                  </Stack>
                  <ProgressBar value={row.value} size="sm" showValue={false} />
                </Box>
              ))}
            </Stack>
          </AnalyticsPanel>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <AnalyticsPanel title="User capacity" description="Utilization per employee">
            <Stack spacing={1.25}>
              {data.userCapacity.map((row) => (
                <Box key={row.id}>
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                    <Typography variant="body2" sx={{ fontSize: 13 }} noWrap>
                      {row.label}
                    </Typography>
                    <Typography variant="body2" fontWeight={700} sx={{ fontSize: 13 }}>
                      {row.value}%
                    </Typography>
                  </Stack>
                  <ProgressBar value={row.value} size="sm" showValue={false} />
                </Box>
              ))}
            </Stack>
          </AnalyticsPanel>
        </Grid>
      </Grid>
    </Stack>
  )
}
