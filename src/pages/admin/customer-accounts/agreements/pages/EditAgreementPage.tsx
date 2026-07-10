import { useParams } from 'react-router-dom'
import { AgreementWorkspacePage } from './AgreementWorkspacePage'

export function EditAgreementPage() {
  const { agreementId } = useParams<{ agreementId: string }>()

  return (
    <AgreementWorkspacePage
      mode="edit"
      agreementId={agreementId}
      breadcrumbs={[
        { label: 'Client Management', href: '/admin/customer-accounts/agreements' },
        { label: 'Agreements', href: '/admin/customer-accounts/agreements' },
        { label: 'Edit agreement' },
      ]}
      cancelHref="/admin/customer-accounts/agreements"
    />
  )
}
