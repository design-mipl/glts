import { useEffect, useState } from 'react'
import { Box, CircularProgress } from '@mui/material'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { BaseCard, EmptyState } from '@/design-system/UIComponents'
import { AdminDetailShell } from '@/pages/admin/components/AdminDetailShell'
import { orderEnquiryService } from '@/shared/services/orderEnquiryService'
import type { OrderEnquiry } from '@/shared/types/orderEnquiry'
import { getListingReturnHref } from '@/shared/utils/listingNavigationUtils'
import { ConvertToOrderDialog } from '../components/ConvertToOrderDialog'
import { OrderEnquiryDetailSummary } from '../components/OrderEnquiryDetailSummary'
import { OverviewTab } from '../components/detail/OverviewTab'
import { orderCreateFromEnquiryHref, ORDER_LISTING_PATH } from '../utils/orderEnquiryNavigation'

const LISTING_PATH = '/admin/order-management/order-enquiries'

export function OrderEnquiryDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const listingHref = getListingReturnHref(location, LISTING_PATH)
  const { enquiryId } = useParams<{ enquiryId: string }>()
  const [loading, setLoading] = useState(true)
  const [enquiry, setEnquiry] = useState<OrderEnquiry | undefined>(undefined)
  const [convertOpen, setConvertOpen] = useState(false)

  const reload = async () => {
    if (!enquiryId) return
    const record = await orderEnquiryService.getEnquiryById(enquiryId)
    setEnquiry(record)
  }

  useEffect(() => {
    if (!enquiryId) {
      setLoading(false)
      return
    }
    setLoading(true)
    void reload().finally(() => setLoading(false))
  }, [enquiryId])

  const handleConvert = () => {
    if (!enquiryId) return
    setConvertOpen(false)
    navigate(orderCreateFromEnquiryHref(enquiryId), { state: location.state })
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 240 }}>
        <CircularProgress size={32} />
      </Box>
    )
  }

  if (!enquiry) {
    return (
      <EmptyState
        variant="no-data"
        title="Order enquiry not found"
        description="This enquiry may have been removed or the link is incorrect."
        action={{ label: 'Back to enquiries', onClick: () => navigate(listingHref) }}
      />
    )
  }

  return (
    <>
      <AdminDetailShell
        breadcrumbs={[
          { label: 'Order Management', href: listingHref },
          { label: 'Order Enquiries', href: listingHref },
          { label: enquiry.enquiryNumber },
        ]}
        summary={
          <OrderEnquiryDetailSummary
            enquiry={enquiry}
            onEdit={() => navigate(`${LISTING_PATH}/${enquiry.id}/edit`, { state: location.state })}
            onConvert={() => setConvertOpen(true)}
            onViewOrder={
              enquiry.convertedOrderId
                ? () => navigate(`${ORDER_LISTING_PATH}/${enquiry.convertedOrderId}`, { state: location.state })
                : undefined
            }
            canConvert={orderEnquiryService.isEligibleForConversion(enquiry)}
          />
        }
      >
        <BaseCard sx={{ p: 2 }}>
          <OverviewTab enquiry={enquiry} />
        </BaseCard>
      </AdminDetailShell>

      <ConvertToOrderDialog
        open={convertOpen}
        enquiry={enquiry}
        onClose={() => setConvertOpen(false)}
        onConfirm={handleConvert}
      />
    </>
  )
}
