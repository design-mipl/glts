import { useMemo, useState, type ReactNode } from 'react'
import { Box } from '@mui/material'
import {
  Banknote,
  FileText,
  HandCoins,
  IndianRupee,
  Landmark,
  Percent,
  Scale,
  Send,
  Wallet,
} from 'lucide-react'
import { InsightStack } from '../../shared/dashboard-ui-kit'
import { DASHBOARD_SPACING } from '../../shared/constants'
import {
  ExecutiveKpiCard,
  type ExecutiveKpiPeriodKey,
} from '../../shared/widgets/common/ExecutiveKpiCard'
import type { DashboardRevenuePeriod } from '../../shared/types'
import type { AccountsDashboardData } from '../types'
import { buildAccountsHeroKpiModel } from '../utils/accountsHeroKpiUtils'

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
  extraSupportingLines,
}: {
  title: string
  tooltip: string
  icon: ReactNode
  period: DashboardRevenuePeriod
  periodKey: ExecutiveKpiPeriodKey
  onPeriodChange: (next: ExecutiveKpiPeriodKey) => void
  loading?: boolean
  onClick?: () => void
  extraSupportingLines?: string[]
}) {
  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === periodKey)?.label
  const supportingLines = [
    ...(extraSupportingLines ?? []),
    ...(period.targetLabel ? [period.targetLabel] : []),
  ]

  return (
    <ExecutiveKpiCard
      title={title}
      value={period.value}
      tooltip={tooltip}
      icon={icon}
      tone="info"
      delta={period.delta}
      deltaLabel={period.deltaLabel}
      supportingLines={supportingLines.length > 0 ? supportingLines : undefined}
      periodLabel={periodLabel}
      periodOptions={PERIOD_OPTIONS}
      periodKey={periodKey}
      onPeriodChange={onPeriodChange}
      loading={loading}
      onClick={onClick}
    />
  )
}

export interface AccountsHeroStripProps {
  data: AccountsDashboardData
  loading?: boolean
  onOpenPerformance?: () => void
  onOpenInvoices?: () => void
  onOpenWork?: () => void
  onOpenReconciliation?: () => void
  onOpenFinance?: () => void
}

/** Accounts top KPIs — 10-card executive finance strip. */
export function AccountsHeroStrip({
  data,
  loading,
  onOpenPerformance,
  onOpenInvoices,
  onOpenWork,
  onOpenReconciliation,
  onOpenFinance,
}: AccountsHeroStripProps) {
  const [revenuePeriod, setRevenuePeriod] = useState<ExecutiveKpiPeriodKey>('mtd')
  const [collectionsPeriod, setCollectionsPeriod] = useState<ExecutiveKpiPeriodKey>('mtd')

  const model = useMemo(() => buildAccountsHeroKpiModel(data), [data])
  const hero = model.commercialHero

  const revenue = hero.revenueHero[revenuePeriod]
  const collections = hero.collectionsHero[collectionsPeriod]
  const invoicedCountPeriod = hero.invoicedCountHero?.[revenuePeriod]
  const invoicedCount = invoicedCountPeriod?.value ?? model.totalInvoicedCount

  const netRevenueLines = [
    hero.netRevenue.serviceFees && hero.netRevenue.inwardOutward
      ? `Service fees ${hero.netRevenue.serviceFees} · I/W ${hero.netRevenue.inwardOutward}`
      : null,
    `Gross margin ${hero.netRevenue.marginPercent}`,
  ].filter((line): line is string => line != null)

  const gridSx = {
    display: 'grid',
    gap: DASHBOARD_SPACING.field,
    alignItems: 'stretch',
    gridTemplateColumns: {
      xs: 'repeat(2, minmax(0, 1fr))',
      md: 'repeat(3, minmax(0, 1fr))',
      lg: 'repeat(5, minmax(0, 1fr))',
    },
  } as const

  return (
    <InsightStack spacing={DASHBOARD_SPACING.dense}>
      <Box role="group" aria-label="Accounts finance KPIs" sx={gridSx}>
        <Box sx={{ minWidth: 0, height: '100%' }}>
          <PeriodValueCard
            title="Gross Revenue"
            tooltip="Total invoiced value for the selected period — amount and invoice count."
            icon={<IndianRupee size={16} />}
            period={revenue}
            periodKey={revenuePeriod}
            onPeriodChange={setRevenuePeriod}
            loading={loading}
            onClick={onOpenPerformance}
            extraSupportingLines={[`${Number(invoicedCount).toLocaleString('en-IN')} invoices`]}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Net Revenue"
            tooltip="GLTS earnings — service fees and inward/outward (I/W) pass-through."
            value={hero.netRevenue.value}
            icon={<Percent size={16} />}
            tone="positive"
            delta={hero.netRevenue.delta}
            deltaLabel={hero.netRevenue.deltaLabel}
            supportingLines={netRevenueLines}
            loading={loading}
            onClick={onOpenPerformance}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Client submissions due"
            tooltip="Invoice submissions to clients still due or awaiting data."
            value={model.submissionsDueCount}
            icon={<Send size={16} />}
            tone="warning"
            supportingLines={['Submissions to clients to be done']}
            loading={loading}
            onClick={onOpenWork}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Invoices submitted"
            tooltip="Total client invoice submissions completed in the period."
            value={model.invoicesSubmittedCount}
            icon={<FileText size={16} />}
            tone="info"
            supportingLines={[`${model.invoicesSubmittedAmount} submitted MTD`]}
            loading={loading}
            onClick={onOpenInvoices}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Outstanding"
            tooltip="Open receivables balance and overdue invoice count."
            value={hero.outstanding.amount}
            icon={<Wallet size={16} />}
            tone="warning"
            delta={hero.outstanding.delta}
            deltaLabel={hero.outstanding.deltaLabel}
            supportingLines={[`${hero.outstanding.overdueInvoiceCount} overdue invoices`]}
            loading={loading}
            onClick={onOpenInvoices}
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
            onClick={onOpenPerformance}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Pending collections"
            tooltip="Invoices open for collection — count and outstanding amount."
            value={model.pendingCollectionsCount}
            icon={<Banknote size={16} />}
            tone="warning"
            supportingLines={[`${model.pendingCollectionsAmount} open AR`]}
            loading={loading}
            onClick={onOpenInvoices}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Cash blocked"
            tooltip="Embassy/VFS and pass-through cash blocked awaiting client invoice."
            value={model.cashBlockedAmount}
            icon={<Landmark size={16} />}
            tone="warning"
            supportingLines={[`${model.cashBlockedApps} applications blocked`]}
            loading={loading}
            onClick={onOpenFinance}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Invoices pending"
            tooltip="Cases and unbilled expenses awaiting invoice generation."
            value={model.invoicesPendingCount}
            icon={<FileText size={16} />}
            tone="warning"
            supportingLines={[`${model.invoicesPendingAmount} to invoice`]}
            loading={loading}
            onClick={onOpenWork}
          />
        </Box>

        <Box sx={{ minWidth: 0, height: '100%' }}>
          <ExecutiveKpiCard
            title="Reconciliation pending"
            tooltip="Insurance, tickets, couriers, and credit-card reconciliations open."
            value={model.reconciliationPendingCount}
            icon={<Scale size={16} />}
            tone="warning"
            supportingLines={['Insurance · tickets · couriers · cards']}
            loading={loading}
            onClick={onOpenReconciliation}
          />
        </Box>
      </Box>
    </InsightStack>
  )
}
