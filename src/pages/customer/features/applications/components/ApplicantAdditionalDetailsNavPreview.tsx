import { Box, Typography } from '@mui/material'
import { Check, Circle } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import {
  APPLICANT_ADDITIONAL_DETAIL_SECTIONS,
  type ApplicantAdditionalDetails,
} from '../config/applicantAdditionalDetailsConfig'

function sectionHasValues(
  sectionId: string,
  details: ApplicantAdditionalDetails,
): boolean {
  const section = APPLICANT_ADDITIONAL_DETAIL_SECTIONS.find(s => s.id === sectionId)
  if (!section) return false
  return section.fields.some(f => details[f.key].trim().length > 0)
}

interface ApplicantAdditionalDetailsNavPreviewProps {
  details: ApplicantAdditionalDetails
}

export function ApplicantAdditionalDetailsNavPreview({
  details,
}: ApplicantAdditionalDetailsNavPreviewProps) {
  const colors = usePublicBrandColors()

  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 1.25, pt: 1 }}>
      {APPLICANT_ADDITIONAL_DETAIL_SECTIONS.map(section => {
        const started = sectionHasValues(section.id, details)
        return (
          <Box
            component="li"
            key={section.id}
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 1,
              py: 0.625,
            }}
          >
            {started ? (
              <Check size={14} color={colors.greenDark} aria-hidden style={{ marginTop: 2 }} />
            ) : (
              <Circle size={14} color={colors.textMuted} aria-hidden style={{ marginTop: 2 }} />
            )}
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: started ? 600 : 500,
                color: started ? colors.navy : colors.textSecondary,
                lineHeight: 1.35,
              }}
            >
              {section.title}
            </Typography>
          </Box>
        )
      })}
    </Box>
  )
}

export function ApplicantAdditionalDetailsCollapsedHint({
  details,
}: ApplicantAdditionalDetailsNavPreviewProps) {
  const colors = usePublicBrandColors()
  const startedSections = APPLICANT_ADDITIONAL_DETAIL_SECTIONS.filter(s =>
    sectionHasValues(s.id, details),
  ).length
  const total = APPLICANT_ADDITIONAL_DETAIL_SECTIONS.length

  return (
    <Typography sx={{ fontSize: 11.5, color: colors.textMuted, lineHeight: 1.4 }}>
      {startedSections > 0
        ? `${startedSections} of ${total} sections started · optional`
        : `${total} optional sections · Excel import available`}
    </Typography>
  )
}
