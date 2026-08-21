import { Box, Stack, Typography } from '@mui/material'
import { PencilLine } from 'lucide-react'
import { BaseCard, Badge, Button } from '@/design-system/UIComponents'
import type { Order } from '@/shared/types/order'
import { orderStatusColor, orderStatusLabel } from '../config/orderStatusConfig'
import { formatOrderDate } from '../utils/orderListingUtils'

interface OrderDetailSummaryProps {
  order: Order
  onEdit: () => void
}

export function OrderDetailSummary({ order, onEdit }: OrderDetailSummaryProps) {
  return (
    <BaseCard>
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction={{ xs: 'column', md: 'row' }} justifyContent="space-between" spacing={2}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {order.customer.companyOrCustomerName}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {order.orderNumber} · Order date {formatOrderDate(order.orderDate)}
              </Typography>
            </Box>
            <Stack
              direction="row"
              spacing={0.75}
              useFlexGap
              sx={{ flexWrap: 'wrap', alignItems: 'center', alignSelf: { xs: 'stretch', md: 'flex-start' } }}
            >
              <Button
                label="Edit Order"
                size="sm"
                variant="neutral"
                startIcon={<PencilLine size={14} />}
                onClick={onEdit}
              />
            </Stack>
          </Stack>

          <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: 'wrap', alignItems: 'center' }}>
            <Badge label={orderStatusLabel[order.status]} color={orderStatusColor[order.status]} size="sm" />
          </Stack>
        </Stack>
      </Box>
    </BaseCard>
  )
}
