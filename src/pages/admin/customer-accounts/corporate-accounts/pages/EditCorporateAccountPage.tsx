import { useParams } from 'react-router-dom'
import { CorporateAccountFormStepperPage } from './CorporateAccountFormStepperPage'

export function EditCorporateAccountPage() {
  const { accountId } = useParams<{ accountId: string }>()

  return (
    <CorporateAccountFormStepperPage
      mode="edit"
      accountId={accountId}
      breadcrumbs={[
        { label: 'Client Management', href: '/admin/customer-accounts/corporate-accounts' },
        { label: 'Client Accounts', href: '/admin/customer-accounts/corporate-accounts' },
        { label: 'Edit corporate account' },
      ]}
      cancelHref="/admin/customer-accounts/corporate-accounts"
    />
  )
}
