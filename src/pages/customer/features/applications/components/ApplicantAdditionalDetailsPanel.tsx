import { Box, Grid, Stack, Typography } from '@mui/material'
import { FormField, Input } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  APPLICANT_ADDITIONAL_DETAIL_SECTIONS,
  type ApplicantAdditionalDetails,
} from '../config/applicantAdditionalDetailsConfig'

export const ADDITIONAL_DOCUMENT_CHECKLIST_ID = 'additional-document'

interface ApplicantAdditionalDetailsFormProps {
  details: ApplicantAdditionalDetails
  onChange: (patch: Partial<ApplicantAdditionalDetails>) => void
  disabled?: boolean
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
}: ApplicantAdditionalDetailsFormProps) {
  const colors = usePublicBrandColors()

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
