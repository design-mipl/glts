import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { enquiryService } from '@/shared/services/enquiryService'
import { buildEnquiryFormSections } from '../components/EnquiryFormSections'
import { useEnquiryForm } from '../hooks/useEnquiryForm'
import { getEnquiryActor } from '../utils/enquiryActor'

const breadcrumbs = [
  { label: 'Client Management', href: '/admin/customer-accounts/enquiries' },
  { label: 'Lead Management', href: '/admin/customer-accounts/enquiries' },
  { label: 'Create Enquiry' },
]

export function CreateEnquiryPage() {
  const navigate = useNavigate()
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate } = useEnquiryForm()
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const created = await enquiryService.create(formData, getEnquiryActor())
    setLoading(false)
    showToast({ title: 'Enquiry created', variant: 'success' })
    navigate(`/admin/customer-accounts/enquiries/${created.id}`)
  }

  const handleSaveDraft = async () => {
    setLoading(true)
    await enquiryService.create({ ...formData, status: 'new' }, getEnquiryActor())
    setLoading(false)
    showToast({ title: 'Draft saved', variant: 'info' })
    navigate('/admin/customer-accounts/enquiries')
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={breadcrumbs}
      title="Create Enquiry"
      headerActions={
        <AdminFullPageFormHeaderSave
          loading={loading}
          onClick={() => void handleSubmit()}
        />
      }
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={() => navigate('/admin/customer-accounts/enquiries')}
          onDraft={() => void handleSaveDraft()}
          onSave={() => void handleSubmit()}
        />
      }
      sections={buildEnquiryFormSections({ formData, setFormData, errors })}
    />
  )
}
