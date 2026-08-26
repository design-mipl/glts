import { useMemo, useState } from 'react'
import { Box, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { Check, Search, Smile, UserRound, Users, X } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import type { RetailApplicantParty } from '../types'
import {
  MARITAL_STATUS_OPTIONS,
  PROFESSION_OPTIONS,
  PROFILE_ANSWER_KEYS,
  TRAVEL_PROFILE_QUESTION_ORDER,
  VISA_REFUSAL_OPTIONS,
  displayNameUpper,
  initialsFromName,
  type TravelProfileOption,
  type TravelProfileQuestionId,
} from '../config/travelProfileQuestions'

/** Soft violet accent from Build-profile UX refs. */
const ACCENT = '#7B6CF0'
const ACCENT_SOFT = 'rgba(123, 108, 240, 0.12)'
const ACCENT_BORDER = 'rgba(123, 108, 240, 0.55)'
const AVATAR_ROSE = '#D4A0A0'

interface TravelProfileBuilderProps {
  applicant: RetailApplicantParty
  countryName?: string
  onClose: () => void
  onComplete: (patch: Partial<RetailApplicantParty>) => void
}

function optionIcon(questionId: TravelProfileQuestionId, optionId: string) {
  if (questionId === 'maritalStatus') {
    if (optionId === 'single') return <UserRound size={20} strokeWidth={1.75} />
    return <Users size={20} strokeWidth={1.75} />
  }
  return <UserRound size={20} strokeWidth={1.75} />
}

function ProfileOptionRow({
  option,
  selected,
  questionId,
  onSelect,
}: {
  option: TravelProfileOption
  selected: boolean
  questionId: TravelProfileQuestionId
  onSelect: () => void
}) {
  const colors = usePublicBrandColors()

  return (
    <Box
      component="button"
      type="button"
      onClick={onSelect}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        width: '100%',
        textAlign: 'left',
        border: `1.5px solid ${selected ? ACCENT_BORDER : colors.border}`,
        bgcolor: selected ? ACCENT_SOFT : colors.white,
        borderRadius: BORDER_RADIUS.lg,
        px: 2,
        py: 1.75,
        cursor: 'pointer',
        transition: 'border-color 0.15s ease, background-color 0.15s ease',
        font: 'inherit',
        color: 'inherit',
        '&:hover': {
          borderColor: selected ? ACCENT_BORDER : 'rgba(15, 23, 42, 0.22)',
        },
      }}
    >
      <Box
        sx={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          border: `1.5px solid ${selected ? ACCENT : 'rgba(15, 23, 42, 0.12)'}`,
          color: selected ? ACCENT : colors.textSecondary,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        {optionIcon(questionId, option.id)}
      </Box>
      <Typography sx={{ flex: 1, fontSize: 15, fontWeight: 500, color: colors.navy }}>
        {option.label}
      </Typography>
      {selected ? (
        <Box sx={{ color: ACCENT, display: 'flex', flexShrink: 0 }}>
          <Check size={20} strokeWidth={2.5} />
        </Box>
      ) : null}
    </Box>
  )
}

/**
 * Full-screen style Build profile questionnaire — profession, marital status, visa refusal.
 */
export function TravelProfileBuilder({
  applicant,
  countryName,
  onClose,
  onComplete,
}: TravelProfileBuilderProps) {
  const colors = usePublicBrandColors()
  const name = applicant.details.fullName.trim() || applicant.label
  const nameUpper = displayNameUpper(name)
  const firstName = name.split(/\s+/)[0] || name

  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(() => ({
    ...(applicant.profileAnswers ?? {}),
  }))
  const [professionQuery, setProfessionQuery] = useState('')

  const questionId = TRAVEL_PROFILE_QUESTION_ORDER[stepIndex] ?? 'profession'
  const destination = countryName?.trim() || 'this destination'

  const filteredProfessions = useMemo(() => {
    const q = professionQuery.trim().toLowerCase()
    if (!q) return PROFESSION_OPTIONS
    return PROFESSION_OPTIONS.filter((option) => option.label.toLowerCase().includes(q))
  }, [professionQuery])

  const title =
    questionId === 'profession'
      ? `What is ${firstName.toUpperCase()}'s profession`
      : questionId === 'maritalStatus'
        ? `What is ${firstName.toUpperCase()}'s marital status?`
        : `Have you ever been refused a visa for ${destination}?`

  const options: TravelProfileOption[] =
    questionId === 'profession'
      ? filteredProfessions
      : questionId === 'maritalStatus'
        ? MARITAL_STATUS_OPTIONS
        : VISA_REFUSAL_OPTIONS

  const answerKey =
    questionId === 'profession'
      ? PROFILE_ANSWER_KEYS.profession
      : questionId === 'maritalStatus'
        ? PROFILE_ANSWER_KEYS.maritalStatus
        : PROFILE_ANSWER_KEYS.visaRefusal

  const selectedId = answers[answerKey]

  const selectOption = (optionId: string) => {
    const next = { ...answers, [answerKey]: optionId }
    setAnswers(next)

    window.setTimeout(() => {
      if (stepIndex < TRAVEL_PROFILE_QUESTION_ORDER.length - 1) {
        setStepIndex((index) => index + 1)
        return
      }
      onComplete({
        profileAnswers: next,
        profileComplete: true,
      })
    }, 180)
  }

  return (
    <Modal
      open
      onClose={onClose}
      size="lg"
      hideCloseButton
      sx={{
        minHeight: { sm: 640 },
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 2.5 },
        },
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
          <Stack direction="row" alignItems="center" spacing={1} sx={{ minWidth: 0, flex: 1, pr: 1 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                bgcolor: AVATAR_ROSE,
                color: '#fff',
                fontSize: 11,
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              {initialsFromName(name).slice(0, 1)}
            </Box>
            <Typography sx={{ fontSize: 13, color: colors.textMuted, minWidth: 0 }}>
              Updating for{' '}
              <Box component="span" sx={{ fontWeight: 700, color: colors.navy }}>
                {nameUpper}
              </Box>
            </Typography>
          </Stack>

          <IconButton
            aria-label="Close"
            onClick={onClose}
            size="small"
            sx={{
              bgcolor: 'rgba(15, 169, 104, 0.12)',
              color: colors.navy,
              flexShrink: 0,
              '&:hover': { bgcolor: 'rgba(15, 169, 104, 0.2)' },
            }}
          >
            <X size={16} />
          </IconButton>
        </Stack>

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1 }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: 999,
              bgcolor: ACCENT_SOFT,
              color: ACCENT,
            }}
          >
            <Smile size={14} strokeWidth={2} />
            <Typography sx={{ fontSize: 12, fontWeight: 600, color: ACCENT }}>Build profile</Typography>
          </Box>
        </Box>

        <Box sx={{ textAlign: 'center', mt: { xs: 2, sm: 3.5 }, mb: 2.5, px: 1 }}>
          <Typography
            sx={{
              fontSize: { xs: 22, sm: 26 },
              fontWeight: 700,
              color: colors.navy,
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: colors.textMuted }}>
            Documents required vary basis persona
          </Typography>
        </Box>

        {questionId === 'profession' ? (
          <TextField
            value={professionQuery}
            onChange={(event) => setProfessionQuery(event.target.value)}
            placeholder="Search..."
            fullWidth
            size="small"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search size={16} color={colors.textMuted} />
                </InputAdornment>
              ),
            }}
            sx={{
              mb: 2,
              maxWidth: 520,
              mx: 'auto',
              width: '100%',
              '& .MuiOutlinedInput-root': {
                borderRadius: BORDER_RADIUS.lg,
                bgcolor: colors.white,
                fontSize: 14,
              },
            }}
          />
        ) : null}

        <Stack
          spacing={1.25}
          sx={{
            width: '100%',
            maxWidth: 520,
            mx: 'auto',
            flex: 1,
            minHeight: 0,
            overflowY: questionId === 'profession' ? 'auto' : 'visible',
            pr: questionId === 'profession' ? 0.5 : 0,
            pb: 1,
          }}
        >
          {options.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: colors.textMuted, fontSize: 13, py: 3 }}>
              No professions match your search
            </Typography>
          ) : (
            options.map((option) => (
              <ProfileOptionRow
                key={option.id}
                option={option}
                questionId={questionId}
                selected={selectedId === option.id}
                onSelect={() => selectOption(option.id)}
              />
            ))
          )}
        </Stack>
      </Box>
    </Modal>
  )
}
