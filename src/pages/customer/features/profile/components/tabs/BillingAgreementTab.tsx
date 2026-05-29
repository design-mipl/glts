import { Stack } from '@mui/material'
import { Download } from 'lucide-react'
import { Button, useToast } from '@/design-system/UIComponents'
import {
  CustomerInfoGrid,
  CustomerStatusChip,
  getCustomerStatusTone,
} from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { CustomerDetailSection } from '@/pages/customer/features/shared/components/detail'
import { ProfilePricingSection } from '../ProfilePricingSection'
import type { BillingAgreementData } from '../../types/accountWorkspace'

const agreementStatusLabel: Record<string, string> = {
  active: 'Active',
  expiring: 'Expiring soon',
  expired: 'Expired',
  pending: 'Pending',
}

export interface BillingAgreementTabProps {
  data: BillingAgreementData
  onDownloadAgreement?: () => void
}

export function BillingAgreementTab({ data, onDownloadAgreement }: BillingAgreementTabProps) {
  const { showToast } = useToast()
  const { agreement, pricingGroups, tax, invoiceRules } = data

  const handleDownload = () => {
    onDownloadAgreement?.()
    showToast({ title: 'Agreement download queued', variant: 'info' })
  }

  return (
    <>
      <CustomerDetailSection
        title="Agreement summary"
        action={
          <Button variant="outlined" startIcon={<Download size={16} />} onClick={handleDownload}>
            Download PDF
          </Button>
        }
      >
        <Stack direction="row" spacing={1} sx={{ mb: 2 }} flexWrap="wrap" useFlexGap>
          <CustomerStatusChip
            label={agreementStatusLabel[agreement.status] ?? agreement.status}
            tone={getCustomerStatusTone(agreement.status)}
          />
          <CustomerStatusChip label={agreement.creditTerms} tone="neutral" />
        </Stack>
        <CustomerInfoGrid
          items={[
            { label: 'Agreement type', value: agreement.agreementType },
            { label: 'Agreement start', value: agreement.startDate },
            { label: 'Agreement end', value: agreement.endDate },
            { label: 'Credit terms', value: agreement.creditTerms },
            { label: 'SLA summary', value: agreement.slaSummary },
            { label: 'Invoice rules', value: invoiceRules },
          ]}
        />
      </CustomerDetailSection>

      <CustomerDetailSection title="Pricing structure">
        <ProfilePricingSection groups={pricingGroups} />
      </CustomerDetailSection>

      <CustomerDetailSection title="Tax information" divider={false}>
        <CustomerInfoGrid
          columns={2}
          items={[
            { label: 'GST applicable', value: tax.gstApplicable ? 'Yes' : 'No' },
            { label: 'TDS applicable', value: tax.tdsApplicable ? 'Yes' : 'No' },
            { label: 'GST percentage', value: tax.gstPercentage },
            { label: 'TDS percentage', value: tax.tdsPercentage },
          ]}
        />
        <Stack direction="row" spacing={1} sx={{ mt: 2 }} flexWrap="wrap" useFlexGap>
          {tax.gstApplicable && <CustomerStatusChip label="GST registered" tone="success" />}
          {tax.tdsApplicable && <CustomerStatusChip label="TDS applicable" tone="info" />}
        </Stack>
      </CustomerDetailSection>
    </>
  )
}
