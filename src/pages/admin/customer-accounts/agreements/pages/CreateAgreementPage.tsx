import { AgreementFormStepperPage } from './AgreementFormStepperPage'

export function CreateAgreementPage() {
  return (
    <AgreementFormStepperPage
      mode="create"
      breadcrumbs={[
        { label: 'Customer & accounts', href: '/admin/customer-accounts/agreements' },
        { label: 'Agreements & contracts', href: '/admin/customer-accounts/agreements' },
        { label: 'Create agreement' },
      ]}
      cancelHref="/admin/customer-accounts/agreements"
    />
  )
}
