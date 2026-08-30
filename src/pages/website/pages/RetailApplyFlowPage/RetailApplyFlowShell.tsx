import { useEffect, useMemo, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { resolveJurisdictionOptions } from '@/shared/services/retailJourneyResolver'
import { useAppNavigate } from '@/shared/hooks/useAppNavigate'
import {
  applyFlow,
  applyFont,
  applyMotion,
  applyRadius,
  getClippedCardClipPath,
  tabularNums,
} from '@/pages/website/theme/applyFlowTheme'
import { getCountryTrustProfile } from '../../config/countryTrustBadges'
import { useRetailDraft } from './hooks/useRetailDraft'
import { useRetailStepPlan } from './hooks/useRetailStepPlan'
import { PhaseNav } from './components/PhaseNav'
import { StepTransition } from './components/StepTransition'
import { IneligibleScreen } from './components/IneligibleScreen'
import { ApplyIntroTransition } from './components/ApplyIntroTransition'
import { VisaStep } from './components/steps/VisaStep'
import { EligibilityStep } from './components/steps/EligibilityStep'
import { TravelProfileStep } from './components/steps/TravelProfileStep'
import { SponsorStep } from './components/steps/SponsorStep'
import { SponsorDocsStep } from './components/steps/SponsorDocsStep'
import { PassportStep } from './components/steps/PassportStep'
import { JurisdictionStep, resolveRetailJurisdictionPatch } from './components/steps/JurisdictionStep'
import { ConditionalQuestionStep } from './components/steps/ConditionalQuestionStep'
import { ChecklistStep } from './components/steps/ChecklistStep'
import { OriginalDocumentsStep } from './components/steps/OriginalDocumentsStep'
import { CollectionMethodStep } from './components/steps/CollectionMethodStep'
import { CollectionDetailsStep } from './components/steps/CollectionDetailsStep'
import { CollectionConfirmationStep } from './components/steps/CollectionConfirmationStep'
import { InsuranceStep } from './components/steps/InsuranceStep'
import { FlightTicketStep } from './components/steps/FlightTicketStep'
import { ReviewStep } from './components/steps/ReviewStep'
import { PaymentStep } from './components/steps/PaymentStep'
import { SuccessStep } from './components/steps/SuccessStep'
import {
  buildCustomerPaymentFromRetailDraft,
  createRetailApplicationFromWebsitePayment,
} from '@/shared/services/retailWebsiteApplicationService'
import { RETAIL_PHASE_ORDER } from './config/stepPlan'
import {
  createRetailApplicantParty,
  type RetailApplicantParty,
  type RetailPhaseId,
  type RetailStepDefinition,
  type RetailStepId,
} from './types'
import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import { getCountryMasterById, getVisaOfferings } from '@/shared/services/countryMasterService'

const LISTING_HREF = '/countries'

const VISA_ONLY_STEPS: RetailStepDefinition[] = [{ id: 'visa', phase: 'purpose', label: 'Visa type' }]

interface RetailApplyFlowShellProps {
  initialCountryId: string
  initialVisaOfferingId: string
}

export function RetailApplyFlowShell({ initialCountryId, initialVisaOfferingId }: RetailApplyFlowShellProps) {
  const navigate = useAppNavigate()
  const countryPageHref = `${LISTING_HREF}/${initialCountryId}`

  const [visaOfferingId, setVisaOfferingId] = useState(initialVisaOfferingId)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  /** Fingerprint of resolved docs when review was last acknowledged — detects downstream requirement changes. */
  const [reviewRequirementsBaseline, setReviewRequirementsBaseline] = useState<string | null>(null)
  const [showRequirementsUpdated, setShowRequirementsUpdated] = useState(false)

  const countryId = initialCountryId
  const trustProfile = getCountryTrustProfile(countryId)
  const [showTrustIntro, setShowTrustIntro] = useState(() => Boolean(trustProfile))
  const [createdApplicationId, setCreatedApplicationId] = useState<string | undefined>()
  const { draft, patchDraft } = useRetailDraft(countryId, visaOfferingId)
  const { journey, steps: resolvedSteps } = useRetailStepPlan(countryId, visaOfferingId, draft)

  const steps = useMemo(
    () => (resolvedSteps.length > 0 ? resolvedSteps : VISA_ONLY_STEPS),
    [resolvedSteps],
  )

  const jurisdictions = useMemo(
    () => (countryId && visaOfferingId ? resolveJurisdictionOptions(countryId, visaOfferingId) : []),
    [countryId, visaOfferingId],
  )

  const hasRestoredStepRef = useRef(false)
  useEffect(() => {
    if (hasRestoredStepRef.current || steps.length === 0) return
    hasRestoredStepRef.current = true

    if (draft.lastStepId) {
      let restoredId = draft.lastStepId
      if (restoredId === 'photo' || restoredId === 'confirm' || restoredId === 'traveller') {
        restoredId = 'passport'
      } else if (restoredId === 'requirements') {
        restoredId = 'checklist'
      } else if (restoredId === 'sponsorDocs') {
        // Fall back if draft no longer needs sponsor documents.
        const hasDocsStep = steps.some((step) => step.id === 'sponsorDocs')
        if (!hasDocsStep) restoredId = 'sponsor'
      }
      const restoredIndex = steps.findIndex((step) => step.id === restoredId)
      if (restoredIndex !== -1) {
        setCurrentStepIndex(restoredIndex)
        // Mid-flow resume — skip the registered-agent intro.
        if (restoredIndex > 0) setShowTrustIntro(false)
      }
    }
  }, [steps, draft.lastStepId])

  const requirementsFingerprint = useMemo(() => {
    if (!journey) return ''
    return journey.documents
      .map((doc) => `${doc.documentId}:${doc.mandatory ? '1' : '0'}`)
      .sort()
      .join('|')
  }, [journey])

  useEffect(() => {
    if (steps[currentStepIndex]?.id !== 'review') return
    if (!requirementsFingerprint) return
    if (reviewRequirementsBaseline === null) {
      setReviewRequirementsBaseline(requirementsFingerprint)
      return
    }
    if (requirementsFingerprint !== reviewRequirementsBaseline) {
      setShowRequirementsUpdated(true)
    }
  }, [currentStepIndex, steps, requirementsFingerprint, reviewRequirementsBaseline])

  function goToStep(index: number, dir: 1 | -1) {
    setDirection(dir)
    const clampedIndex = Math.max(0, Math.min(index, steps.length - 1))
    setCurrentStepIndex(clampedIndex)
    const stepId = steps[clampedIndex]?.id
    if (stepId) patchDraft({ lastStepId: stepId })
  }

  function goNext() {
    goToStep(currentStepIndex + 1, 1)
  }

  function goBack() {
    if (currentStepIndex <= 0) {
      navigate(countryPageHref)
      return
    }
    goToStep(currentStepIndex - 1, -1)
  }

  function handleSelectVisa(nextOfferingId: string) {
    setVisaOfferingId(nextOfferingId)
    patchDraft({ visaOfferingId: nextOfferingId })
  }

  function handleSelectPhase(phase: RetailPhaseId) {
    const targetIndex = steps.findIndex((step) => step.phase === phase)
    if (targetIndex === -1) return
    goToStep(targetIndex, targetIndex > currentStepIndex ? 1 : -1)
  }

  const currentStep = steps[currentStepIndex]
  const currentPhase: RetailPhaseId = currentStep?.phase ?? 'purpose'
  const currentPhaseIndex = RETAIL_PHASE_ORDER.indexOf(currentPhase)
  const unlockedPhases = useMemo(
    () => new Set<RetailPhaseId>(RETAIL_PHASE_ORDER.slice(0, currentPhaseIndex + 1)),
    [currentPhaseIndex],
  )

  const countryMaster = useMemo(() => getCountryMasterById(countryId), [countryId])
  const visaLabel = useMemo(
    () =>
      getVisaOfferings(countryId, true, 'retail').find((offering) => offering.id === visaOfferingId)
        ?.visaTypeLabel ?? '',
    [countryId, visaOfferingId],
  )

  if (draft.eligibilityStatus === 'ineligible') {
    const rule = journey?.eligibility[0]
    const selectedOption = rule?.options.find((option) => option.id === draft.eligibilityAnswerId)
    return (
      <IneligibleScreen
        reason={selectedOption?.ineligibleReason}
        onChangeAnswer={() => patchDraft({ eligibilityStatus: undefined, eligibilityAnswerId: undefined })}
        listingHref={LISTING_HREF}
      />
    )
  }

  function updateApplicant(id: string, patch: Partial<RetailApplicantParty>) {
    patchDraft((prev) => ({
      applicants: prev.applicants.map((applicant) =>
        applicant.id === id
          ? {
              ...applicant,
              ...patch,
              details: patch.details ? { ...applicant.details, ...patch.details } : applicant.details,
              profileAnswers: patch.profileAnswers
                ? { ...(applicant.profileAnswers ?? {}), ...patch.profileAnswers }
                : applicant.profileAnswers,
            }
          : applicant,
      ),
    }))
  }

  function addTraveller() {
    patchDraft((prev) => ({
      applicants: [...prev.applicants, createRetailApplicantParty(prev.applicants.length)],
    }))
  }

  function removeTraveller(id: string) {
    patchDraft((prev) => {
      if (prev.applicants.length <= 1) return {}
      const applicants = prev.applicants.filter((applicant) => applicant.id !== id)
      // Drop sponsor bank-statement uploads keyed to the removed traveller.
      const documentUploads = Object.fromEntries(
        Object.entries(prev.documentUploads).filter(([key]) => !key.startsWith(`${id}__`)),
      )
      return { applicants, documentUploads }
    })
  }

  function goToTravelProfile() {
    const targetIndex = steps.findIndex((step) => step.id === 'travelProfile')
    if (targetIndex === -1) return
    goToStep(targetIndex, targetIndex > currentStepIndex ? 1 : -1)
  }

  function renderTravelProfileStep() {
    return (
      <TravelProfileStep
        countryName={countryMaster?.name}
        applicants={draft.applicants}
        onUpdateApplicant={updateApplicant}
        onAddTraveller={addTraveller}
        onRemoveTraveller={removeTraveller}
        onBack={goBack}
        onContinue={goNext}
      />
    )
  }

  function renderEssentialDocumentsStep() {
    return (
      <PassportStep
        countryName={countryMaster?.name}
        applicants={draft.applicants}
        uploads={draft.documentUploads}
        onUpdateApplicant={updateApplicant}
        onUploadBankStatement={(applicantId, image) =>
          patchDraft((prev) => ({
            documentUploads: {
              ...prev.documentUploads,
              [`${applicantId}__bank_statement`]: image,
            },
          }))
        }
        onBack={goBack}
        onContinue={goNext}
      />
    )
  }

  function renderStep(stepId: RetailStepId) {
    if (stepId.startsWith('question:')) {
      const questionId = stepId.slice('question:'.length)
      const question = journey?.conditionalQuestions.find((entry) => entry.id === questionId)
      if (!question) return null
      return (
        <ConditionalQuestionStep
          question={question}
          selectedOptionId={draft.answers[questionId]}
          onSelect={(optionId) => patchDraft((prev) => ({ answers: { ...prev.answers, [questionId]: optionId } }))}
          onBack={goBack}
          onContinue={goNext}
        />
      )
    }

    switch (stepId) {
      case 'visa':
        return (
          <VisaStep
            countryId={countryId}
            visaOfferingId={visaOfferingId}
            onSelect={handleSelectVisa}
            onBack={goBack}
            onContinue={goNext}
          />
        )
      case 'travelProfile':
        return renderTravelProfileStep()
      case 'sponsor':
        return (
          <SponsorStep
            applicants={draft.applicants}
            onUpdateSponsor={(applicantId, sponsor) =>
              updateApplicant(applicantId, { sponsor })
            }
            onGoToTravelProfile={goToTravelProfile}
            onBack={goBack}
            onContinue={goNext}
          />
        )
      case 'sponsorDocs':
        return (
          <SponsorDocsStep
            applicants={draft.applicants}
            uploads={draft.documentUploads}
            onUpload={(applicantId, image) =>
              patchDraft((prev) => ({
                documentUploads: {
                  ...prev.documentUploads,
                  [`${applicantId}__sponsor_bank_statement`]: image,
                },
              }))
            }
            onBack={goBack}
            onContinue={goNext}
          />
        )
      case 'traveller':
      case 'passport':
      case 'photo':
      case 'confirm':
        return renderEssentialDocumentsStep()
      case 'eligibility': {
        const rule = journey?.eligibility[0]
        if (!rule) return null
        return (
          <EligibilityStep
            rule={rule}
            selectedOptionId={draft.eligibilityAnswerId}
            onSelect={(optionId) => {
              const option = rule.options.find((entry) => entry.id === optionId)
              patchDraft({
                eligibilityAnswerId: optionId,
                eligibilityStatus: option?.eligible ? 'eligible' : 'ineligible',
              })
            }}
            onBack={goBack}
            onContinue={goNext}
          />
        )
      }
      case 'jurisdiction':
        return (
          <JurisdictionStep
            countryId={countryId}
            visaOfferingId={visaOfferingId}
            jurisdictions={jurisdictions}
            selectedId={draft.jurisdictionId}
            jurisdictionName={draft.jurisdictionName}
            issuedPassportState={draft.issuedPassportState}
            placeOfResidence={draft.placeOfResidence}
            travelDate={draft.travelDate}
            onSelect={(jurisdictionId, jurisdictionName) =>
              patchDraft({ jurisdictionId, jurisdictionName })
            }
            onPassportStateChange={(stateName) =>
              patchDraft(
                resolveRetailJurisdictionPatch(
                  countryId,
                  visaOfferingId,
                  { issuedPassportState: stateName },
                  {
                    issuedPassportState: draft.issuedPassportState,
                    placeOfResidence: draft.placeOfResidence,
                  },
                ),
              )
            }
            onPlaceOfResidenceChange={(stateName) =>
              patchDraft(
                resolveRetailJurisdictionPatch(
                  countryId,
                  visaOfferingId,
                  { placeOfResidence: stateName },
                  {
                    issuedPassportState: draft.issuedPassportState,
                    placeOfResidence: draft.placeOfResidence,
                  },
                ),
              )
            }
            onTravelDateChange={(isoDate) => patchDraft({ travelDate: isoDate })}
            onBack={goBack}
            onContinue={goNext}
          />
        )
      case 'checklist':
      case 'requirements':
        return (
          <ChecklistStep
            documents={journey?.documents ?? []}
            applicants={draft.applicants}
            uploads={draft.documentUploads}
            onUpload={(documentId, image, applicantId) =>
              patchDraft((prev) => ({
                documentUploads: {
                  ...prev.documentUploads,
                  [`${applicantId}__${documentId}`]: image,
                },
              }))
            }
            onBack={goBack}
            onContinue={goNext}
          />
        )
      case 'originalDocuments':
        return <OriginalDocumentsStep documents={journey?.documents ?? []} onBack={goBack} onContinue={goNext} />
      case 'collectionMethod':
        return (
          <CollectionMethodStep
            selectedMethod={draft.collectionMethod}
            onSelect={(method: OriginalDocumentCollectionMethod) =>
              patchDraft({ collectionMethod: method, collectionDetails: {} })
            }
            onBack={goBack}
            onContinue={goNext}
          />
        )
      case 'collectionDetails': {
        const method = draft.collectionMethod ?? 'picked_up_from_company'
        return (
          <CollectionDetailsStep
            method={method}
            values={draft.collectionDetails}
            onSelectMethod={(next) =>
              patchDraft({ collectionMethod: next, collectionDetails: {} })
            }
            onChange={(key, value) =>
              patchDraft((prev) => ({
                collectionMethod: prev.collectionMethod ?? method,
                collectionDetails: { ...prev.collectionDetails, [key]: value },
              }))
            }
            onBack={goBack}
            onContinue={goNext}
          />
        )
      }
      case 'collectionConfirmation': {
        const method = draft.collectionMethod ?? 'picked_up_from_company'
        return (
          <CollectionConfirmationStep
            method={method}
            values={draft.collectionDetails}
            onBack={goBack}
            onContinue={goNext}
          />
        )
      }
      case 'insurance':
        return (
          <InsuranceStep
            services={journey?.insuranceServices ?? []}
            selection={draft.insurance}
            travelDate={draft.travelDate}
            onChange={(selection) => patchDraft({ insurance: selection })}
            onBack={goBack}
            onContinue={goNext}
          />
        )
      case 'flightTicket':
        return (
          <FlightTicketStep
            services={journey?.flightTicketServices ?? []}
            selection={draft.flightTicket}
            travelDate={draft.travelDate}
            onChange={(selection) => patchDraft({ flightTicket: selection })}
            onBack={goBack}
            onContinue={goNext}
          />
        )
      case 'review':
        if (!journey) return null
        return (
          <ReviewStep
            journey={journey}
            draft={draft}
            onBack={goBack}
            onContinue={goNext}
            requirementsUpdated={showRequirementsUpdated}
            onDismissRequirementsUpdated={() => {
              setShowRequirementsUpdated(false)
              setReviewRequirementsBaseline(requirementsFingerprint)
            }}
            onEditStep={(stepId) => {
              const targetIndex = steps.findIndex((step) => step.id === stepId)
              if (targetIndex === -1) return
              goToStep(targetIndex, targetIndex > currentStepIndex ? 1 : -1)
            }}
          />
        )
      case 'payment':
        if (!journey) return null
        return (
          <PaymentStep
            journey={journey}
            draft={draft}
            onChange={(patch) => patchDraft(patch)}
            onBack={goBack}
            onPay={() => {
              const payment = buildCustomerPaymentFromRetailDraft(journey, draft)
              const { id } = createRetailApplicationFromWebsitePayment({
                journey,
                draft: { ...draft, paymentComplete: true, paymentMethod: draft.paymentMethod ?? 'upi' },
                payment,
              })
              setCreatedApplicationId(id)
              patchDraft({ paymentComplete: true, paymentMethod: draft.paymentMethod ?? 'upi' })
              goNext()
            }}
          />
        )
      case 'success':
        if (!journey) return null
        return (
          <SuccessStep
            journey={journey}
            listingHref={LISTING_HREF}
            applicationReference={createdApplicationId}
          />
        )
      default:
        return null
    }
  }

  if (showTrustIntro && trustProfile) {
    return (
      <ApplyIntroTransition
        profile={trustProfile}
        flagEmoji={countryMaster?.flag}
        countryCode={trustProfile.countryCode}
        onComplete={() => setShowTrustIntro(false)}
      />
    )
  }

  const stepPct = (currentStepIndex + 1) / Math.max(steps.length, 1)

  return (
    // One panel, two zones. The rail is a column *inside* the surface — not a sibling
    // floating beside it — which is what makes the screen read as a single instrument.
    <Box
      sx={{
        width: '100%',
        flex: 1,
        minHeight: 0,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
        alignItems: 'stretch',
        borderRadius: applyRadius.card,
        overflow: 'hidden',
        bgcolor: applyFlow.surface,
        boxShadow: `0 0 0 1px ${applyFlow.hairlineSoft}, 0 24px 64px -16px rgba(8, 24, 43, 0.22)`,
        // Signature: top-right corner cut like a clipped travel document.
        clipPath: { xs: 'none', md: getClippedCardClipPath(22) },
      }}
    >
      {/* ── Rail ─────────────────────────────────────────────────────── */}
      <Box
        sx={{
          flex: '0 0 auto',
          width: { xs: '100%', md: 216 },
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          bgcolor: applyFlow.railBg,
          backgroundImage: `linear-gradient(${applyFlow.railBgTop} 0%, ${applyFlow.railBg} 42%)`,
          borderRight: { xs: 'none', md: `1px solid ${applyFlow.railLine}` },
          borderBottom: { xs: `1px solid ${applyFlow.railLine}`, md: 'none' },
        }}
      >
        {/* Brand + exit. Replaces the removed site header. */}
        <Box
          sx={{
            flex: '0 0 auto',
            display: { xs: 'none', md: 'flex' },
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            px: 4,
            pt: 4.5,
            pb: 3.5,
          }}
        >
          <Typography
            component="a"
            href="/"
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: applyFlow.railText,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1.5,
              '&:focus-visible': {
                outline: 'none',
                boxShadow: `0 0 0 2px ${applyFlow.accent}`,
                borderRadius: '3px',
              },
            }}
          >
            <Box
              aria-hidden
              sx={{
                width: 7,
                height: 7,
                borderRadius: '2px',
                backgroundColor: applyFlow.accent,
                flex: '0 0 auto',
              }}
            />
            GLTS
          </Typography>
          <Typography
            component="a"
            href={countryPageHref}
            aria-label="Exit application"
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: '0.1em',
              color: applyFlow.railTextFaint,
              textDecoration: 'none',
              transition: `color 150ms ${applyMotion.easeOut}`,
              '@media (hover: hover) and (pointer: fine)': {
                '&:hover': { color: applyFlow.railText },
              },
              '&:focus-visible': { outline: 'none', color: applyFlow.accent },
            }}
          >
            EXIT
          </Typography>
        </Box>

        <Box sx={{ flex: '1 1 auto', minHeight: 0, overflowY: 'auto', py: { xs: 2, md: 3 } }}>
          <PhaseNav
            currentPhase={currentPhase}
            unlockedPhases={unlockedPhases}
            onSelectPhase={handleSelectPhase}
          />
        </Box>

        {/* Progress readout — the one big number on the screen, and it lives on navy. */}
        <Box
          sx={{
            flex: '0 0 auto',
            display: { xs: 'none', md: 'block' },
            px: 4,
            py: 3.5,
            borderTop: `1px solid ${applyFlow.railLine}`,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1, mb: 2 }}>
            <Typography
              sx={{
                ...tabularNums,
                fontFamily: applyFont.mono,
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1,
                color: applyFlow.accent,
                letterSpacing: '-0.02em',
              }}
            >
              {String(currentStepIndex + 1).padStart(2, '0')}
            </Typography>
            <Typography
              sx={{
                ...tabularNums,
                fontFamily: applyFont.mono,
                fontSize: 12,
                fontWeight: 500,
                color: applyFlow.railTextFaint,
              }}
            >
              / {String(steps.length).padStart(2, '0')} STEPS
            </Typography>
          </Box>
          <Box
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={steps.length}
            aria-valuenow={currentStepIndex + 1}
            aria-label="Application progress"
            sx={{
              height: '2px',
              borderRadius: '1px',
              backgroundColor: 'rgba(255, 255, 255, 0.12)',
              overflow: 'hidden',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${stepPct * 100}%`,
                backgroundColor: applyFlow.accent,
                transition: `width ${applyMotion.stepMs}ms ${applyMotion.easeInOut}`,
                '@media (prefers-reduced-motion: reduce)': { transition: 'none' },
              }}
            />
          </Box>
        </Box>
      </Box>

      {/* ── Content ──────────────────────────────────────────────────── */}
      <Box
        sx={{
          flex: '1 1 auto',
          minWidth: 0,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          bgcolor: applyFlow.surface,
          position: 'relative',
          // NOTE: theme spacing unit is 4px (not MUI's default 8) — see generateTheme.ts.
          // Every value here is in 4px units, so `7` = 28px.
          pt: { xs: 5, md: 6.5 },
          px: { xs: 4, md: 7 },
          pb: { xs: 4, md: 5 },
          boxSizing: 'border-box',
          overflow: 'hidden',
        }}
      >
        {/*
          Destination context sits on the step-heading line, hard right — it used to be
          repeated in the rail, which cost a whole block of vertical space to say something
          that never changes. Absolutely positioned so all ~20 steps get it without each
          one having to pass it into StepShell.
        */}
        <Box
          sx={{
            position: 'absolute',
            top: { xs: 20, md: 26 },
            right: { xs: 16, md: 28 },
            zIndex: 3,
            display: 'flex',
            alignItems: 'center',
            gap: 1.75,
            maxWidth: '46%',
            pointerEvents: 'none',
          }}
        >
          {countryMaster?.flag ? (
            <Box component="span" sx={{ fontSize: 15, lineHeight: 1, flex: '0 0 auto' }} aria-hidden>
              {countryMaster.flag}
            </Box>
          ) : null}
          <Typography
            sx={{
              fontFamily: applyFont.mono,
              fontSize: 10.5,
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: applyFlow.inkMuted,
              lineHeight: 1.3,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {countryMaster?.name ?? 'Destination'}
            {visaLabel ? (
              <Box component="span" sx={{ color: applyFlow.inkFaint }}> · {visaLabel}</Box>
            ) : null}
          </Typography>
        </Box>

        <StepTransition stepKey={currentStep?.id ?? 'empty'} direction={direction}>
          {currentStep ? renderStep(currentStep.id) : null}
        </StepTransition>
      </Box>
    </Box>
  )
}
