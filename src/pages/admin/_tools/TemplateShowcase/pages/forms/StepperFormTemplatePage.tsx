import { useState } from 'react'
import { Box } from '@mui/material'
import { AdminStepperFormFooter } from '@/pages/admin/components/AdminStepperFormFooter'
import { AdminStepperFormShell } from '@/pages/admin/components/AdminStepperFormShell'
import { getTemplateRecipeById } from '../../config/templateRegistry'
import { buildTemplateStepperDemoSteps } from '../../config/stepperDemoSteps'
import { EMPTY_TEMPLATE_DEMO_FORM, type TemplateDemoFormData } from '../../config/demoEntity'
import { TemplateShowcaseBanner } from '../../components/TemplateShowcaseBanner'

export function StepperFormTemplatePage() {
  const recipe = getTemplateRecipeById('form-stepper')!
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<TemplateDemoFormData>(EMPTY_TEMPLATE_DEMO_FORM)
  const steps = buildTemplateStepperDemoSteps(formData, setFormData)

  return (
    <Box>
      <TemplateShowcaseBanner components={recipe.components} />
      <AdminStepperFormShell
        breadcrumbs={[
          { label: 'Templates', href: '/admin/tools/templates' },
          { label: 'Stepper form' },
        ]}
        steps={steps}
        activeStep={activeStep}
        onActiveStepChange={setActiveStep}
        footer={
          <AdminStepperFormFooter
            activeStep={activeStep}
            isLastStep={activeStep >= steps.length - 1}
            onCancel={() => setActiveStep(0)}
            onBack={() => setActiveStep((s) => Math.max(0, s - 1))}
            onNext={() => setActiveStep((s) => Math.min(steps.length - 1, s + 1))}
            onSubmit={() => setActiveStep(0)}
          />
        }
      />
    </Box>
  )
}
