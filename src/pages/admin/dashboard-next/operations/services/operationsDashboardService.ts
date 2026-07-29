import type { OperationsDashboardData, OperationsDashboardFilters } from '../types'
import {
  OPERATIONS_DASHBOARD_MOCK,
  applyOperationsDashboardFilters,
} from '../data/operationsDashboardMock'

const LOAD_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/** Mock fetch — replace with API while keeping filters + return shape. */
export async function fetchOperationsDashboard(
  filters: OperationsDashboardFilters,
): Promise<OperationsDashboardData> {
  await delay(LOAD_DELAY_MS)
  const clone = structuredClone(OPERATIONS_DASHBOARD_MOCK)
  return applyOperationsDashboardFilters(clone, filters)
}
