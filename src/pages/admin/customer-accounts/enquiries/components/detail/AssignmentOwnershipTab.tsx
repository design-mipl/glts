import { Stack, Typography } from '@mui/material'
import { BaseCard, Button } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'

export function AssignmentOwnershipTab({
  enquiry,
  onEdit,
}: {
  enquiry: EnquiryRecord
  onEdit: () => void
}) {
  return (
    <Stack spacing={1.5}>
      <BaseCard sx={{ p: 2 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={1}>
          <Stack spacing={0.5}>
            <Typography variant="subtitle2">Current Ownership</Typography>
            <Typography variant="body2" color="text.secondary">
              Team: {enquiry.assignment.assignedTeam ?? '--'} · User: {enquiry.assignment.assignedUser ?? '--'}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Branch: {enquiry.assignment.branch ?? '--'} · Priority: {enquiry.assignment.priority}
            </Typography>
          </Stack>
          <Button label="Update Assignment" size="sm" onClick={onEdit} sx={{ minHeight: 28, height: 28 }} />
        </Stack>
      </BaseCard>
      {enquiry.assignment.ownershipHistory.map((history, index) => (
        <BaseCard key={`${history.changedAt}-${index}`} sx={{ p: 2 }}>
          <Typography variant="subtitle2">Ownership change</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(history.changedAt).toLocaleString()} by {history.changedBy}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {history.fromTeam ?? '--'} / {history.fromUser ?? '--'} {'->'} {history.toTeam ?? '--'} / {history.toUser ?? '--'}
          </Typography>
        </BaseCard>
      ))}
    </Stack>
  )
}
