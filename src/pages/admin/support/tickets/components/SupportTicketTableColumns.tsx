import { Eye, MessageSquare, UserCog, RefreshCcw } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { supportTicketService } from '@/shared/services/supportTicketService'
import type { SupportTicket } from '@/shared/types/supportTicket'
import {
  supportTicketPriorityColor,
  supportTicketPriorityLabel,
  supportTicketStatusColor,
  supportTicketStatusLabel,
} from '../config/supportTicketStatusConfig'
import { formatSupportTicketDate } from '../utils/supportTicketListingUtils'

interface ColumnHandlers {
  onOpenDetail: (row: SupportTicket) => void
  onOpenAssign: (row: SupportTicket) => void
  onOpenStatus: (row: SupportTicket) => void
  onOpenConversation: (row: SupportTicket) => void
}

export function buildSupportTicketColumns({
  onOpenDetail,
  onOpenAssign,
  onOpenStatus,
  onOpenConversation,
}: ColumnHandlers): Column<SupportTicket>[] {
  return [
    {
      key: 'ticketNumber',
      label: 'Ticket',
      widthSize: 'md',
      sortable: true,
      searchable: true,
      hideable: false,
    },
    {
      key: 'subject',
      label: 'Subject',
      widthSize: 'lg',
      sortable: true,
      searchable: true,
    },
    {
      key: 'customer',
      label: 'Customer',
      widthSize: 'md',
      sortable: true,
      searchable: true,
      render: (_, row) => row.customerName,
    },
    {
      key: 'category',
      label: 'Category',
      widthSize: 'md',
      filterable: true,
      render: (_, row) => supportTicketService.getCategoryLabel(row.category),
    },
    {
      key: 'priority',
      label: 'Priority',
      widthSize: 'sm',
      filterable: true,
      sortable: true,
      render: (_, row) => (
        <Badge
          label={supportTicketPriorityLabel[row.priority]}
          color={supportTicketPriorityColor[row.priority]}
          size="sm"
        />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: 'md',
      filterable: true,
      sortable: true,
      render: (_, row) => (
        <Badge
          label={supportTicketStatusLabel[row.status]}
          color={supportTicketStatusColor[row.status]}
          size="sm"
        />
      ),
    },
    {
      key: 'assignee',
      label: 'Assignee',
      widthSize: 'md',
      filterable: true,
      render: (_, row) => row.assignedExecutive ?? 'Unassigned',
    },
    {
      key: 'updatedAt',
      label: 'Updated',
      widthSize: 'sm',
      sortable: true,
      render: (_, row) => formatSupportTicketDate(row.updatedAt),
    },
    {
      key: 'actions',
      label: '',
      hideable: false,
      width: 56,
      sortable: false,
      filterable: false,
      searchable: false,
      render: (_, row) => {
        const actions: RowAction[] = [
          {
            label: 'View ticket',
            icon: <Eye size={14} />,
            onClick: () => onOpenDetail(row),
          },
          {
            label: 'Conversation',
            icon: <MessageSquare size={14} />,
            onClick: () => onOpenConversation(row),
          },
          {
            label: 'Assign',
            icon: <UserCog size={14} />,
            onClick: () => onOpenAssign(row),
          },
          {
            label: 'Update status',
            icon: <RefreshCcw size={14} />,
            onClick: () => onOpenStatus(row),
          },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
