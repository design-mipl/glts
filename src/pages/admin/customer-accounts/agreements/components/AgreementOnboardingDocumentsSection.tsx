import { Stack } from '@mui/material'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { splitAgreementDocuments } from '@/shared/utils/agreementDocumentUtils'
import { AgreementFinanceContactFields } from './AgreementFinanceContactFields'
import { AgreementOnboardingDocumentCards } from './AgreementOnboardingDocumentCards'

interface AgreementOnboardingDocumentsSectionProps {
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
}

/** @deprecated Use AgreementFinanceContactFields + AgreementOnboardingDocumentCards in stepper sections */
export function AgreementOnboardingDocumentsSection({ data, onChange }: AgreementOnboardingDocumentsSectionProps) {
  const { onboardingDocuments } = splitAgreementDocuments(data.documents)

  return (
    <Stack spacing={3}>
      <AgreementFinanceContactFields data={data} onChange={onChange} />
      <AgreementOnboardingDocumentCards documents={onboardingDocuments} data={data} onChange={onChange} />
    </Stack>
  )
}
