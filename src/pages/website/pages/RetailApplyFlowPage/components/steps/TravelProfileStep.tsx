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
import { SectionHeading, StatusPill } from '@/pages/website/theme/applyFormControls'
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
 * One traveller = one row in a manifest, not a portrait card.
 *
 * Rows are separated by hairlines rather than each being boxed, so a party of four reads
 * as one list instead of four floating objects. The monogram uses a single neutral
 * treatment for everyone — per-person accent colours were a flagged "AI-generated SaaS"
 * tell, and colour here is reserved for completion state.
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
        display: 'flex',
        alignItems: { xs: 'flex-start', sm: 'center' },
        flexDirection: { xs: 'column', sm: 'row' },
        gap: { xs: 2.5, sm: 3.5 },
        py: 3.25,
        borderBottom: `1px solid ${applyFlow.hairlineSoft}`,
        '&:first-of-type': { borderTop: `1px solid ${applyFlow.hairlineSoft}` },
      }}
    >
      {/* Index + monogram */}
      <Stack direction="row" alignItems="center" spacing={3.5} sx={{ flex: '0 0 auto' }}>
        <Typography
          sx={{
            ...tabularNums,
            fontFamily: applyFont.mono,
            fontSize: 11,
            fontWeight: 600,
            color: applyFlow.inkFaint,
            width: 18,
          }}
        >
          {String(index + 1).padStart(2, '0')}
        </Typography>
        <Box
          aria-hidden
          sx={{
            position: 'relative',
            width: 38,
            height: 38,
            display: 'grid',
            placeItems: 'center',
            borderRadius: applyRadius.chip,
            backgroundColor: applyFlow.canvas,
            border: `1px solid ${complete ? applyFlow.successBorder : applyFlow.hairline}`,
            fontFamily: applyFont.mono,
            fontSize: 13,
            fontWeight: 700,
            color: applyFlow.inkMuted,
            transition: `border-color 200ms ${applyMotion.easeOut}`,
          }}
        >
          {trimmed ? initialsFromName(trimmed) : '—'}
          {complete ? (
            <Box
              sx={{
                position: 'absolute',
                right: -5,
                bottom: -5,
                width: 17,
                height: 17,
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
      </Stack>

      {/* Name + profile summary */}
      <Box sx={{ flex: '1 1 auto', minWidth: 0, width: '100%' }}>
        <Box
          component="input"
          id={`traveller-name-${applicant.id}`}
          value={name}
          placeholder="Full name, exactly as printed on the passport"
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
          sx={{
            width: '100%',
            border: 'none',
            borderBottom: `1px solid transparent`,
            outline: 'none',
            backgroundColor: 'transparent',
            p: 0,
            pb: 1,
            fontFamily: applyFont.body,
            fontSize: 15,
            fontWeight: 600,
            letterSpacing: '-0.01em',
            color: applyFlow.ink,
            transition: `border-color 150ms ${applyMotion.easeOut}`,
            '&::placeholder': { color: applyFlow.inkFaint, fontWeight: 400 },
            '&:hover': { borderBottomColor: applyFlow.hairline },
            '&:focus': { borderBottomColor: applyFlow.accent },
          }}
        />
        <Typography
          sx={{
            fontFamily: applyFont.mono,
            fontSize: 11,
            color: applyFlow.inkMuted,
            mt: 1,
            lineHeight: 1.45,
          }}
        >
          {tags.length > 0 ? tags.join('  ·  ') : 'No profile details yet'}
        </Typography>
      </Box>

      {/* Status + actions */}
      <Stack
        direction="row"
        alignItems="center"
        spacing={3}
        sx={{ flex: '0 0 auto', pl: { xs: 0, sm: 2 } }}
      >
        <StatusPill tone={complete ? 'done' : 'idle'}>{complete ? 'Ready' : 'Incomplete'}</StatusPill>
        <Button
          variant={complete ? 'text' : 'contained'}
          disableElevation
          onClick={onOpenBuilder}
          disabled={!trimmed}
          sx={
            complete
              ? { ...getQuietButtonSx(), px: 3.5, minHeight: 44 }
              : { ...getAccentButtonSx(), px: 4, minHeight: 44 }
          }
        >
          {complete ? 'Edit' : 'Build profile'}
        </Button>
        {onRemove ? (
          <Box
            component="button"
            type="button"
            onClick={onRemove}
            aria-label={`Remove traveller ${index + 1}`}
            sx={{
              width: 44,
              height: 44,
              display: 'grid',
              placeItems: 'center',
              appearance: 'none',
              border: 'none',
              background: 'none',
              borderRadius: applyRadius.control,
              color: applyFlow.inkFaint,
              cursor: 'pointer',
              transition: `color 150ms ${applyMotion.easeOut}`,
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': { color: applyFlow.critical },
              },
              '&:focus-visible': {
                outline: 'none',
                boxShadow: `0 0 0 2px ${applyFlow.accent}`,
              },
            }}
          >
            <X size={15} />
          </Box>
        ) : null}
      </Stack>
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
        footerEndAction={
          <Button
            variant="text"
            startIcon={<Plus size={15} />}
            onClick={onAddTraveller}
            sx={{ ...getQuietButtonSx(), px: 4, minHeight: 44 }}
          >
            Add traveller
          </Button>
        }
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
