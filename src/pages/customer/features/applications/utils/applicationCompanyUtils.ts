import { bookerManagementService } from '@/shared/services/bookerManagementService'
import type { ApplicationListingRow } from '../types/applicationListing.types'
import { isBulkRow } from '../types/applicationListing.types'

function segmentFallbackCompany(segment: ApplicationListingRow['customerSegment']): string {
  if (segment === 'marine') return 'Apex Marine Logistics'
  if (segment === 'corporate' || segment === 'b2bAgents') return 'Global Corporate Travel Ltd'
  return '—'
}

/** Company that owns the application — explicit on row, else from booker's company assignment. */
export function resolveApplicationCompanyName(row: ApplicationListingRow): string {
  if (isBulkRow(row)) {
    return row.companyName.trim() || '—'
  }

  const explicit = row.companyName?.trim()
  if (explicit) return explicit

  if (row.createdByRole === 'booker') {
    const booker = bookerManagementService
      .list()
      .find(b => b.email.toLowerCase() === row.createdByEmail.trim().toLowerCase())
    if (booker?.companyName?.trim()) return booker.companyName.trim()
  }

  const fallback = segmentFallbackCompany(row.customerSegment)
  return fallback === '—' ? '—' : fallback
}
