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

function listBankTransferAllocatedAmount(): { total: number; count: number } {
  const bankBatches = fundAllocationService
    .listAllocatedBatches()
    .filter(batch => isBankTransferAllocation(batch.fundTransfer?.transferType))

  return {
    total: bankBatches.reduce((sum, batch) => sum + batch.allocatedAmount, 0),
    count: bankBatches.length,
  }
}

function totalWithdrawnAmount(): number {
  return withdrawalStore.reduce((sum, entry) => sum + entry.amount, 0)
}

/**
 * Ground-ops spend applied to work (any payment mode):
 * selected services + additional expenses ({@link OperationalCase.actualExpense}).
 * Dispatch method charges are included only when case spend is otherwise zero
 * (avoids double-counting courier / airport / cargo lines mirrored into dispatch).
 */
function computeExpensesIncurredAmount(cases: OperationalCase[]): number {
  return cases.reduce((sum, record) => {
    const caseSpend = Math.max(0, record.actualExpense || 0)
    const dispatchPaid =
      record.dispatchDetails?.dispatchedAt != null
        ? resolveDispatchAmountPaid(record.dispatchDetails)
        : null

    const dispatchOnly =
      dispatchPaid != null && dispatchPaid > 0 && caseSpend === 0 ? dispatchPaid : 0

    return sum + caseSpend + dispatchOnly
  }, 0)
}

function isCashLikePaymentMode(mode: string | undefined): boolean {
  return mode === 'cash' || mode === 'cash_upi'
}

/**
 * Cash left the float only when payment mode is cash or cash+UPI.
 * Card payments do not reduce in-hand cash.
 */
function computeCashExpensesPaidAmount(cases: OperationalCase[]): number {
  return cases.reduce((sum, record) => {
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

    return sum + cashPaid
  }, 0)
}

export function computeOverallFundBankSettlementSummary(): FundBankSettlementSummary {
  const cases = operationalCaseHandlingService.list()
  const { total: allocatedAmount, count: bankAllocationCount } = listBankTransferAllocatedAmount()
  const totalWithdrawn = totalWithdrawnAmount()
  const safeAllocated = Number.isFinite(allocatedAmount) ? Math.max(0, allocatedAmount) : 0
  const expensesIncurred = Math.round(computeExpensesIncurredAmount(cases) * 100) / 100
  const cashExpensesPaid = Math.round(computeCashExpensesPaidAmount(cases) * 100) / 100
  const safeWithdrawn = Number.isFinite(totalWithdrawn) ? Math.max(0, totalWithdrawn) : 0

  return {
    allocatedAmount: safeAllocated,
    totalWithdrawn: safeWithdrawn,
    availableInBank: Math.max(0, safeAllocated - safeWithdrawn),
    inHandCash: Math.max(0, safeWithdrawn - cashExpensesPaid),
    expensesIncurred,
    settlementAmount: Math.round((expensesIncurred - safeAllocated) * 100) / 100,
    bankAllocationCount,
  }
}

export const fundUtilizationService = {
  computeOverallBankSettlementSummary: computeOverallFundBankSettlementSummary,

  listAllBankWithdrawals(): FundBankWithdrawalEntry[] {
    return withdrawalStore.map(cloneEntry).sort((a, b) => b.recordedAt.localeCompare(a.recordedAt))
  },

  recordBankWithdrawal(input: RecordFundBankWithdrawalInput): FundBankWithdrawalEntry {
    const summary = computeOverallFundBankSettlementSummary()
    const amount = Math.round(input.amount * 100) / 100

    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error('Withdrawal amount must be greater than zero.')
    }

    if (summary.bankAllocationCount === 0) {
      throw new Error('No bank transfer allocations are available for settlement.')
    }

    if (amount > summary.availableInBank) {
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
