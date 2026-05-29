import { Stack } from '@mui/material'
import type { CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import { AgreementFinanceContactFields } from './AgreementFinanceContactFields'
import { AgreementOnboardingDocumentCards } from './AgreementOnboardingDocumentCards'

interface AgreementOnboardingDocumentsSectionProps {
  data: CommercialAgreementFormData
  onChange: (next: CommercialAgreementFormData) => void
}

/** @deprecated Use AgreementFinanceContactFields + AgreementOnboardingDocumentCards in stepper sections */
export function AgreementOnboardingDocumentsSection({ data, onChange }: AgreementOnboardingDocumentsSectionProps) {
  return (
    <Stack spacing={3}>
      <AgreementFinanceContactFields data={data} onChange={onChange} />
      <AgreementOnboardingDocumentCards data={data} onChange={onChange} />
    </Stack>
  )
}
