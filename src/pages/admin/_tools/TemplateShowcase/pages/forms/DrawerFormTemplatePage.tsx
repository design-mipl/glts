import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import { Button, Drawer } from '@/design-system/UIComponents'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { getTemplateRecipeById } from '../../config/templateRegistry'
import { EMPTY_TEMPLATE_DEMO_FORM, type TemplateDemoFormData } from '../../config/demoEntity'
import { TemplateDemoFormFields } from '../../components/TemplateDemoFormFields'
import { TemplateShowcaseBanner } from '../../components/TemplateShowcaseBanner'

export function DrawerFormTemplatePage() {
  const recipe = getTemplateRecipeById('form-drawer')!
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<TemplateDemoFormData>(EMPTY_TEMPLATE_DEMO_FORM)

  return (
    <Box>
      <TemplateShowcaseBanner components={recipe.components} />
      <AdminPageHeader
        title="Form — Drawer"
        description="Side edit workflow (typically 4–12 fields) using Drawer with sticky footer actions."
      />
      <Button label="Open drawer form" variant="contained" onClick={() => setOpen(true)} />
      <Drawer
        open={open}
        onClose={() => setOpen(false)}
        title="Edit record"
        width={480}
        footer={
          <Stack direction="row" spacing={1} justifyContent="flex-end" sx={{ width: '100%' }}>
            <Button label="Cancel" variant="outlined" onClick={() => setOpen(false)} />
            <Button label="Save" variant="contained" onClick={() => setOpen(false)} />
          </Stack>
        }
      >
        <TemplateDemoFormFields data={formData} onChange={setFormData} />
      </Drawer>
    </Box>
  )
}
