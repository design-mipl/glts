import { resolveOfferingVfsServiceRates } from '@/shared/services/countryMasterService'
import { embassyVfsFeeMasterService } from '@/shared/services/embassyVfsFeeMasterService'

export interface VfsPickerService {
  id: string
  serviceName: string
  amount: number
  gstIncluded?: boolean
  embassyFeeServiceId?: string
}

export interface VfsServiceChargeLine {
  id: string
  embassyFeeServiceId?: string
  serviceName: string
  amount: number
  gstIncluded?: boolean
}

export function resolveVfsPickerServices(input: {
  country: string
  visaType: string
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
}): VfsPickerService[] {
  const { country, visaType, countryId, visaOfferingId, jurisdictionId } = input

  if (countryId && visaOfferingId) {
    const rates = resolveOfferingVfsServiceRates(countryId, visaOfferingId, jurisdictionId)
    if (rates.length > 0) {
      return rates.map(rate => ({
        id: rate.id,
        serviceName: rate.serviceName,
        amount: rate.amount,
        gstIncluded: rate.gstIncluded,
        embassyFeeServiceId: rate.embassyFeeServiceId,
      }))
    }
  }

  const rateCard = embassyVfsFeeMasterService.resolveRateCardForApplication(country, visaType)
  return rateCard.services.map(service => ({
    id: service.id,
    serviceName: service.serviceName,
    amount: service.amount,
    embassyFeeServiceId: service.id,
  }))
}

export function sumVfsPickerServiceAmounts(services: Array<Pick<VfsPickerService, 'amount'>>): number {
  return services.reduce((sum, service) => sum + service.amount, 0)
}

export function mapVfsPickerServicesToChargeLines(
  services: VfsPickerService[],
): VfsServiceChargeLine[] {
  return services.map((service, index) => ({
    id: `vfs-charge-${service.id}-${Date.now()}-${index}`,
    embassyFeeServiceId: service.embassyFeeServiceId ?? service.id,
    serviceName: service.serviceName,
    amount: service.amount,
    gstIncluded: service.gstIncluded,
  }))
}

export function isVfsPickerServiceSelected(
  service: VfsPickerService,
  selectedLines: VfsServiceChargeLine[],
): boolean {
  return selectedLines.some(
    line =>
      line.id === service.id ||
      line.embassyFeeServiceId === service.id ||
      (service.embassyFeeServiceId != null && line.embassyFeeServiceId === service.embassyFeeServiceId) ||
      line.serviceName.trim().toLowerCase() === service.serviceName.trim().toLowerCase(),
  )
}
