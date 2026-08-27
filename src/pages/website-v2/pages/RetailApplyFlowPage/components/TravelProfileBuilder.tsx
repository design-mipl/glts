import { useMemo, useState } from 'react'
import { Box, IconButton, InputAdornment, Stack, TextField, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Search, Smile, UserRound, Users, X } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { retailFlowEaseOut } from '@/pages/website-v2/theme/retailFlowTokens'
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
    if (optionId === 'single') return <UserRound size={14} strokeWidth={1.75} />
    return <Users size={14} strokeWidth={1.75} />
  }
  return <UserRound size={14} strokeWidth={1.75} />
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
        gap: 1,
        width: '100%',
        minHeight: 36,
        textAlign: 'left',
        border: `1.5px solid ${selected ? ACCENT_BORDER : colors.border}`,
        bgcolor: selected ? ACCENT_SOFT : colors.white,
        borderRadius: BORDER_RADIUS.md,
        px: 1.25,
        py: 0.5,
        cursor: 'pointer',
        transition: `border-color 150ms ${retailFlowEaseOut}, background-color 150ms ${retailFlowEaseOut}, transform 160ms ${retailFlowEaseOut}`,
        font: 'inherit',
        color: 'inherit',
        '&:hover': {
          borderColor: selected ? ACCENT_BORDER : 'rgba(15, 23, 42, 0.22)',
        },
        '&:active': { transform: 'scale(0.98)' },
      }}
    >
      <Box
        sx={{
          width: 24,
          height: 24,
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
      <Typography sx={{ flex: 1, fontSize: 13, fontWeight: 500, color: colors.navy, lineHeight: 1.3 }}>
        {option.label}
      </Typography>
      {selected ? (
        <Box sx={{ color: ACCENT, display: 'flex', flexShrink: 0 }}>
          <Check size={14} strokeWidth={2.5} />
        </Box>
      ) : null}
    </Box>
  )
}

/**
 * Compact Build profile questionnaire — profession, marital status, visa refusal.
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
      size="sm"
      hideCloseButton
      sx={{
        width: { sm: 480 },
        height: { xs: '100%', sm: 520 },
        minHeight: { sm: 520 },
        maxHeight: { sm: 520 },
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          px: { xs: 2, sm: 2.5 },
          py: { xs: 1.5, sm: 2 },
        },
      }}
    >
      <Box sx={{ position: 'relative', width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1, flexShrink: 0 }}>
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

        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 1, flexShrink: 0 }}>
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

        <AnimatePresence mode="wait">
          <motion.div
            key={questionId}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
          >
            <Box sx={{ textAlign: 'center', mt: { xs: 1, sm: 1.5 }, mb: 1.5, px: 1, flexShrink: 0 }}>
              <Typography
                sx={{
                  fontSize: { xs: 17, sm: 18 },
                  fontWeight: 700,
                  color: colors.navy,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.3,
                  mb: 0.5,
                }}
              >
                {title}
              </Typography>
              <Typography sx={{ fontSize: 12, color: colors.textMuted }}>
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
                  mb: 1.25,
                  maxWidth: 400,
                  mx: 'auto',
                  width: '100%',
                  flexShrink: 0,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: BORDER_RADIUS.md,
                    bgcolor: colors.white,
                    fontSize: 13,
                    height: 36,
                  },
                }}
              />
            ) : null}

            <Stack
              spacing={0.75}
              sx={{
                width: '100%',
                maxWidth: 400,
                mx: 'auto',
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                pr: 0.5,
                pb: 0.5,
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': {
                  bgcolor: 'rgba(15, 23, 42, 0.16)',
                  borderRadius: 8,
                },
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
          </motion.div>
        </AnimatePresence>
      </Box>
    </Modal>
  )
}
