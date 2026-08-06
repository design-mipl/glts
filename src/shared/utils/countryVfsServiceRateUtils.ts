import type { FormAssistVfsServiceChargeLine } from '@/shared/services/applicationFormAssistService'
import type { CountryVfsServiceRate } from '@/shared/types/countryMaster'

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
