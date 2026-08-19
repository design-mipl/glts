import type { SingleApplicationRow } from '@/pages/customer/features/applications/data/applicationFlowData'

const CUSTOMER_DRAFTS_STORAGE_KEY = 'glts:customer-application-drafts'

export function getSavedDraftListingRows(): SingleApplicationRow[] {
  try {
    const raw = sessionStorage.getItem(CUSTOMER_DRAFTS_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? (parsed as SingleApplicationRow[]) : []
  } catch {
    return []
  }
}

export function writeSavedDraftListingRows(rows: SingleApplicationRow[]) {
  try {
    sessionStorage.setItem(CUSTOMER_DRAFTS_STORAGE_KEY, JSON.stringify(rows))
  } catch {
    // ignore storage failures in mock service mode
  }
}

export function persistCustomerDraftListingRow(row: SingleApplicationRow) {
  const existing = getSavedDraftListingRows().filter(saved => saved.id !== row.id)
  writeSavedDraftListingRows([row, ...existing])
}
