import { useState, type ChangeEvent } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Check, Plus, Trash2, UserRound } from 'lucide-react'
import { Button, IconButton } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { retailProfileCardGradient } from '@/pages/website-v2/theme/retailFlowTokens'
import { StepShell } from '../StepShell'
import { TravelProfileBuilder } from '../TravelProfileBuilder'
import {
  displayNameUpper,
  initialsFromName,
  profileAnswerTags,
} from '../../config/travelProfileQuestions'
import type { RetailApplicantParty } from '../../types'

const AVATAR_TONES = ['#D4A0A0', '#0D9488', '#B45309', '#4F46E5', '#0891B2'] as const

const CARD_LAYOUT_TRANSITION = { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const }

interface TravelProfileStepProps {
  countryName?: string
  applicants: RetailApplicantParty[]
  onUpdateApplicant: (id: string, patch: Partial<RetailApplicantParty>) => void
  onAddTraveller: () => void
  onRemoveTraveller: (id: string) => void
  onBack: () => void
  onContinue: () => void
}

function displayName(applicant: RetailApplicantParty, index: number): string {
  const name = applicant.details.fullName.trim()
  if (name) return name
  return index === 0 ? 'Traveller 1' : applicant.label
}

function applicantReady(applicant: RetailApplicantParty): boolean {
  return Boolean(applicant.details.fullName.trim() && applicant.profileComplete)
}

function TravellerProfileCard({
  applicant,
  index,
  onUpdate,
  onRemove,
  onOpenBuilder,
}: {
  applicant: RetailApplicantParty
  index: number
  onUpdate: (patch: Partial<RetailApplicantParty>) => void
  onRemove?: () => void
  onOpenBuilder: () => void
}) {
  const colors = usePublicBrandColors()
  const tone = AVATAR_TONES[index % AVATAR_TONES.length]
  const name = applicant.details.fullName
  const trimmed = name.trim()
  const complete = Boolean(applicant.profileComplete && trimmed)
  const tags = profileAnswerTags(applicant.profileAnswers)
  const initials = initialsFromName(trimmed)
  const nameUpper = trimmed ? displayNameUpper(trimmed) : ''

  const commitNameAndBuild = () => {
    if (!trimmed) return
    onOpenBuilder()
  }

  if (complete && tags.length > 0) {
    return (
      <Box
        component={motion.div}
        layout
        initial={{ opacity: 0, x: 36, scale: 0.96 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 24, scale: 0.96 }}
        transition={CARD_LAYOUT_TRANSITION}
        sx={{
          border: `1px solid ${colors.border}`,
          borderRadius: 4,
          bgcolor: colors.white,
          backgroundImage: retailProfileCardGradient,
          p: 1.75,
          maxWidth: 180,
          width: '100%',
          mx: 'auto',
          minHeight: 210,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {onRemove ? (
          <IconButton
            size="sm"
            variant="soft"
            color="error"
            tooltip={`Remove ${displayName(applicant, index)}`}
            icon={<Trash2 size={14} />}
            onClick={onRemove}
            sx={{ position: 'absolute', top: 6, right: 6, zIndex: 1 }}
          />
        ) : null}

        <Stack alignItems="center" spacing={0.75} sx={{ mb: 1, width: '100%', pr: onRemove ? 3.5 : 0 }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: '50%',
              bgcolor: tone,
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            {initials}
          </Box>
          <Typography
            sx={{
              fontWeight: 700,
              fontSize: 13,
              color: colors.navy,
              letterSpacing: '0.04em',
              lineHeight: 1.3,
              textAlign: 'center',
              width: '100%',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {nameUpper}
          </Typography>
        </Stack>

        <Box
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            justifyContent: 'center',
            gap: 0.5,
            pt: 1.5,
          }}
        >
          {tags.map((tag) => (
            <Box
              key={tag}
              component="span"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                px: 0.9,
                py: 0.55,
                borderRadius: 999,
                bgcolor: colors.greenMuted,
                border: `1px solid ${colors.border}`,
                fontSize: 11,
                fontWeight: 600,
                color: colors.navy,
                lineHeight: 1.2,
              }}
            >
              {tag}
            </Box>
          ))}
        </Box>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 'auto', pt: 1.25 }}>
          <Box
            sx={{
              width: 26,
              height: 26,
              borderRadius: '50%',
              bgcolor: '#0FA968',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label="Profile complete"
          >
            <Check size={14} strokeWidth={2.75} />
          </Box>
          <Button label="Edit" variant="outlined" color="secondary" size="sm" onClick={onOpenBuilder} />
        </Stack>
      </Box>
    )
  }

  return (
    <Box
      component={motion.div}
      layout
      initial={{ opacity: 0, x: 36, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 24, scale: 0.96 }}
      transition={CARD_LAYOUT_TRANSITION}
      sx={{
        border: `1px solid ${colors.border}`,
        borderRadius: 4,
        bgcolor: colors.white,
        backgroundImage: retailProfileCardGradient,
        p: 2,
        maxWidth: 180,
        width: '100%',
        mx: 'auto',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: 210,
      }}
    >
      {onRemove ? (
        <IconButton
          size="sm"
          variant="soft"
          color="error"
          tooltip={`Remove ${displayName(applicant, index)}`}
          icon={<Trash2 size={14} />}
          onClick={onRemove}
          sx={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}
        />
      ) : null}

      <Box
        sx={{
          width: 48,
          height: 48,
          borderRadius: '50%',
          bgcolor: tone,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 16,
          fontWeight: 700,
          mt: 0.25,
          mb: 0.75,
        }}
      >
        {trimmed ? initialsFromName(trimmed) : <UserRound size={20} strokeWidth={1.75} />}
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: 13,
          color: trimmed ? colors.navy : colors.textMuted,
          letterSpacing: '0.06em',
          textAlign: 'center',
        }}
      >
        {nameUpper || 'ADD NAME'}
      </Typography>

      <Box
        component="form"
        sx={{ width: '100%', mt: 'auto', pt: 1.5 }}
        onSubmit={(event) => {
          event.preventDefault()
          commitNameAndBuild()
        }}
      >
        <Box
          sx={{
            border: `1px solid ${colors.border}`,
            borderRadius: 2,
            px: 1.5,
            pt: 1,
            pb: 1.1,
            bgcolor: colors.white,
            textAlign: 'left',
          }}
        >
          <Typography
            component="label"
            htmlFor={`traveller-name-${applicant.id}`}
            sx={{
              display: 'block',
              fontSize: 11,
              fontWeight: 600,
              color: colors.textMuted,
              mb: 0.35,
            }}
          >
            Name
          </Typography>
          <Box
            component="input"
            id={`traveller-name-${applicant.id}`}
            value={name}
            placeholder="Traveller name"
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onUpdate({
                details: { ...applicant.details, fullName: event.target.value },
                label: index === 0 ? applicant.label : event.target.value.trim() || `Traveller ${index + 1}`,
                profileComplete: event.target.value.trim() ? applicant.profileComplete : false,
              })
            }
            sx={{
              width: '100%',
              border: 'none',
              outline: 'none',
              bgcolor: 'transparent',
              font: 'inherit',
              fontSize: 15,
              fontWeight: 700,
              color: colors.navy,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              p: 0,
              '&::placeholder': {
                color: colors.textMuted,
                fontWeight: 500,
                letterSpacing: 0,
                textTransform: 'none',
              },
            }}
          />
        </Box>
        <Button
          type="submit"
          label={applicant.profileComplete ? 'Edit profile' : 'Build profile'}
          variant="soft"
          color="primary"
          fullWidth
          sx={{ mt: 1.5 }}
          disabled={!trimmed}
        />
      </Box>
    </Box>
  )
}

/** Travel profile — name each traveller, then Build profile questionnaire. */
export function TravelProfileStep({
  countryName,
  applicants,
  onUpdateApplicant,
  onAddTraveller,
  onRemoveTraveller,
  onBack,
  onContinue,
}: TravelProfileStepProps) {
  const [buildingApplicantId, setBuildingApplicantId] = useState<string | null>(null)
  const allReady = applicants.every(applicantReady)
  const buildingApplicant = buildingApplicantId
    ? applicants.find((applicant) => applicant.id === buildingApplicantId)
    : undefined

  return (
    <>
      <StepShell
        title="Travel profile"
        helperText={
          countryName
            ? `Add each traveller and build their profile as per the official ${countryName} embassy requirements.`
            : 'Add each traveller and build their profile as per the official embassy requirements.'
        }
        onBack={onBack}
        backLabel="Back"
        onContinue={onContinue}
        continueLabel="Continue"
        continueDisabled={!allReady}
        contentMaxWidth={980}
        footerEndAction={
          <Button
            label="Add travelers"
            variant="soft"
            color="primary"
            startIcon={<Plus size={16} />}
            onClick={onAddTraveller}
          />
        }
      >
        <LayoutGroup>
          <Box
            component={motion.div}
            layout
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: applicants.length === 1 ? 'minmax(0, 180px)' : 'repeat(2, minmax(0, 180px))',
              md:
                applicants.length === 1
                  ? 'minmax(0, 180px)'
                  : applicants.length === 2
                    ? 'repeat(2, minmax(0, 180px))'
                    : 'repeat(3, minmax(0, 180px))',
              },
              gap: 2,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {applicants.map((applicant, index) => (
                <TravellerProfileCard
                  key={applicant.id}
                  applicant={applicant}
                  index={index}
                  onUpdate={(patch) => onUpdateApplicant(applicant.id, patch)}
                  onRemove={index > 0 ? () => onRemoveTraveller(applicant.id) : undefined}
                  onOpenBuilder={() => setBuildingApplicantId(applicant.id)}
                />
              ))}
            </AnimatePresence>
          </Box>
        </LayoutGroup>
      </StepShell>

      {buildingApplicant ? (
        <TravelProfileBuilder
          applicant={buildingApplicant}
          countryName={countryName}
          onClose={() => setBuildingApplicantId(null)}
          onComplete={(patch) => {
            onUpdateApplicant(buildingApplicant.id, {
              ...patch,
              profileComplete: true,
            })
            setBuildingApplicantId(null)
          }}
        />
      ) : null}
    </>
  )
}
