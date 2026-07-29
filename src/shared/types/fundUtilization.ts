/** Aggregate pool for team bank withdrawals (not tied to a single allocation batch). */
export const FUND_BANK_SETTLEMENT_POOL_ID = 'ground-ops-bank-settlement-pool'

export interface FundBankWithdrawalEntry {
  id: string
  /** @deprecated Legacy per-batch link; new entries use {@link FUND_BANK_SETTLEMENT_POOL_ID}. */
  allocationBatchId: string
  amount: number
  /** Team member who physically withdrew from the bank. */
  withdrawnBy: string
  remarks: string
  /** Logged-in user who recorded the entry. */
  recordedBy: string
  recordedAt: string
}

/**
 * Day reconciliation + settlement snapshot for team bank float.
 *
 * Bank:
 *   availableBank = closingBankPrior + fundsTransferred
 *   closingBank   = availableBank − cashWithdrawn
 *
 * Cash:
 *   totalCash     = openingCash + cashWithdrawn
 *   closingCash   = totalCash − expensesIncurred
 *
 * Settlement amount = closing cash (positive → return to Accounts; negative → reimburse).
 *
 * Legacy aliases (`availableInBank`, `inHandCash`, `totalWithdrawn`) mirror the day fields
 * so claim-sheet KPI cards keep working.
 */
export interface FundBankSettlementSummary {
  /** Settlement calendar day (YYYY-MM-DD). Empty for unscopeable legacy snapshots. */
  settlementDate: string
  /** Previous calendar day (YYYY-MM-DD). */
  priorBankDate: string

  /** Closing bank balance at end of previous business day (carry-forward). */
  closingBankBalancePrior: number
  /** Bank-transfer allocations credited on the settlement day. */
  fundsTransferred: number
  /** Prior closing bank + funds transferred. */
  availableBankBalance: number
  /** Cash withdrawn from bank on the settlement day. */
  cashWithdrawn: number
  /** Available bank − cash withdrawn. */
  closingBankBalance: number

  /** Cash in hand brought forward from previous day’s closing. */
  openingCashBalance: number
  /** Opening cash + cash withdrawn. */
  totalCashAvailable: number
  /** Approved cash (and cash+UPI) expenses on the settlement day. */
  expensesIncurred: number
  /** Total cash available − expenses incurred. */
  closingCashBalance: number

  /** Cumulative bank-transfer allocations through settlement day (claim-sheet “Allocated”). */
  allocatedAmount: number
  /** @deprecated Prefer {@link cashWithdrawn}. */
  totalWithdrawn: number
  /** @deprecated Prefer {@link availableBankBalance}. */
  availableInBank: number
  /** @deprecated Prefer {@link closingCashBalance}. */
  inHandCash: number
  /**
   * Settlement vs Accounts = closing cash balance.
   * Positive = return to Accounts; negative = reimburse executive; zero = settled.
   */
  settlementAmount: number
  bankAllocationCount: number
}

export interface RecordFundBankWithdrawalInput {
  amount: number
  withdrawnBy: string
  remarks?: string
  recordedBy: string
}

export interface FundSettlementUserOption {
  value: string
  label: string
}
