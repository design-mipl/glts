import type { DocumentationDashboardData, DocumentationDashboardFilters } from '../types'
import {
  DOCUMENTATION_DASHBOARD_MOCK,
  applyDocumentationDashboardFilters,
} from '../data/documentationDashboardMock'
import { MOCK_DOCUMENTATION_EXECUTIVE_NAME } from '@/pages/admin/dashboard/documentation/data/documentationDashboardMock'

const LOAD_DELAY_MS = 300

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

/** Mock fetch — replace with API while keeping filters + return shape. */
export async function fetchDocumentationDashboard(
  filters: DocumentationDashboardFilters,
  executiveName: string = MOCK_DOCUMENTATION_EXECUTIVE_NAME,
): Promise<DocumentationDashboardData> {
  await delay(LOAD_DELAY_MS)
  const clone = structuredClone(DOCUMENTATION_DASHBOARD_MOCK)
  clone.executiveName = executiveName
  return applyDocumentationDashboardFilters(clone, filters, executiveName)
}
