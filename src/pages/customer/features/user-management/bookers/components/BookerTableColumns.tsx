import { Eye, KeyRound, Mail, PencilLine, Trash2, UserCheck, UserX } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { RowActions } from '@/design-system/UIComponents'
import type { BookerUser } from '@/shared/types/bookerUser'
import { CustomerStatusChip } from '@/pages/customer/features/shared/components/CustomerPrimitives'
import {
  formatManagedUserDate,
  managedUserStatusLabel,
  managedUserStatusTone,
} from '../../shared/utils/managedUserFormatters'

interface ColumnHandlers {
  onOpenDetail: (row: BookerUser) => void
  onOpenEdit: (row: BookerUser) => void
  onSendLogin: (row: BookerUser) => void
  onChangePassword: (row: BookerUser) => void
  onToggleStatus: (row: BookerUser) => void
  onDelete: (row: BookerUser) => void
}

export function buildBookerColumns({
  onOpenDetail,
  onOpenEdit,
  onSendLogin,
  onChangePassword,
  onToggleStatus,
  onDelete,
}: ColumnHandlers): Column<BookerUser>[] {
  return [
    { key: 'name', label: 'Booker name', sortable: true, searchable: true, hideable: false, minWidth: 160 },
    { key: 'email', label: 'Email', sortable: true, searchable: true, minWidth: 180 },
    { key: 'mobile', label: 'Mobile number', sortable: true, searchable: true, minWidth: 130 },
    { key: 'location', label: 'Location', sortable: true, filterable: true, minWidth: 120 },
    { key: 'createdBy', label: 'Created by', sortable: true, filterable: true, minWidth: 130 },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      minWidth: 100,
      render: (_, row) => (
        <CustomerStatusChip
          label={managedUserStatusLabel[row.status]}
          tone={managedUserStatusTone[row.status]}
        />
      ),
    },
    {
      key: 'lastLogin',
      label: 'Last login',
      sortable: true,
      minWidth: 130,
      render: (_, row) => row.lastLogin ?? '--',
    },
    {
      key: 'lastUpdated',
      label: 'Last updated',
      sortable: true,
      minWidth: 120,
      render: (_, row) => formatManagedUserDate(row.updatedAt),
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
        const isActive = row.status === 'active'
        const actions: RowAction[] = [
          { label: 'View', icon: <Eye size={16} />, onClick: () => onOpenDetail(row) },
          { label: 'Edit', icon: <PencilLine size={16} />, onClick: () => onOpenEdit(row) },
          {
            label: 'Send login email',
            icon: <Mail size={16} />,
            onClick: () => onSendLogin(row),
            disabled: !isActive,
          },
          {
            label: 'Change password',
            icon: <KeyRound size={16} />,
            onClick: () => onChangePassword(row),
          },
        ]

        if (isActive) {
          actions.push({
            label: 'Deactivate user',
            icon: <UserX size={16} />,
            onClick: () => onToggleStatus(row),
            divider: true,
          })
        } else {
          actions.push({
            label: 'Activate user',
            icon: <UserCheck size={16} />,
            onClick: () => onToggleStatus(row),
            divider: true,
          })
        }

        actions.push({
          label: 'Delete / archive',
          icon: <Trash2 size={16} />,
          onClick: () => onDelete(row),
          variant: 'destructive',
        })

        return <RowActions actions={actions} row={row} />
      },
    },
  ]
}
