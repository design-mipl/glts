import { useState, type ReactNode } from 'react'
import { Box } from '@mui/material'
import { HandCoins, IndianRupee, Percent, Wallet } from 'lucide-react'
import { InsightStack } from '../../dashboard-ui-kit'
import { DASHBOARD_SPACING } from '../../constants'
import type { DashboardCommercialHeroData, DashboardRevenuePeriod } from '../../types'
import {
  ExecutiveKpiCard,
  type ExecutiveKpiPeriodKey,
} from '../common/ExecutiveKpiCard'

const PERIOD_OPTIONS: Array<{ value: ExecutiveKpiPeriodKey; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'mtd', label: 'MTD' },
  { value: 'ytd', label: 'YTD' },
]

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
  period: DashboardRevenuePeriod
  periodKey: ExecutiveKpiPeriodKey
  onPeriodChange: (next: ExecutiveKpiPeriodKey) => void
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

export interface FinanceCommercialHeroStripProps {
  data: DashboardCommercialHeroData
  loading?: boolean
  onGrossRevenueClick?: () => void
  onNetRevenueClick?: () => void
  onCollectionsClick?: () => void
  onOutstandingClick?: () => void
}

/** Finance-only commercial KPIs — gross revenue · net revenue · collections · outstanding. */
export function FinanceCommercialHeroStrip({
  data,
  loading,
  onGrossRevenueClick,
  onNetRevenueClick,
  onCollectionsClick,
  onOutstandingClick,
}: FinanceCommercialHeroStripProps) {
  const [revenuePeriod, setRevenuePeriod] = useState<ExecutiveKpiPeriodKey>('mtd')
  const [collectionsPeriod, setCollectionsPeriod] = useState<ExecutiveKpiPeriodKey>('mtd')

  const revenue = data.revenueHero[revenuePeriod]
  const collections = data.collectionsHero[collectionsPeriod]

  const gridSx = {
    display: 'grid',
    gap: DASHBOARD_SPACING.field,
    alignItems: 'stretch',
    gridTemplateColumns: {
      xs: 'repeat(2, minmax(0, 1fr))',
      lg: 'repeat(4, minmax(0, 1fr))',
    },
  } as const

  return (
    <InsightStack spacing={DASHBOARD_SPACING.dense}>
      <Box role="group" aria-label="Commercial finance KPIs" sx={gridSx}>
        <Box sx={{ minWidth: 0, height: '100%' }}>
          <PeriodValueCard
            title="Gross Revenue"
            tooltip="Total invoice value raised for the selected period. Toggle Today / MTD / YTD."
            icon={<IndianRupee size={16} />}
            period={revenue}
            periodKey={revenuePeriod}
            onPeriodChange={setRevenuePeriod}
            loading={loading}
            onClick={onGrossRevenueClick}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Net Revenue"
            tooltip="GLTS earnings after pass-through costs. Gross margin shown as supporting context."
            value={data.netRevenue.value}
            icon={<Percent size={16} />}
            tone="positive"
            delta={data.netRevenue.delta}
            deltaLabel={data.netRevenue.deltaLabel}
            supportingLines={[`Gross margin ${data.netRevenue.marginPercent}`]}
            loading={loading}
            onClick={onNetRevenueClick}
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
            onClick={onCollectionsClick}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Outstanding"
            tooltip="Open receivables balance and overdue invoice count."
            value={data.outstanding.amount}
            icon={<Wallet size={16} />}
            tone="warning"
            delta={data.outstanding.delta}
            deltaLabel={data.outstanding.deltaLabel}
            supportingLines={[`${data.outstanding.overdueInvoiceCount} overdue invoices`]}
            loading={loading}
            onClick={onOutstandingClick}
          />
        </Box>
      </Box>
    </InsightStack>
  )
}
