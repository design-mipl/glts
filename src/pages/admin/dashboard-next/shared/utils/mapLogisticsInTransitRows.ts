import { operationalCaseHandlingService } from '@/shared/services/operationalCaseHandlingService'
import type { OperationalCase } from '@/shared/types/operationalCaseHandling'
import type { CourierTrackingData } from '../widgets/ground/GroundWidgets'

/** Passport/visa currently with courier — sourced from Tracking & Logistics. */
export interface LogisticsInTransitRow {
  id: string
  applicationNumber: string
  applicant: string
  currentLocation: string
  courier: string
  trackingNumber: string
  trackingUrl?: string
  deliveryMethod: string
  eta: string
  status: string
  assignedTeam: string
  assignedExecutive: string
}

export function isLogisticsInTransitCase(record: OperationalCase): boolean {
  const dispatch = record.dispatchDetails
  return (
    record.status === 'Dispatched' &&
    Boolean(dispatch?.dispatchedAt) &&
    !dispatch?.deliveredAt
  )
}

function formatDispatchEta(dispatchDateTime: string | undefined): string {
  if (!dispatchDateTime?.trim()) return '—'
  const date = new Date(dispatchDateTime)
  if (Number.isNaN(date.getTime())) return dispatchDateTime
  return date.toLocaleString(undefined, {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function mapOperationalCaseToInTransitRow(
  record: OperationalCase,
): LogisticsInTransitRow {
  const dispatch = record.dispatchDetails
  const courier =
    dispatch?.courierPartner?.trim() ||
    (dispatch?.deliveryMethod === 'Hand Delivery' ? 'Hand delivery' : '—')
  const trackingNumber =
    dispatch?.awbNumber?.trim() ||
    (dispatch?.deliveryMethod === 'Cargo' ? 'Cargo' : '—')

  return {
    id: record.id,
    applicationNumber: record.applicationId,
    applicant: record.passengerName,
    currentLocation: record.assignedTeam || record.jurisdiction || '—',
    courier,
    trackingNumber,
    trackingUrl: dispatch?.trackingUrl?.trim() || undefined,
    deliveryMethod: dispatch?.deliveryMethod || '—',
    eta: formatDispatchEta(dispatch?.dispatchDateTime),
    status: 'In transit',
    assignedTeam: record.assignedTeam || '—',
    assignedExecutive: record.assignedExecutive || '—',
  }
}

/** Live IN TRANSIT board from Tracking & Logistics operational cases. */
export function listLogisticsInTransitRows(): LogisticsInTransitRow[] {
  return operationalCaseHandlingService
    .listForLogistics()
    .filter(isLogisticsInTransitCase)
    .map(mapOperationalCaseToInTransitRow)
}

export function buildCourierTrackingFromInTransitRow(
  row: LogisticsInTransitRow | undefined,
): CourierTrackingData {
  if (!row) {
    return {
      trackingNumber: '—',
      courier: '—',
      status: 'No consignments in transit',
      stages: [
        { id: 'ready', label: 'Ready', status: 'pending' },
        { id: 'picked', label: 'Picked up', status: 'pending' },
        { id: 'transit', label: 'In transit', status: 'pending' },
        { id: 'delivered', label: 'Delivered', status: 'pending' },
      ],
    }
  }

  return {
    trackingNumber: row.trackingNumber,
    courier: row.courier,
    status: 'In transit',
    eta: row.eta !== '—' ? row.eta : undefined,
    stages: [
      { id: 'ready', label: 'Ready', status: 'completed' },
      { id: 'picked', label: 'Picked up', status: 'completed' },
      { id: 'transit', label: 'In transit', status: 'active' },
      { id: 'delivered', label: 'Delivered', status: 'pending' },
    ],
  }
}
