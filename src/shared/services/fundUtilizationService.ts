import { fundAllocationService } from '@/shared/services/fundAllocationService'
import { SEED_FUND_BANK_WITHDRAWALS } from '@/shared/data/mockFundUtilizationWithdrawals'
import { isBankTransferAllocation } from '@/shared/constants/fundSettlementBankAccounts'
import type {
  FundBankSettlementSummary,
  FundBankWithdrawalEntry,
  RecordFundBankWithdrawalInput,
} from '@/shared/types/fundUtilization'
import { FUND_BANK_SETTLEMENT_POOL_ID } from '@/shared/types/fundUtilization'

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

export function computeOverallFundBankSettlementSummary(): FundBankSettlementSummary {
  const { total: allocatedAmount, count: bankAllocationCount } = listBankTransferAllocatedAmount()
  const totalWithdrawn = totalWithdrawnAmount()
  const safeAllocated = Number.isFinite(allocatedAmount) ? Math.max(0, allocatedAmount) : 0

  return {
    allocatedAmount: safeAllocated,
    totalWithdrawn,
    availableInBank: Math.max(0, safeAllocated - totalWithdrawn),
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
