import type { AccountsDashboardData, AccountsDashboardFilters } from '../types'
import {
  ACCOUNTS_DASHBOARD_MOCK,
  applyAccountsDashboardFilters,
} from '../data/accountsDashboardMock'

const LOAD_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/** Mock fetch — swap for API; keep filters + return shape stable. */
export async function fetchAccountsDashboard(
  filters: AccountsDashboardFilters,
): Promise<AccountsDashboardData> {
  await delay(LOAD_DELAY_MS)
  return applyAccountsDashboardFilters(structuredClone(ACCOUNTS_DASHBOARD_MOCK), filters)
}
