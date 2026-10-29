import { Box, Typography } from '@mui/material'
import { Eye, PencilLine } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { Order } from '@/shared/types/order'
import { formatInr } from '@/shared/utils/invoiceCalculations'
import { orderStatusColor, orderStatusLabel } from '../config/orderStatusConfig'
import { formatOrderDate } from '../utils/orderListingUtils'

interface ColumnHandlers {
  onOpenDetail: (row: Order) => void
  onOpenEdit: (row: Order) => void
}

const orderCustomerTypeLabel: Record<Order['customer']['customerType'], string> = {
  retail: 'Retail',
  corporate: 'Corporate',
  marine: 'Marine',
}

export function buildOrderColumns({ onOpenDetail, onOpenEdit }: ColumnHandlers): Column<Order>[] {
  return [
    {
      key: 'orderNumber',
      label: 'Order',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      hideable: false,
      render: (_, row) => (
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {row.orderNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
            {formatOrderDate(row.orderDate)}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'companyOrCustomerName',
      label: 'Company / Customer',
      widthSize: adminListingColumnWidthSize('company'),
      searchable: true,
      render: (_, row) => row.customer.companyOrCustomerName,
    },
    {
      key: 'customerType',
      label: 'Customer Type',
      widthSize: adminListingColumnWidthSize('country'),
      filterable: true,
      render: (_, row) => <Badge label={orderCustomerTypeLabel[row.customer.customerType]} color="info" size="sm" />,
    },
    {
      key: 'contactPerson',
      label: 'Contact person',
      widthSize: 'md',
      searchable: true,
      render: (_, row) => (
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {row.customer.contactPersonName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
            {row.customer.contactNumber}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'lineItemCount',
      label: 'Line Items',
      widthSize: adminListingColumnWidthSize('country'),
      align: 'center',
      render: (_, row) => row.lineItems.length,
    },
    {
      key: 'grandTotal',
      label: 'Grand Total',
      widthSize: adminListingColumnWidthSize('country'),
      align: 'right',
      render: (_, row) => formatInr(row.totals.grandTotal),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
      render: (_, row) => <Badge label={orderStatusLabel[row.status]} color={orderStatusColor[row.status]} size="sm" />,
    },
    {
      key: 'actions',
      label: '',
      sortable: false,
      filterable: false,
      searchable: false,
      hideable: false,
      align: 'center',
      render: (_, row) => {
        const actions: RowAction[] = [
          { label: 'Open Detail', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
          { label: 'Edit Order', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
