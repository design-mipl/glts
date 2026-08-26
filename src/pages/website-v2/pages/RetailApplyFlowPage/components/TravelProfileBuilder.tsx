import { Box, Stack, Typography } from '@mui/material'
import { Modal, Button } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { RetailApplicantParty } from '../types'

interface TravelProfileBuilderProps {
  applicant: RetailApplicantParty
  countryName?: string
  onClose: () => void
  onComplete: (patch: Partial<RetailApplicantParty>) => void
}

/**
 * Build profile overlay for one traveller.
 * Profile questions will be added here in follow-up passes.
 */
export function TravelProfileBuilder({
  applicant,
  countryName,
  onClose,
  onComplete,
}: TravelProfileBuilderProps) {
  const colors = usePublicBrandColors()
  const name = applicant.details.fullName.trim() || applicant.label

  return (
    <Modal
      open
      onClose={onClose}
      title={`Build profile — ${name}`}
      size="md"
      footer={
        <Stack direction="row" justifyContent="flex-end" gap={1.5}>
          <Button label="Cancel" variant="outlined" color="secondary" onClick={onClose} />
          <Button
            label="Save profile"
            variant="contained"
            color="primary"
            onClick={() =>
              onComplete({
                profileAnswers: { ...(applicant.profileAnswers ?? {}) },
              })
            }
          />
        </Stack>
      }
    >
      <Box sx={{ textAlign: 'left', py: 1 }}>
        <Typography sx={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.55, mb: 2 }}>
          {countryName
            ? `We’ll collect the details required for ${name}'s ${countryName} visa application.`
            : `We’ll collect the details required for ${name}'s visa application.`}
        </Typography>
        <Box
          sx={{
            border: `1px dashed ${colors.border}`,
            borderRadius: 2,
            bgcolor: colors.surfaceAlt,
            px: 2.5,
            py: 3,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ fontSize: 13, fontWeight: 600, color: colors.navy, mb: 0.75 }}>
            Profile questions coming next
          </Typography>
          <Typography sx={{ fontSize: 13, color: colors.textMuted, lineHeight: 1.5 }}>
            Save for now to mark this traveller’s profile as started. Additional questions will
            appear in this flow.
          </Typography>
        </Box>
      </Box>
    </Modal>
  )
}
