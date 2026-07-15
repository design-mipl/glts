import {
  mockBulkBatches,
  mockSingleApplications,
  mockUploadQueue,
  GLTS_BATCH_IDS,
  type BulkBatchRow,
  type SingleApplicationRow,
  type UploadQueueRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { Invoice } from '@/shared/types/invoice'
import type { InvoiceLineItem, InvoiceTaxConfig, InvoiceWorkspaceState } from '@/shared/types/invoice'
import { EMPTY_INVOICE_BILLING_SELECTION } from '@/shared/types/invoice'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import type { ApplicationExpenseRecord } from '@/shared/types/applicationExpenseManagement'
import { companyMasterService } from '@/shared/services/companyMasterService'
import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import {
  findAgreementForCompany,
  resolveApplicationBillingEntity,
  resolveApplicationDisplayName,
  resolveApplicationVessel,
  resolveTaxConfigFromAgreement,
} from '@/shared/utils/invoiceBillingEngine'
import {
  calculateLineItemAmount,
  defaultLineItemFields,
  roundMoney,
} from '@/shared/utils/invoiceCalculations'
import type {
  ApplicantFeeBundle,
  BulkApplicationFeeCard,
  InvoiceBillableServiceLine,
  InvoiceFeeCompositionState,
  InvoiceFeeCompositionSummary,
  SingleApplicationFeeCard,
} from '../types/invoiceFeeComposition.types'
import { INVOICE_COMPOSITION_FEE_LABELS } from '../config/invoiceFeeCategoryLabels'

const LABELS = INVOICE_COMPOSITION_FEE_LABELS.billableServices

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function isClientBillable(expense: ApplicationExpenseRecord): boolean {
  // Explicit non-client bill targets are excluded; unset billTo is treated as client (legacy seeds).
  return !expense.billTo || expense.billTo === 'client'
}

function mapExpenseToServiceLine(expense: ApplicationExpenseRecord): InvoiceBillableServiceLine {
  return {
    id: `svc-${expense.id}`,
    expenseRecordId: expense.id,
    serviceLabel: expense.expenseTypeLabel || expense.expenseName,
    amount: expense.netPayableAmount,
    remark: expense.remarks ?? '',
  }
}

function expenseAppliesToPassenger(expense: ApplicationExpenseRecord, passengerId: string): boolean {
  const mapping = expense.passengerMapping
  if (mapping.scope === 'passenger' || mapping.scope === 'multiple_passengers') {
    return mapping.passengerIds?.includes(passengerId) ?? false
  }
  return false
}

function isSharedApplicationExpense(expense: ApplicationExpenseRecord): boolean {
  const scope = expense.passengerMapping.scope
  return scope === 'application' || scope === 'entire_crew'
}

/** Client-billable services for one passenger. Shared app/crew lines only when includeShared. */
function buildServiceLinesForPassenger(
  expenses: ApplicationExpenseRecord[],
  passengerId: string,
  includeShared: boolean,
): InvoiceBillableServiceLine[] {
  return expenses
    .filter(isClientBillable)
    .filter(expense => {
      if (expenseAppliesToPassenger(expense, passengerId)) return true
      if (includeShared && isSharedApplicationExpense(expense)) return true
      return false
    })
    .map(mapExpenseToServiceLine)
}

function listClientBillableExpenses(applicationId: string): ApplicationExpenseRecord[] {
  applicationExpenseManagementService.syncApplication(applicationId)
  const detail = applicationExpenseManagementService.getApplicationDetail(applicationId)
  return (detail?.expenses ?? []).filter(isClientBillable)
}

/** Actual billable travelers in the batch (matches fee editor and expanded panels). */
export function getBulkBatchApplicantCount(batch: BulkBatchRow): number {
  return listBulkBatchApplicants(batch).length
}

export function listBulkBatchApplicants(batch: BulkBatchRow): ApplicantFeeBundle[] {
  let queueRows: UploadQueueRow[]
  if (batch.id === GLTS_BATCH_IDS.schengenCrew) {
    queueRows = mockUploadQueue.map((row, index) => ({
      ...row,
      gltsApplicationId: batch.id,
      sequenceNo: index + 1,
    }))
  } else {
    const cap = Math.min(Math.max(batch.totalApplicants, 1), 8)
    queueRows = Array.from({ length: cap }).map((_, index) => {
      const sequenceNo = index + 1
      return {
        id: `${batch.id}-q${sequenceNo}`,
        fileName: `${batch.id}-${sequenceNo}.pdf`,
        gltsApplicationId: batch.id,
        gltsApplicantId: `${batch.id}-APL-${String(sequenceNo).padStart(3, '0')}`,
        sequenceNo,
        travelerName: `Crew Member ${sequenceNo}`,
        passportNo: `P${batch.id.slice(-3)}${String(sequenceNo).padStart(4, '0')}`,
        expiry: '2030-12-31',
        nationality: batch.country.slice(0, 3).toUpperCase(),
        confidence: 90,
        status: 'verified' as const,
        fields: [],
        documents: [],
        documentsComplete: 3,
        documentsTotal: 5,
      }
    })
  }

  const expenses = listClientBillableExpenses(batch.id)

  return queueRows.map((row, index) => {
    const includeShared = index === 0
    return {
      applicantId: row.gltsApplicantId,
      applicantName: row.travelerName,
      passportNumber: row.passportNo,
      country: batch.country,
      visaType: batch.visaType,
      serviceLines: buildServiceLinesForPassenger(expenses, row.gltsApplicantId, includeShared),
    }
  })
}

function buildSingleCard(row: SingleApplicationRow): SingleApplicationFeeCard {
  const expenses = listClientBillableExpenses(row.id)
  const passengerId = `${row.id}-APL-001`
  const passengerScoped = buildServiceLinesForPassenger(expenses, passengerId, true)
  // Single applications: include all client-billable lines (even if mapped only by name / application).
  const lines =
    passengerScoped.length > 0
      ? passengerScoped
      : expenses.map(mapExpenseToServiceLine)

  return {
    applicationId: row.id,
    applicationName: resolveApplicationDisplayName(row),
    companyName: row.companyName ?? '—',
    country: row.country,
    visaType: row.visaType,
    billingEntity: resolveApplicationBillingEntity(row),
    vessel: resolveApplicationVessel(row),
    applicantName: row.applicantName,
    serviceLines: lines,
  }
}

function buildBulkCard(row: BulkBatchRow): BulkApplicationFeeCard {
  return {
    batchId: row.id,
    applicationName: resolveApplicationDisplayName(row),
    companyName: row.companyName,
    country: row.country,
    visaType: row.visaType,
    billingEntity: resolveApplicationBillingEntity(row),
    vessel: resolveApplicationVessel(row),
    totalApplicants: getBulkBatchApplicantCount(row),
    expanded: true,
    applicants: listBulkBatchApplicants(row),
  }
}

export function buildInitialFeeComposition(
  applicationIds: string[],
  batchIds: string[],
  draft?: Invoice,
): InvoiceFeeCompositionState {
  const singles = applicationIds
    .map(id => mockSingleApplications.find(r => r.id === id))
    .filter((r): r is SingleApplicationRow => Boolean(r))
    .map(buildSingleCard)

  const bulks = batchIds
    .map(id => mockBulkBatches.find(r => r.id === id))
    .filter((r): r is BulkBatchRow => Boolean(r))
    .map(buildBulkCard)

  const primarySingle = applicationIds
    .map(id => mockSingleApplications.find(r => r.id === id))
    .find(Boolean)
  const primaryBulk = batchIds.map(id => mockBulkBatches.find(r => r.id === id)).find(Boolean)
  const primaryRow = primarySingle ?? primaryBulk
  const primaryCompany = singles[0]?.companyName ?? bulks[0]?.companyName ?? ''
  const agreement = findAgreementForCompany(primaryCompany)
  const companyId = draft?.companyId ?? ''

  const state: InvoiceFeeCompositionState = {
    invoiceType: 'cumulative',
    companyId,
    companyName: draft?.companyName ?? primaryCompany,
    billingEntity: draft?.billingEntity ?? (primaryRow ? resolveApplicationBillingEntity(primaryRow) : ''),
    vesselId: draft?.vesselId,
    vesselName: draft?.vesselName,
    agreementId: draft?.agreementId ?? agreement?.id,
    singles,
    bulks,
    draftInvoiceId: draft?.id,
  }

  if (draft?.lineItems.length) {
    return hydrateCompositionFromDraft(state, draft)
  }

  return state
}

/** Distinct billing entities available for the invoice header on the composition step. */
export function listCompositionBillingEntityOptions(
  state: InvoiceFeeCompositionState,
): Array<{ value: string; label: string }> {
  const names = new Set<string>()

  for (const single of state.singles) {
    const name = single.billingEntity.trim()
    if (name) names.add(name)
  }
  for (const bulk of state.bulks) {
    const name = bulk.billingEntity.trim()
    if (name) names.add(name)
  }

  const company = state.companyId
    ? companyMasterService.list().find(c => c.id === state.companyId)
    : state.companyName
      ? companyMasterService
          .list()
          .find(c => c.companyName.trim().toLowerCase() === state.companyName.trim().toLowerCase())
      : undefined
  if (company?.billingEntityName.trim()) {
    names.add(company.billingEntityName.trim())
  }

  const current = state.billingEntity.trim()
  if (current) names.add(current)

  return [...names]
    .sort((a, b) => a.localeCompare(b))
    .map(name => ({ value: name, label: name }))
}

function sumServiceLines(lines: InvoiceBillableServiceLine[]) {
  return roundMoney(lines.reduce((sum, line) => sum + (line.amount || 0), 0))
}

export function computeCompositionSummary(state: InvoiceFeeCompositionState): InvoiceFeeCompositionSummary {
  let servicesTotal = 0
  let totalApplicants = 0

  for (const single of state.singles) {
    totalApplicants += 1
    servicesTotal += sumServiceLines(single.serviceLines)
  }

  for (const bulk of state.bulks) {
    totalApplicants += bulk.applicants.length
    for (const applicant of bulk.applicants) {
      servicesTotal += sumServiceLines(applicant.serviceLines)
    }
  }

  return {
    totalApplications: state.singles.length + state.bulks.length,
    totalApplicants,
    singleCount: state.singles.length,
    bulkCount: state.bulks.length,
    servicesTotal: roundMoney(servicesTotal),
  }
}

function lineItemFromService(
  partial: Partial<InvoiceLineItem> & Pick<InvoiceLineItem, 'serviceType' | 'description' | 'unitPrice'>,
  taxConfig: InvoiceTaxConfig,
): InvoiceLineItem {
  // Amounts are already client-billable totals (GST included when applicable) — do not re-apply GST.
  const base: InvoiceLineItem = {
    ...defaultLineItemFields(),
    id: newId('li'),
    quantity: 1,
    gstApplicable: false,
    gstAmount: 0,
    amount: 0,
    ...partial,
    gstApplicable: false,
  }
  const { gstAmount, amount } = calculateLineItemAmount(
    base.quantity,
    base.unitPrice,
    false,
    taxConfig.gstPercentage,
  )
  return { ...base, gstAmount, amount }
}

function pushServiceLines(
  lineItems: InvoiceLineItem[],
  lines: InvoiceBillableServiceLine[],
  taxConfig: InvoiceTaxConfig,
  meta: { applicationId?: string; batchId?: string; applicantName?: string },
) {
  for (const line of lines) {
    if (line.amount <= 0) continue
    lineItems.push(
      lineItemFromService(
        {
          applicationId: meta.applicationId,
          batchId: meta.batchId,
          applicantName: meta.applicantName,
          serviceType: line.serviceLabel || LABELS.section,
          description: line.serviceLabel || LABELS.section,
          unitPrice: line.amount,
          remarks: line.remark,
          servicePresetId: line.expenseRecordId,
          isAdditionalExpense: false,
        },
        taxConfig,
      ),
    )
  }
}

export function compositionToWorkspaceState(state: InvoiceFeeCompositionState): InvoiceWorkspaceState {
  const agreement = findAgreementForCompany(state.companyName)
  const agreementTax = resolveTaxConfigFromAgreement(agreement)
  const taxConfig: InvoiceTaxConfig = {
    ...agreementTax,
    tdsApplicable: false,
    tdsPercentage: 0,
  }
  const lineItems: InvoiceLineItem[] = []

  for (const single of state.singles) {
    pushServiceLines(lineItems, single.serviceLines, taxConfig, {
      applicationId: single.applicationId,
      applicantName: single.applicantName,
    })
  }

  for (const bulk of state.bulks) {
    for (const applicant of bulk.applicants) {
      pushServiceLines(lineItems, applicant.serviceLines, taxConfig, {
        batchId: bulk.batchId,
        applicantName: applicant.applicantName,
      })
    }
  }

  const applicationIds = state.singles.map(s => s.applicationId)
  const batchIds = state.bulks.map(b => b.batchId)

  return {
    selection: {
      ...EMPTY_INVOICE_BILLING_SELECTION,
      billingMode: 'application_wise',
      applicationSelectionMode:
        batchIds.length === 1 && applicationIds.length === 0
          ? 'batch'
          : applicationIds.length === 1 && batchIds.length === 0
            ? 'single'
            : 'multiple',
      invoiceType: 'cumulative',
      companyId: state.companyId,
      companyName: state.companyName,
      billingEntity: state.billingEntity,
      vesselId: state.vesselId,
      vesselName: state.vesselName,
      applicationIds,
      batchIds,
      servicePresetIds: [],
    },
    lineItems,
    taxConfig,
    additionalCharges: 0,
    paymentTerms: 'Net 30',
    dueDate: defaultDueDate(),
    draftInvoiceId: state.draftInvoiceId,
    agreementId: state.agreementId ?? agreement?.id,
  }
}

function defaultDueDate() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

function hydrateServiceLinesFromItems(
  seeded: InvoiceBillableServiceLine[],
  items: InvoiceLineItem[],
): InvoiceBillableServiceLine[] {
  if (items.length === 0) return seeded

  const byExpenseId = new Map(
    items
      .filter(li => li.servicePresetId)
      .map(li => [li.servicePresetId as string, li]),
  )

  if (byExpenseId.size > 0) {
    return seeded.map(line => {
      const match = byExpenseId.get(line.expenseRecordId)
      if (!match) return line
      return {
        ...line,
        amount: match.unitPrice,
        remark: match.remarks ?? '',
      }
    })
  }

  // Legacy drafts without expenseRecordId: rebuild from line items as free-form services.
  return items.map(li => ({
    id: newId('svc'),
    expenseRecordId: li.servicePresetId ?? li.id,
    serviceLabel: li.description || li.serviceType,
    amount: li.unitPrice,
    remark: li.remarks ?? '',
  }))
}

function hydrateCompositionFromDraft(
  state: InvoiceFeeCompositionState,
  draft: Invoice,
): InvoiceFeeCompositionState {
  const next = { ...state, draftInvoiceId: draft.id }

  for (const single of next.singles) {
    const items = draft.lineItems.filter(li => li.applicationId === single.applicationId)
    single.serviceLines = hydrateServiceLinesFromItems(single.serviceLines, items)
  }

  for (const bulk of next.bulks) {
    for (const applicant of bulk.applicants) {
      const items = draft.lineItems.filter(
        li => li.batchId === bulk.batchId && li.applicantName === applicant.applicantName,
      )
      applicant.serviceLines = hydrateServiceLinesFromItems(applicant.serviceLines, items)
    }
  }

  return next
}

export function billingTypeLabel(type: CommercialAgreement['billingType'] | undefined): string {
  if (type === 'advance') return 'Advance'
  if (type === 'mixed') return 'Mixed'
  return 'Credit'
}
