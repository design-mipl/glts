import { useState } from 'react'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { getTemplateRecipeById } from '../../config/templateRegistry'
import { EMPTY_TEMPLATE_DEMO_FORM, type TemplateDemoFormData } from '../../config/demoEntity'
import { TemplateDemoFormFields } from '../../components/TemplateDemoFormFields'
import { TemplateShowcaseBanner } from '../../components/TemplateShowcaseBanner'

export function FullPageFormTemplatePage() {
  const recipe = getTemplateRecipeById('form-page')!
  const [formData, setFormData] = useState<TemplateDemoFormData>(EMPTY_TEMPLATE_DEMO_FORM)

  return (
    <>
      <TemplateShowcaseBanner components={recipe.components} />
      <AdminFullPageFormShell
        breadcrumbs={[
          { label: 'Templates', href: '/admin/tools/templates' },
          { label: 'Full-page form' },
        ]}
        title="Form — Full page"
        headerActions={<AdminFullPageFormHeaderSave />}
        footer={
          <AdminFullPageFormFooter
            onCancel={() => {}}
            onDraft={() => {}}
            onSave={() => {}}
          />
        }
        sections={[
          {
            id: 'primary',
            title: 'Record details',
            columns: 2,
            children: <TemplateDemoFormFields data={formData} onChange={setFormData} bare />,
          },
          {
            id: 'secondary',
            title: 'Additional details',
            importance: 'secondary',
            columns: 1,
            children: (
              <TemplateDemoFormFields data={formData} onChange={setFormData} variant="secondary" bare />
            ),
          },
        ]}
      />
    </>
  )
}
