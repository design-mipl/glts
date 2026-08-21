import { useEffect, useState } from 'react'
import { Box, Typography } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { EmptyState, useToast } from '@/design-system/UIComponents'
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
import { orderRecordToFormData } from '../utils/orderFormUtils'

const ORDER_LISTING_PATH = '/admin/order-management/orders'

function getOrderActor(): string {
  const user = getCurrentUser()
  if (!user) return 'Admin User'
  return user.name?.trim() || user.email || 'Admin User'
}

export function EditOrderPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, ORDER_LISTING_PATH)
  const { showToast } = useToast()
  const { orderId } = useParams<{ orderId: string }>()
  const [loading, setLoading] = useState(false)
  const [pageLoading, setPageLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const { formData, setFormData, errors, validate } = useOrderForm()

  useEffect(() => {
    if (!orderId) {
      setNotFound(true)
      setPageLoading(false)
      return
    }
    void orderService.getOrderById(orderId).then((record) => {
      if (!record) {
        setNotFound(true)
      } else {
        setFormData(orderRecordToFormData(record))
      }
      setPageLoading(false)
    })
  }, [orderId, setFormData])

  const orderDetailHref = orderId ? `${ORDER_LISTING_PATH}/${orderId}` : listingHref

  const breadcrumbs = [
    { label: 'Order Management', href: listingHref },
    { label: 'Orders', href: listingHref },
    { label: orderId ?? 'Edit', href: orderDetailHref },
    { label: 'Edit' },
  ]

  if (pageLoading) {
    return (
      <Box sx={{ py: 4, px: 2 }}>
        <Typography variant="body2" color="text.secondary">
          Loading order…
        </Typography>
      </Box>
    )
  }

  if (notFound) {
    return (
      <EmptyState
        title="Order not found"
        description="The order you are trying to edit does not exist or was removed."
        action={{ label: 'Back to orders', onClick: () => navigate(listingHref) }}
      />
    )
  }

  const handleSave = async () => {
    if (!orderId || !validate()) return
    setLoading(true)
    await orderService.updateOrder(orderId, formData, getOrderActor())
    setLoading(false)
    showToast({ title: 'Order updated', variant: 'success' })
    navigate(orderDetailHref, { state: location.state })
  }

  return (
    <AdminFullPageFormShell
      breadcrumbs={breadcrumbs}
      title="Edit Order"
      headerActions={<AdminFullPageFormHeaderSave loading={loading} onClick={() => void handleSave()} />}
      footer={
        <AdminFullPageFormFooter
          loading={loading}
          onCancel={() => navigate(orderDetailHref, { state: location.state })}
          onSave={() => void handleSave()}
        />
      }
      sections={buildOrderFormSections({ formData, setFormData, errors })}
    />
  )
}
