import { useState, useMemo, useCallback, useEffect } from 'react'
import { Box, Stack } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { useAppNavigate } from '@/shared/hooks/useAppNavigate'
import { Breadcrumb } from '@/design-system/UIComponents'
import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'
import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'
import { useApplicationFlowPolicy } from '../../context/ApplicationFlowPolicyContext'
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

export function CreateApplicationFlowPage() {
  const colors = usePublicBrandColors()
  const navigate = useAppNavigate()
  const location = useLocation()
  const navState = (location.state ?? null) as CreateApplicationLocationState | null
  const isFreshStart = Boolean(navState?.freshStart)

  const { policy, listingPath, breadcrumbItems, storageKey } = useApplicationFlowPolicy()
  const { state, update, reset } = useApplicationFlowState({
    startFresh: isFreshStart,
    storageKey,
  })

  const [step, setStep] = useState<ApplicationFlowStep>('country')
  const stepIndex = APPLICATION_FLOW_STEPS.indexOf(step)
  const { base } = useCustomerPortalBase()

  const cancelListingPath =
    listingPath || (policy === 'admin' ? '/admin/application-management/marine' : `${base}/applications`)

  const breadcrumb =
    breadcrumbItems.length > 0
      ? breadcrumbItems
      : [
          { label: 'Application Management', href: `${base}/applications` },
          { label: 'Application creation' },
        ]

  useEffect(() => {
    if (!navState?.freshStart && !navState?.resumeDraft) return

    if (navState.freshStart) {
      reset()
      setStep('country')
    }

    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, navState?.freshStart, navState?.resumeDraft, navigate, reset])

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
    <Box
      sx={{
        width: '100%',
        maxWidth: '100%',
        minHeight: 'calc(100vh - 56px)',
        bgcolor: colors.surface,
        fontFamily: publicFonts.body,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: '100%',
          mx: { xs: -2, md: -3 },
          px: { xs: 2, md: 3 },
          py: { xs: 2, md: 3 },
          boxSizing: 'border-box',
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.25} sx={{ mb: 1.5 }}>
          <Breadcrumb items={breadcrumb} />
        </Stack>

        <Box
          sx={{
            width: '100%',
            maxWidth: '100%',
            border: `1px solid ${colors.border}`,
            borderRadius: '14px',
            bgcolor: colors.white,
            boxShadow: '0 1px 3px rgba(15,23,42,0.06)',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              px: { xs: 2, md: 3 },
              py: 1.5,
              borderBottom: `1px solid ${colors.border}`,
              position: 'sticky',
              top: 0,
              zIndex: 10,
              bgcolor: colors.white,
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
    </Box>
  )
}
