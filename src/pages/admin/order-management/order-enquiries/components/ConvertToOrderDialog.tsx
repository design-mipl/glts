import { Alert, Stack } from '@mui/material'
import { Button, Modal } from '@/design-system/UIComponents'
import { ORDER_ENQUIRY_SERVICE_LABEL } from '@/shared/services/orderEnquiryService'
import type { OrderEnquiry } from '@/shared/types/orderEnquiry'

interface ConvertToOrderDialogProps {
  open: boolean
  enquiry: OrderEnquiry | undefined
  onClose: () => void
  onConfirm: () => void
}

export function ConvertToOrderDialog({
  open,
  enquiry,
  onClose,
  onConfirm,
}: ConvertToOrderDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Convert to order"
      subtitle="Open the order form with this enquiry prefilled for review."
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button label="Open order form" onClick={onConfirm} />
        </Stack>
      }
    >
      <Alert severity="info">
        {enquiry
          ? `Customer details and ${ORDER_ENQUIRY_SERVICE_LABEL[enquiry.service]} will be prefilled on the order form. The enquiry is marked converted when you save the order.`
          : 'The order form will open with enquiry details prefilled.'}
      </Alert>
    </Modal>
  )
}
