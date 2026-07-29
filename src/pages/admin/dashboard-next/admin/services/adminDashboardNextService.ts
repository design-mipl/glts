import type { AdminDashboardNextData, AdminDashboardNextFilters } from '../types'
import { ADMIN_DASHBOARD_NEXT_MOCK } from '../data/adminDashboardNextMock'

const LOAD_DELAY_MS = 350

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/** Mock fetch adapter — swap for real API later without changing widgets. */
export async function fetchAdminDashboardNext(
  filters: AdminDashboardNextFilters,
): Promise<AdminDashboardNextData> {
  await delay(LOAD_DELAY_MS)

  // Filters are accepted so the service contract matches future API calls.
  void filters

  return structuredClone(ADMIN_DASHBOARD_NEXT_MOCK)
}
