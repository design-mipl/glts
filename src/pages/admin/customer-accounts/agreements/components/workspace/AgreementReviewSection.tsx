import { Box, Stack, Typography } from '@mui/material'
import { alpha, useTheme } from '@mui/material/styles'
import { useNavigate } from 'react-router-dom'
import { Badge, Button } from '@/design-system/UIComponents'
import { validateForActivation } from '@/shared/utils/commercialAgreementValidation'
import type { AgreementStatus, CommercialAgreementFormData } from '@/shared/types/commercialAgreement'
import {
  canMarkReadyForActivation,
  canProceedToCorporateAccount,
} from '../../config/agreementStatusConfig'
import { AgreementReviewPanel } from '../AgreementReviewPanel'

interface AgreementReviewSectionProps {
  data: CommercialAgreementFormData
  agreementRecordId?: string
  agreementDisplayId?: string
  status?: AgreementStatus
  statusLabel?: string
  onMarkReady?: () => void
}

export function AgreementReviewSection({
  data,
  agreementRecordId,
  agreementDisplayId,
  status = 'draft',
  statusLabel,
  onMarkReady,
}: AgreementReviewSectionProps) {
  const theme = useTheme()
  const navigate = useNavigate()
  const validation = validateForActivation(data)

  return (
    <Stack spacing={2}>
      <AgreementReviewPanel
        data={data}
        agreementId={agreementDisplayId}
        statusLabel={statusLabel}
      />

      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: 1.5,
          px: 1.5,
          py: 1.25,
          bgcolor: theme.palette.mode === 'light' ? '#fff' : alpha('#fff', 0.02),
        }}
      >
        <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 1 }}>
          Validation checklist
        </Typography>
        {validation.ok ? (
          <Badge label="All required fields and documents are complete" color="success" size="sm" />
        ) : (
          <Stack direction="row" flexWrap="wrap" gap={0.75}>
            {validation.issues.map((issue) => (
              <Badge key={issue} label={issue} color="warning" size="sm" />
            ))}
          </Stack>
        )}
      </Box>

      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        {canMarkReadyForActivation(status) && onMarkReady ? (
          <Button
            label="Mark ready for activation"
            onClick={onMarkReady}
            disabled={!validation.ok}
          />
        ) : null}
        {canProceedToCorporateAccount(status) && agreementRecordId ? (
          <Button
            label="Proceed to corporate accounts"
            onClick={() =>
              navigate(`/admin/customer-accounts/corporate-accounts/new?agreementId=${agreementRecordId}`)
            }
          />
        ) : null}
      </Stack>
    </Stack>
  )
}
