import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { EmptyState, useToast } from '@/design-system/UIComponents'
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
import { orderEnquiryRecordToFormData } from '../utils/orderEnquiryFormUtils'

const LISTING_PATH = '/admin/order-management/order-enquiries'

export function EditOrderEnquiryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, LISTING_PATH)
  const { enquiryId } = useParams<{ enquiryId: string }>()
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate } = useOrderEnquiryForm()
  const [loading, setLoading] = useState(false)
  const [isConverted, setIsConverted] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!enquiryId) {
      setReady(true)
      return
    }
    void orderEnquiryService.getEnquiryById(enquiryId).then((record) => {
      if (record) {
        setFormData(orderEnquiryRecordToFormData(record))
        setIsConverted(record.status === 'converted')
      }
      setReady(true)
    })
  }, [enquiryId, setFormData])

  const detailHref = enquiryId ? `${LISTING_PATH}/${enquiryId}` : listingHref

  const breadcrumbs = [
    { label: 'Order Management', href: listingHref },
    { label: 'Order Enquiries', href: listingHref },
    { label: enquiryId ?? 'Edit' },
  ]

  if (!ready) return null

  if (!enquiryId) {
    return (
      <EmptyState
        variant="no-data"
        title="Enquiry not found"
        description="Missing enquiry identifier."
        action={{ label: 'Back to enquiries', onClick: () => navigate(listingHref) }}
      />
    )
  }

  if (isConverted) {
    return (
      <EmptyState
        variant="no-data"
        title="Cannot edit converted enquiry"
        description="This enquiry has been converted to an order and can no longer be edited."
        action={{ label: 'View enquiry', onClick: () => navigate(detailHref, { state: location.state }) }}
      />
    )
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    await orderEnquiryService.update(enquiryId, formData, getOrderEnquiryActor())
    setLoading(false)
    showToast({ title: 'Order enquiry updated', variant: 'success' })
    navigate(detailHref, { state: location.state })
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={breadcrumbs}
      title="Edit Order Enquiry"
      headerActions={<AdminFullPageFormHeaderSave loading={loading} onClick={() => void handleSubmit()} />}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={() => navigate(detailHref, { state: location.state })}
          onSave={() => void handleSubmit()}
        />
      }
      sections={buildOrderEnquiryFormSections({ formData, setFormData, errors, showMetaFields: true })}
    />
  )
}
