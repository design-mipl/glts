import { useState } from 'react'
import { Box } from '@mui/material'
import { Button } from '@/design-system/UIComponents'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { AdminDrawerFormShell } from '@/pages/admin/components/AdminDrawerFormShell'
import { AdminFullPageFormFooter } from '@/pages/admin/components/AdminFullPageFormFooter'
import { ADMIN_DRAWER_FORM_LAYOUT } from '@/pages/admin/components/adminOverlayFormLayout'
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
        description="Same primary + secondary section cards and field grid as the full-page form — stacked vertically in a 480px drawer."
      />
      <Button label="Open drawer form" variant="contained" onClick={() => setOpen(true)} />
      <AdminDrawerFormShell
        open={open}
        onClose={() => setOpen(false)}
        title="Edit record"
        subtitle={`${ADMIN_DRAWER_FORM_LAYOUT.recommendedWidth}px · scrollable body · sticky footer`}
        footer={
          <AdminFullPageFormFooter
            onCancel={() => setOpen(false)}
            onSave={() => setOpen(false)}
          />
        }
        sections={[
          {
            id: 'primary',
            title: 'Record details',
            description: 'Core fields — primary surface (2-column field grid)',
            columns: ADMIN_DRAWER_FORM_LAYOUT.primarySectionColumns,
            children: <TemplateDemoFormFields data={formData} onChange={setFormData} bare />,
          },
          {
            id: 'secondary',
            title: 'Additional details',
            description: 'Supplemental fields — secondary surface',
            importance: 'secondary',
            columns: ADMIN_DRAWER_FORM_LAYOUT.secondarySectionColumns,
            children: (
              <TemplateDemoFormFields data={formData} onChange={setFormData} variant="secondary" bare />
            ),
          },
        ]}
      />
    </Box>
  )
}
