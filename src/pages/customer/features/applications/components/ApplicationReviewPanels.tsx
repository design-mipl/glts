import { useEffect, useMemo, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { type CustomerChecklistItem } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import {
  checklistItemsFromRowDocuments,
  enrichChecklistWithCorrections,
  enrichGlobalChecklistWithCorrections,
  type ChecklistCorrectionRef,
} from '../utils/applicationSubmitKind'
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
import { ApplicationReviewDocumentsSection } from './review/ApplicationReviewDocumentsSection'
import { ApplicationReviewPassengerWorkspace } from './review/ApplicationReviewPassengerWorkspace'
import { CustomerDocumentPreviewModal } from './CustomerDocumentPreviewModal'
import {
  filterVerifyTravelers,
  type VerifyTravelerListFilter,
} from '@/pages/admin/application-management/marine/utils/verifyDocumentsUtils'

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
  overview: ApplicationReviewOverview,
): ApplicantDocumentItem | null {
  if (!target) return null

  const documentId = target.item.id.replace(/^global-/, '')

  if (target.scope === 'traveler' && selectedRow) {
    return selectedRow.documents.find(doc => doc.documentId === documentId) ?? null
  }

  if (target.scope === 'global') {
    const globalDocs = buildGlobalDocumentsForVerification(applicationId ?? '', globalDocumentUploads, {
      countryLabel: overview.countryName,
      visaTypeLabel: overview.visaTypeLabel,
      jurisdictionName: overview.jurisdiction,
    })
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
  const readyRows = useMemo(() => {
    const ready = queueReadyRows(rows)
    return ready.length > 0 ? ready : rows
  }, [rows])
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)
  const [previewTarget, setPreviewTarget] = useState<DocumentPreviewTarget | null>(null)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<VerifyTravelerListFilter>('all')

  const singleListing = !isBulk && readyRows.length <= 1

  const filteredRows = useMemo(
    () => filterVerifyTravelers(readyRows, search, filter),
    [readyRows, search, filter],
  )

  useEffect(() => {
    if (filteredRows.length === 0) {
      if (readyRows.length === 0) setSelectedRowId(null)
      return
    }
    if (!selectedRowId || !filteredRows.some(r => r.id === selectedRowId)) {
      setSelectedRowId(filteredRows[0].id)
    }
  }, [filteredRows, selectedRowId, readyRows.length])

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
    const checklistContext = {
      countryLabel: overview.countryName,
      visaTypeLabel: overview.visaTypeLabel,
      jurisdictionName: overview.jurisdiction,
    }
    const globalDocs = buildGlobalDocumentsForVerification(
      applicationId ?? '',
      globalDocumentUploads,
      checklistContext,
    )
    const base = buildGlobalChecklistItems(globalDocumentUploads, globalDocs)
    return enrichGlobalChecklistWithCorrections(base, corrections)
  }, [
    applicationId,
    corrections,
    globalDocumentUploads,
    overview.countryName,
    overview.jurisdiction,
    overview.visaTypeLabel,
  ])
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
    () =>
      resolvePreviewDocument(previewTarget, selectedRow, applicationId, globalDocumentUploads, overview),
    [previewTarget, selectedRow, applicationId, globalDocumentUploads, overview],
  )
  const previewGlobalFileName = useMemo(() => {
    if (!previewTarget || previewTarget.scope !== 'global') return undefined
    const documentId = previewTarget.item.id.replace(/^global-/, '')
    return globalDocumentUploads[documentId]?.fileName
  }, [previewTarget, globalDocumentUploads])

  const handlePreviewItem = (item: CustomerChecklistItem, scope: DocumentPreviewScope) => {
    setPreviewTarget({ item, scope })
  }

  const documentsContent =
    hasDocumentSections && selectedRow ? (
      <ApplicationReviewDocumentsSection
        countryName={overview.countryName}
        selectedRow={selectedRow}
        checklistItems={checklist}
        globalChecklistItems={globalChecklist}
        onReuploadDocument={onReuploadDocument}
        onPreviewItem={handlePreviewItem}
      />
    ) : (
      <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
        No documents available for this passenger yet.
      </Typography>
    )

  return (
    <Stack spacing={2}>
      {helperText ? (
        <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>{helperText}</Typography>
      ) : null}

      <ApplicationReviewOverviewCard overview={overview} travelerCount={travelerCount} />

      <ApplicationReviewPassengerWorkspace
        rows={readyRows}
        filteredRows={filteredRows}
        overview={overview}
        singleListing={singleListing}
        selectedTravelerId={selectedRowId}
        onSelectTraveler={setSelectedRowId}
        selectedRow={selectedRow}
        search={search}
        onSearchChange={setSearch}
        filter={filter}
        onFilterChange={setFilter}
        timelineSteps={resolvedTimeline}
        detail={detail}
        applicationId={applicationId}
        documentsContent={documentsContent}
      />

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
