import { Box, Grid, Stack, Typography } from '@mui/material'
import { FormField, Input, Toggle } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { ApplicantBasicDetails } from '../config/applicantBasicDetailsConfig'
import type { UploadQueueRow } from '../data/applicationFlowData'
import { hasDummyTicketProvided, hasInsuranceProvided } from '../utils/applicantBasicDetailsUtils'

interface ApplicantBasicDetailsFormProps {
  details: ApplicantBasicDetails
  row: UploadQueueRow
  onChange: (patch: Partial<ApplicantBasicDetails>) => void
  globalDocumentUploads?: Record<string, { fileName: string }>
}

export function ApplicantBasicDetailsForm({
  details,
  row,
  onChange,
  globalDocumentUploads,
}: ApplicantBasicDetailsFormProps) {
  const colors = usePublicBrandColors()
  const dummyProvided = hasDummyTicketProvided(row, globalDocumentUploads)
  const insuranceProvided = hasInsuranceProvided(row, globalDocumentUploads)
  const crewFromReference = Boolean(row.gltsApplicantId?.trim())

  return (
    <Box sx={{ flex: 1, minHeight: 0, overflowY: 'auto', pr: 0.5 }}>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, mb: 2 }}>
        Some fields auto-fill from passport OCR when the passport is verified.
      </Typography>
      <Grid container spacing={1.5}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField
            label="Crew ID"
            helperText={crewFromReference ? 'Linked to applicant reference' : undefined}
          >
            <Input
              fullWidth
              size="sm"
              value={details.crewId}
              onChange={value => onChange({ crewId: value })}
              placeholder="e.g. GLTS-APL-001"
            />
          </FormField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField label="Applicant name" required>
            <Input
              fullWidth
              size="sm"
              value={details.applicantName}
              onChange={value => onChange({ applicantName: value })}
            />
          </FormField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField label="Passport number" required>
            <Input
              fullWidth
              size="sm"
              value={details.passportNumber}
              onChange={value => onChange({ passportNumber: value })}
            />
          </FormField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField label="Nationality" required>
            <Input
              fullWidth
              size="sm"
              value={details.nationality}
              onChange={value => onChange({ nationality: value })}
            />
          </FormField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField label="Date of birth" required>
            <Input
              fullWidth
              size="sm"
              value={details.dateOfBirth}
              onChange={value => onChange({ dateOfBirth: value })}
              placeholder="DD/MM/YYYY"
            />
          </FormField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField label="CDC number">
            <Input
              fullWidth
              size="sm"
              value={details.cdcNumber}
              onChange={value => onChange({ cdcNumber: value })}
            />
          </FormField>
        </Grid>
      </Grid>

      <Typography
        sx={{
          fontSize: 12,
          fontWeight: 700,
          color: colors.navy,
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          mt: 2.5,
          mb: 1,
        }}
      >
        Add-ons
      </Typography>
      <Stack spacing={1.25}>
        <Toggle
          checked={details.requestDummyTicket}
          onChange={value => onChange({ requestDummyTicket: value })}
          label="Dummy ticket"
          description={
            dummyProvided
              ? 'Already provided — no dummy ticket needed'
              : 'Request a dummy ticket for this applicant'
          }
          disabled={dummyProvided}
        />
        <Toggle
          checked={details.requestInsurance}
          onChange={value => onChange({ requestInsurance: value })}
          label="Travel insurance"
          description={
            insuranceProvided
              ? 'Already provided — insurance on file'
              : 'Request travel insurance for this applicant'
          }
          disabled={insuranceProvided}
        />
      </Stack>
    </Box>
  )
}
