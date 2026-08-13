import { ACCOUNTS_CHART_COLORS } from '../data/accountsChartColors'
import type { AccountsClaimSheetRow, AccountsDashboardData } from '../types'

export type AccountsClaimSheetStageId = 'ready' | 'approved' | 'reconciled'

export interface AccountsClaimSheetSlice {
  key: AccountsClaimSheetStageId
  label: string
  value: number
  color: string
  count: number
  amountLabel: string
}

const STAGE_META: Record<
  AccountsClaimSheetStageId,
  { title: string; color: string; match: (row: AccountsClaimSheetRow) => boolean }
> = {
  ready: {
    title: 'Claim Sheet Ready',
    color: ACCOUNTS_CHART_COLORS.amber,
    match: (row) => row.status === 'Pending review',
  },
  approved: {
    title: 'Approved',
    color: ACCOUNTS_CHART_COLORS.green,
    match: (row) => row.status === 'Approved',
  },
  reconciled: {
    title: 'Reconciled',
    color: ACCOUNTS_CHART_COLORS.teal,
    match: (row) => row.status === 'Reconciled',
  },
}

function parseAmountInr(amount: string): number {
  const cleaned = amount.replace(/[₹,\s]/g, '').toUpperCase()
  if (cleaned.endsWith('L')) return (Number.parseFloat(cleaned) || 0) * 100000
  return Number.parseFloat(cleaned) || 0
}

function formatCompactInr(total: number): string {
  if (total >= 100000) {
    const lakhs = total / 100000
    return `₹${Number.isInteger(lakhs) ? lakhs.toFixed(0) : lakhs.toFixed(1)}L`
  }
  if (total >= 1000) return `₹${Math.round(total / 1000)}k`
  return `₹${Math.round(total).toLocaleString('en-IN')}`
}

function summarizeClaimSheetStage(
  rows: AccountsClaimSheetRow[],
  stage: AccountsClaimSheetStageId,
): { count: number; amount: number } {
  const matched = rows.filter(STAGE_META[stage].match)
  return {
    count: matched.length,
    amount: matched.reduce((sum, row) => sum + parseAmountInr(row.amount), 0),
  }
}

/** Claim sheet pipeline — ready · approved · reconciled (count + amount). */
export function buildAccountsClaimSheetSlices(data: AccountsDashboardData): AccountsClaimSheetSlice[] {
  return (Object.keys(STAGE_META) as AccountsClaimSheetStageId[])
    .map((stage) => {
      const { count, amount } = summarizeClaimSheetStage(data.claimSheetRows, stage)
      const amountLabel = formatCompactInr(amount)
      return {
        key: stage,
        label: `${STAGE_META[stage].title} (${count} · ${amountLabel})`,
        value: count,
        color: STAGE_META[stage].color,
        count,
        amountLabel,
      }
    })
    .filter((slice) => slice.value > 0)
}

export function getAccountsClaimSheetTotals(data: AccountsDashboardData): {
  count: number
  amountLabel: string
} {
  const stages = (Object.keys(STAGE_META) as AccountsClaimSheetStageId[]).map((stage) =>
    summarizeClaimSheetStage(data.claimSheetRows, stage),
  )
  const count = stages.reduce((sum, stage) => sum + stage.count, 0)
  const amount = stages.reduce((sum, stage) => sum + stage.amount, 0)
  return { count, amountLabel: formatCompactInr(amount) }
}
