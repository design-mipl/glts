import { useEffect, useState } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { RefreshCw } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { ExtractedFieldsReview } from '@/pages/customer/features/applications/components/ExtractedFieldsReview'
import {
  singleExtractedFields,
  type ExtractedField,
} from '@/pages/customer/features/applications/data/applicationFlowData'
import { StepShell } from '../StepShell'
import type { RetailCapturedImage, RetailTravellerDetails } from '../../types'

interface ConfirmStepProps {
  passport?: RetailCapturedImage
  passportFields?: ExtractedField[]
  onFieldsChange: (fields: ExtractedField[]) => void
  onConfirmTraveller: (traveller: Partial<RetailTravellerDetails>) => void
  onReupload: () => void
  onBack: () => void
  onContinue: () => void
}

function fieldsToTraveller(fields: ExtractedField[]): Partial<RetailTravellerDetails> {
  const get = (key: string) => fields.find((field) => field.key === key)?.value?.trim() ?? ''
  const surname = get('surname')
  const given = get('given')
  return {
    fullName: [given, surname].filter(Boolean).join(' ').trim(),
    passportNumber: get('docNo'),
    dateOfBirth: get('dob'),
    nationality: get('issuer'),
  }
}

/** OCR review after passport upload — mirrors customer OcrExtractionStep. */
export function ConfirmStep({
  passport,
  passportFields,
  onFieldsChange,
  onConfirmTraveller,
  onReupload,
  onBack,
  onContinue,
}: ConfirmStepProps) {
  const colors = usePublicBrandColors()
  const [fields, setFields] = useState<ExtractedField[]>(
    () => passportFields?.length ? passportFields : singleExtractedFields.map((field) => ({ ...field })),
  )

  useEffect(() => {
    if (passportFields?.length) setFields(passportFields)
  }, [passportFields])

  function handleFieldChange(key: string, value: string) {
    setFields((prev) => {
      const next = prev.map((field) => (field.key === key ? { ...field, value } : field))
      onFieldsChange(next)
      return next
    })
  }

  function handleContinue() {
    onFieldsChange(fields)
    onConfirmTraveller(fieldsToTraveller(fields))
    onContinue()
  }

  return (
    <StepShell
      title="Confirm passport details"
      helperText="Review the extracted fields. Edit anything that looks wrong before continuing."
      onBack={onBack}
      onContinue={handleContinue}
      continueLabel="Confirm information"
      continueDisabled={!passport}
      contentMaxWidth={880}
    >
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '280px 1fr' },
          gap: 2.5,
          textAlign: 'left',
        }}
      >
        <Box>
          <Typography
            sx={{
              fontSize: 11,
              fontWeight: 700,
              color: colors.textMuted,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              mb: 1,
            }}
          >
            Passport preview
          </Typography>
          {passport ? (
            <Box
              component="img"
              src={passport.dataUrl}
              alt="Passport"
              sx={{
                width: '100%',
                borderRadius: BORDER_RADIUS.lg,
                border: `1px solid ${colors.border}`,
                objectFit: 'contain',
                bgcolor: colors.surfaceAlt,
                maxHeight: 280,
              }}
            />
          ) : (
            <Box
              sx={{
                height: 180,
                borderRadius: BORDER_RADIUS.lg,
                border: `1px dashed ${colors.border}`,
                bgcolor: colors.surfaceAlt,
              }}
            />
          )}
          <Button
            size="small"
            startIcon={<RefreshCw size={14} />}
            onClick={onReupload}
            sx={{ mt: 1.5, textTransform: 'none', fontSize: 12 }}
          >
            Re-upload passport
          </Button>
        </Box>

        <Box>
          <ExtractedFieldsReview
            title="Extracted information"
            fields={fields}
            onFieldChange={handleFieldChange}
          />
          <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
            <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
              Values sync into traveller identity when you confirm.
            </Typography>
          </Stack>
        </Box>
      </Box>
    </StepShell>
  )
}
