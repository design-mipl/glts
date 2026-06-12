import { bookerManagementService } from '@/shared/services/bookerManagementService'
import { GLTS_APPLICATION_IDS } from '../../../data/portalIds'
import { GLTS_BATCH_IDS, getSingleApplicationDemoSeed } from '../data/applicationFlowData'
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

/** Vessel linked to marine crew applications — explicit on row or from demo seed. */
export function resolveApplicationVesselName(row: ApplicationListingRow): string {
  const explicit = row.vesselName?.trim()
  if (explicit) return explicit

  if (!isBulkRow(row)) {
    const seedVessel = getSingleApplicationDemoSeed(row.id)?.flowExtras.vesselName?.trim()
    if (seedVessel) return seedVessel
  } else if (row.id === GLTS_BATCH_IDS.schengenCrew) {
    const seedVessel = getSingleApplicationDemoSeed(GLTS_APPLICATION_IDS.schengen)?.flowExtras.vesselName?.trim()
    if (seedVessel) return seedVessel
  }

  return '—'
}
