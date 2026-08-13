import { Box, Stack, Typography, alpha, useTheme } from '@mui/material'
import {
  CalendarClock,
  Mail,
  MessageCircle,
  Phone,
  Users,
  Video,
} from 'lucide-react'
import { Badge, BaseCard, Button, EmptyState } from '@/design-system/UIComponents'
import type { EnquiryFollowup, EnquiryRecord } from '@/shared/types/enquiry'
import { formatDisplayDate } from '@/shared/utils/formatDisplayDate'
import {
  formatFollowupOutcomeLabel,
  formatFollowupStatusLabel,
  formatFollowupTypeLabel,
} from '../../utils/enquiryFollowupUtils'

interface FollowupsTabProps {
  enquiry: EnquiryRecord
  onAdd: () => void
  onMarkComplete: (followupId: string) => void
}

function followupTypeIcon(type: string) {
  switch (type) {
    case 'email':
      return Mail
    case 'meeting':
      return Video
    case 'whatsapp':
      return MessageCircle
    case 'internal':
      return Users
    case 'call':
    default:
      return Phone
  }
}

function MetaField({ label, value }: { label: string; value?: string }) {
  const display = value?.trim()
  if (!display || display === '—') return null
  return (
    <Stack spacing={0.15} sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, opacity: 0.85 }}>
        {label}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word', lineHeight: 1.4 }}>
        {display}
      </Typography>
    </Stack>
  )
}

function FollowupCard({
  entry,
  onMarkComplete,
}: {
  entry: EnquiryFollowup
  onMarkComplete: (followupId: string) => void
}) {
  const theme = useTheme()
  const TypeIcon = followupTypeIcon(entry.followupType)
  const outcome = formatFollowupOutcomeLabel(entry.outcome)
  const hasOutcome = Boolean(outcome && outcome !== '—')
  const hasAssignee = Boolean(entry.assignedUser?.trim())
  const hasNextAction = Boolean(entry.nextAction?.trim())
  const hasDiscussion = Boolean(entry.discussionSummary?.trim())

  return (
    <BaseCard
      sx={{
        p: 0,
        boxShadow: 'none',
        overflow: 'hidden',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
        spacing={1.25}
        sx={{
          px: 2,
          py: 1.25,
          borderBottom: '1px solid',
          borderColor: 'divider',
          bgcolor: alpha(theme.palette.primary.main, theme.palette.mode === 'dark' ? 0.08 : 0.03),
        }}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ minWidth: 0 }}>
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: 1,
              display: 'grid',
              placeItems: 'center',
              flexShrink: 0,
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
            }}
          >
            <TypeIcon size={16} />
          </Box>
          <Stack spacing={0.15} sx={{ minWidth: 0 }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, lineHeight: 1.3 }}>
              {formatFollowupTypeLabel(entry.followupType)}
            </Typography>
            <Stack direction="row" spacing={0.75} alignItems="center">
              <CalendarClock size={12} color={theme.palette.text.secondary} />
              <Typography variant="caption" color="text.secondary">
                {formatDisplayDate(entry.followupDate)}
                {entry.followupTime ? ` · ${entry.followupTime}` : ''}
              </Typography>
            </Stack>
          </Stack>
        </Stack>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ flexShrink: 0 }}>
          <Badge
            label={formatFollowupStatusLabel(entry.followupStatus)}
            color={entry.followupStatus === 'completed' ? 'success' : 'warning'}
            size="sm"
          />
          {entry.followupStatus !== 'completed' ? (
            <Button
              label="Mark Completed"
              size="sm"
              variant="outlined"
              onClick={() => onMarkComplete(entry.id)}
            />
          ) : null}
        </Stack>
      </Stack>

      <Stack spacing={1.25} sx={{ px: 2, py: 1.5 }}>
        {(hasDiscussion || hasNextAction) && (
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: hasDiscussion && hasNextAction ? '1.4fr 1fr' : '1fr',
              },
              gap: 1.5,
            }}
          >
            {hasDiscussion ? (
              <MetaField label="Discussion" value={entry.discussionSummary} />
            ) : null}
            {hasNextAction ? (
              <MetaField label="Next action" value={entry.nextAction} />
            ) : null}
          </Box>
        )}

        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(3, minmax(0, 1fr))',
            },
            gap: 1.25,
            pt: hasDiscussion || hasNextAction ? 0.5 : 0,
            borderTop: hasDiscussion || hasNextAction ? '1px solid' : 'none',
            borderColor: 'divider',
          }}
        >
          {hasAssignee ? <MetaField label="Assigned to" value={entry.assignedUser} /> : null}
          {hasOutcome ? <MetaField label="Outcome" value={outcome} /> : null}
          <MetaField
            label="Reminder"
            value={entry.reminderRequired ? 'Required' : 'Not required'}
          />
        </Box>
      </Stack>
    </BaseCard>
  )
}

export function FollowupsTab({ enquiry, onAdd, onMarkComplete }: FollowupsTabProps) {
  return (
    <Stack spacing={1.5}>
      {enquiry.followups.length === 0 ? (
        <EmptyState
          variant="no-data"
          title="No follow-ups yet"
          description="Schedule a call, email, or meeting to keep this enquiry moving."
          action={{ label: 'Add Follow-up', onClick: onAdd }}
        />
      ) : (
        enquiry.followups.map((entry) => (
          <FollowupCard key={entry.id} entry={entry} onMarkComplete={onMarkComplete} />
        ))
      )}
    </Stack>
  )
}
