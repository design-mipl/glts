import { bookerManagementService } from '@/shared/services/bookerManagementService'
import { GLTS_APPLICATION_IDS } from '../../../data/portalIds'
import { GLTS_BATCH_IDS, getSingleApplicationDemoSeed, mockUploadQueue } from '../data/applicationFlowData'
import type { ApplicationCustomerSegment, ApplicationListingRow } from '../types/applicationListing.types'
import { isBulkRow } from '../types/applicationListing.types'
import { resolvePassengerDesignation, resolvePassengerRank } from './applicantBasicDetailsUtils'
import {
  getTravelerRoleColumnKey,
  getTravelerRoleColumnLabel,
} from '@/shared/utils/applicationSegmentListingPolicy'

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

/** Crew rank for marine applications — from demo seed or upload queue travelers. */
export function resolveApplicationRank(row: ApplicationListingRow): string {
  if (!isBulkRow(row)) {
    const seedRank = getSingleApplicationDemoSeed(row.id)?.basicDetails.rank?.trim()
    if (seedRank) return seedRank
    return '—'
  }

  const queueRows = mockUploadQueue.filter(q => q.gltsApplicationId === row.id)
  if (queueRows.length > 0) {
    const ranks = [...new Set(queueRows.map(q => resolvePassengerRank(q)).filter(Boolean))]
    if (ranks.length === 1) return ranks[0]
    if (ranks.length > 1) return 'Multiple'
  }

  if (row.id === GLTS_BATCH_IDS.schengenCrew) {
    const seedRank = getSingleApplicationDemoSeed(GLTS_APPLICATION_IDS.schengen)?.basicDetails.rank?.trim()
    if (seedRank) return seedRank
  }

  return '—'
}

/** Corporate / B2B designation — from demo seed or upload queue travelers. */
export function resolveApplicationDesignation(row: ApplicationListingRow): string {
  if (!isBulkRow(row)) {
    const seed = getSingleApplicationDemoSeed(row.id)
    const fromBasic = seed?.basicDetails.designation?.trim()
    if (fromBasic) return fromBasic
    const fromOccupation = seed?.additionalDetails?.employmentOccupation?.trim()
    if (fromOccupation) return fromOccupation
    return '—'
  }

  const queueRows = mockUploadQueue.filter(q => q.gltsApplicationId === row.id)
  if (queueRows.length > 0) {
    const designations = [
      ...new Set(queueRows.map(q => resolvePassengerDesignation(q)).filter(Boolean)),
    ]
    if (designations.length === 1) return designations[0]
    if (designations.length > 1) return 'Multiple'
  }

  return '—'
}

export function resolveApplicationTravelerRole(
  row: ApplicationListingRow,
  segment: ApplicationCustomerSegment = row.customerSegment,
): string {
  const key = getTravelerRoleColumnKey(segment)
  if (key === 'rank') return resolveApplicationRank(row)
  if (key === 'designation') return resolveApplicationDesignation(row)
  return '—'
}

export function resolveApplicationTravelerRoleLabel(segment: ApplicationCustomerSegment): string {
  return getTravelerRoleColumnLabel(segment)
}
