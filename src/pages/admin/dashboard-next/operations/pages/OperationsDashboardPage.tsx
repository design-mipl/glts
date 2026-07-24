import { Box, Grid, Stack } from '@mui/material'
import {
  Activity,
  CheckSquare,
  ClipboardList,
  Gauge,
  ListTodo,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FormField, Input } from '@/design-system/UIComponents'
import { DashboardFilters, DashboardShell, DASHBOARD_SPACING } from '../../shared'
import { useOperationsDashboardNext } from '../hooks/useOperationsDashboardNext'
import { OPERATIONS_DASHBOARD_MOCK } from '../data/operationsDashboardMock'
import {
  ActivityTab,
  MyWorkTab,
  PerformanceTab,
  QueuesTab,
  TodaysTasksTab,
} from '../tabs'
import type { OperationsDashboardTabProps } from '../types'

export function OperationsDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useOperationsDashboardNext()
  const data = dashboard.data ?? OPERATIONS_DASHBOARD_MOCK
  const loading = dashboard.isLoading

  const tabProps: OperationsDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onPipelineStageClick: () => navigate('/admin/application-management/retail'),
    onVerificationOpen: () => navigate('/admin/application-management/retail'),
    onViewVerificationQueue: () => navigate('/admin/assignment-priority/retail'),
    onQueueRowClick: () => navigate('/admin/application-management/retail'),
    onJobClick: () => navigate('/admin/application-management/retail'),
  }

  return (
    <DashboardShell
      badge="Next"
      title="Operations dashboard"
      subtitle={`Workbench for ${data.consultantName} — know what needs attention and start the next task.`}
      filters={
        <Stack spacing={DASHBOARD_SPACING.field}>
          <Grid container spacing={DASHBOARD_SPACING.field}>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <FormField label="Search">
                <Input
                  fullWidth
                  size="sm"
                  placeholder="GL number, applicant, queue…"
                  value={dashboard.filters.search}
                  onChange={dashboard.setSearch}
                />
              </FormField>
            </Grid>
          </Grid>
          <Box>
            <DashboardFilters filters={dashboard.filterConfigs} />
          </Box>
        </Stack>
      }
      loading={loading}
      error={dashboard.isError}
      onRetry={dashboard.retry}
      defaultTab="my-work"
      tabs={[
        {
          id: 'my-work',
          label: 'My Work',
          icon: <ClipboardList size={16} />,
          content: <MyWorkTab {...tabProps} />,
        },
        {
          id: 'queues',
          label: 'Queues',
          icon: <ListTodo size={16} />,
          content: <QueuesTab {...tabProps} />,
        },
        {
          id: 'todays-tasks',
          label: "Today's Tasks",
          icon: <CheckSquare size={16} />,
          content: <TodaysTasksTab {...tabProps} />,
        },
        {
          id: 'activity',
          label: 'Activity',
          icon: <Activity size={16} />,
          content: <ActivityTab {...tabProps} />,
        },
        {
          id: 'performance',
          label: 'Performance',
          icon: <Gauge size={16} />,
          content: <PerformanceTab {...tabProps} />,
        },
      ]}
    />
  )
}
