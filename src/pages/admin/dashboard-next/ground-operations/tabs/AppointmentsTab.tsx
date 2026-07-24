import type { Column } from '@/design-system/UIComponents'
import { Button } from '@/design-system/UIComponents'
import type { ReactNode } from 'react'
import { Grid } from '@mui/material'
import {
  Briefcase,
  CreditCard,
  LayoutDashboard,
  MapPinned,
  Package,
  Wallet,
} from 'lucide-react'
import {
  AppointmentSchedule,
  DashboardTable,
  DASHBOARD_SPACING,
  QuickActions,
  StatusBadge,
} from '../../shared'
import type {
  GroundAppointmentTableRow,
  GroundOperationsDashboardTabProps,
} from '../types'

const ACTION_ICONS: Record<string, ReactNode> = {
  'qa-desk': <Briefcase size={18} />,
  'qa-logistics': <MapPinned size={18} />,
  'qa-funds': <Wallet size={18} />,
  'qa-allocation': <Package size={18} />,
  'qa-expenses': <CreditCard size={18} />,
  'qa-apps': <LayoutDashboard size={18} />,
}

export function AppointmentsTab({
  data,
  loading,
  onRetry,
  onNavigate,
  onOpenAppointment,
}: GroundOperationsDashboardTabProps) {
  const columns: Column<GroundAppointmentTableRow>[] = [
    { key: 'applicationNumber', label: 'Application Number', widthSize: 'md', sortable: false },
    { key: 'applicant', label: 'Applicant', widthSize: 'lg', sortable: false },
    { key: 'appointmentTime', label: 'Appointment Time', widthSize: 'md', sortable: false },
    { key: 'location', label: 'Location', widthSize: 'md', sortable: false },
    { key: 'assignedExecutive', label: 'Assigned Executive', widthSize: 'md', sortable: false },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.status} status={row.status} />,
    },
    {
      key: 'priority',
      label: 'Priority',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.priority} status={row.priority} />,
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_value, row) => (
        <Button
          label="Open"
          variant="text"
          size="sm"
          onClick={() => onOpenAppointment?.(row.id)}
        />
      ),
    },
  ]

  return (
    <Grid container spacing={DASHBOARD_SPACING.field}>
      <Grid size={{ xs: 12 }}>
        <AppointmentSchedule
          title="Appointment schedule"
          subtitle="Upcoming · completed · rescheduled · missed"
          rows={data.appointmentSchedule}
          loading={loading}
          onRetry={onRetry}
          onRowClick={(row) => onOpenAppointment?.(row.id)}
          onViewAll={() => onNavigate('/admin/ground-operations/case-handling')}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <DashboardTable
          title="Appointments"
          subtitle="Field appointment register"
          columns={columns}
          data={data.appointmentRows}
          rowKey="id"
          loading={loading}
          pageSize={8}
          onRowClick={(row) => onOpenAppointment?.(row.id)}
          onViewAll={() => onNavigate('/admin/ground-operations/case-handling')}
          actionLabel="Open desk"
        />
      </Grid>

      <Grid size={{ xs: 12, md: 5 }}>
        <QuickActions
          columns={1}
          loading={loading}
          items={data.quickActions.slice(0, 4).map((action) => ({
            id: action.id,
            title: action.title,
            description: action.description,
            badge: action.badge,
            icon: ACTION_ICONS[action.id],
            onClick: () => onNavigate(action.href),
          }))}
        />
      </Grid>
    </Grid>
  )
}
