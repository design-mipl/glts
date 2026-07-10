import type {
  LogisticsDeliveryMethod,
  LogisticsDispatchDetails,
  LogisticsFinalQcChecks,
} from '@/shared/types/logisticsDispatch'
import { LOGISTICS_FINAL_QC_CHECKLIST } from '@/shared/types/logisticsDispatch'

export function isLogisticsFinalQcComplete(checks: LogisticsFinalQcChecks): boolean {
  return LOGISTICS_FINAL_QC_CHECKLIST.every(item => checks[item.key])
}

export function validateLogisticsDispatchDetails(
  details: LogisticsDispatchDetails,
): { valid: boolean; message?: string } {
  if (!details.deliveryMethod) {
    return { valid: false, message: 'Delivery method is required.' }
  }
  if (!details.dispatchDateTime.trim()) {
    return { valid: false, message: 'Dispatch date & time is required.' }
  }

  switch (details.deliveryMethod) {
    case 'Courier':
      if (!details.courierPartner?.trim()) {
        return { valid: false, message: 'Courier partner is required.' }
      }
      if (!details.awbNumber?.trim()) {
        return { valid: false, message: 'AWB number is required.' }
      }
      if (details.courierCharges == null || details.courierCharges < 0) {
        return { valid: false, message: 'Courier charges are required.' }
      }
      break
    case 'Airport Assistance':
      if (!details.assistanceType) {
        return { valid: false, message: 'Assistance type is required.' }
      }
      if (details.airportAssistanceCharges == null || details.airportAssistanceCharges < 0) {
        return { valid: false, message: 'Airport assistance charges are required.' }
      }
      break
    case 'Cargo':
      if (details.cargoHandlingCharges == null || details.cargoHandlingCharges < 0) {
        return { valid: false, message: 'Cargo & handling charges are required.' }
      }
      break
    case 'Hand Delivery':
      if (!details.deliveryLocation) {
        return { valid: false, message: 'Delivery location is required.' }
      }
      break
    default:
      break
  }

  return { valid: true }
}

export function formatLogisticsDateTime(value: string | undefined): string {
  if (!value?.trim()) return '—'
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value
  return parsed.toLocaleString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function toDateTimeLocalValue(isoOrLocal: string | undefined): string {
  if (!isoOrLocal?.trim()) return ''
  const parsed = new Date(isoOrLocal)
  if (Number.isNaN(parsed.getTime())) return isoOrLocal
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${parsed.getFullYear()}-${pad(parsed.getMonth() + 1)}-${pad(parsed.getDate())}T${pad(parsed.getHours())}:${pad(parsed.getMinutes())}`
}

export function fromDateTimeLocalValue(value: string): string {
  if (!value.trim()) return ''
  return new Date(value).toISOString()
}

export function dispatchMethodSummary(method: LogisticsDeliveryMethod | ''): string {
  return method || '—'
}
