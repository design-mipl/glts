import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BaseCard, EmptyState } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { orderService } from '@/shared/services/orderService'
import type { Order } from '@/shared/types/order'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { OrderDetailSummary } from '../components/OrderDetailSummary'
import { OverviewTab } from '../components/detail/OverviewTab'

const ORDER_LISTING_PATH = '/admin/order-management/orders'

export function OrderDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, ORDER_LISTING_PATH)
  const { orderId } = useParams<{ orderId: string }>()
  const [loading, setLoading] = useState(true)
  const [order, setOrder] = useState<Order | undefined>(undefined)

  useEffect(() => {
    if (!orderId) {
      setLoading(false)
      return
    }
    setLoading(true)
    void orderService.getOrderById(orderId).then((record) => {
      setOrder(record)
      setLoading(false)
    })
  }, [orderId])

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!order) {
    return (
      <EmptyState
        variant="no-data"
        title="Order not found"
        description="This order may have been removed or the link is incorrect."
        action={{ label: 'Back to orders', onClick: () => navigate(listingHref) }}
      />
    )
  }

  return (
    <AdminDetailShell
      breadcrumbs={[
        { label: 'Order Management', href: listingHref },
        { label: 'Orders', href: listingHref },
        { label: order.orderNumber },
      ]}
      summary={
        <OrderDetailSummary order={order} onEdit={() => navigate(`${ORDER_LISTING_PATH}/${order.id}/edit`)} />
      }
    >
      <BaseCard sx={{ p: 2 }}>
        <OverviewTab order={order} />
      </BaseCard>
    </AdminDetailShell>
  )
}
