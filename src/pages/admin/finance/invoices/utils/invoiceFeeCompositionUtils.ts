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
import { companyMasterService } from '@/shared/services/companyMasterService'
import { serviceMasterService } from '@/shared/services/serviceMasterService'
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
import { INVOICE_COMPOSITION_FEE_LABELS } from '../config/invoiceFeeCategoryLabels'
import type {
  ApplicantFeeBundle,
  BulkApplicationFeeCard,
  InvoiceFeeCategoryTotals,
  InvoiceFeeCompositionState,
  InvoiceFeeCompositionSummary,
  RepeatableFeeRow,
  SimpleFeeField,
  SingleApplicationFeeCard,
} from '../types/invoiceFeeComposition.types'

const FEE = INVOICE_COMPOSITION_FEE_LABELS

export const CUSTOM_FEE_TYPE_VALUE = '__custom__'

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

export function emptySimpleFee(): SimpleFeeField {
  return { amount: 0, notes: '' }
}

export function emptyRepeatableRow(): RepeatableFeeRow {
  return {
    id: newId('fee'),
    feeType: '',
    feeTypeLabel: '',
    isCustom: false,
    amount: 0,
    notes: '',
  }
}

function defaultGltsAmount(agreement?: CommercialAgreement): number {
  const row = agreement?.pricingMatrix[0]
  return row?.serviceFee ? roundMoney(row.serviceFee * 0.15) : 1500
}

function defaultVisaAmount(agreement?: CommercialAgreement, country?: string): number {
  const row =
    agreement?.pricingMatrix.find(p => p.country.toLowerCase() === (country ?? '').toLowerCase()) ??
    agreement?.pricingMatrix[0]
  return row?.serviceFee ?? 3500
}

export function getHandlingFeeTypeOptions() {
  const fromMaster = serviceMasterService
    .list()
    .filter(
      s =>
        s.status === 'active' &&
        (s.category === 'Documentation' ||
          s.category === 'Consultation' ||
          s.category === 'Travel Support' ||
          s.serviceName.toLowerCase().includes('handling') ||
          s.serviceName.toLowerCase().includes('submission') ||
          s.serviceName.toLowerCase().includes('processing')),
    )
    .map(s => ({ value: s.id, label: s.serviceName, defaultPrice: s.defaultPrice ?? 0 }))

  return [...fromMaster, { value: CUSTOM_FEE_TYPE_VALUE, label: FEE.courierFees.customOption, defaultPrice: 0 }]
}

export function getMiscellaneousFeeTypeOptions() {
  const fromMaster = serviceMasterService
    .list()
    .filter(
      s =>
        s.status === 'active' &&
        (s.category === 'Travel Support' ||
          s.category === 'Documentation' ||
          s.serviceName.toLowerCase().includes('courier') ||
          s.serviceName.toLowerCase().includes('logistics') ||
          s.serviceName.toLowerCase().includes('apostille')),
    )
    .map(s => ({ value: s.id, label: s.serviceName, defaultPrice: s.defaultPrice ?? 0 }))

  return [...fromMaster, { value: CUSTOM_FEE_TYPE_VALUE, label: FEE.miscellaneousFees.customOption, defaultPrice: 0 }]
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

  const agreement = findAgreementForCompany(batch.companyName)
  return queueRows.map(row => ({
    applicantId: row.gltsApplicantId,
    applicantName: row.travelerName,
    passportNumber: row.passportNo,
    country: batch.country,
    visaType: batch.visaType,
    gltsFees: { amount: defaultGltsAmount(agreement), notes: '' },
    visaFees: { amount: defaultVisaAmount(agreement, batch.country), notes: '' },
    handlingFees: [],
    miscellaneousFees: [],
  }))
}

function buildSingleCard(row: SingleApplicationRow): SingleApplicationFeeCard {
  const agreement = findAgreementForCompany(row.companyName ?? '')
  return {
    applicationId: row.id,
    applicationName: resolveApplicationDisplayName(row),
    companyName: row.companyName ?? '—',
    country: row.country,
    visaType: row.visaType,
    billingEntity: resolveApplicationBillingEntity(row),
    vessel: resolveApplicationVessel(row),
    applicantName: row.applicantName,
    gltsFees: { amount: defaultGltsAmount(agreement), notes: '' },
    visaFees: { amount: defaultVisaAmount(agreement, row.country), notes: '' },
    handlingFees: [],
    miscellaneousFees: [],
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

function sumRepeatable(rows: RepeatableFeeRow[]) {
  return roundMoney(rows.reduce((s, r) => s + (r.amount || 0), 0))
}

function applicantCategoryTotals(applicant: ApplicantFeeBundle): InvoiceFeeCategoryTotals {
  return {
    gltsFees: applicant.gltsFees.amount,
    visaFees: applicant.visaFees.amount,
    handlingFees: sumRepeatable(applicant.handlingFees),
    miscellaneousFees: sumRepeatable(applicant.miscellaneousFees),
  }
}

export function computeCompositionSummary(state: InvoiceFeeCompositionState): InvoiceFeeCompositionSummary {
  let gltsFees = 0
  let visaFees = 0
  let handlingFees = 0
  let miscellaneousFees = 0
  let totalApplicants = 0

  for (const single of state.singles) {
    totalApplicants += 1
    gltsFees += single.gltsFees.amount
    visaFees += single.visaFees.amount
    handlingFees += sumRepeatable(single.handlingFees)
    miscellaneousFees += sumRepeatable(single.miscellaneousFees)
  }

  for (const bulk of state.bulks) {
    totalApplicants += bulk.applicants.length
    for (const applicant of bulk.applicants) {
      const t = applicantCategoryTotals(applicant)
      gltsFees += t.gltsFees
      visaFees += t.visaFees
      handlingFees += t.handlingFees
      miscellaneousFees += t.miscellaneousFees
    }
  }

  return {
    totalApplications: state.singles.length + state.bulks.length,
    totalApplicants,
    singleCount: state.singles.length,
    bulkCount: state.bulks.length,
    gltsFees: roundMoney(gltsFees),
    visaFees: roundMoney(visaFees),
    handlingFees: roundMoney(handlingFees),
    miscellaneousFees: roundMoney(miscellaneousFees),
  }
}

function lineItemFromFee(
  partial: Partial<InvoiceLineItem> & Pick<InvoiceLineItem, 'serviceType' | 'description' | 'unitPrice'>,
  taxConfig: InvoiceTaxConfig,
): InvoiceLineItem {
  const gstApplicable =
    taxConfig.gstApplicable && partial.serviceType === FEE.processingCharges.serviceType
  const base: InvoiceLineItem = {
    ...defaultLineItemFields(),
    id: newId('li'),
    quantity: 1,
    gstApplicable,
    gstAmount: 0,
    amount: 0,
    ...partial,
  }
  const { gstAmount, amount } = calculateLineItemAmount(
    base.quantity,
    base.unitPrice,
    base.gstApplicable,
    taxConfig.gstPercentage,
  )
  return { ...base, gstAmount, amount }
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
    if (single.gltsFees.amount > 0) {
      lineItems.push(
        lineItemFromFee(
          {
            applicationId: single.applicationId,
            applicantName: single.applicantName,
            serviceType: FEE.processingCharges.serviceType,
            description: single.gltsFees.notes || `Processing charges · ${single.applicationId}`,
            unitPrice: single.gltsFees.amount,
            remarks: single.gltsFees.notes,
          },
          taxConfig,
        ),
      )
    }
    if (single.visaFees.amount > 0) {
      lineItems.push(
        lineItemFromFee(
          {
            applicationId: single.applicationId,
            applicantName: single.applicantName,
            serviceType: FEE.visaFees.serviceType,
            description: single.visaFees.notes || `Visa fees · ${single.country}`,
            unitPrice: single.visaFees.amount,
            remarks: single.visaFees.notes,
          },
          taxConfig,
        ),
      )
    }
    for (const row of single.handlingFees) {
      if (row.amount <= 0) continue
      lineItems.push(
        lineItemFromFee(
          {
            applicationId: single.applicationId,
            applicantName: single.applicantName,
            serviceType: FEE.courierFees.serviceType,
            description: row.feeTypeLabel || row.feeType,
            unitPrice: row.amount,
            remarks: row.notes,
            servicePresetId: row.isCustom ? undefined : row.feeType,
          },
          taxConfig,
        ),
      )
    }
    for (const row of single.miscellaneousFees) {
      if (row.amount <= 0) continue
      lineItems.push(
        lineItemFromFee(
          {
            applicationId: single.applicationId,
            applicantName: single.applicantName,
            serviceType: FEE.miscellaneousFees.serviceType,
            description: row.feeTypeLabel || row.feeType,
            unitPrice: row.amount,
            remarks: row.notes,
            isAdditionalExpense: true,
            servicePresetId: row.isCustom ? undefined : row.feeType,
          },
          taxConfig,
        ),
      )
    }
  }

  for (const bulk of state.bulks) {
    for (const applicant of bulk.applicants) {
      if (applicant.gltsFees.amount > 0) {
        lineItems.push(
          lineItemFromFee(
            {
              batchId: bulk.batchId,
              applicantName: applicant.applicantName,
              serviceType: FEE.processingCharges.serviceType,
              description: applicant.gltsFees.notes || `Processing charges · ${applicant.applicantName}`,
              unitPrice: applicant.gltsFees.amount,
              remarks: applicant.gltsFees.notes,
            },
            taxConfig,
          ),
        )
      }
      if (applicant.visaFees.amount > 0) {
        lineItems.push(
          lineItemFromFee(
            {
              batchId: bulk.batchId,
              applicantName: applicant.applicantName,
              serviceType: FEE.visaFees.serviceType,
              description: applicant.visaFees.notes || `Visa fees · ${applicant.country}`,
              unitPrice: applicant.visaFees.amount,
              remarks: applicant.visaFees.notes,
            },
            taxConfig,
          ),
        )
      }
      for (const row of applicant.handlingFees) {
        if (row.amount <= 0) continue
        lineItems.push(
          lineItemFromFee(
            {
              batchId: bulk.batchId,
              applicantName: applicant.applicantName,
              serviceType: FEE.courierFees.serviceType,
              description: row.feeTypeLabel || row.feeType,
              unitPrice: row.amount,
              remarks: row.notes,
              servicePresetId: row.isCustom ? undefined : row.feeType,
            },
            taxConfig,
          ),
        )
      }
      for (const row of applicant.miscellaneousFees) {
        if (row.amount <= 0) continue
        lineItems.push(
          lineItemFromFee(
            {
              batchId: bulk.batchId,
              applicantName: applicant.applicantName,
              serviceType: FEE.miscellaneousFees.serviceType,
              description: row.feeTypeLabel || row.feeType,
              unitPrice: row.amount,
              remarks: row.notes,
              isAdditionalExpense: true,
              servicePresetId: row.isCustom ? undefined : row.feeType,
            },
            taxConfig,
          ),
        )
      }
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

function hydrateCompositionFromDraft(
  state: InvoiceFeeCompositionState,
  draft: Invoice,
): InvoiceFeeCompositionState {
  const next = { ...state, draftInvoiceId: draft.id }

  const applySimple = (target: SimpleFeeField, serviceType: string, items: InvoiceLineItem[]) => {
    const match = items.find(li => li.serviceType.toLowerCase().includes(serviceType.toLowerCase()))
    if (match) {
      target.amount = match.unitPrice
      target.notes = match.remarks ?? ''
    }
  }

  const applyRepeatable = (serviceType: string, items: InvoiceLineItem[]) => {
    const matches = items.filter(li => li.serviceType.toLowerCase().includes(serviceType.toLowerCase()))
    return matches.map(li => ({
      id: newId('fee'),
      feeType: li.servicePresetId ?? CUSTOM_FEE_TYPE_VALUE,
      feeTypeLabel: li.description,
      isCustom: !li.servicePresetId,
      amount: li.unitPrice,
      notes: li.remarks ?? '',
    }))
  }

  for (const single of next.singles) {
    const items = draft.lineItems.filter(li => li.applicationId === single.applicationId)
    applySimple(single.gltsFees, 'glts', items)
    applySimple(single.visaFees, 'visa', items)
    single.handlingFees = applyRepeatable('handling', items)
    single.miscellaneousFees = applyRepeatable('miscellaneous', items)
  }

  for (const bulk of next.bulks) {
    for (const applicant of bulk.applicants) {
      const items = draft.lineItems.filter(
        li => li.batchId === bulk.batchId && li.applicantName === applicant.applicantName,
      )
      applySimple(applicant.gltsFees, 'glts', items)
      applySimple(applicant.visaFees, 'visa', items)
      applicant.handlingFees = applyRepeatable('handling', items)
      applicant.miscellaneousFees = applyRepeatable('miscellaneous', items)
    }
  }

  return next
}

export function billingTypeLabel(type: CommercialAgreement['billingType'] | undefined): string {
  if (type === 'advance') return 'Advance'
  if (type === 'mixed') return 'Mixed'
  return 'Credit'
}
