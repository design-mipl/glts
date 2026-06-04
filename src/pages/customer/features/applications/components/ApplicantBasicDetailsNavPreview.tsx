import { Box, Typography } from '@mui/material'
import { Check, Circle } from 'lucide-react'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { requiresFieldValidation, useApplicationFlowPolicy } from '../context/ApplicationFlowPolicyContext'
import {
  BASIC_DETAIL_REQUIRED_KEYS,
  type ApplicantBasicDetails,
} from '../config/applicantBasicDetailsConfig'

const FIELD_LABELS: Record<(typeof BASIC_DETAIL_REQUIRED_KEYS)[number], string> = {
  applicantName: 'Applicant name',
  passportNumber: 'Passport number',
  nationality: 'Nationality',
  dateOfBirth: 'Date of birth',
}

function isFilled(value: string): boolean {
  const t = value.trim()
  return t.length > 0 && t !== '—'
}

interface ApplicantBasicDetailsNavPreviewProps {
  details: ApplicantBasicDetails
}

export function ApplicantBasicDetailsNavPreview({ details }: ApplicantBasicDetailsNavPreviewProps) {
  const colors = usePublicBrandColors()

  return (
    <Box component="ul" sx={{ listStyle: 'none', m: 0, p: 1.25, pt: 1 }}>
      {BASIC_DETAIL_REQUIRED_KEYS.map(key => {
        const done = isFilled(details[key])
        return (
          <Box
            component="li"
            key={key}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              py: 0.625,
            }}
          >
            {done ? (
              <Check size={14} color={colors.greenDark} aria-hidden />
            ) : (
              <Circle size={14} color={colors.textMuted} aria-hidden />
            )}
            <Typography
              sx={{
                fontSize: 12,
                fontWeight: done ? 600 : 500,
                color: done ? colors.navy : colors.textSecondary,
              }}
            >
              {FIELD_LABELS[key]}
            </Typography>
          </Box>
        )
      })}
      {details.crewId.trim() ? (
        <Typography sx={{ fontSize: 11, color: colors.textMuted, mt: 0.5, pl: 2.75 }}>
          Crew ID · {details.crewId}
        </Typography>
      ) : null}
    </Box>
  )
}

export function ApplicantBasicDetailsCollapsedHint({ details }: ApplicantBasicDetailsNavPreviewProps) {
  const colors = usePublicBrandColors()
  const { policy } = useApplicationFlowPolicy()
  const strict = requiresFieldValidation(policy)
  const name = details.applicantName.trim()
  const passport = details.passportNumber.trim()

  if (name && passport) {
    return (
      <Typography sx={{ fontSize: 11.5, color: colors.textSecondary, lineHeight: 1.4 }} noWrap>
        {name} · {passport}
      </Typography>
    )
  }

  if (!strict) {
    return (
      <Typography sx={{ fontSize: 11.5, color: colors.textMuted }}>
        Basic details optional
      </Typography>
    )
  }

  const complete = BASIC_DETAIL_REQUIRED_KEYS.filter(k => isFilled(details[k])).length
  return (
    <Typography sx={{ fontSize: 11.5, color: colors.textMuted }}>
      {complete} of {BASIC_DETAIL_REQUIRED_KEYS.length} required fields filled
    </Typography>
  )
}
