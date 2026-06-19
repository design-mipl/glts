import { Stack } from '@mui/material'
import type { QuotationRecord } from '@/shared/types/quotation'
import { getCurrentVersion } from '@/shared/utils/quotationValidation'
import { QuotationPricingMatrixTable } from '../QuotationPricingMatrixTable'
import { QuotationPricingSummary } from '../QuotationPricingSummary'

export function CurrentPricingTab({ quotation }: { quotation: QuotationRecord }) {
  const version = getCurrentVersion(quotation)
  if (!version) return null

  return (
    <Stack spacing={2}>
      <QuotationPricingMatrixTable
        workflowType={quotation.workflowType}
        pricingMatrix={version.pricingMatrix}
        onChange={() => {}}
        readOnly
      />
      <QuotationPricingSummary totals={version.totals} gstPercentage={quotation.gstPercentage} />
    </Stack>
  )
}
