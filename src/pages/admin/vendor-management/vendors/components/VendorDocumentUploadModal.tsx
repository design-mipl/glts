import { useState } from 'react'
import { Stack } from '@mui/material'
import { FormField, Input, Modal, Select, Button } from '@/design-system/UIComponents'
import type { VendorDocument, VendorDocumentType } from '@/shared/types/vendor'
import { VENDOR_DOCUMENT_TYPE_OPTIONS } from '../config/vendorDocumentTypes'

interface VendorDocumentUploadModalProps {
  open: boolean
  onClose: () => void
  onSave: (payload: Omit<VendorDocument, 'id' | 'uploadedAt' | 'uploadedBy'>) => void
}

export function VendorDocumentUploadModal({ open, onClose, onSave }: VendorDocumentUploadModalProps) {
  const [documentName, setDocumentName] = useState('')
  const [documentType, setDocumentType] = useState<VendorDocumentType>('other')
  const [fileName, setFileName] = useState('')

  const handleClose = () => {
    setDocumentName('')
    setDocumentType('other')
    setFileName('')
    onClose()
  }

  const handleSave = () => {
    if (!documentName.trim()) return
    onSave({
      documentName: documentName.trim(),
      documentType,
      fileName: fileName.trim() || `${documentName.trim()}.pdf`,
    })
    setDocumentName('')
    setDocumentType('other')
    setFileName('')
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Upload document"
      size="sm"
      footer={
        <Stack direction="row" spacing={1} justifyContent="flex-end">
          <Button label="Cancel" variant="neutral" onClick={handleClose} />
          <Button label="Upload" onClick={handleSave} disabled={!documentName.trim()} />
        </Stack>
      }
    >
      <FormField label="Document name" required>
        <Input value={documentName} onChange={setDocumentName} placeholder="Document name" fullWidth />
      </FormField>
      <FormField label="Document type" required>
        <Select
          value={documentType}
          onChange={(v) => setDocumentType(v as VendorDocumentType)}
          options={VENDOR_DOCUMENT_TYPE_OPTIONS}
          fullWidth
        />
      </FormField>
      <FormField label="File name">
        <Input value={fileName} onChange={setFileName} placeholder="filename.pdf" fullWidth />
      </FormField>
    </Modal>
  )
}
