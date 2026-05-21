import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { Button, Modal } from '@/design-system/components'
import type { InvoiceFormData } from '../types'
import { EMPTY_FORM } from '../types'
import BillingFormSections from './BillingFormSections'

export interface BillingModalProps {
  open: boolean
  onClose: () => void
  onSave?: (data: InvoiceFormData) => void
  title?: string
  subtitle?: string
  initialData?: Partial<InvoiceFormData>
}

export default function BillingModal({
  open,
  onClose,
  onSave,
  title = 'Add invoice',
  subtitle = 'Fill in the details to create an invoice',
  initialData,
}: BillingModalProps) {
  const [formData, setFormData] = useState<InvoiceFormData>({ ...EMPTY_FORM, ...initialData })

  useEffect(() => {
    if (open) {
      setFormData({ ...EMPTY_FORM, ...initialData })
    }
  }, [open, initialData])

  const handleSave = () => {
    onSave?.(formData)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      size="md"
      footer={
        <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', width: '100%' }}>
          <Button variant="outlined" color="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outlined" color="warning" onClick={handleSave}>
            Save as draft
          </Button>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save
          </Button>
        </Box>
      }
    >
      <BillingFormSections
        data={formData}
        onChange={setFormData}
        showLineItems={false}
        showNotes={false}
      />
    </Modal>
  )
}
