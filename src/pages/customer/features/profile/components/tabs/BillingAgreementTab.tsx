import { AgreementDocumentsSection } from '../billing/AgreementDocumentsSection'
import { AgreementSummarySection } from '../billing/AgreementSummarySection'
import { BillingSummarySection } from '../billing/BillingSummarySection'
import { FinanceContactsSection } from '../billing/FinanceContactsSection'
import type { BillingAgreementData } from '../../types/accountWorkspace'

export interface BillingAgreementTabProps {
  data: BillingAgreementData
}

export function BillingAgreementTab({ data }: BillingAgreementTabProps) {
  return (
    <>
      <AgreementSummarySection agreement={data.agreement} />
      <BillingSummarySection
        billingType={data.agreement.billingType}
        summary={data.billingSummary}
        billingConfig={data.billingConfig}
      />
      <AgreementDocumentsSection documents={data.documents} />
      <FinanceContactsSection financeContactPersons={data.financeContactPersons} />
    </>
  )
}
