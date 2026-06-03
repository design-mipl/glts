import { useState, useMemo, useCallback, useEffect } from 'react'

import { Box, Stack } from '@mui/material'

import { useLocation, useNavigate } from 'react-router-dom'

import { Breadcrumb } from '@/design-system/UIComponents'

import { useCustomerPortalBase } from '@/pages/customer/features/shared/hooks/useCustomerPortalBase'

import { publicFonts, usePublicBrandColors } from '@/shared/theme/publicBrand'

import { useApplicationFlowState, type ApplicationFlowState } from '../../hooks/useApplicationFlowState'
import type { CreateApplicationLocationState } from '../../utils/createApplicationNavigation'

import { ApplicationFlowStepper } from '../../components/ApplicationFlowStepper'

import { CountrySelectionStep } from './steps/CountrySelectionStep'

import { BulkApplicationUploadPage } from './steps/BulkApplicationUploadPage'

import { DetailsStep } from './steps/DetailsStep'

import { ApplicationSubmitStep } from './steps/ApplicationSubmitStep'

import { SingleVisaPurposeStep } from './steps/single/SingleVisaPurposeStep'

import { RequirementPreviewStep } from './steps/single/RequirementPreviewStep'



const FLOW_STEPS = ['country', 'visa', 'requirements', 'upload', 'details', 'submit'] as const

type FlowStep = (typeof FLOW_STEPS)[number]



const stepLabels: Record<FlowStep, string> = {

  country: 'Country',

  visa: 'Visa',

  requirements: 'Requirements',

  upload: 'Documents',

  details: 'Details',

  submit: 'Submit',

}

function canAdvanceFromStep(step: FlowStep, state: ApplicationFlowState): boolean {
  switch (step) {
    case 'country':
      return Boolean(state.countryId)
    case 'visa':
      return Boolean(state.visaOfferingId)
    case 'requirements':
      return Boolean(state.visaOfferingId && state.travelDate)
    case 'upload':
      return state.uploadQueueRows.length > 0
    case 'details':
      return true
    case 'submit':
      return false
    default:
      return false
  }
}



export function CreateApplicationFlowPage() {

  const colors = usePublicBrandColors()

  const navigate = useNavigate()
  const location = useLocation()
  const navState = (location.state ?? null) as CreateApplicationLocationState | null
  const isFreshStart = Boolean(navState?.freshStart)

  const { state, update, reset } = useApplicationFlowState({ startFresh: isFreshStart })

  const [step, setStep] = useState<FlowStep>('country')

  const stepIndex = FLOW_STEPS.indexOf(step)

  const { base } = useCustomerPortalBase()

  useEffect(() => {
    if (!navState?.freshStart && !navState?.resumeDraft) return

    if (navState.freshStart) {
      reset()
      setStep('country')
    }

    navigate(location.pathname, { replace: true, state: null })
  }, [location.pathname, navState?.freshStart, navState?.resumeDraft, navigate, reset])



  const flowSteps = useMemo(

    () => FLOW_STEPS.map(s => ({ id: s, label: stepLabels[s] })),

    [],

  )



  const handleStepClick = useCallback(

    (index: number) => {

      if (index <= stepIndex && index >= 0) setStep(FLOW_STEPS[index])

    },

    [stepIndex],

  )



  const goBack = () => {

    const i = stepIndex

    if (i <= 0) {

      navigate(`${base}/applications`)

      return

    }

    setStep(FLOW_STEPS[i - 1])

  }



  const goNext = () => {

    const i = stepIndex

    if (i < FLOW_STEPS.length - 1 && canAdvanceFromStep(step, state)) setStep(FLOW_STEPS[i + 1])

  }

  const canAdvance = canAdvanceFromStep(step, state)



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
          <Breadcrumb
            items={[
              { label: 'Application Management', href: `${base}/applications` },
              { label: 'Application creation' },
            ]}
          />

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
              disableNext={stepIndex >= FLOW_STEPS.length - 1 || !canAdvance}
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


