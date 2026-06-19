import { Box, Stack, Typography } from '@mui/material'
import { ArrowRight, PencilLine, Send, ShieldCheck, XCircle } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import {
  agreementStatusColor,
  agreementStatusLabel,
  agreementTypeColor,
  agreementTypeLabel,
  billingTypeColor,
  billingTypeLabel,
  workflowTypeColor,
  workflowTypeLabel,
} from '../config/agreementStatusConfig'

interface AgreementDetailSummaryProps {
  agreement: CommercialAgreement
  onEdit?: () => void
  onSubmit?: () => void
  onApprove?: () => void
  onReject?: () => void
  onProceedToCorporate?: () => void
}

export function AgreementDetailSummary({
  agreement,
  onEdit,
  onSubmit,
  onApprove,
  onReject,
  onProceedToCorporate,
}: AgreementDetailSummaryProps) {
  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {agreement.companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {agreement.agreementId} · {workflowTypeLabel[agreement.workflowType]} ·{' '}
                {billingTypeLabel[agreement.billingType]}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
              {(agreement.status === 'draft' || agreement.status === 'submitted') && onEdit ? (
                <Button
                  label="Edit"
                  size="sm"
                  variant="neutral"
                  startIcon={<PencilLine size={14} />}
                  onClick={onEdit}
                />
              ) : null}
              {agreement.status === 'draft' && onSubmit ? (
                <Button label="Submit agreement" size="sm" startIcon={<Send size={14} />} onClick={onSubmit} />
              ) : null}
              {agreement.status === 'submitted' && onApprove ? (
                <Button label="Approve" size="sm" startIcon={<ShieldCheck size={14} />} onClick={onApprove} />
              ) : null}
              {agreement.status === 'submitted' && onReject ? (
                <Button
                  label="Reject"
                  size="sm"
                  variant="outlined"
                  color="error"
                  startIcon={<XCircle size={14} />}
                  onClick={onReject}
                />
              ) : null}
              {agreement.status === 'approved' && onProceedToCorporate ? (
                <Button
                  label="Proceed to corporate accounts"
                  size="sm"
                  startIcon={<ArrowRight size={14} />}
                  onClick={onProceedToCorporate}
                />
              ) : null}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <Badge label={agreementStatusLabel[agreement.status]} color={agreementStatusColor[agreement.status]} />
            <Badge
              label={agreementTypeLabel[agreement.agreementType]}
              color={agreementTypeColor[agreement.agreementType]}
              size="sm"
            />
            <Badge
              label={workflowTypeLabel[agreement.workflowType]}
              color={workflowTypeColor[agreement.workflowType]}
              size="sm"
            />
            <Badge
              label={billingTypeLabel[agreement.billingType]}
              color={billingTypeColor[agreement.billingType]}
              size="sm"
            />
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
