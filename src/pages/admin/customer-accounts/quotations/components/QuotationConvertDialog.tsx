import { Stack, Typography } from '@mui/material'
import { Button, Modal } from '@/design-system/UIComponents'
import type { QuotationRecord } from '@/shared/types/quotation'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { getLatestApprovedVersion } from '@/shared/utils/quotationValidation'

interface QuotationConvertDialogProps {
  open: boolean
  quotation?: QuotationRecord
  onClose: () => void
  onConfirm: () => void
}

export function QuotationConvertDialog({ open, quotation, onClose, onConfirm }: QuotationConvertDialogProps) {
  const approved = quotation ? getLatestApprovedVersion(quotation) : undefined

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Convert to Agreement"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Convert to Agreement" onClick={onConfirm} disabled={!approved} />
        </Stack>
      }
    >
      <Stack spacing={1.5}>
        <Typography variant="body2" color="text.secondary">
          Carry forward customer information and the latest approved pricing version into Agreement & Contract Setup.
        </Typography>
        {approved ? (
          <Typography variant="body2">
            {quotation?.customer.companyName} · {approved.versionLabel} ·{' '}
            {formatInr(approved.totals.grandTotal)}
          </Typography>
        ) : (
          <Typography variant="body2" color="error.main">
            An approved pricing version is required before conversion.
          </Typography>
        )}
      </Stack>
    </Modal>
  )
}
