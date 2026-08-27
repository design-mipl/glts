import { useEffect, useMemo, useRef, useState } from 'react'
import { Box } from '@mui/material'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { resolveJurisdictionOptions } from '@/shared/services/retailJourneyResolver'
import { useAppNavigate } from '@/shared/hooks/useAppNavigate'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
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
import { JurisdictionStep } from './components/steps/JurisdictionStep'
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
import { RETAIL_PHASE_ORDER } from './config/stepPlan'
import {
  createRetailApplicantParty,
  type RetailApplicantParty,
  type RetailPhaseId,
  type RetailStepDefinition,
  type RetailStepId,
} from './types'
import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import { getCountryMasterById } from '@/shared/services/countryMasterService'

const LISTING_HREF = '/countries'

const VISA_ONLY_STEPS: RetailStepDefinition[] = [{ id: 'visa', phase: 'purpose', label: 'Visa type' }]

interface RetailApplyFlowShellProps {
  initialCountryId: string
  initialVisaOfferingId: string
}

export function RetailApplyFlowShell({ initialCountryId, initialVisaOfferingId }: RetailApplyFlowShellProps) {
  const navigate = useAppNavigate()
  const colors = usePublicBrandColors()
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
        onUpdateApplicant={updateApplicant}
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
            travelDate={draft.travelDate}
            onSelect={(jurisdictionId) => patchDraft({ jurisdictionId })}
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
              patchDraft({ paymentComplete: true })
              goNext()
            }}
          />
        )
      case 'success':
        if (!journey) return null
        return <SuccessStep journey={journey} listingHref={LISTING_HREF} />
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

  return (
    <Box
      sx={{
        width: '100%',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minHeight: 0,
      }}
    >
      <Box sx={{ mb: 2.5, flex: '0 0 auto' }}>
        <PhaseNav
          currentPhase={currentPhase}
          unlockedPhases={unlockedPhases}
          onSelectPhase={handleSelectPhase}
        />
      </Box>

      <Box
        sx={{
          border: `1px solid ${colors.border}`,
          borderRadius: BORDER_RADIUS.lg,
          bgcolor: colors.white,
          boxShadow: '0 8px 24px rgba(15, 23, 42, 0.06), 0 2px 6px rgba(15, 23, 42, 0.04)',
          p: { xs: 2.5, md: 3.5 },
          width: '100%',
          flex: 1,
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          boxSizing: 'border-box',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            minHeight: 0,
            width: '100%',
            overflow: 'hidden',
          }}
        >
          <StepTransition stepKey={currentStep?.id ?? 'empty'} direction={direction}>
            {currentStep ? renderStep(currentStep.id) : null}
          </StepTransition>
        </Box>
      </Box>
    </Box>
  )
}
