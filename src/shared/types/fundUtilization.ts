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

export interface FundBankSettlementSummary {
  allocatedAmount: number
  totalWithdrawn: number
  availableInBank: number
  /**
   * Cash still held by Ground Ops: total withdrawn − cash expenses paid
   * (cash / cash+UPI only; card payments excluded).
   */
  inHandCash: number
  /** Ground-ops spend from selected services, additional expenses, and dispatch charges. */
  expensesIncurred: number
  /**
   * Net settlement vs Finance: expenses incurred − allocated amount.
   * Positive = Finance reimburses Ground Ops; negative = Ground Ops returns excess; zero = settled.
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
