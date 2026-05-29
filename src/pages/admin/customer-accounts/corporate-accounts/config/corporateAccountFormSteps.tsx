import type { AdminStepperFormStep } from '@/pages/admin/components/AdminStepperFormShell'
import { ADMIN_STEPPER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import { CorporateAccountAdminsSection } from '../components/CorporateAccountAdminsSection'
import { CorporateAccountAgreementSelectStep } from '../components/CorporateAccountAgreementSelectStep'
import { CorporateAccountEntitiesSection } from '../components/CorporateAccountEntitiesSection'
import { CorporateAccountPortalActivationFields } from '../components/CorporateAccountPortalActivationFields'
import { CorporateAccountReviewPanel } from '../components/CorporateAccountReviewPanel'
import { CorporateAccountSuperAdminFields } from '../components/CorporateAccountSuperAdminFields'
import { CorporateAccountVesselsSection } from '../components/CorporateAccountVesselsSection'
import { CorporateAccountWorkflowConfigFields } from '../components/CorporateAccountWorkflowConfigFields'

interface BuildCorporateAccountFormStepsOptions {
  corporateAccountId?: string
  onSelectAgreement: (agreementId: string) => void
}

export function buildCorporateAccountFormSteps(
  formData: CorporateAccountFormData,
  onChange: (next: CorporateAccountFormData) => void,
  options: BuildCorporateAccountFormStepsOptions,
): AdminStepperFormStep[] {
  return [
    {
      id: 'agreement',
      label: 'Select agreement',
      description: 'Approved commercial agreement',
      sections: [
        {
          id: 'agreement-primary',
          title: 'Agreement selection',
          description: 'Only approved agreements not yet linked to an active account are listed.',
          columns: ADMIN_STEPPER_FORM_LAYOUT.primarySectionColumns,
          children: (
            <CorporateAccountAgreementSelectStep
              data={formData}
              onChange={onChange}
              onSelectAgreement={options.onSelectAgreement}
              variant="selection"
            />
          ),
        },
        {
          id: 'agreement-secondary',
          title: 'Commercial summary',
          description: 'Inherited terms from the selected agreement.',
          importance: 'secondary',
          columns: ADMIN_STEPPER_FORM_LAYOUT.primarySectionColumns,
          children: (
            <CorporateAccountAgreementSelectStep
              data={formData}
              onChange={onChange}
              onSelectAgreement={options.onSelectAgreement}
              variant="summary"
            />
          ),
        },
      ],
    },
    {
      id: 'workflow',
      label: 'Workflow configuration',
      description: 'Portal workflow toggles',
      sections: [
        {
          id: 'workflow-primary',
          title: 'Workflow configuration',
          description: 'Enable marine, corporate, retail, and bulk upload workflows for this account.',
          span: 2,
          columns: 1,
          children: <CorporateAccountWorkflowConfigFields data={formData} onChange={onChange} />,
        },
      ],
    },
    {
      id: 'super-admin',
      label: 'Super admin',
      description: 'Primary portal administrator',
      sections: [
        {
          id: 'super-admin-primary',
          title: 'Super admin details',
          description: 'Primary portal administrator with full access.',
          columns: ADMIN_STEPPER_FORM_LAYOUT.primarySectionColumns,
          children: <CorporateAccountSuperAdminFields data={formData} onChange={onChange} variant="identity" />,
        },
        {
          id: 'super-admin-secondary',
          title: 'Portal credentials',
          description: 'Send login email or generate a temporary password.',
          importance: 'secondary',
          columns: 1,
          children: <CorporateAccountSuperAdminFields data={formData} onChange={onChange} variant="credentials" />,
        },
      ],
    },
    {
      id: 'admins',
      label: 'Admins',
      description: 'Additional administrators',
      sections: [
        {
          id: 'admins-primary',
          title: 'Additional admins',
          description: 'Optional administrators with scoped portal access.',
          span: 2,
          columns: 1,
          children: <CorporateAccountAdminsSection data={formData} onChange={onChange} />,
        },
      ],
    },
    {
      id: 'entities',
      label: 'Entity setup',
      description: 'Corporate entities',
      sections: [
        {
          id: 'entities-primary',
          title: 'Entities',
          description: 'Add billing and operational entities for this corporate account.',
          span: 2,
          columns: 1,
          children: (
            <CorporateAccountEntitiesSection
              data={formData}
              corporateAccountId={options.corporateAccountId}
              onChange={onChange}
            />
          ),
        },
      ],
    },
    {
      id: 'vessels',
      label: 'Vessel setup',
      description: 'Linked vessels',
      sections: [
        {
          id: 'vessels-primary',
          title: 'Vessels',
          description: 'Link vessels to entities for marine workflow applications.',
          span: 2,
          columns: 1,
          children: (
            <CorporateAccountVesselsSection
              data={formData}
              corporateAccountId={options.corporateAccountId}
              onChange={onChange}
            />
          ),
        },
      ],
    },
    {
      id: 'activation',
      label: 'Portal activation',
      description: 'Access permissions',
      sections: [
        {
          id: 'activation-primary',
          title: 'Portal access permissions',
          description: 'Control login, application creation, bulk upload, and visibility settings.',
          span: 2,
          columns: 1,
          children: <CorporateAccountPortalActivationFields data={formData} onChange={onChange} />,
        },
      ],
    },
    {
      id: 'review',
      label: 'Review & activate',
      description: 'Confirm and activate',
      review: <CorporateAccountReviewPanel data={formData} />,
    },
  ]
}
