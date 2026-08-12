/** Fixed claim-sheet expense options (tick + amount). */
export const CLAIM_SHEET_EXPENSE_OPTIONS = [
  { id: 'housekeeping', label: 'Office expenses – Housekeeping' },
  { id: 'water_cans', label: 'Office Expenses – Water Cans' },
  { id: 'parking', label: 'Parking Expenses' },
  { id: 'stationery', label: 'Office Expenses - Stationery purchase' },
] as const

export type ClaimSheetExpenseOptionId = (typeof CLAIM_SHEET_EXPENSE_OPTIONS)[number]['id']

export interface ClaimSheetExpenseDraft {
  id: ClaimSheetExpenseOptionId
  label: string
  selected: boolean
  amount: string
}

export function createEmptyClaimSheetExpenseDrafts(): ClaimSheetExpenseDraft[] {
  return CLAIM_SHEET_EXPENSE_OPTIONS.map(option => ({
    id: option.id,
    label: option.label,
    selected: false,
    amount: '',
  }))
}

function normalizeExpenseLabel(value: string): string {
  return value.trim().toLowerCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ')
}

/** Prefill fixed expense options from a saved claim sheet (edit/resubmit). */
export function claimSheetExpenseDraftsFromSheet(
  expenses: Array<{ description: string; amount: number }>,
): ClaimSheetExpenseDraft[] {
  const byLabel = new Map(
    expenses.map(expense => [normalizeExpenseLabel(expense.description), expense.amount] as const),
  )

  return CLAIM_SHEET_EXPENSE_OPTIONS.map(option => {
    const amount = byLabel.get(normalizeExpenseLabel(option.label))
    const selected = amount != null && amount > 0
    return {
      id: option.id,
      label: option.label,
      selected,
      amount: selected ? String(amount) : '',
    }
  })
}

export function selectedClaimSheetExpensesFromDrafts(
  drafts: ClaimSheetExpenseDraft[],
): Array<{ description: string; amount: number }> {
  return drafts
    .filter(row => row.selected)
    .map(row => ({
      description: row.label,
      amount: Number.parseFloat(row.amount.replace(/,/g, '')) || 0,
    }))
    .filter(row => row.amount > 0)
}
