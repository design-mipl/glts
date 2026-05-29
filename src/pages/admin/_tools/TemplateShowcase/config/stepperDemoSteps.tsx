import type { ReactNode } from 'react'
import type { AdminStepperFormStep } from '@/pages/admin/components/AdminStepperFormShell'
import type { AdminFullPageFormSection } from '@/pages/admin/components/AdminFullPageFormShell'
import { ADMIN_STEPPER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import type { TemplateDemoFormData } from './demoEntity'
import { TemplateDemoFormFields } from '../components/TemplateDemoFormFields'
import { TemplateDemoFormReview } from '../components/TemplateDemoFormReview'

/** Same primary + secondary section cards as the full-page form */
export function buildTemplateDemoFormSections(
  formData: TemplateDemoFormData,
  onChange: (next: TemplateDemoFormData) => void,
): AdminFullPageFormSection[] {
  return [
    {
      id: 'primary',
      title: 'Record details',
      columns: ADMIN_STEPPER_FORM_LAYOUT.primarySectionColumns,
      children: <TemplateDemoFormFields data={formData} onChange={onChange} bare />,
    },
    {
      id: 'secondary',
      title: 'Additional details',
      importance: 'secondary',
      columns: ADMIN_STEPPER_FORM_LAYOUT.secondarySectionColumns,
      children: (
        <TemplateDemoFormFields data={formData} onChange={onChange} variant="secondary" bare />
      ),
    },
  ]
}

export function buildTemplateStepperDemoSteps(
  formData: TemplateDemoFormData,
  onChange: (next: TemplateDemoFormData) => void,
  review?: ReactNode,
): AdminStepperFormStep[] {
  return [
    {
      id: 'details',
      label: 'Details',
      description: 'Primary & secondary section cards',
      sections: buildTemplateDemoFormSections(formData, onChange),
    },
    {
      id: 'review',
      label: 'Review',
      description: 'Confirm & submit',
      review: review ?? <TemplateDemoFormReview data={formData} />,
    },
  ]
}
