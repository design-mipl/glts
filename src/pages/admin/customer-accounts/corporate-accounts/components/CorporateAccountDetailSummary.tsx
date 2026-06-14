import { Box, Stack, Typography } from '@mui/material'
import { PencilLine, Power, PowerOff, Send } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import type { CorporateAccount } from '@/shared/types/corporateAccount'
import { workflowTypeColor, workflowTypeLabel } from '../../agreements/config/agreementStatusConfig'
import { corporatePortalStatusColor, corporatePortalStatusLabel } from '../config/corporateAccountStatusConfig'

interface CorporateAccountDetailSummaryProps {
  account: CorporateAccount
  onEdit?: () => void
  onActivate?: () => void
  onDeactivate?: () => void
  onSendCredentials?: () => void
}

export function CorporateAccountDetailSummary({
  account,
  onEdit,
  onActivate,
  onDeactivate,
  onSendCredentials,
}: CorporateAccountDetailSummaryProps) {
  const workflowKey = account.workflowType as keyof typeof workflowTypeLabel

  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {account.companyName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {account.companyId} · {workflowTypeLabel[workflowKey]} · {account.branch || 'No branch'}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
              {account.portalStatus === 'draft' && onEdit ? (
                <Button
                  label="Edit"
                  size="sm"
                  variant="neutral"
                  startIcon={<PencilLine size={14} />}
                  onClick={onEdit}
                />
              ) : null}
              {account.portalStatus !== 'active' && onActivate ? (
                <Button label="Activate account" size="sm" startIcon={<Power size={14} />} onClick={onActivate} />
              ) : null}
              {account.portalStatus === 'active' && onDeactivate ? (
                <Button
                  label="Deactivate"
                  size="sm"
                  variant="outlined"
                  color="error"
                  startIcon={<PowerOff size={14} />}
                  onClick={onDeactivate}
                />
              ) : null}
              {onSendCredentials ? (
                <Button
                  label="Send login email"
                  size="sm"
                  variant="outlined"
                  color="secondary"
                  startIcon={<Send size={14} />}
                  onClick={onSendCredentials}
                />
              ) : null}
            </Stack>
          </Stack>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
            <Badge
              label={corporatePortalStatusLabel[account.portalStatus]}
              color={corporatePortalStatusColor[account.portalStatus]}
            />
            <Badge label={workflowTypeLabel[workflowKey]} color={workflowTypeColor[workflowKey]} size="sm" />
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
