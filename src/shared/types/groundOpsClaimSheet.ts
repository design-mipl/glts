import type { FundBankSettlementSummary } from '@/shared/types/fundUtilization'

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
  /** Frozen settlement KPIs at claim generation time. */
  kpis: FundBankSettlementSummary
  cases: ClaimSheetCaseSnapshot[]
  otherExpenses: ClaimSheetOtherExpense[]
  caseExpensesTotal: number
  otherExpensesTotal: number
  grandTotal: number
  proofDocuments: ClaimSheetProofDocument[]
  notes: string
}

export interface CreateGroundOpsClaimSheetInput {
  caseIds: string[]
  otherExpenses: Array<{ description: string; amount: number; proofFileName?: string }>
  notes?: string
  generatedBy: string
  team?: string
}

export const CLAIM_SHEET_STATUS_LABEL: Record<GroundOpsClaimSheetStatus, string> = {
  submitted: 'Submitted',
  under_review: 'Under review',
  approved: 'Approved',
  rejected: 'Rejected',
  settled: 'Settled',
}
