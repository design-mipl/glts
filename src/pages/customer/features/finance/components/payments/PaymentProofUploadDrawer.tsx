import { useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Upload } from 'lucide-react'
import { Button, Drawer, FormField, useToast } from '@/design-system/UIComponents'
import { customerFinanceService } from '@/shared/services/customerFinanceService'
import type { CustomerPaymentRow } from '../../types/customerFinance.types'

interface PaymentProofUploadDrawerProps {
  payment: CustomerPaymentRow
  open: boolean
  onClose: () => void
  onUploaded: () => void
}

export function PaymentProofUploadDrawer({
  payment,
  open,
  onClose,
  onUploaded,
}: PaymentProofUploadDrawerProps) {
  const { showToast } = useToast()
  const [fileName, setFileName] = useState('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setFileName(file.name)
  }

  const handleSubmit = () => {
    if (!fileName) {
      showToast({ title: 'Select a file', variant: 'warning' })
      return
    }
    const ok = customerFinanceService.uploadPaymentProof(payment.id, fileName)
    if (ok) {
      showToast({
        title: 'Proof uploaded',
        description: 'Accounts team will verify your payment proof.',
        variant: 'success',
      })
      onUploaded()
      onClose()
    }
  }

  return (
    <Drawer open={open} onClose={onClose} title="Upload payment proof" width={420}>
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Upload bank transfer proof for {payment.receiptNumber} ({payment.invoiceNumber}).
        </Typography>
        <FormField label="Payment proof file">
          <input type="file" accept=".pdf,.jpg,.jpeg,.png" onChange={handleFileChange} />
        </FormField>
        {fileName && (
          <Typography variant="caption" color="text.secondary">
            Selected: {fileName}
          </Typography>
        )}
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="outlined" onClick={onClose} />
          <Button label="Upload" variant="contained" startIcon={<Upload size={14} />} onClick={handleSubmit} />
        </Stack>
      </Stack>
    </Drawer>
  )
}
