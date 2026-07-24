import { useEffect, useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { type CustomerChecklistItem } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { checklistItemsFromRowDocuments, enrichChecklistWithCorrections, enrichGlobalChecklistWithCorrections, type ChecklistCorrectionRef } from '../utils/applicationSubmitKind'
import { buildGlobalChecklistItems } from '../utils/globalDocumentChecklist'
import { buildGlobalDocumentsForVerification } from '@/shared/services/applicationVerificationService'
import { isSimpleDocumentRequirement } from '@/shared/utils/applicantDocumentWorkflowUtils'
import type { ApplicantDocumentItem } from '../data/applicationFlowData'
import type { UploadQueueRow } from '../data/applicationFlowData'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import { buildApplicationProcessingTimeline } from '@/shared/utils/applicationProcessingTimeline'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { ApplicationReviewOverview } from '../utils/applicationReviewOverview'
import type { ApplicationDetailViewModel } from '../types/applicationDetail.types'
import { ApplicationReviewOverviewCard } from './review/ApplicationReviewOverviewCard'
import { ApplicationReviewTimelineCard } from './review/ApplicationReviewTimelineCard'
import { ApplicationReviewTravelerSection } from './review/ApplicationReviewTravelerSection'
import { ApplicationReviewDocumentsSection } from './review/ApplicationReviewDocumentsSection'
import { CustomerDocumentPreviewModal } from './CustomerDocumentPreviewModal'

export type { ApplicationReviewOverview } from '../utils/applicationReviewOverview'

type DocumentPreviewScope = 'traveler' | 'global'

interface DocumentPreviewTarget {
  item: CustomerChecklistItem
  scope: DocumentPreviewScope
}

function resolvePreviewDocument(
  target: DocumentPreviewTarget | null,
  selectedRow: UploadQueueRow | null,
  applicationId: string | undefined,
  globalDocumentUploads: Record<string, { fileName: string; uploadedAt: string }>,
): ApplicantDocumentItem | null {
  if (!target) return null

  const documentId = target.item.id.replace(/^global-/, '')

  if (target.scope === 'traveler' && selectedRow) {
    return selectedRow.documents.find(doc => doc.documentId === documentId) ?? null
  }

  if (target.scope === 'global' && applicationId) {
    const globalDocs = buildGlobalDocumentsForVerification(applicationId, globalDocumentUploads)
    return globalDocs.find(doc => doc.documentId === documentId) ?? null
  }

  return null
}

interface ApplicationReviewPanelsProps {
  rows: UploadQueueRow[]
  overview: ApplicationReviewOverview
  applicationId?: string
  isBulk?: boolean
  detail?: ApplicationDetailViewModel
  corrections?: ChecklistCorrectionRef[]
  globalDocumentUploads: Record<string, { fileName: string; uploadedAt: string }>
  timelineSteps?: ApplicationProcessingTimelineStep[]
  helperText?: string
  onReuploadDocument?: (item: CustomerChecklistItem) => void
}

function queueReadyRows(rows: UploadQueueRow[]) {
  return rows.filter(r => r.status !== 'processing')
}

export function buildSubmitTimeline(
  row: UploadQueueRow | null,
  overview?: Pick<ApplicationReviewOverview, 'countryName' | 'visaTypeLabel'>,
): ApplicationProcessingTimelineStep[] {
  const docsDone = row ? row.documentsTotal === 0 || row.documentsComplete >= row.documentsTotal : false
  return buildApplicationProcessingTimeline({
    stageDates: row?.processingStageDates,
    docsDone,
    isSubmitted: false,
    countryName: overview?.countryName,
    visaTypeLabel: overview?.visaTypeLabel,
  })
}

export function ApplicationReviewPanels({
  rows,
  overview,
  applicationId,
  isBulk = false,
  detail,
  corrections = [],
  globalDocumentUploads,
  timelineSteps,
  helperText,
  onReuploadDocument,
}: ApplicationReviewPanelsProps) {
  const colors = usePublicBrandColors()
  const readyRows = useMemo(() => queueReadyRows(rows), [rows])
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
  const [previewTarget, setPreviewTarget] = useState<DocumentPreviewTarget | null>(null)

  useEffect(() => {
    if (readyRows.length === 0) {
      setSelectedRowId(null)
      return
    }
    if (!selectedRowId || !readyRows.some(r => r.id === selectedRowId)) {
      setSelectedRowId(readyRows[0].id)
    }
  }, [readyRows, selectedRowId])

  const selectedRow = useMemo(
    () => readyRows.find(r => r.id === selectedRowId) ?? null,
    [readyRows, selectedRowId],
  )
  const checklist = useMemo(() => {
    if (!selectedRow) return []
    const base = checklistItemsFromRowDocuments(selectedRow.documents)
    return enrichChecklistWithCorrections(base, corrections, selectedRow.travelerName)
  }, [selectedRow, corrections])
  const globalChecklist = useMemo(() => {
    const globalDocs = applicationId
      ? buildGlobalDocumentsForVerification(applicationId, globalDocumentUploads)
      : undefined
    const base = buildGlobalChecklistItems(globalDocumentUploads, globalDocs)
    return enrichGlobalChecklistWithCorrections(base, corrections)
  }, [applicationId, globalDocumentUploads, corrections])
  const resolvedTimeline = useMemo(
    () => timelineSteps ?? buildSubmitTimeline(selectedRow, overview),
    [timelineSteps, selectedRow, overview],
  )
  const travelerCount = readyRows.length > 0 ? readyRows.length : rows.length
  const hasDocumentSections = useMemo(() => {
    if (!selectedRow) return globalChecklist.length > 0
    const hasDigital =
      selectedRow.documents.some(
        d =>
          !d.originalDocument &&
          (isSimpleDocumentRequirement(d.documentId) || checklist.some(c => c.id === d.documentId)),
      ) ||
      checklist.some(item => {
        const doc = selectedRow.documents.find(d => d.documentId === item.id)
        return !doc?.originalDocument
      })
    const hasOriginal = selectedRow.documents.some(d => d.originalDocument)
    return hasDigital || hasOriginal || globalChecklist.length > 0
  }, [selectedRow, checklist, globalChecklist])
  const previewDocument = useMemo(
    () => resolvePreviewDocument(previewTarget, selectedRow, applicationId, globalDocumentUploads),
    [previewTarget, selectedRow, applicationId, globalDocumentUploads],
  )
  const previewGlobalFileName = useMemo(() => {
    if (!previewTarget || previewTarget.scope !== 'global') return undefined
    const documentId = previewTarget.item.id.replace(/^global-/, '')
    return globalDocumentUploads[documentId]?.fileName
  }, [previewTarget, globalDocumentUploads])

  const handlePreviewItem = (item: CustomerChecklistItem, scope: DocumentPreviewScope) => {
    setPreviewTarget({ item, scope })
  }

  return (
    <Stack spacing={2}>
      {helperText ? (
        <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>{helperText}</Typography>
      ) : null}

      <ApplicationReviewOverviewCard overview={overview} travelerCount={travelerCount} />

      <ApplicationReviewTravelerSection
        rows={rows}
        selectedTravelerId={selectedRowId}
        onSelectTraveler={setSelectedRowId}
        isBulk={isBulk}
        gltsApplicationId={overview.gltsApplicationId}
        gltsBatchId={overview.gltsBatchId}
        summaryOverview={overview}
        detail={detail}
        summaryApplicationId={applicationId}
      />

      <ApplicationReviewTimelineCard
        steps={resolvedTimeline}
        multiTraveler={readyRows.length > 1}
      />

      {hasDocumentSections && selectedRow ? (
        <ApplicationReviewDocumentsSection
          countryName={overview.countryName}
          selectedRow={selectedRow}
          checklistItems={checklist}
          globalChecklistItems={globalChecklist}
          onReuploadDocument={onReuploadDocument}
          onPreviewItem={handlePreviewItem}
        />
      ) : null}

      <CustomerDocumentPreviewModal
        open={Boolean(previewTarget && previewDocument)}
        onClose={() => setPreviewTarget(null)}
        document={previewDocument}
        travelerRow={previewTarget?.scope === 'traveler' ? selectedRow : null}
        globalFileName={previewGlobalFileName}
      />
    </Stack>
  )
}
