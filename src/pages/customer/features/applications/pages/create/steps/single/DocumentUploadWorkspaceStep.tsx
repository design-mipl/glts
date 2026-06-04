import { useEffect, useMemo, useState } from 'react'
import {
  Box,
  Typography,
  Card,
  Stack,
  Chip,
  Grid,
  TextField,
  Button,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  MenuItem,
} from '@mui/material'
import { Upload, Eye, FileText, ChevronDown } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { CustomerStatusChip, getCustomerStatusTone } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import {
  documentStatusLabel,
  isApplicantDocumentSatisfied,
  isSimpleDocumentRequirement,
  applyWorkflowPatch,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import type { ApplicationFlowState } from '../../../../hooks/useApplicationFlowState'
import { getDocumentWorkspaceItems } from '../../../../data/singleApplicationFlowData'
import { singleExtractedFields } from '../../../../data/applicationFlowData'
import type { ApplicantDocumentItem, UploadQueueRow } from '../../../../data/applicationFlowData'
import { SimpleDocumentRequirementPanel } from '../../../../components/documentWorkflow'
import {
  normalizeUploadQueueRow,
  withDocumentProgress,
} from '../../../../utils/uploadQueueDocuments'
import { FlowStepActions } from '../../../../components/create/FlowStepActions'

interface DocumentUploadWorkspaceStepProps {
  state: ApplicationFlowState
  onUpdate: (patch: Partial<ApplicationFlowState>) => void
  onContinue: () => void
  onSaveDraft: () => void
}

type DocumentFieldType = 'text' | 'date' | 'select'

interface DocumentFieldDef {
  key: string
  label: string
  type: DocumentFieldType
  options?: Array<{ label: string; value: string }>
}

const SHARED_SELECTS = {
  gender: [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ],
  entriesAllowed: [
    { label: 'Single', value: 'single' },
    { label: 'Double', value: 'double' },
    { label: 'Multiple', value: 'multiple' },
  ],
}

function getDocumentFieldDefs(docId: string): DocumentFieldDef[] {
  if (docId === 'passport') {
    return [
      { key: 'passportNumber', label: 'Passport No.', type: 'text' },
      { key: 'applicantName', label: 'Name', type: 'text' },
      { key: 'nationality', label: 'Nationality', type: 'text' },
      { key: 'passportExpiry', label: 'Expiry Date', type: 'date' },
      { key: 'passportIssueDate', label: 'Issue Date', type: 'date' },
      { key: 'passportPlaceOfIssue', label: 'Place of Issue', type: 'text' },
      { key: 'dateOfBirth', label: 'Date of Birth', type: 'date' },
      { key: 'gender', label: 'Gender', type: 'select', options: SHARED_SELECTS.gender },
    ]
  }
  if (docId === 'invitation' || docId === 'vessel-letter' || docId === 'cdc') {
    return [
      { key: 'documentNumber', label: 'Document Number', type: 'text' },
      { key: 'holderName', label: 'Name', type: 'text' },
      { key: 'issuedAt', label: 'Issued At', type: 'text' },
      { key: 'validUntil', label: 'Valid Until', type: 'date' },
      { key: 'gender', label: 'Gender', type: 'select', options: SHARED_SELECTS.gender },
      { key: 'entriesAllowed', label: 'Entries Allowed', type: 'select', options: SHARED_SELECTS.entriesAllowed },
    ]
  }
  return [
    { key: 'documentReference', label: 'Reference Number', type: 'text' },
    { key: 'issuedBy', label: 'Issued By', type: 'text' },
    { key: 'issueDate', label: 'Issue Date', type: 'date' },
    { key: 'expiryDate', label: 'Expiry Date', type: 'date' },
    { key: 'remarks', label: 'Remarks', type: 'text' },
  ]
}

function buildSingleQueueRow(state: ApplicationFlowState): UploadQueueRow {
  const existing = state.uploadQueueRows[0]
  if (existing) return existing

  return {
    id: `${state.gltsApplicationId || 'single'}-q1`,
    fileName: 'passport.pdf',
    gltsApplicationId: state.gltsApplicationId,
    gltsApplicantId: `${state.gltsApplicationId || 'single'}-APL-001`,
    sequenceNo: 1,
    travelerName: state.applicantName || '—',
    passportNo: state.passportNumber || '—',
    expiry: state.passportExpiry || '—',
    nationality: state.nationality || '—',
    confidence: 0,
    status: 'processing',
    fields: singleExtractedFields,
    documents: [],
    documentsComplete: 0,
    documentsTotal: 0,
  }
}

export function DocumentUploadWorkspaceStep({
  state,
  onUpdate,
  onContinue,
  onSaveDraft,
}: DocumentUploadWorkspaceStepProps) {
  const colors = usePublicBrandColors()
  const workspaceDocs = useMemo(
    () => getDocumentWorkspaceItems(state.countryId, state.visaOfferingId, state.processingType),
    [state.countryId, state.visaOfferingId, state.processingType],
  )

  const queueRow = useMemo(() => buildSingleQueueRow(state), [state])

  const applicantDocuments = useMemo(() => {
    if (!state.countryId || !state.visaOfferingId) return queueRow.documents ?? []
    const normalized = normalizeUploadQueueRow(queueRow, {
      countryId: state.countryId,
      visaOfferingId: state.visaOfferingId,
      countryLabel: state.countryName,
      passportFields: queueRow.fields?.length ? queueRow.fields : singleExtractedFields,
    })
    return normalized.documents
  }, [queueRow, state.countryId, state.visaOfferingId, state.countryName])

  useEffect(() => {
    if (!state.countryId || !state.visaOfferingId) return
    const base = buildSingleQueueRow(state)
    const normalized = normalizeUploadQueueRow(base, {
      countryId: state.countryId,
      visaOfferingId: state.visaOfferingId,
      countryLabel: state.countryName,
      passportFields: base.fields?.length ? base.fields : singleExtractedFields,
    })
    const current = state.uploadQueueRows[0]
    const idsMatch =
      current &&
      current.documents.length === normalized.documents.length &&
      normalized.documents.every((d, i) => d.documentId === current.documents[i]?.documentId)
    if (idsMatch) return
    onUpdate({ uploadQueueRows: [normalized] })
  }, [
    state.countryId,
    state.visaOfferingId,
    state.countryName,
    state.gltsApplicationId,
    state.uploadQueueRows.length,
  ])

  const documentsById = useMemo(
    () => new Map(applicantDocuments.map(d => [d.documentId, d])),
    [applicantDocuments],
  )

  const [expanded, setExpanded] = useState<string>(workspaceDocs[0]?.id ?? 'passport')
  const [draftFields, setDraftFields] = useState<Record<string, string>>({})

  const mandatoryDocs = applicantDocuments.filter(d => d.required)
  const mandatoryMissing = mandatoryDocs.filter(d => !isApplicantDocumentSatisfied(d)).length
  const clarificationOpen = applicantDocuments.filter(
    d => d.status === 'needs_review' || d.status === 'rejected',
  ).length
  const canProceed = mandatoryMissing === 0 && clarificationOpen === 0

  const fieldKey = (docId: string, label: string) => `${docId}:${label}`

  const schemaFieldValue = (docId: string, key: string): string => {
    if (docId === 'passport') {
      if (key === 'passportNumber') return state.passportNumber
      if (key === 'applicantName') return state.applicantName
      if (key === 'nationality') return state.nationality
      if (key === 'passportExpiry') return state.passportExpiry
      if (key === 'passportIssueDate') return state.passportIssueDate
      if (key === 'dateOfBirth') return state.dateOfBirth
      if (key === 'gender') return state.gender
    }
    return draftFields[fieldKey(docId, key)] || ''
  }

  const onSchemaFieldChange = (docId: string, key: string, value: string) => {
    if (docId === 'passport') {
      if (key === 'passportNumber') return onUpdate({ passportNumber: value })
      if (key === 'applicantName') return onUpdate({ applicantName: value })
      if (key === 'nationality') return onUpdate({ nationality: value })
      if (key === 'passportExpiry') return onUpdate({ passportExpiry: value })
      if (key === 'passportIssueDate') return onUpdate({ passportIssueDate: value })
      if (key === 'dateOfBirth') return onUpdate({ dateOfBirth: value })
      if (key === 'gender') return onUpdate({ gender: value })
    }
    setDraftFields(prev => ({ ...prev, [fieldKey(docId, key)]: value }))
  }

  const updateApplicantDocument = (documentId: string, patch: Partial<ApplicantDocumentItem>) => {
    const row = buildSingleQueueRow(state)
    const nextDocuments = (row.documents.length ? row.documents : applicantDocuments).map(d => {
      if (d.documentId !== documentId) return d
      return isSimpleDocumentRequirement(d.documentId)
        ? applyWorkflowPatch(d, patch)
        : { ...d, ...patch }
    })
    const nextRow = withDocumentProgress({ ...row, documents: nextDocuments })
    onUpdate({ uploadQueueRows: [nextRow] })
  }

  return (
    <Box sx={{ maxWidth: '100%', mx: 'auto', width: '100%' }}>
      <Card
        sx={{
          borderRadius: '16px',
          border: `1px solid ${colors.border}`,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.05)',
          bgcolor: colors.white,
          p: { xs: 1.25, md: 2 },
        }}
      >
        <Stack spacing={1.75}>
          <Stack
            direction={{ xs: 'column', md: 'row' }}
            alignItems={{ xs: 'flex-start', md: 'center' }}
            justifyContent="space-between"
            spacing={1}
            sx={{ pb: 1.25, borderBottom: `1px solid ${colors.border}` }}
          >
            <Box>
              <Typography sx={{ fontWeight: 800, fontSize: { xs: 19, md: 21 }, color: colors.navy, mb: 0.25 }}>
                Document upload workspace
              </Typography>
              <Typography sx={{ fontSize: 12.5, color: colors.textSecondary, maxWidth: 650 }}>
                Upload and manage required documents from the master-driven checklist based on country, visa type, and
                purpose.
              </Typography>
            </Box>
            <Chip
              label="Passport workflow active"
              size="small"
              sx={{ fontWeight: 800, bgcolor: colors.surfaceAlt, color: colors.textSecondary, border: `1px solid ${colors.border}` }}
            />
          </Stack>

          <Stack spacing={1.5}>
            {workspaceDocs.map(doc => {
              const applicantDoc = documentsById.get(doc.id)
              const isSimple = isSimpleDocumentRequirement(doc.id)
              const fieldDefs = isSimple ? [] : getDocumentFieldDefs(doc.id)
              const statusLabel = applicantDoc ? documentStatusLabel(applicantDoc) : doc.status ?? 'Not uploaded'

              return (
                <Accordion
                  key={doc.id}
                  disableGutters
                  expanded={expanded === doc.id}
                  onChange={(_, isExpanded) => setExpanded(isExpanded ? doc.id : '')}
                  sx={{
                    borderRadius: '14px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: 'none',
                    bgcolor: colors.white,
                    '&::before': { display: 'none' },
                    overflow: 'hidden',
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ChevronDown size={16} />}
                    sx={{
                      px: 1.5,
                      py: 0.5,
                      minHeight: 52,
                      borderBottom: `1px solid ${colors.border}`,
                      bgcolor: colors.surfaceAlt,
                      '& .MuiAccordionSummary-content': { my: 0.5 },
                    }}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ width: '100%' }}>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <FileText size={14} color={colors.textSecondary} />
                        <Typography sx={{ fontSize: 15, fontWeight: 700, color: colors.navy }}>{doc.name}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.75} alignItems="center">
                        <Typography sx={{ fontSize: 11, color: colors.textSecondary, fontWeight: 700 }}>
                          {doc.required ? 'Mandatory' : 'Optional'}
                        </Typography>
                        {applicantDoc ? (
                          <CustomerStatusChip
                            label={statusLabel}
                            tone={
                              isApplicantDocumentSatisfied(applicantDoc)
                                ? 'success'
                                : applicantDoc.status === 'needs_review' || applicantDoc.status === 'rejected'
                                  ? 'warning'
                                  : 'neutral'
                            }
                          />
                        ) : doc.status ? (
                          <CustomerStatusChip label={`Status: ${doc.status}`} tone={getCustomerStatusTone(doc.status)} />
                        ) : null}
                      </Stack>
                    </Stack>
                  </AccordionSummary>
                  <AccordionDetails sx={{ px: 1.5, pt: 1.25, pb: 1.5 }}>
                    {isSimple && applicantDoc ? (
                      <SimpleDocumentRequirementPanel
                        document={applicantDoc}
                        onChange={patch => updateApplicantDocument(doc.id, patch)}
                      />
                    ) : (
                      <Stack spacing={1}>
                        <Typography sx={{ fontSize: 11.5, color: colors.textMuted }}>
                          {doc.description || 'Upload document as per checklist. Minimum file size should be above 40KB.'}
                        </Typography>
                        <Typography sx={{ fontSize: 11.5, color: colors.textSecondary }}>
                          File guidance: upload clear files above 40KB.
                        </Typography>

                        <Grid container spacing={1}>
                          <Grid size={{ xs: 12, md: 8 }}>
                            <Grid container spacing={1}>
                              {fieldDefs.map(field => (
                                <Grid key={`${doc.id}-${field.key}`} size={{ xs: 12, sm: 6, lg: 4 }}>
                                  <TextField
                                    fullWidth
                                    size="small"
                                    label={field.label}
                                    type={field.type === 'date' ? 'date' : 'text'}
                                    select={field.type === 'select'}
                                    value={schemaFieldValue(doc.id, field.key)}
                                    onChange={e => onSchemaFieldChange(doc.id, field.key, e.target.value)}
                                    slotProps={field.type === 'date' ? { inputLabel: { shrink: true } } : undefined}
                                    sx={{ '& .MuiInputBase-root': { bgcolor: colors.white } }}
                                  >
                                    {field.type === 'select' &&
                                      field.options?.map(option => (
                                        <MenuItem key={option.value} value={option.value}>
                                          {option.label}
                                        </MenuItem>
                                      ))}
                                  </TextField>
                                </Grid>
                              ))}
                            </Grid>
                          </Grid>
                          <Grid size={{ xs: 12, md: 4 }}>
                            {doc.id === 'passport' ? (
                              <Stack spacing={1} sx={{ p: 1.1, border: `1px solid ${colors.border}`, borderRadius: '10px', bgcolor: colors.surfaceAlt }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Upload size={14} />}
                                  sx={{ textTransform: 'none', justifyContent: 'flex-start', borderRadius: '9px', borderColor: colors.border }}
                                >
                                  Upload front photo
                                </Button>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Upload size={14} />}
                                  sx={{ textTransform: 'none', justifyContent: 'flex-start', borderRadius: '9px', borderColor: colors.border }}
                                >
                                  Upload complete passport PDF
                                </Button>
                                <Button
                                  size="small"
                                  variant="text"
                                  startIcon={<Eye size={14} />}
                                  sx={{ textTransform: 'none', justifyContent: 'flex-start', borderRadius: '9px' }}
                                >
                                  Preview
                                </Button>
                              </Stack>
                            ) : (
                              <Stack spacing={1} sx={{ p: 1.1, border: `1px solid ${colors.border}`, borderRadius: '10px', bgcolor: colors.surfaceAlt }}>
                                <Button
                                  size="small"
                                  variant="outlined"
                                  startIcon={<Upload size={14} />}
                                  sx={{ textTransform: 'none', justifyContent: 'flex-start', borderRadius: '9px', borderColor: colors.border }}
                                >
                                  {doc.status ? 'Re-upload document' : 'Upload document'}
                                </Button>
                                <Button
                                  size="small"
                                  variant="text"
                                  startIcon={<Eye size={14} />}
                                  sx={{ textTransform: 'none', justifyContent: 'flex-start', borderRadius: '9px' }}
                                >
                                  Preview
                                </Button>
                              </Stack>
                            )}
                          </Grid>
                        </Grid>
                      </Stack>
                    )}
                  </AccordionDetails>
                </Accordion>
              )
            })}
          </Stack>
        </Stack>
      </Card>

      <FlowStepActions
        onContinue={onContinue}
        continueDisabled={!canProceed}
        secondaryLabel="Save draft"
        onSecondary={onSaveDraft}
      />
    </Box>
  )
}
