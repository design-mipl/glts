import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import { useToast } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
import { orderEnquiryService, orderEnquiryToOrderFormData } from '@/shared/services/orderEnquiryService'
import { orderService } from '@/shared/services/orderService'
import { getCurrentUser } from '@/shared/services/authService'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { buildOrderFormSections } from '../components/OrderFormSections'
import { useOrderForm } from '../hooks/useOrderForm'

const ORDER_LISTING_PATH = '/admin/order-management/orders'

function getOrderActor(): string {
  const user = getCurrentUser()
  if (!user) return 'Admin User'
  return user.name?.trim() || user.email || 'Admin User'
}

export function CreateOrderPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const fromEnquiryId = searchParams.get('fromEnquiry')
  const listingHref = getListingReturnHref(location, ORDER_LISTING_PATH)
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate, reset } = useOrderForm()
  const [loading, setLoading] = useState(false)
  const [prefillLoading, setPrefillLoading] = useState(Boolean(fromEnquiryId))

  useEffect(() => {
    if (!fromEnquiryId) return
    void orderEnquiryService.getEnquiryById(fromEnquiryId).then((enquiry) => {
      if (enquiry && orderEnquiryService.isEligibleForConversion(enquiry)) {
        reset(orderEnquiryToOrderFormData(enquiry))
      } else if (enquiry) {
        showToast({
          title: 'Enquiry already converted',
          description: 'Creating a standalone order instead.',
          variant: 'info',
        })
      }
      setPrefillLoading(false)
    })
  }, [fromEnquiryId, reset, showToast])

  const breadcrumbs = [
    { label: 'Order Management', href: listingHref },
    { label: 'Orders', href: listingHref },
    { label: fromEnquiryId ? 'Create from Enquiry' : 'Create Order' },
  ]

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const created = await orderService.createOrder({ ...formData, status: 'confirmed' }, getOrderActor())
    if (formData.orderEnquiryId) {
      await orderEnquiryService.markAsConverted(formData.orderEnquiryId, created.id, getOrderActor())
    }
    setLoading(false)
    showToast({ title: 'Order created', variant: 'success' })
    navigate(`${ORDER_LISTING_PATH}/${created.id}`, { state: location.state })
  }

  const handleSaveDraft = async () => {
    setLoading(true)
    const created = await orderService.createOrder({ ...formData, status: 'draft' }, getOrderActor())
    if (formData.orderEnquiryId) {
      await orderEnquiryService.markAsConverted(formData.orderEnquiryId, created.id, getOrderActor())
    }
    setLoading(false)
    showToast({ title: 'Draft saved', variant: 'info' })
    navigate(`${ORDER_LISTING_PATH}/${created.id}`, { state: location.state })
  }

  if (prefillLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={breadcrumbs}
      title={fromEnquiryId ? 'Create Order from Enquiry' : 'Create Order'}
      headerActions={<AdminFullPageFormHeaderSave loading={loading} onClick={() => void handleSubmit()} />}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={() => navigate(listingHref)}
          onDraft={() => void handleSaveDraft()}
          onSave={() => void handleSubmit()}
        />
      }
      sections={buildOrderFormSections({ formData, setFormData, errors })}
    />
  )
}
