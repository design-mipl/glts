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
import { CorporateAccountBookersSection } from '../components/CorporateAccountBookersSection'

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
    description: 'Choose a commercial agreement ready for activation and select the portal workflow.',
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
    id: 'bookers',
    navId: 'section-bookers',
    label: 'Booker setup',
    description: 'Add portal bookers who can create and manage visa applications.',
  },
  {
    id: 'activation',
    navId: 'section-activation',
    label: 'Assign user',
    description: 'Select teams and users from User Management, then mark primary and secondary contacts.',
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
  const readyForActivation = commercialAgreementService.listReadyForActivationForOnboarding({
    excludeCorporateAccountId: options.corporateAccountId,
  })
  const hasReadyAgreements = readyForActivation.length > 0 || Boolean(formData.agreementId)

  const agreementSections: AdminFullPageFormSection[] = hasReadyAgreements
    ? [
        {
          id: 'agreement-primary',
          title: 'Agreement selection',
          description:
            'Ready for activation only — agreements not yet linked to a corporate account.',
          span: 2,
          columns: 1,
          children: (
            <CorporateAccountAgreementSelectStep
              data={formData}
              onChange={onChange}
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
              onChange={onChange}
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
          description:
            'Ready for activation only — agreements not yet linked to a corporate account.',
          span: 2,
          columns: 1,
          children: (
            <CorporateAccountAgreementSelectStep
              data={formData}
              onChange={onChange}
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
      description: 'Agreement and portal workflow',
      sections: agreementSections,
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
          description: 'Enter a portal password or generate a temporary one.',
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
      id: 'bookers',
      label: 'Booker setup',
      description: 'Portal bookers',
      children: (
        <CorporateAccountBookersSection
          data={formData}
          corporateAccountId={options.corporateAccountId}
          onChange={onChange}
        />
      ),
    },
    {
      id: 'activation',
      label: 'Assign user',
      description: 'Team leaders, team users, and contact roles',
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
