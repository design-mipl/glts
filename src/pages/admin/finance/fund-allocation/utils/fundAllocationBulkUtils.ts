import { fundAllocationService } from '@/shared/services/fundAllocationService'
import type { FundAllocationActionInput, FundAllocationPassengerRow } from '@/shared/types/fundAllocation'
import {
  mapVfsPickerServicesToChargeLines,
  sumVfsPickerServiceAmounts,
  type VfsPickerService,
} from '@/shared/utils/vfsServicePickerUtils'

export function getBulkServiceSelectionKey(service: VfsPickerService): string {
  return (service.embassyFeeServiceId ?? service.id).trim().toLowerCase()
}

export function buildBulkVfsServiceCatalog(records: FundAllocationPassengerRow[]): VfsPickerService[] {
  const catalogByKey = new Map<string, VfsPickerService>()

  for (const record of records) {
    const catalog = fundAllocationService.listVfsServicesForPassenger(record)
    for (const service of catalog) {
      const key = getBulkServiceSelectionKey(service)
      if (!catalogByKey.has(key)) {
        catalogByKey.set(key, { ...service, id: key })
      }
    }
  }

  return Array.from(catalogByKey.values()).sort((a, b) => a.serviceName.localeCompare(b.serviceName))
}

export function resolvePassengerSelectedServices(
  record: FundAllocationPassengerRow,
  selectedKeys: string[],
): VfsPickerService[] {
  if (selectedKeys.length === 0) return []

  const selectedKeySet = new Set(selectedKeys)
  const catalog = fundAllocationService.listVfsServicesForPassenger(record)
  return catalog.filter(service => selectedKeySet.has(getBulkServiceSelectionKey(service)))
}

export function computePassengerBulkAllocationInput(
  record: FundAllocationPassengerRow,
  selectedKeys: string[],
  shared: Pick<FundAllocationActionInput, 'cardId' | 'notes'>,
): FundAllocationActionInput | null {
  const services = resolvePassengerSelectedServices(record, selectedKeys)
  if (services.length === 0) return null

  const totalAmount = sumVfsPickerServiceAmounts(services)
  return {
    selectedServices: mapVfsPickerServicesToChargeLines(services),
    totalAmount,
    allocatedAmount: totalAmount,
    cardId: shared.cardId,
    notes: shared.notes,
  }
}

export interface FundAllocationPassengerBulkSummary {
  record: FundAllocationPassengerRow
  services: VfsPickerService[]
  totalAmount: number
}

export function computeBulkAllocationSummary(
  records: FundAllocationPassengerRow[],
  selectedKeys: string[],
): { perPassenger: FundAllocationPassengerBulkSummary[]; grandTotal: number } {
  const perPassenger = records.map(record => {
    const services = resolvePassengerSelectedServices(record, selectedKeys)
    return {
      record,
      services,
      totalAmount: sumVfsPickerServiceAmounts(services),
    }
  })

  return {
    perPassenger,
    grandTotal: perPassenger.reduce((sum, entry) => sum + entry.totalAmount, 0),
  }
}

export function formatBulkServiceAmountLabel(
  serviceKey: string,
  records: FundAllocationPassengerRow[],
): string {
  const amounts = records
    .map(record => resolvePassengerSelectedServices(record, [serviceKey])[0]?.amount)
    .filter((amount): amount is number => amount != null && amount > 0)

  if (amounts.length === 0) return '—'

  const uniqueAmounts = [...new Set(amounts)]
  if (uniqueAmounts.length === 1) {
    return String(uniqueAmounts[0])
  }

  return `${Math.min(...uniqueAmounts)}-${Math.max(...uniqueAmounts)}`
}
