import type { SuperAdminDashboardData, SuperAdminDashboardFilters } from '../types'
import {
  SUPER_ADMIN_DASHBOARD_MOCK,
  applySuperAdminDashboardFilters,
} from '../data/superAdminDashboardMock'

const LOAD_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

export async function fetchSuperAdminDashboard(
  filters: SuperAdminDashboardFilters,
): Promise<SuperAdminDashboardData> {
  await delay(LOAD_DELAY_MS)
  return applySuperAdminDashboardFilters(structuredClone(SUPER_ADMIN_DASHBOARD_MOCK), filters)
}
