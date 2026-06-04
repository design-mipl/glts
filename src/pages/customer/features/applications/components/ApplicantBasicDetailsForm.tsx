import { Box, Grid, Typography } from '@mui/material'
import { FormField, Input } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { requiresFieldValidation, useApplicationFlowPolicy } from '../context/ApplicationFlowPolicyContext'
import type { ApplicantBasicDetails } from '../config/applicantBasicDetailsConfig'
import type { UploadQueueRow } from '../data/applicationFlowData'

interface ApplicantBasicDetailsFormProps {
  details: ApplicantBasicDetails
  row: UploadQueueRow
  onChange: (patch: Partial<ApplicantBasicDetails>) => void
}

export function ApplicantBasicDetailsForm({
  details,
  row,
  onChange,
}: ApplicantBasicDetailsFormProps) {
  const colors = usePublicBrandColors()
  const { policy } = useApplicationFlowPolicy()
  const strict = requiresFieldValidation(policy)
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
          <FormField label="Applicant name" required={strict}>
            <Input
              fullWidth
              size="sm"
              value={details.applicantName}
              onChange={value => onChange({ applicantName: value })}
            />
          </FormField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField label="Passport number" required={strict}>
            <Input
              fullWidth
              size="sm"
              value={details.passportNumber}
              onChange={value => onChange({ passportNumber: value })}
            />
          </FormField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField label="Nationality" required={strict}>
            <Input
              fullWidth
              size="sm"
              value={details.nationality}
              onChange={value => onChange({ nationality: value })}
            />
          </FormField>
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <FormField label="Date of birth" required={strict}>
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
    </Box>
  )
}
