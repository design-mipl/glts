import { CalendarClock, Eye, PencilLine, RefreshCcw, UserCog } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'
import { formatEnquiryInquirySource } from '../config/enquiryFormConfig'
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
    { key: 'id', label: 'Enquiry ID', sortable: true, searchable: true, hideable: false, minWidth: 120 },
    { key: 'enquiryDate', label: 'Enquiry Date', sortable: true, minWidth: 130 },
    {
      key: 'companyOrCustomerName',
      label: 'Company / Customer',
      minWidth: 200,
      searchable: true,
      render: (_, row) => row.customer.companyOrCustomerName,
    },
    {
      key: 'customerType',
      label: 'Customer Type',
      filterable: true,
      minWidth: 120,
      render: (_, row) => row.customer.customerType,
    },
    {
      key: 'contactPerson',
      label: 'Contact Person',
      minWidth: 160,
      searchable: true,
      render: (_, row) => row.customer.contactPersonName,
    },
    {
      key: 'contactNumber',
      label: 'Contact',
      minWidth: 140,
      render: (_, row) => row.customer.contactNumber,
    },
    {
      key: 'emailAddress',
      label: 'Email',
      minWidth: 180,
      searchable: true,
      render: (_, row) => row.customer.emailAddress,
    },
    {
      key: 'inquirySource',
      label: 'Inquiry Source',
      filterable: true,
      minWidth: 140,
      render: (_, row) => formatEnquiryInquirySource(row.salesDetails.inquirySource),
    },
    {
      key: 'countryRequirement',
      label: 'Country',
      minWidth: 140,
      render: (_, row) => row.visaRequirement.countries.join(', '),
    },
    {
      key: 'visaType',
      label: 'Visa Type',
      minWidth: 150,
      render: (_, row) => row.visaRequirement.visaType,
    },
    {
      key: 'status',
      label: 'Status',
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
      width: 60,
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
