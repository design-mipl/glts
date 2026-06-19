import { useEffect, useMemo, useState } from 'react'
import { Box, Typography, Stack, Button as MuiButton, Chip, Divider } from '@mui/material'
import { CheckCircle2, Upload, Eye } from 'lucide-react'
import { Button, Drawer } from '@/design-system/UIComponents'
import { usePublicBrandColors, getPrimaryButtonSx, getOutlinedButtonSx, mergeButtonSx } from '@/shared/theme/publicBrand'
import { overlayFooterButtonSx } from '@/design-system/UIComponents/Feedback/overlayHeaderTypography'
import type { ApplicantDocumentItem, UploadQueueRow } from '../data/applicationFlowData'
import { PassportPreviewCard } from './PassportPreviewCard'
import { ExtractedFieldsReview } from './ExtractedFieldsReview'
import { ApplicantAdditionalDetailsForm } from './ApplicantAdditionalDetailsPanel'
import { ApplicantBasicDetailsForm } from './ApplicantBasicDetailsForm'
import { ApplicantDrawerSidebar } from './ApplicantDrawerSidebar'
import {
  resolveApplicantAdditionalDetails,
  type ApplicantAdditionalDetails,
} from '../config/applicantAdditionalDetailsConfig'
import type { ApplicantBasicDetails } from '../config/applicantBasicDetailsConfig'
import {
  applyBasicDetailsToRow,
  basicDetailsCompletion,
  resolveApplicantBasicDetails,
  syncBasicDetailsFromPassport,
} from '../utils/applicantBasicDetailsUtils'
import {
  applyWorkflowPatch,
  documentStatusLabel,
  isSimpleDocumentRequirement,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import { getDocumentWorkspaceItems } from '@/shared/services/countryMasterService'
import { SimpleDocumentRequirementPanel } from './documentWorkflow'
import { DocumentRequirementTags } from './DocumentRequirementTags'
import { requiresFieldValidation, useApplicationFlowPolicy } from '../context/ApplicationFlowPolicyContext'
import { countDocumentProgress, isDocumentComplete, normalizeUploadQueueRow } from '../utils/uploadQueueDocuments'
import { OriginalDocumentCollectionPanel } from './originalCollection/OriginalDocumentCollectionPanel'
import type { ApplicantDrawerSection } from './ApplicantDrawerSidebar'
import {
  ensureOriginalDocumentCollectionState,
  resolveOriginalRequiredDocuments,
  toggleOriginalDocumentReceived,
} from '@/shared/utils/originalDocumentCollectionUtils'
import type { OriginalDocumentCollectionState } from '@/shared/types/originalDocumentCollection'

type DrawerSection = ApplicantDrawerSection

interface ApplicantDocumentDrawerProps {
  open: boolean
  row: UploadQueueRow | null
  onClose: () => void
  onUpdateRow: (row: UploadQueueRow) => void
  /** When true, document workflow is view-only (submitted application). */
  documentsReadOnly?: boolean
  countryId?: string
  visaOfferingId?: string
  jurisdictionId?: string
}

function sectionSummaryChipSx(
  colors: ReturnType<typeof usePublicBrandColors>,
  variant: 'complete' | 'progress' | 'neutral',
) {
  return {
    height: 20,
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
    bgcolor:
      variant === 'complete'
        ? colors.greenMuted
        : variant === 'progress'
          ? 'rgba(245,158,11,0.12)'
          : colors.surfaceAlt,
    color:
      variant === 'complete'
        ? colors.greenDark
        : variant === 'progress'
          ? '#B45309'
          : colors.textMuted,
    '& .MuiChip-label': { px: 1 },
  }
}

function additionalDetailsStatusLabel(details: ApplicantAdditionalDetails): string {
  const hasValue = Object.values(details).some(v => v.trim().length > 0)
  return hasValue ? 'In progress' : 'Not started'
}

function rowNeedsBasicSetup(row: UploadQueueRow): boolean {
  return row.travelerName === '—' || row.passportNo === '—'
}

function selectFirstDocId(row: UploadQueueRow): string {
  const first =
    row.documents.find(d => d.required && !isDocumentComplete(d)) ??
    row.documents.find(d => d.documentId === 'passport') ??
    row.documents[0]
  return first?.documentId ?? 'passport'
}

export function ApplicantDocumentDrawer({
  open,
  row,
  onClose,
  onUpdateRow,
  documentsReadOnly = false,
  countryId,
  visaOfferingId,
  jurisdictionId,
}: ApplicantDocumentDrawerProps) {
  const colors = usePublicBrandColors()
  const { policy } = useApplicationFlowPolicy()
  const strict = requiresFieldValidation(policy)
  const [activeSection, setActiveSection] = useState<DrawerSection>('documents')
  const [activeDocId, setActiveDocId] = useState<string>('passport')

  const documents = row?.documents ?? []

  const originalRequiredDocuments = useMemo(() => {
    if (!countryId || !visaOfferingId) return []
    return resolveOriginalRequiredDocuments(countryId, visaOfferingId, jurisdictionId)
  }, [countryId, visaOfferingId, jurisdictionId])

  const showOriginalSection = originalRequiredDocuments.length > 0

  const resolvedOriginalCollection = useMemo(() => {
    if (!showOriginalSection) return undefined
    return ensureOriginalDocumentCollectionState(
      row?.originalDocumentCollection,
      originalRequiredDocuments,
    )
  }, [row?.originalDocumentCollection, originalRequiredDocuments, showOriginalSection])

  const workspaceMeta = useMemo(() => {
    if (!countryId || !visaOfferingId) {
      return new Map<string, { description: string; required: boolean; originalDocument: boolean }>()
    }

    const byId = new Map<string, { description: string; required: boolean; originalDocument: boolean }>()
    for (const doc of getDocumentWorkspaceItems(countryId, visaOfferingId, 'normal', jurisdictionId)) {
      const previous = byId.get(doc.id)
      byId.set(doc.id, {
        description: doc.description?.trim() || previous?.description || '',
        required: doc.required || previous?.required || false,
        originalDocument: Boolean(doc.originalDocument),
      })
    }
    return byId
  }, [countryId, visaOfferingId, jurisdictionId])

  const enrichedDocuments = useMemo(
    () =>
      documents.map(doc => {
        const meta = workspaceMeta.get(doc.documentId)
        return {
          ...doc,
          description: doc.description?.trim() || meta?.description,
          required: meta?.required ?? doc.required ?? true,
          originalDocument: meta != null ? Boolean(meta.originalDocument) : Boolean(doc.originalDocument),
        }
      }),
    [documents, workspaceMeta],
  )

  const activeDoc = useMemo(
    () => enrichedDocuments.find(d => d.documentId === activeDocId) ?? enrichedDocuments[0],
    [enrichedDocuments, activeDocId],
  )

  const activeDocDescription = activeDoc?.description?.trim()
  const activeDocMandatory = activeDoc?.required ?? true
  const activeDocOriginal = activeDoc?.originalDocument ?? false

  const resolvedBasicDetails = useMemo(
    () => (row ? resolveApplicantBasicDetails(row) : null),
    [row],
  )

  const resolvedAdditionalDetails = useMemo(
    () => resolveApplicantAdditionalDetails(row?.additionalDetails),
    [row?.additionalDetails],
  )

  const basicProgress = resolvedBasicDetails
    ? basicDetailsCompletion(resolvedBasicDetails)
    : { complete: 0, total: 4 }

  const progress = row ? countDocumentProgress(row.documents) : { documentsComplete: 0, documentsTotal: 0 }

  const patchRow = (nextDocuments: ApplicantDocumentItem[]) => {
    if (!row) return
    const { documentsComplete, documentsTotal } = countDocumentProgress(nextDocuments)
    const nextRow: UploadQueueRow = { ...row, documents: nextDocuments, documentsComplete, documentsTotal }
    onUpdateRow(applyBasicDetailsToRow(nextRow, syncBasicDetailsFromPassport(nextRow)))
  }

  const updateActiveDoc = (patch: Partial<ApplicantDocumentItem>) => {
    if (!row || !activeDoc) return
    const nextDocuments = row.documents.map(d => {
      if (d.documentId !== activeDoc.documentId) return d
      return isSimpleDocumentRequirement(d.documentId)
        ? applyWorkflowPatch(d, patch)
        : { ...d, ...patch }
    })
    patchRow(nextDocuments)
  }

  const handleAdditionalDetailsChange = (patch: Partial<ApplicantAdditionalDetails>) => {
    if (!row) return
    onUpdateRow({
      ...row,
      additionalDetails: {
        ...resolveApplicantAdditionalDetails(row.additionalDetails),
        ...patch,
      },
    })
  }

  const handleBasicDetailsChange = (patch: Partial<ApplicantBasicDetails>) => {
    if (!row) return
    onUpdateRow(applyBasicDetailsToRow(row, patch))
  }

  const handleOriginalCollectionChange = (next: OriginalDocumentCollectionState) => {
    if (!row) return
    const nextDocuments = row.documents.map(doc => {
      const receivedItem = next.receivedDocuments.find(item => item.documentId === doc.documentId)
      if (!receivedItem || !doc.originalDocument) return doc
      return { ...doc, originalDocumentReceived: receivedItem.received }
    })
    onUpdateRow({
      ...row,
      originalDocumentCollection: next,
      documents: nextDocuments,
    })
  }

  const handleOriginalDocumentToggle = (documentId: string, received: boolean) => {
    if (!resolvedOriginalCollection) return
    handleOriginalCollectionChange(
      toggleOriginalDocumentReceived(resolvedOriginalCollection, documentId, received),
    )
  }

  const handleFieldChange = (key: string, value: string) => {
    if (!row || !activeDoc) return
    const fields = (activeDoc.fields ?? []).map(f => (f.key === key ? { ...f, value } : f))
    const nextDocuments = row.documents.map(d =>
      d.documentId === activeDoc.documentId ? { ...d, fields } : d,
    )
    const { documentsComplete, documentsTotal } = countDocumentProgress(nextDocuments)
    let nextRow: UploadQueueRow = {
      ...row,
      documents: nextDocuments,
      documentsComplete,
      documentsTotal,
      ...(activeDoc.documentId === 'passport' ? { fields } : {}),
    }
    if (activeDoc.documentId === 'passport') {
      nextRow = applyBasicDetailsToRow(nextRow, syncBasicDetailsFromPassport(nextRow))
    }
    onUpdateRow(nextRow)
  }

  useEffect(() => {
    if (!open || !row) return
    if (rowNeedsBasicSetup(row)) {
      setActiveSection('basic')
      return
    }
    setActiveSection('documents')
    setActiveDocId(selectFirstDocId(row))
  }, [open, row?.id])

  useEffect(() => {
    if (!open || !row || !showOriginalSection || !resolvedOriginalCollection) return
    if (row.originalDocumentCollection) return
    onUpdateRow({ ...row, originalDocumentCollection: resolvedOriginalCollection })
  }, [open, row, showOriginalSection, resolvedOriginalCollection, onUpdateRow])

  useEffect(() => {
    if (!showOriginalSection && activeSection === 'original') {
      setActiveSection('documents')
    }
  }, [showOriginalSection, activeSection])

  useEffect(() => {
    if (!open || !row || !countryId || !visaOfferingId) return
    const normalized = normalizeUploadQueueRow(row, {
      countryId,
      visaOfferingId,
      jurisdictionId,
      countryLabel: '',
      passportFields: row.fields ?? [],
    })
    const currentSig = row.documents
      .map(doc => `${doc.documentId}:${doc.required ? 1 : 0}:${doc.originalDocument ? 1 : 0}`)
      .join('|')
    const nextSig = normalized.documents
      .map(doc => `${doc.documentId}:${doc.required ? 1 : 0}:${doc.originalDocument ? 1 : 0}`)
      .join('|')
    const collectionChanged =
      Boolean(row.originalDocumentCollection) !== Boolean(normalized.originalDocumentCollection)
    if (currentSig === nextSig && !collectionChanged) return
    onUpdateRow(normalized)
  }, [
    open,
    row?.id,
    row?.documents,
    row?.originalDocumentCollection,
    countryId,
    visaOfferingId,
    jurisdictionId,
    onUpdateRow,
  ])

  const handleMarkUploaded = () => {
    if (!activeDoc) return
    const nextStatus = activeDoc.documentId === 'passport' ? 'verified' : 'uploaded'
    updateActiveDoc({ status: nextStatus })
  }

  const handleSaveAndNext = () => {
    if (!row) return

    if (activeSection === 'basic') {
      setActiveSection('documents')
      setActiveDocId(selectFirstDocId(row))
      return
    }

    if (activeSection === 'additional') {
      onClose()
      return
    }

    if (activeSection === 'original') {
      setActiveSection('additional')
      return
    }

    if (!activeDoc) return
    if (strict) {
      const mandatory = row.documents.filter(d => d.required)
      const idx = mandatory.findIndex(d => d.documentId === activeDoc.documentId)
      const nextMissing = mandatory.slice(idx + 1).find(d => !isDocumentComplete(d))
      if (nextMissing) {
        setActiveDocId(nextMissing.documentId)
        return
      }
      const firstIncomplete = mandatory.find(d => !isDocumentComplete(d))
      if (firstIncomplete && firstIncomplete.documentId !== activeDoc.documentId) {
        setActiveDocId(firstIncomplete.documentId)
        return
      }
    } else {
      const docIndex = row.documents.findIndex(d => d.documentId === activeDoc.documentId)
      const nextDoc = row.documents[docIndex + 1]
      if (nextDoc) {
        setActiveDocId(nextDoc.documentId)
        return
      }
    }
    if (showOriginalSection) {
      setActiveSection('original')
      return
    }
    setActiveSection('additional')
  }

  if (!row || !resolvedBasicDetails) return null

  const additionalStatusLabel = additionalDetailsStatusLabel(resolvedAdditionalDetails)

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Applicant documents"
      subtitle={`${row.travelerName} · ${row.passportNo} · ${progress.documentsComplete}/${progress.documentsTotal} documents complete`}
      width={920}
      footer={
        <Stack direction="row" justifyContent="flex-end" spacing={1.5}>
          <Button variant="neutral" onClick={onClose} sx={overlayFooterButtonSx}>
            Close
          </Button>
          <MuiButton
            variant="contained"
            onClick={handleSaveAndNext}
            sx={mergeButtonSx(getPrimaryButtonSx(colors), overlayFooterButtonSx)}
          >
            Save & continue
          </MuiButton>
        </Stack>
      }
    >
      <Box
        sx={{
          minHeight: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
        }}
      >
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        sx={{
          flex: 1,
          minHeight: 0,
          height: '100%',
          alignItems: 'stretch',
        }}
      >
        <Box
          sx={{
            width: { xs: '100%', md: 320 },
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            alignSelf: 'stretch',
            pr: 0.25,
          }}
        >
          <ApplicantDrawerSidebar
            activeSection={activeSection}
            onSectionChange={section => {
              setActiveSection(section)
              if (section === 'documents') {
                setActiveDocId(selectFirstDocId(row))
              }
            }}
            basicDetails={resolvedBasicDetails}
            basicComplete={basicProgress.complete}
            basicTotal={basicProgress.total}
            documents={enrichedDocuments}
            activeDocumentId={activeSection === 'documents' ? activeDoc?.documentId : undefined}
            documentsComplete={progress.documentsComplete}
            documentsTotal={progress.documentsTotal}
            onDocumentSelect={documentId => {
              setActiveSection('documents')
              setActiveDocId(documentId)
            }}
            showOriginalSection={showOriginalSection}
            originalCollection={resolvedOriginalCollection}
            onOriginalDocumentToggle={handleOriginalDocumentToggle}
            documentsReadOnly={documentsReadOnly}
            additionalDetails={resolvedAdditionalDetails}
            additionalStatusLabel={additionalStatusLabel}
          />
        </Box>

        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            minHeight: 0,
            display: 'flex',
            flexDirection: 'column',
            overflowY: 'auto',
          }}
        >
          {activeSection === 'basic' && (
            <Stack spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.navy }}>Basic details</Typography>
              <ApplicantBasicDetailsForm
                details={resolvedBasicDetails}
                row={row}
                onChange={handleBasicDetailsChange}
              />
            </Stack>
          )}

          {activeSection === 'original' && resolvedOriginalCollection ? (
            <OriginalDocumentCollectionPanel
              documents={originalRequiredDocuments}
              state={resolvedOriginalCollection}
              onChange={handleOriginalCollectionChange}
              readOnly={documentsReadOnly}
            />
          ) : null}

          {activeSection === 'additional' && (
            <Stack spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.navy }}>Additional details</Typography>
              <ApplicantAdditionalDetailsForm
                details={resolvedAdditionalDetails}
                onChange={handleAdditionalDetailsChange}
                exportFileSuffix={row.gltsApplicantId || row.travelerName}
              />
            </Stack>
          )}

          {activeSection === 'documents' && activeDoc && (
            <Stack spacing={2}>
              <Stack spacing={0.75}>
                <Stack direction="row" alignItems="flex-start" justifyContent="space-between" flexWrap="wrap" gap={1}>
                  <Stack spacing={0.75} sx={{ flex: 1, minWidth: 0 }}>
                    <Stack direction="row" alignItems="center" spacing={0.75} flexWrap="wrap" useFlexGap>
                      <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.navy }}>
                        {activeDoc.name}
                      </Typography>
                      <DocumentRequirementTags
                        mandatory={activeDocMandatory}
                        originalDocument={activeDocOriginal}
                      />
                    </Stack>
                  </Stack>
                  <Chip
                    label={documentStatusLabel(activeDoc)}
                    size="small"
                    sx={sectionSummaryChipSx(
                      colors,
                      isDocumentComplete(activeDoc)
                        ? 'complete'
                        : activeDoc.status === 'needs_review' || activeDoc.status === 'rejected'
                          ? 'progress'
                          : 'neutral',
                    )}
                  />
                </Stack>
              </Stack>

              {activeDocDescription ? (
                <Typography sx={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.5 }}>
                  {activeDocDescription}
                </Typography>
              ) : null}

              {isSimpleDocumentRequirement(activeDoc.documentId) ? (
                <SimpleDocumentRequirementPanel
                  document={activeDoc}
                  onChange={updateActiveDoc}
                  readOnly={documentsReadOnly}
                  travelerName={row.travelerName}
                />
              ) : (
                <>
                  {activeDoc.documentId === 'passport' && <PassportPreviewCard row={row} />}

                  <Stack direction="row" spacing={1} flexWrap="wrap">
                    <MuiButton
                      variant="outlined"
                      startIcon={<Upload size={16} />}
                      onClick={handleMarkUploaded}
                      sx={getOutlinedButtonSx()}
                    >
                      {isDocumentComplete(activeDoc) ? 'Re-upload' : 'Upload document'}
                    </MuiButton>
                    <MuiButton variant="outlined" startIcon={<Eye size={16} />} sx={getOutlinedButtonSx()}>
                      Preview
                    </MuiButton>
                  </Stack>

                  <Divider />

                  {activeDoc.fields && activeDoc.fields.length > 0 ? (
                    <ExtractedFieldsReview
                      title="Extracted fields · review & edit"
                      fields={activeDoc.fields}
                      compact
                      showValidationBar={activeDoc.documentId === 'passport'}
                      onFieldChange={handleFieldChange}
                    />
                  ) : (
                    <Box
                      sx={{
                        p: 2,
                        borderRadius: '10px',
                        border: `1px dashed ${colors.border}`,
                        bgcolor: colors.surface,
                      }}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CheckCircle2 size={16} color={colors.textMuted} />
                        <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>
                          {activeDocDescription
                            ? 'Upload this document to continue. Fields will be available after upload when applicable.'
                            : 'Upload this document to extract and verify fields.'}
                        </Typography>
                      </Stack>
                    </Box>
                  )}
                </>
              )}
            </Stack>
          )}
        </Box>
      </Stack>
      </Box>
    </Drawer>
  )
}
