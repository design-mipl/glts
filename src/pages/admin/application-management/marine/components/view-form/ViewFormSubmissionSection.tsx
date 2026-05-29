import { Stack, Typography } from '@mui/material'
import { Upload } from 'lucide-react'
import { useRef } from 'react'
import { BaseCard, Button, FormField, Input, Textarea } from '@/design-system/UIComponents'
import type { FormAssistSubmissionDraft } from '@/shared/services/applicationFormAssistService'

interface ViewFormSubmissionSectionProps {
  submission: FormAssistSubmissionDraft
  onChange: (patch: Partial<FormAssistSubmissionDraft>) => void
  onPickFile: (field: keyof FormAssistSubmissionDraft, file: File) => void
}

const FILE_FIELDS: Array<{ key: keyof FormAssistSubmissionDraft; label: string }> = [
  { key: 'appointmentPdfFileName', label: 'Appointment PDF' },
  { key: 'submissionConfirmationPdfFileName', label: 'Submission confirmation PDF' },
  { key: 'confirmationEmailFileName', label: 'Confirmation email PDF/screenshot' },
]

function FileUploadRow({
  label,
  fileName,
  onPick,
}: {
  label: string
  fileName: string
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
          {label} *
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
  return (
    <BaseCard sx={{ p: 2 }}>
      <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 0.5 }}>
        Submission confirmation
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ fontSize: 13, mb: 2 }}>
        Record external portal appointment and upload confirmation artifacts. GLTS does not submit forms
        automatically.
      </Typography>
      <Stack spacing={2}>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
          <FormField label="Appointment date" required sx={{ flex: 1 }}>
            <Input
              type="date"
              value={submission.appointmentDate}
              onChange={v => onChange({ appointmentDate: String(v) })}
              size="sm"
              fullWidth
            />
          </FormField>
          <FormField label="Appointment reference" required sx={{ flex: 1 }}>
            <Input
              value={submission.appointmentReference}
              onChange={v => onChange({ appointmentReference: String(v) })}
              size="sm"
              fullWidth
            />
          </FormField>
        </Stack>
        <FormField label="External portal reference no." required>
          <Input
            value={submission.externalPortalReference}
            onChange={v => onChange({ externalPortalReference: String(v) })}
            size="sm"
            fullWidth
          />
        </FormField>
        <FormField label="Remarks">
          <Textarea
            value={submission.remarks}
            onChange={v => onChange({ remarks: String(v) })}
            rows={3}
            fullWidth
          />
        </FormField>
        <Stack spacing={1.25}>
          <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
            Mandatory uploads
          </Typography>
          {FILE_FIELDS.map(({ key, label }) => (
            <FileUploadRow
              key={key}
              label={label}
              fileName={submission[key]}
              onPick={file => onPickFile(key, file)}
            />
          ))}
        </Stack>
      </Stack>
    </BaseCard>
  )
}
