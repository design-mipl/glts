import { CalendarClock, Eye, PencilLine, RefreshCcw, UserCog } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import type { EnquiryRecord } from '@/shared/types/enquiry'
import {
  enquiryPriorityColor,
  enquiryPriorityLabel,
  enquiryStatusColor,
  enquiryStatusLabel,
} from '../config/enquiryStatusConfig'

interface ColumnHandlers {
  onOpenDetail: (row: EnquiryRecord) => void
  onOpenAssignment: (row: EnquiryRecord) => void
  onOpenStatus: (row: EnquiryRecord) => void
}

export function buildEnquiryColumns({
  onOpenDetail,
  onOpenAssignment,
  onOpenStatus,
}: ColumnHandlers): Column<EnquiryRecord>[] {
  return [
    { key: 'id', label: 'Enquiry ID', sortable: true, searchable: true, hideable: false, minWidth: 120 },
    { key: 'enquiryDate', label: 'Enquiry Date', sortable: true, minWidth: 140 },
    {
      key: 'companyOrCustomerName',
      label: 'Company / Customer Name',
      minWidth: 220,
      render: (_, row) => row.customer.companyOrCustomerName,
    },
    {
      key: 'contactPerson',
      label: 'Contact Person',
      minWidth: 180,
      render: (_, row) => row.customer.contactPersonName,
    },
    {
      key: 'customerType',
      label: 'Customer Type',
      filterable: true,
      render: (_, row) => row.customer.customerType,
    },
    {
      key: 'countryRequirement',
      label: 'Country Requirement',
      minWidth: 160,
      render: (_, row) => row.visaRequirement.countries.join(', '),
    },
    {
      key: 'visaType',
      label: 'Visa Type',
      minWidth: 150,
      render: (_, row) => row.visaRequirement.visaType,
    },
    {
      key: 'numberOfApplicants',
      label: 'No. Applicants',
      align: 'right',
      render: (_, row) => row.visaRequirement.numberOfApplicants,
    },
    {
      key: 'marineRequirement',
      label: 'Marine',
      render: (_, row) => (row.visaRequirement.marineRequirement ? 'Yes' : 'No'),
    },
    {
      key: 'assignedTeam',
      label: 'Assigned Team',
      render: (_, row) => row.assignment.assignedTeam ?? '--',
    },
    {
      key: 'assignedUser',
      label: 'Assigned User',
      render: (_, row) => row.assignment.assignedUser ?? '--',
    },
    {
      key: 'priority',
      label: 'Priority',
      render: (_, row) => (
        <Badge
          label={enquiryPriorityLabel[row.salesDetails.priorityLevel]}
          color={enquiryPriorityColor[row.salesDetails.priorityLevel]}
          size="sm"
        />
      ),
    },
    {
      key: 'nextFollowupDate',
      label: 'Next Follow-up',
      render: (_, row) => (row.nextFollowupDate ? new Date(row.nextFollowupDate).toLocaleDateString() : '--'),
    },
    {
      key: 'status',
      label: 'Status',
      render: (_, row) => (
        <Badge label={enquiryStatusLabel[row.status]} color={enquiryStatusColor[row.status]} size="sm" />
      ),
    },
    {
      key: 'lastActivity',
      label: 'Last Activity',
      render: (_, row) => new Date(row.lastActivity).toLocaleString(),
    },
    { key: 'createdBy', label: 'Created By' },
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
          { label: 'Edit Enquiry', icon: <PencilLine size={14} />, onClick: () => onOpenDetail(row) },
          { label: 'Assign Team', icon: <UserCog size={14} />, onClick: () => onOpenAssignment(row) },
          { label: 'Update Status', icon: <RefreshCcw size={14} />, onClick: () => onOpenStatus(row) },
          { label: 'Add Follow-up', icon: <CalendarClock size={14} />, onClick: () => onOpenDetail(row) },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
