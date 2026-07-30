import type { OperationsDashboardData, OperationsDashboardFilters } from '../types'
import { applyOperationsDashboardFilters } from '../data/operationsDashboardMock'
import { buildOperationsDashboardFromMocks } from '../data/buildOperationsDashboardFromMocks'

const LOAD_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/**
 * Fetch operations dashboard from existing mock services:
 * Application Management · Assignment Priority · Ground Operations.
 */
export async function fetchOperationsDashboard(
  filters: OperationsDashboardFilters,
): Promise<OperationsDashboardData> {
  await delay(LOAD_DELAY_MS)
  const data = buildOperationsDashboardFromMocks()
  return applyOperationsDashboardFilters(data, filters)
}
