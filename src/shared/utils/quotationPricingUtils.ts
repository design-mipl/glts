import type { AgreementMiscCostRow, AgreementPricingRow, AgreementWorkflowType } from '@/shared/types/commercialAgreement'
import type {
  CommercialVisaPricingRule,
  QuotationFormData,
  QuotationPricingMode,
  QuotationPricingTotals,
  QuotationServiceLine,
  QuotationVfsServiceLine,
  RetailVisaPricingItem,
} from '@/shared/types/quotation'
import { roundMoney } from '@/shared/utils/invoiceCalculations'

const WORKFLOW_LABEL: Record<AgreementWorkflowType, string> = {
  marine: 'Marine',
  corporate: 'Corporate',
  b2b_agent: 'B2B Agent',
  mixed: 'Mixed',
  retail: 'Retail',
}

function workflowLabel(workflowType: AgreementWorkflowType): string {
  return WORKFLOW_LABEL[workflowType] ?? workflowType
}

export function isRetailPricingMode(workflowType: AgreementWorkflowType): boolean {
  return workflowType === 'retail'
}

export function getQuotationPricingMode(workflowType: AgreementWorkflowType): QuotationPricingMode {
  return isRetailPricingMode(workflowType) ? 'retail' : 'commercial'
}

export function emptyPricingPayload(): Pick<
  QuotationFormData,
  'pricingMatrix' | 'retailVisaPricing' | 'commercialVisaPricing' | 'miscellaneousServices'
> {
  return {
    pricingMatrix: [],
    retailVisaPricing: [],
    commercialVisaPricing: [],
    miscellaneousServices: [],
  }
}

export function clearIncompatiblePricing(
  workflowType: AgreementWorkflowType,
  prev: QuotationFormData,
): QuotationFormData {
  const nextMode = getQuotationPricingMode(workflowType)
  const prevMode = getQuotationPricingMode(prev.workflowType)
  if (nextMode === prevMode) {
    return { ...prev, workflowType }
  }
  return {
    ...prev,
    workflowType,
    ...emptyPricingPayload(),
  }
}

function newId(prefix: string) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`
}

export function flattenRetailVisaPricing(
  items: RetailVisaPricingItem[],
  workflowType: AgreementWorkflowType,
): AgreementPricingRow[] {
  const label = workflowLabel(workflowType)
  const rows: AgreementPricingRow[] = []
  for (const item of items) {
    for (const svc of item.gltsServices) {
      rows.push({
        id: newId('pr'),
        country: item.country,
        countryId: item.countryId,
        visaType: item.visaType,
        workflowType: label,
        servicePresetId: svc.serviceId,
        servicePresetName: svc.serviceName,
        serviceFee: svc.amount,
        gstApplicable: svc.gstApplicable,
        remarks: item.jurisdictionName ? `Jurisdiction: ${item.jurisdictionName}` : '',
      })
    }
    for (const vfs of item.vfsServices) {
      rows.push({
        id: newId('pr'),
        country: item.country,
        countryId: item.countryId,
        visaType: item.visaType,
        workflowType: label,
        servicePresetId: vfs.id,
        servicePresetName: `VFS · ${vfs.serviceName}`,
        serviceFee: vfs.amount,
        gstApplicable: false,
        remarks: 'VFS service',
      })
    }
  }
  return rows
}

export function flattenCommercialVisaPricing(
  rules: CommercialVisaPricingRule[],
  workflowType: AgreementWorkflowType,
): AgreementPricingRow[] {
  const label = workflowLabel(workflowType)
  return rules.map((rule) => {
    const countryLabel =
      rule.scope === 'country'
        ? rule.country ?? ''
        : rule.scope === 'country_group'
          ? rule.countryGroupName ?? 'Country Group'
          : rule.scope === 'rest_of_countries_online'
            ? 'Rest of the countries online'
            : 'Rest of the countries offline'
    return {
      id: newId('pr'),
      country: countryLabel,
      countryId: rule.countryId,
      visaType: rule.visaType,
      workflowType: label,
      servicePresetId: 'glts-service-fee',
      servicePresetName: 'GLTS Service Fee',
      serviceFee: rule.serviceFee,
      gstApplicable: rule.gstApplicable,
      remarks: rule.remarks,
    }
  })
}

export function flattenMiscellaneousToPricingRows(
  services: QuotationServiceLine[],
  workflowType: AgreementWorkflowType,
): AgreementPricingRow[] {
  const label = workflowLabel(workflowType)
  return services.map((svc) => ({
    id: newId('pr'),
    country: '—',
    visaType: 'Miscellaneous',
    workflowType: label,
    servicePresetId: svc.serviceId,
    servicePresetName: svc.serviceName,
    serviceFee: svc.amount,
    gstApplicable: svc.gstApplicable,
    remarks: 'Miscellaneous service',
  }))
}

export function flattenQuotationPricing(data: {
  workflowType: AgreementWorkflowType
  retailVisaPricing: RetailVisaPricingItem[]
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
}): AgreementPricingRow[] {
  if (isRetailPricingMode(data.workflowType)) {
    return flattenRetailVisaPricing(data.retailVisaPricing, data.workflowType)
  }
  return [
    ...flattenCommercialVisaPricing(data.commercialVisaPricing, data.workflowType),
    ...flattenMiscellaneousToPricingRows(data.miscellaneousServices, data.workflowType),
  ]
}

export function mapMiscToAgreementCosts(services: QuotationServiceLine[]): AgreementMiscCostRow[] {
  return services.map((svc) => ({
    id: newId('mc'),
    serviceName: svc.serviceName,
    pricingType: 'fixed' as const,
    amount: svc.amount,
    gstApplicable: svc.gstApplicable,
    remarks: '',
  }))
}

export function mapAgreementCostsToMiscServices(costs: AgreementMiscCostRow[]): QuotationServiceLine[] {
  return costs.map((cost) => ({
    id: cost.id || newId('qsl'),
    serviceId: cost.id || newId('svc'),
    serviceName: cost.serviceName,
    amount: cost.amount,
    gstApplicable: cost.gstApplicable,
  }))
}

/** Keep structured commercial pricing and flat matrix/costs in sync for agreements. */
export function syncAgreementCommercialPricing<
  T extends {
    workflowType: AgreementWorkflowType
    pricingMatrix: AgreementPricingRow[]
    miscellaneousCosts: AgreementMiscCostRow[]
    commercialVisaPricing?: CommercialVisaPricingRule[]
    miscellaneousServices?: QuotationServiceLine[]
  },
>(data: T): T & {
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
  pricingMatrix: AgreementPricingRow[]
  miscellaneousCosts: AgreementMiscCostRow[]
} {
  let commercialVisaPricing = data.commercialVisaPricing ?? []
  let miscellaneousServices = data.miscellaneousServices ?? []

  if (commercialVisaPricing.length === 0 && data.pricingMatrix.length > 0) {
    const hydrated = hydrateStructuredPricingFromMatrix(data.pricingMatrix, data.workflowType)
    commercialVisaPricing = hydrated.commercialVisaPricing
    if (miscellaneousServices.length === 0) {
      miscellaneousServices = hydrated.miscellaneousServices
    }
  }

  if (miscellaneousServices.length === 0 && data.miscellaneousCosts.length > 0) {
    miscellaneousServices = mapAgreementCostsToMiscServices(data.miscellaneousCosts)
  }

  const pricingMatrix = flattenQuotationPricing({
    workflowType: data.workflowType,
    retailVisaPricing: [],
    commercialVisaPricing,
    miscellaneousServices: [],
  })

  return {
    ...data,
    commercialVisaPricing,
    miscellaneousServices,
    pricingMatrix,
    miscellaneousCosts: mapMiscToAgreementCosts(miscellaneousServices),
  }
}

/** Retail quotations never convert; commercial needs structured or flat pricing. */
export function canConvertQuotationToAgreement(record: {
  workflowType: AgreementWorkflowType
  convertedAgreementId?: string
  pricingVersions: Array<{
    pricingMatrix?: AgreementPricingRow[]
    commercialVisaPricing?: CommercialVisaPricingRule[]
    miscellaneousServices?: QuotationServiceLine[]
  }>
}): boolean {
  if (isRetailPricingMode(record.workflowType)) return false
  if (record.convertedAgreementId) return false
  return record.pricingVersions.some((version) => {
    const commercial = version.commercialVisaPricing?.length ?? 0
    const matrix = version.pricingMatrix?.length ?? 0
    return commercial > 0 || matrix > 0
  })
}

export interface QuotationFeeLine {
  amount: number
  gstApplicable: boolean
}

export function collectQuotationFeeLines(data: {
  workflowType: AgreementWorkflowType
  retailVisaPricing: RetailVisaPricingItem[]
  commercialVisaPricing: CommercialVisaPricingRule[]
  miscellaneousServices: QuotationServiceLine[]
}): QuotationFeeLine[] {
  if (isRetailPricingMode(data.workflowType)) {
    const lines: QuotationFeeLine[] = []
    for (const item of data.retailVisaPricing) {
      for (const svc of item.gltsServices) {
        lines.push({ amount: svc.amount, gstApplicable: svc.gstApplicable })
      }
      for (const vfs of item.vfsServices) {
        lines.push({ amount: vfs.amount, gstApplicable: false })
      }
    }
    return lines
  }
  return [
    ...data.commercialVisaPricing.map((r) => ({
      amount: r.serviceFee,
      gstApplicable: r.gstApplicable,
    })),
    ...data.miscellaneousServices.map((s) => ({
      amount: s.amount,
      gstApplicable: s.gstApplicable,
    })),
  ]
}

export function computeFeeLineTotals(
  lines: QuotationFeeLine[],
  gstPercentage: number,
): QuotationPricingTotals {
  const subtotal = roundMoney(lines.reduce((sum, line) => sum + line.amount, 0))
  const gstAmount = roundMoney(
    lines.reduce((sum, line) => {
      if (!line.gstApplicable) return sum
      return sum + (line.amount * gstPercentage) / 100
    }, 0),
  )
  return { subtotal, gstAmount, grandTotal: roundMoney(subtotal + gstAmount) }
}

export function retailVisaCardTotal(item: RetailVisaPricingItem): number {
  const glts = item.gltsServices.reduce((s, x) => s + x.amount, 0)
  const vfs = item.vfsServices.reduce((s, x) => s + x.amount, 0)
  return roundMoney(glts + vfs)
}

export function sumVfsLines(services: QuotationVfsServiceLine[]): number {
  return roundMoney(services.reduce((s, x) => s + x.amount, 0))
}

export function hasAnyPricing(data: {
  workflowType: AgreementWorkflowType
  retailVisaPricing: RetailVisaPricingItem[]
  commercialVisaPricing: CommercialVisaPricingRule[]
}): boolean {
  if (isRetailPricingMode(data.workflowType)) return data.retailVisaPricing.length > 0
  return data.commercialVisaPricing.length > 0
}

/** Migrate legacy matrix-only versions into commercial rules when structured data is missing. */
export function hydrateStructuredPricingFromMatrix(
  matrix: AgreementPricingRow[],
  workflowType: AgreementWorkflowType,
): Pick<QuotationFormData, 'retailVisaPricing' | 'commercialVisaPricing' | 'miscellaneousServices'> {
  if (isRetailPricingMode(workflowType)) {
    return { retailVisaPricing: [], commercialVisaPricing: [], miscellaneousServices: [] }
  }
  const commercialVisaPricing: CommercialVisaPricingRule[] = matrix
    .filter((row) => row.visaType !== 'Miscellaneous' && row.remarks !== 'Miscellaneous service')
    .map((row) => {
      const country = row.country?.trim() ?? ''
      const normalized = country.toLowerCase()
      if (
        normalized === 'rest of the countries online' ||
        normalized === 'rest of countries online'
      ) {
        return {
          id: row.id,
          scope: 'rest_of_countries_online' as const,
          visaType: row.visaType,
          serviceFee: row.serviceFee,
          gstApplicable: row.gstApplicable,
          remarks: row.remarks,
        }
      }
      if (
        normalized === 'rest of the countries offline' ||
        normalized === 'rest of countries offline'
      ) {
        return {
          id: row.id,
          scope: 'rest_of_countries_offline' as const,
          visaType: row.visaType,
          serviceFee: row.serviceFee,
          gstApplicable: row.gstApplicable,
          remarks: row.remarks,
        }
      }
      if (normalized === 'rest of countries' || normalized === 'rest of the countries') {
        return {
          id: row.id,
          scope: 'rest_of_countries_online' as const,
          visaType: row.visaType,
          serviceFee: row.serviceFee,
          gstApplicable: row.gstApplicable,
          remarks: row.remarks,
        }
      }
      return {
        id: row.id,
        scope: 'country' as const,
        countryId: row.countryId,
        country: row.country,
        visaType: row.visaType,
        serviceFee: row.serviceFee,
        gstApplicable: row.gstApplicable,
        remarks: row.remarks,
      }
    })
  const miscellaneousServices: QuotationServiceLine[] = matrix
    .filter((row) => row.visaType === 'Miscellaneous' || row.remarks === 'Miscellaneous service')
    .map((row) => ({
      id: row.id,
      serviceId: row.servicePresetId,
      serviceName: row.servicePresetName,
      amount: row.serviceFee,
      gstApplicable: row.gstApplicable,
    }))
  return { retailVisaPricing: [], commercialVisaPricing, miscellaneousServices }
}
