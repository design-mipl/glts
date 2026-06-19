import { Alert, Stack, Typography } from '@mui/material'
import { Button, Modal } from '@/design-system/UIComponents'

interface ConvertToQuotationDialogProps {
  open: boolean
  loading?: boolean
  issues: string[]
  onClose: () => void
  onConfirm: () => void
}

export function ConvertToQuotationDialog({
  open,
  loading,
  issues,
  onClose,
  onConfirm,
}: ConvertToQuotationDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Convert to Quotation"
      subtitle="Validate required details before conversion."
      loading={loading}
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Approve Conversion" onClick={onConfirm} />
        </Stack>
      }
    >
      <Stack spacing={1.5}>
        {issues.length > 0 ? (
          <>
            <Alert severity="warning">Conversion validation found open issues.</Alert>
            {issues.map((issue) => (
              <Typography key={issue} variant="body2" color="text.secondary">
                - {issue}
              </Typography>
            ))}
          </>
        ) : (
          <Alert severity="success">All validation checks passed. Ready to generate quotation record.</Alert>
        )}
      </Stack>
    </Modal>
  )
}
