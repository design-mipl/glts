import { useState, type ReactNode } from 'react'
import { Box } from '@mui/material'
import {
  CheckCircle2,
  FileText,
  GitBranch,
  HandCoins,
  IndianRupee,
  Percent,
  RefreshCw,
  Users,
  Wallet,
} from 'lucide-react'
import { DASHBOARD_SPACING } from '../../shared/constants'
import {
  ExecutiveKpiCard,
  type ExecutiveKpiPeriodKey,
} from './ExecutiveKpiCard'
import type {
  SuperAdminPeriodHero,
  SuperAdminRevenuePeriod,
  SuperAdminSegmentCommercialKpis,
} from '../types'

type PeriodKey = ExecutiveKpiPeriodKey

const PERIOD_OPTIONS: Array<{ value: PeriodKey; label: string }> = [
  { value: 'today', label: 'Today' },
  { value: 'mtd', label: 'MTD' },
  { value: 'ytd', label: 'YTD' },
]

function pickPeriod(hero: SuperAdminPeriodHero, key: PeriodKey): SuperAdminRevenuePeriod {
  return hero[key]
}

export interface SegmentCommercialKpiStripProps {
  data: SuperAdminSegmentCommercialKpis
  loading?: boolean
  /**
   * Retail: "Repeat customers". Marine / Corporate / B2B: "Repeat accounts".
   */
  repeatLabel?: string
  repeatTooltip?: string
}

/** Segments commercial KPIs — nine cards in two rows on desktop (5 + 4). */
export function SegmentCommercialKpiStrip({
  data,
  loading,
  repeatLabel = 'Repeat accounts',
  repeatTooltip = 'Share of applications from existing active client accounts.',
}: SegmentCommercialKpiStripProps) {
  const [revenuePeriod, setRevenuePeriod] = useState<PeriodKey>('mtd')
  const revenue = pickPeriod(data.revenue, revenuePeriod)
  const periodLabel = PERIOD_OPTIONS.find((o) => o.value === revenuePeriod)?.label

  const eligible =
    data.repeatEligibleApplications ??
    (typeof data.totalApplications === 'number'
      ? data.totalApplications
      : Number(data.totalApplications) || undefined)
  const repeatSupporting =
    data.repeatApplications != null && eligible != null
      ? [
          `${data.repeatApplications.toLocaleString()} of ${eligible.toLocaleString()} apps`,
        ]
      : undefined

  const gridSx = {
    display: 'grid',
    gap: DASHBOARD_SPACING.field,
    alignItems: 'stretch',
    gridTemplateColumns: {
      xs: 'repeat(2, minmax(0, 1fr))',
      sm: 'repeat(3, minmax(0, 1fr))',
      lg: 'repeat(5, minmax(0, 1fr))',
    },
  } as const

  const cells: Array<{ key: string; node: ReactNode }> = [
    {
      key: 'revenue',
      node: (
        <ExecutiveKpiCard
          title="Revenue"
          tooltip="Gross invoiced revenue for the selected period. Toggle Today / MTD / YTD."
          value={revenue.value}
          icon={<IndianRupee size={16} />}
          tone="info"
          delta={revenue.delta}
          deltaLabel={revenue.deltaLabel}
          supportingLines={revenue.targetLabel ? [revenue.targetLabel] : undefined}
          periodLabel={periodLabel}
          periodOptions={PERIOD_OPTIONS}
          periodKey={revenuePeriod}
          onPeriodChange={setRevenuePeriod}
          loading={loading}
        />
      ),
    },
    {
      key: 'margin',
      node: (
        <ExecutiveKpiCard
          title="Gross profit margin"
          tooltip="Net revenue as a share of gross invoiced revenue."
          value={data.grossMarginPercent}
          icon={<Percent size={16} />}
          tone="positive"
          delta={data.grossMarginDelta}
          deltaLabel={data.grossMarginDelta != null ? 'vs prior period' : undefined}
          loading={loading}
        />
      ),
    },
    {
      key: 'apps',
      node: (
        <ExecutiveKpiCard
          title="Total applications"
          tooltip="Total applications for this segment in the current period."
          value={data.totalApplications}
          icon={<FileText size={16} />}
          tone="info"
          delta={data.totalApplicationsDelta}
          deltaLabel={data.totalApplicationsDelta != null ? 'vs prior period' : undefined}
          loading={loading}
        />
      ),
    },
    {
      key: 'approval',
      node: (
        <ExecutiveKpiCard
          title="Approval %"
          tooltip="Embassy / VFS approval rate for this segment."
          value={data.approvalPercent}
          icon={<CheckCircle2 size={16} />}
          tone="positive"
          delta={data.approvalDelta}
          deltaLabel={data.approvalDelta != null ? 'vs prior period' : undefined}
          loading={loading}
        />
      ),
    },
    {
      key: 'repeat',
      node: (
        <ExecutiveKpiCard
          title={repeatLabel}
          tooltip={repeatTooltip}
          value={data.repeatRatePercent}
          icon={<RefreshCw size={16} />}
          tone={
            data.repeatRateDelta != null && data.repeatRateDelta < 0
              ? 'warning'
              : 'positive'
          }
          delta={data.repeatRateDelta}
          deltaLabel={data.repeatRateDelta != null ? 'vs prior period' : undefined}
          supportingLines={repeatSupporting}
          loading={loading}
        />
      ),
    },
    {
      key: 'outstanding',
      node: (
        <ExecutiveKpiCard
          title="Outstanding"
          tooltip="Open receivables for this segment."
          value={data.outstanding}
          icon={<Wallet size={16} />}
          tone="warning"
          delta={data.outstandingDelta}
          deltaLabel={data.outstandingDelta != null ? 'vs prior period' : undefined}
          loading={loading}
        />
      ),
    },
    {
      key: 'collections',
      node: (
        <ExecutiveKpiCard
          title="Collections"
          tooltip="Cash collected for this segment."
          value={data.collections}
          icon={<HandCoins size={16} />}
          tone="positive"
          delta={data.collectionsDelta}
          deltaLabel={data.collectionsDelta != null ? 'vs prior period' : undefined}
          loading={loading}
        />
      ),
    },
    {
      key: 'clients',
      node: (
        <ExecutiveKpiCard
          title="Active clients"
          tooltip="Active client accounts in this segment."
          value={data.activeClients}
          icon={<Users size={16} />}
          tone="neutral"
          delta={data.activeClientsDelta}
          deltaLabel={data.activeClientsDelta != null ? 'vs prior period' : undefined}
          loading={loading}
        />
      ),
    },
    {
      key: 'pipeline',
      node: (
        <ExecutiveKpiCard
          title="Pipeline value"
          tooltip="Estimated pipeline value for this segment."
          value={data.pipelineValue}
          icon={<GitBranch size={16} />}
          tone="info"
          delta={data.pipelineDelta}
          deltaLabel={data.pipelineDelta != null ? 'vs prior period' : undefined}
          loading={loading}
        />
      ),
    },
  ]

  return (
    <Box sx={gridSx}>
      {cells.map((cell) => (
        <Box key={cell.key} sx={{ minWidth: 0, height: '100%' }}>
          {cell.node}
        </Box>
      ))}
    </Box>
  )
}
