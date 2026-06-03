import {
  mockBulkBatches,
  mockSingleApplications,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { companyMasterService } from '@/shared/services/companyMasterService'
import { serviceMasterService } from '@/shared/services/serviceMasterService'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import type { MasterApplicability } from '@/shared/types/masterCommon'
import type {
  InvoiceBillingSelection,
  InvoiceLineItem,
  InvoiceTaxConfig,
  LineItemBillingStatus,
} from '@/shared/types/invoice'
import {
  getBilledItemsRegistry,
  isServiceAlreadyBilled,
} from '@/shared/utils/invoiceBilledItemsRegistry'
import { calculateLineItemAmount, defaultLineItemFields } from '@/shared/utils/invoiceCalculations'

const COMPANY_VESSEL_MAP: Record<string, { vesselId: string; vesselName: string }> = {
  'Apex Marine Logistics': { vesselId: 'GLTS-VSL-001', vesselName: 'MV Ocean Star' },
  'Oceanic Marine Ltd': { vesselId: 'GLTS-VSL-002', vesselName: 'MV Pacific Glory' },
  'Oceanic Crew Services': { vesselId: 'GLTS-VSL-003', vesselName: 'MV Northern Wind' },
  'Seafarer Solutions': { vesselId: 'GLTS-VSL-004', vesselName: 'MV Offshore Explorer' },
}

const SEGMENT_TO_APPLICABILITY: Record<string, MasterApplicability> = {
  marine: 'marine',
  corporate: 'corporate',
  b2bAgents: 'b2b',
  b2b: 'b2b',
}

export function isInvoiceTriggerReady(row: ApplicationListingRow): boolean {
  if (row.customerSegment === 'retail') return false
  if (row.operationalStatus === 'Appointment Booked') return true
  return row.processingStage === 'Appointment Booked'
}

export function listBillableApplications(): ApplicationListingRow[] {
  const singles = mockSingleApplications.filter(r => r.submissionDate?.trim())
  const bulks = mockBulkBatches.filter(r => r.submissionDate?.trim())
  return [...singles, ...bulks].filter(isInvoiceTriggerReady)
}

export function findAgreementForCompany(companyName: string): CommercialAgreement | undefined {
  const normalized = companyName.trim().toLowerCase()
  return commercialAgreementService
    .list()
    .find(
      a =>
        a.status === 'approved' &&
        (a.companyName.toLowerCase().includes(normalized) ||
          normalized.includes(a.companyName.toLowerCase().split(' ')[0] ?? '')),
    )
}

function resolveCompanyFromApplication(row: ApplicationListingRow): {
  companyId: string
  companyName: string
  billingEntity: string
} {
  const companyName =
    ('companyName' in row && row.companyName) ||
    (row.customerSegment === 'marine' ? 'Apex Marine Logistics' : 'Global Corporate Travel Ltd')

  const company =
    companyMasterService.list().find(c => c.companyName.toLowerCase() === companyName.toLowerCase()) ??
    companyMasterService
      .list()
      .find(c => companyName.toLowerCase().includes(c.companyName.toLowerCase().split(' ')[0] ?? ''))

  if (company) {
    return {
      companyId: company.id,
      companyName: company.companyName,
      billingEntity: company.billingEntityName,
    }
  }

  return { companyId: '', companyName, billingEntity: companyName }
}

function resolveVessel(companyName: string): { vesselId?: string; vesselName?: string } {
  const mapped = COMPANY_VESSEL_MAP[companyName]
  if (mapped) return mapped
  const vessels = vesselMasterService.list()
  return vessels[0] ? { vesselId: vessels[0].id, vesselName: vessels[0].vesselName } : {}
}

function getApplicantName(row: SingleApplicationRow | BulkBatchRow): string {
  if ('applicantName' in row) return row.applicantName
  return `${row.companyName} (${row.totalApplicants} crew)`
}

function getAppointmentDate(row: SingleApplicationRow | BulkBatchRow): string {
  if (row.appointmentDate) return row.appointmentDate
  return row.submissionDate ?? '—'
}

function matchPricingRow(agreement: CommercialAgreement, country: string, visaType: string) {
  const c = country.trim().toLowerCase()
  return (
    agreement.pricingMatrix.find(
      p =>
        p.country.toLowerCase() === c ||
        c.includes(p.country.toLowerCase()) ||
        p.country.toLowerCase().includes(c),
    ) ??
    agreement.pricingMatrix.find(p =>
      p.visaType.toLowerCase().includes(visaType.toLowerCase().split(' ')[0] ?? ''),
    ) ??
    agreement.pricingMatrix[0]
  )
}

function newLineItemId(): string {
  return `li-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function resolveBillingStatus(
  registry: Set<string>,
  applicationId?: string,
  batchId?: string,
  serviceType?: string,
): LineItemBillingStatus {
  return isServiceAlreadyBilled(registry, applicationId, batchId, serviceType) ? 'billed' : 'unbilled'
}

function buildLineItemBase(
  row: SingleApplicationRow | BulkBatchRow,
  batchId: string | undefined,
  registry: Set<string>,
  fields: Omit<InvoiceLineItem, 'id'>,
): InvoiceLineItem {
  const applicationId = 'applicantName' in row ? row.id : undefined
  const resolvedBatchId = batchId ?? ('totalApplicants' in row ? row.id : undefined)
  const billingStatus = resolveBillingStatus(registry, applicationId, resolvedBatchId, fields.serviceType)
  return {
    id: newLineItemId(),
    applicationId,
    batchId: resolvedBatchId,
    applicantName: getApplicantName(row),
    ...defaultLineItemFields(),
    ...fields,
    billingStatus,
    included: billingStatus !== 'billed',
  }
}

function buildVisaFeeLine(
  row: SingleApplicationRow | BulkBatchRow,
  agreement: CommercialAgreement,
  gstPercentage: number,
  registry: Set<string>,
  batchId?: string,
): InvoiceLineItem {
  const pricing = matchPricingRow(agreement, row.country, row.visaType)
  const unitPrice = pricing?.serviceFee ?? 0
  const gstApplicable = pricing?.gstApplicable ?? agreement.billingConfig.gstApplicable
  const qty = 'totalApplicants' in row ? row.totalApplicants : 1
  const { gstAmount, amount } = calculateLineItemAmount(qty, unitPrice, gstApplicable, gstPercentage)

  return buildLineItemBase(row, batchId, registry, {
    servicePresetId: pricing?.servicePresetId,
    serviceType: pricing?.servicePresetName ?? 'Visa Fee',
    description: `${row.country} · ${row.visaType} service fee`,
    quantity: qty,
    unitPrice,
    gstApplicable,
    gstAmount,
    amount,
    included: true,
    billingStatus: 'unbilled',
    isAdditionalExpense: false,
    remarks: '',
  })
}

function buildMiscLines(
  row: SingleApplicationRow | BulkBatchRow,
  agreement: CommercialAgreement,
  gstPercentage: number,
  registry: Set<string>,
  servicePresetIds: string[],
  batchId?: string,
  additionalOnly = false,
): InvoiceLineItem[] {
  const services = serviceMasterService.list()
  const filterByPreset = servicePresetIds.length > 0

  return agreement.miscellaneousCosts
    .filter(mc => {
      if (additionalOnly && !mc.serviceName.toLowerCase().includes('additional')) return false
      if (!filterByPreset) return true
      const match = services.find(
        s =>
          servicePresetIds.includes(s.id) &&
          (s.serviceName.toLowerCase().includes(mc.serviceName.toLowerCase()) ||
            mc.serviceName.toLowerCase().includes(s.serviceName.toLowerCase())),
      )
      return Boolean(match) || servicePresetIds.some(id => mc.serviceName.includes(id))
    })
    .map(mc => {
      const qty = 'totalApplicants' in row ? row.totalApplicants : 1
      const master = services.find(s => mc.serviceName.toLowerCase().includes(s.serviceName.toLowerCase()))
      const { gstAmount, amount } = calculateLineItemAmount(qty, mc.amount, mc.gstApplicable, gstPercentage)
      return buildLineItemBase(row, batchId, registry, {
        servicePresetId: master?.id,
        serviceType: mc.serviceName,
        description: mc.remarks || mc.serviceName,
        quantity: qty,
        unitPrice: mc.amount,
        gstApplicable: mc.gstApplicable,
        gstAmount,
        amount,
        included: true,
        billingStatus: 'unbilled',
        isAdditionalExpense: additionalOnly,
        remarks: mc.remarks ?? '',
      })
    })
}

function expandApplications(selection: InvoiceBillingSelection): Array<{
  row: SingleApplicationRow | BulkBatchRow
  batchId?: string
}> {
  const result: Array<{ row: SingleApplicationRow | BulkBatchRow; batchId?: string }> = []

  if (
    selection.applicationSelectionMode === 'batch' ||
    (selection.batchIds.length > 0 && selection.applicationSelectionMode !== 'multiple')
  ) {
    for (const batchId of selection.batchIds) {
      const batch = mockBulkBatches.find(b => b.id === batchId)
      if (batch && isInvoiceTriggerReady(batch)) result.push({ row: batch, batchId: batch.id })
    }
    if (selection.applicationSelectionMode === 'batch') return result
  }

  for (const appId of selection.applicationIds) {
    const single = mockSingleApplications.find(a => a.id === appId)
    if (single && isInvoiceTriggerReady(single)) {
      result.push({ row: single })
      continue
    }
    const batch = mockBulkBatches.find(b => b.id === appId)
    if (batch && isInvoiceTriggerReady(batch)) result.push({ row: batch, batchId: batch.id })
  }

  if (selection.applicationSelectionMode === 'single' && result.length > 1) {
    return result.slice(0, 1)
  }

  return result
}

export function resolveTaxConfigFromAgreement(agreement?: CommercialAgreement): InvoiceTaxConfig {
  if (!agreement) {
    return { gstApplicable: true, gstPercentage: 18, tdsApplicable: false, tdsPercentage: 0 }
  }
  return {
    gstApplicable: agreement.billingConfig.gstApplicable,
    gstPercentage: agreement.billingConfig.gstPercentage,
    tdsApplicable: agreement.billingConfig.tdsApplicable,
    tdsPercentage: agreement.billingConfig.tdsPercentage,
  }
}

export function fetchCompanyWiseBillables(selection: InvoiceBillingSelection): InvoiceBillingSelection {
  if (!selection.companyId && !selection.companyName) return selection

  const company = companyMasterService.list().find(c => c.id === selection.companyId)
  const companyName = company?.companyName ?? selection.companyName
  const from = selection.billingPeriodFrom
  const to = selection.billingPeriodTo

  const matchesCompany = (row: ApplicationListingRow) => {
    const rowCompany =
      'companyName' in row && row.companyName ? row.companyName : resolveCompanyFromApplication(row).companyName
    return rowCompany.toLowerCase().includes(companyName.toLowerCase())
  }

  const inPeriod = (row: ApplicationListingRow) => {
    if (!from && !to) return true
    const date = getAppointmentDate(row as SingleApplicationRow | BulkBatchRow)
    if (date === '—') return true
    if (from && date < from) return false
    if (to && date > to) return false
    return true
  }

  const eligible = listBillableApplications().filter(r => matchesCompany(r) && inPeriod(r))

  const applicationIds = eligible
    .filter(r => r.recordType === 'single')
    .map(r => r.id)
  const batchIds = eligible.filter(r => r.recordType === 'bulk').map(r => r.id)

  return {
    ...selection,
    companyName,
    companyId: company?.id ?? selection.companyId,
    billingEntity: selection.billingEntityOverride || company?.billingEntityName || selection.billingEntity,
    applicationIds,
    batchIds,
    applicationSelectionMode: batchIds.length === 1 && applicationIds.length === 0 ? 'batch' : 'multiple',
  }
}

export function buildLineItems(selection: InvoiceBillingSelection): {
  lineItems: InvoiceLineItem[]
  taxConfig: InvoiceTaxConfig
  agreementId?: string
} {
  const effectiveSelection =
    selection.billingMode === 'company_wise' ? fetchCompanyWiseBillables(selection) : selection

  const apps = expandApplications(effectiveSelection)
  if (apps.length === 0) {
    return { lineItems: [], taxConfig: resolveTaxConfigFromAgreement() }
  }

  const firstRow = apps[0].row
  const companyInfo =
    effectiveSelection.companyId && effectiveSelection.companyName
      ? {
          companyName: effectiveSelection.companyName,
          agreement: findAgreementForCompany(effectiveSelection.companyName),
        }
      : (() => {
          const resolved = resolveCompanyFromApplication(firstRow)
          return {
            companyName: resolved.companyName,
            agreement: findAgreementForCompany(resolved.companyName),
          }
        })()

  const agreement = companyInfo.agreement
  const taxConfig = resolveTaxConfigFromAgreement(agreement)
  const gstPercentage = taxConfig.gstPercentage
  const registry = getBilledItemsRegistry()
  const lineItems: InvoiceLineItem[] = []
  const isAdditional = effectiveSelection.invoiceType === 'additional_expense'
  const isSingleService =
    effectiveSelection.invoiceType === 'single_invoice' && effectiveSelection.servicePresetIds.length > 0

  for (const { row, batchId } of apps) {
    if (!isInvoiceTriggerReady(row)) continue

    const includeVisa =
      !isAdditional &&
      (!isSingleService ||
        effectiveSelection.servicePresetIds.some(id => {
          const svc = serviceMasterService.getById(id)
          return svc?.serviceName.toLowerCase().includes('visa')
        }))

    if (includeVisa && agreement) {
      lineItems.push(buildVisaFeeLine(row, agreement, gstPercentage, registry, batchId))
    }

    if (agreement) {
      const miscLines = buildMiscLines(
        row,
        agreement,
        gstPercentage,
        registry,
        effectiveSelection.servicePresetIds,
        batchId,
        isAdditional,
      )
      if (isAdditional) {
        lineItems.push(...miscLines)
      } else if (isSingleService) {
        lineItems.push(...miscLines)
      } else if (effectiveSelection.invoiceType !== 'single_invoice') {
        lineItems.push(...miscLines)
      }
    }
  }

  return { lineItems, taxConfig, agreementId: agreement?.id }
}

export function enrichSelectionFromApplication(
  selection: InvoiceBillingSelection,
  applicationId: string,
): InvoiceBillingSelection {
  const single = mockSingleApplications.find(a => a.id === applicationId)
  const batch = mockBulkBatches.find(b => b.id === applicationId)
  const row = single ?? batch
  if (!row) return selection

  const company = resolveCompanyFromApplication(row)
  const vessel = resolveVessel(company.companyName)

  return {
    ...selection,
    billingMode: 'application_wise',
    applicationSelectionMode: batch ? 'batch' : 'single',
    companyId: company.companyId || selection.companyId,
    companyName: company.companyName,
    billingEntity: selection.billingEntityOverride || company.billingEntity,
    vesselId: vessel.vesselId,
    vesselName: vessel.vesselName,
    applicationIds: single ? [single.id] : selection.applicationIds,
    batchIds: batch ? [batch.id] : selection.batchIds,
    invoiceType: selection.invoiceType === 'credit_note' ? 'credit_note' : 'single_invoice',
  }
}

export function getBillableApplicationRows(): ApplicationListingRow[] {
  return listBillableApplications()
}

export function getCompanyOptions() {
  return companyMasterService.list().map(c => ({
    value: c.id,
    label: c.companyName,
    billingEntity: c.billingEntityName,
  }))
}

export function getVesselOptions() {
  return vesselMasterService.list().map(v => ({
    value: v.id,
    label: v.vesselName,
  }))
}

export function getBillableServiceOptions(segment?: string) {
  const applicability = segment ? SEGMENT_TO_APPLICABILITY[segment] : undefined
  const services = serviceMasterService.list().filter(s => s.status === 'active')
  const filtered = applicability
    ? services.filter(s => s.applicableFor.includes(applicability))
    : services.filter(s => !s.applicableFor.includes('retail'))
  return filtered.map(s => ({
    value: s.id,
    label: s.serviceName,
    defaultPrice: s.defaultPrice,
  }))
}

export function resolveApplicationBillingEntity(row: ApplicationListingRow): string {
  return resolveCompanyFromApplication(row).billingEntity
}

export function resolveApplicationVessel(row: ApplicationListingRow): string {
  const companyName =
    'companyName' in row && row.companyName
      ? row.companyName
      : resolveCompanyFromApplication(row).companyName
  return resolveVessel(companyName).vesselName ?? '—'
}

export function getApplicationBillingStatusLabel(row: ApplicationListingRow): string {
  const registry = getBilledItemsRegistry()
  const appId = row.id
  const hasBilled = [...registry].some(key => key.startsWith(`${appId}::`))
  return hasBilled ? 'Partially billed' : 'Unbilled'
}

export { getApplicantName, getAppointmentDate }
