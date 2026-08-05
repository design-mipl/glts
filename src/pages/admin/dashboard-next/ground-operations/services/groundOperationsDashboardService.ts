import type {
  GroundOperationsDashboardData,
  GroundOperationsDashboardFilters,
} from '../types'
import {
  GROUND_OPERATIONS_DASHBOARD_MOCK,
  applyGroundOperationsDashboardFilters,
} from '../data/groundOperationsDashboardMock'
import {
  buildCourierTrackingFromInTransitRow,
  listLogisticsInTransitRows,
} from '../../shared/utils/mapLogisticsInTransitRows'

const LOAD_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function mergeLogisticsInTransit(
  data: GroundOperationsDashboardData,
): GroundOperationsDashboardData {
  const inTransitRows = listLogisticsInTransitRows().map((row) => ({
    id: row.id,
    applicationNumber: row.applicationNumber,
    applicant: row.applicant,
    currentLocation: row.currentLocation,
    courier: row.courier,
    trackingNumber: row.trackingNumber,
    trackingUrl: row.trackingUrl,
    deliveryMethod: row.deliveryMethod,
    eta: row.eta,
    status: row.status,
  }))

  if (inTransitRows.length === 0) return data

  return {
    ...data,
    passportRows: inTransitRows,
    courierTracking: buildCourierTrackingFromInTransitRow(
      listLogisticsInTransitRows()[0],
    ),
  }
}

export async function fetchGroundOperationsDashboard(
  filters: GroundOperationsDashboardFilters,
): Promise<GroundOperationsDashboardData> {
  await delay(LOAD_DELAY_MS)
  const withLogistics = mergeLogisticsInTransit(
    structuredClone(GROUND_OPERATIONS_DASHBOARD_MOCK),
  )
  return applyGroundOperationsDashboardFilters(withLogistics, filters)
}
