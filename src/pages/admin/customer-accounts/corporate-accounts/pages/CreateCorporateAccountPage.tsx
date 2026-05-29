import { CorporateAccountFormStepperPage } from './CorporateAccountFormStepperPage'

export function CreateCorporateAccountPage() {
  return (
    <CorporateAccountFormStepperPage
      mode="create"
      breadcrumbs={[
        { label: 'Customer & accounts', href: '/admin/customer-accounts/corporate-accounts' },
        { label: 'Corporate accounts', href: '/admin/customer-accounts/corporate-accounts' },
        { label: 'Create corporate account' },
      ]}
      cancelHref="/admin/customer-accounts/corporate-accounts"
    />
  )
}
