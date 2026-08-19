import type { FormAssistVfsServiceChargeLine } from '@/shared/services/applicationFormAssistService'
import type { CountryVisaType, CountryVfsServiceRate } from '@/shared/types/countryMaster'

/** Fixed service name for the optional consulate urgent surcharge row. */
export const URGENT_CHARGE_SERVICE_NAME = 'Urgent Charge'

export function computeVfsIw(rate: number, cost: number | undefined): number {
  const safeRate = Number(rate) || 0
  const safeCost = cost != null && !Number.isNaN(Number(cost)) ? Number(cost) : 0
  return safeRate - safeCost
}

export function isUrgentVfsServiceRate(
  rate: Pick<CountryVfsServiceRate, 'isUrgentCharge' | 'serviceName'>,
): boolean {
  return Boolean(rate.isUrgentCharge) || rate.serviceName === URGENT_CHARGE_SERVICE_NAME
}

export function splitVfsServiceRates(rates: CountryVfsServiceRate[]): {
  standardRates: CountryVfsServiceRate[]
  urgentRate: CountryVfsServiceRate | undefined
} {
  const standardRates: CountryVfsServiceRate[] = []
  let urgentRate: CountryVfsServiceRate | undefined
  for (const rate of rates) {
    if (isUrgentVfsServiceRate(rate)) {
      if (!urgentRate) urgentRate = rate
    } else {
      standardRates.push(rate)
    }
  }
  return {
    standardRates: [...standardRates].sort((a, b) => a.sortOrder - b.sortOrder),
    urgentRate,
  }
}

export function mapCountryVfsRatesToChargeLines(
  rates: CountryVfsServiceRate[],
): FormAssistVfsServiceChargeLine[] {
  return [...rates]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map(rate => ({
      id: rate.id,
      serviceName: rate.serviceName,
      amount: rate.amount,
      cost: rate.cost,
      gstIncluded: rate.gstIncluded,
      embassyFeeServiceId: rate.embassyFeeServiceId,
      vendorId: rate.vendorId,
      vendorName: rate.vendorName,
      isUrgentCharge: rate.isUrgentCharge || isUrgentVfsServiceRate(rate) || undefined,
    }))
}

export function formatVfsGstLabel(gstIncluded: boolean | undefined): string {
  return gstIncluded ? 'GST incl.' : 'GST excl.'
}

export function sumStandardVfsServiceRateAmounts(
  rates: CountryVfsServiceRate[] | undefined,
): number {
  const { standardRates } = splitVfsServiceRates(rates ?? [])
  return standardRates.reduce((sum, rate) => sum + (Number(rate.amount) || 0), 0)
}

/** Visa-type list price: sum of standard Consulate Rates (excludes Urgent Charge). */
export function resolveVisaTypePricingFromConsulateRates(
  visaType: Pick<CountryVisaType, 'jurisdictionEnabled' | 'vfsServiceRates' | 'jurisdictions'>,
): number {
  if (visaType.jurisdictionEnabled === true) {
    const totals = (visaType.jurisdictions ?? [])
      .filter((jurisdiction) => jurisdiction.status === 'active')
      .map((jurisdiction) => sumStandardVfsServiceRateAmounts(jurisdiction.vfsServiceRates))
    if (totals.length === 0) return 0
    return Math.min(...totals)
  }

  return sumStandardVfsServiceRateAmounts(visaType.vfsServiceRates)
}
