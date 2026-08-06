import { useMemo, useState } from 'react'
import { Box, Divider, Stack, Typography } from '@mui/material'
import { Tabs } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { executiveCardLevel2Sx } from '@/pages/admin/dashboard/components/executiveDashboardTokens'
import { ExecutiveSectionHeader } from '@/pages/admin/dashboard/components'
import { useDashboardFiltersOptional } from '../../shared/dashboard-intelligence'
import { DASHBOARD_SPACING } from '../../shared'
import {
  WORKFORCE_SECTION_TABS,
  type WorkforceSectionId,
} from './config/workforceAnalyticsConfig'
import { WORKFORCE_ANALYTICS_MOCK } from './data/workforceAnalyticsMock'
import {
  CapacitySection,
  DepartmentOverviewSection,
  EmployeeProductivitySection,
  TeamProductivitySection,
  WorkloadSection,
} from './sections/CoreSections'
import {
  ActivitySection,
  BottlenecksSection,
  ComparisonSection,
  LeaderboardsSection,
  QualitySection,
  SlaSection,
  TrendsSection,
} from './sections/InsightSections'
import { applyWorkforceFilters } from './utils/applyWorkforceFilters'
import type { WorkforceAnalyticsData } from './types'

export interface TeamProductivityAnalyticsTabProps {
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
        <Typography variant="h6" fontWeight={700} sx={{ fontSize: 15, lineHeight: 1.3 }}>
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

/** Departments + teams — primary workforce picture. */
function WorkforcePanel({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={2}>
      <StageBlock
        title="Departments"
        description="Operations, Documentation, Ground Operations, and Accounts"
      >
        <DepartmentOverviewSection data={data} />
      </StageBlock>
      <StageBlock
        title="Teams"
        description="Productivity and throughput by team"
        showDivider
      >
        <TeamProductivitySection data={data} />
      </StageBlock>
    </Stack>
  )
}

/** People, workload, and capacity. */
function CapacityPanel({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={2}>
      <StageBlock title="Employees" description="Individual productivity and output">
        <EmployeeProductivitySection data={data} />
      </StageBlock>
      <StageBlock title="Workload" description="Load distribution across the workforce" showDivider>
        <WorkloadSection data={data} />
      </StageBlock>
      <StageBlock title="Capacity" description="Utilization and headroom" showDivider>
        <CapacitySection data={data} />
      </StageBlock>
    </Stack>
  )
}

/** SLA, quality, activity, and insight rankings — one performance focus. */
function PerformancePanel({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={2}>
      <StageBlock title="SLA" description="On-time delivery and breach risk">
        <SlaSection data={data} />
      </StageBlock>
      <StageBlock title="Trends" description="Throughput and productivity over time" showDivider>
        <TrendsSection data={data} />
      </StageBlock>
      <StageBlock title="Quality" description="Rework, errors, and completion quality" showDivider>
        <QualitySection data={data} />
      </StageBlock>
      <StageBlock title="Activity" description="Recent operational activity" showDivider>
        <ActivitySection data={data} />
      </StageBlock>
      <StageBlock title="Comparison" description="Department and team benchmarks" showDivider>
        <ComparisonSection data={data} />
      </StageBlock>
      <StageBlock title="Leaderboards" description="Top and bottom performers" showDivider>
        <LeaderboardsSection data={data} />
      </StageBlock>
      <StageBlock title="Bottlenecks" description="Where work is stuck" showDivider>
        <BottlenecksSection data={data} />
      </StageBlock>
    </Stack>
  )
}

/**
 * Team & Productivity analytics — one focus at a time.
 * Stages inside each tab stack with dividers (Visa Analytics pattern).
 */
export function TeamProductivityAnalyticsTab({
  loading = false,
}: TeamProductivityAnalyticsTabProps) {
  const colors = usePublicBrandColors()
  const filterCtx = useDashboardFiltersOptional()
  const filters = filterCtx?.filters
  const [section, setSection] = useState<WorkforceSectionId>('workforce')

  const data = useMemo(() => {
    if (!filters) return WORKFORCE_ANALYTICS_MOCK
    return applyWorkforceFilters(WORKFORCE_ANALYTICS_MOCK, filters)
  }, [filters])

  const filterHint = filters
    ? [
        filters.datePreset !== 'mtd' && filters.datePreset !== 'month'
          ? filters.datePreset
          : null,
        filters.segment !== 'all' ? filters.segment : null,
        filters.branch !== 'all' ? filters.branch : null,
        filters.country !== 'all' ? filters.country : null,
        filters.client !== 'all' ? filters.client : null,
        filterCtx && filterCtx.activeCount > 0 ? `${filterCtx.activeCount} active filters` : null,
      ]
        .filter(Boolean)
        .slice(0, 3)
        .join(' · ')
    : null

  return (
    <Box sx={{ ...executiveCardLevel2Sx(colors), p: 0, overflow: 'hidden' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1.25 }}>
        <ExecutiveSectionHeader
          title="Team & Productivity"
          description={
            filterHint
              ? `Workforce, capacity, and performance — ${filterHint}.`
              : 'One focus at a time — workforce, capacity, or performance. Uses page global filters.'
          }
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
          onChange={(value) => setSection(value as WorkforceSectionId)}
          variant="underline"
          size="sm"
          items={WORKFORCE_SECTION_TABS.map((tab) => ({
            value: tab.value,
            label: tab.label,
          }))}
        />
      </Box>

      <Box sx={{ p: 2 }}>
        {loading ? (
          <Typography variant="body2" color="text.secondary">
            Loading workforce analytics…
          </Typography>
        ) : (
          <Stack spacing={DASHBOARD_SPACING.field}>
            {section === 'workforce' ? <WorkforcePanel data={data} /> : null}
            {section === 'capacity' ? <CapacityPanel data={data} /> : null}
            {section === 'performance' ? <PerformancePanel data={data} /> : null}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
