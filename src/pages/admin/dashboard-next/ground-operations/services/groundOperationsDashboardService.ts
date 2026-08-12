import type {
  GroundOperationsDashboardData,
  GroundOperationsDashboardFilters,
} from '../types'
import { buildGroundOperationsDashboardFromServices } from '../data/buildGroundOperationsDashboardFromServices'

const LOAD_DELAY_MS = 250

function delay(ms: number): Promise<void> {
  return new Promise(resolve => {
    window.setTimeout(resolve, ms)
  })
}

export async function fetchGroundOperationsDashboard(
  filters: GroundOperationsDashboardFilters,
): Promise<GroundOperationsDashboardData> {
  await delay(LOAD_DELAY_MS)
  return buildGroundOperationsDashboardFromServices(filters)
}
