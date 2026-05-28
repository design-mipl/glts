import { useState } from 'react'
import { Box, Stack } from '@mui/material'
import { BaseCard, Button } from '@/design-system/UIComponents'
import { AdminPageHeader } from '@/pages/admin/components/AdminPageHeader'
import { getTemplateRecipeById } from '../../config/templateRegistry'
import { EMPTY_TEMPLATE_DEMO_FORM, type TemplateDemoFormData } from '../../config/demoEntity'
import { TemplateDemoFormFields } from '../../components/TemplateDemoFormFields'
import { TemplateShowcaseBanner } from '../../components/TemplateShowcaseBanner'

export function FullPageFormTemplatePage() {
  const recipe = getTemplateRecipeById('form-page')!
  const [formData, setFormData] = useState<TemplateDemoFormData>(EMPTY_TEMPLATE_DEMO_FORM)

  return (
    <Box>
      <TemplateShowcaseBanner components={recipe.components} />
      <AdminPageHeader
        title="Form — Full page"
        description="Complex create/edit with multiple FormSection blocks and a sticky footer action bar."
        breadcrumbs={[
          { label: 'Templates', href: '/admin/tools/templates' },
          { label: 'Full-page form' },
        ]}
      />

      <BaseCard>
        <Box sx={{ p: 2.5 }}>
          <TemplateDemoFormFields data={formData} onChange={setFormData} />
        </Box>
        <Box
          sx={{
            px: 2.5,
            py: 2,
            borderTop: 1,
            borderColor: 'divider',
            bgcolor: 'action.hover',
          }}
        >
          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button label="Cancel" variant="outlined" />
            <Button label="Save as draft" variant="outlined" color="warning" />
            <Button label="Save" variant="contained" />
          </Stack>
        </Box>
      </BaseCard>
    </Box>
  )
}
