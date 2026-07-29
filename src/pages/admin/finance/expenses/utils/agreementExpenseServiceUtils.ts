import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { companyMasterService } from '@/shared/services/companyMasterService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import type {
  ApplicationExpenseServiceSource,
  ApplicationExpenseSource,
  ApplicationExpenseType,
} from '@/shared/types/applicationExpenseManagement'

export interface AgreementExpenseServiceOption {
  id: string
  label: string
  /** Secondary meta shown in the select or helper text. */
  description?: string
  amount: number
  gstApplicable: boolean
  expenseType: ApplicationExpenseType
  expenseSource: ApplicationExpenseSource
  serviceSource: ApplicationExpenseServiceSource
  linkedService: string
}

export interface ResolveAgreementExpenseServicesInput {
  companyName: string
  visaCountry?: string
  visaType?: string
}

function normalize(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase()
}

function matchesCountryVisa(
  rowCountry: string | undefined,
  rowVisa: string | undefined,
  visaCountry?: string,
  visaType?: string,
): boolean {
  const country = normalize(visaCountry)
  const visa = normalize(visaType)
  if (!country && !visa) return true

  const rowC = normalize(rowCountry)
  const rowV = normalize(rowVisa)

  if (country && rowC && !rowC.includes(country) && !country.includes(rowC)) return false
  if (visa && rowV) {
    // Agreement visa may be shorter ("Crew") vs app ("Crew · Type C")
    if (!rowV.includes(visa) && !visa.includes(rowV) && !visa.split(/[·|,/-]/).some(part => {
      const p = part.trim()
      return p.length > 2 && (rowV.includes(p) || p.includes(rowV))
    })) {
      return false
    }
  }
  return true
}

function inferExpenseType(serviceName: string): ApplicationExpenseType {
  const name = normalize(serviceName)
  if (name.includes('vfs') || name.includes('biometric') || name.includes('appointment')) {
    return 'vfs_booking_service'
  }
  if (name.includes('courier')) return 'courier_service'
  if (name.includes('insurance')) return 'travel_insurance'
  if (name.includes('ticket') || name.includes('flight') || name.includes('airfare')) {
    return 'flight_ticket'
  }
  if (name.includes('ground') || name.includes('local travel') || name.includes('travel')) {
    return 'ground_operation_service'
  }
  if (name.includes('documentation') || name.includes('vendor')) return 'vendor_service'
  if (name.includes('glts') || name.includes('service fee') || name.includes('processing')) {
    return 'visa_processing_fee'
  }
  return 'other'
}

function inferServiceSource(expenseType: ApplicationExpenseType): ApplicationExpenseServiceSource {
  switch (expenseType) {
    case 'vfs_booking_service':
      return 'vfs_service'
    case 'courier_service':
      return 'courier_partner'
    case 'travel_insurance':
      return 'insurance_vendor'
    case 'flight_ticket':
    case 'train_ticket':
    case 'bus_ticket':
    case 'marine_ticket':
      return 'ticket_vendor'
    case 'ground_operation_service':
      return 'ground_staff_service'
    case 'vendor_service':
      return 'vendor_service'
    case 'visa_processing_fee':
    case 'glts_service_fee':
    case 'documentation_service':
      return 'glts_service'
    default:
      return 'other'
  }
}

function inferExpenseSource(expenseType: ApplicationExpenseType): ApplicationExpenseSource {
  switch (expenseType) {
    case 'travel_insurance':
      return 'insurance_related'
    case 'flight_ticket':
    case 'train_ticket':
    case 'bus_ticket':
    case 'marine_ticket':
      return 'ticket_related'
    case 'ground_operation_service':
      return 'ground_operations'
    case 'vendor_service':
    case 'courier_service':
      return 'vendor_service'
    default:
      return 'application_service'
  }
}

function resolveCompanyId(companyName: string): string | undefined {
  const needle = normalize(companyName)
  if (!needle) return undefined
  // Prefer exact match — loose includes can attach the wrong client agreement.
  const exact = companyMasterService.list().find(company => normalize(company.companyName) === needle)
  return exact?.id
}

function pickActiveAgreement(companyId: string | undefined, companyName: string): CommercialAgreement | undefined {
  const byCompany = companyId
    ? commercialAgreementService.list({ companyId, status: 'active' })
    : []
  if (byCompany.length > 0) {
    return [...byCompany].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
  }

  // Fallback: exact company name on active agreements
  const needle = normalize(companyName)
  if (!needle) return undefined
  const named = commercialAgreementService
    .list({ status: 'active' })
    .filter(agreement => normalize(agreement.companyName) === needle)
  return [...named].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
}

function pushUnique(
  map: Map<string, AgreementExpenseServiceOption>,
  option: AgreementExpenseServiceOption,
) {
  if (!map.has(option.id)) map.set(option.id, option)
}

/** Services available to add as expenses from the client's active commercial agreement. */
export function resolveAgreementExpenseServices(
  input: ResolveAgreementExpenseServicesInput,
): {
  agreement?: CommercialAgreement
  options: AgreementExpenseServiceOption[]
} {
  const companyId = resolveCompanyId(input.companyName)
  const agreement = pickActiveAgreement(companyId, input.companyName)
  if (!agreement) return { options: [] }

  const options = new Map<string, AgreementExpenseServiceOption>()

  for (const row of agreement.pricingMatrix ?? []) {
    if (!matchesCountryVisa(row.country, row.visaType, input.visaCountry, input.visaType)) {
      continue
    }

    const label = row.servicePresetName.trim() || 'Agreement service'
    const expenseType = inferExpenseType(label)
    pushUnique(options, {
      id: `pricing:${row.id}`,
      label,
      description: [row.country, row.visaType].filter(Boolean).join(' · ') || undefined,
      amount: row.serviceFee,
      gstApplicable: row.gstApplicable,
      expenseType,
      expenseSource: inferExpenseSource(expenseType),
      serviceSource: inferServiceSource(expenseType),
      linkedService: label,
    })
  }

  for (const rule of agreement.commercialVisaPricing ?? []) {
    if (!matchesCountryVisa(rule.country, rule.visaType, input.visaCountry, input.visaType)) {
      continue
    }
    const label = `Visa processing · ${rule.visaType || 'Service'}`
    const expenseType = 'visa_processing_fee' as const
    pushUnique(options, {
      id: `commercial:${rule.id}`,
      label,
      description: [rule.country || rule.countryGroupName, rule.visaType].filter(Boolean).join(' · ') || undefined,
      amount: rule.serviceFee,
      gstApplicable: rule.gstApplicable,
      expenseType,
      expenseSource: 'application_service',
      serviceSource: 'glts_service',
      linkedService: label,
    })
  }

  for (const line of agreement.miscellaneousServices ?? []) {
    const serviceName = line.serviceName.trim() || 'Miscellaneous service'
    const label = `Add-on · ${serviceName}`
    const expenseType = inferExpenseType(serviceName)
    pushUnique(options, {
      id: `misc-svc:${line.id}`,
      label,
      description: 'Agreement add-on service',
      amount: line.amount,
      gstApplicable: line.gstApplicable,
      expenseType,
      expenseSource: inferExpenseSource(expenseType),
      serviceSource: inferServiceSource(expenseType),
      linkedService: serviceName,
    })
  }

  for (const cost of agreement.miscellaneousCosts ?? []) {
    const serviceName = cost.serviceName.trim() || 'Miscellaneous cost'
    const label = `Add-on · ${serviceName}`
    const expenseType = inferExpenseType(serviceName)
    const pricingHint =
      cost.pricingType === 'per_unit' ? 'Per unit' : cost.pricingType === 'percentage' ? 'Percentage' : 'Fixed'
    pushUnique(options, {
      id: `misc-cost:${cost.id}`,
      label,
      description: `Agreement add-on · ${pricingHint}`,
      amount: cost.amount,
      gstApplicable: cost.gstApplicable,
      expenseType,
      expenseSource: inferExpenseSource(expenseType),
      serviceSource: inferServiceSource(expenseType),
      linkedService: serviceName,
    })
  }

  // If country/visa filtering removed everything, fall back to the full agreement catalogue
  if (
    options.size === 0 &&
    (Boolean(input.visaCountry?.trim()) || Boolean(input.visaType?.trim()))
  ) {
    return resolveAgreementExpenseServices({ companyName: input.companyName })
  }

  return {
    agreement,
    options: [...options.values()].sort((a, b) => a.label.localeCompare(b.label)),
  }
}

export function defaultGstRateIdForAgreement(gstApplicable: boolean): string {
  if (!gstApplicable) return ''
  // Prefer standard 18% slab when GST applies on the agreement line
  return 'gst-18'
}
