import { Box, Typography } from '@mui/material'
import { Eye, PencilLine, Power, PowerOff } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import { masterStatusColor, masterStatusLabel } from '@/pages/admin/masters/config/masterStatusConfig'
import { formatMasterDate } from '@/pages/admin/masters/utils/masterListingUtils'
import { departmentService } from '@/shared/services/departmentService'
import type { DepartmentMaster } from '@/shared/types/departmentMaster'

interface ColumnHandlers {
  onOpenDetail: (row: DepartmentMaster) => void
  onOpenEdit: (row: DepartmentMaster) => void
  onToggleStatus: (row: DepartmentMaster) => void
}

function AuditCell({ name, date }: { name: string; date: string }) {
  return (
    <Box>
      <Typography variant="body2" fontWeight={600} sx={{ fontSize: 13 }}>
        {name}
      </Typography>
      <Typography variant="caption" color="text.secondary" sx={{ fontSize: 11 }}>
        {formatMasterDate(date)}
      </Typography>
    </Box>
  )
}

export function buildDepartmentColumns({
  onOpenDetail,
  onOpenEdit,
  onToggleStatus,
}: ColumnHandlers): Column<DepartmentMaster>[] {
  return [
    {
      key: 'name',
      label: 'Department Name',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      filterable: true,
      searchable: true,
    },
    {
      key: 'description',
      label: 'Description',
      widthSize: adminListingColumnWidthSize('description'),
      sortable: false,
      filterable: false,
      render: (_, row) => (
        <Typography
          variant="body2"
          sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
          title={row.description}
        >
          {row.description || '—'}
        </Typography>
      ),
    },
    {
      key: 'totalUsers',
      label: 'Total Users',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      filterable: false,
      render: (_, row) => departmentService.countUsers(row.id),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
      sortable: false,
      filterable: true,
      render: (_, row) => (
        <Badge
          label={masterStatusLabel[row.status]}
          color={masterStatusColor[row.status]}
          size="sm"
        />
      ),
    },
    {
      key: 'createdAudit',
      label: 'Created By',
      widthSize: adminListingColumnWidthSize('audit'),
      sortable: true,
      filterable: true,
      render: (_, row) => <AuditCell name={row.createdBy} date={row.createdAt} />,
    },
    {
      key: 'updatedAudit',
      label: 'Updated By',
      widthSize: adminListingColumnWidthSize('audit'),
      sortable: true,
      filterable: true,
      render: (_, row) => <AuditCell name={row.updatedBy} date={row.updatedAt} />,
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
        const isActive = row.status === 'active'
        const actions: RowAction[] = [
          { label: 'View Detail', icon: <Eye size={14} />, onClick: () => onOpenDetail(row) },
          { label: 'Edit', icon: <PencilLine size={14} />, onClick: () => onOpenEdit(row) },
          {
            label: isActive ? 'Deactivate' : 'Activate',
            icon: isActive ? <PowerOff size={14} /> : <Power size={14} />,
            onClick: () => onToggleStatus(row),
          },
        ]
        return <RowActions row={row} actions={actions} />
      },
    },
  ]
}
