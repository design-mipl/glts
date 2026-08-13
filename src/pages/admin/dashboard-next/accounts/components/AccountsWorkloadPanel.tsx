import { useMemo } from 'react'
import { DonutChart } from '@/design-system/UIComponents'
import { ChartPanel } from '../../shared'
import { ACCOUNTS_CHART_COLORS } from '../data/accountsChartColors'
import type { AccountsDashboardData } from '../types'
import { buildAccountsWorkloadSlices } from '../utils/accountsWorkloadUtils'

export interface AccountsWorkloadPanelProps {
  data: AccountsDashboardData
  loading?: boolean
}

/** Act-now workload mix — open items across finance desks. */
export function AccountsWorkloadPanel({ data, loading }: AccountsWorkloadPanelProps) {
  const workloadSlices = useMemo(() => buildAccountsWorkloadSlices(data), [data])
  const workloadTotal = workloadSlices.reduce((sum, s) => sum + s.value, 0)

  return (
    <ChartPanel
      title="Workload by desk"
      subtitle="Open reconciliations · claims · vendor · invoicing · funds"
      loading={loading}
    >
      <DonutChart
        data={
          workloadSlices.length > 0
            ? workloadSlices
            : [{ key: 'none', label: 'None', value: 1, color: ACCOUNTS_CHART_COLORS.slate }]
        }
        height={220}
        loading={loading}
        centerLabel="open"
        centerValue={String(workloadTotal)}
      />
    </ChartPanel>
  )
}
