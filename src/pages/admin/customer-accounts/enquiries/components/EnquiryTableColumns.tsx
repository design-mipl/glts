import { Box, Typography } from '@mui/material'
import { CalendarClock, Eye, PencilLine, RefreshCcw, UserCog } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { EnquiryRecord } from '@/shared/types/enquiry'
import {
  enquiryCustomerTypeColor,
  enquiryInquirySourceColor,
  formatEnquiryInquirySource,
} from '../config/enquiryFormConfig'
import { formatEnquiryContactSecondary, formatEnquiryDate } from '../utils/enquiryListingUtils'
import {
  enquiryStatusColor,
  enquiryStatusLabel,
} from '../config/enquiryStatusConfig'

interface ColumnHandlers {
  onOpenDetail: (row: EnquiryRecord) => void
  onOpenEdit: (row: EnquiryRecord) => void
  onOpenAssignment: (row: EnquiryRecord) => void
  onOpenStatus: (row: EnquiryRecord) => void
  onOpenFollowup: (row: EnquiryRecord) => void
}

export function buildEnquiryColumns({
  onOpenDetail,
  onOpenEdit,
  onOpenAssignment,
  onOpenStatus,
  onOpenFollowup,
}: ColumnHandlers): Column<EnquiryRecord>[] {
  return [
    {
      key: 'id',
      label: 'Enquiry ID',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      searchable: true,
      hideable: false,
    },
    {
      key: 'enquiryDate',
      label: 'Enquiry Date',
      widthSize: adminListingColumnWidthSize('date'),
      sortable: true,
      render: (_, row) => formatEnquiryDate(row.enquiryDate),
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
      widthSize: adminListingColumnWidthSize('count'),
      filterable: true,
      render: (_, row) => (
        <Badge label={row.customer.customerType} color={enquiryCustomerTypeColor[row.customer.customerType]} size="sm" />
      ),
    },
    {
      key: 'contactPerson',
      label: 'Contact person',
      widthSize: adminListingColumnWidthSize('stackedAssignment'),
      searchable: true,
      render: (_, row) => (
        <Box>
          <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
            {row.customer.contactPersonName}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
            {formatEnquiryContactSecondary(row.customer)}
          </Typography>
        </Box>
      ),
    },
    {
      key: 'inquirySource',
      label: 'Enquiry Source',
      widthSize: adminListingColumnWidthSize('vendor'),
      filterable: true,
      render: (_, row) => (
        <Badge
          label={formatEnquiryInquirySource(row.salesDetails.inquirySource)}
          color={enquiryInquirySourceColor[row.salesDetails.inquirySource]}
          size="sm"
        />
      ),
    },
    {
      key: 'countryRequirement',
      label: 'Country',
      widthSize: adminListingColumnWidthSize('country'),
      render: (_, row) => row.visaRequirement.countries.join(', '),
    },
    {
      key: 'visaType',
      label: 'Visa Type',
      widthSize: adminListingColumnWidthSize('service'),
      render: (_, row) => row.visaRequirement.visaType,
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      filterable: true,
      render: (_, row) => (
        <Badge label={enquiryStatusLabel[row.status]} color={enquiryStatusColor[row.status]} size="sm" />
      ),
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
          { label: 'Edit Enquiry', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
          { label: 'Assign Team', icon: <UserCog size={14} />, onClick: () => onOpenAssignment(row) },
          { label: 'Update Status', icon: <RefreshCcw size={14} />, onClick: () => onOpenStatus(row) },
          { label: 'Add Follow-up', icon: <CalendarClock size={14} />, onClick: () => onOpenFollowup(row) },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
