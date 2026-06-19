import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography, Card, Stack, Chip, Button, Grid, IconButton } from '@mui/material'
import { FolderArchive, Eye, Upload, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { FileUpload } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { UploadQueueTable } from '../../../components/UploadQueueTable'
import { ApplicantDocumentDrawer } from '../../../components/ApplicantDocumentDrawer'
import {
  emptyApplicantAdditionalDetails,
  resolveApplicantAdditionalDetails,
} from '../../../config/applicantAdditionalDetailsConfig'
import { emptyApplicantBasicDetails } from '../../../config/applicantBasicDetailsConfig'
import { ensureRowBasicDetails } from '../../../utils/applicantBasicDetailsUtils'
import type { ApplicationFlowState } from '../../../hooks/useApplicationFlowState'
import type { UploadQueueRow } from '../../../data/applicationFlowData'
import { customerPortalService } from '@/pages/customer/features/shared/services/customerPortalService'
import { useToast } from '@/design-system/UIComponents'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import {
  countDocumentProgress,
  mergeApplicantDocumentsWithChecklist,
} from '../../../utils/uploadQueueDocuments'
import {
  requiresFieldValidation,
  isWebsiteFlowPolicy,
  useApplicationFlowPolicy,
} from '../../../context/ApplicationFlowPolicyContext'
import { FlowStepActions } from '../../../components/create/FlowStepActions'
import {
  assignApplicantReferences,
  createEmptyUploadQueueRow,
  ensureFlowGltsApplicationId,
  resolveFlowBatchId,
} from '../../../utils/gltsReferenceIds'
import { REQUIRED_GLOBAL_CHECKLIST_DOCUMENTS } from '../../../utils/globalDocumentChecklist'

interface BulkApplicationUploadPageProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
}

function buildPendingExtractedFields() {
  return [
    { key: 'surname', label: 'Surname', value: '', confidence: 0 },
    { key: 'given', label: 'Given names', value: '', confidence: 0 },
    { key: 'sex', label: 'Sex', value: '', confidence: 0 },
    { key: 'docNo', label: 'Document no.', value: '', confidence: 0 },
    { key: 'issueDate', label: 'Date of issue', value: '', confidence: 0 },
    { key: 'dob', label: 'Date of birth', value: '', confidence: 0 },
    { key: 'expiry', label: 'Date of expiry', value: '', confidence: 0 },
    { key: 'pob', label: 'Place of birth', value: '', confidence: 0 },
    { key: 'issuer', label: 'Issuing state', value: '', confidence: 0 },
    { key: 'mrz', label: 'Machine-readable line', value: '', confidence: 0 },
  ]
}

const FIXED_MOCK_IDENTITIES = [
  { travelerName: 'Aarav Mehta', passportNo: 'N1234567', nationality: 'India', expiry: '18/09/2031' },
  { travelerName: 'Fatima Noor', passportNo: 'P2345678', nationality: 'UAE', expiry: '07/03/2030' },
  { travelerName: 'Daniel Okoro', passportNo: 'B3456789', nationality: 'Nigeria', expiry: '12/11/2032' },
  { travelerName: 'Sara Kowalski', passportNo: 'X4567890', nationality: 'Poland', expiry: '25/01/2031' },
  { travelerName: 'Luca Bianchi', passportNo: 'Y5678901', nationality: 'Italy', expiry: '04/08/2033' },
  { travelerName: 'Mina Park', passportNo: 'K6789012', nationality: 'South Korea', expiry: '29/05/2030' },
  { travelerName: 'Carlos Rivera', passportNo: 'R7890123', nationality: 'Mexico', expiry: '15/12/2031' },
] as const

function buildResolvedExtractedFields(applicantName: string, passportNo: string, fallbackIndex: number) {
  const nameParts = applicantName.split(' ').filter(Boolean)
  const given = (nameParts[0] ?? 'APPLICANT').toUpperCase()
  const surname = (nameParts.slice(1).join(' ') || `MOCK${fallbackIndex}`).toUpperCase()
  const day = String((fallbackIndex % 27) + 1).padStart(2, '0')
  const month = String((fallbackIndex % 12) + 1).padStart(2, '0')
  return [
    { key: 'surname', label: 'Surname', value: surname, confidence: 94 },
    { key: 'given', label: 'Given names', value: given, confidence: 95 },
    { key: 'sex', label: 'Sex', value: fallbackIndex % 2 === 0 ? 'F' : 'M', confidence: 91 },
    { key: 'docNo', label: 'Document no.', value: passportNo, confidence: 97 },
    { key: 'issueDate', label: 'Date of issue', value: `${day}/${month}/2021`, confidence: 89 },
    { key: 'dob', label: 'Date of birth', value: `${day}/${month}/1990`, confidence: 88 },
    { key: 'expiry', label: 'Date of expiry', value: `${day}/${month}/2031`, confidence: 93 },
    { key: 'pob', label: 'Place of birth', value: 'MOCK CITY', confidence: 84 },
    { key: 'issuer', label: 'Issuing state', value: 'MOCK', confidence: 92 },
    { key: 'mrz', label: 'Machine-readable line', value: 'Validated', confidence: 90 },
  ]
}

function applicantPatchFromRow(row: UploadQueueRow): Partial<ApplicationFlowState> {
  const normalize = (value: string) => (value === '—' ? '' : value)
  const basic = row.basicDetails
  return {
    applicantName: normalize(row.travelerName),
    passportNumber: normalize(row.passportNo),
    nationality: normalize(row.nationality),
    passportExpiry: normalize(row.expiry),
    dateOfBirth: basic?.dateOfBirth?.trim() ?? '',
    passportUploaded: true,
  }
}

function getFileSignature(file: File): string {
  return `${file.name}:${file.size}:${file.lastModified}`
}

function toResolvedIdentity(row: UploadQueueRow, fallbackIndex: number): UploadQueueRow {
  const profile = FIXED_MOCK_IDENTITIES[(fallbackIndex - 1) % FIXED_MOCK_IDENTITIES.length]
  const displayName = profile.travelerName
  const resolvedPassportNo = profile.passportNo
  const resolvedFields = buildResolvedExtractedFields(displayName, resolvedPassportNo, fallbackIndex)
  const alreadyResolved =
    row.travelerName === displayName &&
    row.passportNo === resolvedPassportNo &&
    row.nationality === profile.nationality &&
    row.expiry === profile.expiry &&
    row.status === 'needs_review'

  if (alreadyResolved) return row

  return {
    ...row,
    travelerName: displayName,
    passportNo: resolvedPassportNo,
    expiry: profile.expiry,
    nationality: profile.nationality,
    confidence: 92,
    fields: resolvedFields,
    status: 'needs_review',
    documents: row.documents ?? [],
    documentsComplete: row.documentsComplete ?? 0,
    documentsTotal: row.documentsTotal ?? 0,
  }
}

export function BulkApplicationUploadPage({ state, onUpdate, onContinue }: BulkApplicationUploadPageProps) {
  const colors = usePublicBrandColors()
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { base } = useCustomerPortalBase()
  const { policy, listingPath } = useApplicationFlowPolicy()
  const strict = requiresFieldValidation(policy)
  const isWebsite = isWebsiteFlowPolicy(policy)
  const draftListingPath = listingPath || (isWebsite ? '/countries' : `${base}/applications`)
  const [drawerRowId, setDrawerRowId] = useState<string | null>(null)
  const [pendingGlobalDocId, setPendingGlobalDocId] = useState<string | null>(null)
  const globalUploadInputRef = useRef<HTMLInputElement>(null)
  const rowsRef = useRef<UploadQueueRow[]>(state.uploadQueueRows)
  const rows = state.uploadQueueRows
  const uploaded = rows.length > 0
  const globalUploadFiles = state.globalDocumentUploads
  const canBuildChecklist = Boolean(state.countryId && state.visaOfferingId)

  const gltsApplicationId = state.gltsApplicationId || undefined
  const gltsBatchId = state.gltsBatchId || undefined
  const globalChecklistDocs = useMemo(() => REQUIRED_GLOBAL_CHECKLIST_DOCUMENTS, [])

  const drawerRow = useMemo(
    () => rows.find(r => r.id === drawerRowId) ?? null,
    [rows, drawerRowId],
  )

  useEffect(() => {
    if (state.gltsApplicationId) return
    onUpdate({ gltsApplicationId: ensureFlowGltsApplicationId(state) })
  }, [state.gltsApplicationId, onUpdate, state])

  useEffect(() => {
    rowsRef.current = state.uploadQueueRows
  }, [state.uploadQueueRows])

  const persistRows = useCallback(
    (nextRows: UploadQueueRow[], flowPatch: Partial<ApplicationFlowState> = {}) => {
      rowsRef.current = nextRows
      const patch: Partial<ApplicationFlowState> = { uploadQueueRows: nextRows, ...flowPatch }
      if (nextRows.length === 1) {
        Object.assign(patch, applicantPatchFromRow(nextRows[0]))
      } else if (nextRows.length === 0) {
        Object.assign(patch, {
          passportUploaded: false,
          applicantName: '',
          passportNumber: '',
          nationality: '',
          passportExpiry: '',
          gltsBatchId: '',
        })
      }
      onUpdate(patch)
    },
    [onUpdate],
  )

  const ensureRowAdditionalDetails = useCallback((row: UploadQueueRow): UploadQueueRow => {
    if (row.additionalDetails) return row
    return { ...row, additionalDetails: emptyApplicantAdditionalDetails() }
  }, [])

  const withChecklist = useCallback(
    (row: UploadQueueRow, fallbackIndex: number): UploadQueueRow => {
      if (!canBuildChecklist) return ensureRowAdditionalDetails(row)
      const passportFields =
        row.fields && row.fields.length > 0
          ? row.fields
          : buildPendingExtractedFields()
      const documents = mergeApplicantDocumentsWithChecklist(
        (row.documents ?? []).map(doc =>
          doc.documentId === 'passport'
            ? {
                ...doc,
                fields: passportFields,
                status: doc.status === 'missing' ? 'needs_review' : doc.status,
              }
            : doc,
        ),
        state.countryId,
        state.visaOfferingId,
        passportFields,
        fallbackIndex - 1,
        state.jurisdictionId || undefined,
      )
      const { documentsComplete, documentsTotal } = countDocumentProgress(documents)
      const additionalDetails = resolveApplicantAdditionalDetails(row.additionalDetails)
      return ensureRowBasicDetails({
        ...row,
        fields: passportFields,
        documents,
        documentsComplete,
        documentsTotal,
        additionalDetails,
      })
    },
    [canBuildChecklist, ensureRowAdditionalDetails, state.countryId, state.visaOfferingId, state.jurisdictionId],
  )

  useEffect(() => {
    if (state.uploadQueueRows.length === 0) return
    const normalized = state.uploadQueueRows.map((row, index) =>
      withChecklist(toResolvedIdentity(row, index + 1), index + 1),
    )
    const changed = normalized.some((row, index) => row !== state.uploadQueueRows[index])
    if (!changed) return
    persistRows(normalized)
  }, [persistRows, state.uploadQueueRows, withChecklist])

  const handleUpload = useCallback(
    (files: File[]) => {
      const incoming = files.map(file => ({ file, key: getFileSignature(file) }))

      if (files.length === 0) {
        persistRows([], { gltsBatchId: '' })
        setDrawerRowId(null)
        return
      }

      const applicationId = ensureFlowGltsApplicationId(state)
      const existingRows = rowsRef.current.filter(row => row.sourceFileKey)
      const existingBySourceKey = new Map(existingRows.map(row => [row.sourceFileKey!, row]))
      const existingKeySet = new Set(existingRows.map(row => row.sourceFileKey!))

      const isRemoval =
        incoming.length < existingRows.length &&
        incoming.every(entry => existingKeySet.has(entry.key))

      const fileByKey = new Map(incoming.map(entry => [entry.key, entry.file]))
      const orderedKeys: string[] = []

      if (isRemoval) {
        for (const { key } of incoming) orderedKeys.push(key)
      } else {
        for (const row of existingRows) {
          if (row.sourceFileKey) orderedKeys.push(row.sourceFileKey)
        }
        for (const { key } of incoming) {
          if (!orderedKeys.includes(key)) orderedKeys.push(key)
        }
      }

      const newKeys = orderedKeys.filter(key => !existingKeySet.has(key))
      if (newKeys.length === 0 && !isRemoval) {
        showToast({
          title: 'File already in queue',
          description: 'This passport file is already linked to a traveler row.',
          variant: 'info',
        })
        return
      }

      const batchId = resolveFlowBatchId(state, orderedKeys.length)

      const withFiles = orderedKeys.map((key, index) => {
        const file = fileByKey.get(key) ?? null
        const matchedExisting = existingBySourceKey.get(key)
        if (matchedExisting) {
          return withChecklist(
            toResolvedIdentity(
              {
                ...matchedExisting,
                sourceFileKey: key,
                fileName: file?.name ?? matchedExisting.fileName,
              },
              index + 1,
            ),
            index + 1,
          )
        }
        const baseRow: UploadQueueRow = {
          id: `tmp-${Date.now()}-${index}-${key}`,
          fileName: file?.name ?? `passport-${index + 1}`,
          sourceFileKey: key,
          gltsApplicationId: applicationId,
          gltsApplicantId: '',
          sequenceNo: 0,
          travelerName: '—',
          passportNo: '—',
          expiry: '—',
          nationality: '—',
          confidence: 0,
          status: 'needs_review',
          fields: [],
          documents: [],
          documentsComplete: 0,
          documentsTotal: 0,
          additionalDetails: emptyApplicantAdditionalDetails(),
          basicDetails: emptyApplicantBasicDetails(),
        }
        return withChecklist(toResolvedIdentity(baseRow, index + 1), index + 1)
      })
      const nextRows = assignApplicantReferences(withFiles, applicationId)

      persistRows(nextRows, {
        gltsApplicationId: applicationId,
        gltsBatchId: batchId ?? '',
      })
      setDrawerRowId(null)
    },
    [persistRows, showToast, state, withChecklist],
  )

  const handleUploadError = useCallback(
    (message: string) => {
      showToast({
        title: 'Upload not added',
        description: message,
        variant: 'warning',
      })
    },
    [showToast],
  )

  const handleRowSelect = (id: string) => {
    setDrawerRowId(id)
  }

  const handleRowUpdate = (updated: UploadQueueRow) => {
    const nextRows = rows.map(r => (r.id === updated.id ? updated : r))
    persistRows(nextRows)
  }

  const handleSaveDraft = () => {
    const applicationId = ensureFlowGltsApplicationId(state)
    customerPortalService.saveApplicationDraft({
      applicationId,
      countryName: state.countryName,
      countryFlag: state.countryFlag,
      visaTypeLabel: state.visaTypeLabel,
      travelDate: state.travelDate,
      rows,
    })
    showToast({
      title: 'Draft saved',
      description: isWebsite
        ? 'Resume from the Apply flow when you return.'
        : 'Application moved to Draft applications.',
      variant: 'success',
    })
    navigate(draftListingPath)
  }

  const handleGlobalUploadClick = (docId: string) => {
    setPendingGlobalDocId(docId)
    globalUploadInputRef.current?.click()
  }

  const handleGlobalFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    const docId = pendingGlobalDocId
    if (!selected || !docId) return

    onUpdate({
      globalDocumentUploads: {
        ...globalUploadFiles,
        [docId]: {
          fileName: selected.name,
          uploadedAt: new Date().toISOString(),
        },
      },
    })
    showToast({
      title: 'Global document uploaded',
      description: `${selected.name} linked to ${globalChecklistDocs.find(d => d.documentId === docId)?.name ?? 'document'}.`,
      variant: 'success',
    })
    setPendingGlobalDocId(null)
    e.target.value = ''
  }

  const handleRemoveGlobalFile = (docId: string) => {
    const uploaded = globalUploadFiles[docId]
    if (!uploaded) return
    const copy = { ...globalUploadFiles }
    delete copy[docId]
    onUpdate({ globalDocumentUploads: copy })
    showToast({
      title: 'Global document removed',
      description: `${uploaded.fileName} removed from global checklist.`,
      variant: 'info',
    })
  }

  const isSingleListing = rows.length === 1

  const handleAddEmptyApplicant = useCallback(() => {
    const gltsApplicationId = ensureFlowGltsApplicationId(state)
    const nextSequence = rows.length + 1
    const emptyRow = createEmptyUploadQueueRow(gltsApplicationId, nextSequence)
    const withRefs = assignApplicantReferences(
      [...rows, withChecklist(emptyRow, nextSequence)],
      gltsApplicationId,
    )
    const batchId = resolveFlowBatchId(state, withRefs.length)
    persistRows(withRefs, {
      gltsApplicationId,
      gltsBatchId: batchId ?? '',
    })
  }, [persistRows, rows, state, withChecklist])

  return (
    <Box sx={{ width: '100%', maxWidth: '100%' }}>
      <Typography sx={{ fontWeight: 800, fontSize: '20px', color: colors.navy, mb: 0.5 }}>
        Upload passport
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 1 }}>
        Add one passport scan per traveler. Upload a folder or ZIP to create multiple listings at once.
      </Typography>

      {gltsApplicationId && (
        <Stack direction="row" flexWrap="wrap" gap={1} sx={{ mb: 2 }}>
          <Chip
            label={`Application ${gltsApplicationId}`}
            size="small"
            sx={{ fontWeight: 700, fontSize: 11, fontFamily: 'monospace' }}
          />
          {gltsBatchId && (
            <Chip
              label={`Batch ${gltsBatchId}`}
              size="small"
              variant="outlined"
              sx={{ fontWeight: 700, fontSize: 11, fontFamily: 'monospace' }}
            />
          )}
        </Stack>
      )}

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, height: '100%' }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.5 }}>
              <FolderArchive size={18} color={colors.greenBright} />
              <Typography sx={{ fontWeight: 700, fontSize: '14px' }}>
                {uploaded ? 'Add or replace passport upload' : 'Upload passport folder or ZIP'}
              </Typography>
            </Stack>
            <Typography sx={{ fontSize: '12px', color: colors.textMuted, mb: 1.5 }}>
              {uploaded
                ? 'Upload again to replace the queue or add more passport files · one listing per traveler'
                : 'Passport scans only · one listing per traveler · open a row to upload remaining documents'}
            </Typography>
            <FileUpload
              onUpload={handleUpload}
              onError={handleUploadError}
              accept=".zip,image/*,.pdf"
              multiple
              dropzoneTitle="Upload passport — choose files or drag & drop here"
              dropzoneCaption=".zip, passport images (JPG, PNG), PDF · one file per traveler"
              browseLabel="Browse passport files"
            />
          </Card>
        </Grid>
        <Grid size={{ xs: 12, md: 5 }}>
          <Card sx={{ p: 2, borderRadius: '12px', border: `1px solid ${colors.border}`, height: '100%' }}>
            <Typography sx={{ fontWeight: 800, fontSize: 14, color: colors.navy, mb: 1 }}>
              Common Document Checklist
            </Typography>

            <Box sx={{ mb: 1.5 }}>
              <Stack spacing={0.75}>
                {globalChecklistDocs.length === 0 ? (
                  <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
                    Select country and visa to load global documents.
                  </Typography>
                ) : (
                  globalChecklistDocs.map(doc => (
                    <Stack
                      key={`global-${doc.documentId}`}
                      spacing={1}
                      sx={{
                        p: 1.25,
                        borderRadius: '10px',
                        border: `1px solid ${colors.border}`,
                        bgcolor: colors.surfaceAlt,
                      }}
                    >
                      <Stack direction="row" alignItems="flex-start" justifyContent="space-between" spacing={1}>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: colors.navy, lineHeight: 1.25 }}>
                            {doc.name}
                          </Typography>
                          <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
                            {doc.required ? 'Required' : 'Optional'}
                          </Typography>
                        </Box>
                        <Chip
                          size="small"
                          label={globalUploadFiles[doc.documentId] ? 'Uploaded' : 'Pending'}
                          sx={{
                            height: 20,
                            fontSize: 10,
                            fontWeight: 700,
                            bgcolor: globalUploadFiles[doc.documentId] ? colors.greenMuted : colors.white,
                            color: globalUploadFiles[doc.documentId] ? colors.greenDark : colors.textMuted,
                            border: `1px solid ${globalUploadFiles[doc.documentId] ? colors.green : colors.border}`,
                          }}
                        />
                      </Stack>

                      {globalUploadFiles[doc.documentId] && (
                        <Box
                          sx={{
                            px: 0.75,
                            py: 0.35,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 0.5,
                            borderRadius: '8px',
                            border: `1px solid ${colors.border}`,
                            bgcolor: colors.white,
                            maxWidth: '100%',
                          }}
                        >
                          <Typography noWrap sx={{ fontSize: 10.5, color: colors.textSecondary, flex: 1, minWidth: 0 }}>
                              {globalUploadFiles[doc.documentId].fileName}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => handleRemoveGlobalFile(doc.documentId)}
                            aria-label="Remove uploaded file"
                            sx={{ p: 0.25, color: colors.textSecondary }}
                          >
                            <X size={12} />
                          </IconButton>
                        </Box>
                      )}

                      <Stack direction="row" spacing={0.75}>
                        {!globalUploadFiles[doc.documentId] && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Upload size={13} />}
                            sx={{ textTransform: 'none', fontSize: 11, minWidth: 0, borderRadius: '8px' }}
                            onClick={() => handleGlobalUploadClick(doc.documentId)}
                          >
                            Upload
                          </Button>
                        )}
                        <Button
                          size="small"
                          variant="text"
                          startIcon={<Eye size={13} />}
                          sx={{ textTransform: 'none', fontSize: 11, minWidth: 0, borderRadius: '8px' }}
                          disabled={!globalUploadFiles[doc.documentId]}
                          onClick={() =>
                            showToast({
                              title: 'Preview',
                              description: globalUploadFiles[doc.documentId]
                                ? `${globalUploadFiles[doc.documentId].fileName} ready for preview.`
                                : `Upload ${doc.name} first.`,
                              variant: 'info',
                            })
                          }
                        >
                          Preview
                        </Button>
                      </Stack>
                    </Stack>
                  ))
                )}
              </Stack>
            </Box>

          </Card>
        </Grid>
      </Grid>
      <input
        ref={globalUploadInputRef}
        type="file"
        style={{ display: 'none' }}
        accept=".pdf,image/*"
        onChange={handleGlobalFileChange}
      />

      {!strict && rows.length === 0 && (
        <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 2 }}>
          <Button
            variant="outlined"
            onClick={handleAddEmptyApplicant}
            sx={{ textTransform: 'none', fontSize: 13 }}
          >
            Add empty applicant
          </Button>
        </Stack>
      )}

      {uploaded && rows.length > 0 && (
        <UploadQueueTable
          rows={rows}
          selectedId={drawerRowId}
          onSelect={handleRowSelect}
          onContinue={onContinue}
          continueLabel={
            isSingleListing
              ? 'Continue to details →'
              : `Continue to details with ${rows.length} traveler${rows.length === 1 ? '' : 's'} →`
          }
          singleListing={isSingleListing}
          gltsApplicationId={gltsApplicationId}
        />
      )}

      {!strict && !uploaded && (
        <FlowStepActions
          onContinue={onContinue}
          continueLabel="Continue to details →"
        />
      )}

      <Stack direction="row" justifyContent="flex-end" sx={{ mt: 1.5 }}>
        <Button
          variant="outlined"
          onClick={handleSaveDraft}
          disabled={strict && (!state.countryId || !state.visaOfferingId)}
          sx={{ textTransform: 'none', fontSize: 13 }}
        >
          Save draft
        </Button>
      </Stack>

      <ApplicantDocumentDrawer
        open={Boolean(drawerRowId && drawerRow)}
        row={drawerRow}
        onClose={() => setDrawerRowId(null)}
        onUpdateRow={handleRowUpdate}
        countryId={state.countryId}
        visaOfferingId={state.visaOfferingId}
        jurisdictionId={state.jurisdictionId || undefined}
      />
    </Box>
  )
}
