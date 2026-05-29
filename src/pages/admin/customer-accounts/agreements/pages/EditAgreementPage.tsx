import { useParams } from 'react-router-dom'
import { AgreementFormStepperPage } from './AgreementFormStepperPage'

export function EditAgreementPage() {
  const { agreementId } = useParams<{ agreementId: string }>()

  return (
    <AgreementFormStepperPage
      mode="edit"
      agreementId={agreementId}
      breadcrumbs={[
        { label: 'Customer & accounts', href: '/admin/customer-accounts/agreements' },
        { label: 'Agreements & contracts', href: '/admin/customer-accounts/agreements' },
        { label: 'Edit agreement' },
      ]}
      cancelHref="/admin/customer-accounts/agreements"
    />
  )
}
