import type { AdminStepperFormStep } from '@/pages/admin/components/AdminStepperFormShell'
import { ADMIN_STEPPER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { AgreementBillingConfigFields } from '../components/AgreementBillingConfigFields'
import { AgreementCompanyStepFields } from '../components/AgreementCompanyStepFields'
import { AgreementFinanceContactFields } from '../components/AgreementFinanceContactFields'
import { AgreementMiscCostsTable } from '../components/AgreementMiscCostsTable'
import { AgreementOnboardingDocumentCards } from '../components/AgreementOnboardingDocumentCards'
import { AgreementPricingMatrixTable } from '../components/AgreementPricingMatrixTable'
import { AgreementReviewPanel } from '../components/AgreementReviewPanel'

interface BuildAgreementFormStepsOptions {
  onSelectExisting: (companyId: string) => void
}

export function buildAgreementFormSteps(
  formData: CommercialAgreementFormData,
  onChange: (next: CommercialAgreementFormData) => void,
  options: BuildAgreementFormStepsOptions,
): AdminStepperFormStep[] {
  return [
    {
      id: 'company',
      label: 'Company information',
      description: 'Select or add company',
      sections: [
        {
          id: 'company-primary',
          title: 'Company details',
          description: 'Choose an existing company or register a new one for this agreement.',
          columns: ADMIN_STEPPER_FORM_LAYOUT.primarySectionColumns,
          children: (
            <AgreementCompanyStepFields
              data={formData}
              onChange={onChange}
              onSelectExisting={options.onSelectExisting}
              variant="selection"
            />
          ),
        },
        {
          id: 'company-secondary',
          title: 'Billing & tax identifiers',
          description: 'Required when adding a new company.',
          importance: 'secondary',
          columns: ADMIN_STEPPER_FORM_LAYOUT.secondarySectionColumns,
          children: (
            <AgreementCompanyStepFields
              data={formData}
              onChange={onChange}
              onSelectExisting={options.onSelectExisting}
              variant="billing"
            />
          ),
        },
      ],
    },
    {
      id: 'pricing',
      label: 'Pricing matrix',
      description: 'Visa pricing by country',
      sections: [
        {
          id: 'pricing-primary',
          title: 'Visa pricing matrix',
          description: 'Define service fees per country, visa type, and workflow.',
          span: 2,
          columns: 1,
          children: <AgreementPricingMatrixTable data={formData} onChange={onChange} />,
        },
      ],
    },
    {
      id: 'misc',
      label: 'Miscellaneous costs',
      description: 'Additional services',
      sections: [
        {
          id: 'misc-primary',
          title: 'Miscellaneous services',
          description: 'Courier, e-ticket, insurance, and other add-on charges.',
          span: 2,
          columns: 1,
          children: <AgreementMiscCostsTable data={formData} onChange={onChange} />,
        },
      ],
    },
    {
      id: 'billing',
      label: 'Billing & tax',
      description: 'Commercial terms',
      sections: [
        {
          id: 'billing-primary',
          title: 'Commercial terms',
          description: 'Agreement type, workflow, billing model, and validity period.',
          columns: ADMIN_STEPPER_FORM_LAYOUT.primarySectionColumns,
          children: <AgreementBillingConfigFields data={formData} onChange={onChange} variant="commercial" />,
        },
        {
          id: 'billing-secondary',
          title: 'Credit & tax configuration',
          description: 'Credit limits, billing cycle, GST, and TDS settings.',
          importance: 'secondary',
          columns: ADMIN_STEPPER_FORM_LAYOUT.primarySectionColumns,
          children: <AgreementBillingConfigFields data={formData} onChange={onChange} variant="creditTax" />,
        },
      ],
    },
    {
      id: 'documents',
      label: 'Onboarding documents',
      description: 'Finance contacts & uploads',
      sections: [
        {
          id: 'documents-primary',
          title: 'Finance contacts',
          description: 'Accounts team and invoice submission contacts.',
          columns: ADMIN_STEPPER_FORM_LAYOUT.primarySectionColumns,
          children: <AgreementFinanceContactFields data={formData} onChange={onChange} />,
        },
        {
          id: 'documents-secondary',
          title: 'Onboarding documents',
          description: 'Upload required compliance and agreement documents.',
          importance: 'secondary',
          span: 2,
          columns: 1,
          children: <AgreementOnboardingDocumentCards data={formData} onChange={onChange} />,
        },
      ],
    },
    {
      id: 'review',
      label: 'Review & approval',
      description: 'Confirm and submit',
      review: <AgreementReviewPanel data={formData} />,
    },
  ]
}
