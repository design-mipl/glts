import { useEffect, useMemo, useState } from 'react'
import { Box, Typography, Stack, Button, Chip, List, ListItemButton, Divider } from '@mui/material'
import { CheckCircle2, Upload, Eye } from 'lucide-react'
import { Drawer } from '@/design-system/UIComponents'
import { usePublicBrandColors, getPrimaryButtonSx, getOutlinedButtonSx, mergeButtonSx } from '@/shared/theme/publicBrand'
import { overlayFooterButtonSx } from '@/design-system/UIComponents/Feedback/overlayHeaderTypography'
import type { ApplicantDocumentItem, UploadQueueRow } from '../data/applicationFlowData'
import { PassportPreviewCard } from './PassportPreviewCard'
import { ExtractedFieldsReview } from './ExtractedFieldsReview'
import { countDocumentProgress, isDocumentComplete } from '../utils/uploadQueueDocuments'

interface ApplicantDocumentDrawerProps {
  open: boolean
  row: UploadQueueRow | null
  onClose: () => void
  onUpdateRow: (row: UploadQueueRow) => void
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

export function ApplicantDocumentDrawer({ open, row, onClose, onUpdateRow }: ApplicantDocumentDrawerProps) {
  const colors = usePublicBrandColors()
  const [activeDocId, setActiveDocId] = useState<string>('passport')

  const documents = row?.documents ?? []
  const activeDoc = useMemo(
    () => documents.find(d => d.documentId === activeDocId) ?? documents[0],
    [documents, activeDocId],
  )

  const progress = row ? countDocumentProgress(row.documents) : { documentsComplete: 0, documentsTotal: 0 }

  const patchRow = (nextDocuments: ApplicantDocumentItem[]) => {
    if (!row) return
    const { documentsComplete, documentsTotal } = countDocumentProgress(nextDocuments)
    onUpdateRow({ ...row, documents: nextDocuments, documentsComplete, documentsTotal })
  }

  const updateActiveDoc = (patch: Partial<ApplicantDocumentItem>) => {
    if (!row || !activeDoc) return
    const nextDocuments = row.documents.map(d =>
      d.documentId === activeDoc.documentId ? { ...d, ...patch } : d,
    )
    patchRow(nextDocuments)
  }

  const handleFieldChange = (key: string, value: string) => {
    if (!row || !activeDoc) return
    const fields = (activeDoc.fields ?? []).map(f => (f.key === key ? { ...f, value } : f))
    const nextDocuments = row.documents.map(d =>
      d.documentId === activeDoc.documentId ? { ...d, fields } : d,
    )
    const { documentsComplete, documentsTotal } = countDocumentProgress(nextDocuments)
    onUpdateRow({
      ...row,
      documents: nextDocuments,
      documentsComplete,
      documentsTotal,
      ...(activeDoc.documentId === 'passport' ? { fields } : {}),
    })
  }

  useEffect(() => {
    if (!open || !row) return
    const first =
      row.documents.find(d => d.required && !isDocumentComplete(d.status)) ??
      row.documents.find(d => d.documentId === 'passport') ??
      row.documents[0]
    if (first) setActiveDocId(first.documentId)
  }, [open, row?.id])

  const handleMarkUploaded = () => {
    if (!activeDoc) return
    const nextStatus = activeDoc.documentId === 'passport' ? 'verified' : 'uploaded'
    updateActiveDoc({ status: nextStatus })
  }

  const handleSaveAndNext = () => {
    if (!row || !activeDoc) return
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
    onClose()
  }

  if (!row) return null

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Applicant documents"
      subtitle={`${row.travelerName} · ${row.passportNo} · ${progress.documentsComplete}/${progress.documentsTotal} documents complete`}
      width={720}
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
        <Box
          sx={{
            width: { xs: '100%', md: 240 },
            flexShrink: 0,
            border: `1px solid ${colors.border}`,
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <Box sx={{ px: 1.5, py: 1.25, bgcolor: colors.surfaceAlt, borderBottom: `1px solid ${colors.border}` }}>
            <Typography sx={{ fontSize: 12, fontWeight: 800, color: colors.navy }}>Document checklist</Typography>
          </Box>
          <List dense disablePadding>
            {documents.map(doc => {
              const selected = activeDoc?.documentId === doc.documentId
              const tone = docStatusTone(doc.status)
              return (
                <ListItemButton
                  key={doc.documentId}
                  selected={selected}
                  onClick={() => setActiveDocId(doc.documentId)}
                  sx={{
                    py: 1.25,
                    borderBottom: `1px solid ${colors.border}`,
                    '&.Mui-selected': { bgcolor: colors.greenMuted },
                  }}
                >
                  <Stack spacing={0.5} sx={{ width: '100%' }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: colors.navy }}>{doc.name}</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Chip
                        label={doc.required ? 'Required' : 'Optional'}
                        size="small"
                        sx={{ height: 18, fontSize: 10, fontWeight: 700 }}
                      />
                      <Chip
                        label={docStatusLabel(doc.status)}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: 10,
                          fontWeight: 700,
                          bgcolor:
                            tone === 'success'
                              ? colors.greenMuted
                              : tone === 'warning'
                                ? 'rgba(245,158,11,0.15)'
                                : colors.surfaceAlt,
                          color:
                            tone === 'success'
                              ? colors.greenDark
                              : tone === 'warning'
                                ? '#92400E'
                                : colors.textMuted,
                        }}
                      />
                    </Stack>
                  </Stack>
                </ListItemButton>
              )
            })}
          </List>
        </Box>

        <Box sx={{ flex: 1, minWidth: 0 }}>
          {activeDoc && (
            <Stack spacing={2}>
              <Typography sx={{ fontWeight: 800, fontSize: 16, color: colors.navy }}>{activeDoc.name}</Typography>

              {activeDoc.documentId === 'passport' && (
                <PassportPreviewCard row={row} />
              )}

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
