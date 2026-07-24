import { useState } from 'react'
import { Box, Stack, Typography } from '@mui/material'
import { Headphones, Send, User } from 'lucide-react'
import { Button, FormField, Textarea } from '@/design-system/UIComponents'
import type { SupportConversationEntry, SupportTicket } from '@/shared/types/supportTicket'

interface ConversationTabProps {
  ticket: SupportTicket
  onReply: (message: string) => void
  onAskCustomer: (message: string) => void
}

function formatMessageTime(iso: string) {
  return new Date(iso).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function ConversationItem({ entry }: { entry: SupportConversationEntry }) {
  if (entry.type === 'system') {
    return (
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: 'block', textAlign: 'center', py: 0.5 }}
      >
        {entry.event} · {formatMessageTime(entry.timestamp)}
      </Typography>
    )
  }

  const isSupport = entry.sender === 'support'
  return (
    <Stack
      direction="row"
      spacing={1}
      justifyContent={isSupport ? 'flex-end' : 'flex-start'}
      alignItems="flex-start"
    >
      {!isSupport ? (
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: 'action.hover',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <User size={14} />
        </Box>
      ) : null}
      <Box
        sx={{
          maxWidth: '75%',
          px: 1.5,
          py: 1,
          borderRadius: 2,
          bgcolor: isSupport ? 'primary.main' : 'action.hover',
          color: isSupport ? 'primary.contrastText' : 'text.primary',
        }}
      >
        <Typography variant="caption" sx={{ opacity: 0.85, display: 'block', mb: 0.25 }}>
          {entry.authorName} · {formatMessageTime(entry.timestamp)}
        </Typography>
        <Typography variant="body2" sx={{ fontSize: 13, whiteSpace: 'pre-wrap' }}>
          {entry.body}
        </Typography>
        {entry.attachments?.length ? (
          <Typography variant="caption" sx={{ display: 'block', mt: 0.75, opacity: 0.9 }}>
            Attachments: {entry.attachments.map((a) => a.name).join(', ')}
          </Typography>
        ) : null}
      </Box>
      {isSupport ? (
        <Box
          sx={{
            width: 28,
            height: 28,
            borderRadius: '50%',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            display: 'grid',
            placeItems: 'center',
            flexShrink: 0,
          }}
        >
          <Headphones size={14} />
        </Box>
      ) : null}
    </Stack>
  )
}

export function ConversationTab({ ticket, onReply, onAskCustomer }: ConversationTabProps) {
  const [message, setMessage] = useState('')
  const disabled = ticket.status === 'closed' || !message.trim()

  return (
    <Stack spacing={2}>
      <Stack spacing={1.5} sx={{ maxHeight: 420, overflowY: 'auto', pr: 0.5 }}>
        {ticket.conversation.map((entry) => (
          <ConversationItem key={entry.id} entry={entry} />
        ))}
      </Stack>

      {ticket.status !== 'closed' ? (
        <Stack spacing={1.5}>
          <FormField label="Reply to customer">
            <Textarea
              value={message}
              onChange={setMessage}
              minRows={3}
              placeholder="Type your response…"
            />
          </FormField>
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              label="Ask customer"
              variant="neutral"
              disabled={disabled}
              onClick={() => {
                onAskCustomer(message.trim())
                setMessage('')
              }}
            />
            <Button
              label="Send reply"
              startIcon={<Send size={14} />}
              disabled={disabled}
              onClick={() => {
                onReply(message.trim())
                setMessage('')
              }}
            />
          </Stack>
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary">
          This ticket is closed. Reopen from the customer portal or update status to continue.
        </Typography>
      )}
    </Stack>
  )
}
