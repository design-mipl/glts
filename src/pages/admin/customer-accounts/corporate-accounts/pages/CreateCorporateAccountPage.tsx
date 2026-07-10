import { CorporateAccountFormStepperPage } from './CorporateAccountFormStepperPage'

export function CreateCorporateAccountPage() {
  return (
    <CorporateAccountFormStepperPage
      mode="create"
      breadcrumbs={[
        { label: 'Client Management', href: '/admin/customer-accounts/corporate-accounts' },
        { label: 'Client Accounts', href: '/admin/customer-accounts/corporate-accounts' },
        { label: 'Create corporate account' },
      ]}
      cancelHref="/admin/customer-accounts/corporate-accounts"
    />
  )
}
