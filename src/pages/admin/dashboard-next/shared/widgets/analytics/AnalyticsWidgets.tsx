import { PieChart, DonutChart, BarChart, AreaChart } from '@/design-system/UIComponents'
import {
  AnalyticsChart,
  ComparisonLayout,
  ProgressMetric,
  RankingList,
  TrendContainer,
  UI_KIT_SPACING,
} from '../../dashboard-ui-kit'
import { BusinessWidgetFrame } from '../common/BusinessWidgetFrame'
import { AlertCenter } from '../AlertCenter'
import { DASHBOARD_CHART_HEIGHT_SPACING } from '../../constants'
import type { DashboardAlertItem, DashboardProgressItem } from '../../types'
import { Stack } from '@mui/material'

export interface DistributionSlice {
  id: string
  label: string
  value: number
}

export interface NamedMetricPoint {
  id: string
  label: string
  value: number
}

export interface TrendPoint {
  label: string
  value: number
  secondary?: number
}

interface DistributionWidgetBase {
  title?: string
  subtitle?: string
  slices: DistributionSlice[]
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

function DistributionDonut({
  title,
  subtitle,
  slices,
  loading,
  error,
  empty,
  permission,
  onRetry,
  centerLabel,
}: DistributionWidgetBase & { centerLabel?: string }) {
  const chartHeight = DASHBOARD_CHART_HEIGHT_SPACING * 8
  const data = slices.map((slice) => ({
    key: slice.id,
    label: slice.label,
    value: slice.value,
  }))
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)

  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? slices.length === 0}
      permission={permission}
      onRetry={onRetry}
    >
      <ComparisonLayout
        left={
          <AnalyticsChart title={title ?? 'Distribution'} subtitle={subtitle} minHeight={chartHeight}>
            <DonutChart data={data} height={chartHeight} centerLabel={centerLabel} />
          </AnalyticsChart>
        }
        right={
          <RankingList
            title="Ranking"
            items={slices.map((slice, index) => ({
              id: slice.id,
              primary: slice.label,
              rank: index + 1,
              value: slice.value,
              progress: total > 0 ? (slice.value / total) * 100 : 0,
            }))}
          />
        }
      />
    </BusinessWidgetFrame>
  )
}

export type CountryDistributionProps = DistributionWidgetBase

export function CountryDistribution(props: CountryDistributionProps) {
  return (
    <DistributionDonut
      {...props}
      title={props.title ?? 'Country distribution'}
      subtitle={props.subtitle ?? 'Applications by destination'}
      centerLabel="Countries"
    />
  )
}

export type VisaDistributionProps = DistributionWidgetBase

export function VisaDistribution(props: VisaDistributionProps) {
  const chartHeight = DASHBOARD_CHART_HEIGHT_SPACING * 8
  const data = props.slices.map((slice) => ({
    key: slice.id,
    label: slice.label,
    value: slice.value,
  }))

  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={props.loading}
      error={props.error}
      empty={props.empty ?? props.slices.length === 0}
      permission={props.permission}
      onRetry={props.onRetry}
    >
      <AnalyticsChart
        title={props.title ?? 'Visa distribution'}
        subtitle={props.subtitle ?? 'Mix by visa type'}
        minHeight={chartHeight}
      >
        <PieChart data={data} height={chartHeight} />
      </AnalyticsChart>
    </BusinessWidgetFrame>
  )
}

export type BusinessSegmentBreakdownProps = DistributionWidgetBase

export function BusinessSegmentBreakdown(props: BusinessSegmentBreakdownProps) {
  return (
    <DistributionDonut
      {...props}
      title={props.title ?? 'Business segments'}
      subtitle={props.subtitle ?? 'Share by segment'}
      centerLabel="Segments"
    />
  )
}

export interface BranchPerformanceProps {
  title?: string
  subtitle?: string
  branches: NamedMetricPoint[]
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function BranchPerformance({
  title = 'Branch performance',
  subtitle = 'Throughput by branch',
  branches,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: BranchPerformanceProps) {
  const chartHeight = DASHBOARD_CHART_HEIGHT_SPACING * 8
  const data = branches.map((branch) => ({
    branch: branch.label,
    value: branch.value,
  }))

  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? branches.length === 0}
      permission={permission}
      onRetry={onRetry}
    >
      <AnalyticsChart title={title} subtitle={subtitle} minHeight={chartHeight}>
        <BarChart
          data={data}
          xKey="branch"
          bars={[{ key: 'value', label: 'Volume' }]}
          height={chartHeight}
          showLegend={false}
        />
      </AnalyticsChart>
    </BusinessWidgetFrame>
  )
}

export interface RiskOverviewProps {
  title?: string
  subtitle?: string
  alerts: DashboardAlertItem[]
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
  onShowMore?: () => void
}

export function RiskOverview({
  title = 'Risk overview',
  subtitle = 'Active risk signals',
  alerts,
  loading,
  error,
  empty,
  permission,
  onRetry,
  onShowMore,
}: RiskOverviewProps) {
  return (
    <BusinessWidgetFrame
      title={undefined}
      card={false}
      loading={loading}
      error={error}
      empty={empty ?? alerts.length === 0}
      permission={permission}
      onRetry={onRetry}
      emptyTitle="No risk signals"
    >
      <AlertCenter
        title={title}
        subtitle={subtitle}
        alerts={alerts}
        onShowMore={onShowMore}
        loading={loading}
      />
    </BusinessWidgetFrame>
  )
}

export interface SLAOverviewProps {
  title?: string
  subtitle?: string
  items: DashboardProgressItem[]
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function SLAOverview({
  title = 'SLA overview',
  subtitle = 'Compliance by workflow',
  items,
  loading,
  error,
  empty,
  permission,
  onRetry,
}: SLAOverviewProps) {
  return (
    <BusinessWidgetFrame
      title={title}
      subtitle={subtitle}
      loading={loading}
      error={error}
      empty={empty ?? items.length === 0}
      permission={permission}
      onRetry={onRetry}
      card={false}
    >
      <Stack spacing={UI_KIT_SPACING.field}>
        {items.map((item) => (
          <ProgressMetric
            key={item.id}
            label={item.label}
            value={item.value}
            helperText={item.helperText}
          />
        ))}
      </Stack>
    </BusinessWidgetFrame>
  )
}

export interface ProcessingTrendProps {
  title?: string
  subtitle?: string
  points: TrendPoint[]
  secondaryLabel?: string
  loading?: boolean
  error?: boolean
  empty?: boolean
  permission?: boolean
  onRetry?: () => void
}

export function ProcessingTrend({
  title = 'Processing trend',
  subtitle = 'Volume over time',
  points,
  secondaryLabel = 'Completed',
  loading,
  error,
  empty,
  permission,
  onRetry,
}: ProcessingTrendProps) {
  const chartHeight = DASHBOARD_CHART_HEIGHT_SPACING * 8
  const hasSecondary = points.some((point) => point.secondary != null)
  const data = points.map((point) => ({
    label: point.label,
    value: point.value,
    secondary: point.secondary ?? 0,
  }))

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
      <TrendContainer title={title} subtitle={subtitle} minHeight={chartHeight}>
        <AreaChart
          data={data}
          xKey="label"
          lines={
            hasSecondary
              ? [
                  { key: 'value', label: 'Processed' },
                  { key: 'secondary', label: secondaryLabel },
                ]
              : [{ key: 'value', label: 'Processed' }]
          }
          height={chartHeight}
        />
      </TrendContainer>
    </BusinessWidgetFrame>
  )
}
