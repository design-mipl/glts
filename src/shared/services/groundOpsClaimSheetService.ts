import { getCurrentUser } from '@/shared/services/authService'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { computeOverallFundBankSettlementSummary } from '@/shared/services/fundUtilizationService'
import { SEED_GROUND_OPS_CLAIM_SHEETS } from '@/shared/data/mockGroundOpsClaimSheets'
import { resolveDispatchAmountPaid } from '@/shared/utils/logisticsDispatchChargeUtils'
import { isBankTransferAllocation } from '@/shared/constants/fundSettlementBankAccounts'
import type { FundTransferType } from '@/shared/types/fundAllocation'
import type { FundBankSettlementSummary } from '@/shared/types/fundUtilization'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import type {
  ClaimSheetCaseSnapshot,
  ClaimSheetOtherExpense,
  ClaimSheetProofDocument,
  ClaimSheetServiceLine,
  CreateGroundOpsClaimSheetInput,
  GroundOpsClaimSheet,
  GroundOpsClaimSheetStatus,
} from '@/shared/types/groundOpsClaimSheet'
import { canFinanceReviewClaimSheet, CLAIM_SHEET_STATUS_LABEL } from '@/shared/types/groundOpsClaimSheet'

function nowIso() {
  return new Date().toISOString()
}

function cloneSheet(sheet: GroundOpsClaimSheet): GroundOpsClaimSheet {
  return {
    ...sheet,
    kpis: { ...sheet.kpis },
    cases: sheet.cases.map(c => ({
      ...c,
      services: c.services.map(s => ({ ...s })),
      additionalExpenses: c.additionalExpenses.map(s => ({ ...s })),
      proofDocuments: c.proofDocuments.map(p => ({ ...p })),
    })),
    otherExpenses: sheet.otherExpenses.map(e => ({ ...e })),
    proofDocuments: sheet.proofDocuments.map(p => ({ ...p })),
  }
}

function generateClaimId(): string {
  return `gcs-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`
}

function generateClaimNumber(existingCount: number): string {
  const year = new Date().getFullYear()
  const seq = String(existingCount + 1).padStart(4, '0')
  return `CS-${year}-${seq}`
}

/** Prefer first allocated case transfer type; default bank for legacy/demo continuity. */
function resolveClaimFundTransferType(records: OperationalCase[]): FundTransferType | '' {
  for (const record of records) {
    const type = record.fundAllocation?.fundTransferType
    if (type) return type
  }
  return 'bank_transfer'
}

function computeNonBankClaimSettlementKpis(
  records: OperationalCase[],
  caseExpensesTotal: number,
  otherExpensesTotal: number,
): FundBankSettlementSummary {
  const allocatedAmount = Math.round(
    records.reduce((sum, record) => sum + Math.max(0, record.fundAllocation?.allocatedAmount ?? 0), 0) *
      100,
  ) / 100
  const expensesIncurred = Math.round((caseExpensesTotal + otherExpensesTotal) * 100) / 100

  return {
    allocatedAmount,
    totalWithdrawn: 0,
    availableInBank: 0,
    inHandCash: 0,
    expensesIncurred,
    settlementAmount: Math.round((expensesIncurred - allocatedAmount) * 100) / 100,
    bankAllocationCount: 0,
  }
}

function computeClaimSheetKpis(
  records: OperationalCase[],
  fundTransferType: FundTransferType | '',
  caseExpensesTotal: number,
  otherExpensesTotal: number,
): FundBankSettlementSummary {
  if (isBankTransferAllocation(fundTransferType)) {
    return computeOverallFundBankSettlementSummary()
  }
  return computeNonBankClaimSettlementKpis(records, caseExpensesTotal, otherExpensesTotal)
}

function selectedServiceLines(record: OperationalCase): ClaimSheetServiceLine[] {
  const lines: ClaimSheetServiceLine[] = []
  for (const service of record.groundServices) {
    if (!service.selected) continue
    lines.push({
      serviceName: service.serviceName,
      amount: service.actualAmount || service.prefilledAmount || 0,
      receiptFileName: service.receiptFileName,
    })
  }
  for (const service of record.applicationFees ?? []) {
    if (!service.selected) continue
    lines.push({
      serviceName: service.serviceName,
      amount: service.actualAmount || service.prefilledAmount || 0,
      receiptFileName: service.receiptFileName,
    })
  }
  for (const service of record.gltsOpsFees ?? []) {
    if (!service.selected) continue
    lines.push({
      serviceName: service.serviceName,
      amount: service.actualAmount || service.prefilledAmount || 0,
      receiptFileName: service.receiptFileName,
    })
  }
  return lines
}

function buildCaseSnapshot(record: OperationalCase): ClaimSheetCaseSnapshot {
  const services = selectedServiceLines(record)
  const additionalExpenses: ClaimSheetServiceLine[] = record.expenses.map(expense => ({
    serviceName: expense.serviceName,
    amount: expense.actualAmount || expense.prefilledAmount || 0,
    receiptFileName: expense.receiptFileName,
  }))

  const dispatchPaid =
    record.dispatchDetails?.dispatchedAt != null
      ? resolveDispatchAmountPaid(record.dispatchDetails) ?? 0
      : 0

  const serviceTotal = services.reduce((sum, s) => sum + s.amount, 0)
  const additionalTotal = additionalExpenses.reduce((sum, s) => sum + s.amount, 0)
  // Prefer case actualExpense when present; otherwise sum parts.
  const caseExpenseTotal =
    record.actualExpense > 0
      ? record.actualExpense
      : serviceTotal + additionalTotal + (dispatchPaid > 0 && record.actualExpense === 0 ? dispatchPaid : 0)

  const proofDocuments: ClaimSheetProofDocument[] = []
  let proofIndex = 0

  for (const service of services) {
    if (!service.receiptFileName?.trim()) continue
    proofIndex += 1
    proofDocuments.push({
      id: `${record.id}-svc-${proofIndex}`,
      label: `${service.serviceName} receipt`,
      fileName: service.receiptFileName,
      source: 'service',
      caseId: record.id,
    })
  }

  for (const expense of additionalExpenses) {
    if (!expense.receiptFileName?.trim()) continue
    proofIndex += 1
    proofDocuments.push({
      id: `${record.id}-exp-${proofIndex}`,
      label: `${expense.serviceName} receipt`,
      fileName: expense.receiptFileName,
      source: 'additional_expense',
      caseId: record.id,
    })
  }

  for (const name of record.attachmentNames ?? []) {
    if (!name.trim()) continue
    proofIndex += 1
    proofDocuments.push({
      id: `${record.id}-att-${proofIndex}`,
      label: 'Case attachment',
      fileName: name,
      source: 'case_attachment',
      caseId: record.id,
    })
  }

  return {
    caseId: record.id,
    operationalId: record.operationalId,
    passengerName: record.passengerName,
    applicationId: record.applicationId,
    companyName: record.companyName,
    country: record.country,
    visaType: record.visaType,
    services,
    additionalExpenses,
    dispatchCharge: dispatchPaid > 0 ? dispatchPaid : 0,
    caseExpenseTotal,
    proofDocuments,
  }
}

let claimStore: GroundOpsClaimSheet[] = SEED_GROUND_OPS_CLAIM_SHEETS.map(cloneSheet)

export const groundOpsClaimSheetService = {
  list(): GroundOpsClaimSheet[] {
    return claimStore.map(cloneSheet).sort((a, b) => b.generatedAt.localeCompare(a.generatedAt))
  },

  getById(id: string): GroundOpsClaimSheet | undefined {
    const found = claimStore.find(sheet => sheet.id === id)
    return found ? cloneSheet(found) : undefined
  },

  listCompletedCasesEligible(): OperationalCase[] {
    return operationalCaseHandlingService
      .list()
      .filter(row => row.status === 'Completed' || row.status === 'Dispatched')
  },

  create(input: CreateGroundOpsClaimSheetInput): GroundOpsClaimSheet {
    const caseIds = [...new Set(input.caseIds.map(id => id.trim()).filter(Boolean))]
    if (caseIds.length === 0) {
      throw new Error('Select at least one completed case.')
    }

    const records: OperationalCase[] = []
    const cases: ClaimSheetCaseSnapshot[] = []
    for (const caseId of caseIds) {
      const record = operationalCaseHandlingService.getById(caseId)
      if (!record) {
        throw new Error(`Case not found: ${caseId}`)
      }
      if (record.status !== 'Completed' && record.status !== 'Dispatched') {
        throw new Error(`${record.operationalId} is not eligible for claim (must be Completed or Dispatched).`)
      }
      records.push(record)
      cases.push(buildCaseSnapshot(record))
    }

    const otherExpenses: ClaimSheetOtherExpense[] = input.otherExpenses
      .map((row, index) => ({
        id: `other-${Date.now()}-${index}`,
        description: row.description.trim(),
        amount: Math.round((Number(row.amount) || 0) * 100) / 100,
        proofFileName: row.proofFileName?.trim() || undefined,
      }))
      .filter(row => row.description.length > 0 && row.amount > 0)

    const caseExpensesTotal = Math.round(cases.reduce((sum, c) => sum + c.caseExpenseTotal, 0) * 100) / 100
    const otherExpensesTotal = Math.round(otherExpenses.reduce((sum, e) => sum + e.amount, 0) * 100) / 100
    const fundTransferType = resolveClaimFundTransferType(records)

    const proofDocuments: ClaimSheetProofDocument[] = [
      ...cases.flatMap(c => c.proofDocuments),
      ...otherExpenses
        .filter(e => e.proofFileName)
        .map((e, index) => ({
          id: `claim-other-${index}`,
          label: e.description,
          fileName: e.proofFileName!,
          source: 'claim_other' as const,
        })),
    ]

    const currentUser = getCurrentUser()
    const sheet: GroundOpsClaimSheet = {
      id: generateClaimId(),
      claimNumber: generateClaimNumber(claimStore.length),
      status: 'submitted',
      generatedBy: input.generatedBy.trim() || currentUser?.name?.trim() || 'Ground Ops',
      generatedAt: nowIso(),
      team: input.team?.trim() || cases[0]?.companyName || 'Ground Operations',
      fundTransferType,
      kpis: computeClaimSheetKpis(records, fundTransferType, caseExpensesTotal, otherExpensesTotal),
      cases,
      otherExpenses,
      caseExpensesTotal,
      otherExpensesTotal,
      grandTotal: Math.round((caseExpensesTotal + otherExpensesTotal) * 100) / 100,
      proofDocuments,
      notes: input.notes?.trim() ?? '',
    }

    claimStore = [sheet, ...claimStore]
    return cloneSheet(sheet)
  },

  /** Stub download helpers — UI can toast success until real export is wired. */
  getPdfDownloadLabel(sheet: GroundOpsClaimSheet): string {
    return `${sheet.claimNumber}.pdf`
  },

  getProofsDownloadLabel(sheet: GroundOpsClaimSheet): string {
    return `${sheet.claimNumber}-proofs.zip`
  },

  approve(
    id: string,
  ): { ok: boolean; sheet?: GroundOpsClaimSheet; error?: string } {
    return this.updateReviewStatus(id, 'approved')
  },

  reject(
    id: string,
    reason?: string,
  ): { ok: boolean; sheet?: GroundOpsClaimSheet; error?: string } {
    return this.updateReviewStatus(id, 'rejected', reason)
  },

  updateReviewStatus(
    id: string,
    status: Extract<GroundOpsClaimSheetStatus, 'approved' | 'rejected'>,
    reason?: string,
  ): { ok: boolean; sheet?: GroundOpsClaimSheet; error?: string } {
    const index = claimStore.findIndex(sheet => sheet.id === id)
    if (index < 0) return { ok: false, error: 'Claim sheet not found.' }

    const existing = claimStore[index]
    if (!canFinanceReviewClaimSheet(existing.status)) {
      return {
        ok: false,
        error: `Cannot ${status === 'approved' ? 'approve' : 'reject'} a claim that is already ${CLAIM_SHEET_STATUS_LABEL[existing.status].toLowerCase()}.`,
      }
    }

    const currentUser = getCurrentUser()
    const updated: GroundOpsClaimSheet = {
      ...existing,
      status,
      reviewedAt: nowIso(),
      reviewedBy: currentUser?.name?.trim() || 'Finance',
      rejectionReason:
        status === 'rejected' ? reason?.trim() || undefined : undefined,
    }

    claimStore = [...claimStore.slice(0, index), updated, ...claimStore.slice(index + 1)]
    return { ok: true, sheet: cloneSheet(updated) }
  },

  resetToSeed() {
    claimStore = SEED_GROUND_OPS_CLAIM_SHEETS.map(cloneSheet)
  },
}
