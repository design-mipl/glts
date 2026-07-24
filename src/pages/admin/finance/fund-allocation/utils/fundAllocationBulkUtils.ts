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

export function computeRequestedBulkSummary(records: FundAllocationPassengerRow[]): {
  perPassenger: Array<{
    record: FundAllocationPassengerRow
    selectedServices: FundAllocationPassengerRow['selectedServices']
    totalAmount: number
  }>
  grandTotal: number
} {
  const perPassenger = records.map(record => ({
    record,
    selectedServices: record.selectedServices.map(line => ({ ...line })),
    totalAmount: record.totalAmount,
  }))

  return {
    perPassenger,
    grandTotal: perPassenger.reduce((sum, entry) => sum + entry.totalAmount, 0),
  }
}

export function computePassengerRequestedBulkAllocationInput(
  record: FundAllocationPassengerRow,
  shared: Pick<FundAllocationActionInput, 'fundTransfer' | 'notes'> & {
    allocatedAmount?: number
    grandTotal?: number
  },
): FundAllocationActionInput | null {
  if (record.selectedServices.length === 0 || record.totalAmount <= 0) return null

  const totalAmount = record.totalAmount
  const grandTotal = shared.grandTotal ?? totalAmount
  let allocatedAmount = totalAmount
  if (
    shared.allocatedAmount != null &&
    Number.isFinite(shared.allocatedAmount) &&
    shared.allocatedAmount > 0 &&
    grandTotal > 0
  ) {
    allocatedAmount = Math.round((shared.allocatedAmount * (totalAmount / grandTotal)) * 100) / 100
  }

  return {
    selectedServices: record.selectedServices.map(line => ({ ...line })),
    totalAmount,
    allocatedAmount,
    fundTransfer: { ...shared.fundTransfer },
    notes: shared.notes,
  }
}

export function computePassengerBulkAllocationInput(
  record: FundAllocationPassengerRow,
  selectedKeys: string[],
  shared: Pick<FundAllocationActionInput, 'fundTransfer' | 'notes'> & {
    /** Cumulative allocated amount across the bulk selection; pro-rated by passenger totals. */
    allocatedAmount?: number
    grandTotal?: number
  },
): FundAllocationActionInput | null {
  const services = resolvePassengerSelectedServices(record, selectedKeys)
  if (services.length === 0) return null

  const totalAmount = sumVfsPickerServiceAmounts(services)
  const grandTotal = shared.grandTotal ?? totalAmount
  let allocatedAmount = totalAmount
  if (
    shared.allocatedAmount != null &&
    Number.isFinite(shared.allocatedAmount) &&
    shared.allocatedAmount > 0 &&
    grandTotal > 0
  ) {
    allocatedAmount = Math.round((shared.allocatedAmount * (totalAmount / grandTotal)) * 100) / 100
  }

  return {
    selectedServices: mapVfsPickerServicesToChargeLines(services),
    totalAmount,
    allocatedAmount,
    fundTransfer: { ...shared.fundTransfer },
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
