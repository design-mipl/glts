import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { Box, Stack } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useAppNavigate } from '@/shared/hooks/useAppNavigate'
import { getCountryById } from '@/shared/services/visaService'
import { Breadcrumb } from '@/design-system/UIComponents'
import { BORDER_RADIUS, BORDER_WIDTH, SHADOWS } from '@/design-system/tokens'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import {
  isWebsiteFlowPolicy,
  useApplicationFlowPolicy,
} from '../../context/ApplicationFlowPolicyContext'
import { useApplicationFlowState } from '../../hooks/useApplicationFlowState'
import type { CreateApplicationLocationState } from '../../utils/createApplicationNavigation'
import {
  APPLICATION_FLOW_STEPS,
  APPLICATION_FLOW_STEP_LABELS,
  canAdvanceFromStep,
  type ApplicationFlowStep,
} from '../../utils/applicationFlowAdvanceRules'
import { ApplicationFlowStepper } from '../../components/ApplicationFlowStepper'
import { CountrySelectionStep } from './steps/CountrySelectionStep'
import { BulkApplicationUploadPage } from './steps/BulkApplicationUploadPage'
import { DetailsStep } from './steps/DetailsStep'
import { ApplicationSubmitStep } from './steps/ApplicationSubmitStep'
import { SingleVisaPurposeStep } from './steps/single/SingleVisaPurposeStep'
import { RequirementPreviewStep } from './steps/single/RequirementPreviewStep'

export interface CreateApplicationFlowPageProps {
  /** When set (e.g. from website country detail), skip country step after seeding state. */
  preselectedCountryId?: string
  initialStep?: ApplicationFlowStep
}

export function CreateApplicationFlowPage({
  preselectedCountryId,
  initialStep = 'country',
}: CreateApplicationFlowPageProps = {}) {
  const navigate = useAppNavigate()
  const location = useLocation()
  const navState = (location.state ?? null) as CreateApplicationLocationState | null
  const isFreshStart = Boolean(navState?.freshStart)

  const { policy, listingPath, breadcrumbItems, storageKey } = useApplicationFlowPolicy()
  const { state, update, reset } = useApplicationFlowState({
    startFresh: isFreshStart,
    storageKey,
  })

  const [step, setStep] = useState<ApplicationFlowStep>(initialStep)
  const stepIndex = APPLICATION_FLOW_STEPS.indexOf(step)
  const preselectApplied = useRef(false)
  const { base } = useCustomerPortalBase()
  const isWebsite = isWebsiteFlowPolicy(policy)

  const cancelListingPath =
    listingPath ||
    (policy === 'admin'
      ? '/admin/application-management/marine'
      : isWebsite
        ? '/countries'
        : `${base}/applications`)

  const breadcrumb =
    breadcrumbItems.length > 0
      ? breadcrumbItems
      : isWebsite
        ? [{ label: 'Home', href: '/' }, { label: 'Apply' }]
        : [
            { label: 'Application Management', href: `${base}/applications` },
            { label: 'Application creation' },
          ]

  useEffect(() => {
    if (!preselectedCountryId || preselectApplied.current) return
    const country = getCountryById(preselectedCountryId)
    if (!country) return

    preselectApplied.current = true
    update({
      countryId: country.id,
      countryName: country.name,
      countryFlag: country.flags,
      visaOfferingId: '',
      visaType: '',
      visaTypeLabel: '',
      purpose: '',
      purposeLabel: '',
      entryType: '',
    })
    setStep('visa')
  }, [preselectedCountryId, update])

  useEffect(() => {
    if (!navState?.freshStart && !navState?.resumeDraft) return

    if (navState.freshStart) {
      preselectApplied.current = false
      reset()
      if (preselectedCountryId) {
        const country = getCountryById(preselectedCountryId)
        if (country) {
          preselectApplied.current = true
          update({
            countryId: country.id,
            countryName: country.name,
            countryFlag: country.flags,
            visaOfferingId: '',
            visaType: '',
            visaTypeLabel: '',
            purpose: '',
            purposeLabel: '',
            entryType: '',
          })
          setStep('visa')
        } else {
          setStep('country')
        }
      } else {
        setStep('country')
      }
    }

    navigate(location.pathname, { replace: true, state: null })
  }, [
    location.pathname,
    navState?.freshStart,
    navState?.resumeDraft,
    navigate,
    preselectedCountryId,
    reset,
    update,
  ])

  const flowSteps = useMemo(
    () =>
      APPLICATION_FLOW_STEPS.map(s => ({
        id: s,
        label: APPLICATION_FLOW_STEP_LABELS[s],
      })),
    [],
  )

  const handleStepClick = useCallback(
    (index: number) => {
      if (index <= stepIndex && index >= 0) setStep(APPLICATION_FLOW_STEPS[index])
    },
    [stepIndex],
  )

  const goBack = () => {
    const i = stepIndex
    if (i <= 0) {
      navigate(cancelListingPath)
      return
    }
    setStep(APPLICATION_FLOW_STEPS[i - 1])
  }

  const goNext = () => {
    const i = stepIndex
    if (i < APPLICATION_FLOW_STEPS.length - 1 && canAdvanceFromStep(step, state, policy)) {
      setStep(APPLICATION_FLOW_STEPS[i + 1])
    }
  }

  const canAdvance = canAdvanceFromStep(step, state, policy)

  return (
    <Box sx={{ width: '100%' }}>
      <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
        <Breadcrumb items={breadcrumb} />
      </Stack>

      <Box
        sx={{
          width: '100%',
          border: `${BORDER_WIDTH.thin} solid`,
          borderColor: 'divider',
          borderRadius: BORDER_RADIUS.lg,
          bgcolor: 'background.paper',
          boxShadow: SHADOWS.sm,
        }}
      >
        <Box
          sx={{
            px: { xs: 2, md: 3 },
            py: 1.5,
            borderBottom: `${BORDER_WIDTH.thin} solid`,
            borderColor: 'divider',
          }}
        >
          <ApplicationFlowStepper
            steps={flowSteps}
            activeIndex={stepIndex}
            onStepClick={handleStepClick}
            onPrevious={goBack}
            onNext={goNext}
            disablePrevious={stepIndex <= 0}
            disableNext={stepIndex >= APPLICATION_FLOW_STEPS.length - 1 || !canAdvance}
          />
        </Box>

        <Box sx={{ p: { xs: 2, md: 3 }, width: '100%', boxSizing: 'border-box' }}>
          {step === 'country' && (
            <CountrySelectionStep state={state} onUpdate={update} onContinue={goNext} />
          )}
          {step === 'visa' && (
            <SingleVisaPurposeStep state={state} onUpdate={update} onContinue={goNext} />
          )}
          {step === 'requirements' && (
            <RequirementPreviewStep state={state} onUpdate={update} onContinue={goNext} />
          )}
          {step === 'upload' && (
            <BulkApplicationUploadPage state={state} onUpdate={update} onContinue={goNext} />
          )}
          {step === 'details' && (
            <DetailsStep state={state} onUpdate={update} onContinue={goNext} />
          )}
          {step === 'submit' && (
            <ApplicationSubmitStep state={state} onSubmitted={reset} />
          )}
        </Box>
      </Box>
    </Box>
  )
}
