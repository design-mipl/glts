import type { FormAssistVfsServiceChargeLine } from '@/shared/services/applicationFormAssistService'
import type { CountryVfsServiceRate } from '@/shared/types/countryMaster'

export function mapCountryVfsRatesToChargeLines(
  rates: CountryVfsServiceRate[],
): FormAssistVfsServiceChargeLine[] {
  return [...rates]
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((rate) => ({
      id: rate.id,
      serviceName: rate.serviceName,
      amount: rate.amount,
      gstIncluded: rate.gstIncluded,
      embassyFeeServiceId: rate.embassyFeeServiceId,
    }))
}

export function formatVfsGstLabel(gstIncluded: boolean | undefined): string {
  return gstIncluded ? 'GST incl.' : 'GST excl.'
}
