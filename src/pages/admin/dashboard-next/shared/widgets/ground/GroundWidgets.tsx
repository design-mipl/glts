import type { Column } from '@/design-system/UIComponents'
import { BarChart } from '@/design-system/UIComponents'
import { Stack, Typography } from '@mui/material'
import {
  AnalyticsChart,
  ExecutiveGrid,
  FinancialMetric,
  InsightCard,
  Timeline as KitTimeline,
  UI_KIT_SPACING,
} from '../../dashboard-ui-kit'
import { DashboardTable } from '../DashboardTable'
import { StatusBadge } from '../StatusBadge'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import { JourneyFlow, type JourneyFlowStageStatus } from '../common/JourneyFlow'
import { DASHBOARD_CHART_HEIGHT_SPACING } from '../../constants'

export interface TodaysJobRow {
  id: string
  jobRef: string
  type: string
  location: string
  assignee: string
  status: string
  scheduledAt: string
}

export interface TodaysJobsProps {
  title?: string
  subtitle?: string
  rows: TodaysJobRow[]
  onRowClick?: (row: TodaysJobRow) => void
  onViewAll?: () => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function TodaysJobs({
  title = "Today's jobs",
  subtitle = 'Ground operations schedule',
  rows,
  onRowClick,
  onViewAll,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: TodaysJobsProps) {
  const columns: Column<TodaysJobRow>[] = [
    { key: 'jobRef', label: 'Job', widthSize: 'md', sortable: false },
    { key: 'type', label: 'Type', widthSize: 'md', sortable: false },
    { key: 'location', label: 'Location', widthSize: 'lg', sortable: false },
    { key: 'assignee', label: 'Assignee', widthSize: 'md', sortable: false },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.status} status={row.status} />,
    },
    { key: 'scheduledAt', label: 'Time', widthSize: 'md', sortable: false },
  ]

  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? rows.length === 0}
      permission={permission}
      onRetry={onRetry}
    >
      <DashboardTable
        title={title}
        subtitle={subtitle}
        columns={columns}
        data={rows}
        rowKey="id"
        onRowClick={onRowClick}
        onViewAll={onViewAll}
        card
      />
    </BusinessWidgetFrame>
  )
}

export interface RouteTimelineEvent {
  id: string
  title: string
  description?: string
  date: string
  status?: 'completed' | 'active' | 'pending' | 'error'
}

export interface RouteTimelineProps {
  title?: string
  subtitle?: string
  events: RouteTimelineEvent[]
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function RouteTimeline({
  title = 'Route timeline',
  subtitle = 'Stops and handoffs',
  events,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: RouteTimelineProps) {
  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? events.length === 0}
      permission={permission}
      onRetry={onRetry}
      skeletonHeightSpacing={18}
    >
      <KitTimeline
        title={title}
        subtitle={subtitle}
        loading={loading}
        events={events.map((event) => ({
          id: event.id,
          title: event.title,
          description: event.description,
          date: event.date,
          status: event.status,
        }))}
      />
    </BusinessWidgetFrame>
  )
}

export interface ExpenseSummaryData {
  submitted: string | number
  approved: string | number
  pending: string | number
  rejected: string | number
}

export interface ExpenseSummaryProps {
  title?: string
  subtitle?: string
  data: ExpenseSummaryData
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function ExpenseSummary({
  title = 'Expense summary',
  subtitle = 'Field expense status',
  data,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: ExpenseSummaryProps) {
  return (
    <BusinessWidgetFrame
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      empty={empty}
      permission={permission}
      onRetry={onRetry}
      card={false}
    >
      <ExecutiveGrid columns={4}>
        <FinancialMetric label="Submitted" value={data.submitted} />
        <FinancialMetric label="Approved" value={data.approved} tone="positive" />
        <FinancialMetric label="Pending" value={data.pending} tone="warning" />
        <FinancialMetric label="Rejected" value={data.rejected} tone="negative" />
      </ExecutiveGrid>
    </BusinessWidgetFrame>
  )
}

export interface SettlementStatusRow {
  id: string
  settlementRef: string
  agent: string
  amount: string | number
  status: string
  dueDate: string
}

export interface SettlementStatusProps {
  title?: string
  subtitle?: string
  rows: SettlementStatusRow[]
  onRowClick?: (row: SettlementStatusRow) => void
  onViewAll?: () => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function SettlementStatus({
  title = 'Settlement status',
  subtitle = 'Agent settlements',
  rows,
  onRowClick,
  onViewAll,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: SettlementStatusProps) {
  const columns: Column<SettlementStatusRow>[] = [
    { key: 'settlementRef', label: 'Settlement', widthSize: 'md', sortable: false },
    { key: 'agent', label: 'Agent', widthSize: 'lg', sortable: false },
    { key: 'amount', label: 'Amount', widthSize: 'md', sortable: false },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.status} status={row.status} />,
    },
    { key: 'dueDate', label: 'Due', widthSize: 'md', sortable: false },
  ]

  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? rows.length === 0}
      permission={permission}
      onRetry={onRetry}
    >
      <DashboardTable
        title={title}
        subtitle={subtitle}
        columns={columns}
        data={rows}
        rowKey="id"
        onRowClick={onRowClick}
        onViewAll={onViewAll}
        card
      />
    </BusinessWidgetFrame>
  )
}

export interface CourierTrackingData {
  trackingNumber: string
  courier: string
  status: string
  eta?: string
  stages: Array<{
    id: string
    label: string
    status: JourneyFlowStageStatus
    detail?: string
  }>
}

export interface CourierTrackingProps {
  title?: string
  subtitle?: string
  data: CourierTrackingData
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function CourierTracking({
  title = 'Courier tracking',
  subtitle = 'Live consignment status',
  data,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: CourierTrackingProps) {
  return (
    <BusinessWidgetFrame
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      empty={empty}
      permission={permission}
      onRetry={onRetry}
      card={false}
      skeletonHeightSpacing={14}
    >
      <Stack spacing={UI_KIT_SPACING.cluster}>
        <InsightCard accent="info" density="compact">
          <Stack direction="row" spacing={UI_KIT_SPACING.field} alignItems="center" flexWrap="wrap">
            <Typography variant="body2" color="text.secondary">
              {data.courier} · {data.trackingNumber}
            </Typography>
            <StatusBadge label={data.status} status={data.status} />
            {data.eta ? (
              <Typography variant="caption" color="text.secondary">
                ETA {data.eta}
              </Typography>
            ) : null}
          </Stack>
        </InsightCard>
        <JourneyFlow stages={data.stages} />
      </Stack>
    </BusinessWidgetFrame>
  )
}

export interface DocumentMovementPoint {
  label: string
  inbound: number
  outbound: number
}

export interface DocumentMovementProps {
  title?: string
  subtitle?: string
  points: DocumentMovementPoint[]
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function DocumentMovement({
  title = 'Document movement',
  subtitle = 'Inbound vs outbound',
  points,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: DocumentMovementProps) {
  const chartHeight = DASHBOARD_CHART_HEIGHT_SPACING * 8

  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? points.length === 0}
      permission={permission}
      onRetry={onRetry}
    >
      <AnalyticsChart title={title} subtitle={subtitle} minHeight={chartHeight}>
        <BarChart
          data={points}
          xKey="label"
          bars={[
            { key: 'inbound', label: 'Inbound' },
            { key: 'outbound', label: 'Outbound' },
          ]}
          height={chartHeight}
        />
      </AnalyticsChart>
    </BusinessWidgetFrame>
  )
}

export interface AppointmentScheduleRow {
  id: string
  applicant: string
  embassy: string
  slot: string
  consultant: string
  status: string
}

export interface AppointmentScheduleProps {
  title?: string
  subtitle?: string
  rows: AppointmentScheduleRow[]
  onRowClick?: (row: AppointmentScheduleRow) => void
  onViewAll?: () => void
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function AppointmentSchedule({
  title = 'Appointment schedule',
  subtitle = 'Upcoming embassy slots',
  rows,
  onRowClick,
  onViewAll,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: AppointmentScheduleProps) {
  const columns: Column<AppointmentScheduleRow>[] = [
    { key: 'applicant', label: 'Applicant', widthSize: 'lg', sortable: false },
    { key: 'embassy', label: 'Embassy', widthSize: 'md', sortable: false },
    { key: 'slot', label: 'Slot', widthSize: 'md', sortable: false },
    { key: 'consultant', label: 'Consultant', widthSize: 'md', sortable: false },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'sm',
      sortable: false,
      render: (_value, row) => <StatusBadge label={row.status} status={row.status} />,
    },
  ]

  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? rows.length === 0}
      permission={permission}
      onRetry={onRetry}
    >
      <DashboardTable
        title={title}
        subtitle={subtitle}
        columns={columns}
        data={rows}
        rowKey="id"
        onRowClick={onRowClick}
        onViewAll={onViewAll}
        card
      />
    </BusinessWidgetFrame>
  )
}
