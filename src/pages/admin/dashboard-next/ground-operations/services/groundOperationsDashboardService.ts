import type {
  GroundOperationsDashboardData,
  GroundOperationsDashboardFilters,
} from '../types'
import {
  GROUND_OPERATIONS_DASHBOARD_MOCK,
  applyGroundOperationsDashboardFilters,
} from '../data/groundOperationsDashboardMock'

const LOAD_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function fetchGroundOperationsDashboard(
  filters: GroundOperationsDashboardFilters,
): Promise<GroundOperationsDashboardData> {
  await delay(LOAD_DELAY_MS)
  return applyGroundOperationsDashboardFilters(
    structuredClone(GROUND_OPERATIONS_DASHBOARD_MOCK),
    filters,
  )
}
