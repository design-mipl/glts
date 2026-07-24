import { Box, Typography } from '@mui/material'
import { Eye, PencilLine, Power, PowerOff } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import type { CountryGroupMaster } from '@/shared/types/countryGroupMaster'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'
import { formatCountryGroupCountriesPreview } from '../utils/countryGroupListingUtils'

interface ColumnHandlers {
  onOpenView: (row: CountryGroupMaster) => void
  onOpenEdit: (row: CountryGroupMaster) => void
  onToggleStatus: (row: CountryGroupMaster) => void
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

export function buildCountryGroupColumns({
  onOpenView,
  onOpenEdit,
  onToggleStatus,
}: ColumnHandlers): Column<CountryGroupMaster>[] {
  return [
    {
      key: 'name',
      label: 'Group Name',
      widthSize: adminListingColumnWidthSize('name'),
      sortable: true,
      filterable: false,
      searchable: true,
    },
    {
      key: 'countries',
      label: 'Countries',
      widthSize: adminListingColumnWidthSize('description'),
      sortable: false,
      filterable: false,
      searchable: true,
      render: (_, row) => {
        const preview = formatCountryGroupCountriesPreview(row.countryIds)
        const full = formatCountryGroupCountriesPreview(row.countryIds, 99)
        return (
          <Typography
            variant="body2"
            sx={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            title={full}
          >
            {preview}
          </Typography>
        )
      },
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
      label: 'Created By / Date',
      widthSize: adminListingColumnWidthSize('audit'),
      sortable: true,
      filterable: false,
      render: (_, row) => <AuditCell name={row.createdBy} date={row.createdAt} />,
    },
    {
      key: 'updatedAudit',
      label: 'Updated By / Date',
      widthSize: adminListingColumnWidthSize('audit'),
      sortable: true,
      filterable: false,
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
          { label: 'View', icon: <Eye size={14} />, onClick: () => onOpenView(row) },
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
