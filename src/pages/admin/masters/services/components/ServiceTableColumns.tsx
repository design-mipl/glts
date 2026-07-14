import { Box, Typography } from '@mui/material'
import { PencilLine, Power, PowerOff } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import { adminListingColumnWidthSize } from '@/pages/admin/components/listing'
import { taxMasterService } from '@/shared/services/taxMasterService'
import type { ServiceMaster } from '@/shared/types/serviceMaster'
import { MasterAudienceTags } from '../../components/MasterAudienceTags'
import { toApplicabilityTagItems } from '../../config/masterAudienceTagConfig'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'
import { formatServicePrice, getServiceSacLabel } from '../utils/serviceListingUtils'

interface ColumnHandlers {
  onOpenEdit: (row: ServiceMaster) => void
  onToggleStatus: (row: ServiceMaster) => void
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

export function buildServiceColumns({
  onOpenEdit,
  onToggleStatus,
}: ColumnHandlers): Column<ServiceMaster>[] {
  return [
    {
      key: 'serviceName',
      label: 'Fee Name',
      widthSize: adminListingColumnWidthSize('service'),
      sortable: true,
      filterable: false,
      searchable: true,
    },
    {
      key: 'defaultPrice',
      label: 'Default Price',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      filterable: false,
      render: (_, row) => formatServicePrice(row),
    },
    {
      key: 'applicableFor',
      label: 'Applicable For',
      widthSize: adminListingColumnWidthSize('description'),
      sortable: false,
      filterable: true,
      render: (_, row) => (
        <MasterAudienceTags items={toApplicabilityTagItems(row.applicableFor)} />
      ),
    },
    {
      key: 'mappedSacCode',
      label: 'Mapped SAC Code',
      widthSize: adminListingColumnWidthSize('code'),
      sortable: true,
      filterable: false,
      render: (_, row) => (
        <span
          style={{
            display: 'block',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: 200,
          }}
          title={getServiceSacLabel(row)}
        >
          {getServiceSacLabel(row)}
        </span>
      ),
    },
    {
      key: 'gstRate',
      label: 'GST Rate',
      widthSize: adminListingColumnWidthSize('count'),
      sortable: true,
      filterable: true,
      render: (_, row) => taxMasterService.getGstLabel(row.gstRateId) || '—',
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
