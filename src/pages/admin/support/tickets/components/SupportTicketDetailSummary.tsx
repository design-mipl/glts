import { Box, Stack, Typography } from '@mui/material'
import { CheckCircle2, MessageSquare, UserCog } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import { supportTicketService } from '@/shared/services/supportTicketService'
import type { SupportTicket } from '@/shared/types/supportTicket'
import {
  supportTicketPriorityColor,
  supportTicketPriorityLabel,
  supportTicketStatusColor,
  supportTicketStatusLabel,
} from '../config/supportTicketStatusConfig'
import { formatSupportTicketDate } from '../utils/supportTicketListingUtils'

interface SupportTicketDetailSummaryProps {
  ticket: SupportTicket
  onAssign: () => void
  onUpdateStatus: () => void
  onResolve: () => void
  onFocusConversation: () => void
}

export function SupportTicketDetailSummary({
  ticket,
  onAssign,
  onUpdateStatus,
  onResolve,
  onFocusConversation,
}: SupportTicketDetailSummaryProps) {
  const canResolve = !['resolved', 'closed'].includes(ticket.status)

  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {ticket.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {ticket.ticketNumber} · {ticket.customerName}
                {ticket.companyName ? ` · ${ticket.companyName}` : ''} · Updated{' '}
                {formatSupportTicketDate(ticket.updatedAt)}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={0.75}
              useFlexGap
              sx={{ flexWrap: 'wrap', alignItems: 'center', alignSelf: { xs: 'stretch', md: 'flex-start' } }}
            >
              <Button
                label="Conversation"
                size="sm"
                variant="neutral"
                startIcon={<MessageSquare size={14} />}
                onClick={onFocusConversation}
              />
              <Button
                label="Assign"
                size="sm"
                variant="neutral"
                startIcon={<UserCog size={14} />}
                onClick={onAssign}
              />
              <Button label="Update status" size="sm" variant="neutral" onClick={onUpdateStatus} />
              {canResolve ? (
                <Button
                  label="Mark resolved"
                  size="sm"
                  startIcon={<CheckCircle2 size={14} />}
                  onClick={onResolve}
                />
              ) : null}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge
              label={supportTicketStatusLabel[ticket.status]}
              color={supportTicketStatusColor[ticket.status]}
              size="sm"
            />
            <Badge
              label={supportTicketPriorityLabel[ticket.priority]}
              color={supportTicketPriorityColor[ticket.priority]}
              size="sm"
            />
            <Badge
              label={supportTicketService.getCategoryLabel(ticket.category)}
              color="neutral"
              size="sm"
            />
            <Badge
              label={ticket.portal === 'business' ? 'Business portal' : 'Retail portal'}
              color="info"
              size="sm"
            />
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
