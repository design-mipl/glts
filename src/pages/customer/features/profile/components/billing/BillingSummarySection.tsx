import { CustomerInfoGrid } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail'
import { buildBillingSummaryItems } from '../../utils/buildBillingSummaryItems'
import type { BillingAgreementData, BillingSummary, BillingType } from '../../types/accountWorkspace'

export interface BillingSummarySectionProps {
  billingType: BillingType
  summary: BillingSummary
  billingConfig: BillingAgreementData['billingConfig']
}

export function BillingSummarySection({ billingType, summary, billingConfig }: BillingSummarySectionProps) {
  return (
    <CustomerDetailSection title="Billing summary">
      <CustomerInfoGrid columns={2} items={buildBillingSummaryItems(billingType, summary, billingConfig)} />
    </CustomerDetailSection>
  )
}
