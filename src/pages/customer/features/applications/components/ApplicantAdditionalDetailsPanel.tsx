import { useRef } from 'react'
import { Box, Grid, Stack, Typography } from '@mui/material'
import { Download, Upload } from 'lucide-react'
import { Button, FormField, Input, useToast } from '@/design-system/UIComponents'
import { usePublicBrandColors, getOutlinedButtonSx } from '@/shared/theme/publicBrand'
import {
  APPLICANT_ADDITIONAL_DETAIL_SECTIONS,
  type ApplicantAdditionalDetails,
} from '../config/applicantAdditionalDetailsConfig'
import {
  ADDITIONAL_DETAILS_EXCEL_ACCEPT,
  downloadApplicantAdditionalDetailsExcel,
  parseApplicantAdditionalDetailsExcelFile,
} from '../utils/applicantAdditionalDetailsExcel'

export const ADDITIONAL_DOCUMENT_CHECKLIST_ID = 'additional-document'

interface ApplicantAdditionalDetailsFormProps {
  details: ApplicantAdditionalDetails
  onChange: (patch: Partial<ApplicantAdditionalDetails>) => void
  disabled?: boolean
  /** Used in downloaded template file name (e.g. GLTS applicant id). */
  exportFileSuffix?: string
}

/** @deprecated Use ApplicantAdditionalDetailsForm */
export const ApplicantAdditionalDetailsPanel = ApplicantAdditionalDetailsForm

function inputTypeForField(type: 'text' | 'date' | 'email' | 'tel'): string {
  if (type === 'date') return 'date'
  if (type === 'email') return 'email'
  if (type === 'tel') return 'tel'
  return 'text'
}

export function ApplicantAdditionalDetailsForm({
  details,
  onChange,
  disabled = false,
  exportFileSuffix,
}: ApplicantAdditionalDetailsFormProps) {
  const colors = usePublicBrandColors()
  const { showToast } = useToast()
  const uploadInputRef = useRef<HTMLInputElement>(null)

  const handleDownloadExcel = () => {
    downloadApplicantAdditionalDetailsExcel(details, exportFileSuffix)
    showToast({
      title: 'Template downloaded',
      description: 'Open in Excel, fill the value column, then upload the saved CSV file.',
      variant: 'success',
    })
  }

  const handleUploadClick = () => {
    if (disabled) return
    uploadInputRef.current?.click()
  }

  const handleFileSelected = async (file: File | undefined) => {
    if (!file) return
    const isCsv = /\.csv$/i.test(file.name)
    const isExcel = /\.(xlsx|xls)$/i.test(file.name)
    if (!isCsv && !isExcel) {
      showToast({
        title: 'Unsupported file',
        description: 'Upload a CSV file saved from the Excel template.',
        variant: 'error',
      })
      return
    }
    if (isExcel && !isCsv) {
      showToast({
        title: 'Save as CSV first',
        description: 'In Excel, use Save As → CSV, then upload that file.',
        variant: 'info',
      })
      return
    }
    try {
      const patch = await parseApplicantAdditionalDetailsExcelFile(file)
      onChange(patch)
      showToast({
        title: 'Additional details imported',
        description: `${file.name} — values applied to the form.`,
        variant: 'success',
      })
    } catch (err) {
      showToast({
        title: 'Import failed',
        description: err instanceof Error ? err.message : 'Could not import the file.',
        variant: 'error',
      })
    } finally {
      if (uploadInputRef.current) uploadInputRef.current.value = ''
    }
  }

  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        overflowY: 'auto',
        pr: 0.5,
      }}
    >
      <Typography sx={{ fontSize: 12.5, color: colors.textSecondary, mb: 1.5 }}>
        Optional supplemental information. All fields are optional.
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        sx={{ mb: 2 }}
      >
        <Button
          label="Download Excel template"
          variant="outlined"
          startIcon={<Download size={16} />}
          onClick={handleDownloadExcel}
          disabled={disabled}
          sx={getOutlinedButtonSx()}
        />
        <Button
          label="Upload Excel"
          variant="outlined"
          startIcon={<Upload size={16} />}
          onClick={handleUploadClick}
          disabled={disabled}
          sx={getOutlinedButtonSx()}
        />
        <input
          ref={uploadInputRef}
          type="file"
          accept={ADDITIONAL_DETAILS_EXCEL_ACCEPT}
          hidden
          onChange={e => void handleFileSelected(e.target.files?.[0])}
        />
      </Stack>
      <Typography sx={{ fontSize: 11.5, color: colors.textMuted, mb: 2 }}>
        Template opens in Microsoft Excel. After editing, save as CSV and upload.
      </Typography>
      <Stack spacing={2}>
        {APPLICANT_ADDITIONAL_DETAIL_SECTIONS.map(section => (
          <Box key={section.id}>
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: 700,
                color: colors.navy,
                textTransform: 'uppercase',
                letterSpacing: '0.04em',
                mb: 1,
              }}
            >
              {section.title}
            </Typography>
            <Grid container spacing={1.25}>
              {section.fields.map(field => (
                <Grid key={field.key} size={{ xs: 12, sm: 6 }}>
                  <FormField label={field.label} optional>
                    <Input
                      fullWidth
                      size="sm"
                      type={inputTypeForField(field.type)}
                      value={details[field.key]}
                      onChange={value => onChange({ [field.key]: value })}
                      disabled={disabled}
                    />
                  </FormField>
                </Grid>
              ))}
            </Grid>
          </Box>
        ))}
      </Stack>
    </Box>
  )
}
