import { useMemo, useState, type ReactNode } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  HandCoins,
  HeartPulse,
  Inbox,
  IndianRupee,
  Lock,
  Percent,
  Send,
  Wallet,
} from 'lucide-react'
import { SparkLine } from '@/design-system/UIComponents'
import { DASHBOARD_SPACING } from '../../shared/constants'
import { InsightStack } from '../../shared/dashboard-ui-kit'
import { ExecutiveKpiCard, type ExecutiveKpiPeriodKey } from './ExecutiveKpiCard'
import type {
  SuperAdminDashboardData,
  SuperAdminPeriodHero,
  SuperAdminRevenuePeriod,
} from '../types'

type PeriodKey = ExecutiveKpiPeriodKey

const PERIOD_OPTIONS: Array<{ value: PeriodKey; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'mtd', label: 'MTD' },
  { value: 'ytd', label: 'YTD' },
]

export interface SuperAdminHeroStripProps {
  data: SuperAdminDashboardData
  loading?: boolean
  onOpenTab?: (tabId: string) => void
  onNavigate?: (href: string) => void
}

function PeriodValueCard({
  title,
  tooltip,
  icon,
  period,
  periodKey,
  onPeriodChange,
  loading,
  onClick,
}: {
  title: string
  tooltip: string
  icon: ReactNode
  period: SuperAdminRevenuePeriod
  periodKey: PeriodKey
  onPeriodChange: (next: PeriodKey) => void
  loading?: boolean
  onClick?: () => void
}) {
  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === periodKey)?.label

  return (
    <ExecutiveKpiCard
      title={title}
      value={period.value}
      tooltip={tooltip}
      icon={icon}
      tone="info"
      delta={period.delta}
      deltaLabel={period.deltaLabel}
      supportingLines={period.targetLabel ? [period.targetLabel] : undefined}
      periodLabel={periodLabel}
      periodOptions={PERIOD_OPTIONS}
      periodKey={periodKey}
      onPeriodChange={onPeriodChange}
      loading={loading}
      onClick={onClick}
    />
  )
}

function pickPeriod(hero: SuperAdminPeriodHero, key: PeriodKey): SuperAdminRevenuePeriod {
  return hero[key]
}

/** Executive Summary — 12 KPIs in 2×6 (financial + operational health). */
export function SuperAdminHeroStrip({
  data,
  loading,
  onOpenTab,
  onNavigate,
}: SuperAdminHeroStripProps) {
  const [revenuePeriod, setRevenuePeriod] = useState<PeriodKey>('mtd')
  const [collectionsPeriod, setCollectionsPeriod] = useState<PeriodKey>('mtd')

  const summary = data.executiveSummary
  const sparkData = useMemo(
    () => data.approvalRateTrend30d.map((p) => p.value),
    [data.approvalRateTrend30d],
  )

  const revenue = pickPeriod(data.revenueHero, revenuePeriod)
  const collections = pickPeriod(data.collectionsHero, collectionsPeriod)

  const gridSx = {
    display: 'grid',
    gap: DASHBOARD_SPACING.field,
    alignItems: 'stretch',
    gridTemplateColumns: {
      xs: 'repeat(2, minmax(0, 1fr))',
      sm: 'repeat(3, minmax(0, 1fr))',
      md: 'repeat(3, minmax(0, 1fr))',
      lg: 'repeat(6, minmax(0, 1fr))',
    },
  } as const

  return (
    <InsightStack spacing={DASHBOARD_SPACING.dense}>
      <Box sx={gridSx}>
        {/* Row 1 — Financial health */}
        <Box sx={{ minWidth: 0, height: '100%' }}>
          <PeriodValueCard
            title="Gross Revenue"
            tooltip="Total invoice value raised for the selected period. Toggle Today / MTD / YTD."
            icon={<IndianRupee size={16} />}
            period={revenue}
            periodKey={revenuePeriod}
            onPeriodChange={setRevenuePeriod}
            loading={loading}
            onClick={() => onOpenTab?.('business')}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Net Revenue"
            tooltip="GLTS earnings after pass-through costs. Gross margin shown as supporting context."
            value={summary.netRevenue.value}
            icon={<Percent size={16} />}
            tone="positive"
            delta={summary.netRevenue.delta}
            deltaLabel={summary.netRevenue.deltaLabel}
            supportingLines={[`Gross margin ${summary.netRevenue.marginPercent}`]}
            loading={loading}
            onClick={() => onOpenTab?.('finance')}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <PeriodValueCard
            title="Collections"
            tooltip="Collections received for the selected period versus target."
            icon={<HandCoins size={16} />}
            period={collections}
            periodKey={collectionsPeriod}
            onPeriodChange={setCollectionsPeriod}
            loading={loading}
            onClick={() => onOpenTab?.('finance')}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Outstanding"
            tooltip="Open receivables balance and overdue invoice count."
            value={summary.outstanding.amount}
            icon={<Wallet size={16} />}
            tone="warning"
            delta={summary.outstanding.delta}
            deltaLabel={summary.outstanding.deltaLabel}
            supportingLines={[`${summary.outstanding.overdueInvoiceCount} overdue invoices`]}
            loading={loading}
            onClick={() => onOpenTab?.('finance')}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Cash Blocked"
            tooltip="Embassy / VFS fees paid and not yet recovered through client billing."
            value={data.blockedCash.amount}
            icon={<Lock size={16} />}
            tone="warning"
            supportingLines={[
              `${data.blockedCash.applicationCount} applications`,
              data.blockedCash.expectedReleaseLabel,
            ]}
            loading={loading}
            onClick={() => onOpenTab?.('work')}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Business Health"
            tooltip="Composite network health score (0–100) across revenue, delivery, and risk."
            value={`${summary.businessHealth.score} /100`}
            icon={<HeartPulse size={16} />}
            tone="positive"
            delta={summary.businessHealth.delta}
            deltaLabel={summary.businessHealth.deltaLabel}
            supportingLines={[summary.businessHealth.statusLabel]}
            loading={loading}
            onClick={() => onOpenTab?.('analytics')}
          />
        </Box>

        {/* Row 2 — Operational health */}
        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Active Applications"
            tooltip="Open applications in flight, with segment mix."
            value={summary.activeApplications.total}
            icon={<FileText size={16} />}
            tone="info"
            supportingLines={summary.activeApplications.segments.map(
              (s) => `${s.label} ${s.count.toLocaleString()}`,
            )}
            loading={loading}
            onClick={() => onNavigate?.('/admin/application-management/marine')}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Approval Rate"
            tooltip="Visa approval rate on a 30-day rolling basis."
            value={summary.approvalRate.value}
            icon={<CheckCircle2 size={16} />}
            tone="positive"
            delta={summary.approvalRate.delta}
            deltaLabel={summary.approvalRate.deltaLabel}
            loading={loading}
            onClick={() => onOpenTab?.('analytics')}
            footer={
              <Stack spacing={0.25}>
                <Typography color="text.secondary" sx={{ fontSize: 10, fontWeight: 600 }}>
                  30-day rolling
                </Typography>
                <Box sx={{ height: 32, mx: -0.5 }}>
                  <SparkLine data={sparkData} height={32} positive showTooltip={false} />
                </Box>
              </Stack>
            }
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Applications At Risk"
            tooltip="Applications breaching or approaching SLA thresholds."
            value={summary.atRisk.total}
            icon={<AlertTriangle size={16} />}
            tone="warning"
            supportingLines={[
              `Critical ${summary.atRisk.critical}`,
              `Warning ${summary.atRisk.warning}`,
            ]}
            loading={loading}
            onClick={() => onOpenTab?.('operations')}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Average TAT"
            tooltip="Average processing time from receipt to issue versus target."
            value={`${summary.averageTat.days} Days`}
            icon={<Clock size={16} />}
            tone={
              summary.averageTat.days <= summary.averageTat.targetDays ? 'positive' : 'warning'
            }
            delta={summary.averageTat.delta}
            deltaLabel={summary.averageTat.deltaLabel}
            supportingLines={[`Target ${summary.averageTat.targetDays} Days`]}
            loading={loading}
            onClick={() => onOpenTab?.('operations')}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Today's Applications"
            tooltip="Applications received today versus yesterday."
            value={summary.receivedToday.count}
            icon={<Inbox size={16} />}
            tone="info"
            delta={summary.receivedToday.delta}
            deltaLabel={summary.receivedToday.deltaLabel}
            loading={loading}
            onClick={() => onOpenTab?.('operations')}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Today's Submissions"
            tooltip="Applications submitted to embassy / VFS today versus yesterday."
            value={summary.submittedToday.count}
            icon={<Send size={16} />}
            tone="info"
            delta={summary.submittedToday.delta}
            deltaLabel={summary.submittedToday.deltaLabel}
            loading={loading}
            onClick={() => onOpenTab?.('operations')}
          />
        </Box>
      </Box>
    </InsightStack>
  )
}
