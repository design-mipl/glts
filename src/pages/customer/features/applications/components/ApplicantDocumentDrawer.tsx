import { useEffect, useMemo, useState } from 'react'
import { Box, Typography, Stack, Button, Chip, List, ListItemButton, Divider } from '@mui/material'
import { CheckCircle2, Upload, Eye } from 'lucide-react'
import { Drawer } from '@/design-system/UIComponents'
import { usePublicBrandColors, getPrimaryButtonSx, getOutlinedButtonSx, mergeButtonSx } from '@/shared/theme/publicBrand'
import { overlayFooterButtonSx } from '@/design-system/UIComponents/Feedback/overlayHeaderTypography'
import type { GlobalDocumentUploadMeta } from '../hooks/useApplicationFlowState'
import type { ApplicantDocumentItem, UploadQueueRow } from '../data/applicationFlowData'
import { PassportPreviewCard } from './PassportPreviewCard'
import { ExtractedFieldsReview } from './ExtractedFieldsReview'
import { ApplicantAdditionalDetailsForm } from './ApplicantAdditionalDetailsPanel'
import { ApplicantBasicDetailsForm } from './ApplicantBasicDetailsForm'
import { DrawerSidebarSection } from './DrawerSidebarSection'
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
import { countDocumentProgress, isDocumentComplete } from '../utils/uploadQueueDocuments'

type DrawerSection = 'basic' | 'documents' | 'additional'

interface ApplicantDocumentDrawerProps {
  open: boolean
  row: UploadQueueRow | null
  onClose: () => void
  onUpdateRow: (row: UploadQueueRow) => void
  globalDocumentUploads?: Record<string, GlobalDocumentUploadMeta>
}

function docStatusLabel(status: ApplicantDocumentItem['status']): string {
  switch (status) {
    case 'verified':
      return 'Verified'
    case 'uploaded':
      return 'Uploaded'
    case 'needs_review':
      return 'Needs review'
    default:
      return 'Missing'
  }
}

function docStatusTone(status: ApplicantDocumentItem['status']): 'success' | 'warning' | 'neutral' {
  if (status === 'verified' || status === 'uploaded') return 'success'
  if (status === 'needs_review') return 'warning'
  return 'neutral'
}

function docStatusChipSx(
  tone: 'success' | 'warning' | 'neutral',
  colors: ReturnType<typeof usePublicBrandColors>,
) {
  return {
    height: 18,
    fontSize: 10,
    fontWeight: 700,
    flexShrink: 0,
    bgcolor:
      tone === 'success'
        ? colors.greenMuted
        : tone === 'warning'
          ? 'rgba(245,158,11,0.15)'
          : colors.surfaceAlt,
    color: tone === 'success' ? colors.greenDark : tone === 'warning' ? '#92400E' : colors.textMuted,
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
    row.documents.find(d => d.required && !isDocumentComplete(d.status)) ??
    row.documents.find(d => d.documentId === 'passport') ??
    row.documents[0]
  return first?.documentId ?? 'passport'
}

export function ApplicantDocumentDrawer({
  open,
  row,
  onClose,
  onUpdateRow,
  globalDocumentUploads,
}: ApplicantDocumentDrawerProps) {
  const colors = usePublicBrandColors()
  const [activeSection, setActiveSection] = useState<DrawerSection>('documents')
  const [activeDocId, setActiveDocId] = useState<string>('passport')

  const documents = row?.documents ?? []
  const activeDoc = useMemo(
    () => documents.find(d => d.documentId === activeDocId) ?? documents[0],
    [documents, activeDocId],
  )

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
    const nextDocuments = row.documents.map(d =>
      d.documentId === activeDoc.documentId ? { ...d, ...patch } : d,
    )
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

    if (!activeDoc) return
    const mandatory = row.documents.filter(d => d.required)
    const idx = mandatory.findIndex(d => d.documentId === activeDoc.documentId)
    const nextMissing = mandatory.slice(idx + 1).find(d => !isDocumentComplete(d.status))
    if (nextMissing) {
      setActiveDocId(nextMissing.documentId)
      return
    }
    const firstIncomplete = mandatory.find(d => !isDocumentComplete(d.status))
    if (firstIncomplete && firstIncomplete.documentId !== activeDoc.documentId) {
      setActiveDocId(firstIncomplete.documentId)
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
          <Button variant="outlined" onClick={onClose} sx={mergeButtonSx(getOutlinedButtonSx(), overlayFooterButtonSx)}>
            Close
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveAndNext}
            sx={mergeButtonSx(getPrimaryButtonSx(colors), overlayFooterButtonSx)}
          >
            Save & continue
          </Button>
        </Stack>
      }
    >
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ flex: 1, minHeight: 0 }}>
        <Stack
          spacing={1.25}
          sx={{
            width: { xs: '100%', md: 280 },
            flexShrink: 0,
            maxHeight: { md: 'calc(100vh - 220px)' },
            overflowY: 'auto',
            pr: 0.25,
          }}
        >
          <DrawerSidebarSection
            title="Basic details"
            selected={activeSection === 'basic'}
            onHeaderClick={() => setActiveSection('basic')}
            summary={
              <Chip
                label={`${basicProgress.complete}/${basicProgress.total}`}
                size="small"
                sx={{ height: 18, fontSize: 10, fontWeight: 700 }}
              />
            }
          />

          <DrawerSidebarSection title="Document checklist">
            <List dense disablePadding>
              {documents.map(doc => {
                const selected = activeSection === 'documents' && activeDoc?.documentId === doc.documentId
                const tone = docStatusTone(doc.status)
                return (
                  <ListItemButton
                    key={doc.documentId}
                    selected={selected}
                    onClick={() => {
                      setActiveSection('documents')
                      setActiveDocId(doc.documentId)
                    }}
                    sx={{
                      py: 1,
                      borderBottom: `1px solid ${colors.border}`,
                      '&.Mui-selected': { bgcolor: colors.greenMuted },
                    }}
                  >
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={0.75}
                      sx={{ width: '100%', minWidth: 0 }}
                    >
                      <Typography
                        noWrap
                        sx={{ fontSize: 13, fontWeight: 700, color: colors.navy, minWidth: 0, flex: 1 }}
                      >
                        {doc.name}
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ flexShrink: 0 }}>
                        <Chip
                          label={doc.required ? 'Required' : 'Optional'}
                          size="small"
                          sx={{ height: 18, fontSize: 10, fontWeight: 700 }}
                        />
                        <Chip
                          label={docStatusLabel(doc.status)}
                          size="small"
                          sx={docStatusChipSx(tone, colors)}
                        />
                      </Stack>
                    </Stack>
                  </ListItemButton>
                )
              })}
            </List>
          </DrawerSidebarSection>

          <DrawerSidebarSection
            title="Additional details"
            selected={activeSection === 'additional'}
            onHeaderClick={() => setActiveSection('additional')}
            summary={
              <Chip
                label={additionalStatusLabel}
                size="small"
                sx={{
                  height: 18,
                  fontSize: 10,
                  fontWeight: 700,
                  bgcolor: colors.surfaceAlt,
                  color: colors.textMuted,
                }}
              />
            }
          />
        </Stack>

        <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
          {activeSection === 'basic' && (
            <Stack spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.navy }}>Basic details</Typography>
              <ApplicantBasicDetailsForm
                details={resolvedBasicDetails}
                row={row}
                onChange={handleBasicDetailsChange}
                globalDocumentUploads={globalDocumentUploads}
              />
            </Stack>
          )}

          {activeSection === 'additional' && (
            <Stack spacing={1.5} sx={{ flex: 1, minHeight: 0 }}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.navy }}>Additional details</Typography>
              <ApplicantAdditionalDetailsForm
                details={resolvedAdditionalDetails}
                onChange={handleAdditionalDetailsChange}
              />
            </Stack>
          )}

          {activeSection === 'documents' && activeDoc && (
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.navy }}>{activeDoc.name}</Typography>

              {activeDoc.documentId === 'passport' && <PassportPreviewCard row={row} />}

              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Button
                  variant="outlined"
                  startIcon={<Upload size={16} />}
                  onClick={handleMarkUploaded}
                  sx={getOutlinedButtonSx()}
                >
                  {isDocumentComplete(activeDoc.status) ? 'Re-upload' : 'Upload document'}
                </Button>
                <Button variant="outlined" startIcon={<Eye size={16} />} sx={getOutlinedButtonSx()}>
                  Preview
                </Button>
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
                      Upload this document to extract and verify fields.
                    </Typography>
                  </Stack>
                </Box>
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </Drawer>
  )
}
