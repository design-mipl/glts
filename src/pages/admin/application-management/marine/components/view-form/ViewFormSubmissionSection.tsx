import { Box, Stack, Typography } from '@mui/material'
import { Upload } from 'lucide-react'
import { useRef } from 'react'
import { Button, FormField, Input, Select, Textarea } from '@/design-system/UIComponents'
import { AdminOverlayFormSection } from '@/pages/admin/components/AdminOverlayFormSection'
import type { FormAssistSubmissionDraft } from '@/shared/services/applicationFormAssistService'
import {
  CARD_NAME_OPTIONS,
  PAYMENT_MODE_OPTIONS,
  RECEIPT_STATUS_OPTIONS,
} from '../../config/submissionPaymentConfig'

interface ViewFormSubmissionSectionProps {
  submission: FormAssistSubmissionDraft
  onChange: (patch: Partial<FormAssistSubmissionDraft>) => void
  onPickFile: (field: keyof FormAssistSubmissionDraft, file: File) => void
}

function FileUploadRow({
  label,
  fileName,
  required = false,
  onPick,
}: {
  label: string
  fileName: string
  required?: boolean
  onPick: (file: File) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      alignItems={{ xs: 'flex-start', sm: 'center' }}
      justifyContent="space-between"
      spacing={1}
      sx={{ p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}
    >
      <Stack spacing={0.25}>
        <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
          {label}
          {required ? (
            <Typography component="span" color="error.main" sx={{ ml: 0.25 }}>
              *
            </Typography>
          ) : null}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {fileName || 'No file selected'}
        </Typography>
      </Stack>
      <Button
        label="Upload"
        variant="outlined"
        size="sm"
        startIcon={<Upload size={14} />}
        onClick={() => inputRef.current?.click()}
      />
      <input
        ref={inputRef}
        type="file"
        hidden
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onPick(file)
          e.target.value = ''
        }}
      />
    </Stack>
  )
}

export function ViewFormSubmissionSection({
  submission,
  onChange,
  onPickFile,
}: ViewFormSubmissionSectionProps) {
  const showCardName = submission.paymentMode === 'card'

  return (
    <Stack spacing={2}>
      <AdminOverlayFormSection
        title="Submission details"
        columns={2}
      >
        <FormField label="Online Submission Date" required>
          <Input
            type="date"
            value={submission.submissionDate}
            onChange={v => onChange({ submissionDate: String(v) })}
            placeholder="Select online submission date"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Online Submission Reference No." required>
          <Input
            value={submission.submissionReferenceNumber}
            onChange={v => onChange({ submissionReferenceNumber: String(v) })}
            placeholder="e.g. VFS-ONL-2026-0142"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Online Submitted By" required>
          <Input
            value={submission.submittedBy}
            onChange={v => onChange({ submittedBy: String(v) })}
            placeholder="Enter officer or team name"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="VFS Submission Date">
          <Input
            type="date"
            value={submission.vfsSubmissionDate}
            onChange={v => onChange({ vfsSubmissionDate: String(v) })}
            placeholder="Select VFS submission date"
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Tentative Collection Date" required>
          <Input
            type="date"
            value={submission.tentativeCollectionDate}
            onChange={v => onChange({ tentativeCollectionDate: String(v) })}
            placeholder="Select tentative collection date"
            size="sm"
            fullWidth
          />
        </FormField>
      </AdminOverlayFormSection>

      <AdminOverlayFormSection
        title="Payment details"
        columns={2}
        importance="secondary"
      >
        <FormField label="Payment date" required>
          <Input
            type="date"
            value={submission.paymentDate}
            onChange={v => onChange({ paymentDate: String(v) })}
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Payment mode" required>
          <Select
            value={submission.paymentMode}
            onChange={v => {
              const paymentMode = String(v) as FormAssistSubmissionDraft['paymentMode']
              onChange({
                paymentMode,
                ...(paymentMode !== 'card' ? { cardName: '' } : {}),
              })
            }}
            options={PAYMENT_MODE_OPTIONS}
            size="sm"
            fullWidth
          />
        </FormField>
        {showCardName ? (
          <FormField label="Card name" required>
            <Select
              value={submission.cardName}
              onChange={v => onChange({ cardName: String(v) })}
              options={CARD_NAME_OPTIONS}
              placeholder="Select card"
              size="sm"
              fullWidth
              clearable
            />
          </FormField>
        ) : null}
        <FormField label="Payment reference number" required>
          <Input
            value={submission.paymentReferenceNumber}
            onChange={v => onChange({ paymentReferenceNumber: String(v) })}
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Amount paid" required>
          <Input
            type="number"
            value={submission.amountPaid}
            onChange={v => onChange({ amountPaid: String(v) })}
            size="sm"
            fullWidth
            placeholder="0.00"
          />
        </FormField>
        <FormField label="Receipt status" required>
          <Select
            value={submission.receiptStatus}
            onChange={v =>
              onChange({ receiptStatus: String(v) as FormAssistSubmissionDraft['receiptStatus'] })
            }
            options={RECEIPT_STATUS_OPTIONS}
            size="sm"
            fullWidth
          />
        </FormField>
        <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
          <FormField label="Payment remarks">
            <Textarea
              value={submission.paymentRemarks}
              onChange={v => onChange({ paymentRemarks: String(v) })}
              rows={3}
              fullWidth
              placeholder="Optional notes about payment or receipt"
            />
          </FormField>
        </Box>
      </AdminOverlayFormSection>

      <AdminOverlayFormSection
        title="Document uploads"
        columns={2}
        importance="secondary"
      >
        <FileUploadRow
          label="Confirmation PDF"
          fileName={submission.confirmationPdfFileName}
          required
          onPick={file => onPickFile('confirmationPdfFileName', file)}
        />
        <FileUploadRow
          label="Invoice PDF"
          fileName={submission.invoicePdfFileName}
          required
          onPick={file => onPickFile('invoicePdfFileName', file)}
        />
      </AdminOverlayFormSection>
    </Stack>
  )
}
