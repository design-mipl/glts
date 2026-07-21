import { Box, Grid, Stack } from '@mui/material'
import {
  Activity,
  Briefcase,
  CalendarDays,
  MapPinned,
  Wallet,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FormField, Input } from '@/design-system/UIComponents'
import { DashboardFilters, DashboardShell, DASHBOARD_SPACING } from '../../shared'
import { GROUND_OPERATIONS_DASHBOARD_MOCK } from '../data/groundOperationsDashboardMock'
import { useGroundOperationsDashboardNext } from '../hooks/useGroundOperationsDashboardNext'
import {
  ActivityTab,
  AppointmentsTab,
  ExpensesSettlementTab,
  PassportMovementTab,
  TodaysJobsTab,
} from '../tabs'
import type { GroundOperationsDashboardTabProps } from '../types'

export function GroundOperationsDashboardPage() {
  const navigate = useNavigate()
  const dashboard = useGroundOperationsDashboardNext()
  const data = dashboard.data ?? GROUND_OPERATIONS_DASHBOARD_MOCK
  const loading = dashboard.isLoading

  const openDesk = () => navigate('/admin/ground-operations/case-handling')
  const openLogistics = () => navigate('/admin/ground-operations/logistics')
  const openFunds = () => navigate('/admin/ground-operations/funds')

  const tabProps: GroundOperationsDashboardTabProps = {
    data,
    loading,
    onRetry: dashboard.retry,
    onNavigate: (href) => navigate(href),
    onOpenJob: openDesk,
    onOpenAppointment: openDesk,
    onOpenPassport: openLogistics,
    onOpenFundCase: openFunds,
  }

  return (
    <DashboardShell
      badge="Next"
      title="Ground Operations dashboard"
      subtitle={`Field workspace for ${data.executiveName} — assignments, appointments, passport logistics, and settlements.`}
      filters={
        <Stack spacing={DASHBOARD_SPACING.field}>
          <Grid container spacing={DASHBOARD_SPACING.field}>
            <Grid size={{ xs: 12, md: 4, lg: 3 }}>
              <FormField label="Search">
                <Input
                  fullWidth
                  size="sm"
                  placeholder="Job, applicant, tracking, case…"
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
      defaultTab="todays-jobs"
      tabs={[
        {
          id: 'todays-jobs',
          label: "Today's Jobs",
          icon: <Briefcase size={16} />,
          content: <TodaysJobsTab {...tabProps} />,
        },
        {
          id: 'appointments',
          label: 'Appointments',
          icon: <CalendarDays size={16} />,
          content: <AppointmentsTab {...tabProps} />,
        },
        {
          id: 'passport-movement',
          label: 'Passport Movement',
          icon: <MapPinned size={16} />,
          content: <PassportMovementTab {...tabProps} />,
        },
        {
          id: 'expenses-settlement',
          label: 'Expenses & Settlement',
          icon: <Wallet size={16} />,
          content: <ExpensesSettlementTab {...tabProps} />,
        },
        {
          id: 'activity',
          label: 'Activity',
          icon: <Activity size={16} />,
          content: <ActivityTab {...tabProps} />,
        },
      ]}
    />
  )
}
