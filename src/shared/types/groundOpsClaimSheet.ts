import type { FundTransferType } from '@/shared/types/fundAllocation'
import { getFundTransferTypeLabel } from '@/shared/types/fundAllocation'
import type { FundBankSettlementSummary } from '@/shared/types/fundUtilization'
import { isBankTransferAllocation } from '@/shared/constants/fundSettlementBankAccounts'

export type GroundOpsClaimSheetStatus =
  | 'submitted'
  | 'under_review'
  | 'approved'
  | 'rejected'
  | 'settled'

export interface ClaimSheetServiceLine {
  serviceName: string
  amount: number
  receiptFileName?: string
}

export interface ClaimSheetOtherExpense {
  id: string
  description: string
  amount: number
  proofFileName?: string
}

export interface ClaimSheetProofDocument {
  id: string
  label: string
  fileName: string
  source: 'service' | 'additional_expense' | 'dispatch' | 'case_attachment' | 'claim_other'
  caseId?: string
}

export interface ClaimSheetCaseSnapshot {
  caseId: string
  operationalId: string
  passengerName: string
  applicationId: string
  companyName: string
  country: string
  visaType: string
  services: ClaimSheetServiceLine[]
  additionalExpenses: ClaimSheetServiceLine[]
  dispatchCharge: number
  caseExpenseTotal: number
  proofDocuments: ClaimSheetProofDocument[]
}

export interface GroundOpsClaimSheet {
  id: string
  claimNumber: string
  status: GroundOpsClaimSheetStatus
  generatedBy: string
  generatedAt: string
  team: string
  /**
   * Frozen fund transfer type from selected cases at claim generation.
   * Drives which settlement KPI cards Finance / Ground Ops see.
   */
  fundTransferType: FundTransferType | ''
  /** Frozen settlement KPIs at claim generation time. */
  kpis: FundBankSettlementSummary
  cases: ClaimSheetCaseSnapshot[]
  otherExpenses: ClaimSheetOtherExpense[]
  caseExpensesTotal: number
  otherExpensesTotal: number
  grandTotal: number
  proofDocuments: ClaimSheetProofDocument[]
  notes: string
  reviewedAt?: string
  reviewedBy?: string
  rejectionReason?: string
}

export interface CreateGroundOpsClaimSheetInput {
  caseIds: string[]
  otherExpenses: Array<{ description: string; amount: number; proofFileName?: string }>
  notes?: string
  generatedBy: string
  team?: string
}

export type ResubmitGroundOpsClaimSheetInput = CreateGroundOpsClaimSheetInput

export const CLAIM_SHEET_STATUS_LABEL: Record<GroundOpsClaimSheetStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under review',
  approved: 'Approved',
  rejected: 'Rejected',
  settled: 'Settled',
}

/** Statuses Finance can still approve or reject (pre-approval review). */
export function canFinanceReviewClaimSheet(status: GroundOpsClaimSheetStatus): boolean {
  return status === 'submitted' || status === 'under_review'
}

/**
 * Approved (or settled) claim sheets can be rejected from Reconciliation
 * when Accounts cannot book / match the settlement.
 */
export function canRejectClaimSheetFromReconciliation(status: GroundOpsClaimSheetStatus): boolean {
  return status === 'approved' || status === 'settled'
}

/** Ground Ops may edit and resubmit only after Finance rejection. */
export function canGroundOpsEditClaimSheet(status: GroundOpsClaimSheetStatus): boolean {
  return status === 'rejected'
}

export function getClaimSheetStatusBadgeColor(
  status: GroundOpsClaimSheetStatus,
): 'info' | 'warning' | 'success' | 'error' | 'neutral' {
  switch (status) {
    case 'submitted':
      return 'info'
    case 'under_review':
      return 'warning'
    case 'approved':
      return 'success'
    case 'rejected':
      return 'error'
    case 'settled':
      return 'neutral'
    default:
      return 'neutral'
  }
}

/** Bank transfer claims show the full bank-float KPI set. */
export function isClaimSheetBankTransferKpis(
  fundTransferType: FundTransferType | '' | undefined,
): boolean {
  return isBankTransferAllocation(fundTransferType)
}

export function getClaimSheetFundTransferLabel(
  fundTransferType: FundTransferType | '' | undefined,
): string {
  return getFundTransferTypeLabel(fundTransferType)
}
