import type { GroundServiceLine, OperationalCase } from '@/shared/types/operationalCaseHandling'
import type { LogisticsDispatchDetails } from '@/shared/types/logisticsDispatch'
import { isAirportAssistanceDeliveryMethod } from '@/shared/types/logisticsDispatch'

export const LOGISTICS_GROUND_SERVICE_NAMES = {
  courier: 'Courier',
  airportAssistance: 'Airport Assistance',
  cargoHandling: 'Cargo & Handling Charges',
} as const

function findSelectedServiceCharge(lines: GroundServiceLine[], serviceName: string): number | null {
  const match = lines.find(line => line.selected && line.serviceName === serviceName)
  if (!match) return null
  return match.actualAmount || match.prefilledAmount || 0
}

export function resolveCourierServiceCharge(record: OperationalCase): number | null {
  return (
    findSelectedServiceCharge(record.groundServices, LOGISTICS_GROUND_SERVICE_NAMES.courier) ??
    findSelectedServiceCharge(record.applicationFees, 'Courier Service') ??
    findSelectedServiceCharge(record.applicationFees, 'Courier')
  )
}

export function resolveAirportAssistanceCharge(record: OperationalCase): number | null {
  return findSelectedServiceCharge(
    record.groundServices,
    LOGISTICS_GROUND_SERVICE_NAMES.airportAssistance,
  )
}

export function resolveCargoHandlingCharge(record: OperationalCase): number | null {
  return findSelectedServiceCharge(
    record.groundServices,
    LOGISTICS_GROUND_SERVICE_NAMES.cargoHandling,
  )
}

export function formatInrCharge(amount: number | null | undefined): string {
  if (amount == null) return '—'
  return `₹${amount.toLocaleString('en-IN')}`
}

/** Amount paid for dispatch settlement — mirrors the method-specific charge field. */
export function resolveDispatchAmountPaid(
  details: Pick<
    LogisticsDispatchDetails,
    'deliveryMethod' | 'courierCharges' | 'airportAssistanceCharges' | 'cargoHandlingCharges'
  >,
): number | null {
  if (details.deliveryMethod === 'Courier') {
    return details.courierCharges ?? null
  }
  if (isAirportAssistanceDeliveryMethod(details.deliveryMethod)) {
    return details.airportAssistanceCharges ?? null
  }
  if (details.deliveryMethod === 'Cargo') {
    return details.cargoHandlingCharges ?? null
  }
  return null
}

export function formatDispatchAmountPaidField(amount: number | null | undefined): string {
  if (amount == null || !Number.isFinite(amount) || amount < 0) return ''
  const rounded = Math.round(amount * 100) / 100
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(2)
}
