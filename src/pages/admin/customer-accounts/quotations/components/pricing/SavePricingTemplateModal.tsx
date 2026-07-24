import { Stack } from '@mui/material'
import { useEffect, useState } from 'react'
import { Button, FormField, Input, Modal } from '@/design-system/UIComponents'

interface SavePricingTemplateModalProps {
  open: boolean
  defaultName?: string
  onClose: () => void
  onSave: (name: string) => void
}

export function SavePricingTemplateModal({
  open,
  defaultName = '',
  onClose,
  onSave,
}: SavePricingTemplateModalProps) {
  const [name, setName] = useState(defaultName)

  useEffect(() => {
    if (!open) return
    setName(defaultName)
  }, [open, defaultName])

  const canSave = name.trim().length > 0

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Save as template"
      subtitle="Reuse this commercial pricing setup on other quotations."
      size="sm"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={onClose} />
          <Button
            label="Save template"
            disabled={!canSave}
            onClick={() => {
              if (!canSave) return
              onSave(name.trim())
              onClose()
            }}
          />
        </Stack>
      }
    >
      <FormField label="Template name" required>
        <Input
          value={name}
          onChange={setName}
          placeholder="e.g. Standard Schengen corporate"
          fullWidth
        />
      </FormField>
    </Modal>
  )
}
