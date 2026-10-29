import { Box, Typography } from '@mui/material'
import { Eye, PencilLine, ShoppingCart } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import { ORDER_ENQUIRY_SERVICE_LABEL } from '@/shared/services/orderEnquiryService'
import type { OrderEnquiry } from '@/shared/types/orderEnquiry'
import {
  orderEnquirySourceLabel,
  orderEnquiryStatusColor,
  orderEnquiryStatusLabel,
} from '../config/orderEnquiryStatusConfig'
import { formatOrderEnquiryDate } from '../utils/orderEnquiryListingUtils'

interface ColumnHandlers {
  onOpenDetail: (row: OrderEnquiry) => void
  onOpenEdit: (row: OrderEnquiry) => void
  onConvert?: (row: OrderEnquiry) => void
}

export function buildOrderEnquiryColumns({
  onOpenDetail,
  onOpenEdit,
  onConvert,
}: ColumnHandlers): Column<OrderEnquiry>[] {
  return [
    {
      key: 'enquiryNumber',
      label: 'Enquiry',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      hideable: false,
      render: (_, row) => (
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {row.enquiryNumber}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontSize: 11 }}>
            {formatOrderEnquiryDate(row.enquiryDate)}
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
      key: 'contactPerson',
      label: 'Contact',
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
      key: 'service',
      label: 'Service',
      widthSize: adminListingColumnWidthSize('country'),
      filterable: true,
      render: (_, row) => ORDER_ENQUIRY_SERVICE_LABEL[row.service],
    },
    {
      key: 'source',
      label: 'Source',
      widthSize: adminListingColumnWidthSize('country'),
      filterable: true,
      render: (_, row) => (
        <Badge
          label={orderEnquirySourceLabel[row.source]}
          color={row.source === 'website' ? 'info' : 'neutral'}
          size="sm"
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('country'),
      filterable: true,
      render: (_, row) => (
        <Badge label={orderEnquiryStatusLabel[row.status]} color={orderEnquiryStatusColor[row.status]} size="sm" />
      ),
    },
    {
      key: 'actions',
      label: '',
      width: 56,
      hideable: false,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_, row) => {
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
          { label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
        ]
        if (onConvert && row.status !== 'converted') {
          actions.push({
            label: 'Open order form',
            icon: <ShoppingCart size={14} />,
            onClick: () => onConvert(row),
          })
        }
        return <RowActions actions={actions} />
      },
    },
  ]
}
