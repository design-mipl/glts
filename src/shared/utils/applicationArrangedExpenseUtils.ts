import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import type {
  ApplicationArrangedExpense,
  ApplicationArrangedExpenseCategory,
} from '@/shared/types/applicationArrangedExpense'
import { serviceMasterService } from '@/shared/services/serviceMasterService'
import type {
  InsuranceWorkflow,
  SimpleDocumentRequirementId,
  TravelTicketWorkflow,
} from '@/shared/utils/applicantDocumentWorkflowUtils'

const CATEGORY_LABELS: Record<ApplicationArrangedExpenseCategory, string> = {
  travel_ticket: 'Travel ticket',
  travel_insurance: 'Travel insurance',
}

function categoryForDocument(documentId: SimpleDocumentRequirementId): ApplicationArrangedExpenseCategory {
  return documentId === 'travel-ticket' ? 'travel_ticket' : 'travel_insurance'
}

function parseArrangementAmount(value: string | undefined): number | null {
  const trimmed = value?.trim()
  if (!trimmed) return null
  const num = Number(trimmed)
  if (Number.isNaN(num) || num <= 0) return null
  return num
}

function buildExpenseId(applicationId: string, applicantId: string, documentId: string): string {
  return `exp-${applicationId}-${applicantId}-${documentId}`
}

function workflowHasCommercialFields(
  workflow: TravelTicketWorkflow | InsuranceWorkflow | undefined,
): workflow is TravelTicketWorkflow | InsuranceWorkflow {
  if (!workflow) return false
  const amount = parseArrangementAmount(workflow.arrangementAmount)
  const vendorId = workflow.vendorId?.trim()
  return amount !== null && Boolean(vendorId)
}

export function buildArrangedExpenseFromWorkflow(input: {
  applicationId: string
  batchId?: string
  row: Pick<UploadQueueRow, 'id' | 'gltsApplicantId' | 'travelerName'>
  documentId: SimpleDocumentRequirementId
  workflow: TravelTicketWorkflow | InsuranceWorkflow
  companyName?: string
  existing?: ApplicationArrangedExpense
}): ApplicationArrangedExpense | null {
  const amount = parseArrangementAmount(input.workflow.arrangementAmount)
  const vendorId = input.workflow.vendorId?.trim()
  if (amount === null || !vendorId) return null

  const now = new Date().toISOString()
  const vendorName =
    input.workflow.vendorName?.trim() ||
    serviceMasterService.getById(vendorId)?.serviceName?.trim() ||
    vendorId

  return {
    id: buildExpenseId(input.applicationId, input.row.gltsApplicantId, input.documentId),
    applicationId: input.applicationId,
    batchId: input.batchId,
    applicantId: input.row.gltsApplicantId,
    travelerRowId: input.row.id,
    applicantName: input.row.travelerName,
    companyName: input.companyName,
    documentId: input.documentId,
    category: categoryForDocument(input.documentId),
    categoryLabel: CATEGORY_LABELS[categoryForDocument(input.documentId)],
    amount,
    vendorId,
    vendorName,
    documentFileName: input.workflow.fileName?.trim() || undefined,
    source: 'glts_document_arrangement',
    billingStatus: input.existing?.billingStatus ?? 'unbilled',
    invoiceId: input.existing?.invoiceId,
    createdAt: input.existing?.createdAt ?? now,
    updatedAt: now,
  }
}

export function extractArrangedExpensesFromDetail(
  applicationId: string,
  detail: ApplicationDetailViewModel,
  companyName?: string,
  existingById: Record<string, ApplicationArrangedExpense> = {},
): ApplicationArrangedExpense[] {
  const batchId = detail.isBulkBatch ? applicationId : undefined
  const expenses: ApplicationArrangedExpense[] = []

  for (const row of detail.uploadQueueRows) {
    for (const doc of row.documents) {
      if (doc.handlingMode !== 'arrange_by_glts') continue
      if (doc.documentId !== 'travel-ticket' && doc.documentId !== 'insurance') continue

      const workflow = doc.documentId === 'travel-ticket' ? doc.travelTicket : doc.insurance
      if (!workflowHasCommercialFields(workflow)) continue

      const expenseId = buildExpenseId(applicationId, row.gltsApplicantId, doc.documentId)
      const built = buildArrangedExpenseFromWorkflow({
        applicationId,
        batchId,
        row,
        documentId: doc.documentId,
        workflow,
        companyName,
        existing: existingById[expenseId],
      })
      if (built) expenses.push(built)
    }
  }

  return expenses
}

export function arrangedExpenseToMiscFeeRow(expense: ApplicationArrangedExpense) {
  return {
    id: expense.id,
    feeType: expense.vendorId,
    feeTypeLabel: `${expense.categoryLabel} · ${expense.vendorName}`,
    isCustom: false,
    amount: expense.amount,
    notes: `GLTS arranged · ${expense.applicationId} · ${expense.applicantName}`,
  }
}
