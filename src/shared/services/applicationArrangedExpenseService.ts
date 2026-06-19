import type { ApplicantDocumentItem } from '@/pages/customer/features/applications/data/applicationFlowData'
import {
  mockBulkBatches,
  mockSingleApplications,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import type {
  ApplicationArrangedExpense,
  ApplicationArrangedExpenseListFilters,
} from '@/shared/types/applicationArrangedExpense'
import type { InsuranceWorkflow, TravelTicketWorkflow } from '@/shared/utils/applicantDocumentWorkflowUtils'
import {
  buildArrangedExpenseFromWorkflow,
  extractArrangedExpensesFromDetail,
} from '@/shared/utils/applicationArrangedExpenseUtils'

export interface GltsArrangedDocumentUploadPayload {
  fileName: string
  travelTicket?: Partial<TravelTicketWorkflow>
  insurance?: Partial<InsuranceWorkflow>
}

const EXPENSE_STORAGE_KEY = 'glts:application-arranged-expenses'

type ExpenseStore = Record<string, ApplicationArrangedExpense>

function readStore(): ExpenseStore {
  try {
    const raw = localStorage.getItem(EXPENSE_STORAGE_KEY)
    if (!raw) return {}
    const parsed = JSON.parse(raw) as ExpenseStore
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function writeStore(store: ExpenseStore) {
  try {
    localStorage.setItem(EXPENSE_STORAGE_KEY, JSON.stringify(store))
  } catch {
    // ignore storage failures in mock mode
  }
}

function resolveCompanyName(applicationId: string): string | undefined {
  const single = mockSingleApplications.find(row => row.id === applicationId)
  if (single?.companyName?.trim()) return single.companyName.trim()
  const bulk = mockBulkBatches.find(row => row.id === applicationId)
  return bulk?.companyName?.trim() || undefined
}

function listAll(): ApplicationArrangedExpense[] {
  const store = readStore()
  return Object.values(store).sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  )
}

function upsertMany(expenses: ApplicationArrangedExpense[]) {
  if (expenses.length === 0) return
  const store = readStore()
  for (const expense of expenses) {
    store[expense.id] = expense
  }
  writeStore(store)
}

function matchesFilters(expense: ApplicationArrangedExpense, filters: ApplicationArrangedExpenseListFilters): boolean {
  if (filters.applicationId && expense.applicationId !== filters.applicationId) return false
  if (filters.batchId && expense.batchId !== filters.batchId) return false
  if (filters.applicantId && expense.applicantId !== filters.applicantId) return false
  if (filters.category && filters.category !== 'all' && expense.category !== filters.category) return false
  if (
    filters.billingStatus &&
    filters.billingStatus !== 'all' &&
    expense.billingStatus !== filters.billingStatus
  ) {
    return false
  }
  if (filters.vendorId && expense.vendorId !== filters.vendorId) return false

  const query = filters.query?.trim().toLowerCase()
  if (query) {
    const haystack = [
      expense.applicationId,
      expense.batchId,
      expense.applicantName,
      expense.companyName,
      expense.vendorName,
      expense.categoryLabel,
      expense.documentFileName,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
    if (!haystack.includes(query)) return false
  }

  return true
}

export const applicationArrangedExpenseService = {
  list(filters: ApplicationArrangedExpenseListFilters = {}): ApplicationArrangedExpense[] {
    return listAll().filter(expense => matchesFilters(expense, filters))
  },

  getById(id: string): ApplicationArrangedExpense | undefined {
    return readStore()[id]
  },

  listForApplicant(applicationId: string, applicantId: string): ApplicationArrangedExpense[] {
    return this.list({ applicationId, applicantId, billingStatus: 'unbilled' })
  },

  listUnbilledForApplications(applicationIds: string[], batchIds: string[]): ApplicationArrangedExpense[] {
    const idSet = new Set([...applicationIds, ...batchIds])
    return listAll().filter(
      expense => expense.billingStatus === 'unbilled' && idSet.has(expense.applicationId),
    )
  },

  syncFromApplication(applicationId: string): ApplicationArrangedExpense[] {
    const detail = customerPortalService.getApplicationDetail(applicationId, {
      ignoreAccessControl: true,
    })
    if (!detail.application) return []

    const store = readStore()
    const existingById = Object.fromEntries(
      Object.values(store)
        .filter(expense => expense.applicationId === applicationId)
        .map(expense => [expense.id, expense]),
    )

    const expenses = extractArrangedExpensesFromDetail(
      applicationId,
      detail,
      resolveCompanyName(applicationId),
      existingById,
    )
    upsertMany(expenses)
    return expenses
  },

  syncFromApplications(applicationIds: string[], batchIds: string[]): ApplicationArrangedExpense[] {
    const ids = [...new Set([...applicationIds, ...batchIds])]
    return ids.flatMap(id => this.syncFromApplication(id))
  },

  upsertFromGltsDocumentUpload(input: {
    applicationId: string
    isBulk: boolean
    travelerRowId: string
    applicantId: string
    applicantName: string
    document: ApplicantDocumentItem
    payload: GltsArrangedDocumentUploadPayload
    companyName?: string
  }): ApplicationArrangedExpense | undefined {
    const workflow =
      input.document.documentId === 'travel-ticket'
        ? input.payload.travelTicket
        : input.payload.insurance
    if (!workflow) return undefined

    const store = readStore()
    const expenseId = `exp-${input.applicationId}-${input.applicantId}-${input.document.documentId}`
    const built = buildArrangedExpenseFromWorkflow({
      applicationId: input.applicationId,
      batchId: input.isBulk ? input.applicationId : undefined,
      row: {
        id: input.travelerRowId,
        gltsApplicantId: input.applicantId,
        travelerName: input.applicantName,
      },
      documentId: input.document.documentId as 'travel-ticket' | 'insurance',
      workflow: workflow as TravelTicketWorkflow | InsuranceWorkflow,
      companyName: input.companyName,
      existing: store[expenseId],
    })

    if (!built) return undefined
    upsertMany([built])
    return built
  },

  markBilled(expenseIds: string[], invoiceId: string) {
    const store = readStore()
    const now = new Date().toISOString()
    for (const id of expenseIds) {
      if (!store[id]) continue
      store[id] = {
        ...store[id],
        billingStatus: 'billed',
        invoiceId,
        updatedAt: now,
      }
    }
    writeStore(store)
  },
}
