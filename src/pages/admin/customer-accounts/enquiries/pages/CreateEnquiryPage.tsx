import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { enquiryService } from '@/shared/services/enquiryService'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { buildEnquiryFormSections } from '../components/EnquiryFormSections'
import { useEnquiryForm } from '../hooks/useEnquiryForm'
import { getEnquiryActor } from '../utils/enquiryActor'

const ENQUIRY_LISTING_PATH = '/admin/customer-accounts/enquiries'

export function CreateEnquiryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, ENQUIRY_LISTING_PATH)
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate } = useEnquiryForm()
  const [loading, setLoading] = useState(false)

  const breadcrumbs = [
    { label: 'Client Management', href: listingHref },
    { label: 'Lead Management', href: listingHref },
    { label: 'Create Enquiry' },
  ]

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const created = await enquiryService.create(formData, getEnquiryActor())
    setLoading(false)
    showToast({ title: 'Enquiry created', variant: 'success' })
    navigate(`/admin/customer-accounts/enquiries/${created.id}`, {
      state: location.state,
    })
  }

  const handleSaveDraft = async () => {
    setLoading(true)
    await enquiryService.create({ ...formData, status: 'new' }, getEnquiryActor())
    setLoading(false)
    showToast({ title: 'Draft saved', variant: 'info' })
    navigate(listingHref)
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
          onCancel={() => navigate(listingHref)}
          onDraft={() => void handleSaveDraft()}
          onSave={() => void handleSubmit()}
        />
      }
      sections={buildEnquiryFormSections({ formData, setFormData, errors })}
    />
  )
}
