import { useState } from 'react'
import { Box } from '@mui/material'
import { Button, Modal } from '@/design-system/UIComponents'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_MODAL_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
import { getTemplateRecipeById } from '../../config/templateRegistry'
import { EMPTY_TEMPLATE_DEMO_FORM, type TemplateDemoFormData } from '../../config/demoEntity'
import { TemplateDemoFormFields } from '../../components/TemplateDemoFormFields'
import { TemplateShowcaseBanner } from '../../components/TemplateShowcaseBanner'

export function ModalFormTemplatePage() {
  const recipe = getTemplateRecipeById('form-modal')!
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<TemplateDemoFormData>(EMPTY_TEMPLATE_DEMO_FORM)

  return (
    <Box>
      <TemplateShowcaseBanner components={recipe.components} />
      <AdminPageHeader
        title="Form — Modal"
        description="Short create/edit (2–8 fields): Modal + FormSection (2-column grid) + FormField. No section cards inside the dialog."
      />
      <Button label="Open modal form" variant="contained" onClick={() => setOpen(true)} />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create record"
        subtitle="2-column field grid · size md (~600px)"
        size={ADMIN_MODAL_FORM_LAYOUT.recommendedSize}
        footer={
          <AdminFullPageFormFooter
            onCancel={() => setOpen(false)}
            onSave={() => setOpen(false)}
          />
        }
      >
        <TemplateDemoFormFields data={formData} onChange={setFormData} variant="modal" />
      </Modal>
    </Box>
  )
}
