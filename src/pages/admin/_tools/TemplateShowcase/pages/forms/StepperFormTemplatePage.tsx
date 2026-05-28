import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { BaseCard, Button } from '@/design-system/UIComponents'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { ApplicationFlowStepper } from '@/pages/customer/features/applications/components/ApplicationFlowStepper'
import { getTemplateRecipeById } from '../../config/templateRegistry'
import { EMPTY_TEMPLATE_DEMO_FORM, type TemplateDemoFormData } from '../../config/demoEntity'
import { TemplateDemoFormFields } from '../../components/TemplateDemoFormFields'
import { TemplateShowcaseBanner } from '../../components/TemplateShowcaseBanner'

const steps = [
  { id: 'details', label: 'Details' },
  { id: 'assignment', label: 'Assignment' },
  { id: 'review', label: 'Review' },
]

export function StepperFormTemplatePage() {
  const recipe = getTemplateRecipeById('form-stepper')!
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<TemplateDemoFormData>(EMPTY_TEMPLATE_DEMO_FORM)

  const isLast = activeStep === steps.length - 1

  return (
    <Box>
      <TemplateShowcaseBanner components={recipe.components} />
      <AdminPageHeader
        title="Form — Stepper"
        description="Multi-step workflow with Stepper navigation, step panels, and review before submit."
      />

      <BaseCard>
        <Box sx={{ p: 2.5 }}>
          <ApplicationFlowStepper
            steps={steps}
            activeIndex={activeStep}
            onStepClick={index => {
              if (index <= activeStep) setActiveStep(index)
            }}
            onPrevious={() => setActiveStep(step => Math.max(0, step - 1))}
            onNext={() => setActiveStep(step => Math.min(steps.length - 1, step + 1))}
            disablePrevious={activeStep === 0}
            disableNext={isLast}
          />

          {activeStep === 0 && (
            <TemplateDemoFormFields data={formData} onChange={setFormData} />
          )}
          {activeStep === 1 && (
            <TemplateDemoFormFields
              data={formData}
              onChange={setFormData}
              compact
            />
          )}
          {activeStep === 2 && (
            <Stack spacing={1}>
              <Typography variant="body2" color="text.secondary">
                Review before submit
              </Typography>
              <Typography variant="body2">
                <strong>Reference:</strong> {formData.reference || '—'}
              </Typography>
              <Typography variant="body2">
                <strong>Name:</strong> {formData.name || '—'}
              </Typography>
              <Typography variant="body2">
                <strong>Country:</strong> {formData.country || '—'}
              </Typography>
            </Stack>
          )}

          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ mt: 3 }}>
            <Button
              label="Back"
              variant="outlined"
              disabled={activeStep === 0}
              onClick={() => setActiveStep((step) => Math.max(0, step - 1))}
            />
            {!isLast ? (
              <Button
                label="Next"
                variant="contained"
                onClick={() => setActiveStep((step) => Math.min(steps.length - 1, step + 1))}
              />
            ) : (
              <Button label="Submit" variant="contained" />
            )}
          </Stack>
        </Box>
      </BaseCard>
    </Box>
  )
}
