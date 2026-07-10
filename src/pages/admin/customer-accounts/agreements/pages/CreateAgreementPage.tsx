import { AgreementWorkspacePage } from './AgreementWorkspacePage'

export function CreateAgreementPage() {
  return (
    <AgreementWorkspacePage
      mode="create"
      breadcrumbs={[
        { label: 'Client Management', href: '/admin/customer-accounts/agreements' },
        { label: 'Agreements', href: '/admin/customer-accounts/agreements' },
        { label: 'Create agreement' },
      ]}
      cancelHref="/admin/customer-accounts/agreements"
    />
  )
}
