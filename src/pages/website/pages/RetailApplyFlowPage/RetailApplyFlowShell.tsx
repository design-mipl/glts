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
} from '@/pages/website/theme/applyFlowTheme'
import { getCountryTrustProfile } from '../../config/countryTrustBadges'
import { useRetailDraft } from './hooks/useRetailDraft'
import { useRetailStepPlan } from './hooks/useRetailStepPlan'
import { PhaseNav } from './components/PhaseNav'
import { StepTransition } from './components/StepTransition'
import { IneligibleScreen } from './components/IneligibleScreen'
import { ApplyIntroTransition } from './components/ApplyIntroTransition'
import { VisaStep } from './components/steps/VisaStep'
import { DestinationStep } from './components/steps/DestinationStep'
import { EligibilityStep } from './components/steps/EligibilityStep'
import { TravelProfileStep } from './components/steps/TravelProfileStep'
import { SponsorStep } from './components/steps/SponsorStep'
import { PassportStep } from './components/steps/PassportStep'
import { JurisdictionStep, resolveRetailJurisdictionPatch } from './components/steps/JurisdictionStep'
import { ConditionalQuestionStep } from './components/steps/ConditionalQuestionStep'
import { ChecklistStep } from './components/steps/ChecklistStep'
import { OriginalDocumentsStep } from './components/steps/OriginalDocumentsStep'
import { CollectionMethodStep } from './components/steps/CollectionMethodStep'
import { CollectionDetailsStep } from './components/steps/CollectionDetailsStep'
import { InsuranceStep } from './components/steps/InsuranceStep'
import { FlightTicketStep } from './components/steps/FlightTicketStep'
import { ReviewStep } from './components/steps/ReviewStep'
import { PaymentStep } from './components/steps/PaymentStep'
import { SuccessStep } from './components/steps/SuccessStep'
import {
  buildCustomerPaymentFromRetailDraft,
  createRetailApplicationFromWebsitePayment,
  persistRetailWebsiteDraftProgress,
  sendRetailWebsitePaymentLink,
  getRetailWebsitePaymentLinkSentAt,
} from '@/shared/services/retailWebsiteApplicationService'
import { DESTINATION_STEP, RETAIL_PHASE_ORDER } from './config/stepPlan'
import {
  createRetailApplicantParty,
  type RetailApplicantParty,
  type RetailPhaseId,
  type RetailStepId,
} from './types'
import type { OriginalDocumentCollectionMethod } from '@/shared/types/originalDocumentCollection'
import { getCountryMasterById, getVisaOfferings } from '@/shared/services/countryMasterService'
import {
  isAdminFlowPolicy,
  useApplicationFlowPolicy,
} from '@/pages/customer/features/applications/context/ApplicationFlowPolicyContext'
import { loadSession } from '@/shared/auth/session'
import { getSessionCreatorMeta } from '@/pages/customer/features/applications/utils/applicationAccessUtils'
import { useToast } from '@/design-system/UIComponents'
import { useSearchParams } from 'react-router-dom'
import { GREENLIGHT_LOGO_DARK_SRC } from '@/components/brand/GreenlightLogo'

const LISTING_HREF = '/countries'

interface RetailApplyFlowShellProps {
  initialCountryId?: string
  initialVisaOfferingId?: string
  applicationId?: string
  startFresh?: boolean
}

export function RetailApplyFlowShell({
  initialCountryId = '',
  initialVisaOfferingId = '',
  applicationId: applicationIdFromRoute,
  startFresh = false,
}: RetailApplyFlowShellProps) {
  const navigate = useAppNavigate()
  const [searchParams] = useSearchParams()
  const { policy, listingPath } = useApplicationFlowPolicy()
  const isAdminAssist = isAdminFlowPolicy(policy)
  const { showToast } = useToast()
  const session = loadSession()
  const creator = getSessionCreatorMeta(session)
  const creatorEmail = creator.createdByEmail === 'unknown@glts.com' ? 'website@glts.com' : creator.createdByEmail

  const [visaOfferingId, setVisaOfferingId] = useState(initialVisaOfferingId)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [direction, setDirection] = useState<1 | -1>(1)
  /** Fingerprint of resolved docs when review was last acknowledged — detects downstream requirement changes. */
  const [reviewRequirementsBaseline, setReviewRequirementsBaseline] = useState<string | null>(null)
  const [showRequirementsUpdated, setShowRequirementsUpdated] = useState(false)
  const advanceAfterCountryRef = useRef(false)

  const { draft, patchDraft, applicationId } = useRetailDraft({
    countryId: initialCountryId,
    visaOfferingId: initialVisaOfferingId || visaOfferingId,
    applicationId: applicationIdFromRoute,
    startFresh,
    creatorEmail,
    creatorRole: creator.createdByRole,
  })

  const countryId = draft.countryId || initialCountryId
  const exitHref = listingPath || (countryId ? `${LISTING_HREF}/${countryId}` : LISTING_HREF)
  const trustProfile = getCountryTrustProfile(countryId)
  const [showTrustIntro, setShowTrustIntro] = useState(() => !isAdminAssist && Boolean(trustProfile))
  const [createdApplicationId, setCreatedApplicationId] = useState<string | undefined>()
  const { journey, steps: resolvedSteps } = useRetailStepPlan(countryId, visaOfferingId || draft.visaOfferingId, draft)

  const steps = useMemo(() => {
    if (!countryId) return [DESTINATION_STEP]
    return resolvedSteps.length > 0 ? resolvedSteps : [DESTINATION_STEP, { id: 'visa' as const, phase: 'purpose' as const, label: 'Visa type' }]
  }, [countryId, resolvedSteps])

  const visiblePhases = useMemo(
    () => (countryId ? [...RETAIL_PHASE_ORDER] : (['destination'] as RetailPhaseId[])),
    [countryId],
  )

  const jurisdictions = useMemo(
    () => (countryId && visaOfferingId ? resolveJurisdictionOptions(countryId, visaOfferingId) : []),
    [countryId, visaOfferingId],
  )

  const hasRestoredStepRef = useRef(false)
  const [cursorReady, setCursorReady] = useState(false)
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
        // Retired step — sponsor uploads now live on the Documents step.
        restoredId = 'checklist'
      } else if (restoredId === 'collectionConfirmation') {
        // Retired step — it only replayed the handover selection.
        restoredId = 'collectionDetails'
      }
      const restoredIndex = steps.findIndex((step) => step.id === restoredId)
      if (restoredIndex !== -1) {
        setCurrentStepIndex(restoredIndex)
        // Mid-flow resume — skip the registered-agent intro.
        if (restoredIndex > 0) setShowTrustIntro(false)
      }
    } else if (countryId) {
      const visaIndex = steps.findIndex((step) => step.id === 'visa')
      if (visaIndex !== -1) setCurrentStepIndex(visaIndex)
    }
    setCursorReady(true)
  }, [steps, draft.lastStepId, countryId])

  useEffect(() => {
    if (!advanceAfterCountryRef.current) return
    if (!countryId) return
    const visaIndex = steps.findIndex((step) => step.id === 'visa')
    if (visaIndex === -1) return
    advanceAfterCountryRef.current = false
    setDirection(1)
    setCurrentStepIndex(visaIndex)
    patchDraft({ lastStepId: 'visa' })
    if (trustProfile && !isAdminAssist) setShowTrustIntro(true)
  }, [countryId, steps, patchDraft, trustProfile, isAdminAssist])

  useEffect(() => {
    if (!draft.visaOfferingId) return
    if (draft.visaOfferingId === visaOfferingId) return
    if (!visaOfferingId) setVisaOfferingId(draft.visaOfferingId)
  }, [draft.visaOfferingId, visaOfferingId])

  useEffect(() => {
    if (!applicationId) return
    if (searchParams.get('application') === applicationId) return
    const next = new URLSearchParams(searchParams)
    next.set('application', applicationId)
    if (countryId) next.set('country', countryId)
    if (visaOfferingId) next.set('visa', visaOfferingId)
    navigate(`${window.location.pathname}?${next.toString()}`, { replace: true })
  }, [applicationId, countryId, visaOfferingId, navigate, searchParams])

  useEffect(() => {
    if (!cursorReady) return
    const step = steps[currentStepIndex]
    persistRetailWebsiteDraftProgress({
      applicationId,
      draft,
      journey: journey ?? undefined,
      stepId: step?.id,
      stepLabel: step?.label,
      stepIndex: currentStepIndex + 1,
      totalSteps: steps.length,
      creatorEmail,
      creatorRole: creator.createdByRole,
    })
  }, [
    applicationId,
    creator.createdByRole,
    creatorEmail,
    currentStepIndex,
    cursorReady,
    draft,
    journey,
    steps,
  ])

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
      navigate(exitHref)
      return
    }
    goToStep(currentStepIndex - 1, -1)
  }

  function handleSelectVisa(nextOfferingId: string) {
    setVisaOfferingId(nextOfferingId)
    patchDraft({ visaOfferingId: nextOfferingId })
  }

  function handleSelectCountry(nextCountryId: string) {
    const offerings = getVisaOfferings(nextCountryId, true, 'retail')
    const nextVisa = offerings[0]?.id ?? ''
    const countryChanged = nextCountryId !== countryId
    advanceAfterCountryRef.current = true
    setVisaOfferingId(nextVisa)
    patchDraft({
      countryId: nextCountryId,
      visaOfferingId: nextVisa,
      ...(countryChanged
        ? {
            jurisdictionId: undefined,
            jurisdictionName: undefined,
            issuedPassportState: undefined,
            placeOfResidence: undefined,
            answers: {},
            eligibilityAnswerId: undefined,
            eligibilityStatus: undefined,
            documentUploads: {},
            collectionMethod: undefined,
            collectionDetails: {},
            insurance: { choice: 'skip' as const },
            flightTicket: { choice: 'skip' as const },
            processingTier: undefined,
            paymentMethod: undefined,
            paymentComplete: false,
            lastStepId: 'destination' as const,
          }
        : {}),
    })
  }

  function handleSelectPhase(phase: RetailPhaseId) {
    const targetIndex = steps.findIndex((step) => step.phase === phase)
    if (targetIndex === -1) return
    goToStep(targetIndex, targetIndex > currentStepIndex ? 1 : -1)
  }

  const currentStep = steps[currentStepIndex]
  const currentPhase: RetailPhaseId = currentStep?.phase ?? (countryId ? 'purpose' : 'destination')
  const currentPhaseIndex = visiblePhases.indexOf(currentPhase)
  const unlockedPhases = useMemo(
    () => new Set<RetailPhaseId>(visiblePhases.slice(0, Math.max(currentPhaseIndex, 0) + 1)),
    [visiblePhases, currentPhaseIndex],
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
        listingHref={exitHref}
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
      case 'destination':
        return (
          <DestinationStep
            countryId={countryId}
            onSelect={handleSelectCountry}
            onBack={goBack}
            onContinue={goNext}
          />
        )
      case 'visa':
        return (
          <VisaStep
            countryId={countryId}
            visaOfferingId={visaOfferingId || draft.visaOfferingId}
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
            travelDateEnd={draft.travelDateEnd}
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
            onTravelDateChange={(isoDate) =>
              // Re-picking departure invalidates a return date that now sits before it.
              patchDraft((prev) => ({
                travelDate: isoDate,
                travelDateEnd:
                  prev.travelDateEnd && prev.travelDateEnd < isoDate ? undefined : prev.travelDateEnd,
              }))
            }
            onTravelDateEndChange={(isoDate) => patchDraft({ travelDateEnd: isoDate || undefined })}
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
            continueLabel={
              isAdminAssist
                ? getRetailWebsitePaymentLinkSentAt(applicationId)
                  ? 'Resend payment link'
                  : 'Send payment link'
                : undefined
            }
            onPay={() => {
              if (isAdminAssist) {
                sendRetailWebsitePaymentLink({
                  journey,
                  draft: { ...draft, applicationId, paymentMethod: draft.paymentMethod ?? 'upi' },
                  creatorEmail,
                  creatorRole: creator.createdByRole,
                })
                showToast({
                  title: 'Payment link sent',
                  description: 'The customer can pay in advance from the link we sent.',
                  variant: 'success',
                })
                navigate(exitHref)
                return
              }
              const payment = buildCustomerPaymentFromRetailDraft(journey, draft)
              const { id } = createRetailApplicationFromWebsitePayment({
                journey,
                draft: {
                  ...draft,
                  applicationId,
                  paymentComplete: true,
                  paymentMethod: draft.paymentMethod ?? 'upi',
                },
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
            listingHref={exitHref}
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
          <Box
            component="a"
            href="/"
            aria-label="Greenlight Travel Solutions"
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              textDecoration: 'none',
              flexShrink: 0,
              minWidth: 0,
              '&:focus-visible': {
                outline: 'none',
                boxShadow: `0 0 0 2px ${applyFlow.accent}`,
                borderRadius: '3px',
              },
            }}
          >
            <Box
              component="img"
              src={GREENLIGHT_LOGO_DARK_SRC}
              alt="Greenlight Travel Solutions"
              sx={{
                height: 28,
                width: 'auto',
                maxWidth: 148,
                objectFit: 'contain',
                display: 'block',
              }}
            />
          </Box>
          <Typography
            component="button"
            type="button"
            onClick={() => navigate(exitHref)}
            aria-label="Exit application"
            sx={{
              appearance: 'none',
              border: 'none',
              background: 'none',
              padding: 0,
              cursor: 'pointer',
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
            phases={visiblePhases}
          />
        </Box>

        {/* Progress bar only — no step totals (avoids overwhelming with “N of 14”). */}
        <Box
          sx={{
            flex: '0 0 auto',
            display: { xs: 'none', md: 'block' },
            px: 4,
            py: 3.5,
            borderTop: `1px solid ${applyFlow.railLine}`,
          }}
        >
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
