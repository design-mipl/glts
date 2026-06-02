import { AgreementWorkspacePage } from './AgreementWorkspacePage'

export function CreateAgreementPage() {
  return (
    <AgreementWorkspacePage
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
