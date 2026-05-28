import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Button, Modal } from '@/design-system/UIComponents'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
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
        description="Short create/edit surface (typically 2–8 fields). Open the modal to see FormSection + FormField wired to design-system Modal."
      />
      <Button label="Open modal form" variant="contained" onClick={() => setOpen(true)} />
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        title="Create record"
        size="md"
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ width: '100%' }}>
            <Button label="Cancel" variant="outlined" onClick={() => setOpen(false)} />
            <Button label="Save" variant="contained" onClick={() => setOpen(false)} />
          </Stack>
        }
      >
        <TemplateDemoFormFields data={formData} onChange={setFormData} compact />
      </Modal>
    </Box>
  )
}
