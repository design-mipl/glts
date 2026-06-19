import { Stack } from '@mui/material'
import { Button, FormField, Modal, Textarea } from '@/design-system/UIComponents'

export type ExpenseApprovalModalAction = 'reject' | 'request_clarification'

interface ExpenseApprovalActionModalProps {
  open: boolean
  action: ExpenseApprovalModalAction | null
  expenseName?: string
  comment: string
  onCommentChange: (value: string) => void
  onClose: () => void
  onConfirm: () => void
}

const TITLES: Record<ExpenseApprovalModalAction, string> = {
  reject: 'Reject expense',
  request_clarification: 'Request clarification',
}

export function ExpenseApprovalActionModal({
  open,
  action,
  expenseName,
  comment,
  onCommentChange,
  onClose,
  onConfirm,
}: ExpenseApprovalActionModalProps) {
  if (!action) return null

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={expenseName ? `${TITLES[action]} · ${expenseName}` : TITLES[action]}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label={action === 'reject' ? 'Reject expense' : 'Send clarification'}
            color={action === 'reject' ? 'error' : undefined}
            onClick={onConfirm}
            disabled={!comment.trim()}
          />
        </Stack>
      }
    >
      <FormField
        label={action === 'reject' ? 'Rejection reason' : 'Clarification comment'}
        required
      >
        <Textarea
          value={comment}
          onChange={onCommentChange}
          rows={4}
          placeholder={
            action === 'reject'
              ? 'Explain why this expense is rejected…'
              : 'Describe what clarification is needed…'
          }
        />
      </FormField>
    </Modal>
  )
}
