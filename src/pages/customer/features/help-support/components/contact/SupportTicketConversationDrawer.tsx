import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { FileText, Headphones, Paperclip, Send, Star, User } from 'lucide-react'
import {
  Button,
  Drawer,
  FileUpload,
  FormField,
  IconButton,
  Textarea,
  useToast,
} from '@/design-system/UIComponents'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import { BORDER_RADIUS } from '@/design-system/tokens'
import { usePublicBrandColors } from '@/shared/theme/publicBrand'
import { PORTAL_SUPPORT_CATEGORIES } from '../../data/portalSupportCategories'
import {
  getSupportTicketStatusTone,
  SUPPORT_TICKET_STATUS_LABELS,
} from '../../config/supportTicketStatusConfig'
import type { SupportTicketsApi } from '../../hooks/useSupportTickets'
import type { SupportConversationEntry, SupportTicket } from '../../types/supportTicket'

interface SupportTicketConversationDrawerProps {
  open: boolean
  ticketId: string | null
  ticketsApi: SupportTicketsApi
  onClose: () => void
}

function formatMessageTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function getCategoryLabel(categoryId: string) {
  return PORTAL_SUPPORT_CATEGORIES.find(c => c.id === categoryId)?.name ?? categoryId
}

function StarRating({ value, onChange }: { value: number; onChange: (rating: number) => void }) {
  const colors = usePublicBrandColors()
  return (
    <Stack direction="row" spacing={0.5}>
      {[1, 2, 3, 4, 5].map(star => (
        <Box
          key={star}
          component="button"
          type="button"
          onClick={() => onChange(star)}
          aria-label={`Rate ${star} stars`}
          sx={{
            border: 0,
            bgcolor: 'transparent',
            cursor: 'pointer',
            p: 0.25,
            color: star <= value ? '#F59E0B' : colors.border,
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Star size={22} fill={star <= value ? '#F59E0B' : 'transparent'} />
        </Box>
      ))}
    </Stack>
  )
}

function ResolutionConfirmationCard({
  ticket,
  ticketsApi,
}: {
  ticket: SupportTicket
  ticketsApi: SupportTicketsApi
}) {
  const colors = usePublicBrandColors()
  const { showToast } = useToast()
  const [step, setStep] = useState<'confirm' | 'feedback'>('confirm')
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState('')

  const handleClose = () => {
    if (rating < 1) {
      showToast({ title: 'Please provide a rating', variant: 'warning' })
      return
    }
    ticketsApi.closeTicketWithFeedback(ticket.id, rating, feedback)
    showToast({ title: 'Thank you for your feedback', variant: 'success' })
  }

  const handleReopen = () => {
    ticketsApi.reopenTicket(ticket.id)
    showToast({ title: 'Ticket reopened', description: 'Our team will follow up shortly.', variant: 'info' })
  }

  if (step === 'feedback') {
    return (
      <Box
        sx={{
          p: 2,
          borderRadius: BORDER_RADIUS.lg,
          border: `1px solid rgba(115, 192, 100, 0.35)`,
          bgcolor: colors.greenMuted,
        }}
      >
        <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy, mb: 1 }}>
          Share your feedback
        </Typography>
        <FormField label="Rating" required>
          <StarRating value={rating} onChange={setRating} />
        </FormField>
        <Box sx={{ mt: 2 }}>
          <FormField label="Feedback comments" optional>
            <Textarea
              value={feedback}
              onChange={setFeedback}
              placeholder="Tell us about your support experience..."
              minRows={3}
            />
          </FormField>
        </Box>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Button type="button" variant="outlined" onClick={() => setStep('confirm')}>
            Back
          </Button>
          <Button type="button" onClick={handleClose}>
            Submit feedback
          </Button>
        </Stack>
      </Box>
    )
  }

  return (
    <Box
      sx={{
        p: 2,
        borderRadius: BORDER_RADIUS.lg,
        border: `1px solid rgba(59, 130, 246, 0.3)`,
        bgcolor: 'rgba(59, 130, 246, 0.06)',
      }}
    >
      <Typography sx={{ fontSize: 14, fontWeight: 800, color: colors.navy, mb: 0.75 }}>
        Resolution confirmation
      </Typography>
      <Typography sx={{ fontSize: 13, color: colors.textSecondary, lineHeight: 1.6, mb: 2 }}>
        Our support team has marked this ticket as resolved.
        <br />
        Has your issue been resolved?
      </Typography>
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
        <Button type="button" onClick={() => setStep('feedback')}>
          Yes, close ticket
        </Button>
        <Button type="button" variant="outlined" onClick={handleReopen}>
          No, reopen ticket
        </Button>
      </Stack>
    </Box>
  )
}

function ConversationMessage({ entry }: { entry: SupportConversationEntry }) {
  const colors = usePublicBrandColors()

  if (entry.type === 'system') {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 1 }}>
        <Typography
          sx={{
            fontSize: 11,
            fontWeight: 700,
            color: colors.textMuted,
            px: 1.5,
            py: 0.5,
            borderRadius: BORDER_RADIUS.full,
            bgcolor: colors.surfaceAlt,
            border: `1px solid ${colors.border}`,
          }}
        >
          {entry.event} · {formatMessageTime(entry.timestamp)}
        </Typography>
      </Box>
    )
  }

  const isCustomer = entry.sender === 'customer'

  return (
    <Stack
      direction="row"
      spacing={1.25}
      justifyContent={isCustomer ? 'flex-end' : 'flex-start'}
      sx={{ mb: 1.5 }}
    >
      {!isCustomer ? (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: BORDER_RADIUS.full,
            bgcolor: 'rgba(59, 130, 246, 0.12)',
            color: '#2563EB',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Headphones size={16} />
        </Box>
      ) : null}
      <Box sx={{ maxWidth: '78%', minWidth: 0 }}>
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          justifyContent={isCustomer ? 'flex-end' : 'flex-start'}
          sx={{ mb: 0.5 }}
        >
          <Typography sx={{ fontSize: 11, fontWeight: 700, color: colors.textMuted }}>
            {entry.authorName}
          </Typography>
          <Typography sx={{ fontSize: 11, color: colors.textMuted }}>
            {formatMessageTime(entry.timestamp)}
          </Typography>
        </Stack>
        <Box
          sx={{
            px: 1.5,
            py: 1.25,
            borderRadius: BORDER_RADIUS.lg,
            bgcolor: isCustomer ? colors.greenMuted : colors.white,
            border: `1px solid ${isCustomer ? 'rgba(115, 192, 100, 0.3)' : colors.border}`,
          }}
        >
          <Typography sx={{ fontSize: 13, color: colors.text, lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
            {entry.body}
          </Typography>
          {entry.attachments && entry.attachments.length > 0 ? (
            <Stack spacing={0.75} sx={{ mt: 1 }}>
              {entry.attachments.map(att => (
                <Stack key={att.id} direction="row" spacing={0.75} alignItems="center">
                  <FileText size={14} color={colors.textMuted} />
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.navy }}>
                    {att.name}
                  </Typography>
                  <Typography sx={{ fontSize: 11, color: colors.textMuted }}>({att.size})</Typography>
                </Stack>
              ))}
            </Stack>
          ) : null}
        </Box>
      </Box>
      {isCustomer ? (
        <Box
          sx={{
            width: 32,
            height: 32,
            borderRadius: BORDER_RADIUS.full,
            bgcolor: colors.greenMuted,
            color: colors.greenDark,
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <User size={16} />
        </Box>
      ) : null}
    </Stack>
  )
}

export function SupportTicketConversationDrawer({
  open,
  ticketId,
  ticketsApi,
  onClose,
}: SupportTicketConversationDrawerProps) {
  const colors = usePublicBrandColors()
  const { showToast } = useToast()
  const ticket = ticketId ? ticketsApi.getTicket(ticketId) : undefined

  const [reply, setReply] = useState('')
  const [replyAttachments, setReplyAttachments] = useState<string[]>([])
  const [showAttach, setShowAttach] = useState(false)

  if (!ticket) {
    return (
      <Drawer open={open} onClose={onClose} title="Support ticket" width={640}>
        <Typography sx={{ fontSize: 13, color: colors.textSecondary }}>Ticket not found.</Typography>
      </Drawer>
    )
  }

  const showResolutionCard =
    ticket.status === 'resolved' && (ticket.awaitingCustomerConfirmation ?? true)

  const canReply = ticket.status !== 'closed'

  const handleSend = () => {
    const trimmed = reply.trim()
    if (!trimmed) {
      showToast({ title: 'Enter a message', variant: 'warning' })
      return
    }
    ticketsApi.addReply(ticket.id, trimmed, replyAttachments)
    setReply('')
    setReplyAttachments([])
    setShowAttach(false)
    showToast({ title: 'Message sent', variant: 'success' })
  }

  const headerExtra = (
    <CustomerStatusChip
      label={SUPPORT_TICKET_STATUS_LABELS[ticket.status]}
      tone={getSupportTicketStatusTone(ticket.status)}
    />
  )

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={ticket.ticketNumber}
      subtitle={ticket.subject}
      headerExtra={headerExtra}
      width={640}
      footer={
        canReply ? (
          <Stack spacing={1.5}>
            {showAttach ? (
              <FileUpload
                compact
                multiple
                maxFiles={4}
                accept="image/*,.pdf,.doc,.docx"
                dropzoneTitle="Attach files to your reply"
                onUpload={files => setReplyAttachments(files.map(f => f.name))}
                onError={msg => showToast({ title: msg, variant: 'warning' })}
              />
            ) : null}
            <Stack direction="row" spacing={1} alignItems="flex-end">
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Textarea
                  value={reply}
                  onChange={setReply}
                  placeholder="Type your reply..."
                  minRows={2}
                  fullWidth
                />
              </Box>
              <IconButton
                icon={<Paperclip size={16} />}
                tooltip="Attach"
                variant="outlined"
                color="primary"
                onClick={() => setShowAttach(v => !v)}
              />
              <Button type="button" startIcon={<Send size={14} />} onClick={handleSend}>
                Send
              </Button>
            </Stack>
          </Stack>
        ) : undefined
      }
    >
      <Stack spacing={2} sx={{ pb: 2 }}>
        <Box
          sx={{
            p: 1.5,
            borderRadius: BORDER_RADIUS.lg,
            border: `1px solid ${colors.border}`,
            bgcolor: colors.surfaceAlt,
          }}
        >
          <Stack spacing={0.75}>
            <DetailRow label="Category" value={getCategoryLabel(ticket.category)} />
            {ticket.subCategory ? <DetailRow label="Sub category" value={ticket.subCategory} /> : null}
            {ticket.assignedExecutive ? (
              <DetailRow label="Assigned executive" value={ticket.assignedExecutive} />
            ) : null}
            <DetailRow label="Created" value={formatMessageTime(ticket.createdAt)} />
          </Stack>
        </Box>

        {showResolutionCard ? <ResolutionConfirmationCard ticket={ticket} ticketsApi={ticketsApi} /> : null}

        <Box>
          <Typography sx={{ fontSize: 13, fontWeight: 800, color: colors.navy, mb: 1.5 }}>
            Conversation
          </Typography>
          {ticket.conversation.map(entry => (
            <ConversationMessage key={entry.id} entry={entry} />
          ))}
        </Box>
      </Stack>
    </Drawer>
  )
}

function DetailRow({ label, value }: { label: string; value: string }) {
  const colors = usePublicBrandColors()
  return (
    <Stack direction="row" spacing={1}>
      <Typography sx={{ fontSize: 12, fontWeight: 700, color: colors.textMuted, minWidth: 120 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 12, fontWeight: 600, color: colors.navy }}>{value}</Typography>
    </Stack>
  )
}
