import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { Plus, Trash2, UserRound } from 'lucide-react'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { Button, IconButton, Input } from '@/design-system/UIComponents'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { StepShell } from '../StepShell'
import { TravelProfileBuilder } from '../TravelProfileBuilder'
import type { RetailApplicantParty } from '../../types'

const AVATAR_TONES = ['#E11D48', '#0D9488', '#B45309', '#4F46E5', '#0891B2'] as const

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

function initialsFor(applicant: RetailApplicantParty, index: number): string {
  const name = applicant.details.fullName.trim()
  if (name) {
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
    return name.slice(0, 2).toUpperCase()
  }
  return index === 0 ? 'T1' : `T${index + 1}`
}

function displayName(applicant: RetailApplicantParty, index: number): string {
  const name = applicant.details.fullName.trim()
  if (name) return name
  return index === 0 ? 'Traveller 1' : applicant.label
}

function applicantReady(applicant: RetailApplicantParty): boolean {
  return Boolean(applicant.details.fullName.trim() && applicant.profileComplete)
}

/** Travel profile — name each traveller, then Build profile for questionnaire / docs. */
export function TravelProfileStep({
  countryName,
  applicants,
  onUpdateApplicant,
  onAddTraveller,
  onRemoveTraveller,
  onBack,
  onContinue,
}: TravelProfileStepProps) {
  const colors = usePublicBrandColors()
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
                sm: applicants.length === 1 ? 'minmax(0, 260px)' : 'repeat(2, minmax(0, 260px))',
                md:
                  applicants.length === 1
                    ? 'minmax(0, 260px)'
                    : applicants.length === 2
                      ? 'repeat(2, minmax(0, 260px))'
                      : 'repeat(3, minmax(0, 260px))',
              },
              gap: 2,
              justifyContent: 'center',
              width: '100%',
            }}
          >
            <AnimatePresence initial={false} mode="popLayout">
              {applicants.map((applicant, index) => {
                const tone = AVATAR_TONES[index % AVATAR_TONES.length]
                const name = applicant.details.fullName
                const canBuild = name.trim().length > 0

                return (
                  <Box
                    key={applicant.id}
                    component={motion.div}
                    layout
                    initial={{ opacity: 0, x: 36, scale: 0.96 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 24, scale: 0.96 }}
                    transition={CARD_LAYOUT_TRANSITION}
                    sx={{
                      border: `1px solid ${colors.border}`,
                      borderRadius: BORDER_RADIUS.xl,
                      bgcolor: colors.white,
                      p: 2,
                      maxWidth: 260,
                      width: '100%',
                      mx: 'auto',
                      boxShadow: '0 4px 14px rgba(15, 23, 42, 0.06), 0 1px 3px rgba(15, 23, 42, 0.04)',
                      position: 'relative',
                    }}
                  >
                    <Stack direction="row" alignItems="flex-start" justifyContent="space-between" sx={{ mb: 1.5 }}>
                      <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: BORDER_RADIUS.xl,
                            bgcolor: tone,
                            color: '#fff',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 800,
                            flexShrink: 0,
                          }}
                        >
                          {initialsFor(applicant, index)}
                        </Box>
                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            sx={{
                              fontWeight: 800,
                              fontSize: 14,
                              color: colors.navy,
                              lineHeight: 1.35,
                            }}
                          >
                            {index === 0 ? 'Traveller 1' : applicant.label}
                          </Typography>
                          <Typography sx={{ fontSize: 12, color: colors.textMuted, mt: 0.25 }}>
                            {applicant.profileComplete ? 'Profile complete' : 'Profile not started'}
                          </Typography>
                        </Box>
                      </Stack>
                      {index > 0 ? (
                        <IconButton
                          size="sm"
                          variant="soft"
                          color="error"
                          tooltip={`Remove ${displayName(applicant, index)}`}
                          icon={<Trash2 size={14} />}
                          onClick={() => onRemoveTraveller(applicant.id)}
                        />
                      ) : (
                        <Box sx={{ width: 34 }} />
                      )}
                    </Stack>

                    <Stack spacing={1.5} sx={{ mt: 5 }}>
                      <Input
                        placeholder="Traveller name"
                        fullWidth
                        value={name}
                        onChange={(value) =>
                          onUpdateApplicant(applicant.id, {
                            details: { ...applicant.details, fullName: value },
                            label: index === 0 ? applicant.label : value.trim() || `Traveller ${index + 1}`,
                            profileComplete: value.trim() ? applicant.profileComplete : false,
                          })
                        }
                      />
                      <Button
                        label={applicant.profileComplete ? 'Edit profile' : 'Build profile'}
                        variant="soft"
                        color="primary"
                        fullWidth
                        startIcon={<UserRound size={16} />}
                        disabled={!canBuild}
                        onClick={() => setBuildingApplicantId(applicant.id)}
                      />
                    </Stack>
                  </Box>
                )
              })}
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
