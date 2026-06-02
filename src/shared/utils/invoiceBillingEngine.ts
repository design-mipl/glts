import {
  mockBulkBatches,
  mockSingleApplications,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationListingRow } from '@/pages/customer/features/applications/types/applicationListing.types'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { companyMasterService } from '@/shared/services/companyMasterService'
import { vesselMasterService } from '@/shared/services/vesselMasterService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import type {
  InvoiceBillingSelection,
  InvoiceLineItem,
  InvoiceTaxConfig,
} from '@/shared/types/invoice'
import { calculateLineItemAmount } from '@/shared/utils/invoiceCalculations'

const COMPANY_VESSEL_MAP: Record<string, { vesselId: string; vesselName: string }> = {
  'Apex Marine Logistics': { vesselId: 'GLTS-VSL-001', vesselName: 'MV Ocean Star' },
  'Oceanic Marine Ltd': { vesselId: 'GLTS-VSL-002', vesselName: 'MV Pacific Glory' },
  'Oceanic Crew Services': { vesselId: 'GLTS-VSL-003', vesselName: 'MV Northern Wind' },
  'Seafarer Solutions': { vesselId: 'GLTS-VSL-004', vesselName: 'MV Offshore Explorer' },
}

export function isInvoiceTriggerReady(row: ApplicationListingRow): boolean {
  if (row.operationalStatus === 'Appointment Booked') return true
  return row.processingStage === 'Appointment Booked'
}

export function listBillableApplications(billableOnly = true): ApplicationListingRow[] {
  const singles = mockSingleApplications.filter(r => r.submissionDate?.trim())
  const bulks = mockBulkBatches.filter(r => r.submissionDate?.trim())
  const all: ApplicationListingRow[] = [...singles, ...bulks]
  return billableOnly ? all.filter(isInvoiceTriggerReady) : all
}

function findAgreementForCompany(companyName: string): CommercialAgreement | undefined {
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
    row.customerSegment === 'marine'
      ? 'Apex Marine Logistics'
      : 'Global Corporate Travel Ltd'

  const company =
    companyMasterService.list().find(c => c.companyName.toLowerCase() === companyName.toLowerCase()) ??
    companyMasterService.list().find(c => companyName.toLowerCase().includes(c.companyName.toLowerCase().split(' ')[0] ?? ''))

  if (company) {
    return {
      companyId: company.id,
      companyName: company.companyName,
      billingEntity: company.billingEntityName,
    }
  }

  return {
    companyId: '',
    companyName,
    billingEntity: companyName,
  }
}

function resolveVessel(companyName: string): { vesselId?: string; vesselName?: string } {
  const mapped = COMPANY_VESSEL_MAP[companyName]
  if (mapped) return mapped
  const vessels = vesselMasterService.list()
  return vessels[0] ? { vesselId: vessels[0].id, vesselName: vessels[0].vesselName } : {}
}

function normalizeCountry(country: string): string {
  return country.trim()
}

function matchPricingRow(
  agreement: CommercialAgreement,
  country: string,
  visaType: string,
) {
  const c = normalizeCountry(country).toLowerCase()
  return (
    agreement.pricingMatrix.find(
      p =>
        p.country.toLowerCase() === c ||
        c.includes(p.country.toLowerCase()) ||
        p.country.toLowerCase().includes(c),
    ) ??
    agreement.pricingMatrix.find(p => p.visaType.toLowerCase().includes(visaType.toLowerCase().split(' ')[0] ?? '')) ??
    agreement.pricingMatrix[0]
  )
}

function newLineItemId(): string {
  return `li-${Date.now()}-${Math.floor(Math.random() * 1000)}`
}

function buildVisaFeeLine(
  row: SingleApplicationRow | BulkBatchRow,
  agreement: CommercialAgreement,
  gstPercentage: number,
  batchId?: string,
): InvoiceLineItem {
  const pricing = matchPricingRow(agreement, row.country, row.visaType)
  const unitPrice = pricing?.serviceFee ?? 0
  const gstApplicable = pricing?.gstApplicable ?? agreement.billingConfig.gstApplicable
  const qty = 'totalApplicants' in row ? row.totalApplicants : 1
  const { gstAmount, amount } = calculateLineItemAmount(qty, unitPrice, gstApplicable, gstPercentage)

  return {
    id: newLineItemId(),
    applicationId: 'applicantName' in row ? row.id : undefined,
    batchId: batchId ?? ('totalApplicants' in row ? row.id : undefined),
    serviceType: 'Visa Fees',
    description: `${row.country} · ${row.visaType} service fee`,
    quantity: qty,
    unitPrice,
    gstApplicable,
    gstAmount,
    amount,
  }
}

function buildMiscLines(
  row: SingleApplicationRow | BulkBatchRow,
  agreement: CommercialAgreement,
  gstPercentage: number,
  serviceTypes: string[],
  batchId?: string,
): InvoiceLineItem[] {
  const filterServices = serviceTypes.length > 0
  return agreement.miscellaneousCosts
    .filter(mc => !filterServices || serviceTypes.some(st => mc.serviceName.toLowerCase().includes(st.toLowerCase())))
    .map(mc => {
      const qty = 'totalApplicants' in row ? row.totalApplicants : 1
      const { gstAmount, amount } = calculateLineItemAmount(
        qty,
        mc.amount,
        mc.gstApplicable,
        gstPercentage,
      )
      return {
        id: newLineItemId(),
        applicationId: 'applicantName' in row ? row.id : undefined,
        batchId: batchId ?? ('totalApplicants' in row ? row.id : undefined),
        serviceType: mc.serviceName,
        description: mc.remarks || mc.serviceName,
        quantity: qty,
        unitPrice: mc.amount,
        gstApplicable: mc.gstApplicable,
        gstAmount,
        amount,
      }
    })
}

function expandApplications(selection: InvoiceBillingSelection): Array<{
  row: SingleApplicationRow | BulkBatchRow
  batchId?: string
}> {
  const result: Array<{ row: SingleApplicationRow | BulkBatchRow; batchId?: string }> = []

  if (selection.billingMode === 'batch' || selection.batchIds.length > 0) {
    for (const batchId of selection.batchIds) {
      const batch = mockBulkBatches.find(b => b.id === batchId)
      if (batch) result.push({ row: batch, batchId: batch.id })
    }
    if (selection.billingMode === 'batch' && selection.batchIds.length === 0) return result
  }

  for (const appId of selection.applicationIds) {
    const single = mockSingleApplications.find(a => a.id === appId)
    if (single) {
      result.push({ row: single })
      continue
    }
    const batch = mockBulkBatches.find(b => b.id === appId)
    if (batch) result.push({ row: batch, batchId: batch.id })
  }

  if (selection.billingMode === 'cumulative') {
    return result
  }

  if (selection.billingMode === 'single' && selection.applicationIds.length === 1) {
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

export function buildLineItems(selection: InvoiceBillingSelection): {
  lineItems: InvoiceLineItem[]
  taxConfig: InvoiceTaxConfig
  agreementId?: string
} {
  const apps = expandApplications(selection)
  if (apps.length === 0) {
    return { lineItems: [], taxConfig: resolveTaxConfigFromAgreement() }
  }

  const firstRow = apps[0].row
  const companyInfo =
    selection.companyId && selection.companyName
      ? {
          companyName: selection.companyName,
          agreement: findAgreementForCompany(selection.companyName),
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
  const lineItems: InvoiceLineItem[] = []
  const includeVisa = selection.serviceTypes.length === 0 || selection.serviceTypes.includes('Visa Fees')
  const isServiceWise = selection.billingMode === 'service_wise' || selection.invoiceType === 'service_wise'
  const isAdditional = selection.invoiceType === 'additional_expense'

  for (const { row, batchId } of apps) {
    if (selection.billableOnly && !isInvoiceTriggerReady(row)) continue

    if (!isAdditional && includeVisa && (!isServiceWise || selection.serviceTypes.includes('Visa Fees'))) {
      if (agreement) {
        lineItems.push(buildVisaFeeLine(row, agreement, gstPercentage, batchId))
      }
    }

    if (agreement) {
      const miscTypes = isServiceWise ? selection.serviceTypes : isAdditional ? selection.serviceTypes : []
      const miscLines = buildMiscLines(
        row,
        agreement,
        gstPercentage,
        miscTypes,
        batchId,
      )
      if (isAdditional || isServiceWise || miscTypes.length === 0) {
        if (isAdditional) {
          lineItems.push(...miscLines.filter(l => l.serviceType !== 'Visa Fees'))
        } else if (!isServiceWise) {
          lineItems.push(...miscLines)
        } else {
          lineItems.push(...miscLines)
        }
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
    companyId: company.companyId || selection.companyId,
    companyName: company.companyName,
    billingEntity: selection.billingEntityOverride || company.billingEntity,
    vesselId: vessel.vesselId,
    vesselName: vessel.vesselName,
    applicationIds: single ? [single.id] : selection.applicationIds,
    batchIds: batch ? [batch.id] : selection.batchIds,
  }
}

export function getApplicationOptions(billableOnly: boolean) {
  return listBillableApplications(billableOnly).map(row => ({
    value: row.id,
    label:
      'applicantName' in row
        ? `${row.id} · ${row.applicantName}`
        : `${row.id} · ${row.companyName} (${row.totalApplicants} applicants)`,
    recordType: row.recordType,
  }))
}

export function getBatchOptions(billableOnly: boolean) {
  return mockBulkBatches
    .filter(b => b.submissionDate?.trim())
    .filter(b => !billableOnly || isInvoiceTriggerReady(b))
    .map(b => ({
      value: b.id,
      label: `${b.id} · ${b.companyName}`,
    }))
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

export const SERVICE_TYPE_OPTIONS = [
  'Visa Fees',
  'VFS Fees',
  'Courier Charges',
  'E-Ticket Charges',
  'Airport Assistance',
  'Travel Insurance',
  'Operational Charges',
  'Additional Expenses',
  'Miscellaneous Services',
]
