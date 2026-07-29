import { Divider, Stack, Typography } from '@mui/material'
import { Eye, Download } from 'lucide-react'
import { FileUpload, FormField, Button, useToast } from '@/design-system/UIComponents'
import type { ApplicantDocumentItem } from '../../data/applicationFlowData'
import { SIMPLE_DOCUMENT_WORKFLOW_CONFIG } from '../../config/applicantDocumentWorkflowConfig'
import {
  applyWorkflowPatch,
  documentStatusLabel,
  downloadWorkflowDocument,
  formatWorkflowSummary,
  hasHandlingModeChosen,
  isSimpleDocumentRequirement,
  patchAfterHandlingModeChange,
  resolveHandlingMode,
  type DocumentHandlingMode,
} from '@/shared/utils/applicantDocumentWorkflowUtils'
import { resolveGltsArrangeFee } from '@/shared/utils/gltsArrangeFeeUtils'
import { HandlingModeSegmentedToggle } from './HandlingModeSegmentedToggle'
import { SimpleDocumentRequirementCard } from './SimpleDocumentRequirementCard'

interface SimpleDocumentRequirementPanelProps {
  document: ApplicantDocumentItem
  onChange: (patch: Partial<ApplicantDocumentItem>) => void
  readOnly?: boolean
  travelerName?: string
}

export function SimpleDocumentRequirementPanel({
  document,
  onChange,
  readOnly = false,
  travelerName,
}: SimpleDocumentRequirementPanelProps) {
  const { showToast } = useToast()

  if (!isSimpleDocumentRequirement(document.documentId)) {
    return null
  }

  const config = SIMPLE_DOCUMENT_WORKFLOW_CONFIG[document.documentId]
  const mode = resolveHandlingMode(document)
  const summary = formatWorkflowSummary(document)
  const statusLabel = documentStatusLabel(document)
  const arrangeFee = resolveGltsArrangeFee(document.documentId)
  const storedAmount =
    document.documentId === 'travel-ticket'
      ? document.travelTicket?.arrangementAmount?.trim()
      : document.insurance?.arrangementAmount?.trim()
  const feeAmountLabel =
    storedAmount && !Number.isNaN(Number(storedAmount))
      ? `₹${Number(storedAmount).toLocaleString('en-IN')}`
      : arrangeFee?.amountLabel
  const hasFile =
    document.documentId === 'travel-ticket'
      ? Boolean(document.travelTicket?.fileName?.trim())
      : Boolean(document.insurance?.fileName?.trim())

  const emit = (patch: Partial<ApplicantDocumentItem>) => {
    onChange(applyWorkflowPatch(document, patch))
  }

  const handleModeChange = (nextMode: DocumentHandlingMode) => {
    if (readOnly) return
    onChange(applyWorkflowPatch(document, patchAfterHandlingModeChange(document, nextMode)))
  }

  const handlePreview = () => {
    showToast({
      title: 'Preview',
      description: hasFile
        ? `Preview for ${document.travelTicket?.fileName ?? document.insurance?.fileName} will open here.`
        : 'No document uploaded yet.',
      variant: 'info',
    })
  }

  const modeOptions = [
    { value: 'upload_by_applicant' as const, label: config.yesOptionLabel },
    { value: 'arrange_by_glts' as const, label: config.noOptionLabel },
  ]

  return (
    <SimpleDocumentRequirementCard>
      <Stack spacing={2}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, color: 'text.primary' }}>
          {config.question}
        </Typography>

        {readOnly ? (
          <Stack spacing={1.5}>
            <Typography sx={{ fontSize: 12, color: 'text.secondary', fontWeight: 600 }}>
              Status: {statusLabel}
            </Typography>
            {summary ? (
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>{summary}</Typography>
            ) : null}
            {mode === 'arrange_by_glts' && feeAmountLabel ? (
              <>
                <Divider />
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  GLTS fee: {feeAmountLabel}
                  {arrangeFee ? ` · ${arrangeFee.serviceName}` : ''}
                </Typography>
              </>
            ) : null}
            {hasFile ? (
              <Stack direction="row" flexWrap="wrap" gap={1}>
                <Button
                  label="View document"
                  variant="outlined"
                  size="sm"
                  startIcon={<Eye size={14} />}
                  onClick={handlePreview}
                />
                <Button
                  label="Download"
                  variant="outlined"
                  size="sm"
                  startIcon={<Download size={14} />}
                  onClick={() => downloadWorkflowDocument(document, travelerName)}
                />
              </Stack>
            ) : null}
          </Stack>
        ) : (
          <>
            <HandlingModeSegmentedToggle
              label="Your answer"
              value={mode}
              options={modeOptions}
              onChange={handleModeChange}
            />

            {!hasHandlingModeChosen(document) ? (
              <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                Select whether you will upload this document or GLTS should arrange it.
              </Typography>
            ) : mode === 'upload_by_applicant' ? (
              <FormField label={config.uploadLabel}>
                <FileUpload
                  dropzoneTitle={config.uploadDropzoneTitle}
                  dropzoneCaption="PDF, JPG, or PNG · max 10 MB"
                  accept=".pdf,.jpg,.jpeg,.png"
                  maxSize={10 * 1024 * 1024}
                  disabled={readOnly}
                  onUpload={files => {
                    const file = files[0]
                    if (!file) return
                    if (document.documentId === 'travel-ticket') {
                      emit({
                        travelTicket: {
                          ...document.travelTicket,
                          fileName: file.name,
                          ticketNumber: '',
                          airlineTravelMode: '',
                          travelDate: '',
                          remarks: '',
                          notes: '',
                        },
                        status: 'uploaded',
                      })
                    } else {
                      emit({
                        insurance: {
                          ...document.insurance,
                          fileName: file.name,
                          policyNumber: '',
                          insuranceProvider: '',
                          validFrom: '',
                          validTo: '',
                          remarks: '',
                          notes: '',
                          travelStartDate: '',
                          travelEndDate: '',
                        },
                        status: 'uploaded',
                      })
                    }
                  }}
                  helperText={
                    document.documentId === 'travel-ticket'
                      ? document.travelTicket?.fileName
                      : document.insurance?.fileName
                  }
                />
              </FormField>
            ) : (
              <Stack spacing={1}>
                <Typography sx={{ fontSize: 13, color: 'text.secondary', lineHeight: 1.5 }}>
                  {config.arrangeHelperText}
                </Typography>
                {feeAmountLabel ? (
                  <>
                    <Divider />
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: 'text.primary', lineHeight: 1.5 }}>
                      GLTS fee: {feeAmountLabel}
                      {arrangeFee ? ` · ${arrangeFee.serviceName}` : ''}
                    </Typography>
                  </>
                ) : null}
              </Stack>
            )}
          </>
        )}
      </Stack>
    </SimpleDocumentRequirementCard>
  )
}
