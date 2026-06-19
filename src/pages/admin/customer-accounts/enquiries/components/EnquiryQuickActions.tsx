import { Stack } from '@mui/material'
import { ArrowRightLeft, CalendarPlus, FileCheck2, MessageSquarePlus, UserCog } from 'lucide-react'
import { Button } from '@/design-system/UIComponents'

interface EnquiryQuickActionsProps {
  onEdit: () => void
  onAssign: () => void
  onFollowup: () => void
  onStatus: () => void
  onConvert: () => void
  onNotes: () => void
}

export function EnquiryQuickActions({
  onEdit,
  onAssign,
  onFollowup,
  onStatus,
  onConvert,
  onNotes,
}: EnquiryQuickActionsProps) {
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      <Button label="Edit Enquiry" variant="neutral" startIcon={<FileCheck2 size={14} />} onClick={onEdit} />
      <Button label="Assign Team" variant="outlined" startIcon={<UserCog size={14} />} onClick={onAssign} />
      <Button label="Add Follow-up" variant="outlined" startIcon={<CalendarPlus size={14} />} onClick={onFollowup} />
      <Button label="Update Status" variant="outlined" startIcon={<ArrowRightLeft size={14} />} onClick={onStatus} />
      <Button label="Convert to Quotation" startIcon={<FileCheck2 size={14} />} onClick={onConvert} />
      <Button label="Add Notes" variant="soft" startIcon={<MessageSquarePlus size={14} />} onClick={onNotes} />
    </Stack>
  )
}
