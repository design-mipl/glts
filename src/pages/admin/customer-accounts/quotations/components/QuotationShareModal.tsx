import { useEffect, useState } from 'react'
import { Stack, Typography } from '@mui/material'
import { Button, FormField, Input, Modal } from '@/design-system/UIComponents'
import { quotationService } from '@/shared/services/quotationService'
import type { QuotationRecord } from '@/shared/types/quotation'

interface QuotationShareModalProps {
  open: boolean
  quotation?: QuotationRecord
  onClose: () => void
  onShared: () => void
  actor: string
}

export function QuotationShareModal({ open, quotation, onClose, onShared, actor }: QuotationShareModalProps) {
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (open && quotation) {
      setEmail(quotation.customer.emailAddress)
      setMessage('')
    }
  }, [open, quotation])

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Share Quotation"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label="Share"
            onClick={() => {
              if (!quotation) return
              const result = quotationService.share(quotation.id, actor, {
                recipientEmail: email,
                message,
              })
              if (!result.ok) return
              onShared()
            }}
          />
        </Stack>
      }
    >
      <Stack spacing={2}>
        <Typography variant="body2" color="text.secondary">
          Share {quotation?.quotationNo} with the customer contact.
        </Typography>
        <FormField label="Recipient email" required>
          <Input value={email} onChange={setEmail} placeholder="email@company.com" fullWidth />
        </FormField>
        <FormField label="Message">
          <Input value={message} onChange={setMessage} placeholder="Optional message" fullWidth />
        </FormField>
      </Stack>
    </Modal>
  )
}
