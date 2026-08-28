import { useMemo, useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowLeft, Check, Search, X } from 'lucide-react'
import { Modal } from '@/design-system/UIComponents'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  getSelectableSx,
  tabularNums,
} from '@/pages/website-v2/theme/applyFlowTheme'
import type { RetailApplicantParty } from '../types'
import {
  MARITAL_STATUS_OPTIONS,
  PROFESSION_OPTIONS,
  PROFILE_ANSWER_KEYS,
  TRAVEL_PROFILE_QUESTION_ORDER,
  VISA_REFUSAL_OPTIONS,
  displayNameUpper,
  type TravelProfileOption,
} from '../config/travelProfileQuestions'

interface TravelProfileBuilderProps {
  applicant: RetailApplicantParty
  countryName?: string
  onClose: () => void
  onComplete: (patch: Partial<RetailApplicantParty>) => void
}

/**
 * Build-profile questionnaire.
 *
 * Rewritten from a fixed-height violet-accented dialog. Three things changed and each
 * was a defect, not a preference:
 *   - The accent was `#7B6CF0`, an off-brand violet — the "purple AI gradient" look the
 *     V2 brief explicitly rules out. Selection now uses the flow's gold.
 *   - The avatar chip used a hard-coded rose; per-person colour is the flagged
 *     rainbow-avatar pattern. Identity is carried by the name, which is enough here.
 *   - Height was pinned to 520px, so the profession list (60+ entries) overflowed on
 *     short viewports. It's now viewport-relative with only the list scrolling.
 *
 * Also adds a question counter and a Back control — the old version gave no sense of how
 * many questions remained and no way to revise an answer.
 */
export function TravelProfileBuilder({
  applicant,
  countryName,
  onClose,
  onComplete,
}: TravelProfileBuilderProps) {
  const name = applicant.details.fullName.trim() || applicant.label
  const nameUpper = displayNameUpper(name)
  const firstName = name.split(/\s+/)[0] || name

  const [stepIndex, setStepIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>(() => ({
    ...(applicant.profileAnswers ?? {}),
  }))
  const [professionQuery, setProfessionQuery] = useState('')

  const total = TRAVEL_PROFILE_QUESTION_ORDER.length
  const questionId = TRAVEL_PROFILE_QUESTION_ORDER[stepIndex] ?? 'profession'
  const destination = countryName?.trim() || 'this destination'

  const filteredProfessions = useMemo(() => {
    const q = professionQuery.trim().toLowerCase()
    if (!q) return PROFESSION_OPTIONS
    return PROFESSION_OPTIONS.filter((option) => option.label.toLowerCase().includes(q))
  }, [professionQuery])

  const title =
    questionId === 'profession'
      ? `What does ${firstName} do?`
      : questionId === 'maritalStatus'
        ? `What is ${firstName}'s marital status?`
        : `Has ${firstName} ever been refused a visa for ${destination}?`

  const helper =
    questionId === 'profession'
      ? 'Required documents change with profession.'
      : questionId === 'maritalStatus'
        ? 'Some embassies ask for spouse or family documents.'
        : 'A previous refusal usually means extra supporting documents.'

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
    // Brief hold so the selection is visible before the question changes.
    window.setTimeout(() => {
      if (stepIndex < total - 1) {
        setStepIndex((index) => index + 1)
        setProfessionQuery('')
        return
      }
      onComplete({ profileAnswers: next, profileComplete: true })
    }, 170)
  }

  const iconBtnSx = {
    width: 34,
    height: 34,
    display: 'grid',
    placeItems: 'center',
    appearance: 'none',
    border: `1px solid ${applyFlow.hairline}`,
    background: 'none',
    borderRadius: applyRadius.control,
    color: applyFlow.inkMuted,
    cursor: 'pointer',
    flex: '0 0 auto',
    transition: `color 150ms ${applyMotion.easeOut}, border-color 150ms ${applyMotion.easeOut}`,
    '@media (pointer: coarse)': { width: 44, height: 44 },
    '@media (hover: hover) and (pointer: fine)': {
      '&:hover': { color: applyFlow.ink, borderColor: applyFlow.hairlineStrong },
    },
    '&:focus-visible': {
      outline: 'none',
      borderColor: applyFlow.accent,
      boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
    },
  } as const

  return (
    <Modal
      open
      onClose={onClose}
      size="sm"
      hideCloseButton
      sx={{
        width: { xs: '100%', sm: 460 },
        // Viewport-relative, not a fixed 520px — only the option list scrolls.
        height: { xs: '100%', sm: 'auto' },
        maxHeight: { xs: '100%', sm: 'min(560px, 88vh)' },
        '& .MuiDialogContent-root': {
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          px: { xs: 4, sm: 5 },
          py: { xs: 4, sm: 4.5 },
        },
      }}
    >
      <Box sx={{ width: '100%', flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Header — who, how far along, and a way out. */}
        <Stack direction="row" alignItems="center" spacing={2.5} sx={{ flexShrink: 0, mb: 3.5 }}>
          {stepIndex > 0 ? (
            <Box
              component="button"
              type="button"
              aria-label="Previous question"
              onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
              sx={iconBtnSx}
            >
              <ArrowLeft size={15} />
            </Box>
          ) : null}

          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                ...tabularNums,
                fontFamily: applyFont.mono,
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: applyFlow.inkFaint,
              }}
            >
              Build profile · {String(stepIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </Typography>
            <Typography
              sx={{
                fontFamily: applyFont.body,
                fontSize: 13,
                fontWeight: 600,
                color: applyFlow.ink,
                mt: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {nameUpper}
            </Typography>
          </Box>

          <Box component="button" type="button" aria-label="Close" onClick={onClose} sx={iconBtnSx}>
            <X size={15} />
          </Box>
        </Stack>

        {/* Progress — one segment per question. */}
        <Box sx={{ display: 'flex', gap: 1, flexShrink: 0, mb: 4 }} aria-hidden>
          {TRAVEL_PROFILE_QUESTION_ORDER.map((q, i) => (
            <Box
              key={q}
              sx={{
                flex: 1,
                height: '2px',
                borderRadius: '1px',
                backgroundColor: i <= stepIndex ? applyFlow.accent : applyFlow.accentTrack,
                transition: `background-color 220ms ${applyMotion.easeOut}`,
              }}
            />
          ))}
        </Box>

        <AnimatePresence mode="wait">
          <motion.div
            key={questionId}
            initial={{ opacity: 0, x: 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -14 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}
          >
            <Box sx={{ flexShrink: 0, mb: 3 }}>
              <Typography
                sx={{
                  fontFamily: applyFont.display,
                  fontSize: 19,
                  fontWeight: 700,
                  letterSpacing: '-0.02em',
                  lineHeight: 1.2,
                  color: applyFlow.ink,
                }}
              >
                {title}
              </Typography>
              <Typography
                sx={{
                  fontFamily: applyFont.body,
                  fontSize: 13,
                  color: applyFlow.inkMuted,
                  mt: 1.25,
                  lineHeight: 1.45,
                }}
              >
                {helper}
              </Typography>
            </Box>

            {questionId === 'profession' ? (
              <Box
                sx={{
                  flexShrink: 0,
                  mb: 2.5,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  px: 2.75,
                  minHeight: 42,
                  border: `1px solid ${applyFlow.hairline}`,
                  borderRadius: applyRadius.control,
                  '&:focus-within': {
                    borderColor: applyFlow.accent,
                    boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
                  },
                }}
              >
                <Search size={15} style={{ color: applyFlow.inkFaint, flex: '0 0 auto' }} />
                <Box
                  component="input"
                  value={professionQuery}
                  placeholder="Search professions"
                  aria-label="Search professions"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfessionQuery(e.target.value)}
                  sx={{
                    flex: 1,
                    minWidth: 0,
                    border: 'none',
                    outline: 'none',
                    background: 'transparent',
                    fontFamily: applyFont.body,
                    fontSize: 14,
                    color: applyFlow.ink,
                    '&::placeholder': { color: applyFlow.inkFaint },
                  }}
                />
              </Box>
            ) : null}

            <Stack
              spacing={1}
              role="radiogroup"
              aria-label={title}
              sx={{
                width: '100%',
                flex: 1,
                minHeight: 0,
                overflowY: 'auto',
                pr: 1,
                scrollbarWidth: 'thin',
                scrollbarColor: `${applyFlow.hairlineStrong} transparent`,
              }}
            >
              {options.length === 0 ? (
                <Typography
                  sx={{
                    textAlign: 'center',
                    color: applyFlow.inkMuted,
                    fontFamily: applyFont.body,
                    fontSize: 13,
                    py: 6,
                  }}
                >
                  No professions match “{professionQuery}”.
                </Typography>
              ) : (
                options.map((option) => {
                  const selected = selectedId === option.id
                  return (
                    <Box
                      key={option.id}
                      component="button"
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      onClick={() => selectOption(option.id)}
                      sx={{
                        ...getSelectableSx(selected),
                        display: 'flex',
                        alignItems: 'center',
                        gap: 2.5,
                        minHeight: 44,
                        pl: 3.5,
                        pr: 3,
                        py: 2,
                      }}
                    >
                      <Typography
                        sx={{
                          flex: 1,
                          fontFamily: applyFont.body,
                          fontSize: 14,
                          fontWeight: selected ? 600 : 400,
                          color: applyFlow.ink,
                          lineHeight: 1.35,
                          textAlign: 'left',
                        }}
                      >
                        {option.label}
                      </Typography>
                      {selected ? (
                        <Check
                          size={14}
                          strokeWidth={3}
                          style={{ color: applyFlow.accentInk, flex: '0 0 auto' }}
                        />
                      ) : null}
                    </Box>
                  )
                })
              )}
            </Stack>
          </motion.div>
        </AnimatePresence>
      </Box>
    </Modal>
  )
}
