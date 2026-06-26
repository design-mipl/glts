import type { AdminStepperFormStep } from '@/pages/admin/components/AdminStepperFormShell'
import type { AdminFullPageFormSection } from '@/pages/admin/components/AdminFullPageFormShell'
import { ADMIN_STEPPER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { commercialAgreementService } from '@/shared/services/commercialAgreementService'
import type { CorporateAccountFormData } from '@/shared/types/corporateAccount'
import type { CorporateAccountSectionId } from '@/shared/utils/corporateAccountValidation'
import { CorporateAccountAdminsSection } from '../components/CorporateAccountAdminsSection'
import { CorporateAccountAgreementSelectStep } from '../components/CorporateAccountAgreementSelectStep'
import { CorporateAccountEntitiesSection } from '../components/CorporateAccountEntitiesSection'
import { CorporateAccountPortalActivationFields } from '../components/CorporateAccountPortalActivationFields'
import { CorporateAccountReviewPanel } from '../components/CorporateAccountReviewPanel'
import { CorporateAccountSuperAdminFields } from '../components/CorporateAccountSuperAdminFields'
import { CorporateAccountVesselsSection } from '../components/CorporateAccountVesselsSection'
import { CorporateAccountWorkflowConfigFields } from '../components/CorporateAccountWorkflowConfigFields'

export const CORPORATE_ACCOUNT_WORKSPACE_SECTIONS: {
  id: CorporateAccountSectionId
  navId: string
  label: string
  description: string
}[] = [
  {
    id: 'agreement',
    navId: 'section-agreement',
    label: 'Select agreement',
    description: 'Choose an approved commercial agreement to inherit terms and entities.',
  },
  {
    id: 'workflow',
    navId: 'section-workflow',
    label: 'Workflow configuration',
    description: 'Enable marine, corporate, retail, and bulk upload workflows for this account.',
  },
  {
    id: 'super-admin',
    navId: 'section-super-admin',
    label: 'Super admin',
    description: 'Set up the primary portal administrator and credentials.',
  },
  {
    id: 'admins',
    navId: 'section-admins',
    label: 'Admins',
    description: 'Add optional administrators with scoped portal access.',
  },
  {
    id: 'entities',
    navId: 'section-entities',
    label: 'Entity setup',
    description: 'Add billing and operational entities for this corporate account.',
  },
  {
    id: 'vessels',
    navId: 'section-vessels',
    label: 'Vessel setup',
    description: 'Link vessels to entities for marine workflow applications.',
  },
  {
    id: 'activation',
    navId: 'section-activation',
    label: 'Assign user',
    description: 'Select a team and assign users from User Management to this client.',
  },
  {
    id: 'review',
    navId: 'section-review',
    label: 'Review & activate',
    description: 'Confirm account details and activate portal access.',
  },
]

interface BuildCorporateAccountFormStepsOptions {
  corporateAccountId?: string
  onSelectAgreement: (agreementId: string) => void
}

export function buildCorporateAccountFormSteps(
  formData: CorporateAccountFormData,
  onChange: (next: CorporateAccountFormData) => void,
  options: BuildCorporateAccountFormStepsOptions,
): AdminStepperFormStep[] {
  const approvedForOnboarding = commercialAgreementService.listApprovedForOnboarding({
    excludeCorporateAccountId: options.corporateAccountId,
  })
  const hasApprovedAgreements = approvedForOnboarding.length > 0 || Boolean(formData.agreementId)

  const agreementSections: AdminFullPageFormSection[] = hasApprovedAgreements
    ? [
        {
          id: 'agreement-primary',
          title: 'Agreement selection',
          description: 'Only approved agreements not yet linked to an active account are listed.',
          span: 2,
          columns: 1,
          children: (
            <CorporateAccountAgreementSelectStep
              data={formData}
              onSelectAgreement={options.onSelectAgreement}
              corporateAccountId={options.corporateAccountId}
              variant="selection"
            />
          ),
        },
        {
          id: 'agreement-secondary',
          title: 'Commercial summary',
          description: 'Inherited terms from the selected agreement.',
          importance: 'secondary',
          span: 2,
          columns: ADMIN_STEPPER_FORM_LAYOUT.primarySectionColumns,
          children: (
            <CorporateAccountAgreementSelectStep
              data={formData}
              onSelectAgreement={options.onSelectAgreement}
              corporateAccountId={options.corporateAccountId}
              variant="summary"
            />
          ),
        },
      ]
    : [
        {
          id: 'agreement-empty',
          title: 'Agreement selection',
          description: 'Only approved agreements not yet linked to an active account are listed.',
          span: 2,
          columns: 1,
          children: (
            <CorporateAccountAgreementSelectStep
              data={formData}
              onSelectAgreement={options.onSelectAgreement}
              corporateAccountId={options.corporateAccountId}
              variant="selection"
            />
          ),
        },
      ]

  return [
    {
      id: 'agreement',
      label: 'Select agreement',
      description: 'Approved commercial agreement',
      sections: agreementSections,
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
      children: <CorporateAccountAdminsSection data={formData} onChange={onChange} />,
    },
    {
      id: 'entities',
      label: 'Entity setup',
      description: 'Corporate entities',
      children: (
        <CorporateAccountEntitiesSection
          data={formData}
          corporateAccountId={options.corporateAccountId}
          onChange={onChange}
        />
      ),
    },
    {
      id: 'vessels',
      label: 'Vessel setup',
      description: 'Linked vessels',
      children: (
        <CorporateAccountVesselsSection
          data={formData}
          corporateAccountId={options.corporateAccountId}
          onChange={onChange}
        />
      ),
    },
    {
      id: 'activation',
      label: 'Assign user',
      description: 'Team leader and team assignment',
      children: <CorporateAccountPortalActivationFields data={formData} onChange={onChange} />,
    },
    {
      id: 'review',
      label: 'Review & activate',
      description: 'Confirm and activate',
      review: <CorporateAccountReviewPanel data={formData} />,
    },
  ]
}
