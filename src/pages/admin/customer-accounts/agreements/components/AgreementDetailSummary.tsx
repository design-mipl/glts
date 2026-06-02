import { Stack, Typography } from '@mui/material'
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
      <Stack spacing={2} sx={{ p: 2.5 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
          <Stack spacing={0.75}>
            <Typography variant="h5" fontWeight={700}>
              {agreement.companyName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {agreement.agreementId} · {workflowTypeLabel[agreement.workflowType]} · {billingTypeLabel[agreement.billingType]}
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Badge label={agreementStatusLabel[agreement.status]} color={agreementStatusColor[agreement.status]} />
              <Badge label={agreementTypeLabel[agreement.agreementType]} color={agreementTypeColor[agreement.agreementType]} size="sm" />
              <Badge label={workflowTypeLabel[agreement.workflowType]} color={workflowTypeColor[agreement.workflowType]} size="sm" />
              <Badge label={billingTypeLabel[agreement.billingType]} color={billingTypeColor[agreement.billingType]} size="sm" />
            </Stack>
          </Stack>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {(agreement.status === 'draft' || agreement.status === 'submitted') && onEdit ? (
              <Button label="Edit" variant="outlined" startIcon={<PencilLine size={16} />} onClick={onEdit} />
            ) : null}
            {agreement.status === 'draft' && onSubmit ? (
              <Button label="Submit agreement" startIcon={<Send size={16} />} onClick={onSubmit} />
            ) : null}
            {agreement.status === 'submitted' && onApprove ? (
              <Button label="Approve" startIcon={<ShieldCheck size={16} />} onClick={onApprove} />
            ) : null}
            {agreement.status === 'submitted' && onReject ? (
              <Button label="Reject" variant="outlined" color="error" startIcon={<XCircle size={16} />} onClick={onReject} />
            ) : null}
            {agreement.status === 'approved' && onProceedToCorporate ? (
              <Button
                label="Proceed to corporate accounts"
                startIcon={<ArrowRight size={16} />}
                onClick={onProceedToCorporate}
              />
            ) : null}
          </Stack>
        </Stack>
      </Stack>
    </BaseCard>
  )
}
