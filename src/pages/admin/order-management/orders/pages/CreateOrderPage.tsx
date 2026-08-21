import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/design-system/UIComponents'
import {
  AdminFullPageFormFooter,
  AdminFullPageFormHeaderSave,
} from '@/pages/admin/components/AdminFullPageFormFooter'
import { AdminFullPageFormShell } from '@/pages/admin/components/AdminFullPageFormShell'
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
  const listingHref = getListingReturnHref(location, ORDER_LISTING_PATH)
  const { showToast } = useToast()
  const { formData, setFormData, errors, validate } = useOrderForm()
  const [loading, setLoading] = useState(false)

  const breadcrumbs = [
    { label: 'Order Management', href: listingHref },
    { label: 'Orders', href: listingHref },
    { label: 'Create Order' },
  ]

  const handleSubmit = async () => {
    if (!validate()) return
    setLoading(true)
    const created = await orderService.createOrder({ ...formData, status: 'confirmed' }, getOrderActor())
    setLoading(false)
    showToast({ title: 'Order created', variant: 'success' })
    navigate(`${ORDER_LISTING_PATH}/${created.id}`, { state: location.state })
  }

  const handleSaveDraft = async () => {
    setLoading(true)
    await orderService.createOrder({ ...formData, status: 'draft' }, getOrderActor())
    setLoading(false)
    showToast({ title: 'Draft saved', variant: 'info' })
    navigate(listingHref)
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={breadcrumbs}
      title="Create Order"
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
