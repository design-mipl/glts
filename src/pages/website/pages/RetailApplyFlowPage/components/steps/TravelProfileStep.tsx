import { useState, type ChangeEvent } from 'react'
import { Box, Button, Stack, Typography } from '@mui/material'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Plus, X } from 'lucide-react'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  getAccentButtonSx,
  getQuietButtonSx,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
import {
  FieldLabel,
  SectionHeading,
  StatusPill,
  applyControlSx,
} from '@/pages/website/theme/applyFormControls'
import { StepShell } from '../StepShell'
import { TravelProfileBuilder } from '../TravelProfileBuilder'
import { initialsFromName, profileAnswerTags } from '../../config/travelProfileQuestions'
import type { RetailApplicantParty } from '../../types'

interface TravelProfileStepProps {
  countryName?: string
  applicants: RetailApplicantParty[]
  onUpdateApplicant: (id: string, patch: Partial<RetailApplicantParty>) => void
  onAddTraveller: () => void
  onRemoveTraveller: (id: string) => void
  onBack: () => void
  onContinue: () => void
}

function applicantReady(applicant: RetailApplicantParty): boolean {
  return Boolean(applicant.details.fullName.trim() && applicant.profileComplete)
}

const ROW_TRANSITION = { duration: 0.2, ease: [0.23, 1, 0.32, 1] as const }

/**
 * One traveller = one titled block.
 *
 * The previous version was a bare hairline row whose only input was an unlabelled
 * borderless name field, so it read as a caption rather than something to fill in — people
 * could not tell where the name went, or which block belonged to whom. Each traveller now
 * carries an explicit "TRAVELLER 01" header and a labelled, required Full name control, and
 * blocks are boxed so a party of six stays attributable when scrolled.
 */
function TravellerRow({
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
  const name = applicant.details.fullName
  const trimmed = name.trim()
  const complete = Boolean(applicant.profileComplete && trimmed)
  const tags = profileAnswerTags(applicant.profileAnswers)

  return (
    <Box
      component={motion.div}
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -4 }}
      transition={ROW_TRANSITION}
      sx={{
        borderRadius: applyRadius.card,
        border: `1px solid ${complete ? applyFlow.successBorder : applyFlow.hairline}`,
        backgroundColor: applyFlow.surface,
        px: { xs: 2.75, sm: 3 },
        py: 2.75,
        mb: 2,
        transition: `border-color 200ms ${applyMotion.easeOut}`,
      }}
    >
      {/* Whose block this is — stated, not implied by position. */}
      <Stack direction="row" alignItems="center" spacing={2.5} sx={{ mb: 2.25 }}>
        <Box
          aria-hidden
          sx={{
            position: 'relative',
            width: 28,
            height: 28,
            flex: '0 0 auto',
            display: 'grid',
            placeItems: 'center',
            borderRadius: applyRadius.chip,
            backgroundColor: applyFlow.canvas,
            border: `1px solid ${complete ? applyFlow.successBorder : applyFlow.hairline}`,
            fontFamily: applyFont.mono,
            fontSize: 11,
            fontWeight: 700,
            color: applyFlow.inkMuted,
          }}
        >
          {trimmed ? initialsFromName(trimmed) : String(index + 1).padStart(2, '0')}
          {complete ? (
            <Box
              sx={{
                position: 'absolute',
                right: -5,
                bottom: -5,
                width: 16,
                height: 16,
                display: 'grid',
                placeItems: 'center',
                borderRadius: '50%',
                backgroundColor: applyFlow.success,
                color: '#FFFFFF',
                border: `2px solid ${applyFlow.surface}`,
              }}
            >
              <Check size={9} strokeWidth={4} />
            </Box>
          ) : null}
        </Box>

        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
          <Typography
            sx={{
              ...tabularNums,
              fontFamily: applyFont.mono,
              fontSize: 10.5,
              fontWeight: 700,
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: applyFlow.inkMuted,
            }}
          >
            Traveller {String(index + 1).padStart(2, '0')}
            {index === 0 ? (
              <Box component="span" sx={{ color: applyFlow.inkFaint }}> · you</Box>
            ) : null}
          </Typography>
          <Typography
            sx={{
              fontFamily: applyFont.body,
              fontSize: 13,
              fontWeight: 600,
              color: trimmed ? applyFlow.ink : applyFlow.inkFaint,
              mt: 0.75,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {trimmed || 'Name not entered yet'}
          </Typography>
        </Box>

        <StatusPill tone={complete ? 'done' : 'idle'}>{complete ? 'Ready' : 'Incomplete'}</StatusPill>

        {onRemove ? (
          <Box
            component="button"
            type="button"
            onClick={onRemove}
            aria-label={`Remove traveller ${index + 1}`}
            sx={{
              width: 34,
              height: 34,
              flex: '0 0 auto',
              '@media (pointer: coarse)': { width: 44, height: 44 },
              display: 'grid',
              placeItems: 'center',
              appearance: 'none',
              border: `1px solid ${applyFlow.hairline}`,
              background: 'none',
              borderRadius: applyRadius.control,
              color: applyFlow.inkFaint,
              cursor: 'pointer',
              transition: `color 150ms ${applyMotion.easeOut}, border-color 150ms ${applyMotion.easeOut}`,
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': { color: applyFlow.critical, borderColor: 'rgba(180, 35, 24, 0.4)' },
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: `0 0 0 2px ${applyFlow.accent}`,
              },
            }}
          >
            <X size={14} />
          </Box>
        ) : null}
      </Stack>

      {/* The field, labelled. This is the thing people could not previously find. */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: { xs: 'stretch', md: 'flex-end' },
          gap: 3,
        }}
      >
        <Box sx={{ flex: '1 1 auto', minWidth: 0 }}>
          <FieldLabel htmlFor={`traveller-name-${applicant.id}`} required>
            Full name
          </FieldLabel>
          <Box
            component="input"
            id={`traveller-name-${applicant.id}`}
            value={name}
            placeholder="Exactly as printed on the passport"
            aria-label={`Traveller ${index + 1} full name`}
            onChange={(event: ChangeEvent<HTMLInputElement>) =>
              onUpdate({
                details: { ...applicant.details, fullName: event.target.value },
                label:
                  index === 0
                    ? applicant.label
                    : event.target.value.trim() || `Traveller ${index + 1}`,
                profileComplete: event.target.value.trim() ? applicant.profileComplete : false,
              })
            }
            sx={applyControlSx}
          />
        </Box>

        <Box sx={{ flex: '0 0 auto' }}>
          <FieldLabel>Embassy questions</FieldLabel>
          <Button
            variant={complete ? 'text' : 'contained'}
            disableElevation
            onClick={onOpenBuilder}
            disabled={!trimmed}
            sx={
              complete
                ? { ...getQuietButtonSx(), px: 4, py: 2, minHeight: 42, width: { xs: '100%', md: 'auto' } }
                : { ...getAccentButtonSx(), px: 4, py: 2, minHeight: 42, width: { xs: '100%', md: 'auto' } }
            }
          >
            {complete ? 'Edit answers' : 'Add details'}
          </Button>
        </Box>
      </Box>

      <Typography
        sx={{
          fontFamily: applyFont.mono,
          fontSize: 11,
          color: complete ? applyFlow.inkMuted : applyFlow.inkFaint,
          mt: 2,
          lineHeight: 1.45,
        }}
      >
        {tags.length > 0
          ? tags.join('  ·  ')
          : trimmed
            ? 'Profession, marital status and refusal history still needed'
            : 'Enter the full name to unlock the profile questions'}
      </Typography>
    </Box>
  )
}

/** Travel profile — name each traveller, then build their profile questionnaire. */
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
  const readyCount = applicants.filter(applicantReady).length
  const buildingApplicant = buildingApplicantId
    ? applicants.find((applicant) => applicant.id === buildingApplicantId)
    : undefined

  return (
    <>
      <StepShell
        title="Who is travelling?"
        helperText={
          countryName
            ? `Names must match each passport exactly. We'll then ask a short set of questions the ${countryName} embassy requires.`
            : "Names must match each passport exactly. We'll then ask a short set of questions the embassy requires."
        }
        onBack={onBack}
        backLabel="Back"
        onContinue={onContinue}
        continueLabel="Continue"
        continueDisabled={!allReady}
        contentMaxWidth={900}
      >
        <Box sx={{ width: '100%' }}>
          <SectionHeading>
            {`Travel party — ${readyCount} of ${applicants.length} ready`}
          </SectionHeading>

          <AnimatePresence initial={false} mode="popLayout">
            {applicants.map((applicant, index) => (
              <TravellerRow
                key={applicant.id}
                applicant={applicant}
                index={index}
                onUpdate={(patch) => onUpdateApplicant(applicant.id, patch)}
                onRemove={index > 0 ? () => onRemoveTraveller(applicant.id) : undefined}
                onOpenBuilder={() => setBuildingApplicantId(applicant.id)}
              />
            ))}
          </AnimatePresence>

          {/*
            Add-traveller also lives at the end of the list, not only in the footer — the
            footer button sits next to Continue, where it reads as a secondary way forward
            rather than an action on the list above it.
          */}
          <Box
            component="button"
            type="button"
            onClick={onAddTraveller}
            sx={{
              width: '100%',
              appearance: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              minHeight: 44,
              borderRadius: applyRadius.card,
              border: `1px dashed ${applyFlow.hairlineStrong}`,
              backgroundColor: 'transparent',
              color: applyFlow.inkMuted,
              fontFamily: applyFont.body,
              fontSize: 13.5,
              fontWeight: 600,
              transition: `border-color 150ms ${applyMotion.easeOut}, color 150ms ${applyMotion.easeOut}, background-color 150ms ${applyMotion.easeOut}`,
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': {
                  borderColor: applyFlow.accentBorder,
                  backgroundColor: applyFlow.accentSoft,
                  color: applyFlow.ink,
                },
              },
              '&:focus-visible': {
                outline: 'none',
                borderColor: applyFlow.accent,
                boxShadow: `0 0 0 3px ${applyFlow.accentRing}`,
              },
            }}
          >
            <Plus size={15} />
            Add traveller {String(applicants.length + 1).padStart(2, '0')}
          </Box>
        </Box>
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
