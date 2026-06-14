import { Box, Typography } from '@mui/material'
import { PencilLine, Power, PowerOff } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import { taxMasterService } from '@/shared/services/taxMasterService'
import type { SacCodeMaster } from '@/shared/types/sacCodeMaster'
import { MasterAudienceTags } from '../../components/MasterAudienceTags'
import { toApplicabilityTagItems } from '../../config/masterAudienceTagConfig'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'

interface ColumnHandlers {
  onOpenEdit: (row: SacCodeMaster) => void
  onToggleStatus: (row: SacCodeMaster) => void
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

export function buildSacCodeColumns({
  onOpenEdit,
  onToggleStatus,
}: ColumnHandlers): Column<SacCodeMaster>[] {
  return [
    {
      key: 'sacCode',
      label: 'SAC Code',
      widthSize: adminListingColumnWidthSize('code'),
      searchable: true,
    },
    {
      key: 'sacTitle',
      label: 'SAC Title',
      widthSize: adminListingColumnWidthSize('name'),
      searchable: true,
    },
    {
      key: 'category',
      label: 'Category',
      widthSize: adminListingColumnWidthSize('service'),
    },
    {
      key: 'defaultGst',
      label: 'Default GST %',
      widthSize: adminListingColumnWidthSize('count'),
      render: (_, row) => {
        const pct = taxMasterService.getGstPercent(row.defaultGstRateId)
        return pct != null ? `${pct}%` : '—'
      },
    },
    {
      key: 'defaultTds',
      label: 'Applicable TDS %',
      widthSize: adminListingColumnWidthSize('count'),
      render: (_, row) => {
        const pct = taxMasterService.getTdsPercent(row.defaultTdsSectionId)
        return pct != null ? `${pct}%` : '—'
      },
    },
    {
      key: 'applicableFor',
      label: 'Applicable For',
      widthSize: adminListingColumnWidthSize('description'),
      render: (_, row) => (
        <MasterAudienceTags items={toApplicabilityTagItems(row.applicableFor)} />
      ),
    },
    {
      key: 'status',
      label: 'Status',
      widthSize: adminListingColumnWidthSize('status'),
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
      render: (_, row) => <AuditCell name={row.createdBy} date={row.createdAt} />,
    },
    {
      key: 'updatedAudit',
      label: 'Updated By / Date',
      widthSize: adminListingColumnWidthSize('audit'),
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
