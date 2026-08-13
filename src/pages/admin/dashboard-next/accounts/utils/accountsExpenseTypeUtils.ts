import { ACCOUNTS_CHART_COLORS } from '../data/accountsChartColors'
import type { AccountsDashboardData, AccountsExpenseDailyRow } from '../types'

export type AccountsExpenseTypeId =
  | 'credit_card'
  | 'claim_sheet_cash'
  | 'insurance'
  | 'tickets'
  | 'consulate_bank'

export interface AccountsExpenseTypeSlice {
  key: AccountsExpenseTypeId
  label: string
  value: number
  color: string
}

const EXPENSE_TYPE_META: Record<
  AccountsExpenseTypeId,
  { label: string; color: string }
> = {
  credit_card: {
    label: 'Credit Card',
    color: ACCOUNTS_CHART_COLORS.coral,
  },
  claim_sheet_cash: {
    label: 'Claim sheet cash',
    color: ACCOUNTS_CHART_COLORS.teal,
  },
  insurance: {
    label: 'Insurance',
    color: ACCOUNTS_CHART_COLORS.blue,
  },
  tickets: {
    label: 'Tickets',
    color: ACCOUNTS_CHART_COLORS.violet,
  },
  consulate_bank: {
    label: 'Consulate bank',
    color: ACCOUNTS_CHART_COLORS.amber,
  },
}

function isClaimSheetCashExpense(row: AccountsExpenseDailyRow): boolean {
  if (row.pack === 'claim_sheet_cash') return true
  if (row.pack !== 'cash') return false
  const haystack = `${row.detail} ${row.reference} ${row.packLabel}`.toLowerCase()
  return haystack.includes('claim')
}

function isConsulateBankExpense(row: AccountsExpenseDailyRow): boolean {
  if (row.pack === 'consulate_bank') return true
  const haystack = `${row.detail} ${row.packLabel} ${row.vendor}`.toLowerCase()
  return haystack.includes('consulate') || haystack.includes('embassy fee · bank')
}

function countClaimSheetCashExpenses(data: AccountsDashboardData): number {
  const fromExpenseRows = data.expenseDailyRows.filter(isClaimSheetCashExpense).length
  if (fromExpenseRows > 0) return fromExpenseRows

  return data.claimSheetRows.filter((row) => row.status !== 'Rejected').length
}

/** Expense mix by operational type — overview donut. */
export function buildAccountsExpenseTypeSlices(
  data: AccountsDashboardData,
): AccountsExpenseTypeSlice[] {
  const counts: Record<AccountsExpenseTypeId, number> = {
    credit_card: data.expenseDailyRows.filter((row) => row.pack === 'credit_card').length,
    claim_sheet_cash: countClaimSheetCashExpenses(data),
    insurance: data.expenseDailyRows.filter((row) => row.pack === 'insurance').length,
    tickets: data.expenseDailyRows.filter((row) => row.pack === 'ticketing').length,
    consulate_bank: data.expenseDailyRows.filter(isConsulateBankExpense).length,
  }

  return (Object.keys(EXPENSE_TYPE_META) as AccountsExpenseTypeId[])
    .map((key) => ({
      key,
      label: EXPENSE_TYPE_META[key].label,
      value: counts[key],
      color: EXPENSE_TYPE_META[key].color,
    }))
    .filter((slice) => slice.value > 0)
}
