import { Box, Typography } from '@mui/material'
import { PencilLine, Power, PowerOff } from 'lucide-react'
import type { Column, RowAction } from '@/design-system/UIComponents'
import { Badge, RowActions } from '@/design-system/UIComponents'
import type { ServiceMaster } from '@/shared/types/serviceMaster'
import { MasterAudienceTags } from '../../components/MasterAudienceTags'
import { toApplicabilityTagItems } from '../../config/masterAudienceTagConfig'
import { masterStatusColor, masterStatusLabel } from '../../config/masterStatusConfig'
import { formatMasterDate } from '../../utils/masterListingUtils'
import { serviceTypeLabel } from '../config/serviceTypeConfig'
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
    { key: 'serviceName', label: 'Service Name', minWidth: 200, searchable: true },
    {
      key: 'serviceType',
      label: 'Service Type',
      width: 110,
      render: (_, row) => (
        <Badge label={serviceTypeLabel[row.serviceType]} color="neutral" size="sm" />
      ),
    },
    {
      key: 'defaultPrice',
      label: 'Default Price',
      width: 120,
      render: (_, row) => formatServicePrice(row),
    },
    {
      key: 'applicableFor',
      label: 'Applicable For',
      minWidth: 200,
      render: (_, row) => (
        <MasterAudienceTags items={toApplicabilityTagItems(row.applicableFor)} />
      ),
    },
    {
      key: 'mappedSacCode',
      label: 'Mapped SAC Code',
      minWidth: 160,
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
      key: 'status',
      label: 'Status',
      width: 100,
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
      width: 150,
      render: (_, row) => <AuditCell name={row.createdBy} date={row.createdAt} />,
    },
    {
      key: 'updatedAudit',
      label: 'Updated By / Date',
      width: 150,
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
      width: 60,
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
