import { Box, Stack, Typography } from '@mui/material'
import { ArrowRight, FileText, PencilLine, Share2 } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import type { QuotationRecord } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getCurrentVersion } from '@/shared/utils/quotationValidation'
import {
  quotationSharedStatusColor,
  quotationSharedStatusLabel,
  quotationSourceTypeLabel,
  workflowTypeColor,
  workflowTypeLabel,
} from '../config/quotationStatusConfig'

interface QuotationDetailSummaryProps {
  quotation: QuotationRecord
  onEdit?: () => void
  onShare?: () => void
  onGeneratePdf?: () => void
  onConvert?: () => void
}

export function QuotationDetailSummary({
  quotation,
  onEdit,
  onShare,
  onGeneratePdf,
  onConvert,
}: QuotationDetailSummaryProps) {
  const version = getCurrentVersion(quotation)
  const canConvert = !quotation.convertedAgreementId && quotation.pricingVersions.some((v) => v.pricingMatrix.length > 0)

  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {quotation.customer.companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {quotation.quotationNo} · {quotationSourceTypeLabel[quotation.sourceType]} ·{' '}
                {workflowTypeLabel[quotation.workflowType]}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
              {onEdit ? (
                <Button label="Edit" size="sm" variant="neutral" startIcon={<PencilLine size={14} />} onClick={onEdit} />
              ) : null}
              {quotation.sharedStatus === 'not_shared' && onShare ? (
                <Button label="Share" size="sm" startIcon={<Share2 size={14} />} onClick={onShare} />
              ) : null}
              {onGeneratePdf ? (
                <Button label="Generate PDF" size="sm" variant="neutral" startIcon={<FileText size={14} />} onClick={onGeneratePdf} />
              ) : null}
              {canConvert && onConvert ? (
                <Button label="Convert to Agreement" size="sm" startIcon={<ArrowRight size={14} />} onClick={onConvert} />
              ) : null}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap' }}>
            <Badge
              label={quotationSharedStatusLabel[quotation.sharedStatus]}
              color={quotationSharedStatusColor[quotation.sharedStatus]}
              size="sm"
            />
            <Badge label={workflowTypeLabel[quotation.workflowType]} color={workflowTypeColor[quotation.workflowType]} size="sm" />
            {version ? (
              <Badge label={`${version.versionLabel} · ${formatInr(version.totals.grandTotal)}`} color="neutral" size="sm" />
            ) : null}
            {quotation.pricingVersions.length > 1 ? (
              <Badge label={`${quotation.pricingVersions.length} pricing versions`} color="info" size="sm" />
            ) : null}
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
