import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { orderEnquiryService } from '@/shared/services/orderEnquiryService'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { buildOrderEnquiryFormSections } from '../components/OrderEnquiryFormSections'
import { useOrderEnquiryForm } from '../hooks/useOrderEnquiryForm'
import { getOrderEnquiryActor } from '../utils/orderEnquiryActor'

const LISTING_PATH = '/admin/order-management/order-enquiries'

export function CreateOrderEnquiryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, LISTING_PATH)
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate } = useOrderEnquiryForm()
  const [loading, setLoading] = useState(false)

  const breadcrumbs = [
    { label: 'Order Management', href: listingHref },
    { label: 'Order Enquiries', href: listingHref },
    { label: 'Create Enquiry' },
  ]

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const created = await orderEnquiryService.create(formData, getOrderEnquiryActor())
    setLoading(false)
    showToast({ title: 'Order enquiry created', variant: 'success' })
    navigate(`${LISTING_PATH}/${created.id}`, { state: location.state })
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={breadcrumbs}
      title="Create Order Enquiry"
      headerActions={<AdminFullPageFormHeaderSave loading={loading} onClick={() => void handleSubmit()} />}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={() => navigate(listingHref)}
          onSave={() => void handleSubmit()}
        />
      }
      sections={buildOrderEnquiryFormSections({ formData, setFormData, errors, showMetaFields: true })}
    />
  )
}
