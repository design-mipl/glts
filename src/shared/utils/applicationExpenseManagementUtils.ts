import type {
  BulkBatchRow,
  SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import { isBulkRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { resolveApplicationCompanyName } from '@/pages/customer/features/applications/utils/applicationCompanyUtils'
import type { ApplicationArrangedExpense } from '@/shared/types/applicationArrangedExpense'
import type {
  GroundServiceLine,
  OperationalCase,
  OperationalExpense,
} from '@/shared/types/operationalCaseHandling'
import { getOperationalPaymentModeLabel } from '@/shared/types/operationalCaseHandling'
import { getLogisticsPaymentModeLabel } from '@/shared/types/logisticsDispatch'
import type {
  ApplicationExpenseApprovalStatus,
  ApplicationExpenseDetailView,
  ApplicationExpenseFinanceKpis,
  ApplicationExpenseFinanceStatus,
  ApplicationExpenseListingFilters,
  ApplicationExpenseListingRow,
  ApplicationExpensePassengerSummaryRow,
  ApplicationExpensePaymentStatus,
  ApplicationExpenseRecord,
  ApplicationExpenseRollupApprovalStatus,
  ApplicationExpenseRollupPaymentStatus,
  ApplicationExpenseServiceSource,
  ApplicationExpenseType,
  ExpenseApprovalQueueRow,
} from '@/shared/types/applicationExpenseManagement'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { serviceMasterService } from '@/shared/services/serviceMasterService'
import { vendorService } from '@/shared/services/vendorService'
import {
  resolveAgreementAmountForDeliveryMethod,
  resolveCaseAgreedChargeForDeliveryMethod,
  resolveDispatchExpenseMeta,
} from '@/shared/utils/logisticsDispatchAgreementUtils'
import { resolveDispatchAmountPaid } from '@/shared/utils/logisticsDispatchChargeUtils'

const SERVICE_SOURCE_LABELS: Record<ApplicationExpenseServiceSource, string> = {
  glts_service: 'GLTS processing fees',
  vendor_service: 'Vendor Service',
  vfs_service: 'VFS Service',
  ground_staff_service: 'Ground Staff Service',
  embassy_consulate: 'Embassy / Consulate',
  courier_partner: 'Courier Partner',
  insurance_vendor: 'Insurance Vendor',
  ticket_vendor: 'Ticket Vendor',
  other: 'Other',
}

export function getServiceSourceLabel(source: ApplicationExpenseServiceSource): string {
  return SERVICE_SOURCE_LABELS[source] ?? source
}

function normalizeLookup(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase()
}

/** Vendor rate when vendor + service are mapped; otherwise 0. */
export function resolveVendorMappedCost(
  vendorName: string | undefined,
  serviceName: string | undefined,
): number {
  const vendorNeedle = normalizeLookup(vendorName)
  const serviceNeedle = normalizeLookup(serviceName)
  if (!vendorNeedle || !serviceNeedle) return 0

  const vendor = vendorService
    .list()
    .find(row => normalizeLookup(row.vendorName) === vendorNeedle)
  if (!vendor) return 0

  for (const mapping of vendor.serviceMappings) {
    if (mapping.status !== 'active') continue
    const service = serviceMasterService.getById(mapping.serviceMasterId)
    if (!service) continue
    if (normalizeLookup(service.serviceName) === serviceNeedle) {
      return mapping.vendorRate > 0 ? mapping.vendorRate : 0
    }
  }
  return 0
}

function groundOpsPayerIdentity(operationalCase: OperationalCase): {
  paidByUser?: string
  paidByTeam?: string
  paidByDepartment?: string
} {
  return {
    paidByUser: operationalCase.assignedExecutive?.trim() || undefined,
    paidByTeam: operationalCase.assignedTeam?.trim() || undefined,
    paidByDepartment: 'Ground Operations',
  }
}

function groundOpsPaymentModeLabel(operationalCase: OperationalCase): string | undefined {
  if (!operationalCase.paymentMode) return undefined
  return getOperationalPaymentModeLabel(operationalCase.paymentMode)
}

export function computeNetPayable(
  amount: number,
  gstIncluded: boolean,
  gstAmount: number,
  tdsApplicable: boolean,
  tdsAmount: number,
): number {
  const base = amount
  const gst = gstIncluded ? 0 : gstAmount
  const tds = tdsApplicable ? tdsAmount : 0
  return Math.max(0, Math.round((base + gst - tds) * 100) / 100)
}

export function deriveRollupApprovalStatus(
  expenses: ApplicationExpenseRecord[],
): ApplicationExpenseRollupApprovalStatus {
  if (expenses.length === 0) return 'none'
  const statuses = expenses.map(e => e.approvalStatus)
  if (statuses.some(s => s === 'clarification_required')) return 'clarification'
  if (statuses.some(s => s === 'rejected')) return 'rejected'
  if (statuses.every(s => s === 'approved')) return 'approved'
  if (statuses.some(s => s === 'pending_approval' || s === 'draft')) return 'pending'
  return 'partial'
}

export function deriveRollupPaymentStatus(
  expenses: ApplicationExpenseRecord[],
): ApplicationExpenseRollupPaymentStatus {
  if (expenses.length === 0) return 'none'
  const statuses = expenses.map(e => e.paymentStatus)
  if (statuses.every(s => s === 'paid')) return 'paid'
  if (statuses.some(s => s === 'pending_reimbursement')) return 'pending_reimbursement'
  if (statuses.some(s => s === 'partially_paid')) return 'partially_paid'
  if (statuses.every(s => s === 'not_paid')) return 'not_paid'
  return 'partially_paid'
}

export function deriveExpenseLineFinanceStatus(
  expense: ApplicationExpenseRecord,
): ApplicationExpenseFinanceStatus {
  if (expense.readyForReconciliation || expense.invoiceStatus === 'invoiced') {
    return 'reconciled'
  }
  if (expense.paymentStatus === 'paid' || expense.paymentStatus === 'pending_reimbursement') {
    return 'paid'
  }
  return 'needs_update'
}

export function deriveApplicationFinanceStatus(
  expenses: ApplicationExpenseRecord[],
): ApplicationExpenseFinanceStatus {
  if (expenses.length === 0) return 'needs_update'
  if (expenses.some(expense => deriveExpenseLineFinanceStatus(expense) === 'needs_update')) {
    return 'needs_update'
  }
  if (expenses.some(expense => deriveExpenseLineFinanceStatus(expense) === 'paid')) {
    return 'paid'
  }
  return 'reconciled'
}

export function countNeedsUpdateExpenses(expenses: ApplicationExpenseRecord[]): number {
  return expenses.filter(expense => deriveExpenseLineFinanceStatus(expense) === 'needs_update').length
}

export function financeStatusLabel(status: ApplicationExpenseFinanceStatus): string {
  const map: Record<ApplicationExpenseFinanceStatus, string> = {
    needs_update: 'Needs update',
    paid: 'Paid',
    reconciled: 'Reconciled',
  }
  return map[status]
}

export function financeStatusActionLabel(row: {
  financeStatus: ApplicationExpenseFinanceStatus
  needsUpdateCount: number
  totalExpense: number
}): string {
  if (row.financeStatus === 'needs_update') {
    if (row.needsUpdateCount > 0) {
      return row.needsUpdateCount === 1 ? '1 to confirm' : `${row.needsUpdateCount} to confirm`
    }
    return 'Add expense'
  }
  if (row.financeStatus === 'paid') return 'Awaiting reconciliation'
  return 'Ready for billing'
}

/** Confirmed or in-progress actuals must not be reset when assignment / ops syncs again. */
export function shouldPreserveExpenseActuals(existing: ApplicationExpenseRecord): boolean {
  if (!existing.isAutoGenerated) return true
  if (existing.amount > 0) return true
  return (
    existing.paymentStatus === 'paid' ||
    existing.paymentStatus === 'partially_paid' ||
    existing.paymentStatus === 'pending_reimbursement' ||
    Boolean(existing.readyForReconciliation) ||
    existing.invoiceStatus === 'invoiced' ||
    existing.proofStatus === 'uploaded' ||
    existing.proofStatus === 'verified' ||
    Boolean(existing.proofFileName)
  )
}

export function mergeAutoSyncedExpense(
  existing: ApplicationExpenseRecord | undefined,
  incoming: ApplicationExpenseRecord,
): ApplicationExpenseRecord {
  if (!existing) return incoming
  if (incoming.isAutoGenerated && shouldPreserveExpenseActuals(existing)) {
    return {
      ...existing,
      vendorStaffPartner: incoming.vendorStaffPartner,
      paidByUser: incoming.paidByUser,
      paidByTeam: incoming.paidByTeam,
      paidByDepartment: incoming.paidByDepartment,
      passengerMapping: incoming.passengerMapping,
      linkedService: incoming.linkedService,
    }
  }
  if (!existing || incoming.isAutoGenerated) return incoming
  return existing
}

export function computeFinanceKpis(expenses: ApplicationExpenseRecord[]): ApplicationExpenseFinanceKpis {
  const totalExpense = expenses.reduce((sum, e) => sum + e.netPayableAmount, 0)
  const autoAddedExpense = expenses
    .filter(e => e.isAutoGenerated)
    .reduce((sum, e) => sum + e.netPayableAmount, 0)
  const manualExpense = expenses
    .filter(e => !e.isAutoGenerated)
    .reduce((sum, e) => sum + e.netPayableAmount, 0)
  const pendingApproval = expenses
    .filter(e => e.approvalStatus === 'pending_approval' || e.approvalStatus === 'draft')
    .reduce((sum, e) => sum + e.netPayableAmount, 0)
  const approvedExpense = expenses
    .filter(e => e.approvalStatus === 'approved')
    .reduce((sum, e) => sum + e.netPayableAmount, 0)
  const rejectedExpense = expenses
    .filter(e => e.approvalStatus === 'rejected')
    .reduce((sum, e) => sum + e.netPayableAmount, 0)
  const paidAmount = expenses
    .filter(e => e.paymentStatus === 'paid')
    .reduce((sum, e) => sum + e.netPayableAmount, 0)
  const pendingPayment = expenses
    .filter(e => e.paymentStatus === 'not_paid' || e.paymentStatus === 'partially_paid')
    .reduce((sum, e) => sum + e.netPayableAmount, 0)

  return {
    totalExpense,
    autoAddedExpense,
    manualExpense,
    pendingApproval,
    approvedExpense,
    rejectedExpense,
    paidAmount,
    pendingPayment,
  }
}

/** Expenses shown on a passenger tab — direct mappings plus shared application/crew costs. */
export function filterExpensesForPassenger(
  expenses: ApplicationExpenseRecord[],
  passengerId: string,
): ApplicationExpenseRecord[] {
  return expenses.filter(expense => {
    const mapping = expense.passengerMapping
    if (mapping.scope === 'passenger' || mapping.scope === 'multiple_passengers') {
      return mapping.passengerIds?.includes(passengerId) ?? false
    }
    // Shared application / entire-crew costs also appear on each passenger view.
    if (mapping.scope === 'application' || mapping.scope === 'entire_crew') {
      return true
    }
    return false
  })
}

export function computePendingExpenseAmount(expenses: ApplicationExpenseRecord[]): number {
  return expenses
    .filter(
      e =>
        e.paymentStatus === 'not_paid' ||
        e.paymentStatus === 'partially_paid' ||
        e.paymentStatus === 'pending_reimbursement',
    )
    .reduce((sum, e) => sum + e.netPayableAmount, 0)
}

function crewCountFromRow(row: MarineApplicationRow): number {
  if (isBulkRow(row)) return row.totalApplicants
  return 1
}

function vesselFromRow(row: MarineApplicationRow): string {
  return row.vesselName?.trim() || '—'
}

export function buildListingRowFromApplication(
  row: MarineApplicationRow,
  expenses: ApplicationExpenseRecord[],
): ApplicationExpenseListingRow {
  const totalExpense = expenses.reduce((sum, e) => sum + e.netPayableAmount, 0)
  return {
    id: row.id,
    applicationId: row.id,
    companyName: resolveApplicationCompanyName(row),
    vesselName: vesselFromRow(row),
    crewCount: crewCountFromRow(row),
    visaCountry: row.country,
    visaType: row.visaType,
    jurisdiction: row.jurisdiction?.trim() || '—',
    submissionDate: row.submissionDate,
    totalExpense,
    pendingExpense: computePendingExpenseAmount(expenses),
    approvalStatus: deriveRollupApprovalStatus(expenses),
    paymentStatus: deriveRollupPaymentStatus(expenses),
    financeStatus: deriveApplicationFinanceStatus(expenses),
    needsUpdateCount: countNeedsUpdateExpenses(expenses),
    customerSegment: row.customerSegment,
    recordType: row.recordType,
    assignedTeamId: row.assignedTeamId,
    assignedUserId: row.assignedUserId,
    travelDate: row.travelDate,
    applicationStatus: row.operationalStatus,
  }
}

export function buildPassengerSummaries(
  passengers: ApplicationExpensePassengerSummaryRow[],
  expenses: ApplicationExpenseRecord[],
): ApplicationExpensePassengerSummaryRow[] {
  const passengerCount = Math.max(passengers.length, 1)
  const appLevelPerPassenger =
    expenses
      .filter(e => e.passengerMapping.scope === 'application')
      .reduce((sum, e) => sum + e.netPayableAmount, 0) / passengerCount
  const crewLevelPerPassenger =
    expenses
      .filter(e => e.passengerMapping.scope === 'entire_crew')
      .reduce((sum, e) => sum + e.netPayableAmount, 0) / passengerCount

  return passengers.map(passenger => {
    const directTotal = expenses
      .filter(expense => {
        const mapping = expense.passengerMapping
        if (mapping.scope === 'passenger' || mapping.scope === 'multiple_passengers') {
          return mapping.passengerIds?.includes(passenger.passengerId)
        }
        return false
      })
      .reduce((sum, e) => sum + e.netPayableAmount, 0)

    return {
      ...passenger,
      individualExpenseTotal:
        Math.round((directTotal + appLevelPerPassenger + crewLevelPerPassenger) * 100) / 100,
    }
  })
}

export function arrangedExpenseToManagementRecord(
  expense: ApplicationArrangedExpense,
): ApplicationExpenseRecord {
  const isInsurance = expense.category === 'travel_insurance'
  // Ticket / insurance arrangement amount is vendor outlay (Cost).
  // Total stays the same until an agreement quote is applied in finance.
  const costAmount = expense.amount
  const totalAmount = expense.amount
  return {
    id: `aem-arranged-${expense.id}`,
    expenseId: expense.id.toUpperCase(),
    applicationId: expense.applicationId,
    expenseName: expense.categoryLabel,
    expenseType: isInsurance ? 'travel_insurance' : 'flight_ticket',
    expenseTypeLabel: expense.categoryLabel,
    expenseSource: isInsurance ? 'insurance_related' : 'ticket_related',
    serviceSource: isInsurance ? 'insurance_vendor' : 'ticket_vendor',
    serviceSourceLabel: isInsurance ? 'Insurance Vendor' : 'Ticket Vendor',
    linkedService: expense.categoryLabel,
    passengerMapping: {
      scope: 'passenger',
      passengerIds: [expense.applicantId],
      displayLabel: expense.applicantName,
    },
    vendorStaffPartner: expense.vendorName,
    costAmount,
    amount: totalAmount,
    gstIncluded: true,
    gstAmount: 0,
    tdsApplicable: false,
    tdsAmount: 0,
    netPayableAmount: totalAmount,
    paymentStatus: expense.billingStatus === 'billed' ? 'paid' : 'not_paid',
    approvalStatus: 'approved',
    proofStatus: expense.documentFileName ? 'verified' : 'uploaded',
    proofFileName: expense.documentFileName,
    paidBy: 'glts_team',
    paidByUser: 'GLTS Document Upload',
    paidByTeam: 'Application Management',
    paidByDepartment: 'Operations',
    billTo: 'client',
    createdFrom: isInsurance ? 'insurance_upload' : 'ticket_upload',
    createdBy: 'GLTS Document Upload',
    createdDate: expense.createdAt,
    expenseDate: expense.createdAt.slice(0, 10),
    readyForReconciliation: expense.billingStatus === 'billed',
    invoiceStatus: expense.billingStatus === 'billed' ? 'invoiced' : 'not_invoiced',
    isAutoGenerated: true,
    updatedAt: expense.updatedAt,
  }
}

export interface GroundOpsPassengerRef {
  passengerId: string
  passengerName: string
}

/** Maps a ground-ops selected service name to finance expense categorization. */
function resolveGroundSelectedServiceMeta(serviceName: string): {
  expenseType: ApplicationExpenseType
  serviceSource: ApplicationExpenseServiceSource
} {
  switch (serviceName) {
    case 'Biometrics Coordination':
    case 'VFS Support':
      return { expenseType: 'vfs_booking_service', serviceSource: 'vfs_service' }
    case 'Courier':
      return { expenseType: 'courier_service', serviceSource: 'courier_partner' }
    case 'Printing':
      return { expenseType: 'documentation_service', serviceSource: 'vendor_service' }
    case 'Local Travel':
      return { expenseType: 'other', serviceSource: 'ground_staff_service' }
    default:
      return { expenseType: 'other', serviceSource: 'ground_staff_service' }
  }
}

function resolveGroundOpsPassenger(
  operationalCase: OperationalCase,
  passengers: GroundOpsPassengerRef[],
): GroundOpsPassengerRef | undefined {
  if (operationalCase.gltsApplicantId) {
    const match = passengers.find(p => p.passengerId === operationalCase.gltsApplicantId)
    if (match) return match
    return {
      passengerId: operationalCase.gltsApplicantId,
      passengerName: operationalCase.passengerName || operationalCase.gltsApplicantId,
    }
  }

  if (operationalCase.passengerName) {
    return {
      passengerId: operationalCase.id,
      passengerName: operationalCase.passengerName,
    }
  }

  if (passengers.length === 1) return passengers[0]
  if (operationalCase.applicantCount === 1 && passengers.length > 0) return passengers[0]
  return undefined
}

function buildGroundOpsExpenseRecord(
  operationalCase: OperationalCase,
  passenger: GroundOpsPassengerRef,
  lineId: string,
  expenseId: string,
  expenseName: string,
  costAmount: number,
  totalAmount: number,
  proofFileName?: string,
  remarks?: string,
): ApplicationExpenseRecord {
  const teamLabel = operationalCase.assignedTeam || 'Ground Team'
  const now = operationalCase.lastUpdated
  const { expenseType, serviceSource } = resolveGroundSelectedServiceMeta(expenseName)
  const payer = groundOpsPayerIdentity(operationalCase)
  const paymentMode = groundOpsPaymentModeLabel(operationalCase)
  const total = Math.max(0, totalAmount)
  const cost = Math.max(0, costAmount)

  return {
    id: lineId,
    expenseId,
    applicationId: operationalCase.applicationId,
    expenseName,
    expenseType,
    expenseTypeLabel: expenseName,
    expenseSource: 'ground_operations',
    serviceSource,
    serviceSourceLabel: getServiceSourceLabel(serviceSource),
    linkedService: expenseName,
    passengerMapping: {
      scope: 'passenger',
      passengerIds: [passenger.passengerId],
      displayLabel: passenger.passengerName,
    },
    vendorStaffPartner: teamLabel,
    costAmount: cost,
    amount: total,
    gstIncluded: false,
    gstAmount: 0,
    tdsApplicable: false,
    tdsAmount: 0,
    netPayableAmount: total,
    paymentStatus: 'pending_reimbursement',
    approvalStatus: 'approved',
    proofStatus: proofFileName ? 'uploaded' : 'missing',
    proofFileName,
    paidBy: 'ground_team',
    paidByUser: payer.paidByUser,
    paidByTeam: payer.paidByTeam,
    paidByDepartment: payer.paidByDepartment,
    paymentMode,
    billTo: 'client',
    createdFrom: 'ground_operations',
    createdBy: operationalCase.assignedExecutive || teamLabel,
    createdDate: now,
    expenseDate: operationalCase.operationalDate,
    remarks,
    isAutoGenerated: true,
    updatedAt: now,
  }
}

function groundServiceToExpenseRecord(
  operationalCase: OperationalCase,
  passenger: GroundOpsPassengerRef,
  service: GroundServiceLine,
  index: number,
): ApplicationExpenseRecord | undefined {
  if (!service.selected || service.actualAmount <= 0) return undefined

  const costAmount = service.actualAmount
  const totalAmount = service.prefilledAmount > 0 ? service.prefilledAmount : service.actualAmount

  return buildGroundOpsExpenseRecord(
    operationalCase,
    passenger,
    `aem-go-${operationalCase.id}-${service.id}`,
    `EXP-GO-${operationalCase.id.replace(/[^A-Z0-9]/gi, '').slice(-8)}-${String(index + 1).padStart(2, '0')}`,
    service.serviceName,
    costAmount,
    totalAmount,
    service.receiptFileName,
    service.remarks,
  )
}

function extraOperationalExpenseToRecord(
  operationalCase: OperationalCase,
  passenger: GroundOpsPassengerRef,
  expense: OperationalExpense,
  index: number,
): ApplicationExpenseRecord | undefined {
  if (expense.actualAmount <= 0) return undefined

  const costAmount = expense.actualAmount
  const totalAmount = expense.prefilledAmount > 0 ? expense.prefilledAmount : expense.actualAmount

  return buildGroundOpsExpenseRecord(
    operationalCase,
    passenger,
    `aem-go-${operationalCase.id}-exp-${expense.id}`,
    `EXP-GO-X-${operationalCase.id.replace(/[^A-Z0-9]/gi, '').slice(-6)}-${String(index + 1).padStart(2, '0')}`,
    expense.serviceName,
    costAmount,
    totalAmount,
    expense.receiptFileName,
    expense.remarks,
  )
}

function logisticsRefundToExpenseRecord(
  operationalCase: OperationalCase,
  passenger: GroundOpsPassengerRef,
): ApplicationExpenseRecord | undefined {
  const refund = operationalCase.refundDetails
  if (!refund || refund.amount <= 0 || !refund.vendorId?.trim()) return undefined

  const expenseName = `Consulate refund · ${refund.vendorName}`
  const caseKey = operationalCase.id.replace(/[^A-Z0-9]/gi, '').slice(-8)
  const now = refund.recordedAt || operationalCase.lastUpdated || new Date().toISOString()
  const payer = groundOpsPayerIdentity(operationalCase)
  const mappedCost = resolveVendorMappedCost(refund.vendorName, 'Consulate refund')

  return {
    id: `aem-go-refund-${operationalCase.id}`,
    expenseId: `EXP-GO-RF-${caseKey}`,
    applicationId: operationalCase.applicationId,
    expenseName,
    expenseType: 'embassy_fee',
    expenseTypeLabel: expenseName,
    expenseSource: 'ground_operations',
    serviceSource: 'embassy_consulate',
    serviceSourceLabel: getServiceSourceLabel('embassy_consulate'),
    linkedService: 'Logistics consulate refund',
    passengerMapping: {
      scope: 'passenger',
      passengerIds: [passenger.passengerId],
      displayLabel: passenger.passengerName,
    },
    vendorStaffPartner: refund.vendorName,
    costAmount: mappedCost > 0 ? mappedCost : refund.amount,
    amount: refund.amount,
    gstIncluded: false,
    gstAmount: 0,
    tdsApplicable: false,
    tdsAmount: 0,
    netPayableAmount: refund.amount,
    paymentStatus: 'paid',
    approvalStatus: 'approved',
    proofStatus: 'not_required',
    paidBy: 'vendor',
    paidByUser: payer.paidByUser,
    paidByTeam: payer.paidByTeam,
    paidByDepartment: 'Tracking & Logistics',
    paymentMode: groundOpsPaymentModeLabel(operationalCase),
    billTo: 'client',
    createdFrom: 'ground_operations',
    createdBy: refund.recordedBy || operationalCase.assignedExecutive || 'Tracking & Logistics',
    createdDate: now,
    expenseDate: now.slice(0, 10),
    remarks: refund.remarks,
    isAutoGenerated: true,
    updatedAt: now,
  }
}

function groundFeeLineToExpenseRecord(
  operationalCase: OperationalCase,
  passenger: GroundOpsPassengerRef,
  fee: GroundServiceLine,
  linePrefix: string,
  expenseIdSuffix: string,
  paidBy: ApplicationExpenseRecord['paidBy'],
  index: number,
  kind: 'onsite_fee' | 'onsite_expense' = 'onsite_fee',
): ApplicationExpenseRecord | undefined {
  if (!fee.selected) return undefined

  let costAmount = 0
  let totalAmount = 0

  if (kind === 'onsite_fee') {
    // Country Master prefilled → Total Amount.
    totalAmount = fee.prefilledAmount > 0 ? fee.prefilledAmount : fee.actualAmount
    costAmount =
      fee.actualAmount > 0
        ? fee.actualAmount
        : resolveVendorMappedCost(undefined, fee.serviceName)
    if (totalAmount <= 0) return undefined
  } else {
    // Onsite expenses — actual → Cost; agreement/prefilled → Total.
    if (fee.actualAmount <= 0 && fee.prefilledAmount <= 0) return undefined
    costAmount = fee.actualAmount > 0 ? fee.actualAmount : 0
    totalAmount = fee.prefilledAmount > 0 ? fee.prefilledAmount : fee.actualAmount
  }

  if (totalAmount <= 0 && costAmount <= 0) return undefined
  if (totalAmount <= 0) totalAmount = costAmount

  const record = buildGroundOpsExpenseRecord(
    operationalCase,
    passenger,
    `${linePrefix}-${operationalCase.id}-${fee.id}`,
    `EXP-GO-${expenseIdSuffix}-${String(index + 1).padStart(2, '0')}`,
    fee.serviceName,
    costAmount,
    totalAmount,
    fee.receiptFileName,
    fee.remarks,
  )
  return {
    ...record,
    paidBy,
    paymentStatus: paidBy === 'customer' ? 'paid' : record.paymentStatus,
    approvalStatus: paidBy === 'customer' ? 'approved' : record.approvalStatus,
    proofStatus: fee.receiptFileName ? 'uploaded' : paidBy === 'customer' ? 'not_required' : 'missing',
    paidByUser: paidBy === 'customer' ? passenger.passengerName : record.paidByUser,
    paidByDepartment:
      paidBy === 'customer'
        ? 'Customer'
        : paidBy === 'glts_team'
          ? 'GLTS Operations'
          : record.paidByDepartment,
  }
}

function logisticsDispatchToExpenseRecord(
  operationalCase: OperationalCase,
  passenger: GroundOpsPassengerRef,
): ApplicationExpenseRecord | undefined {
  const dispatch = operationalCase.dispatchDetails
  if (!dispatch?.dispatchedAt || !dispatch.deliveryMethod) return undefined

  const method = dispatch.deliveryMethod
  const expenseName = method
  const caseKey = operationalCase.id.replace(/[^A-Z0-9]/gi, '').slice(-8)
  const now = dispatch.dispatchedAt || operationalCase.lastUpdated || new Date().toISOString()
  const payer = groundOpsPayerIdentity(operationalCase)
  const vendorName = dispatch.courierPartner?.trim() || 'Logistics Dispatch'
  const { expenseType, serviceSource } = resolveDispatchExpenseMeta(method)

  // Cost = actual outlay entered on dispatch; Total = commercial agreement (then case prefill / vendor map).
  const actualCharge = resolveDispatchAmountPaid(dispatch)
  const costAmount = actualCharge != null && actualCharge > 0 ? actualCharge : 0
  const agreementTotal = resolveAgreementAmountForDeliveryMethod({
    companyName: operationalCase.companyName,
    deliveryMethod: method,
    country: operationalCase.country,
    visaType: operationalCase.visaType,
  })
  const caseAgreed =
    resolveCaseAgreedChargeForDeliveryMethod(operationalCase, method) ?? 0
  const vendorMapped =
    resolveVendorMappedCost(vendorName, method) ||
    resolveVendorMappedCost(vendorName, 'Courier') ||
    0
  const totalAmount =
    agreementTotal > 0
      ? agreementTotal
      : caseAgreed > 0
        ? caseAgreed
        : vendorMapped > 0
          ? vendorMapped
          : costAmount

  if (totalAmount <= 0 && costAmount <= 0) return undefined

  return {
    id: `aem-go-dispatch-${operationalCase.id}`,
    expenseId: `EXP-GO-DS-${caseKey}`,
    applicationId: operationalCase.applicationId,
    expenseName,
    expenseType,
    expenseTypeLabel: expenseName,
    expenseSource: 'ground_operations',
    serviceSource,
    serviceSourceLabel: getServiceSourceLabel(serviceSource),
    linkedService: method,
    passengerMapping: {
      scope: 'passenger',
      passengerIds: [passenger.passengerId],
      displayLabel: passenger.passengerName,
    },
    vendorStaffPartner: vendorName,
    costAmount,
    amount: totalAmount,
    gstIncluded: false,
    gstAmount: 0,
    tdsApplicable: false,
    tdsAmount: 0,
    netPayableAmount: totalAmount,
    paymentStatus: 'pending_reimbursement',
    approvalStatus: 'approved',
    proofStatus: 'missing',
    paidBy: 'ground_team',
    paidByUser: payer.paidByUser,
    paidByTeam: payer.paidByTeam,
    paidByDepartment: 'Tracking & Logistics',
    paymentMode: dispatch.paymentMode
      ? getLogisticsPaymentModeLabel(dispatch.paymentMode)
      : groundOpsPaymentModeLabel(operationalCase),
    billTo: 'client',
    createdFrom: 'ground_operations',
    createdBy: operationalCase.assignedExecutive || 'Tracking & Logistics',
    createdDate: now,
    expenseDate: dispatch.paymentDate || now.slice(0, 10),
    remarks: dispatch.remarks,
    isAutoGenerated: true,
    updatedAt: now,
  }
}

/** Converts ground-operations case lines into finance expense records (passenger-mapped). */
export function syncOperationalCasesToExpenseRecords(
  operationalCases: OperationalCase[],
  passengers: GroundOpsPassengerRef[],
): ApplicationExpenseRecord[] {
  const records: ApplicationExpenseRecord[] = []

  for (const operationalCase of operationalCases) {
    const passenger = resolveGroundOpsPassenger(operationalCase, passengers)
    if (!passenger) continue

    const caseKey = operationalCase.id.replace(/[^A-Z0-9]/gi, '').slice(-8)

    operationalCase.groundServices.forEach((service, index) => {
      const record = groundServiceToExpenseRecord(operationalCase, passenger, service, index)
      if (record) records.push(record)
    })

    const feePaidBy =
      operationalCase.applicationFeesPaidBy === 'passenger' ? 'customer' : 'glts_team'
    operationalCase.applicationFees.forEach((fee, index) => {
      const record = groundFeeLineToExpenseRecord(
        operationalCase,
        passenger,
        fee,
        'aem-go-fee',
        `F${caseKey}`,
        feePaidBy,
        index,
        'onsite_fee',
      )
      if (record) records.push(record)
    })

    ;(operationalCase.gltsOpsFees ?? []).forEach((fee, index) => {
      const record = groundFeeLineToExpenseRecord(
        operationalCase,
        passenger,
        fee,
        'aem-go-ops',
        `O${caseKey}`,
        'ground_team',
        index,
        'onsite_expense',
      )
      if (record) records.push(record)
    })

    operationalCase.expenses.forEach((expense, index) => {
      const record = extraOperationalExpenseToRecord(operationalCase, passenger, expense, index)
      if (record) records.push(record)
    })

    const refund = logisticsRefundToExpenseRecord(operationalCase, passenger)
    if (refund) records.push(refund)

    const dispatch = logisticsDispatchToExpenseRecord(operationalCase, passenger)
    if (dispatch) records.push(dispatch)
  }

  return records
}

export interface AssignmentVendorExpenseInput {
  applicationId: string
  gltsApplicantId: string
  passengerName: string
  assignedVendor: string
  assignedUser?: string
  operationalDate?: string
  lastUpdated?: string
  /** Catalog / fund-allocation estimate when ground ops has not yet entered actuals. */
  estimatedAmount?: number
}

/** Assignment & Priority vendor allocation — expense line updated later by ground ops. */
export function assignmentVendorToExpenseRecord(
  input: AssignmentVendorExpenseInput,
): ApplicationExpenseRecord {
  const now = input.lastUpdated || new Date().toISOString()
  const amount = input.estimatedAmount && input.estimatedAmount > 0 ? input.estimatedAmount : 0
  const vendorLabel = [input.assignedVendor, input.assignedUser].filter(Boolean).join(' · ')

  return {
    id: `aem-asgn-vendor-${input.applicationId}-${input.gltsApplicantId}`,
    expenseId: `EXP-ASGN-${input.gltsApplicantId.replace(/[^A-Z0-9]/gi, '').slice(-8)}`,
    applicationId: input.applicationId,
    expenseName: 'Vendor Processing Service',
    expenseType: 'vendor_service',
    expenseTypeLabel: 'Vendor Processing Service',
    expenseSource: 'vendor_service',
    serviceSource: 'vendor_service',
    serviceSourceLabel: getServiceSourceLabel('vendor_service'),
    linkedService: 'Assignment & Priority vendor allocation',
    passengerMapping: {
      scope: 'passenger',
      passengerIds: [input.gltsApplicantId],
      displayLabel: input.passengerName,
    },
    vendorStaffPartner: vendorLabel,
    costAmount: resolveVendorMappedCost(input.assignedVendor, 'Vendor Processing Service'),
    amount,
    gstIncluded: false,
    gstAmount: 0,
    tdsApplicable: false,
    tdsAmount: 0,
    netPayableAmount: amount,
    paymentStatus: 'not_paid',
    approvalStatus: 'approved',
    proofStatus: 'missing',
    paidBy: 'vendor',
    billTo: 'client',
    createdFrom: 'vendor_service',
    createdBy: 'Assignment & Priority',
    createdDate: now,
    expenseDate: input.operationalDate || now.slice(0, 10),
    remarks:
      amount > 0
        ? 'Estimated amount — confirm actuals and proof'
        : 'Vendor payment pending confirmation',
    isAutoGenerated: true,
    updatedAt: now,
  }
}

export interface FundAllocationExpenseInput {
  applicationId: string
  gltsApplicantId: string
  passengerName: string
  serviceId: string
  serviceName: string
  amount: number
  gstIncluded?: boolean
  allocatedAt?: string
  cardName?: string
  allocatedTo?: string
}

/** Fund Allocation selected VFS / embassy services mapped per passenger. */
export function fundAllocationServiceToExpenseRecord(
  input: FundAllocationExpenseInput,
): ApplicationExpenseRecord {
  const now = input.allocatedAt || new Date().toISOString()
  const gstAmount = input.gstIncluded ? Math.round(input.amount * 0.18 * 100) / 100 : 0

  return {
    id: `aem-fund-${input.applicationId}-${input.gltsApplicantId}-${input.serviceId}`,
    expenseId: `EXP-FUND-${input.serviceId.replace(/[^A-Z0-9]/gi, '').slice(-8) || 'SVC'}`,
    applicationId: input.applicationId,
    expenseName: input.serviceName,
    expenseType: 'vfs_booking_service',
    expenseTypeLabel: input.serviceName,
    expenseSource: 'application_service',
    serviceSource: 'vfs_service',
    serviceSourceLabel: getServiceSourceLabel('vfs_service'),
    linkedService: 'Fund Allocation',
    passengerMapping: {
      scope: 'passenger',
      passengerIds: [input.gltsApplicantId],
      displayLabel: input.passengerName,
    },
    vendorStaffPartner: input.allocatedTo || input.cardName || 'Fund Allocation',
    costAmount: 0,
    amount: input.amount,
    gstIncluded: Boolean(input.gstIncluded),
    gstAmount,
    tdsApplicable: false,
    tdsAmount: 0,
    netPayableAmount: input.amount,
    paymentStatus: 'paid',
    approvalStatus: 'approved',
    proofStatus: 'not_required',
    paidBy: 'glts_team',
    paidByUser: input.allocatedTo,
    paidByTeam: 'Fund Allocation',
    paidByDepartment: 'Finance',
    billTo: 'client',
    createdFrom: 'application_service',
    createdBy: 'Fund Allocation',
    createdDate: now,
    expenseDate: now.slice(0, 10),
    readyForReconciliation: true,
    isAutoGenerated: true,
    updatedAt: now,
  }
}

/**
 * Assignment passenger-self payment row — when processing is allocated to the passenger.
 */
export function assignmentPassengerPaymentToExpenseRecord(input: {
  applicationId: string
  gltsApplicantId: string
  passengerName: string
  assignedUser?: string
  operationalDate?: string
  lastUpdated?: string
  amount?: number
}): ApplicationExpenseRecord {
  const now = input.lastUpdated || new Date().toISOString()
  const amount = input.amount && input.amount > 0 ? input.amount : 0

  return {
    id: `aem-asgn-paxpay-${input.applicationId}-${input.gltsApplicantId}`,
    expenseId: `EXP-PAX-${input.gltsApplicantId.replace(/[^A-Z0-9]/gi, '').slice(-8)}`,
    applicationId: input.applicationId,
    expenseName: 'Passenger Self Payment',
    expenseType: 'visa_processing_fee',
    expenseTypeLabel: 'Passenger Self Payment',
    expenseSource: 'application_service',
    serviceSource: 'embassy_consulate',
    serviceSourceLabel: getServiceSourceLabel('embassy_consulate'),
    linkedService: 'Passenger-paid visa / VFS charges',
    passengerMapping: {
      scope: 'passenger',
      passengerIds: [input.gltsApplicantId],
      displayLabel: input.passengerName,
    },
    vendorStaffPartner: input.assignedUser
      ? `Passenger · ${input.assignedUser}`
      : `Passenger · ${input.passengerName}`,
    costAmount: 0,
    amount,
    gstIncluded: false,
    gstAmount: 0,
    tdsApplicable: false,
    tdsAmount: 0,
    netPayableAmount: amount,
    paymentStatus: 'not_paid',
    approvalStatus: 'approved',
    proofStatus: 'missing',
    paidBy: 'customer',
    paidByUser: input.passengerName,
    paidByTeam: input.assignedUser,
    paidByDepartment: 'Customer',
    billTo: 'client',
    createdFrom: 'application_service',
    createdBy: 'Assignment & Priority',
    createdDate: now,
    expenseDate: input.operationalDate || now.slice(0, 10),
    remarks:
      amount > 0
        ? 'Estimated amount — confirm actuals and proof'
        : 'Passenger payment pending confirmation',
    isAutoGenerated: true,
    updatedAt: now,
  }
}

export function matchesListingSearch(
  row: ApplicationExpenseListingRow,
  query: string,
  passengerNames: string[] = [],
): boolean {
  const q = query.trim().toLowerCase()
  if (!q) return true
  const haystack = [
    row.applicationId,
    row.companyName,
    row.vesselName,
    row.visaCountry,
    row.jurisdiction,
    ...passengerNames,
  ]
    .join(' ')
    .toLowerCase()
  return haystack.includes(q)
}

export function applyListingFilters(
  rows: ApplicationExpenseListingRow[],
  filters: ApplicationExpenseListingFilters,
): ApplicationExpenseListingRow[] {
  return rows.filter(row => {
    if (filters.applicationId && !row.applicationId.toLowerCase().includes(filters.applicationId.toLowerCase())) {
      return false
    }
    if (filters.company && row.companyName.toLowerCase() !== filters.company.toLowerCase()) return false
    if (filters.vessel && row.vesselName.toLowerCase() !== filters.vessel.toLowerCase()) return false
    if (filters.visaCountry && row.visaCountry.toLowerCase() !== filters.visaCountry.toLowerCase()) {
      return false
    }
    if (filters.jurisdiction && row.jurisdiction.toLowerCase() !== filters.jurisdiction.toLowerCase()) {
      return false
    }
    if (filters.approvalStatus && row.approvalStatus !== filters.approvalStatus) return false
    if (filters.paymentStatus && row.paymentStatus !== filters.paymentStatus) return false
    if (filters.submissionDateFrom && row.submissionDate < filters.submissionDateFrom) return false
    if (filters.submissionDateTo && row.submissionDate > filters.submissionDateTo) return false
    return true
  })
}

export function getListingCellValue(row: ApplicationExpenseListingRow, key: string): string {
  switch (key) {
    case 'applicationId':
      return row.applicationId
    case 'companyName':
      return row.companyName
    case 'vesselName':
      return row.vesselName
    case 'crewCount':
      return String(row.crewCount)
    case 'visaCountryVisaType':
      return `${row.visaCountry} · ${row.visaType}`
    case 'jurisdiction':
      return row.jurisdiction
    case 'submissionDate':
      return row.submissionDate
    case 'totalExpense':
      return formatInr(row.totalExpense)
    case 'pendingExpense':
      return formatInr(row.pendingExpense)
    case 'approvalStatus':
      return row.approvalStatus
    case 'paymentStatus':
      return row.paymentStatus
    case 'financeStatus':
      return financeStatusLabel(row.financeStatus)
    case 'actionNeeded':
      return financeStatusActionLabel(row)
    default:
      return ''
  }
}

export function buildApprovalQueueRows(
  expenses: ApplicationExpenseRecord[],
  listingLookup: Map<string, ApplicationExpenseListingRow>,
): ExpenseApprovalQueueRow[] {
  return expenses
    .filter(e => e.approvalStatus === 'pending_approval' || e.approvalStatus === 'clarification_required')
    .map(expense => {
      const listing = listingLookup.get(expense.applicationId)
      return {
        id: expense.id,
        expenseRecordId: expense.id,
        applicationId: expense.applicationId,
        companyName: listing?.companyName ?? '—',
        expenseName: expense.expenseName,
        serviceSourceLabel: expense.serviceSourceLabel,
        vendorStaffPartner: expense.vendorStaffPartner ?? '—',
        passengerMappingLabel: expense.passengerMapping.displayLabel,
        amount: expense.netPayableAmount,
        proofStatus: expense.proofStatus,
        createdBy: expense.createdBy,
        createdDate: expense.createdDate.slice(0, 10),
        approvalStatus: expense.approvalStatus,
        customerSegment: listing?.customerSegment ?? 'marine',
      }
    })
    .sort((a, b) => b.createdDate.localeCompare(a.createdDate))
}

export function canApproveExpense(expense: ApplicationExpenseRecord): { ok: boolean; reason?: string } {
  if (expense.approvalStatus !== 'pending_approval' && expense.approvalStatus !== 'clarification_required') {
    return { ok: false, reason: 'Expense is not pending approval.' }
  }
  if (
    expense.proofStatus !== 'uploaded' &&
    expense.proofStatus !== 'verified' &&
    expense.proofStatus !== 'not_required'
  ) {
    return { ok: false, reason: 'Proof is mandatory before approval.' }
  }
  return { ok: true }
}

export function approvalStatusLabel(status: ApplicationExpenseApprovalStatus): string {
  const map: Record<ApplicationExpenseApprovalStatus, string> = {
    draft: 'Draft',
    pending_approval: 'Pending Approval',
    approved: 'Approved',
    rejected: 'Rejected',
    clarification_required: 'Clarification Required',
  }
  return map[status]
}

export function paymentStatusLabel(status: ApplicationExpensePaymentStatus): string {
  const map: Record<ApplicationExpensePaymentStatus, string> = {
    not_paid: 'Not Paid',
    paid: 'Paid',
    partially_paid: 'Partially Paid',
    pending_reimbursement: 'Pending Reimbursement',
  }
  return map[status]
}

export function rollupApprovalStatusLabel(status: ApplicationExpenseRollupApprovalStatus): string {
  const map: Record<ApplicationExpenseRollupApprovalStatus, string> = {
    none: 'No Expenses',
    pending: 'Pending',
    partial: 'Partial',
    approved: 'Approved',
    rejected: 'Rejected',
    clarification: 'Clarification',
  }
  return map[status]
}

export function rollupPaymentStatusLabel(status: ApplicationExpenseRollupPaymentStatus): string {
  const map: Record<ApplicationExpenseRollupPaymentStatus, string> = {
    none: 'No Expenses',
    not_paid: 'Not Paid',
    partially_paid: 'Partially Paid',
    paid: 'Paid',
    pending_reimbursement: 'Pending Reimbursement',
  }
  return map[status]
}

export function segmentEmptyStateCopy(_segment: ApplicationCustomerSegment) {
  return {
    title: 'No submitted applications',
    description: 'No submitted applications available yet for this segment.',
  }
}

export function financeStatusEmptyStateCopy(status: ApplicationExpenseFinanceStatus) {
  if (status === 'needs_update') {
    return {
      title: 'Nothing needs update',
      description: 'Vendor and passenger payments awaiting amount or proof will appear here.',
    }
  }
  if (status === 'paid') {
    return {
      title: 'No paid expenses waiting',
      description: 'Confirmed payments that still need reconciliation will appear here.',
    }
  }
  return {
    title: 'No reconciled applications',
    description: 'Applications fully reconciled and ready for billing will appear here.',
  }
}

export type { ApplicationExpenseDetailView, SingleApplicationRow, BulkBatchRow }
