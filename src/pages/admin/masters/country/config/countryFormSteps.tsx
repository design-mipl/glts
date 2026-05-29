import type { AdminStepperFormStep } from '@/pages/admin/components/AdminStepperFormShell'
import { ADMIN_STEPPER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import type { CountryMasterFormData } from '@/shared/types/countryMaster'
import { CountryFormBasicFields } from '../components/CountryFormBasicFields'
import { CountryFormChecklistStep } from '../components/CountryChecklistTable'
import { CountryFormReview } from '../components/CountryFormReview'
import { CountryFormSegmentCards } from '../components/CountryFormSegmentCards'
import { CountryFormVisaTypesStep } from '../components/CountryVisaTypeAccordion'

export function buildCountryFormSteps(
  formData: CountryMasterFormData,
  onChange: (next: CountryMasterFormData) => void,
): AdminStepperFormStep[] {
  return [
    {
      id: 'basic',
      label: 'Basic details',
      description: 'Country identity & portal presentation',
      sections: [
        {
          id: 'primary',
          title: 'Country details',
          columns: ADMIN_STEPPER_FORM_LAYOUT.primarySectionColumns,
          children: <CountryFormBasicFields data={formData} onChange={onChange} />,
        },
        {
          id: 'portal',
          title: 'Portal presentation',
          description: 'Controls public website and customer portal destination cards.',
          importance: 'secondary',
          columns: ADMIN_STEPPER_FORM_LAYOUT.secondarySectionColumns,
          children: (
            <CountryFormBasicFields data={formData} onChange={onChange} variant="portal" />
          ),
        },
      ],
    },
    {
      id: 'segments',
      label: 'Business segments',
      description: 'Retail, Corporate, Marine',
      sections: [
        {
          id: 'segments-primary',
          title: 'Enable business segments',
          description: 'Select which segments this country supports. Each enabled segment gets its own configuration.',
          span: 2,
          columns: 1,
          children: <CountryFormSegmentCards data={formData} onChange={onChange} />,
        },
      ],
    },
    {
      id: 'visa-types',
      label: 'Visa types',
      description: 'Segment-wise visa configuration',
      sections: [
        {
          id: 'visa-types-primary',
          title: 'Configure visa types',
          description: 'Add visa types for each enabled business segment.',
          span: 2,
          columns: 1,
          children: <CountryFormVisaTypesStep data={formData} onChange={onChange} />,
        },
      ],
    },
    {
      id: 'checklist',
      label: 'Document checklist',
      description: 'Map documents per visa type',
      sections: [
        {
          id: 'checklist-primary',
          title: 'Document checklist mapping',
          description: 'Select documents from Document Master and set mandatory, OCR, and validation rules.',
          span: 2,
          columns: 1,
          children: <CountryFormChecklistStep data={formData} onChange={onChange} />,
        },
      ],
    },
    {
      id: 'review',
      label: 'Review & submit',
      description: 'Confirm configuration',
      review: <CountryFormReview data={formData} />,
    },
  ]
}
