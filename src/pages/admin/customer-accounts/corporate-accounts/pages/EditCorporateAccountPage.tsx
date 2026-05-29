import { useParams } from 'react-router-dom'
import { CorporateAccountFormStepperPage } from './CorporateAccountFormStepperPage'

export function EditCorporateAccountPage() {
  const { accountId } = useParams<{ accountId: string }>()

  return (
    <CorporateAccountFormStepperPage
      mode="edit"
      accountId={accountId}
      breadcrumbs={[
        { label: 'Customer & accounts', href: '/admin/customer-accounts/corporate-accounts' },
        { label: 'Corporate accounts', href: '/admin/customer-accounts/corporate-accounts' },
        { label: 'Edit corporate account' },
      ]}
      cancelHref="/admin/customer-accounts/corporate-accounts"
    />
  )
}
