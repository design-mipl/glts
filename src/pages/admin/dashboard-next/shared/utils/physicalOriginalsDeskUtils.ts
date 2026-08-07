import type { UploadQueueRow } from '@/pages/customer/features/applications/data/applicationFlowData'
import type { ApplicationDetailViewModel } from '@/pages/customer/features/applications/types/applicationDetail.types'
import { applicationVerificationService } from '@/shared/services/applicationVerificationService'
import type { MarineApplicationRow } from '@/shared/services/marineApplicationAdminService'
import { originalCollectionMethodLabel } from '@/shared/utils/originalDocumentCollectionUtils'

export interface PhysicalOriginalsPendingTraveler {
  applicationId: string
  travelerRowId: string
  travelerName: string
  pendingCount: number
  totalCount: number
  receivedCount: number
  methodLabel: string | null
}

function resolvePhysicalDocs(traveler: UploadQueueRow) {
  const flagged = traveler.documents.filter(doc => doc.originalDocument)
  if (flagged.length > 0) return flagged

  const fromCollection = traveler.originalDocumentCollection?.receivedDocuments ?? []
  if (fromCollection.length === 0) return []

  const byId = new Map(traveler.documents.map(doc => [doc.documentId, doc]))
  return fromCollection.map(ref => {
    const existing = byId.get(ref.documentId)
    return (
      existing ?? {
        documentId: ref.documentId,
        name: ref.name,
        required: true,
        status: 'missing' as const,
        originalDocument: true,
        originalDocumentReceived: false,
      }
    )
  })
}

export function getTravelerPhysicalOriginalsPending(
  traveler: UploadQueueRow,
): Omit<PhysicalOriginalsPendingTraveler, 'applicationId'> | null {
  const physical = resolvePhysicalDocs(traveler)
  if (physical.length === 0) return null

  const receivedCount = physical.filter(doc => doc.originalDocumentReceived).length
  const totalCount = physical.length
  if (receivedCount >= totalCount) return null

  const method = traveler.originalDocumentCollection?.method
  return {
    travelerRowId: traveler.id,
    travelerName: traveler.travelerName,
    pendingCount: totalCount - receivedCount,
    totalCount,
    receivedCount,
    methodLabel: method ? originalCollectionMethodLabel(method) : null,
  }
}

/** Scan verification workspaces for travelers with physical originals still pending receipt. */
export function listPhysicalOriginalsPendingTravelers(
  apps: MarineApplicationRow[],
  scanLimit = 80,
): PhysicalOriginalsPendingTraveler[] {
  const results: PhysicalOriginalsPendingTraveler[] = []
  const candidates = apps.slice(0, scanLimit)

  for (const app of candidates) {
    let detail: ApplicationDetailViewModel | null | undefined
    try {
      detail = applicationVerificationService.getMergedDetail(app.id)
    } catch {
      continue
    }
    if (!detail) continue

    for (const traveler of detail.uploadQueueRows ?? []) {
      const pending = getTravelerPhysicalOriginalsPending(traveler)
      if (!pending) continue
      results.push({
        applicationId: app.id,
        ...pending,
      })
    }
  }

  return results
}

export function countPhysicalOriginalsPendingApplications(
  apps: MarineApplicationRow[],
  scanLimit = 80,
): number {
  const seen = new Set<string>()
  for (const item of listPhysicalOriginalsPendingTravelers(apps, scanLimit)) {
    seen.add(item.applicationId)
  }
  return seen.size
}
