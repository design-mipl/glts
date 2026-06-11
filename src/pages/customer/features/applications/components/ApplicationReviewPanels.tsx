import { useEffect, useMemo, useState } from 'react'
import { Box, Card, Grid, Stack, Typography } from '@mui/material'
import { CustomerDocumentChecklist, type CustomerChecklistItem } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { UploadQueueTable } from './UploadQueueTable'
import { checklistItemsFromRowDocuments, enrichChecklistWithCorrections, enrichGlobalChecklistWithCorrections, type ChecklistCorrectionRef } from '../utils/applicationSubmitKind'
import { buildGlobalChecklistItems } from '../utils/globalDocumentChecklist'
import { buildGlobalDocumentsForVerification } from '@/shared/services/applicationVerificationService'
import { isSimpleDocumentRequirement } from '@/shared/utils/applicantDocumentWorkflowUtils'
import { SimpleDocumentRequirementPanel } from './documentWorkflow'
import { ApplicationProcessingTimeline } from './ApplicationProcessingTimeline'
import type { UploadQueueRow } from '../data/applicationFlowData'
import type { ApplicationProcessingTimelineStep } from '@/shared/types/applicationProcessingTimeline'
import { buildApplicationProcessingTimeline } from '@/shared/utils/applicationProcessingTimeline'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'

export interface ApplicationReviewOverview {
  countryName: string
  countryFlag: string
  visaTypeLabel: string
  purposeLabel?: string
  travelDate: string
  issuedPassportLocationLabel?: string
  jurisdiction?: string
  gltsApplicationId?: string
  gltsBatchId?: string
}

interface ApplicationReviewPanelsProps {
  rows: UploadQueueRow[]
  overview: ApplicationReviewOverview
  applicationId?: string
  corrections?: ChecklistCorrectionRef[]
  globalDocumentUploads: Record<string, { fileName: string; uploadedAt: string }>
  timelineSteps?: ApplicationProcessingTimelineStep[]
  helperText?: string
  onReuploadDocument?: (item: CustomerChecklistItem) => void
}

function queueReadyRows(rows: UploadQueueRow[]) {
  return rows.filter(r => r.status !== 'processing')
}

export function buildSubmitTimeline(row: UploadQueueRow | null): ApplicationProcessingTimelineStep[] {
  const docsDone = row ? row.documentsTotal === 0 || row.documentsComplete >= row.documentsTotal : false
  return buildApplicationProcessingTimeline({
    stageDates: row?.processingStageDates,
    docsDone,
    isSubmitted: false,
  })
}

export function ApplicationReviewPanels({
  rows,
  overview,
  applicationId,
  corrections = [],
  globalDocumentUploads,
  timelineSteps,
  helperText,
  onReuploadDocument,
}: ApplicationReviewPanelsProps) {
  const colors = usePublicBrandColors()
  const readyRows = useMemo(() => queueReadyRows(rows), [rows])
  const [selectedRowId, setSelectedRowId] = useState<string | null>(null)

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
  const globalUploadEntries = Object.entries(globalDocumentUploads)
  const resolvedTimeline = useMemo(
    () => timelineSteps ?? buildSubmitTimeline(selectedRow),
    [timelineSteps, selectedRow],
  )

  return (
    <>
      {helperText ? (
        <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2.5 }}>
          {helperText}
        </Typography>
      ) : null}

      {readyRows.length > 1 && (
        <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>Application overview</Typography>
          {overview.gltsApplicationId ? (
            <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: 12, fontFamily: 'monospace', fontWeight: 700, color: colors.navy }}>
                {overview.gltsApplicationId}
              </Typography>
              {overview.gltsBatchId ? (
                <Typography sx={{ fontSize: 12, fontFamily: 'monospace', color: colors.textSecondary }}>
                  · Batch {overview.gltsBatchId}
                </Typography>
              ) : null}
            </Stack>
          ) : null}
          <Grid container spacing={1}>
            {[
              ['Country', `${overview.countryFlag} ${overview.countryName}`],
              ['Visa', overview.purposeLabel ? `${overview.visaTypeLabel} · ${overview.purposeLabel}` : overview.visaTypeLabel],
              ['Travel', overview.travelDate || '—'],
              ['Passport location', overview.issuedPassportLocationLabel || '—'],
              ['Jurisdiction', overview.jurisdiction || '—'],
              ['Travelers', String(readyRows.length)],
            ].map(([k, v]) => (
              <Grid size={{ xs: 6, sm: 3 }} key={k}>
                <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{k}</Typography>
                <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{v}</Typography>
              </Grid>
            ))}
          </Grid>
        </Card>
      )}

      {rows.length > 0 ? (
        <Box sx={{ mb: 2 }}>
          <UploadQueueTable
            rows={rows}
            selectedId={selectedRowId}
            onSelect={setSelectedRowId}
            selectionMode
            readOnly
            singleListing={readyRows.length <= 1}
            gltsApplicationId={overview.gltsApplicationId}
            gltsBatchId={overview.gltsBatchId}
          />
        </Box>
      ) : null}

      <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, mb: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Processing timeline</Typography>
          <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
            {readyRows.length > 1 ? 'Updates by selected traveler' : 'Single traveler flow'}
          </Typography>
        </Stack>
        <ApplicationProcessingTimeline steps={resolvedTimeline} />
      </Card>

      {selectedRow ? (
        <>
          <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, mb: 2 }}>
            <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1.5 }}>Application summary</Typography>
            <Grid container spacing={1}>
              {[
                ['Name', selectedRow.travelerName],
                ['Passport', selectedRow.passportNo],
                ['Country', `${overview.countryFlag} ${overview.countryName}`],
                ['Visa', overview.purposeLabel ? `${overview.visaTypeLabel} · ${overview.purposeLabel}` : overview.visaTypeLabel],
                ['Travel', overview.travelDate || '—'],
                ['Passport location', overview.issuedPassportLocationLabel || '—'],
                ['Jurisdiction', overview.jurisdiction || '—'],
                ['Nationality', selectedRow.nationality],
                ['Passport expiry', selectedRow.expiry],
                [
                  'Documents',
                  selectedRow.documentsTotal > 0
                    ? `${selectedRow.documentsComplete}/${selectedRow.documentsTotal} complete`
                    : '—',
                ],
              ].map(([k, v]) => (
                <Grid size={{ xs: 6 }} key={k}>
                  <Typography sx={{ fontSize: 11, color: colors.textMuted }}>{k}</Typography>
                  <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{v}</Typography>
                </Grid>
              ))}
            </Grid>
          </Card>

          <Box sx={{ mb: 2 }}>
            <CustomerDocumentChecklist
              country={overview.countryName}
              items={checklist}
              onReuploadItem={onReuploadDocument}
            />
          </Box>

          {selectedRow.documents.filter(d => isSimpleDocumentRequirement(d.documentId)).length > 0 ? (
            <Stack spacing={1.5} sx={{ mb: 2 }}>
              {selectedRow.documents
                .filter(d => isSimpleDocumentRequirement(d.documentId))
                .map(doc => (
                  <SimpleDocumentRequirementPanel
                    key={doc.documentId}
                    document={doc}
                    onChange={() => {}}
                    readOnly
                    travelerName={selectedRow.travelerName}
                  />
                ))}
            </Stack>
          ) : null}
        </>
      ) : null}

      <Box sx={{ mb: 2 }}>
        <CustomerDocumentChecklist
          title="Common Document Checklist"
          items={globalChecklist}
          onReuploadItem={onReuploadDocument}
        />
      </Box>

      {globalUploadEntries.length > 0 ? (
        <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, mb: 2 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1.5 }}>Uploaded common documents</Typography>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))' },
              gap: 1.5,
            }}
          >
            {globalUploadEntries.map(([docId, meta]) => (
              <Card
                key={docId}
                elevation={0}
                sx={{
                  p: 1.5,
                  height: '100%',
                  borderRadius: '10px',
                  border: `1px solid ${colors.border}`,
                  bgcolor: colors.white,
                }}
              >
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>
                  {docId === 'loi' ? 'LOI (Letter of Intent)' : docId.toUpperCase()}
                </Typography>
                <Typography sx={{ fontSize: 12, color: colors.textSecondary, mt: 0.5 }}>
                  {meta.fileName}
                </Typography>
                <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.75 }}>
                  Uploaded {new Date(meta.uploadedAt).toLocaleDateString()}
                </Typography>
              </Card>
            ))}
          </Box>
        </Card>
      ) : null}
    </>
  )
}
