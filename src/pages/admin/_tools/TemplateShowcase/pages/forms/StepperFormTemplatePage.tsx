import { useState } from 'react'
import { Box } from '@mui/material'
import { AdminStepperFormShell } from '@/pages/admin/components/AdminStepperFormShell'
import { getTemplateRecipeById } from '../../config/templateRegistry'
import { buildTemplateStepperDemoSteps } from '../../config/stepperDemoSteps'
import { EMPTY_TEMPLATE_DEMO_FORM, type TemplateDemoFormData } from '../../config/demoEntity'
import { TemplateShowcaseBanner } from '../../components/TemplateShowcaseBanner'

export function StepperFormTemplatePage() {
  const recipe = getTemplateRecipeById('form-stepper')!
  const [activeStep, setActiveStep] = useState(0)
  const [formData, setFormData] = useState<TemplateDemoFormData>(EMPTY_TEMPLATE_DEMO_FORM)

  return (
    <Box>
      <TemplateShowcaseBanner components={recipe.components} />
      <AdminStepperFormShell
        breadcrumbs={[
          { label: 'Templates', href: '/admin/tools/templates' },
          { label: 'Stepper form' },
        ]}
        steps={buildTemplateStepperDemoSteps(formData, setFormData)}
        activeStep={activeStep}
        onActiveStepChange={setActiveStep}
      />
    </Box>
  )
}
