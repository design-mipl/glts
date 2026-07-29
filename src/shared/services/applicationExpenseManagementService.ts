import {
  mockBulkBatches,
  mockSingleApplications,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationCustomerSegment } from '@/pages/customer/features/applications/types/applicationListing.types'
import { GLTS_MAR_1025_CREW, SEED_APPLICATION_EXPENSES, SEED_APPLICATION_EXPENSE_VERSION } from '@/shared/data/mockApplicationExpenses'
import { applicationArrangedExpenseService } from '@/shared/services/applicationArrangedExpenseService'
import { marineApplicationAdminService } from '@/shared/services/marineApplicationAdminService'
import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import { teamService } from '@/shared/services/teamService'
import { adminPortalUserService } from '@/shared/services/adminPortalUserService'
import type {
  ApplicationExpenseDetailView,
  ApplicationExpenseListingFilters,
  ApplicationExpenseListingRow,
  ApplicationExpensePassengerSummaryRow,
  ApplicationExpenseRecord,
  ExpenseApprovalQueueRow,
  UpsertApplicationExpenseInput,
} from '@/shared/types/applicationExpenseManagement'
import { GLTS_MAR_1025_APPLICATION_ID } from '@/shared/types/applicationExpenseManagement'
import {
  arrangedExpenseToManagementRecord,
  assignmentPassengerPaymentToExpenseRecord,
  assignmentVendorToExpenseRecord,
  buildApprovalQueueRows,
  buildListingRowFromApplication,
  buildPassengerSummaries,
  computeFinanceKpis,
  fundAllocationServiceToExpenseRecord,
  getServiceSourceLabel,
  syncOperationalCasesToExpenseRecords,
} from '@/shared/utils/applicationExpenseManagementUtils'
import { fundAllocationService } from '@/shared/services/fundAllocationService'
import { operationalPassengerAssignmentService } from '@/shared/services/operationalPassengerAssignmentService'

const STORAGE_KEY = 'glts:application-expense-management'
const SEED_VERSION_KEY = 'glts:application-expense-management-seed-version'

type ExpenseStore = Record<string, ApplicationExpenseRecord>

function mergeSeedExpenses(store: ExpenseStore): ExpenseStore {
  let changed = false
  for (const expense of SEED_APPLICATION_EXPENSES) {
    if (!store[expense.id]) {
      store[expense.id] = expense
      changed = true
    }
  }
  if (changed) writeStore(store)
  return store
}

function readStore(): ExpenseStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const storedVersion = Number(localStorage.getItem(SEED_VERSION_KEY) ?? '0')
    if (!raw) return seedStore()
    const parsed = JSON.parse(raw) as ExpenseStore
    if (!parsed || typeof parsed !== 'object') return seedStore()
    if (storedVersion < SEED_APPLICATION_EXPENSE_VERSION) {
      // Refresh known seed rows so label / category updates apply in existing browsers.
      for (const expense of SEED_APPLICATION_EXPENSES) {
        parsed[expense.id] = expense
      }
      localStorage.setItem(SEED_VERSION_KEY, String(SEED_APPLICATION_EXPENSE_VERSION))
      writeStore(parsed)
      return mergeSeedExpenses(parsed)
    }
    return mergeSeedExpenses(parsed)
  } catch {
    return seedStore()
  }
}

function seedStore(): ExpenseStore {
  const store: ExpenseStore = {}
  for (const expense of SEED_APPLICATION_EXPENSES) {
    store[expense.id] = expense
  }
  localStorage.setItem(SEED_VERSION_KEY, String(SEED_APPLICATION_EXPENSE_VERSION))
  writeStore(store)
  return store
}

function writeStore(store: ExpenseStore) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore storage failures in mock mode
  }
}

function listAllExpenses(): ApplicationExpenseRecord[] {
  return Object.values(readStore()).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

function expensesForApplication(applicationId: string): ApplicationExpenseRecord[] {
  return listAllExpenses().filter(e => e.applicationId === applicationId)
}

function upsertMany(expenses: ApplicationExpenseRecord[]) {
  if (expenses.length === 0) return
  const store = readStore()
  for (const expense of expenses) {
    store[expense.id] = expense
  }
  writeStore(store)
}

function newExpenseId(applicationId: string): string {
  return `aem-${applicationId}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function newDisplayExpenseId(applicationId: string): string {
  const count = expensesForApplication(applicationId).length + 1
  return `EXP-${applicationId.replace(/[^A-Z0-9]/gi, '')}-${String(count).padStart(3, '0')}`
}

function buildPassengersFromDetail(applicationId: string): ApplicationExpensePassengerSummaryRow[] {
  if (applicationId === GLTS_MAR_1025_APPLICATION_ID) {
    return GLTS_MAR_1025_CREW.map(crew => ({
      passengerId: crew.id,
      passengerName: crew.name,
      passportNumber: crew.passport,
      cdcNumber: crew.cdc,
      rank: crew.rank,
      status: 'Submitted',
      individualExpenseTotal: 0,
    }))
  }

  const detail = marineApplicationAdminService.getDetail(applicationId)
  if (!detail.application) return []

  return detail.uploadQueueRows.map(row => ({
    passengerId: row.gltsApplicantId,
    passengerName: row.travelerName,
    passportNumber: row.passportNo,
    cdcNumber: row.basicDetails?.cdcNumber?.trim() || '—',
    rank: row.additionalDetails?.employmentOccupation?.trim() || '—',
    status: row.status === 'verified' ? 'Verified' : row.status === 'needs_review' ? 'Needs Review' : 'Processing',
    individualExpenseTotal: 0,
  }))
}

function syncArrangedExpenses(applicationId: string): ApplicationExpenseRecord[] {
  applicationArrangedExpenseService.syncFromApplication(applicationId)
  const arranged = applicationArrangedExpenseService.list({ applicationId })
  return arranged.map(arrangedExpenseToManagementRecord)
}

function syncGroundOperationsExpenses(applicationId: string): ApplicationExpenseRecord[] {
  const operationalCases = operationalCaseHandlingService.listByApplicationId(applicationId)
  if (operationalCases.length === 0) return []

  const passengers = buildPassengersFromDetail(applicationId).map(p => ({
    passengerId: p.passengerId,
    passengerName: p.passengerName,
  }))

  return syncOperationalCasesToExpenseRecords(operationalCases, passengers)
}

function syncAssignmentAndFundAllocationExpenses(
  applicationId: string,
  customerSegment: ApplicationCustomerSegment,
): ApplicationExpenseRecord[] {
  const records: ApplicationExpenseRecord[] = []

  const assignmentRows = operationalPassengerAssignmentService
    .list(customerSegment)
    .filter(row => row.gltsApplicationId === applicationId)

  const fundRows = fundAllocationService.listByApplicationId(applicationId)
  const fundByApplicant = new Map(fundRows.map(row => [row.gltsApplicantId, row]))

  for (const row of assignmentRows) {
    const fund = fundByApplicant.get(row.gltsApplicantId)
    const hasFundServices =
      fund?.allocationStatus === 'allocated' && (fund.selectedServices?.length ?? 0) > 0
    const estimate =
      !hasFundServices && fund && fund.allocationStatus === 'allocated' && fund.allocatedAmount > 0
        ? fund.allocatedAmount
        : !hasFundServices
          ? fund?.suggestedAllocationAmount
          : undefined

    if (row.assigneeType === 'vendor' && row.assignedVendor.trim()) {
      records.push(
        assignmentVendorToExpenseRecord({
          applicationId,
          gltsApplicantId: row.gltsApplicantId,
          passengerName: row.passengerName,
          assignedVendor: row.assignedVendor,
          assignedUser: row.assignedUser,
          operationalDate: row.operationalDate,
          lastUpdated: row.lastUpdated,
          estimatedAmount: estimate,
        }),
      )
    }

    if (row.assigneeType === 'passenger') {
      records.push(
        assignmentPassengerPaymentToExpenseRecord({
          applicationId,
          gltsApplicantId: row.gltsApplicantId,
          passengerName: row.passengerName,
          assignedUser: row.assignedUser,
          operationalDate: row.operationalDate,
          lastUpdated: row.lastUpdated,
          amount: estimate,
        }),
      )
    }
  }

  for (const fund of fundRows) {
    if (fund.allocationStatus !== 'allocated') continue
    for (const service of fund.selectedServices) {
      if (service.amount <= 0) continue
      records.push(
        fundAllocationServiceToExpenseRecord({
          applicationId,
          gltsApplicantId: fund.gltsApplicantId,
          passengerName: fund.passengerName,
          serviceId: service.id,
          serviceName: service.serviceName,
          amount: service.amount,
          gstIncluded: service.gstIncluded,
          allocatedAt: fund.allocatedAt,
          cardName: fund.cardName,
          allocatedTo: fund.allocatedTo,
        }),
      )
    }
  }

  return records
}

function syncAutoServiceExpenses(applicationId: string, existing: ExpenseStore): ApplicationExpenseRecord[] {
  if (applicationId !== GLTS_MAR_1025_APPLICATION_ID) return []

  const autoDefs = [
    {
      id: 'aem-glts-mar-1025-001',
      expenseName: 'GLTS processing fees',
      expenseType: 'glts_service_fee' as const,
      expenseTypeLabel: 'GLTS processing fees',
      serviceSource: 'glts_service' as const,
      linkedService: 'Marine crew visa processing',
      amount: 5000,
      approvalStatus: 'approved' as const,
      proofStatus: 'not_required' as const,
      paymentStatus: 'paid' as const,
    },
  ]

  return autoDefs
    .filter(def => !existing[def.id])
    .map(def => ({
      id: def.id,
      expenseId: 'EXP-MAR-1025-001',
      applicationId,
      expenseName: def.expenseName,
      expenseType: def.expenseType,
      expenseTypeLabel: def.expenseTypeLabel,
      expenseSource: 'application_service' as const,
      serviceSource: def.serviceSource,
      serviceSourceLabel: getServiceSourceLabel(def.serviceSource),
      linkedService: def.linkedService,
      passengerMapping: { scope: 'application' as const, displayLabel: 'Application' },
      amount: def.amount,
      gstIncluded: true,
      gstAmount: 900,
      tdsApplicable: false,
      tdsAmount: 0,
      netPayableAmount: def.amount,
      paymentStatus: def.paymentStatus,
      approvalStatus: def.approvalStatus,
      proofStatus: def.proofStatus,
      billTo: 'client' as const,
      createdFrom: 'application_service' as const,
      createdBy: 'System Auto',
      createdDate: new Date().toISOString(),
      expenseDate: new Date().toISOString().slice(0, 10),
      readyForReconciliation: true,
      isAutoGenerated: true,
      updatedAt: new Date().toISOString(),
    }))
}

function buildListingRowsForSegment(segment: ApplicationCustomerSegment): ApplicationExpenseListingRow[] {
  if (segment !== 'marine') return []

  const { singles, bulks } = marineApplicationAdminService.listAllSubmittedBySegment('marine')
  const apps = [...singles, ...bulks]
  return apps.map(app => buildListingRowFromApplication(app, expensesForApplication(app.id)))
}

function buildListingLookup(): Map<string, ApplicationExpenseListingRow> {
  const map = new Map<string, ApplicationExpenseListingRow>()
  for (const segment of ['marine', 'retail', 'corporate', 'b2bAgents'] as ApplicationCustomerSegment[]) {
    for (const row of buildListingRowsForSegment(segment)) {
      map.set(row.applicationId, row)
    }
  }
  return map
}

export const applicationExpenseManagementService = {
  listApplications(
    segment: ApplicationCustomerSegment,
    filters: ApplicationExpenseListingFilters = {},
  ): ApplicationExpenseListingRow[] {
    void filters
    return buildListingRowsForSegment(segment)
  },

  getPassengerNames(applicationId: string): string[] {
    return buildPassengersFromDetail(applicationId).map(p => p.passengerName)
  },

  getApplicationDetail(applicationId: string): ApplicationExpenseDetailView | undefined {
    const single = mockSingleApplications.find(r => r.id === applicationId)
    const bulk = mockBulkBatches.find(r => r.id === applicationId)
    const appRow = single ?? bulk
    const expenses = expensesForApplication(applicationId)

    if (!appRow) return undefined

    const listingRow = buildListingRowFromApplication(appRow, expenses)
    const passengers = buildPassengerSummaries(buildPassengersFromDetail(applicationId), expenses)
    const team = appRow.assignedTeamId ? teamService.getById(appRow.assignedTeamId) : undefined
    const user = appRow.assignedUserId ? adminPortalUserService.getById(appRow.assignedUserId) : undefined

    return {
      applicationId,
      companyName: listingRow.companyName,
      vesselName: listingRow.vesselName,
      crewCount: listingRow.crewCount,
      visaCountry: listingRow.visaCountry,
      visaType: listingRow.visaType,
      jurisdiction: listingRow.jurisdiction,
      submissionDate: listingRow.submissionDate,
      travelDate: listingRow.travelDate,
      applicationStatus: listingRow.applicationStatus,
      assignedTeam: team?.name,
      assignedUser: user?.fullName,
      priority: 'Standard',
      recordType: appRow.recordType,
      customerSegment: appRow.customerSegment,
      passengers,
      financeKpis: computeFinanceKpis(expenses),
      expenses,
    }
  },

  listApprovalQueue(): ExpenseApprovalQueueRow[] {
    const lookup = buildListingLookup()
    return buildApprovalQueueRows(listAllExpenses(), lookup)
  },

  syncApplication(applicationId: string): ApplicationExpenseRecord[] {
    const store = readStore()
    const single = mockSingleApplications.find(r => r.id === applicationId)
    const bulk = mockBulkBatches.find(r => r.id === applicationId)
    const customerSegment = (single ?? bulk)?.customerSegment ?? 'marine'

    const merged = [
      ...syncArrangedExpenses(applicationId),
      ...syncAutoServiceExpenses(applicationId, store),
      ...syncGroundOperationsExpenses(applicationId),
      ...syncAssignmentAndFundAllocationExpenses(applicationId, customerSegment),
    ]

    for (const expense of merged) {
      const existing = store[expense.id]
      // Auto-synced lines always refresh from upstream modules (assignment, ground ops, tickets, funds).
      if (!existing || expense.isAutoGenerated) {
        store[expense.id] = expense
      }
    }
    writeStore(store)
    return expensesForApplication(applicationId)
  },

  syncAllSubmitted(): void {
    const { singles, bulks } = marineApplicationAdminService.listAllSubmittedBySegment('marine')
    for (const app of [...singles, ...bulks]) {
      this.syncApplication(app.id)
    }
  },

  upsertManualExpense(applicationId: string, input: UpsertApplicationExpenseInput): ApplicationExpenseRecord {
    const now = new Date().toISOString()
    const id = newExpenseId(applicationId)
    const record: ApplicationExpenseRecord = {
      id,
      expenseId: newDisplayExpenseId(applicationId),
      applicationId,
      expenseName: input.expenseName,
      expenseType: input.expenseType,
      expenseTypeLabel: input.expenseName,
      expenseSource: input.expenseSource,
      serviceSource: input.serviceSource,
      serviceSourceLabel: getServiceSourceLabel(input.serviceSource),
      linkedService: input.linkedService,
      passengerMapping: input.passengerMapping,
      vendorStaffPartner: input.vendorStaffPartner,
      amount: input.amount,
      gstIncluded: input.gstIncluded,
      gstAmount: input.gstAmount,
      tdsApplicable: input.tdsApplicable,
      tdsAmount: input.tdsAmount,
      netPayableAmount: input.netPayableAmount,
      paymentMode: input.paymentMode,
      paymentStatus: input.paymentStatus,
      approvalStatus: input.approvalStatus ?? 'approved',
      proofStatus: input.proofStatus ?? (input.proofFileName ? 'uploaded' : 'missing'),
      proofFileName: input.proofFileName,
      proofDocumentType: input.proofDocumentType,
      paidBy: input.paidBy,
      billTo: input.billTo ?? 'client',
      createdFrom: 'manual_finance_entry',
      createdBy: 'Finance User',
      createdDate: now,
      expenseDate: input.expenseDate ?? now.slice(0, 10),
      internalRemarks: input.internalRemarks,
      isAutoGenerated: false,
      updatedAt: now,
    }
    upsertMany([record])
    return record
  },

  updateExpense(expenseId: string, input: Partial<UpsertApplicationExpenseInput>): ApplicationExpenseRecord | undefined {
    const store = readStore()
    const existing = store[expenseId]
    if (!existing) return undefined

    const updated: ApplicationExpenseRecord = {
      ...existing,
      expenseName: input.expenseName ?? existing.expenseName,
      expenseType: input.expenseType ?? existing.expenseType,
      expenseTypeLabel: input.expenseName ?? existing.expenseTypeLabel,
      expenseSource: input.expenseSource ?? existing.expenseSource,
      serviceSource: input.serviceSource ?? existing.serviceSource,
      serviceSourceLabel: input.serviceSource
        ? getServiceSourceLabel(input.serviceSource)
        : existing.serviceSourceLabel,
      linkedService: input.linkedService ?? existing.linkedService,
      passengerMapping: input.passengerMapping ?? existing.passengerMapping,
      vendorStaffPartner: input.vendorStaffPartner ?? existing.vendorStaffPartner,
      amount: input.amount ?? existing.amount,
      gstIncluded: input.gstIncluded ?? existing.gstIncluded,
      gstAmount: input.gstAmount ?? existing.gstAmount,
      tdsApplicable: input.tdsApplicable ?? existing.tdsApplicable,
      tdsAmount: input.tdsAmount ?? existing.tdsAmount,
      netPayableAmount: input.netPayableAmount ?? existing.netPayableAmount,
      paymentMode: input.paymentMode ?? existing.paymentMode,
      paymentStatus: input.paymentStatus ?? existing.paymentStatus,
      approvalStatus: input.approvalStatus ?? existing.approvalStatus,
      proofStatus: input.proofStatus ?? existing.proofStatus,
      proofFileName: input.proofFileName ?? existing.proofFileName,
      proofDocumentType: input.proofDocumentType ?? existing.proofDocumentType,
      paidBy: input.paidBy ?? existing.paidBy,
      billTo: input.billTo ?? existing.billTo ?? 'client',
      internalRemarks: input.internalRemarks ?? existing.internalRemarks,
      expenseDate: input.expenseDate ?? existing.expenseDate,
      updatedAt: new Date().toISOString(),
    }
    upsertMany([updated])
    return updated
  },

  getExpenseById(expenseId: string): ApplicationExpenseRecord | undefined {
    return readStore()[expenseId]
  },

  uploadProof(expenseId: string, fileName: string, documentType?: ApplicationExpenseRecord['proofDocumentType']): ApplicationExpenseRecord | undefined {
    const store = readStore()
    const existing = store[expenseId]
    if (!existing) return undefined
    const updated: ApplicationExpenseRecord = {
      ...existing,
      proofFileName: fileName,
      proofDocumentType: documentType ?? existing.proofDocumentType,
      proofStatus: 'uploaded',
      updatedAt: new Date().toISOString(),
    }
    upsertMany([updated])
    return updated
  },

  deleteExpense(expenseId: string): { ok: boolean; error?: string } {
    const store = readStore()
    const existing = store[expenseId]
    if (!existing) return { ok: false, error: 'Expense not found.' }
    if (existing.isAutoGenerated) {
      return { ok: false, error: 'Auto-synced application expenses cannot be deleted.' }
    }
    delete store[expenseId]
    writeStore(store)
    return { ok: true }
  },

  submitForApproval(expenseId: string): ApplicationExpenseRecord | undefined {
    const store = readStore()
    const existing = store[expenseId]
    if (!existing || existing.approvalStatus !== 'draft') return undefined
    const updated: ApplicationExpenseRecord = {
      ...existing,
      approvalStatus: 'pending_approval',
      updatedAt: new Date().toISOString(),
    }
    upsertMany([updated])
    return updated
  },

  approve(expenseId: string): { ok: boolean; expense?: ApplicationExpenseRecord; error?: string } {
    const store = readStore()
    const existing = store[expenseId]
    if (!existing) return { ok: false, error: 'Expense not found.' }
    if (
      existing.proofStatus !== 'uploaded' &&
      existing.proofStatus !== 'verified' &&
      existing.proofStatus !== 'not_required'
    ) {
      return { ok: false, error: 'Proof is mandatory before approval.' }
    }
    const updated: ApplicationExpenseRecord = {
      ...existing,
      approvalStatus: 'approved',
      readyForReconciliation: true,
      updatedAt: new Date().toISOString(),
    }
    upsertMany([updated])
    return { ok: true, expense: updated }
  },

  reject(expenseId: string, reason: string): { ok: boolean; expense?: ApplicationExpenseRecord; error?: string } {
    if (!reason.trim()) return { ok: false, error: 'Rejection reason is required.' }
    const store = readStore()
    const existing = store[expenseId]
    if (!existing) return { ok: false, error: 'Expense not found.' }
    const updated: ApplicationExpenseRecord = {
      ...existing,
      approvalStatus: 'rejected',
      rejectionReason: reason.trim(),
      updatedAt: new Date().toISOString(),
    }
    upsertMany([updated])
    return { ok: true, expense: updated }
  },

  requestClarification(
    expenseId: string,
    comment: string,
  ): { ok: boolean; expense?: ApplicationExpenseRecord; error?: string } {
    if (!comment.trim()) return { ok: false, error: 'Clarification comment is required.' }
    const store = readStore()
    const existing = store[expenseId]
    if (!existing) return { ok: false, error: 'Expense not found.' }
    const updated: ApplicationExpenseRecord = {
      ...existing,
      approvalStatus: 'clarification_required',
      clarificationComment: comment.trim(),
      updatedAt: new Date().toISOString(),
    }
    upsertMany([updated])
    return { ok: true, expense: updated }
  },

  resetSeed(): void {
    localStorage.removeItem(STORAGE_KEY)
    localStorage.removeItem(SEED_VERSION_KEY)
    seedStore()
  },
}
