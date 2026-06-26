import { Box, Stack, Typography } from '@mui/material'
import { ArrowRight, PencilLine, PauseCircle, Send } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import type { CommercialAgreement } from '@/shared/types/commercialAgreement'
import { formatAgreementDate } from '../utils/agreementFormUtils'
import {
  agreementStatusColor,
  agreementStatusLabel,
  agreementTypeColor,
  agreementTypeLabel,
  billingTypeColor,
  billingTypeLabel,
  canEditAgreement,
  canMarkReadyForActivation,
  canProceedToCorporateAccount,
  canUpdateAgreementHoldOrTerminate,
  workflowTypeColor,
  workflowTypeLabel,
} from '../config/agreementStatusConfig'

interface AgreementDetailSummaryProps {
  agreement: CommercialAgreement
  onEdit?: () => void
  onMarkReady?: () => void
  onProceedToCorporate?: () => void
  onUpdateStatus?: () => void
}

export function AgreementDetailSummary({
  agreement,
  onEdit,
  onMarkReady,
  onProceedToCorporate,
  onUpdateStatus,
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
                {billingTypeLabel[agreement.billingType]} · Start {formatAgreementDate(agreement.startDate)} · Expires{' '}
                {formatAgreementDate(agreement.endDate)}
              </Typography>
              {agreement.statusRemarks ? (
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.75 }}>
                  Latest status remarks: {agreement.statusRemarks}
                </Typography>
              ) : null}
            </Box>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
              {canEditAgreement(agreement.status) && onEdit ? (
                <Button
                  label="Edit"
                  size="sm"
                  variant="neutral"
                  startIcon={<PencilLine size={14} />}
                  onClick={onEdit}
                />
              ) : null}
              {canMarkReadyForActivation(agreement.status) && onMarkReady ? (
                <Button
                  label="Mark ready for activation"
                  size="sm"
                  startIcon={<Send size={14} />}
                  onClick={onMarkReady}
                />
              ) : null}
              {canProceedToCorporateAccount(agreement.status) && onProceedToCorporate ? (
                <Button
                  label="Proceed to corporate accounts"
                  size="sm"
                  startIcon={<ArrowRight size={14} />}
                  onClick={onProceedToCorporate}
                />
              ) : null}
              {canUpdateAgreementHoldOrTerminate(agreement.status) && onUpdateStatus ? (
                <Button
                  label="Update status"
                  size="sm"
                  variant="outlined"
                  startIcon={<PauseCircle size={14} />}
                  onClick={onUpdateStatus}
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
