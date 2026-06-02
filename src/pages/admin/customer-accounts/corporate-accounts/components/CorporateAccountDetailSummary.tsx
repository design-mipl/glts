import { Stack, Typography } from '@mui/material'
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
      <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2} sx={{ p: 2.5 }}>
        <Stack spacing={0.75}>
          <Typography variant="h5" fontWeight={700}>
            {account.companyName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {account.companyId} · {workflowTypeLabel[workflowKey]} · {account.branch || 'No branch'}
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Badge label={corporatePortalStatusLabel[account.portalStatus]} color={corporatePortalStatusColor[account.portalStatus]} />
            <Badge label={workflowTypeLabel[workflowKey]} color={workflowTypeColor[workflowKey]} size="sm" />
          </Stack>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {account.portalStatus === 'draft' && onEdit ? (
            <Button label="Edit" variant="outlined" startIcon={<PencilLine size={16} />} onClick={onEdit} />
          ) : null}
          {account.portalStatus !== 'active' && onActivate ? (
            <Button label="Activate account" startIcon={<Power size={16} />} onClick={onActivate} />
          ) : null}
          {account.portalStatus === 'active' && onDeactivate ? (
            <Button label="Deactivate" variant="outlined" startIcon={<PowerOff size={16} />} onClick={onDeactivate} />
          ) : null}
          {onSendCredentials ? (
            <Button label="Send login credentials" variant="outlined" startIcon={<Send size={16} />} onClick={onSendCredentials} />
          ) : null}
        </Stack>
      </Stack>
    </BaseCard>
  )
}
