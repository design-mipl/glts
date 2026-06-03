import { Stack } from '@mui/material'
import {
  CustomerInfoGrid,
  CustomerStatusChip,
  getCustomerStatusTone,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail'
import type { AgreementSummary, BillingType } from '../../types/accountWorkspace'

const agreementStatusLabel: Record<string, string> = {
  active: 'Active',
  expiring: 'Expiring soon',
  expired: 'Expired',
  pending: 'Pending',
}

const billingTypeLabel: Record<BillingType, string> = {
  credit: 'Credit',
  advance: 'Advance',
  mixed: 'Mixed',
}

export interface AgreementSummarySectionProps {
  agreement: AgreementSummary
}

export function AgreementSummarySection({ agreement }: AgreementSummarySectionProps) {
  return (
    <CustomerDetailSection title="Agreement summary">
      <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
        <CustomerStatusChip
          label={agreementStatusLabel[agreement.status] ?? agreement.status}
          tone={getCustomerStatusTone(agreement.status)}
        />
        <CustomerStatusChip label={billingTypeLabel[agreement.billingType]} tone="info" />
        <CustomerStatusChip label={agreement.workflowType} tone="neutral" />
      </Stack>
      <CustomerInfoGrid
        items={[
          { label: 'Agreement status', value: agreementStatusLabel[agreement.status] ?? agreement.status },
          { label: 'Agreement type', value: agreement.agreementType },
          { label: 'Billing type', value: billingTypeLabel[agreement.billingType] },
          { label: 'Workflow type', value: agreement.workflowType },
          { label: 'Agreement start date', value: agreement.startDate },
          { label: 'Agreement end date', value: agreement.endDate },
        ]}
      />
    </CustomerDetailSection>
  )
}
