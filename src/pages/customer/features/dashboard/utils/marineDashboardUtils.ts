import type { CustomerApplication } from '../../../data/mockData'
import type { ApplicationStatus } from '@/shared/types/application'
import {
  formatBulkApplicantListingLabel,
  GLTS_BATCH_IDS,
  getSingleApplicationDemoSeed,
  type BulkBatchRow,
  type SingleApplicationRow,
} from '../../applications/data/applicationFlowData'
import { GLTS_APPLICATION_IDS } from '../../../data/portalIds'

function mapOperationalToApplicationStatus(label: string): ApplicationStatus {
  const normalized = label.toLowerCase()
  if (normalized.includes('draft')) return 'draft'
  if (normalized.includes('reject')) return 'rejected'
  if (normalized.includes('complete') || normalized.includes('passport ready')) return 'approved'
  if (normalized.includes('document') || normalized.includes('correction')) return 'pending_documents'
  if (normalized.includes('submit')) return 'submitted'
  return 'in_review'
}

function resolveMarineRank(row: SingleApplicationRow): string {
  const seed = getSingleApplicationDemoSeed(row.id)
  return seed?.additionalDetails.employmentOccupation ?? row.visaType.split('·')[0]?.trim() ?? '—'
}

function resolveMarineVessel(row: SingleApplicationRow): string {
  const seed = getSingleApplicationDemoSeed(row.id)
  return seed?.flowExtras.vesselName ?? (row.companyName ? `${row.companyName} fleet` : '—')
}

export function singleRowToMarineDashboardApp(row: SingleApplicationRow): CustomerApplication {
  return {
    id: row.id,
    country: row.country,
    countryFlag: row.countryFlag,
    visaType: row.visaType,
    applicantCount: 1,
    status: mapOperationalToApplicationStatus(row.operationalStatus),
    statusLabel: row.operationalStatus,
    travelDate: row.travelDate,
    updatedAt: row.lastUpdated,
    progress:
      row.operationalStatus === 'Draft' ? 22 : row.operationalStatus === 'Completed' ? 100 : 64,
    eta:
      row.operationalStatus === 'Completed'
        ? 'Completed'
        : row.submissionDate || 'Awaiting review',
    passengerName: row.applicantName,
    vesselName: resolveMarineVessel(row),
    rank: resolveMarineRank(row),
  }
}

export function bulkRowToMarineDashboardApp(row: BulkBatchRow): CustomerApplication {
  const linkedSeed = getSingleApplicationDemoSeed(GLTS_APPLICATION_IDS.schengen)

  return {
    id: row.id,
    country: row.country,
    countryFlag: row.countryFlag,
    visaType: row.visaType,
    applicantCount: row.totalApplicants,
    status: mapOperationalToApplicationStatus(row.operationalStatus),
    statusLabel: row.operationalStatus,
    travelDate: row.travelDate,
    updatedAt: row.lastUpdated,
    progress: Math.round((row.verifiedApplicants / Math.max(row.totalApplicants, 1)) * 100),
    eta: row.pendingCorrections > 0 ? `${row.pendingCorrections} corrections` : '—',
    passengerName: formatBulkApplicantListingLabel(row),
    vesselName:
      row.id === GLTS_BATCH_IDS.schengenCrew
        ? (linkedSeed?.flowExtras.vesselName ?? row.companyName)
        : row.companyName,
    rank: 'Crew manifest',
  }
}

export function buildMarineDashboardApplications(
  singles: SingleApplicationRow[],
  bulks: BulkBatchRow[],
  limit = 6,
): CustomerApplication[] {
  const marineSingles = singles
    .filter(row => row.customerSegment === 'marine')
    .map(singleRowToMarineDashboardApp)
  const marineBulks = bulks
    .filter(row => row.customerSegment === 'marine')
    .map(bulkRowToMarineDashboardApp)

  return [...marineSingles, ...marineBulks]
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
    .slice(0, limit)
}

export function formatMarineDashboardDescription(app: CustomerApplication): string {
  const vessel = app.vesselName ?? '—'
  const rank = app.rank ?? '—'
  return `${vessel} · ${rank} · Travel ${app.travelDate}`
}
