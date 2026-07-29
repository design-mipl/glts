import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
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

function OverviewPanel({ data }: { data: WorkforceAnalyticsData }) {
  return <DepartmentOverviewSection data={data} />
}

function PeoplePanel({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <EmployeeProductivitySection data={data} />
      <WorkloadSection data={data} />
      <CapacitySection data={data} />
    </Stack>
  )
}

function SlaTrendsPanel({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <SlaSection data={data} />
      <TrendsSection data={data} />
    </Stack>
  )
}

function QualityActivityPanel({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <QualitySection data={data} />
      <ActivitySection data={data} />
    </Stack>
  )
}

function InsightsPanel({ data }: { data: WorkforceAnalyticsData }) {
  return (
    <Stack spacing={DASHBOARD_SPACING.section}>
      <ComparisonSection data={data} />
      <LeaderboardsSection data={data} />
      <BottlenecksSection data={data} />
    </Stack>
  )
}

/** Executive Team & Productivity analytics — filter-aware workforce intelligence. */
export function TeamProductivityAnalyticsTab({
  loading = false,
}: TeamProductivityAnalyticsTabProps) {
  const colors = usePublicBrandColors()
  const filterCtx = useDashboardFiltersOptional()
  const filters = filterCtx?.filters
  const [section, setSection] = useState<WorkforceSectionId>('overview')

  const data = useMemo(() => {
    if (!filters) return WORKFORCE_ANALYTICS_MOCK
    return applyWorkforceFilters(WORKFORCE_ANALYTICS_MOCK, filters)
  }, [filters])

  const filterHint = filters
    ? [
        filters.datePreset !== 'month' ? filters.datePreset : null,
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
          title="Team & Productivity Analytics"
          description={
            filterHint
              ? `Workforce intelligence across departments, teams, and employees — ${filterHint}.`
              : 'Complete visibility into department, team, and employee workload, capacity, SLA, and productivity. Uses the page global filters.'
          }
        />
      </Box>

      <Box
        sx={{
          px: 2,
          borderBottom: '1px solid',
          borderColor: 'divider',
          overflowX: 'auto',
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
            {section === 'overview' ? <OverviewPanel data={data} /> : null}
            {section === 'teams' ? <TeamProductivitySection data={data} /> : null}
            {section === 'people' ? <PeoplePanel data={data} /> : null}
            {section === 'sla-trends' ? <SlaTrendsPanel data={data} /> : null}
            {section === 'quality-activity' ? <QualityActivityPanel data={data} /> : null}
            {section === 'insights' ? <InsightsPanel data={data} /> : null}
          </Stack>
        )}
      </Box>
    </Box>
  )
}
