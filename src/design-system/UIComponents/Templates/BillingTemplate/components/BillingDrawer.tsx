import { useState, useEffect } from 'react'
import { Box } from '@mui/material'
import { Button, Drawer } from '@/design-system/components'
import type { InvoiceFormData } from '../types'
import { EMPTY_FORM } from '../types'
import BillingFormSections from './BillingFormSections'

export interface BillingDrawerProps {
  open: boolean
  onClose: () => void
  onSave?: (data: InvoiceFormData) => void
  title?: string
  subtitle?: string
  initialData?: Partial<InvoiceFormData>
}

export default function BillingDrawer({
  open,
  onClose,
  onSave,
  title = 'Add invoice',
  subtitle = 'Fill in the details',
  initialData,
}: BillingDrawerProps) {
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
    <Drawer
      open={open}
      onClose={onClose}
      title={title}
      subtitle={subtitle}
      width={500}
      footer={
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
          <Button variant="outlined" color="secondary" fullWidth onClick={onClose}>
            Cancel
          </Button>
          <Button variant="outlined" color="warning" fullWidth onClick={handleSave}>
            Save as draft
          </Button>
          <Button variant="contained" color="primary" fullWidth onClick={handleSave}>
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
    </Drawer>
  )
}
