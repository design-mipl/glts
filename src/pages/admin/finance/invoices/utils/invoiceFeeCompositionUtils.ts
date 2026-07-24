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
import type { CommercialVisaPricingRule } from '@/shared/types/quotation'
import { companyMasterService } from '@/shared/services/companyMasterService'
import { applicationExpenseManagementService } from '@/shared/services/applicationExpenseManagementService'
import { countryGroupMasterService } from '@/shared/services/countryGroupMasterService'
import { countryMasterAdminService } from '@/shared/services/countryMasterAdminService'
import {
  findAgreementForCompany,
  resolveApplicationBillingEntity,
  resolveApplicationDisplayName,
  resolveApplicationVessel,
  resolveTaxConfigFromAgreement,
} from '@/shared/utils/invoiceBillingEngine'
import {
  defaultLineItemFields,
  roundMoney,
} from '@/shared/utils/invoiceCalculations'
import { resolveVfsPickerServices } from '@/shared/utils/vfsServicePickerUtils'
import { resolveOfferingIdsByLabels } from '@/shared/services/countryMasterService'
import type {
  ApplicantFeeBundle,
  BulkApplicationFeeCard,
  InvoiceBillableServiceLine,
  InvoiceCompositionMode,
  InvoiceConsulateRefundLine,
  InvoiceFeeCompositionState,
  InvoiceFeeCompositionSummary,
  InvoiceServiceLineCategory,
  SingleApplicationFeeCard,
} from '../types/invoiceFeeComposition.types'
import { INVOICE_COMPOSITION_FEE_LABELS } from '../config/invoiceFeeCategoryLabels'
import {
  caseIdFromGoRefundPreset,
  goRefundLinePresetId,
  isGoRefundExpenseId,
  listConsulateRefundsForApplication,
  sumIncludedConsulateRefunds,
} from './invoiceConsulateRefundUtils'

const LABELS = INVOICE_COMPOSITION_FEE_LABELS.billableServices
export const GLTS_PROCESSING_FEE_LABEL = 'GLTS processing fees'

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function normalizeKey(value: string): string {
  return value.trim().toLowerCase()
}

function isClientBillable(expense: ApplicationExpenseRecord): boolean {
  // Explicit non-client bill targets are excluded; unset billTo is treated as client (legacy seeds).
  return !expense.billTo || expense.billTo === 'client'
}

function isConsulateRefundExpense(expense: ApplicationExpenseRecord): boolean {
  if (isGoRefundExpenseId(expense.id)) return true
  if (expense.linkedService === 'Logistics consulate refund') return true
  const label = normalizeKey(expense.expenseTypeLabel || expense.expenseName)
  return label.startsWith('consulate refund')
}

function isGltsExpense(expense: ApplicationExpenseRecord): boolean {
  if (expense.serviceSource === 'glts_service') return true
  return expense.expenseType === 'glts_service_fee' || expense.expenseType === 'visa_processing_fee'
}

function isVfsExpense(expense: ApplicationExpenseRecord): boolean {
  if (expense.serviceSource === 'vfs_service' || expense.serviceSource === 'embassy_consulate') return true
  return expense.expenseType === 'vfs_booking_service' || expense.expenseType === 'embassy_fee'
}

export function categorizeExpense(expense: ApplicationExpenseRecord): InvoiceServiceLineCategory {
  if (isGltsExpense(expense)) return 'glts_processing'
  if (isVfsExpense(expense)) return 'vfs'
  return 'miscellaneous_dispatch'
}

export function inferServiceLineCategory(
  label: string,
  servicePresetId?: string,
): InvoiceServiceLineCategory {
  const key = normalizeKey(label)
  const preset = normalizeKey(servicePresetId ?? '')
  if (
    preset === 'glts-service-fee' ||
    key.includes('glts processing') ||
    key.includes('glts service') ||
    key === 'glts processing fees'
  ) {
    return 'glts_processing'
  }
  if (key.includes('vfs') || key.includes('embassy') || key.includes('consulate')) {
    return 'vfs'
  }
  return 'miscellaneous_dispatch'
}

function mapExpenseToServiceLine(expense: ApplicationExpenseRecord): InvoiceBillableServiceLine {
  return {
    id: `svc-${expense.id}`,
    expenseRecordId: expense.id,
    serviceLabel: expense.expenseTypeLabel || expense.expenseName,
    amount: expense.netPayableAmount,
    remark: expense.remarks ?? '',
    gstApplicable: expense.gstIncluded ?? true,
    category: categorizeExpense(expense),
  }
}

function resolveCountryId(countryName: string): string | undefined {
  const key = normalizeKey(countryName)
  if (!key || key === '—') return undefined
  return countryMasterAdminService.list({ status: 'active' }).find(c => normalizeKey(c.name) === key)?.id
}

function visaTypeMatches(ruleVisaType: string, applicationVisaType: string): boolean {
  const rule = normalizeKey(ruleVisaType)
  if (!rule) return true
  return rule === normalizeKey(applicationVisaType)
}

function scoreCommercialRule(
  rule: CommercialVisaPricingRule,
  countryName: string,
  countryId: string | undefined,
  visaType: string,
): number {
  if (!visaTypeMatches(rule.visaType, visaType)) return -1

  if (rule.scope === 'country') {
    const idMatch = Boolean(countryId && rule.countryId && rule.countryId === countryId)
    const nameMatch = Boolean(rule.country && normalizeKey(rule.country) === normalizeKey(countryName))
    if (!idMatch && !nameMatch) return -1
    return rule.visaType.trim() ? 400 : 350
  }

  if (rule.scope === 'country_group' && rule.countryGroupId) {
    const group = countryGroupMasterService.getById(rule.countryGroupId)
    if (!group) return -1
    const inGroupById = Boolean(countryId && group.countryIds.includes(countryId))
    const inGroupByName = countryGroupMasterService
      .resolveCountryNames(group.countryIds)
      .some(name => normalizeKey(name) === normalizeKey(countryName))
    if (!inGroupById && !inGroupByName) return -1
    return rule.visaType.trim() ? 300 : 250
  }

  if (rule.scope === 'rest_of_countries_online') return rule.visaType.trim() ? 200 : 150
  if (rule.scope === 'rest_of_countries_offline') return rule.visaType.trim() ? 100 : 50
  return -1
}

/** Resolve GLTS processing fees from agreement for application country / visa type. */
export function resolveGltsProcessingFeeFromAgreement(
  agreement: CommercialAgreement | null | undefined,
  country: string,
  visaType: string,
): { amount: number; remark: string; ruleId: string; gstApplicable: boolean } | null {
  if (!agreement) return null
  const countryId = resolveCountryId(country)
  const rules = agreement.commercialVisaPricing ?? []

  let best: CommercialVisaPricingRule | null = null
  let bestScore = -1
  for (const rule of rules) {
    const score = scoreCommercialRule(rule, country, countryId, visaType)
    if (score > bestScore) {
      bestScore = score
      best = rule
    }
  }
  if (best && bestScore >= 0) {
    return {
      amount: Math.max(0, best.serviceFee),
      remark: best.remarks ?? '',
      ruleId: best.id,
      gstApplicable: best.gstApplicable !== false,
    }
  }

  // Legacy flatten: pricingMatrix GLTS rows matched by country name.
  const countryKey = normalizeKey(country)
  const matrixMatches = agreement.pricingMatrix.filter(row => {
    const isGlts =
      normalizeKey(row.servicePresetId) === 'glts-service-fee' ||
      inferServiceLineCategory(row.servicePresetName, row.servicePresetId) === 'glts_processing'
    if (!isGlts) return false
    const rowCountry = normalizeKey(row.country)
    if (!rowCountry || rowCountry === '—' || rowCountry.startsWith('rest of')) return true
    return rowCountry === countryKey
  })
  const withVisa = matrixMatches.find(row => visaTypeMatches(row.visaType, visaType))
  const pick = withVisa ?? matrixMatches[0]
  if (!pick) return null
  return {
    amount: Math.max(0, pick.serviceFee),
    remark: pick.remarks ?? '',
    ruleId: pick.id,
    gstApplicable: pick.gstApplicable !== false,
  }
}

export function createGltsProcessingServiceLine(
  agreement: CommercialAgreement | null | undefined,
  country: string,
  visaType: string,
): InvoiceBillableServiceLine | null {
  const resolved = resolveGltsProcessingFeeFromAgreement(agreement, country, visaType)
  if (!resolved) return null
  return {
    id: newId('svc-glts'),
    expenseRecordId: resolved.ruleId,
    serviceLabel: GLTS_PROCESSING_FEE_LABEL,
    amount: resolved.amount,
    remark: resolved.remark,
    gstApplicable: resolved.gstApplicable,
    category: 'glts_processing',
  }
}

/**
 * Always include GLTS processing fees from agreement; append selected misc / VFS from expenses.
 * GLTS expense rows are skipped when agreement already supplies the fee.
 */
export function mergeCompositionServiceLines(
  agreement: CommercialAgreement | null | undefined,
  country: string,
  visaType: string,
  expenseLines: InvoiceBillableServiceLine[],
): InvoiceBillableServiceLine[] {
  const glts = createGltsProcessingServiceLine(agreement, country, visaType)
  const selected = expenseLines.filter(line => {
    if (line.category === 'glts_processing') return !glts
    return line.category === 'miscellaneous_dispatch' || line.category === 'vfs'
  })
  return glts ? [glts, ...selected] : selected
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

/** Client-billable selected services for one passenger (misc + VFS; GLTS filtered later). */
function buildExpenseServiceLinesForPassenger(
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
  return (detail?.expenses ?? []).filter(isClientBillable).filter(e => !isConsulateRefundExpense(e))
}

/** Actual billable travelers in the batch (matches fee editor and expanded panels). */
export function getBulkBatchApplicantCount(batch: BulkBatchRow): number {
  return listBulkBatchApplicants(batch).length
}

export function listBulkBatchApplicants(
  batch: BulkBatchRow,
  agreement?: CommercialAgreement | null,
): ApplicantFeeBundle[] {
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
  const resolvedAgreement = findAgreementForCompany(batch.companyName) ?? agreement ?? null

  return queueRows.map((row, index) => {
    const includeShared = index === 0
    const expenseLines = buildExpenseServiceLinesForPassenger(expenses, row.gltsApplicantId, includeShared)
    return {
      applicantId: row.gltsApplicantId,
      applicantName: row.travelerName,
      passportNumber: row.passportNo,
      country: batch.country,
      visaType: batch.visaType,
      serviceLines: mergeCompositionServiceLines(
        resolvedAgreement,
        batch.country,
        batch.visaType,
        expenseLines,
      ),
      consulateRefunds: listConsulateRefundsForApplication(batch.id, {
        passengerName: row.travelerName,
        passportNumber: row.passportNo,
      }),
    }
  })
}

function buildSingleCard(
  row: SingleApplicationRow,
  agreement?: CommercialAgreement | null,
): SingleApplicationFeeCard {
  const expenses = listClientBillableExpenses(row.id)
  const passengerId = `${row.id}-APL-001`
  const passengerScoped = buildExpenseServiceLinesForPassenger(expenses, passengerId, true)
  // Single applications: include all client-billable lines (even if mapped only by name / application).
  const expenseLines =
    passengerScoped.length > 0 ? passengerScoped : expenses.map(mapExpenseToServiceLine)
  const resolvedAgreement = findAgreementForCompany(row.companyName ?? '') ?? agreement ?? null

  return {
    applicationId: row.id,
    applicationName: resolveApplicationDisplayName(row),
    companyName: row.companyName ?? '—',
    country: row.country,
    visaType: row.visaType,
    billingEntity: resolveApplicationBillingEntity(row),
    vessel: resolveApplicationVessel(row),
    applicantName: row.applicantName,
    serviceLines: mergeCompositionServiceLines(
      resolvedAgreement,
      row.country,
      row.visaType,
      expenseLines,
    ),
    consulateRefunds: listConsulateRefundsForApplication(row.id),
  }
}

function buildBulkCard(
  row: BulkBatchRow,
  agreement?: CommercialAgreement | null,
): BulkApplicationFeeCard {
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
    applicants: listBulkBatchApplicants(row, agreement),
  }
}

export function buildCompositionFromSourceInvoice(invoice: Invoice): InvoiceFeeCompositionState {
  // Credit note composition is always seeded from the source invoice's billed lines.
  const byApp = new Map<string, InvoiceLineItem[]>()
  for (const li of invoice.lineItems) {
    const key = li.applicationId || li.batchId || invoice.id
    const list = byApp.get(key) ?? []
    list.push(li)
    byApp.set(key, list)
  }

  const singles: SingleApplicationFeeCard[] = []
  for (const [key, items] of byApp) {
    const singleRow = mockSingleApplications.find(r => r.id === key)
    const bulkRow = mockBulkBatches.find(r => r.id === key)
    const displayName = singleRow
      ? resolveApplicationDisplayName(singleRow)
      : bulkRow
        ? resolveApplicationDisplayName(bulkRow)
        : items[0]?.applicantName?.trim() || key

    singles.push({
      applicationId: key,
      applicationName: displayName,
      companyName: invoice.companyName,
      country:
        singleRow?.country ?? bulkRow?.country ?? invoice.country ?? '—',
      visaType:
        singleRow?.visaType ?? bulkRow?.visaType ?? invoice.visaType ?? '—',
      billingEntity: invoice.billingEntity,
      vessel: invoice.vesselName ?? '—',
      applicantName: items[0]?.applicantName ?? (singleRow && 'applicantName' in singleRow ? singleRow.applicantName : '—'),
      serviceLines: items
        .filter(li => !isGoRefundExpenseId(li.servicePresetId))
        .map(li => {
          const amount = Math.abs(li.unitPrice)
          return {
            id: `svc-${li.id}`,
            expenseRecordId: li.servicePresetId ?? li.id,
            serviceLabel: (li.description || li.serviceType).replace(/^Credit:\s*/i, ''),
            amount,
            creditAmount: amount,
            selected: true,
            remark: li.remarks ?? '',
            gstApplicable: li.gstApplicable !== false,
            category: inferServiceLineCategory(li.description || li.serviceType, li.servicePresetId),
          }
        }),
      consulateRefunds: listConsulateRefundsForApplication(key),
    })
  }

  return {
    invoiceType: 'cumulative',
    companyId: invoice.companyId,
    companyName: invoice.companyName,
    billingEntity: invoice.billingEntity,
    documentDate: todayDocumentDate(),
    vesselId: invoice.vesselId,
    vesselName: invoice.vesselName,
    agreementId: invoice.agreementId,
    singles,
    bulks: [],
    draftInvoiceId: undefined,
  }
}

export function buildInitialFeeComposition(
  applicationIds: string[],
  batchIds: string[],
  draft?: Invoice,
): InvoiceFeeCompositionState {
  const singleRows = applicationIds
    .map(id => mockSingleApplications.find(r => r.id === id))
    .filter((r): r is SingleApplicationRow => Boolean(r))
  const bulkRows = batchIds
    .map(id => mockBulkBatches.find(r => r.id === id))
    .filter((r): r is BulkBatchRow => Boolean(r))

  const primaryRow = singleRows[0] ?? bulkRows[0]
  const primaryCompany =
    draft?.companyName ||
    singleRows[0]?.companyName ||
    bulkRows[0]?.companyName ||
    ''
  const agreement = findAgreementForCompany(primaryCompany)

  const singles = singleRows.map(row => buildSingleCard(row))
  const bulks = bulkRows.map(row => buildBulkCard(row))
  const companyId = draft?.companyId ?? ''

  const state: InvoiceFeeCompositionState = {
    invoiceType: 'cumulative',
    companyId,
    companyName: draft?.companyName ?? primaryCompany,
    billingEntity: draft?.billingEntity ?? (primaryRow ? resolveApplicationBillingEntity(primaryRow) : ''),
    documentDate: draft?.invoiceDate ?? todayDocumentDate(),
    vesselId: draft?.vesselId,
    vesselName: draft?.vesselName,
    agreementId: draft?.agreementId ?? agreement?.id,
    singles,
    bulks,
    draftInvoiceId: draft?.id,
  }

  if (draft?.lineItems.length) {
    const mode: InvoiceCompositionMode =
      draft.sourceInvoiceId && draft.invoiceStatus === 'draft' && draft.invoiceType !== 'credit_note'
        ? 'revised'
        : 'generate'
    return hydrateCompositionFromDraft(state, draft, mode)
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

/** Effective line amount for totals / workspace. */
export function effectiveServiceLineAmount(
  line: InvoiceBillableServiceLine,
  mode: InvoiceCompositionMode = 'generate',
): number {
  if (mode === 'credit_note') {
    if (line.selected === false) return 0
    const credit = line.creditAmount != null ? line.creditAmount : line.amount
    return Math.max(0, credit || 0)
  }
  if (mode === 'revised') {
    if (line.updatedAmount != null && Number.isFinite(line.updatedAmount)) {
      return Math.max(0, line.updatedAmount)
    }
    return Math.max(0, line.amount || 0)
  }
  return Math.max(0, line.amount || 0)
}

function sumServiceLines(lines: InvoiceBillableServiceLine[], mode: InvoiceCompositionMode = 'generate') {
  return roundMoney(lines.reduce((sum, line) => sum + effectiveServiceLineAmount(line, mode), 0))
}

/** @deprecated Prefer creditAmount seeding via buildCompositionFromSourceInvoice. */
export function seedCreditNoteUpdatedAmounts(
  state: InvoiceFeeCompositionState,
): InvoiceFeeCompositionState {
  const seedLines = (lines: InvoiceBillableServiceLine[]) =>
    lines.map(line => {
      const amount = Math.abs(line.amount)
      return {
        ...line,
        amount,
        creditAmount: line.creditAmount != null ? Math.abs(line.creditAmount) : amount,
        selected: line.selected !== false,
      }
    })

  return {
    ...state,
    singles: state.singles.map(single => ({
      ...single,
      serviceLines: seedLines(single.serviceLines),
    })),
    bulks: state.bulks.map(bulk => ({
      ...bulk,
      applicants: bulk.applicants.map(applicant => ({
        ...applicant,
        serviceLines: seedLines(applicant.serviceLines),
      })),
    })),
  }
}

export function computeCompositionSummary(
  state: InvoiceFeeCompositionState,
  mode: InvoiceCompositionMode = 'generate',
): InvoiceFeeCompositionSummary {
  let servicesTotal = 0
  let refundsIncludedTotal = 0
  let totalApplicants = 0

  for (const single of state.singles) {
    totalApplicants += 1
    servicesTotal += sumServiceLines(single.serviceLines, mode)
    refundsIncludedTotal += sumIncludedConsulateRefunds(single.consulateRefunds ?? [])
  }

  for (const bulk of state.bulks) {
    totalApplicants += bulk.applicants.length
    for (const applicant of bulk.applicants) {
      servicesTotal += sumServiceLines(applicant.serviceLines, mode)
      refundsIncludedTotal += sumIncludedConsulateRefunds(applicant.consulateRefunds ?? [])
    }
  }

  return {
    totalApplications: state.singles.length + state.bulks.length,
    totalApplicants,
    singleCount: state.singles.length,
    bulkCount: state.bulks.length,
    servicesTotal: roundMoney(servicesTotal),
    refundsIncludedTotal: roundMoney(refundsIncludedTotal),
  }
}

function lineItemFromService(
  partial: Partial<InvoiceLineItem> & Pick<InvoiceLineItem, 'serviceType' | 'description' | 'unitPrice'>,
  _taxConfig: InvoiceTaxConfig,
): InvoiceLineItem {
  // Amounts are client-billable as entered — do not re-apply GST on top of unit price.
  const quantity = partial.quantity ?? 1
  const unitPrice = partial.unitPrice
  const gstApplicable = partial.gstApplicable !== false
  return {
    ...defaultLineItemFields(),
    id: newId('li'),
    quantity,
    ...partial,
    gstApplicable,
    gstAmount: 0,
    amount: roundMoney(quantity * unitPrice),
  }
}

function pushServiceLines(
  lineItems: InvoiceLineItem[],
  lines: InvoiceBillableServiceLine[],
  taxConfig: InvoiceTaxConfig,
  meta: { applicationId?: string; batchId?: string; applicantName?: string },
  mode: InvoiceCompositionMode = 'generate',
) {
  for (const line of lines) {
    if (mode === 'credit_note' && line.selected === false) continue
    const unitPrice = effectiveServiceLineAmount(line, mode)
    if (unitPrice <= 0) continue
    lineItems.push(
      lineItemFromService(
        {
          applicationId: meta.applicationId,
          batchId: meta.batchId,
          applicantName: meta.applicantName,
          serviceType: line.serviceLabel || LABELS.section,
          description: line.serviceLabel || LABELS.section,
          unitPrice,
          remarks: line.remark,
          servicePresetId: line.expenseRecordId,
          isAdditionalExpense: false,
          gstApplicable: line.gstApplicable !== false,
          creditAmount:
            mode === 'revised' && line.creditAmount != null && line.creditAmount > 0
              ? Math.abs(line.creditAmount)
              : undefined,
        },
        taxConfig,
      ),
    )
  }
}

function pushConsulateRefundLines(
  lineItems: InvoiceLineItem[],
  refunds: InvoiceConsulateRefundLine[] | undefined,
  taxConfig: InvoiceTaxConfig,
  meta: { applicationId?: string; batchId?: string; applicantName?: string },
  mode: InvoiceCompositionMode = 'generate',
) {
  for (const refund of refunds ?? []) {
    if (refund.status !== 'pending' || !refund.included || refund.amount <= 0) continue
    const label = `Consulate refund · ${refund.vendorName}`
    // Credit note composition keeps positive amounts (negated on submit).
    // Generate / revise apply as a reduction on the invoice.
    const unitPrice = mode === 'credit_note' ? Math.abs(refund.amount) : -Math.abs(refund.amount)
    lineItems.push(
      lineItemFromService(
        {
          applicationId: meta.applicationId ?? refund.applicationId,
          batchId: meta.batchId,
          applicantName: meta.applicantName ?? refund.passengerName,
          serviceType: 'Consulate refund',
          description: label,
          unitPrice,
          remarks: refund.remarks,
          servicePresetId: goRefundLinePresetId(refund.caseId),
          isAdditionalExpense: false,
          gstApplicable: false,
        },
        taxConfig,
      ),
    )
  }
}

export function compositionToWorkspaceState(
  state: InvoiceFeeCompositionState,
  mode: InvoiceCompositionMode = 'generate',
): InvoiceWorkspaceState {
  const agreement = findAgreementForCompany(state.companyName)
  const agreementTax = resolveTaxConfigFromAgreement(agreement)
  const taxConfig: InvoiceTaxConfig = {
    ...agreementTax,
    tdsApplicable: false,
    tdsPercentage: 0,
  }
  const lineItems: InvoiceLineItem[] = []

  for (const single of state.singles) {
    pushServiceLines(
      lineItems,
      single.serviceLines,
      taxConfig,
      {
        applicationId: single.applicationId,
        applicantName: single.applicantName,
      },
      mode,
    )
    pushConsulateRefundLines(
      lineItems,
      single.consulateRefunds,
      taxConfig,
      {
        applicationId: single.applicationId,
        applicantName: single.applicantName,
      },
      mode,
    )
  }

  for (const bulk of state.bulks) {
    for (const applicant of bulk.applicants) {
      pushServiceLines(
        lineItems,
        applicant.serviceLines,
        taxConfig,
        {
          batchId: bulk.batchId,
          applicantName: applicant.applicantName,
        },
        mode,
      )
      pushConsulateRefundLines(
        lineItems,
        applicant.consulateRefunds,
        taxConfig,
        {
          batchId: bulk.batchId,
          applicantName: applicant.applicantName,
        },
        mode,
      )
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
    invoiceDate: state.documentDate || todayDocumentDate(),
    draftInvoiceId: state.draftInvoiceId,
    agreementId: state.agreementId ?? agreement?.id,
  }
}

function defaultDueDate() {
  const d = new Date()
  d.setDate(d.getDate() + 30)
  return d.toISOString().slice(0, 10)
}

function todayDocumentDate() {
  return new Date().toISOString().slice(0, 10)
}

function hydrateServiceLinesFromItems(
  seeded: InvoiceBillableServiceLine[],
  items: InvoiceLineItem[],
  mode: InvoiceCompositionMode = 'generate',
): InvoiceBillableServiceLine[] {
  if (items.length === 0) {
    if (mode === 'revised') {
      return seeded.map(line => ({
        ...line,
        updatedAmount: line.updatedAmount ?? line.amount,
      }))
    }
    return seeded
  }

  const byExpenseId = new Map(
    items
      .filter(li => li.servicePresetId)
      .map(li => [li.servicePresetId as string, li]),
  )
  const byLabel = new Map(
    items.map(li => [normalizeKey((li.description || li.serviceType).replace(/^Credit:\s*/i, '')), li]),
  )

  if (seeded.length > 0) {
    return seeded.map(line => {
      const match = byExpenseId.get(line.expenseRecordId) ?? byLabel.get(normalizeKey(line.serviceLabel))
      if (!match) {
        return mode === 'revised'
          ? { ...line, updatedAmount: line.updatedAmount ?? line.amount }
          : line
      }
      return {
        ...line,
        amount: mode === 'revised' ? line.amount : Math.abs(match.unitPrice),
        updatedAmount:
          mode === 'revised' ? Math.abs(match.unitPrice) : line.updatedAmount,
        creditAmount:
          match.creditAmount != null
            ? Math.abs(match.creditAmount)
            : line.creditAmount,
        remark: match.remarks ?? line.remark,
        gstApplicable: match.gstApplicable !== false,
        category:
          line.category ??
          inferServiceLineCategory(match.description || match.serviceType, match.servicePresetId),
      }
    })
  }

  // Legacy drafts without expenseRecordId: rebuild from line items as free-form services.
  return items.map(li => {
    const amount = Math.abs(li.unitPrice)
    return {
      id: newId('svc'),
      expenseRecordId: li.servicePresetId ?? li.id,
      serviceLabel: (li.description || li.serviceType).replace(/^Credit:\s*/i, ''),
      amount,
      updatedAmount: mode === 'revised' ? amount : undefined,
      creditAmount: li.creditAmount != null ? Math.abs(li.creditAmount) : undefined,
      remark: li.remarks ?? '',
      gstApplicable: li.gstApplicable !== false,
      category: inferServiceLineCategory(li.description || li.serviceType, li.servicePresetId),
    }
  })
}

function hydrateCompositionFromDraft(
  state: InvoiceFeeCompositionState,
  draft: Invoice,
  mode: InvoiceCompositionMode = 'generate',
): InvoiceFeeCompositionState {
  const next = { ...state, draftInvoiceId: draft.id }

  for (const single of next.singles) {
    const items = draft.lineItems.filter(
      li => li.applicationId === single.applicationId && !isGoRefundExpenseId(li.servicePresetId),
    )
    single.serviceLines = hydrateServiceLinesFromItems(single.serviceLines, items, mode)
    // Sync Include checkboxes from draft refund lines already on the invoice.
    if (single.consulateRefunds?.length) {
      const includedCaseIds = new Set(
        draft.lineItems
          .map(li => caseIdFromGoRefundPreset(li.servicePresetId))
          .filter((id): id is string => Boolean(id)),
      )
      single.consulateRefunds = single.consulateRefunds.map(refund =>
        refund.status === 'pending'
          ? { ...refund, included: includedCaseIds.size === 0 ? refund.included : includedCaseIds.has(refund.caseId) }
          : refund,
      )
    }
  }

  for (const bulk of next.bulks) {
    for (const applicant of bulk.applicants) {
      const items = draft.lineItems.filter(
        li =>
          li.batchId === bulk.batchId &&
          li.applicantName === applicant.applicantName &&
          !isGoRefundExpenseId(li.servicePresetId),
      )
      applicant.serviceLines = hydrateServiceLinesFromItems(applicant.serviceLines, items, mode)
      if (applicant.consulateRefunds?.length) {
        const includedCaseIds = new Set(
          draft.lineItems
            .map(li => caseIdFromGoRefundPreset(li.servicePresetId))
            .filter((id): id is string => Boolean(id)),
        )
        applicant.consulateRefunds = applicant.consulateRefunds.map(refund =>
          refund.status === 'pending'
            ? {
                ...refund,
                included: includedCaseIds.size === 0 ? refund.included : includedCaseIds.has(refund.caseId),
              }
            : refund,
        )
      }
    }
  }

  return next
}

/** Match credit-note lines onto application-seeded composition (revised invoice). */
export function applyCreditAmountsFromCreditNote(
  state: InvoiceFeeCompositionState,
  creditNote: Invoice,
): InvoiceFeeCompositionState {
  const credits = creditNote.lineItems.map(li => ({
    presetId: li.servicePresetId,
    label: normalizeKey((li.description || li.serviceType).replace(/^Credit:\s*/i, '')),
    amount: Math.abs(li.unitPrice),
  }))

  const applyLines = (lines: InvoiceBillableServiceLine[]) =>
    lines.map(line => {
      const match =
        credits.find(c => c.presetId && c.presetId === line.expenseRecordId) ??
        credits.find(c => c.label === normalizeKey(line.serviceLabel))
      return {
        ...line,
        creditAmount: match ? match.amount : line.creditAmount,
        updatedAmount: line.updatedAmount ?? line.amount,
      }
    })

  return {
    ...state,
    singles: state.singles.map(single => ({
      ...single,
      serviceLines: applyLines(single.serviceLines),
    })),
    bulks: state.bulks.map(bulk => ({
      ...bulk,
      applicants: bulk.applicants.map(applicant => ({
        ...applicant,
        serviceLines: applyLines(applicant.serviceLines),
      })),
    })),
  }
}

/** Build a revised-invoice composition from application services + credit-note references. */
export function buildRevisedCompositionFromCreditNote(
  creditNote: Invoice,
  origin: Invoice,
): InvoiceFeeCompositionState {
  const applicationIds = origin.gltsReferences.filter(id => !origin.batchIds.includes(id))
  const state = buildInitialFeeComposition(applicationIds, origin.batchIds)
  const withMeta: InvoiceFeeCompositionState = {
    ...state,
    companyId: origin.companyId,
    companyName: origin.companyName,
    billingEntity: origin.billingEntity,
    documentDate: todayDocumentDate(),
    vesselId: origin.vesselId,
    vesselName: origin.vesselName,
    agreementId: origin.agreementId ?? state.agreementId,
  }

  const seeded = applyCreditAmountsFromCreditNote(withMeta, creditNote)
  const withUpdated = {
    ...seeded,
    singles: seeded.singles.map(s => ({
      ...s,
      serviceLines: s.serviceLines.map(line => ({
        ...line,
        updatedAmount: line.updatedAmount ?? line.amount,
      })),
    })),
    bulks: seeded.bulks.map(b => ({
      ...b,
      applicants: b.applicants.map(a => ({
        ...a,
        serviceLines: a.serviceLines.map(line => ({
          ...line,
          updatedAmount: line.updatedAmount ?? line.amount,
        })),
      })),
    })),
  }
  return withUpdated
}

/** Workspace for a revised invoice draft seeded from app services + credit-note amounts. */
export function buildRevisedWorkspaceFromCreditNote(
  creditNote: Invoice,
  origin: Invoice,
): InvoiceWorkspaceState {
  const composition = buildRevisedCompositionFromCreditNote(creditNote, origin)
  return {
    ...compositionToWorkspaceState(composition, 'revised'),
    sourceInvoiceId: origin.id,
  }
}

export function billingTypeLabel(type: CommercialAgreement['billingType'] | undefined): string {
  if (type === 'advance') return 'Advance'
  if (type === 'mixed') return 'Mixed'
  return 'Credit'
}

export interface AgreementBillableServiceOption {
  value: string
  label: string
  defaultAmount: number
  gstApplicable: boolean
}

/**
 * Miscellaneous agreement services available to add on composition.
 * GLTS processing fees are auto-seeded — not offered in the add picker.
 */
export function listAgreementBillableServiceOptions(
  agreement: CommercialAgreement | undefined | null,
): AgreementBillableServiceOption[] {
  if (!agreement) return []

  const byKey = new Map<string, AgreementBillableServiceOption>()
  const add = (value: string, label: string, defaultAmount: number, gstApplicable: boolean) => {
    const key = normalizeKey(label)
    if (!key || byKey.has(key)) return
    if (inferServiceLineCategory(label, value) === 'glts_processing') return
    byKey.set(key, { value, label: label.trim(), defaultAmount, gstApplicable })
  }

  for (const row of agreement.miscellaneousCosts) {
    add(row.id, row.serviceName, row.amount, row.gstApplicable !== false)
  }
  for (const row of agreement.miscellaneousServices ?? []) {
    add(row.serviceId || row.id, row.serviceName, row.amount, row.gstApplicable !== false)
  }

  return [...byKey.values()].sort((a, b) => a.label.localeCompare(b.label))
}

/** Agreement misc services not already present on the passenger fee lines (by label). */
export function listAvailableAgreementServicesToAdd(
  agreement: CommercialAgreement | undefined | null,
  existingLines: InvoiceBillableServiceLine[],
): AgreementBillableServiceOption[] {
  const usedLabels = new Set(
    existingLines.map(line => normalizeKey(line.serviceLabel)).filter(Boolean),
  )
  return listAgreementBillableServiceOptions(agreement).filter(
    option => !usedLabels.has(normalizeKey(option.label)),
  )
}

export function createBillableServiceLineFromAgreement(
  option: AgreementBillableServiceOption,
): InvoiceBillableServiceLine {
  return {
    id: newId('svc'),
    expenseRecordId: option.value,
    serviceLabel: option.label,
    amount: option.defaultAmount,
    remark: '',
    gstApplicable: option.gstApplicable !== false,
    category: 'miscellaneous_dispatch',
  }
}

export interface VfsBillableServiceOption {
  value: string
  label: string
  defaultAmount: number
  gstApplicable: boolean
}

/** Country-master / embassy-VFS catalog options not already on the passenger fee lines. */
export function listAvailableVfsServicesToAdd(
  country: string,
  visaType: string,
  existingLines: InvoiceBillableServiceLine[],
): VfsBillableServiceOption[] {
  if (!country.trim() || country === '—') return []

  const offeringIds = resolveOfferingIdsByLabels(country, visaType)
  const countryId = offeringIds?.countryId ?? resolveCountryId(country)
  const catalog = resolveVfsPickerServices({
    country,
    visaType,
    countryId,
    visaOfferingId: offeringIds?.visaOfferingId,
  })

  const usedLabels = new Set(
    existingLines
      .filter(line => line.category === 'vfs')
      .map(line => normalizeKey(line.serviceLabel))
      .filter(Boolean),
  )
  const usedIds = new Set(
    existingLines
      .filter(line => line.category === 'vfs')
      .map(line => line.expenseRecordId)
      .filter(Boolean),
  )

  return catalog
    .filter(
      service =>
        !usedIds.has(service.id) &&
        !(service.embassyFeeServiceId && usedIds.has(service.embassyFeeServiceId)) &&
        !usedLabels.has(normalizeKey(service.serviceName)),
    )
    .map(service => ({
      value: service.embassyFeeServiceId ?? service.id,
      label: service.serviceName,
      defaultAmount: service.amount,
      gstApplicable: Boolean(service.gstIncluded),
    }))
    .sort((a, b) => a.label.localeCompare(b.label))
}

export function createBillableServiceLineFromVfs(
  option: VfsBillableServiceOption,
): InvoiceBillableServiceLine {
  return {
    id: newId('svc-vfs'),
    expenseRecordId: option.value,
    serviceLabel: option.label,
    amount: option.defaultAmount,
    remark: '',
    gstApplicable: option.gstApplicable,
    category: 'vfs',
  }
}
