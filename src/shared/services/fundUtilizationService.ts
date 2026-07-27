import { fundAllocationService } from '@/shared/services/fundAllocationService'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { SEED_FUND_BANK_WITHDRAWALS } from '@/shared/data/mockFundUtilizationWithdrawals'
import { isBankTransferAllocation } from '@/shared/constants/fundSettlementBankAccounts'
import { resolveDispatchAmountPaid } from '@/shared/utils/logisticsDispatchChargeUtils'
import type {
  FundBankSettlementSummary,
  FundBankWithdrawalEntry,
  RecordFundBankWithdrawalInput,
} from '@/shared/types/fundUtilization'
import { FUND_BANK_SETTLEMENT_POOL_ID } from '@/shared/types/fundUtilization'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'

function cloneEntry(entry: FundBankWithdrawalEntry): FundBankWithdrawalEntry {
  return { ...entry }
}

function nowIso() {
  return new Date().toISOString()
}

function generateWithdrawalId(): string {
  return `fbw-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
}

let withdrawalStore: FundBankWithdrawalEntry[] = SEED_FUND_BANK_WITHDRAWALS.map(cloneEntry)

/** Calendar day key YYYY-MM-DD (from ISO timestamp or already-dated string). */
export function toSettlementDateKey(value: string | Date): string {
  if (value instanceof Date) {
    const y = value.getFullYear()
    const m = String(value.getMonth() + 1).padStart(2, '0')
    const d = String(value.getDate()).padStart(2, '0')
    return `${y}-${m}-${d}`
  }
  const trimmed = value.trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed
  if (trimmed.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(trimmed)) return trimmed.slice(0, 10)
  const parsed = new Date(trimmed)
  if (!Number.isNaN(parsed.getTime())) return toSettlementDateKey(parsed)
  return trimmed
}

export function shiftSettlementDateKey(dateKey: string, deltaDays: number): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  date.setDate(date.getDate() + deltaDays)
  return toSettlementDateKey(date)
}

export function todaySettlementDateKey(): string {
  return toSettlementDateKey(new Date())
}

function listBankTransferBatches() {
  return fundAllocationService
    .listAllocatedBatches()
    .filter(batch => isBankTransferAllocation(batch.fundTransfer?.transferType))
}

function batchTransferDateKey(batch: { allocatedAt: string; fundTransfer?: { transferDate?: string } }): string {
  const transferDate = batch.fundTransfer?.transferDate?.trim()
  if (transferDate) return toSettlementDateKey(transferDate)
  return toSettlementDateKey(batch.allocatedAt)
}

function isCashLikePaymentMode(mode: string | undefined): boolean {
  return mode === 'cash' || mode === 'card_cash'
}

function caseExpenseDateKey(record: OperationalCase): string {
  if (record.paymentDate?.trim()) return toSettlementDateKey(record.paymentDate)
  if (record.operationalDate?.trim()) return toSettlementDateKey(record.operationalDate)
  if (record.lastUpdated?.trim()) return toSettlementDateKey(record.lastUpdated)
  return ''
}

/**
 * Ground-ops spend applied to work (any payment mode):
 * selected services + additional expenses ({@link OperationalCase.actualExpense}).
 * Dispatch method charges are included only when case spend is otherwise zero
 * (avoids double-counting courier / airport / cargo lines mirrored into dispatch).
 */
function caseExpensesIncurredAmount(record: OperationalCase): number {
  const caseSpend = Math.max(0, record.actualExpense || 0)
  const dispatchPaid =
    record.dispatchDetails?.dispatchedAt != null
      ? resolveDispatchAmountPaid(record.dispatchDetails)
      : null

  const dispatchOnly =
    dispatchPaid != null && dispatchPaid > 0 && caseSpend === 0 ? dispatchPaid : 0

  return caseSpend + dispatchOnly
}

/**
 * Cash left the float only when payment mode is cash or card+cash.
 * Card / UPI / DD payments do not reduce in-hand cash.
 */
function caseCashExpensesPaidAmount(record: OperationalCase): number {
  const caseIsCash = isCashLikePaymentMode(record.paymentMode)
  const caseSpend = Math.max(0, record.actualExpense || 0)
  const dispatchPaid =
    record.dispatchDetails?.dispatchedAt != null
      ? resolveDispatchAmountPaid(record.dispatchDetails)
      : null
  const dispatchIsCash = isCashLikePaymentMode(record.dispatchDetails?.paymentMode)

  let cashPaid = 0
  if (caseIsCash) cashPaid += caseSpend
  if (dispatchIsCash && dispatchPaid != null && dispatchPaid > 0) {
    if (!caseIsCash || caseSpend === 0) cashPaid += dispatchPaid
  }

  return cashPaid
}

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100
}

function sumWhere(amount: number, include: boolean): number {
  return include ? amount : 0
}

/**
 * Day reconciliation with ledger carry-forward:
 * prior closing bank / opening cash are derived from all movements before the selected day.
 */
export function computeOverallFundBankSettlementSummary(
  settlementDate?: string,
): FundBankSettlementSummary {
  const dateKey = toSettlementDateKey(settlementDate?.trim() || todaySettlementDateKey())
  const priorDateKey = shiftSettlementDateKey(dateKey, -1)

  const bankBatches = listBankTransferBatches()
  const cases = operationalCaseHandlingService.list()

  let fundsTransferred = 0
  let allocatedThroughDay = 0
  let transfersBeforeDay = 0

  for (const batch of bankBatches) {
    const amount = Math.max(0, batch.allocatedAmount || 0)
    const key = batchTransferDateKey(batch)
    if (!key) continue
    if (key < dateKey) transfersBeforeDay += amount
    if (key === dateKey) fundsTransferred += amount
    if (key <= dateKey) allocatedThroughDay += amount
  }

  let cashWithdrawn = 0
  let withdrawnBeforeDay = 0

  for (const entry of withdrawalStore) {
    const amount = Math.max(0, entry.amount || 0)
    const key = toSettlementDateKey(entry.recordedAt)
    if (key < dateKey) withdrawnBeforeDay += amount
    if (key === dateKey) cashWithdrawn += amount
  }

  let expensesOnDay = 0
  let cashExpensesBeforeDay = 0
  let cashExpensesOnDay = 0

  for (const record of cases) {
    const key = caseExpenseDateKey(record)
    if (!key) continue
    const incurred = caseExpensesIncurredAmount(record)
    const cashPaid = caseCashExpensesPaidAmount(record)
    expensesOnDay += sumWhere(incurred, key === dateKey)
    cashExpensesBeforeDay += sumWhere(cashPaid, key < dateKey)
    cashExpensesOnDay += sumWhere(cashPaid, key === dateKey)
  }

  // Prefer cash expenses for the cash statement; fall back to all-mode incurred on the day
  // when no cash-tagged payments exist (keeps the reconciliation line meaningful in demos).
  const expensesIncurred = roundMoney(
    cashExpensesOnDay > 0 ? cashExpensesOnDay : expensesOnDay,
  )

  const closingBankBalancePrior = roundMoney(Math.max(0, transfersBeforeDay - withdrawnBeforeDay))
  const availableBankBalance = roundMoney(closingBankBalancePrior + fundsTransferred)
  const closingBankBalance = roundMoney(Math.max(0, availableBankBalance - cashWithdrawn))

  const openingCashBalance = roundMoney(Math.max(0, withdrawnBeforeDay - cashExpensesBeforeDay))
  const totalCashAvailable = roundMoney(openingCashBalance + cashWithdrawn)
  const closingCashBalance = roundMoney(totalCashAvailable - expensesIncurred)

  const allocatedAmount = roundMoney(allocatedThroughDay)
  const safeWithdrawn = roundMoney(cashWithdrawn)

  return {
    settlementDate: dateKey,
    priorBankDate: priorDateKey,
    closingBankBalancePrior,
    fundsTransferred: roundMoney(fundsTransferred),
    availableBankBalance,
    cashWithdrawn: safeWithdrawn,
    closingBankBalance,
    openingCashBalance,
    totalCashAvailable,
    expensesIncurred,
    closingCashBalance,
    allocatedAmount,
    totalWithdrawn: safeWithdrawn,
    availableInBank: closingBankBalance,
    inHandCash: Math.max(0, closingCashBalance),
    settlementAmount: closingCashBalance,
    bankAllocationCount: bankBatches.length,
  }
}

export const fundUtilizationService = {
  computeOverallBankSettlementSummary: computeOverallFundBankSettlementSummary,

  listAllBankWithdrawals(): FundBankWithdrawalEntry[] {
    return withdrawalStore.map(cloneEntry).sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
  },

  recordBankWithdrawal(input: RecordFundBankWithdrawalInput): FundBankWithdrawalEntry {
    const summary = computeOverallFundBankSettlementSummary(todaySettlementDateKey())
    const amount = Math.round(input.amount * 100) / 100

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Withdrawal amount must be greater than zero.')
    }

    if (summary.bankAllocationCount === 0) {
      throw new Error('No bank transfer allocations are available for settlement.')
    }

    if (amount > summary.availableBankBalance) {
      throw new Error('Withdrawal amount exceeds available team bank balance.')
    }

    const withdrawnBy = input.withdrawnBy.trim()
    if (!withdrawnBy) {
      throw new Error('Select the team member who withdrew the funds.')
    }

    const entry: FundBankWithdrawalEntry = {
      id: generateWithdrawalId(),
      allocationBatchId: FUND_BANK_SETTLEMENT_POOL_ID,
      amount,
      withdrawnBy,
      remarks: input.remarks?.trim() ?? '',
      recordedBy: input.recordedBy.trim() || withdrawnBy,
      recordedAt: nowIso(),
    }

    withdrawalStore = [entry, ...withdrawalStore]
    return cloneEntry(entry)
  },

  /** Test / refresh helper — resets store to seed data. */
  resetToSeed() {
    withdrawalStore = SEED_FUND_BANK_WITHDRAWALS.map(cloneEntry)
  },
}
