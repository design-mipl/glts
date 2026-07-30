import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import { companyMasterService } from '@/shared/services/companyMasterService'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import type {
  ApplicationExpenseServiceSource,
  ApplicationExpenseType,
} from '@/shared/types/applicationExpenseManagement'
import type {
  LogisticsDeliveryMethod,
} from '@/shared/types/logisticsDispatch'
import { isAirportAssistanceDeliveryMethod } from '@/shared/types/logisticsDispatch'
import type { GroundServiceLine, OperationalCase } from '@/shared/types/operationalCaseHandling'
import { LOGISTICS_GROUND_SERVICE_NAMES } from '@/shared/utils/logisticsDispatchChargeUtils'

function normalize(value: string | undefined): string {
  return (value ?? '').trim().toLowerCase()
}

function pickActiveAgreement(companyId: string | undefined, companyName: string): CommercialAgreement | undefined {
  const byCompany = companyId
    ? commercialAgreementService.list({ companyId, status: 'active' })
    : []
  if (byCompany.length > 0) {
    return [...byCompany].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
  }

  const needle = normalize(companyName)
  if (!needle) return undefined
  const named = commercialAgreementService
    .list({ status: 'active' })
    .filter(agreement => normalize(agreement.companyName) === needle)
  return [...named].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0]
}

function resolveCompanyId(companyName: string): string | undefined {
  const needle = normalize(companyName)
  if (!needle) return undefined
  return companyMasterService.list().find(company => normalize(company.companyName) === needle)?.id
}

/** Agreement / catalogue names that map to a logistics delivery method. */
export function agreementServiceNeedlesForDeliveryMethod(
  method: LogisticsDeliveryMethod,
): string[] {
  switch (method) {
    case 'Courier':
      return ['courier charges', 'courier & logistics', 'courier', 'document dispatch']
    case 'Airport Assistance - Working Hours':
      return [
        'airport assistance - working hours',
        'airport assistance working',
        'airport assistance',
        'airport',
      ]
    case 'Airport Assistance - Non-Working Hours':
      return [
        'airport assistance - non-working hours',
        'airport assistance non-working',
        'airport assistance',
        'airport',
      ]
    case 'Cargo':
      return ['cargo & handling charges', 'cargo handling', 'cargo']
    case 'Hand Delivery':
      return ['hand delivery', 'document hand delivery', 'hand-delivery']
    default:
      return []
  }
}

function scoreServiceNameMatch(serviceName: string, needles: string[]): number {
  const name = normalize(serviceName)
  if (!name) return 0
  let best = 0
  for (const needle of needles) {
    if (!needle) continue
    if (name === needle) return 100
    if (name.includes(needle) || needle.includes(name)) {
      best = Math.max(best, needle.length)
    }
  }
  return best
}

/**
 * Client-agreed Total for a logistics delivery method from the active commercial agreement.
 * Prefers miscellaneous services/costs, then pricing-matrix presets.
 */
export function resolveAgreementAmountForDeliveryMethod(input: {
  companyName: string
  deliveryMethod: LogisticsDeliveryMethod | ''
  country?: string
  visaType?: string
}): number {
  if (!input.deliveryMethod || !input.companyName.trim()) return 0

  const companyId = resolveCompanyId(input.companyName)
  const agreement = pickActiveAgreement(companyId, input.companyName)
  if (!agreement) return 0

  const needles = agreementServiceNeedlesForDeliveryMethod(input.deliveryMethod)
  if (needles.length === 0) return 0

  let bestScore = 0
  let bestAmount = 0

  const consider = (serviceName: string, amount: number) => {
    if (!Number.isFinite(amount) || amount <= 0) return
    const score = scoreServiceNameMatch(serviceName, needles)
    if (score > bestScore) {
      bestScore = score
      bestAmount = amount
    }
  }

  for (const line of agreement.miscellaneousServices ?? []) {
    consider(line.serviceName, line.amount)
  }
  for (const cost of agreement.miscellaneousCosts ?? []) {
    consider(cost.serviceName, cost.amount)
  }
  for (const row of agreement.pricingMatrix ?? []) {
    const countryOk =
      !input.country?.trim() ||
      !row.country?.trim() ||
      normalize(row.country).includes(normalize(input.country)) ||
      normalize(input.country).includes(normalize(row.country))
    const visaOk =
      !input.visaType?.trim() ||
      !row.visaType?.trim() ||
      normalize(row.visaType).includes(normalize(input.visaType)) ||
      normalize(input.visaType).includes(normalize(row.visaType))
    if (!countryOk || !visaOk) continue
    consider(row.servicePresetName, row.serviceFee)
  }

  return bestAmount
}

function findSelectedServicePrefilled(
  lines: GroundServiceLine[],
  serviceName: string,
): number | null {
  const match = lines.find(line => line.selected && line.serviceName === serviceName)
  if (!match || !(match.prefilledAmount > 0)) return null
  return match.prefilledAmount
}

/** Case checklist prefilled (agreed) amount for the selected delivery method. */
export function resolveCaseAgreedChargeForDeliveryMethod(
  record: Pick<OperationalCase, 'groundServices' | 'applicationFees'>,
  method: LogisticsDeliveryMethod | '',
): number | null {
  if (!method) return null
  if (method === 'Courier') {
    return (
      findSelectedServicePrefilled(record.groundServices, LOGISTICS_GROUND_SERVICE_NAMES.courier) ??
      findSelectedServicePrefilled(record.applicationFees, 'Courier Service') ??
      findSelectedServicePrefilled(record.applicationFees, 'Courier')
    )
  }
  if (isAirportAssistanceDeliveryMethod(method)) {
    return findSelectedServicePrefilled(
      record.groundServices,
      LOGISTICS_GROUND_SERVICE_NAMES.airportAssistance,
    )
  }
  if (method === 'Cargo') {
    return findSelectedServicePrefilled(
      record.groundServices,
      LOGISTICS_GROUND_SERVICE_NAMES.cargoHandling,
    )
  }
  return null
}

export function resolveDispatchExpenseMeta(method: LogisticsDeliveryMethod | ''): {
  expenseType: ApplicationExpenseType
  serviceSource: ApplicationExpenseServiceSource
} {
  if (method === 'Courier' || method === 'Cargo') {
    return { expenseType: 'courier_service', serviceSource: 'courier_partner' }
  }
  if (isAirportAssistanceDeliveryMethod(method) || method === 'Hand Delivery') {
    return { expenseType: 'ground_operation_service', serviceSource: 'ground_staff_service' }
  }
  return { expenseType: 'courier_service', serviceSource: 'courier_partner' }
}
