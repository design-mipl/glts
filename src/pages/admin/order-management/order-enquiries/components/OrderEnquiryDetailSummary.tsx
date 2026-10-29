import { Box, Stack, Typography } from '@mui/material'
import { PencilLine, ShoppingCart } from 'lucide-react'
import { Badge, BaseCard, Button } from '@/design-system/UIComponents'
import { ORDER_ENQUIRY_SERVICE_LABEL } from '@/shared/services/orderEnquiryService'
import type { OrderEnquiry } from '@/shared/types/orderEnquiry'
import {
  orderEnquirySourceLabel,
  orderEnquiryStatusColor,
  orderEnquiryStatusLabel,
} from '../config/orderEnquiryStatusConfig'
import { formatOrderEnquiryDate } from '../utils/orderEnquiryListingUtils'

interface OrderEnquiryDetailSummaryProps {
  enquiry: OrderEnquiry
  onEdit?: () => void
  onConvert?: () => void
  onViewOrder?: () => void
  canConvert?: boolean
}

export function OrderEnquiryDetailSummary({
  enquiry,
  onEdit,
  onConvert,
  onViewOrder,
  canConvert,
}: OrderEnquiryDetailSummaryProps) {
  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {enquiry.customer.companyOrCustomerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {enquiry.enquiryNumber} · {formatOrderEnquiryDate(enquiry.enquiryDate)}
              </Typography>
            </Box>
            <Stack direction="row" spacing={0.75} useFlexGap sx={{ flexWrap: 'wrap' }}>
              {onEdit ? (
                <Button
                  label="Edit"
                  size="sm"
                  variant="neutral"
                  startIcon={<PencilLine size={14} />}
                  onClick={onEdit}
                />
              ) : null}
              {canConvert && onConvert ? (
                <Button
                  label="Open order form"
                  size="sm"
                  startIcon={<ShoppingCart size={14} />}
                  onClick={onConvert}
                />
              ) : null}
              {enquiry.convertedOrderId && onViewOrder ? (
                <Button label="View order" size="sm" variant="outlined" onClick={onViewOrder} />
              ) : null}
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge label={orderEnquiryStatusLabel[enquiry.status]} color={orderEnquiryStatusColor[enquiry.status]} size="sm" />
            <Badge
              label={orderEnquirySourceLabel[enquiry.source]}
              color={enquiry.source === 'website' ? 'info' : 'neutral'}
              size="sm"
            />
            <Badge label={ORDER_ENQUIRY_SERVICE_LABEL[enquiry.service]} color="neutral" size="sm" />
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
