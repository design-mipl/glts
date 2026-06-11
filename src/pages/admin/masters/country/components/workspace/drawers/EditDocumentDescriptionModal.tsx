import { useEffect, useState } from 'react'
import { FormField, Modal, RichTextEditor } from '@/design-system/UIComponents'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormFieldSpan } from '@/pages/admin/components/AdminFullPageFormShell'
import {
  DOCUMENT_DESCRIPTION_RICH_TEXT_MIN_HEIGHT,
  DOCUMENT_DESCRIPTION_RICH_TEXT_TOOLBAR,
} from '@/pages/admin/masters/country/config/documentDescriptionRichText'
import { normalizeRichTextForSave } from '@/shared/utils/richTextUtils'

interface EditDocumentDescriptionModalProps {
  open: boolean
  initialDescription: string
  onClose: () => void
  onSave: (description: string) => void
}

export function EditDocumentDescriptionModal({
  open,
  initialDescription,
  onClose,
  onSave,
}: EditDocumentDescriptionModalProps) {
  const [description, setDescription] = useState(initialDescription)

  useEffect(() => {
    if (open) {
      setDescription(initialDescription)
    }
  }, [open, initialDescription])

  const handleSave = () => {
    onSave(normalizeRichTextForSave(description))
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit description"
      subtitle="Customize instructions shown for this document"
      size="lg"
      footer={
        <AdminFullPageFormFooter onCancel={onClose} onSave={handleSave} saveLabel="Save" />
      }
    >
      <AdminFullPageFormFieldSpan>
        <FormField label="Description" optional>
          <RichTextEditor
            value={description}
            onChange={setDescription}
            placeholder="Instructions for applicants"
            minHeight={DOCUMENT_DESCRIPTION_RICH_TEXT_MIN_HEIGHT}
            toolbar={DOCUMENT_DESCRIPTION_RICH_TEXT_TOOLBAR}
          />
        </FormField>
      </AdminFullPageFormFieldSpan>
    </Modal>
  )
}
